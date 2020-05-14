const axios = require('axios');
const turf = require('@turf/turf');
const getAvailablePlaces = require('./get-available-places');
const getLocationByPlaceId = require('./get-location-by-place-id');

const getPredictedAddress = async (input, location) => {
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
    params: {
      key: process.env.GOOGLE_MAPS_API_KEY,
      input,
      strictbounds: true,
      radius: process.env.RADIUS_FOR_PLACE_API,
      language: process.env.LANGUAGE_FOR_PLACE_API,
      location: `${location.lat},${location.lng}`,
      types: 'geocode',
    },
  });
  return data.predictions;
};

const getFromAvailablePlaces = async (availablePlaces, closetPlace, myLocation) => {
  const location = closetPlace ? await getLocationByPlaceId(closetPlace.place_id) : undefined;
  const availablePlacesWithDistance = availablePlaces.map(availablePlace => ({
    description: availablePlace.properties.name,
    id: availablePlace.properties.id,
    lat: availablePlace.geometry.coordinates[1],
    lng: availablePlace.geometry.coordinates[0],
    distance: location ? turf.distance(turf.point([location.lng, location.lat]), turf.point(availablePlace.geometry.coordinates)) : undefined,
    distanceFromMe: turf.distance(turf.point([myLocation.lng, myLocation.lat]), turf.point(availablePlace.geometry.coordinates)),
    station: true,
  }));

  return availablePlacesWithDistance.sort((place1, place2) => (place1.distanceFromMe - place2.distanceFromMe));
};

module.exports = async (input, location, stations) => {
  let predictedAddresses;
  const availablePlaces = await getAvailablePlaces();
  if (!stations) {
    predictedAddresses = await getPredictedAddress(input, location);
    return predictedAddresses;
  }

  if (input) {
    predictedAddresses = await getPredictedAddress(input, location);
    if (availablePlaces && availablePlaces.length && predictedAddresses.length) {
      predictedAddresses = await getFromAvailablePlaces(availablePlaces, predictedAddresses[0], location);
    }
  } else {
    predictedAddresses = await getFromAvailablePlaces(availablePlaces, undefined, location);
  }
  return predictedAddresses;
};
