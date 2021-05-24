import axios from 'axios';

export default async (placeId) => {
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
    params: {
      key: process.env.GOOGLE_MAPS_API_KEY,
      placeid: placeId,
    },
  });

  return data.result.geometry.location;
};
