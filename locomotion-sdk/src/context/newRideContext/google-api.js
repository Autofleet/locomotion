import axios from 'axios';
import Config from 'react-native-config';

const instance = axios.create({
  baseURL: 'https://maps.googleapis.com',
});

export const getPlaces = async (params) => {
  const { data } = await instance.get('/maps/api/place/autocomplete/json', { params: { ...params, key: Config.GOOGLE_MAPS_KEY } });
  return data.predictions;
};

export const getGeocode = async (params) => {
  const { data } = await instance.get('/maps/api/geocode/json', { params: { ...params, key: Config.GOOGLE_MAPS_KEY } });
  return data;
};

export const getPlaceDetails = async (placeId) => {
  const { data } = await instance.get('/maps/api/place/details/json', {
    params: {
      key: Config.GOOGLE_MAPS_KEY,
      placeid: placeId,
    },
  });

  return data.result.geometry.location;
};
