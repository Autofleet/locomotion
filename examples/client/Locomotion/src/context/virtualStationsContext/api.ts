import networkService from '../../services/network';

export const getStations = async () => {
  const { data } = await networkService.get('api/v1/me/places/stations');
  return data;
};
