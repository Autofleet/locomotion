const Router = require('../../../lib/router');
const getPlacesByLocation = require('../../../lib/get-places-by-location');
const getLocationByPlaceId = require('../../../lib/get-location-by-place-id');

const router = Router();

router.get('/', async (req, res) => {
  const { location, input } = req.query;
  const places = await getPlacesByLocation(input, location);
  res.json(places);
});

router.get('/get-location', async (req, res) => {
  const { placeId } = req.query;
  const location = await getLocationByPlaceId(placeId);
  res.json(location);
});

module.exports = router;
