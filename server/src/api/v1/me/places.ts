import Router from '../../../lib/router';
import getPlacesByLocation from '../../../lib/get-places-by-location';
import getLocationByPlaceId from '../../../lib/get-location-by-place-id';

const router = Router();

router.get('/', async (req, res) => {
  const { location, input, stations } = req.query;
  console.log(stations);


  const places = await getPlacesByLocation(input, JSON.parse(location), stations);
  res.json(places);
});

router.get('/get-location', async (req, res) => {
  const { placeId } = req.query;
  const location = await getLocationByPlaceId(placeId);
  res.json(location);
});

export default router;
