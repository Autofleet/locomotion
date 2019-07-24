const Router = require('../../../../lib/router');
const rideService = require('../../../../lib/ride');
const { Ride } = require('../../../../models');

const router = Router();

// to check if equal to active
router.get('/', async (req, res) => {
  const rides = await Ride.find({
    where: {
      userId: req.userId,
      state: req.query.activeRide ? Ride.STATES.ACTIVE : undefined,
    },
  });

  res.json({ rides: rides !== null ? rides : [] });
});

router.get('/active', async (req, res) => {
  const ride = await rideService.getRidderActiveRide(req.userId);
  res.json({ ride });
});

router.post('/', async (req, res) => {
  const ride = await rideService.create(req.body, req.userId);

  res.json(ride);
});

router.post('/cancel-active-ride', async (req, res) => {
  const ride = await rideService.cancelActiveRide(req.userId);

  res.json({ ride });
});

module.exports = router;
