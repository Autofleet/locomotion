const Router = require('../../../lib/router');
const rideService = require('../../../lib/ride');
const { Ride } = require('../../../models');

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
    if (req.body.ride.cancelled_by.includes('fleet')) {
      const currentRide = ride.get();
      await rideService.create({
        pickupLat: currentRide.pickupLat,
        pickupLng: currentRide.pickupLng,
        pickupAddress: currentRide.pickupAddress,
        dropoffLat: currentRide.dropoffLat,
        dropoffLng: currentRide.dropoffLng,
        dropoffAddress: currentRide.dropoffAddress,
      }, ride.userId);
    }
  }

  res.json(ride);
});

module.exports = router;
