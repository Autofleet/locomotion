//import firebase from 'react-native-firebase';
import crashlytics from '@react-native-firebase/crashlytics';

class Firebase {
  constructor() {
    this.crashlytics = crashlytics();
  }
}

export default new Firebase();
