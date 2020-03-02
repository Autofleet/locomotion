import { Platform } from 'react-native';
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import network from './Network';

const notificationsHandlers = {

};

class NotificationsService {
  constructor() {
    this.network = network;
  }

  init = () => {
    const permissions = {
      alert: true,
      badge: true,
      sound: true,
    };

    OneSignal.addEventListener('received', this.triggerOnNotification);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onAnyEvent);

    OneSignal.init('', { kOSSettingsKeyAutoPrompt: true });
    OneSignal.configure();
    OneSignal.requestPermissions(permissions);
    OneSignal.inFocusDisplaying(2);
    OneSignal.setSubscription(true);

    OneSignal.getPermissionSubscriptionState((data) => {
      console.log('getPermissionSubscriptionState', data);

      this.registerOnServer({
        pushToken: data.pushToken,
        oneSignalId: data.userId,
      });

      this.oneSignalId = data.userId;
    });
  }

  onOpened = (openResult) => {
    if (!openResult.notification.payload || !openResult.notification.payload.notificationId) {
      console.error('Recive notification without notificationId', openResult);
      return;
    }
    const method = notificationsHandlers[openResult.notification.payload.notificationId];
    if (method) {
      method();
    }
  }

  triggerOnNotification = (payload) => {
    console.log('new notification', payload);
  }

  registerOnServer = async ({ pushToken, oneSignalId }) => {
    /* user.update({
    pushToken,
    oneSignalId,
    deviceType: Platform.OS,
  }) */
};

  getOneSignalId = () => new Promise(resolve =>
    OneSignal.getPermissionSubscriptionState(({ userId }) => resolve(userId)));
}

export default new NotificationsService();
