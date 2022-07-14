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
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 * 60 * 2 },
    );
  });
};

const prepareCoords = locations => ({
  coords: { latitude: locations[0].latitude, longitude: locations[0].longitude },
  speed: locations[0].speed,
  timestamp: new Date(),
});

class Geo {
  constructor() {
    this.watchCbs = {};
    this.locationWatcher = false;
    this.lastLocation = null;
  }

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
    distanceFilter: 1,
    desiredAccuracy: {
      ios: 'bestForNavigation',
      android: 'highAccuracy',
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
    const granted = await RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    });
    if (granted) {
      this.locationSubscription = RNLocation.subscribeToLocationUpdates(this.handleLocation);
    }
  };

  handleLocation = (locations) => {
    const location = prepareCoords(locations);
    this.lastLocation = Object.assign({}, location);
  };

  currentLocation = async () => {
    if (this.lastLocation) {
      if (moment(this.lastLocation.timestamp).isAfter(moment().subtract(1, 'minute'))) {
        return this.lastLocation;
      }
    }
    const rnLastLocation = await RNLocation.getLatestLocation({ timeout: 10000 });
    if (rnLastLocation) {
      return prepareCoords([rnLastLocation]);
    }
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
