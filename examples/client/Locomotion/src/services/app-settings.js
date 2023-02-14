import Config from 'react-native-config';
import Storage from './storage';

const keyName = 'devSettings';

const { SERVER_HOST, OPERATION_ID } = Config;

const keyFallbackMap = {
  serverUrl: SERVER_HOST,
  operationId: OPERATION_ID,
};
const AppSettings = {
  getSettings: async () => {
    const res = await Storage.get(keyName);
    return res || {};
  },
  getKeyWithFallback: async (key) => {
    const { [key]: value } = await AppSettings.getSettings();
    return value && value.length > 0 ? value : keyFallbackMap(key);
  },
  getServerUrl: async () => AppSettings.getSafeKey('serverUrl'),
  getOperationId: async () => AppSettings.getSafeKey('operationId'),
  setSettings: async (newSettingKeyObject) => {
    const currentSettings = await AppSettings.getSettings();
    await Storage.save({
      [keyName]: {
        ...currentSettings,
        ...newSettingKeyObject,
      },
    });
  },
  destroy: async () => Storage.clear(),
};

export default AppSettings;
