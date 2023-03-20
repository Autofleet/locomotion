import VersionCheck from 'react-native-version-check';
import { Alert, BackHandler, Linking } from 'react-native';
import Config from 'react-native-config';
import { exitApp } from 'react-native-exit-app';
import DeviceInfo from 'react-native-device-info';
import i18n from '../I18n';

const showUpdateVersionAlert = () => {
  Alert.alert(
    i18n.t('updateVersion.title', {
      appName: Config.OPERATION_NAME,
    }),
    i18n.t('updateVersion.body'),
    [
      {
        text: i18n.t('updateVersion.buttonText'),
        onPress: async () => {
          const bundleId = await DeviceInfo.getBundleId();
          const storeUrl = await VersionCheck.getStoreUrl({
            appID: Config.APP_ID,
            packageName: bundleId,
          });

          if (storeUrl) {
            Linking.openURL(storeUrl);
          }

          exitApp();
        },
      },
    ],
    { cancelable: false },
  );
};

// eslint-disable-next-line import/prefer-default-export
export const checkVersionAndForceUpdateIfNeeded = async (minAppVersion?: string) => {
  if (minAppVersion) {
    const updateData = await VersionCheck.needUpdate({
      forceUpdate: true,
      latestVersion: minAppVersion,
    });

    if (updateData?.isNeeded) {
      showUpdateVersionAlert();
    }
  }
};
