/* eslint-disable class-methods-use-this */
import { Platform } from 'react-native';
import {
  OneSignal,
  NotificationClickEvent,
  NotificationWillDisplayEvent,
  PushSubscriptionChangedState,
} from 'react-native-onesignal';
import Config from 'react-native-config';
import { updateUser } from '../../context/user/api';
import { StorageService } from '..';
import Mixpanel from '../Mixpanel';
import {
  NotificationHandler,
  NotificationHandlers,
  PushSettings,
  PushUserData,
  NotificationAdditionalData,
} from './types';

const IOS = 'ios';

class NotificationsService {
  private notificationsHandlers: NotificationHandlers;

  private foregroundNotificationsHandlers: NotificationHandlers;

  constructor() {
    this.notificationsHandlers = {};
    this.foregroundNotificationsHandlers = {};
  }

  updateServer = async (
    pushToken: string | null,
    pushSubscriptionId: string | null,
    isPushEnabled: boolean,
  ): Promise<void> => {
    const clientProfile = await StorageService.get('clientProfile');
    if (!clientProfile) return;

    if (
      clientProfile.pushUserId !== pushSubscriptionId
       || clientProfile.pushTokenId !== pushToken
    ) {
      await updateUser({
        pushTokenId: pushToken,
        pushUserId: pushSubscriptionId,
        isPushEnabled,
        deviceType: Platform.OS,
      } as PushUserData);
    }
  };

  getPushSettings = async (): Promise<PushSettings | null> => {
    try {
      const [
        isPushEnabled,
        pushToken,
        pushSubscriptionId,
      ] = await Promise.all([
        OneSignal.User.pushSubscription.getOptedInAsync(),
        OneSignal.User.pushSubscription.getTokenAsync(),
        OneSignal.User.pushSubscription.getIdAsync(),
      ]);

      return {
        isPushEnabled,
        pushToken,
        pushSubscriptionId,
      };
    } catch (error) {
      console.error('Error getting device state', error);
      return null;
    }
  };

  refreshPushSettings = async (): Promise<PushSettings | null> => {
    try {
      const pushSettings = await this.getPushSettings();
      if (!pushSettings) return null;

      const {
        isPushEnabled,
        pushToken,
        pushSubscriptionId,
      } = pushSettings;

      Mixpanel.setEvent('Notification Service: Check App State', { isSubscribed: isPushEnabled, pushToken, userId: pushSubscriptionId });

      if (pushToken && pushSubscriptionId && isPushEnabled) {
        await this.updateServer(pushToken, pushSubscriptionId, isPushEnabled);
      }

      return pushSettings;
    } catch (error) {
      console.error('Error checking latest device state', error);
      return null;
    }
  };

  handleNotificationClick = (openResult: NotificationClickEvent): void => {
    const { notification } = openResult;
    const additionalData = notification.additionalData as NotificationAdditionalData;

    if (additionalData?.type && this.notificationsHandlers[additionalData.type]) {
      this.notificationsHandlers[additionalData.type](additionalData);
    }
  };

  handleForegroundNotificationClick = (
    notificationReceivedEvent: NotificationWillDisplayEvent,
  ): void => {
    const { notification } = notificationReceivedEvent;
    const additionalData = notification.additionalData as NotificationAdditionalData;

    if (additionalData?.type && this.foregroundNotificationsHandlers[additionalData.type]) {
      this.foregroundNotificationsHandlers[additionalData.type](additionalData);
    }

    notificationReceivedEvent.preventDefault();
    notificationReceivedEvent.getNotification().display();
  };

  init = async (userId: string): Promise<PushSettings | null> => {
    if (!Config.ONESIGNAL_APP_ID) return null;

    OneSignal.initialize(Config.ONESIGNAL_APP_ID);
    OneSignal.login(userId);

    OneSignal.User.pushSubscription.optIn();

    OneSignal.Notifications.addEventListener('click', this.handleNotificationClick);
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', this.handleForegroundNotificationClick);
    OneSignal.User.pushSubscription.addEventListener('change', this.subscriptionObserverHandler);

    if (Platform.OS === IOS) {
      const permission = await OneSignal.Notifications.requestPermission(true);
      if (permission) {
        Mixpanel.setEvent('iOS User approved push');
      } else {
        Mixpanel.setEvent('iOS User didn\'t approved push');
      }
    }

    return this.refreshPushSettings();
  };


  subscriptionObserverHandler = async (event: PushSubscriptionChangedState): Promise<void> => {
    const { current } = event;
    const { optedIn: isPushEnabled, id: pushSubscriptionId, token: pushToken } = current;

    if (pushSubscriptionId && pushToken) {
      await this.updateServer(pushToken, pushSubscriptionId, isPushEnabled);
    }
  };

  addNotificationHandler(type: string, handler: NotificationHandler): void {
    this.notificationsHandlers[type] = handler;
  }

  addForegroundNotificationHandler(type: string, handler: NotificationHandler): void {
    this.foregroundNotificationsHandlers[type] = handler;
  }

  logoutUser(): void {
    OneSignal.logout();
  }
}

export default new NotificationsService();
