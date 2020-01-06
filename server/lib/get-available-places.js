const { gcsGetFile } = require('./google-storage');

const availablePlacesPromise = (async () => {
  if (process.env.GCP_STORAGE_BUCKET_NAME) {
    console.log('ss');
    const data = await gcsGetFile('locations.json');
    return JSON.parse(data);
  }
  return [];
})();

module.exports = async () => {
  const availablePlaces = await availablePlacesPromise;
  if (!availablePlaces) {
    return [];
  }
  return availablePlaces.features;
};
