const moment = require('moment');
const { Op } = require('sequelize');
const Router = require('../../../lib/router');
const rideService = require('../../../lib/ride');
const { Ride, User, Notification } = require('../../../models');
const sendNotification = require('../../../lib/push-notifications');
const settingsService = require('../../../lib/settings');

const router = Router();

router.put('/:rideId', async (req, res) => {
  const ride = await Ride.findOne({
    where: {
      id: req.params.rideId,
    },
  });

  if (!ride) {
    res.json({ error: 'ride not found' });
  }

  console.log(req.body.ride);

  const stopPoints = req.body.ride.stop_points;

  if (stopPoints && !ride.arrivingPush) {
    const { value: arriveReminderMin } = await settingsService.getSettingByKeyFromDb('ARRIVE_REMINDER_MIN');
    const etaTime = moment(stopPoints[0].eta);
    const diff = etaTime.diff(moment(), 'minutes');

    if (stopPoints[0].completed_at === null && diff <= arriveReminderMin) {
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

        await sendNotification(
          [user.pushUserId],
          'driverArriving',
          { en: `Driver arriving in ${arriveReminderMin} minutes to ${stopPoints[0].description}` },
          { en: 'Driver is arriving!' },
          { ttl: 60 * 30 },
        );
      }
    }
  }

  if (req.body.ride.status === 'active') {
    ride.state = 'active';
    await ride.save();
  } else if (req.body.ride.status === 'completed') {
    ride.state = 'completed';
    await ride.save();
  } else if (req.body.ride.status === 'cancelled') {
    ride.state = 'canceled';
    await ride.save();
    if (!req.body.ride.cancellation_reason.includes('user')) {
      const currentRide = ride.get();
      await rideService.create({
        pickupLat: currentRide.pickupLat,
        pickupLng: currentRide.pickupLng,
        pickupAddress: currentRide.pickupAddress,
        dropoffLat: currentRide.dropoffLat,
        dropoffLng: currentRide.dropoffLng,
        dropoffAddress: currentRide.dropoffAddress,
        numberOfPassenger: currentRide.numberOfPassenger,
      }, ride.userId);
    }
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
