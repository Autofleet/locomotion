import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from './en.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  resources: {
    en: {
      translation: en,
    },
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // not needed for react
    },
  },
});

export default i18n;
