const Router = require('../../../lib/router');
const rideService = require('../../../lib/ride');
const { Ride, User } = require('../../../models');
const sendNotification = require('../../../lib/push-notifications');

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

router.get('/:rideId/notification', async (req, res) => {
  const ride = await Ride.findOne({
    where: {
      id: req.params.rideId,
    },
  });

  if (!ride) {
    res.json({ error: 'ride not found' });
  }

  const user = await User.findOne({
    where: {
      id: ride.userId,
    },
  });

  if (!user) {
    res.json({ error: 'user not found' });
  }

  const pushNotification = await sendNotification(
    [user.pushUserId],
    'driverArriving',
    { en: ' to stop point X' },
    { en: 'Driver arriving in 3 minutes' },
    { ttl: 60 * 30 },
  );

  res.json(pushNotification.data);
});

module.exports = router;
