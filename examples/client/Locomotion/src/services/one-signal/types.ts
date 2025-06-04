export interface NotificationAdditionalData {
  type?: string;
  [key: string]: any;
}

export type NotificationHandler = (data: NotificationAdditionalData) => void;
export type NotificationHandlers = Record<string, NotificationHandler>;

export interface PushUserData {
  pushUserId: string | null;
  pushTokenId: string | null;
  isPushEnabled: boolean;
  deviceType: string;
}

export interface PushSettings {
  isPushEnabled: boolean;
  pushToken: string | null;
  pushSubscriptionId: string | null;
}
