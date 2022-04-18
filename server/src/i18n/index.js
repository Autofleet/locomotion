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

if (process.env.I18N_LANG) {
  const lang = process.env.I18N_LANG;
  // eslint-disable-next-line
  i18n.addResourceBundle(lang, 'translation', require(`./${lang}.json`), true, true);
  i18n.changeLanguage(lang);
}
module.exports = i18n;
