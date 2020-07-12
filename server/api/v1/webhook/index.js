const moment = require('moment');
const { Op } = require('sequelize');
const i18n = require('../../../i18n');
const Router = require('../../../lib/router');
const rideService = require('../../../lib/ride');
const { Ride, User, Notification } = require('../../../models');
const sendNotification = require('../../../lib/push-notifications');
const settingsService = require('../../../lib/settings');

const router = Router();

const cancelPush = async (userId, rideId, messageType = 'futureRideCanceled') => {
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  const notificationSent = await Notification.findOne({ where: { userId, type: messageType } });
  if (notificationSent) {
    return false;
  }

  Notification.create({ userId, rideId, type: messageType });
  await sendNotification(
    [user.pushUserId],
    'futureRideCanceled',
    { en: i18n.t(`pushNotifications.${messageType}.text`) },
    { en: i18n.t(`pushNotifications.${messageType}.heading`) },
    { ttl: 60 * 30, data: { type: messageType } },
  );
};

router.put('/:rideId', async (req, res) => {
  const ride = await Ride.findOne({
    where: {
      id: req.params.rideId,
    },
  });

  if (!ride) {
    return res.json({ error: 'ride not found' });
  }

  const stopPoints = req.body.ride.stopPoints;

  const isReminderShouldBeSent = async () => {
    const { value: arriveReminderMin } = await settingsService.getSettingByKeyFromDb('ARRIVE_REMINDER_MIN');
    const etaTime = moment(stopPoints[0].eta);
    if (!etaTime) {
      return false;
    }
    const diff = etaTime.diff(moment(), 'minutes');

    return diff <= arriveReminderMin;
  };

  if (stopPoints && !ride.arrivingPush && req.body.ride.state === 'active') {
    const shouldRemind = await isReminderShouldBeSent();

    if (stopPoints[0].completed_at === null && shouldRemind) {
      try {
        const updateRidePush = await Ride.update({ arrivingPush: moment().format() }, {
          where: {
            id: ride.id,
            arrivingPush: null,
          },
        });

        if (updateRidePush[0]) {
          const user = await User.findOne({
            where: {
              id: ride.userId,
            },
          });
          const { value: arriveReminderMin } = await settingsService.getSettingByKeyFromDb('ARRIVE_REMINDER_MIN');
          await sendNotification(
            [user.pushUserId],
            'driverArriving',
            { en: `${i18n.t('pushNotifications.driverArriving', { etaMinutes: arriveReminderMin, stopPoint: stopPoints[0].description })}` },
            { en: i18n.t('pushNotifications.driverArrivingHeading', { etaMinutes: arriveReminderMin }) },
            { ttl: 60 * 30 },
          );
        }
      } catch (e) {
        await Ride.update({ arrivingPush: null }, {
          where: {
            id: ride.id,
          },
        });

        console.log('Error sending push', e);
      }
    }
  }

  if (req.body.ride.state === 'active' || req.body.ride.state === 'dispatched') {
    if (ride.state === 'pending') {
      const user = await User.findOne({
        where: {
          id: ride.userId,
        },
      });

      await sendNotification(
        [user.pushUserId],
        'activatingFutureRide',
        { en: i18n.t('pushNotifications.activatingFutureRide', { stopPoint: stopPoints[0].description }) },
        { en: i18n.t('pushNotifications.activatingFutureRideHeading') },
        { ttl: 60 * 30, data: { type: 'activatingFutureRide' } },
      );
    }
    ride.state = 'active';
    await ride.save();
  } else if (req.body.ride.state === 'completed') {
    ride.state = 'completed';
    await ride.save();
  } else if (req.body.ride.state === 'failed') {
    if (ride.state !== 'canceled') {
      cancelPush(ride.userId, ride.id, 'failureRide');
    }
    ride.state = 'canceled';
    await ride.save();
  } else if (req.body.ride.state === 'cancelled') {
    ride.state = 'canceled';
    await ride.save();
    const currentRide = ride.get();
    if (req.body.ride.cancelledBy !== 'locomotion' && !currentRide.scheduledTo) {
      if (isReminderShouldBeSent()) {
        cancelPush(ride.userId, ride.id, 'findingNewDriver');
      }
      await rideService.create({
        userId: currentRide.userId,
        pickupAddress: currentRide.pickupAddress,
        pickupLat: currentRide.pickupLat,
        pickupLng: currentRide.pickupLng,
        dropoffAddress: currentRide.dropoffAddress,
        dropoffLat: currentRide.dropoffLat,
        dropoffLng: currentRide.dropoffLng,
        numberOfPassenger: currentRide.numberOfPassenger,
        completedAt: null,
        canceledAt: null,
        arrivingPush: null,
        scheduledTo: currentRide.scheduledTo,
        state: 'creating',
      }, ride.userId);
    }

    if (currentRide.scheduledTo) {
      cancelPush(ride.userId, ride.id, 'futureRideFleetCancel');
    }
  } else if (req.body.ride.state === 'rejected') {
    if (ride.state === 'rejected') {
      if (req.body.ride.scheduledTo) {
        cancelPush(ride.userId, ride.id, 'futureRideCanceled');
      } else {
        cancelPush(ride.userId, ride.id, 'rideReject');
      }
    }

    ride.state = 'rejected';
    await ride.save();
  }

  res.json(ride);
});

router.get('/notifications', async (req, res) => {
  const notifications = await Notification.findAll({
    where: {
      state: Notification.STATES.PENDING,
    },
  });

  notifications.map(async (notificationRecord) => {
    const notificationContent = notificationRecord.content;
    try {
      await sendNotification(
        notificationContent.targetIdsRaw,
        notificationContent.type,
        notificationContent.contents,
        notificationContent.headings,
        notificationContent.ttl,
      );

      notificationRecord.state = Notification.STATES.COMPLETED;
      notificationRecord.save();
    } catch (err) {
      console.log('Push Error', err);
      notificationRecord.state = Notification.STATES.REJECTED;
      notificationRecord.save();
    }
  });

  res.json(200);
});

module.exports = router;
