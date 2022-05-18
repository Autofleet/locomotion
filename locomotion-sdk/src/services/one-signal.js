import { Platform } from 'react-native';
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import Config from 'react-native-config';
import network from './network';
import AppSettings from './app-settings';
import { getTogglePopupsState } from '../context/main';
import { updateUser } from '../context/user/api';


class NotificationsService {
  constructor() {
    this.network = network;
  }

  init = (notificationsHandlers) => {
    this.notificationsHandlers = notificationsHandlers;

    OneSignal.setAppId(Config.ONESIGNAL_APP_ID);
    OneSignal.setNotificationOpenedHandler(this.onOpened);
    OneSignal.disablePush(false);

    if (Platform.OS === 'ios') {
      OneSignal.promptForPushNotificationsWithUserResponse(() => {});
    }
    OneSignal.addSubscriptionObserver(this.subscriptionObserverHandler);
  }

  subscriptionObserverHandler = async (data) => {
    const { to } = data;
    const { pushToken, userId } = to;
    if (pushToken && userId) {
      const { userProfile } = await AppSettings.getSettings();
      if (userProfile.pushUserId !== userId || userProfile.pushToken !== pushToken) {
        this.registerOnServer({
          pushToken,
          pushUserId: userId,
        });
      }
    }
  }

  onOpened = (openResult) => {
    const { additionalData } = openResult.notification.payload;
    if (additionalData && additionalData.type) {
      const method = this.notificationsHandlers[additionalData.type];
      if (method) {
        method();
      }
    }
  }

  triggerOnNotification = (payload) => {
    console.log('new notification', payload);
  }

  registerOnServer = async ({ pushUserId, pushToken }) => {
    const pushUserData = {
      pushUserId,
      pushToken,
      deviceType: Platform.OS,
    };

    const response = await updateUser(pushUserData);
    console.log(response.data);
  };

  getOneSignalId = () => new Promise(resolve => OneSignal.getPermissionSubscriptionState(({ userId }) => resolve(userId)));
}

export default new NotificationsService();
