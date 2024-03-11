import crashlytics from '@react-native-firebase/crashlytics';
import { firebase } from '@react-native-firebase/analytics';

class Firebase {
  constructor(enable = false) {
    this.crashlytics = crashlytics();
    firebase.analytics().setAnalyticsCollectionEnabled(true);
  }
}

export default new Firebase();
