/* eslint-disable class-methods-use-this */
import { Platform } from 'react-native';
import OneSignal from 'react-native-onesignal';
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

  updateServer = async (pushTokenId, userId, isSubscribed) => {
    const clientProfile = await StorageService.get('clientProfile');
    if (clientProfile) {
      if (clientProfile.pushUserId !== userId || clientProfile.pushTokenId !== pushTokenId) {
        this.registerOnServer({
          pushTokenId,
          pushUserId: userId,
          isSubscribed,
        });
      }
    }
  };

  checkLatestDeviceState = async () => {
    const isSubscribed = await OneSignal.User.pushSubscription.getIsSubscribed();
    const pushToken = await OneSignal.User.pushSubscription.getPushSubscriptionId();
    const userId = await OneSignal.User.getExternalId();

    Mixpanel.setEvent('Notification Service: Check App State', { isSubscribed, pushToken, userId });

    if (pushToken && userId && isSubscribed) {
      await this.updateServer(pushToken, userId, isSubscribed);
    }
  };

  init = async () => {
    // Initialize OneSignal
    OneSignal.initialize(Config.ONESIGNAL_APP_ID);

    // Enable push notifications
    OneSignal.User.pushSubscription.optIn();

    // Set notification opened handler
    OneSignal.Notifications.addEventListener('click', this.onOpened);

    // Set foreground notification handler
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', (notificationReceivedEvent) => {
      const { notification } = notificationReceivedEvent;
      const { additionalData } = notification;

      if (additionalData
        && additionalData.type && this.foregroundNotificationsHandlers[additionalData.type]) {
        this.foregroundNotificationsHandlers[additionalData.type](additionalData);
      }

      // Display the notification
      notificationReceivedEvent.preventDefault();
      notificationReceivedEvent.display();
    });

    // Handle push subscription changes
    OneSignal.User.pushSubscription.addEventListener('change', this.subscriptionObserverHandler);

    // iOS-specific prompt for permissions
    if (Platform.OS === 'ios') {
      const permission = await OneSignal.Notifications.requestPermission(true);
      if (permission) {
        Mixpanel.setEvent('iOS User approved push');
      } else {
        Mixpanel.setEvent('iOS User didn\'t approved push');
      }
    }

    await this.checkLatestDeviceState();
  };

  getDeviceState = async () => {
    const isSubscribed = await OneSignal.User.pushSubscription.getIsSubscribed();
    const pushToken = await OneSignal.User.pushSubscription.getPushSubscriptionId();
    const userId = await OneSignal.User.getExternalId();

    return {
      isSubscribed,
      pushToken,
      userId,
    };
  };

  subscriptionObserverHandler = async (event) => {
    const { current } = event;
    const { isSubscribed } = current;
    const pushToken = current.id; // This is the push token/subscription ID
    const userId = await OneSignal.User.getExternalId();

    if (pushToken && userId) {
      await this.updateServer(pushToken, userId, isSubscribed);
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

  triggerOnNotification = (payload) => {
    console.log('new notification', payload);
  };

  registerOnServer = async ({ pushUserId, pushTokenId, isSubscribed }) => {
    const pushUserData = {
      pushUserId,
      pushTokenId,
      isPushEnabled: isSubscribed,
      deviceType: Platform.OS,
    };

    const response = await updateUser(pushUserData);
    console.log(response.data);
  };

  getOneSignalId = async () => {
    const userId = await OneSignal.User.getExternalId();
    return userId;
  };

  addNotificationHandler(type, handler) {
    this.notificationsHandlers[type] = handler;
  }

  addForegroundNotificationHandler(type, handler) {
    this.foregroundNotificationsHandlers[type] = handler;
  }

  setExternalUserId(userId) {
    if (userId) {
      OneSignal.login(userId);
    } else {
      OneSignal.logout();
    }
  }
}

export default new NotificationsService();
