import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';

const ns: any = ['translation'];
const defaultNS: any = 'translation';
const interpolation: any = {
  escapeValue: false, // not needed for react
};

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: en,
      },
      ns,
      defaultNS,
      interpolation,
    },
  });

export default i18n;
