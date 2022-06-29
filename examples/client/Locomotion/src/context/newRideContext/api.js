import network from '../../services/network';

export const createServiceEstimations = async (stopPoints) => {
  try {
    const { data } = await network.post('api/v1/services/service-estimations', { stopPoints });
    return data;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

export const getServices = async () => {
  try {
    const { data } = await network.get('api/v1/services');
    return data;
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
};

export const createRide = async (ride) => {
  const { data } = await network.post('api/v1/client-rides', ride);
  return data;
};

export const getActiveRide = async () => {
  const { data } = await network.get('api/v1/rides/active');
  return data;
};