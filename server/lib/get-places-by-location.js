const axios = require('axios');
const turf = require('@turf/turf');
const getAvailablePlaces = require('./get-available-places');
const getLocationByPlaceId = require('./get-location-by-place-id');

const getPredictedAddress = async (input, location) => {
  try {
    const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        key: process.env.GOOGLE_MAPS_API_KEY,
        input,
        strictbounds: true,
        radius: process.env.RADIUS_FOR_PLACE_API,
        language: process.env.LANGUAGE_FOR_PLACE_API,
        location: `${location.lat},${location.lng}`,
      },
    });
    return data.predictions;
  } catch (e) {
    // console.error(e);
    throw e;
  }
};


const getFromAvailablePlaces = async (availablePlaces, closetPlace, myLocation) => {
  const location = await getLocationByPlaceId(closetPlace.place_id);
  const availablePlacesWithDistance = availablePlaces.map(availablePlace => ({
    description: availablePlace.properties.name,
    id: availablePlace.properties.id,
    lat: availablePlace.geometry.coordinates[1],
    lng: availablePlace.geometry.coordinates[0],
    distance: turf.distance(turf.point([location.lng, location.lat]), turf.point(availablePlace.geometry.coordinates)),
    distanceFromMe: turf.distance(turf.point([myLocation.lng, myLocation.lat]), turf.point(availablePlace.geometry.coordinates)),
  }));

  return availablePlacesWithDistance.sort((place1, place2) => (place1.distance - place2.distance));
};

module.exports = async (input, location) => {
  const promises = await Promise.all([
    (process.env.GCP_STORAGE_BUCKET_NAME ? await getAvailablePlaces() : []),
    getPredictedAddress(input, location),
  ]);
  const [availablePlaces] = promises;
  let [, predictedAddresses] = promises;
  if (availablePlaces && availablePlaces.length && predictedAddresses.length) {
    predictedAddresses = await getFromAvailablePlaces(availablePlaces, predictedAddresses[0], location);
  }
  return predictedAddresses;
};
