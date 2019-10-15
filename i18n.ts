import NextI18Next, { WithTranslation } from 'next-i18next';

export const languages = ['en', 'fr'];

const NextI18NextInstance = new NextI18Next({
  defaultLanguage: languages[0],
  otherLanguages: languages.splice(1),
  load: 'languageOnly',

  browserLanguageDetection: false,
  serverLanguageDetection: false,

  // have a common namespace used around the full app
  ns: ['common'],
  defaultNS: 'common',

  debug: false, // process.env.NODE_ENV !== 'production',
  saveMissing: false
});

export default NextI18NextInstance;

export type WithTranslation = WithTranslation;

export const {
  appWithTranslation,
  withTranslation
} = NextI18NextInstance;
