import network from '../../services/network';

export const createServiceEstimations = async (stopPoints) => {
  const { data } = await network.post('api/v1/services/service-estimations', { stopPoints });
  return data;
};

export const getServices = async () => {
  const { data } = await network.get('api/v1/services');
  return data;
};

export const createRide = async (ride) => {
  const { data } = await network.post('api/v1/client-rides', ride);
  return data;
};
