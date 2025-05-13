/* eslint-disable class-methods-use-this */
import { Platform } from 'react-native';
import {
  OneSignal,
  NotificationClickEvent,
  NotificationWillDisplayEvent,
  PushSubscriptionChangedState,
} from 'react-native-onesignal';
import Config from 'react-native-config';
import { updateUser } from '../context/user/api';
import { StorageService } from '.';
import Mixpanel from './Mixpanel';

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
  pushTokenId: string | null;
  userId: string | null;
}

class NotificationsService {
  private notificationsHandlers: NotificationHandlers;

  private foregroundNotificationsHandlers: NotificationHandlers;

  constructor() {
    this.notificationsHandlers = {};
    this.foregroundNotificationsHandlers = {};
  }

  updateServer = async (
    pushTokenId: string | null,
    userId: string | null,
    isPushEnabled: boolean,
  ): Promise<void> => {
    const clientProfile = await StorageService.get('clientProfile');
    if (!clientProfile) return;

    if (clientProfile.pushUserId !== userId || clientProfile.pushTokenId !== pushTokenId) {
      this.registerOnServer({
        pushTokenId,
        pushUserId: userId,
        isPushEnabled,
        deviceType: Platform.OS,
      });
    }
  };

  getOneSignalUserId = async (): Promise<string | null> => OneSignal.User.getExternalId();

  getPushSettings = async (): Promise<PushSettings | null> => {
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

  refreshPushSettings = async (): Promise<void> => {
    try {
      const pushSettings = await this.getPushSettings();
      if (!pushSettings) return;

      const {
        isPushEnabled,
        pushTokenId,
        userId,
      } = pushSettings;

      Mixpanel.setEvent('Notification Service: Check App State', { isSubscribed: isPushEnabled, pushToken: pushTokenId, userId });

      if (pushTokenId && userId && isPushEnabled) {
        await this.updateServer(pushTokenId, userId, isPushEnabled);
      }
    } catch (error) {
      console.error('Error checking latest device state', error);
    }
  };

  handleNotificationClick = (openResult: NotificationClickEvent): void => {
    const { notification } = openResult;
    const additionalData = notification.additionalData as NotificationAdditionalData;

    if (additionalData && additionalData.type) {
      const method = this.notificationsHandlers[additionalData.type];
      if (method) {
        method(additionalData);
      }
    }
  };

  handleForegroundNotificationClick = (notificationReceivedEvent: NotificationWillDisplayEvent): void => {
    const { notification } = notificationReceivedEvent;
    const additionalData = notification.additionalData as NotificationAdditionalData;

    if (additionalData
      && additionalData.type && this.foregroundNotificationsHandlers[additionalData.type]) {
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
    const { optedIn: isPushEnabled, id: pushTokenId } = current;

    const userId = await this.getOneSignalUserId();
    if (userId && pushTokenId) {
      await this.updateServer(pushTokenId, userId, isPushEnabled);
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
