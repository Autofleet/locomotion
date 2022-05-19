import i18n from 'i18next';

const en = require('./en.json');

const ns: any = ['translation'];
const defaultNS: any = 'translation';
const interpolation: any = {
  escapeValue: false, // not needed for react
};

i18n
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
  }, null);

if (process.env.I18N_LANG) {
  const lang = process.env.I18N_LANG;
  // eslint-disable-next-line
  i18n.addResourceBundle(lang, 'translation', require(`./${lang}.json`), true, true);
  i18n.changeLanguage(lang);
}
export default i18n;
