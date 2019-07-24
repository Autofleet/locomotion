import Config from 'react-native-config';
import Storage from './storage';

const keyName = 'settings';

const { SERVER_HOST } = Config;

console.log('SERVER_HOST', SERVER_HOST);

const AppSettings = {
  update: async (settings) => {
    AppSettings.settings = settings;
    Storage.update({ [keyName]: settings });
  },
  getSettings: async () => {
    if (AppSettings.settings) {
      console.log('Return from cache delete me');
      return AppSettings.settings;
    }
    const res = await Storage.get(keyName);
    return res || {};
  },
  getServerUrl: async () => SERVER_HOST, // const { serverUrl } = await AppSettings.getSettings();
  // return serverUrl && serverUrl.length > 0 ? serverUrl : SERVER_HOST;


  destroy: () => Storage.clear(),
};

module.exports = AppSettings;
