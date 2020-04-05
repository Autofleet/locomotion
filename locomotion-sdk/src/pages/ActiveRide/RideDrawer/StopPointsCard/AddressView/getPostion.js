import Geolocation from '@react-native-community/geolocation';

export default () => new Promise((resolve, reject) => Geolocation.getCurrentPosition(resolve, reject, {enableHighAccuracy: true}));
