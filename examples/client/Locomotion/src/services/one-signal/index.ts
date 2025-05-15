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

interface NotificationAdditionalData {
  type?: string;
  [key: string]: any;
}

type NotificationHandler = (data: NotificationAdditionalData) => void;
type NotificationHandlers = Record<string, NotificationHandler>;

interface PushUserData {
  pushUserId: string | null;
  pushTokenId: string | null;
  isPushEnabled: boolean;
  deviceType: string;
}

interface PushSettings {
  isPushEnabled: boolean;
  pushToken: string | null;
  pushSubscriptionId: string | null;
}

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
      this.registerOnServer({
        pushTokenId: pushToken,
        pushUserId: pushSubscriptionId,
        isPushEnabled,
        deviceType: Platform.OS,
      });
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

  refreshPushSettings = async (): Promise<void> => {
    try {
      const pushSettings = await this.getPushSettings();
      if (!pushSettings) return;

      const {
        isPushEnabled,
        pushToken,
        pushSubscriptionId,
      } = pushSettings;

      Mixpanel.setEvent('Notification Service: Check App State', { isSubscribed: isPushEnabled, pushToken, userId: pushSubscriptionId });

      if (pushToken && pushSubscriptionId && isPushEnabled) {
        await this.updateServer(pushToken, pushSubscriptionId, isPushEnabled);
      }
    } catch (error) {
      console.error('Error checking latest device state', error);
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

  init = async (): Promise<void> => {
    if (!Config.ONESIGNAL_APP_ID) return;

    OneSignal.initialize(Config.ONESIGNAL_APP_ID);

    OneSignal.User.pushSubscription.optIn();

    OneSignal.Notifications.addEventListener('click', this.handleNotificationClick);
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', this.handleForegroundNotificationClick);
    OneSignal.User.pushSubscription.addEventListener('change', this.subscriptionObserverHandler);

    if (Platform.OS === 'ios') {
      const permission = await OneSignal.Notifications.requestPermission(true);
      if (permission) {
        Mixpanel.setEvent('iOS User approved push');
      } else {
        Mixpanel.setEvent('iOS User didn\'t approved push');
      }
    }

    await this.refreshPushSettings();
  };


  subscriptionObserverHandler = async (event: PushSubscriptionChangedState): Promise<void> => {
    const { current } = event;
    const { optedIn: isPushEnabled, id: pushSubscriptionId, token: pushToken } = current;

    if (pushSubscriptionId && pushToken) {
      await this.updateServer(pushToken, pushSubscriptionId, isPushEnabled);
    }
  };


  registerOnServer = async (pushUserData: PushUserData): Promise<void> => {
    const response = await updateUser(pushUserData);
    console.log(response.data);
  };

  addNotificationHandler(type: string, handler: NotificationHandler): void {
    this.notificationsHandlers[type] = handler;
  }

  addForegroundNotificationHandler(type: string, handler: NotificationHandler): void {
    this.foregroundNotificationsHandlers[type] = handler;
  }

  loginUser(userId: string): void {
    OneSignal.login(userId);
  }

  logoutUser(): void {
    OneSignal.logout();
  }
}

export default new NotificationsService();
