/* eslint-disable class-methods-use-this */
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Config from 'react-native-config';
import RNLocation from 'react-native-location';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import { BS_PAGES } from '../context/ridePageStateContext/utils';

const currentLocationNative = async () => {
  if (Platform.OS === 'android') {
    const granted = await
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (!granted) {
      Alert('Location error');
      return null;
    }
  }
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      resolve, reject,
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 * 60 * 2 },
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

  currentLocation = async () => {
    const location = await currentLocationNative();
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
export const getPosition = async () => {
  try {
    const granted = await GeoService.checkPermission();
    if (!granted) {
      return false;
    }
    return GeoService.currentLocation();
  } catch (e) {
    console.error('Error getting location', e);
    return false;
  }
};
