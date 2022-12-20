import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/el';
import Mixpanel from '../services/Mixpanel';
import { StorageService } from '../services';

import en from './en.json';
import fr from './fr.json';
import elGR from './el_GR.json';

const USER_LANGUAGE_STORAGE_KEY = 'userLanguage';

const getUserLanguage = async () => {
  const languageCode = await StorageService.get(USER_LANGUAGE_STORAGE_KEY);
  return languageCode;
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
  el_GR: {
    label: 'Ελληνικά',
    translation: elGR,
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      ...supportedLanguages,
      ns: ['translation'],
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false, // not needed for react
      },
    },
  });

(async () => {
  moment.locale(userLanguage);
})();


export const updateLanguage = (lng, onDone) => {
  const updatedLng = lng || RNLocalize.getLocales()[0].languageCode;
  i18n.changeLanguage(updatedLng, async (err) => {
    if (!err) {
      userLanguage = updatedLng;
      await updateUserLanguage(updatedLng);
      moment.locale(updatedLng);
      Mixpanel.setEvent('languageChanged', { language: (lng || 'phone default') });
      if (onDone) {
        onDone();
      }
    }
  });
};

export default i18n;
