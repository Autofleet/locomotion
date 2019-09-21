const axios = require('axios');
const turf = require('@turf/turf');
const getAvailablePlaces = require('./get-available-places');
const getLocationByPlaceId = require('./get-location-by-place-id');

const getPredictedAddress = async (input, location) => {
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
    params: {
      key: process.env.GOOGLE_MAPS_API_KEY,
      input,
      location: `${location.lat},${location.lng}`,
      // language: // Change the results lang
    },
  });
  return data.predictions;
};

const getFromAvailablePlaces = async (availablePlaces, closetPlace) => {
  const location = await getLocationByPlaceId(closetPlace.place_id);
  const availablePlacesWithDistance = availablePlaces.map(availablePlace => ({
    description: availablePlace.properties.name,
    id: availablePlace.properties.id,
    distance: turf.distance(turf.point([location.lng, location.lat]), turf.point(availablePlace.geometry.coordinates)),
  }));

  return availablePlacesWithDistance.sort((place1, place2) => (place1.distance - place2.distance));
};

module.exports = async (input, location) => {
  const availablePlaces = await getAvailablePlaces();
  let predictedAddresses = await getPredictedAddress(input, location);
  if (availablePlaces && availablePlaces.length) {
    predictedAddresses = await getFromAvailablePlaces(availablePlaces, predictedAddresses[0]);
  }
  return predictedAddresses;
};
