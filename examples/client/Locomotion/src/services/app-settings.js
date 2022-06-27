import Config from 'react-native-config';
import Storage from './storage';

const keyName = 'settings';

const { SERVER_HOST } = Config;

const AppSettings = {
  getSettings: async () => {
    if (AppSettings.settings) {
      console.log('Return from cache delete me');
      return AppSettings.settings;
    }
    const res = await Storage.get(keyName);
    return res || {};
  },
  getServerUrl: async () => SERVER_HOST,
  destroy: () => Storage.clear(),
};

export default AppSettings;
