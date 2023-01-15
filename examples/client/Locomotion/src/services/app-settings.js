import Config from 'react-native-config';
import Storage from './storage';

const keyName = 'devSettings';

const { SERVER_HOST } = Config;

const AppSettings = {
  getSettings: async () => {
    const res = await Storage.get(keyName);
    return res || {};
  },
  getServerUrl: async () => {
    const { serverHost } = await AppSettings.getSettings();
    return serverHost && serverHost.length > 0 ? serverHost : SERVER_HOST;
  },
  setSettings: async (newSettingKeyObject) => {
    const currentSettings = await AppSettings.getSettings();
    await Storage.save({
      [keyName]: {
        ...currentSettings,
        newSettingKeyObject,
      },
    });
  },
  destroy: async () => Storage.clear(),
};

export default AppSettings;
