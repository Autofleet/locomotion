/* eslint-disable class-methods-use-this */
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Config from 'react-native-config';
import RNLocation from 'react-native-location';
import Geolocation from 'react-native-geolocation-service';

const ONE_MINUTE = 60 * 1000;
const ONE_SECOND = 1000;

const DEFAULT_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 2 * ONE_SECOND,
  maximumAge: ONE_MINUTE,
  accuracy: {
    ios: 'best',
    android: 'high',
  },
  distanceFilter: 5,
};

const currentLocationNative = async (options) => {
  if (Platform.OS === 'android') {
    const granted = await
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (!granted) {
      Alert.alert('Location error');
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

  checkPermission = async () => {
    const result = await RNLocation.checkPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    });
    if (result) {
      try {
        // If permission is granted, we will warmup the location manager
        // to get a faster response when requesting location updates
        currentLocationNative({
          maximumAge: 0,
          timeout: 10 * ONE_SECOND,
        });
      } catch (e) {
        console.error('Error warming up location manager', e);
      }
    }
    return result;
  };

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
    const location = await GeoService.currentLocation(options);
    return location;
  } catch (e) {
    console.error('Error getting location', e);
    return false;
  }
};
