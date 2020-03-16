const Router = require('../../../../lib/router');
const rideService = require('../../../../lib/ride');
const getPreRideDetails = require('../../../../lib/pre-ride-details');
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

router.get('/history', async (req, res) => {
  const rides = await Ride.findAll({
    where: {
      userId: req.userId,
      state: Ride.STATES.COMPLETED,
    },
    order: [['createdAt', 'DESC']],
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

router.post('/offer', async (req, res) => {
  const offer = await rideService.createOffer(req.body);
  res.json(offer);
});

router.post('/cancel-active-ride', async (req, res) => {
  const ride = await rideService.cancelActiveRide(req.userId);

  res.json({ ride });
});


// Get origin destination
// Return ETA + price estimate
router.get('/pre', async (req, res) => {
  const { origin, destination } = req.query;
  const preRideDetails = await getPreRideDetails(JSON.parse(origin), JSON.parse(destination));
  res.json({ ...preRideDetails });
});

module.exports = router;
