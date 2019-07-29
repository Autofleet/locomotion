const Router = require('../../../lib/router');
const { Ride } = require('../../../models');

const router = Router();

router.put('/:rideId', async (req, res) => {
  console.log('webhook', req.body);
  const ride = await Ride.find({
    where: {
      id: req.params.rideId,
    },
  });

  if (req.body.ride.status === 'active') {
    ride.state = 'active';
  } else if (req.body.ride.status === 'completed') {
    ride.state = 'completed';
  } else if (req.body.ride.status === 'cancelled') {
    ride.state = 'canceled';
  }

  await ride.save();
  res.json(ride);
});

module.exports = router;
