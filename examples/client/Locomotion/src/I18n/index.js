import i18n from 'i18next';
import _ from 'lodash';
import * as axios from 'axios';
import { initReactI18next } from 'react-i18next';
import i18nHttpLoader from 'i18next-http-backend';
import Backend from '@autofleet/i18next-remote-backend-with-locals';
import * as RNLocalize from 'react-native-localize';
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/el';
import Mixpanel from '../services/Mixpanel';
import { StorageService } from '../services';

import en from './en.json';
import fr from './fr.json';
import el from './el.json';

const USER_LANGUAGE_STORAGE_KEY = 'userLanguage';

const getUserLanguage = async () => {
  const languageCode = await StorageService.get(USER_LANGUAGE_STORAGE_KEY);
  return languageCode;
};

const extractLanguageFromUrl = (url) => {
  console.log(`##### url: ${url}`);
  if (!url) {
    return 'en';
  }
  const endpoints = url.split('/');
  const lastEndpoint = endpoints[endpoints.length - 1];
  return lastEndpoint.split('.')[0];
};

const updateUserLanguage = chosenLanguageCode => StorageService.save(
  { [USER_LANGUAGE_STORAGE_KEY]: chosenLanguageCode },
);

let userLanguage;

export const getUserLanguageCode = () => userLanguage;

export const getPreferredLanguageCode = async () => (
  (await getUserLanguage())
  || RNLocalize.getLocales()[0].languageCode
);

(async () => {
  userLanguage = await getPreferredLanguageCode();
})();


const languageDetector = {
  type: 'languageDetector',
  async: true, // async detection
  // eslint-disable-next-line no-return-await
  detect: async cb => cb(await getPreferredLanguageCode()),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cacheUserLanguage: () => {},
};

export const supportedLanguages = {
  en: {
    label: 'English',
    translation: en,
  },
  fr: {
    label: 'Français',
    translation: fr,
  },
  el: {
    label: 'Ελληνικά',
    translation: el,
  },
};

const localResources = {
  en,
  fr,
  el,
};

i18n
  .use(languageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    backend: {
      localResources,
      remoteBackend: {
        type: i18nHttpLoader,
        options: {
          loadPath: `https://storage.googleapis.com/language-files/locomotion/{{lng}}.json?timestamp=${moment().format('HH:mm')}`,
          parse: data => data,
          request: async (options, url, payload, callback) => {
            try {
              console.log('#### trying request', {
                options, url, payload, callback,
              });
              const { data, status } = await axios.get(url);
              console.log(`#### data status: ${status}`);
              const lng = extractLanguageFromUrl(url);
              console.log(`#### extracted lng: ${lng}`);
              callback(null, {
                status,
                data: _.merge(localResources[lng], data),
              });
              i18n.emit('loaded');
            } catch (err) {
              console.error('#### request error', err);
              callback(err, null);
            }
          },
        },
      },
    },
  });

(async () => {
  moment.locale(userLanguage);
})();


export const updateLanguage = (lng, onDone) => {
  console.log(`#### updated language 1 ${lng}`);
  const updatedLng = lng || userLanguage;
  i18n.changeLanguage(updatedLng, async (err) => {
    console.log('#### updated language 2', { err, updatedLng });
    if (!err) {
      userLanguage = updatedLng;
      await updateUserLanguage(updatedLng);
      moment.locale(updatedLng);
      Mixpanel.setEvent('language selected', {
        selectedLanguage: updatedLng,
        deviceLanguage: RNLocalize.getLocales()[0].languageCode,
      });
      if (onDone) {
        onDone();
      }
    }
  });
};

export default i18n;
