const moment = require('moment');
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

  const stopPoints = req.body.ride.stop_points;
  const { value: arriveMin } = await settingsService.getSettingByKeyFromDb('ARRIVE_REMINDER_MIN');

  const etaTime = moment(stopPoints[0].eta);
  const diff = etaTime.diff(moment(), 'minutes');

  if (stopPoints[0].completed_at === null && diff <= arriveMin) {
    const user = await User.findOne({
      where: {
        id: ride.userId,
      },
    });

    if (user) {
      const prevNotification = await Notification.findOne({
        where: {
          userId: user.id,
          rideId: ride.id,
          type: 'driverArriving',
        },
      });

      if (!prevNotification) {
        await Notification.create({
          userId: user.id,
          rideId: ride.id,
          type: 'driverArriving',
          content: {
            targetIdsRaw: [user.pushUserId],
            notificationId: 'driverArriving',
            contents: { en: `Driver arriving in ${arriveMin} minutes to ${stopPoints[0].description}` },
            headings: { en: 'Driver is arriving!' },
            ttl: { ttl: 60 * 30 },
          },
        });
      }
    }
  }

  if (!ride) {
    res.json({ error: 'ride not found' });
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
