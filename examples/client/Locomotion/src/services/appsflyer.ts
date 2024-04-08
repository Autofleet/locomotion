import { Platform } from 'react-native';
import appsFlyer from 'react-native-appsflyer';
import Config from 'react-native-config';

const LOG_PREFIX = 'APPSFLYER INTEG';
const { ANDROID_APPSFLYER_DEV_KEY, IOS_APPSFLYER_DEV_KEY, IOS_APPSFLYER_APP_ID } = Config;
const PLATFORM_CONFIG: any = {
  android: {
    devKey: ANDROID_APPSFLYER_DEV_KEY,
  },
  ios: {
    devKey: IOS_APPSFLYER_DEV_KEY,
    appId: IOS_APPSFLYER_APP_ID,
    timeToWaitForATTUserAuthorization: 10, // for iOS 14.5
  },
};

export default () => {
  const config = PLATFORM_CONFIG[Platform.OS];
  if (config?.devKey) {
    appsFlyer.initSdk(
      {
        ...config,
        isDebug: false,
        onInstallConversionDataListener: true, // Optional
        onDeepLinkListener: true, // Optional
      },
      (result) => {
        console.log(`${LOG_PREFIX} SUCCESS`, result);
      },
      (error) => {
        console.error(`${LOG_PREFIX} ERROR`, error);
      },
    );
  }
};
