import { gcsGetFile } from './google-storage';

const availablePlacesPromise = (async () => {
  const data: string = await gcsGetFile('locations.json');
  return JSON.parse(data);
})();

export default async () => {
  if (process.env.DONT_USE_STATIONS) {
    return [];
  }

  const availablePlaces = await availablePlacesPromise;
  if (!availablePlaces) {
    return [];
  }
  return availablePlaces.features;
};
