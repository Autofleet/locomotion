import VersionCheck from 'react-native-version-check';
import { Alert, BackHandler, Linking } from 'react-native';
import Config from 'react-native-config';
import i18n from '../I18n';

const showUpdateVersionAlert = (updateData: {
  isNeeded: boolean;
  currentVersion: string;
  latestVersion: string;
  storeUrl: string;
}) => {
  Alert.alert(
    i18n.t('updateVersion.title', {
      appName: Config.OPERATION_NAME,
    }), i18n.t('updateVersion.body'),
    [
      {
        text: i18n.t('updateVersion.buttonText'),
        onPress: () => {
          if (updateData?.storeUrl) {
            BackHandler.exitApp();
            Linking.openURL(updateData.storeUrl);
          }
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
      showUpdateVersionAlert(updateData);
    }
  }
};
