const { gcsGetFile } = require('./google-storage');

const availablePlacesPromise = (async () => {
  const data = await gcsGetFile('locations.json');
  return JSON.parse(data);
})();

module.exports = async () => {
  if (process.env.DONT_USE_STATIONS) {
    return [];
  }

  const availablePlaces = await availablePlacesPromise;
  if (!availablePlaces) {
    return [];
  }
  return availablePlaces.features;
};
