import network from '../../services/network';

export const getStationsApi = async (params) => {
  const { data } = await network.get('api/v1/me/places', { params });
  return data;
};

export const getLocation = async (params) => {
  const { data } = await network.get('api/v1/me/places/get-location', { params });
  return data;
};

export const getPlacesByLocation = async (params) => {
  const { data } = await network.get('api/v1/me/places', { params });
  return data;
};
