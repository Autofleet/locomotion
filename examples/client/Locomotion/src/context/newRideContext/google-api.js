import network from '../../services/network';

export const getPlaces = async (params) => {
  const { data } = await network.get('/api/v1/maps/place/autocomplete', { params });
  return data.result;
};

export const getGeocode = async (params) => {
  const { data } = await network.post('/api/v1/maps/reverse-geocode',
    { params: { ...params, includePlaceId: true } });
  return data.result;
};

export const getPlaceDetails = async (placeId) => {
  const { data } = await network.get(`/api/v1/maps/place/${placeId}`);
  return data.result;
};
