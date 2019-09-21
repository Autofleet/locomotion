const { gcsGetFile } = require('./google-storage');

const availablePlacesPromise = (async () => {
  const data = await gcsGetFile('locations.json');
  return JSON.parse(data);
})();

module.exports = async () => {
  const availablePlaces = await availablePlacesPromise;
  if (!availablePlaces) {
    return [];
  }
  return availablePlaces.features;
};
