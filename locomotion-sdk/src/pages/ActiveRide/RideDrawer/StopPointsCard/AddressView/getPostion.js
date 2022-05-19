import Config from 'react-native-config';
import GeoService from '../../../../../services/geo';

// export default () => new Promise((resolve, reject) => Geolocation.getCurrentPosition(resolve, reject, {enableHighAccuracy: true}));


export default async () => {
  try {
    const location = await GeoService.currentLocation();
    return location;
  } catch (e) {
    console.log('Error getting location', e);
    return {
      coords: {
        latitude: parseFloat(Config.DEFAULT_LATITUDE),
        longitude: parseFloat(Config.DEFAULT_LONGITUDE),
      },
    };
  }
};
