import axios from 'axios';
import moment from 'moment';
import logger from '../logger';

const demandApi = axios.create({
  baseURL: process.env.AF_BACKEND_URL,
  headers: { Authorization: process.env.AF_API_TOKEN },
});

const getAfNearbyVehiclesWithEta = async (location) => {
  let vehicles;
  try {
    const { data } = await demandApi.get('api/v1/nearby-vehicles', {
      params: {
        ...location,
        radius: process.env.RADIUS_FOR_CALC_PRE_RIDE_ETA,
        preEta: 3,
      },
    });
    vehicles = data ? data.vehicles : data;
  } catch (error) {
    logger.info('Got error while try to get nearby-vehicles from AF', error.message, error.stack);
    vehicles = [];
  }
  logger.info('vehicles', vehicles);
  return vehicles;
};

const directions = async (origin, destination) => {
  const params = {
    key: process.env.GOOGLE_MAPS_API_KEY,
    origin: `${origin.lat},${origin.lng}`,
    destination: `${destination.lat},${destination.lng}`,
  };
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
    params,
  });
  return data;
};

const getRouteDistance = async (origin, destination) => {
  const directionResult = await directions(origin, destination);
  return directionResult.routes.length
    ? directionResult.routes[0].legs.reduce((routeDistance, leg) => routeDistance + leg.distance.value, 0.01) : false;
};

export default async (origin, destination) => {
  const inAreaVehicles = await getAfNearbyVehiclesWithEta(origin);
  let eta;
  if (inAreaVehicles && inAreaVehicles.length) {
    const now = moment();
    eta = inAreaVehicles
      .filter((vehicle) => vehicle.preEta)
      .map((vehicle) => moment(vehicle.preEta).diff(now, 'minutes'))
      .sort((preEtaA, preEtaB) => preEtaA > preEtaB);
    eta = eta.length ? eta[0] : undefined;
  }
  const routeDistance = await getRouteDistance(origin, destination);
  const estimatePrice = routeDistance ? 1.5 + ((routeDistance / 1000) * 0.5) : undefined;

  return { eta, estimatePrice };
};
