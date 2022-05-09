import moment from 'moment';
import logger from '../../../logger';
import Router from '../../../lib/router';
import rideService from '../../../lib/ride';
import { Ride, User, Notification } from '../../../models';
import sendNotification from '../../../lib/push-notifications';
import settingsService from '../../../lib/settings';

const i18n = require('../../../i18n');

const router = Router();

const cancelPush = async (userId, rideId, messageType = 'futureRideCanceled') => {
  logger.info(`Push notification user: ${userId} ride: ${rideId} type: ${messageType}`);
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  const notificationSent = await Notification.findOne({ where: { userId, rideId, type: messageType } });

  if (notificationSent) {
    return false;
  }

  Notification.create({ userId, rideId, type: messageType });
  return sendNotification(
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

  const { stopPoints } = req.body.ride;
  logger.info(`Webhook - rideId: ${req.params.rideId} currentState: ${ride.state}  newState: ${req.body.ride.state} SpsStates: ${(stopPoints.map((s) => s.state)).join()}`);
  const isReminderShouldBeSent = async () => {
    const { value: arriveReminderMin } = await settingsService.getSettingByKeyFromDb('ARRIVE_REMINDER_MIN');
    const etaTime = moment(stopPoints[0].eta);
    if (!etaTime) {
      return false;
    }
    const diff = etaTime.diff(moment(), 'minutes');
    return diff <= arriveReminderMin;
  };

  if (stopPoints && !ride.arrivingPush && (req.body.ride.state === 'active' || req.body.ride.state === 'dispatched')) {
    const shouldRemind = await isReminderShouldBeSent();

    if (stopPoints[0].completedAt === null && shouldRemind) {
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

        logger.info('Error sending push', e);
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
        { en: i18n.t('pushNotifications.activatingFutureRide.text', { stopPoint: stopPoints[0].description }) },
        { en: i18n.t('pushNotifications.activatingFutureRide.heading') },
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
  } else if (req.body.ride.state === 'canceled') {
    ride.state = 'canceled';
    await ride.save();
    const currentRide = ride.get();
    if (!req.body.ride.cancellationReason.includes('user') && !currentRide.scheduledTo) {
      cancelPush(ride.userId, ride.id, 'findingNewDriver');

      const [pickup, dropoff] = req.body.ride.stopPoints;
      await rideService.create({
        userId: currentRide.userId,
        state: 'creating',
        numberOfPassengers: req.body.ride.numberOfPassengers,
        rideType: req.body.ride.rideType,
        scheduledTo: req.body.ride.scheduledTo,
        stopPoints: [
          {
            type: 'pickup',
            address: pickup.description,
            lat: pickup.lat,
            lng: pickup.lng,
          },
          {
            type: 'dropoff',
            address: dropoff.description,
            lat: dropoff.lat,
            lng: dropoff.lng,
          },
        ],
      }, ride.userId, ride.operationId);
    }

    if (!req.body.ride.cancellationReason.includes('user') && currentRide.scheduledTo) {
      cancelPush(ride.userId, ride.id, 'futureRideFleetCancel');
    }

    if (req.body.ride.cancellationReason.includes('no-show')) {
      cancelPush(ride.userId, ride.id, 'failureRide');
    }
  } else if (req.body.ride.state === 'rejected') {
    if (req.body.ride.scheduledTo) {
      cancelPush(ride.userId, ride.id, 'futureRideCanceled');
    } else {
      cancelPush(ride.userId, ride.id, 'rideReject');
    }

    ride.state = 'rejected';
    await ride.save();
  }

  return res.json(ride);
});

/* router.get('/notifications', async (req, res) => {
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

      // eslint-disable-next-line no-param-reassign
      notificationRecord.state = Notification.STATES.COMPLETED;
      notificationRecord.save();
    } catch (err) {
      console.log('Push Error', err);
      // eslint-disable-next-line no-param-reassign
      notificationRecord.state = Notification.STATES.REJECTED;
      notificationRecord.save();
    }
  });

  res.json(200);
});  */

export default router;
