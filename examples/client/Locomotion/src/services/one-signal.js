/* eslint-disable class-methods-use-this */
import { Platform } from 'react-native';
import { OneSignal } from 'react-native-onesignal';
import Config from 'react-native-config';
import network from './network';
import { updateUser } from '../context/user/api';
import { StorageService } from '.';
import Mixpanel from './Mixpanel';

class NotificationsService {
  constructor() {
    this.network = network;
    this.notificationsHandlers = {};
    this.foregroundNotificationsHandlers = {};
  }

  updateServer = async (pushTokenId, userId, isPushEnabled) => {
    const clientProfile = await StorageService.get('clientProfile');
    if (!clientProfile) return;

    if (clientProfile.pushUserId !== userId || clientProfile.pushTokenId !== pushTokenId) {
      this.registerOnServer({
        pushTokenId,
        pushUserId: userId,
        isPushEnabled,
      });
    }
  };

  getOneSignalUserId = async () => OneSignal.User.getExternalId();

  getPushSettings = async () => {
    try {
      const [
        isPushEnabled,
        pushTokenId,
        userId,
      ] = await Promise.all([
        OneSignal.User.pushSubscription.getOptedInAsync(),
        OneSignal.User.pushSubscription.getIdAsync(),
        this.getOneSignalUserId(),
      ]);

      return {
        isPushEnabled,
        pushTokenId,
        userId,
      };
    } catch (error) {
      console.error('Error getting device state', error);
      return null;
    }
  };

  refreshPushSettings = async () => {
    try {
      const pushSettings = await this.getPushSettings();
      if (!pushSettings) return;

      const {
        isPushEnabled,
        pushTokenId,
        userId,
      } = pushSettings;

      console.log('#### refreshPushSettings', {
        isPushEnabled,
        pushTokenId,
        userId,
      });

      Mixpanel.setEvent('Notification Service: Check App State', { isSubscribed: isPushEnabled, pushToken: pushTokenId, userId });

      if (pushTokenId && userId && isPushEnabled) {
        await this.updateServer(pushTokenId, userId, isPushEnabled);
      }
    } catch (error) {
      console.error('Error checking latest device state', error);
    }
  };

  init = async () => {
    console.log('#### init OneSignal');
    OneSignal.initialize(Config.ONESIGNAL_APP_ID);

    OneSignal.User.pushSubscription.optIn();

    OneSignal.Notifications.addEventListener('click', this.onOpened);

    OneSignal.Notifications.addEventListener('foregroundWillDisplay', (notificationReceivedEvent) => {
      const { notification } = notificationReceivedEvent;
      const { additionalData } = notification;

      if (additionalData
        && additionalData.type && this.foregroundNotificationsHandlers[additionalData.type]) {
        this.foregroundNotificationsHandlers[additionalData.type](additionalData);
      }

      notificationReceivedEvent.preventDefault();
      notificationReceivedEvent.display();
    });

    OneSignal.User.pushSubscription.addEventListener('change', this.subscriptionObserverHandler);

    if (Platform.OS === 'ios') {
      const permission = await OneSignal.Notifications.requestPermission(true);
      if (permission) {
        Mixpanel.setEvent('iOS User approved push');
      } else {
        Mixpanel.setEvent('iOS User didn\'t approved push');
      }
    }

    console.log('#### OneSignal initialized');
    await this.refreshPushSettings();
  };

  subscriptionObserverHandler = async (event) => {
    const { current } = event;
    const { optedIn: isPushEnabled, id: pushTokenId } = current;

    const userId = await this.getOneSignalUserId();
    if (userId) {
      await this.updateServer(pushTokenId, userId, isPushEnabled);
    }
  };

  onOpened = (openResult) => {
    const { notification } = openResult;
    const { additionalData } = notification;

    if (additionalData && additionalData.type) {
      const method = this.notificationsHandlers[additionalData.type];
      if (method) {
        method(additionalData);
      }
    }
  };

  registerOnServer = async ({ pushUserId, pushTokenId, isPushEnabled }) => {
    const pushUserData = {
      pushUserId,
      pushTokenId,
      isPushEnabled,
      deviceType: Platform.OS,
    };

    const response = await updateUser(pushUserData);
    console.log(response.data);
  };

  addNotificationHandler(type, handler) {
    this.notificationsHandlers[type] = handler;
  }

  addForegroundNotificationHandler(type, handler) {
    this.foregroundNotificationsHandlers[type] = handler;
  }

  loginUser(userId) {
    OneSignal.login(userId);
  }

  logoutUser() {
    OneSignal.logout();
  }
}

export default new NotificationsService();
