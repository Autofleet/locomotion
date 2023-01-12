import i18n from 'i18next';
import _ from 'lodash';
import * as axios from 'axios';
import { initReactI18next } from 'react-i18next';
import i18nHttpLoader from 'i18next-http-backend';
import Backend from '@autofleet/i18next-remote-backend-with-locals';
import * as RNLocalize from 'react-native-localize';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/el';
import 'moment/locale/fr';
import Config from 'react-native-config';
import Mixpanel from '../services/Mixpanel';
import { StorageService } from '../services';

import en from './en.json';
import el from './el.json';
import es from './es.json';
import fr from './fr.json';

const USER_LANGUAGE_STORAGE_KEY = 'userLanguage';

const DEFAULT_LANGUAGE_CODE = 'en';

const getUserLanguage = async () => {
  const languageCode = await StorageService.get(USER_LANGUAGE_STORAGE_KEY);
  return languageCode;
};

const extractLanguageFromUrl = (url) => {
  if (!url) {
    return DEFAULT_LANGUAGE_CODE;
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

export const supportedLanguages = {
  en: {
    label: 'English',
    translation: en,
  },
  el: {
    label: 'Ελληνικά',
    translation: el,
  },
  es: {
    label: 'Español',
    translation: es,
  },
  fr: {
    label: 'Français',
    translation: fr,
  },
};

export const getPreferredLanguageCode = async () => (
  (await getUserLanguage())
  || (Object.keys(supportedLanguages).includes(RNLocalize.getLocales()[0].languageCode)
    ? RNLocalize.getLocales()[0].languageCode
    : DEFAULT_LANGUAGE_CODE)
);

(async () => {
  userLanguage = await getPreferredLanguageCode();
  moment.locale(userLanguage);
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

const localResources = {
  en,
  el,
  es,
  fr,
};

i18n
  .use(languageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE_CODE,
    backend: {
      localResources,
      remoteBackend: {
        type: i18nHttpLoader,
        options: {
          loadPath: `${Config.LANGUAGE_FILES_STORAGE}/{{lng}}.json?timestamp=${moment().format('HH:mm')}`,
          parse: data => data,
          request: async (options, url, payload, callback) => {
            try {
              const { data, status } = await axios.get(url);
              const lng = extractLanguageFromUrl(url);
              callback(null, {
                status,
                data: _.merge(localResources[lng], data),
              });
              i18n.emit('loaded');
            } catch (err) {
              callback(err, null);
            }
          },
        },
      },
    },
  });

export const updateLanguage = (lng, onDone) => {
  const updatedLng = lng || userLanguage;
  i18n.changeLanguage(updatedLng, async (err) => {
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
