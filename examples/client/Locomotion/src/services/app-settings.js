import Config from 'react-native-config';
import Storage from './storage';

const keyName = 'devSettings';

const { SERVER_HOST, OPERATION_ID, STRIPE_PUBLISHER_KEY } = Config;

const keyFallbackMap = {
  serverUrl: SERVER_HOST,
  operationId: OPERATION_ID,
  stripeKey: STRIPE_PUBLISHER_KEY,
};
const AppSettings = {
  getSettings: async () => {
    const res = await Storage.get(keyName);
    return res || {};
  },
  getKeyWithFallback: async (key) => {
    const { [key]: value } = await AppSettings.getSettings();
    return value && value.length > 0 ? value : keyFallbackMap[key];
  },
  getServerUrl: async () => AppSettings.getKeyWithFallback('serverUrl'),
  getOperationId: async () => AppSettings.getKeyWithFallback('operationId'),
  getStripeKey: async () => AppSettings.getKeyWithFallback('stripeKey'),
  setSettings: async (newSettingKeyObject) => {
    const currentSettings = await AppSettings.getSettings();
    await Storage.save({
      [keyName]: {
        ...currentSettings,
        ...newSettingKeyObject,
      },
    });
  },
  setOperationId: async newOperationId => AppSettings.setSettings({ operationId: newOperationId }),
  destroy: async () => Storage.clear(),
};

export default AppSettings;
