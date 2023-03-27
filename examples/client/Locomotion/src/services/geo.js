/* eslint-disable class-methods-use-this */
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Config from 'react-native-config';
import RNLocation from 'react-native-location';
import Geolocation from '@react-native-community/geolocation';

const ONE_MINUTE = 60 * 1000;
const THREE_SECONDS = 3 * 1000;

const DEFAULT_OPTIONS = {
  enableHighAccuracy: false,
  timeout: THREE_SECONDS,
  maximumAge: ONE_MINUTE,
};

const currentLocationNative = async (options) => {
  if (Platform.OS === 'android') {
    const granted = await
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (!granted) {
      Alert('Location error');
      return null;
    }
  }

  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...(options || {}),
  };
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      resolve, reject,
      mergedOptions,
    );
  });
};

const prepareCoords = locations => ({
  coords: { latitude: locations[0].latitude, longitude: locations[0].longitude },
  speed: locations[0].speed,
  timestamp: new Date(),
});

class Geo {
  init() {
    this.configure();
    this.requestPermission();
    this.checkPermission();
  }

  initAsync = async () => {
    await this.configure();
    await this.requestPermission();
    await this.checkPermission();
  };

  configure = () => RNLocation.configure({
    distanceFilter: 0,
    desiredAccuracy: {
      ios: 'nearestTenMeters',
      android: 'balancedPowerAccuracy',
    },
    // Android only
    androidProvider: 'playServices',
    interval: 5000,
    maxWaitTime: 5000,
    // iOS Only
    activityType: 'other',
  });

  checkPermission = () => RNLocation.checkPermission({
    ios: 'whenInUse',
    android: {
      detail: 'fine',
    },
  });

  requestPermission = async () => {
    await RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    });
  };

  currentLocation = async (options) => {
    const location = await currentLocationNative(options);
    return prepareCoords([location.coords || location]);
  };
}

const GeoService = new Geo();

export default GeoService;

export const { decodeGmPath } = Geo;

export const DEFAULT_COORDS = {
  coords: {
    latitude: parseFloat(Config.DEFAULT_LATITUDE),
    longitude: parseFloat(Config.DEFAULT_LONGITUDE),
  },
};
export const getPosition = async (options) => {
  try {
    const granted = await GeoService.checkPermission();
    if (!granted) {
      return false;
    }
    return GeoService.currentLocation(options);
  } catch (e) {
    console.error('Error getting location', e);
    return false;
  }
};
