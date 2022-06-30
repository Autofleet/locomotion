import network from '../../services/network';

export const getActiveRides = async (params) => {
  const { data } = await network.get('api/v1/me/rides/active', { params });
  return data;
};

export const getRideSummary = async (params) => {
  const { data } = await network.get('api/v1/me/rides/ride-summary', { params });
  return data;
};

export const getPreRideDetails = async (params) => {
  const { data } = await network.get('api/v1/me/rides/pre', { params });
  return data;
};

export const createRideApi = async (body) => {
  const { data } = await network.post('api/v1/me/rides', body);
  return data;
};

export const createOfferApi = async (body) => {
  const { data } = await network.post('api/v1/me/rides/offer', body);
  return data;
};

export const cancelRideApi = async () => {
  await network.post('api/v1/me/rides/cancel-active-ride');
};

export const patchRide = async (rideId, data) => {
  await network.patch(`api/v1/rides/${rideId}`, data);
};

export const cancelFutureRideApi = async (rideId) => {
  await network.post('api/v1/me/rides/cancel-future-ride', { rideId });
};

export const getRidesHistory = async () => {
  const { data } = await network.get('api/v1/me/rides/history');
  return data;
};
