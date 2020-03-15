const i18n = require('i18next');

const en = require('./en.json');

i18n
  .init({
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

module.exports = i18n;
