import { Platform, PermissionsAndroid, Alert } from 'react-native';
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
    navigator.geolocation.getCurrentPosition(
      resolve, reject,
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  });
};

class Geo {
  constructor() {
    this.watchCbs = {};
    this.locationWatcher = false;
    this.lastLocation = null;

    RNLocation.configure({
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

    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    }).then((granted) => {
      if (granted) {
        this.locationSubscription = RNLocation.subscribeToLocationUpdates((locations) => {
          const location = this.prepareCoords(locations);
          this.handleLocation(location);
          this.locationSubscription();
        });
      }
    });

    RNLocation.checkPermission({
      ios: 'always',
      android: {
        detail: 'fine',
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async currentLocation() {
    if (this.lastLocation) {
      if (moment(this.lastLocation.timestamp).isAfter(moment().subtract(500, 'millisecond'))) {
        return this.lastLocation;
      }
    }
    const rnLastLocation = await RNLocation.getLatestLocation();
    if (rnLastLocation) {
      return this.prepareCoords([rnLastLocation]);
    }

    const location = await currentLocationNative();
    return this.prepareCoords([location]);
  }

  handleLocation = (location) => {
    const newLocation = Object.assign({}, location);
    this.lastLocation = newLocation;
    return location
  };

  handleLocationError = (error) => {
    Object.keys(this.watchCbs).forEach(key => this.watchCbs[key].onError(error));
  };

  prepareCoords = (locations) => {
    return { coords: { latitude: locations[0].latitude, longitude: locations[0].longitude }, timestamp: new Date() }}
}

export default new Geo();
export const decodeGmPath = Geo.decodeGmPath;
