/* eslint-disable class-methods-use-this */
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Config from 'react-native-config';
import RNLocation from 'react-native-location';
import moment from 'moment';

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
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        resolve, reject,
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    } else {
      reject();
    }
  });
};

const prepareCoords = locations => ({
  coords: { latitude: locations[0].latitude, longitude: locations[0].longitude },
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
    console.log({ location });
    this.lastLocation = Object.assign({}, location);
    this.locationSubscription();
  };

  currentLocation = async () => {
    if (this.lastLocation) {
      if (moment(this.lastLocation.timestamp).isAfter(moment().subtract(1, 'minute'))) {
        return this.lastLocation;
      }
    }
    const rnLastLocation = await RNLocation.getLatestLocation();
    if (rnLastLocation) {
      return prepareCoords([rnLastLocation]);
    }

    const location = await currentLocationNative();
    return prepareCoords([location]);
  };
}

const GeoService = new Geo();

export default GeoService;

export const { decodeGmPath } = Geo;

const DEFAULT_COORDS = {
  coords: {
    latitude: parseFloat(Config.DEFAULT_LATITUDE),
    longitude: parseFloat(Config.DEFAULT_LONGITUDE),
  },
};
export const getPosition = async () => {
  try {
    const granted = await GeoService.checkPermission();
    if (granted) {
      return GeoService.currentLocation();
    }
    return DEFAULT_COORDS;
  } catch (e) {
    console.log('Error getting location', e);
    return DEFAULT_COORDS;
  }
};
