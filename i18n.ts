import i18n from 'i18next';
import XhrBackend from 'i18next-xhr-backend';
import SyncNodeBackend from 'i18next-sync-fs-backend';
//import { Namespace } from 'react-i18next';
//import { NextPageContext } from 'next';

const languages = ['en', 'fr'];

// initialize if not already initialized
if (!i18n.isInitialized) {
  const isBrowser = !!(process as any).browser;

  // for browser use xhr backend to load translations
  if(isBrowser) {
    i18n.use(XhrBackend);
  } else {
    i18n.use(SyncNodeBackend);
  }

  i18n.init({
    lng: languages[0], // to avoid https://github.com/i18next/react-i18next/issues/923
    fallbackLng: languages[0],
    load: 'languageOnly',
    preload: isBrowser ? false : languages,
  
    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
  
    initImmediate: isBrowser,
    backend: {
      loadPath: (isBrowser ? '/' : '') + 'static/locales/{{lng}}/{{ns}}.json'
    },

    debug: false, // process.env.NODE_ENV !== 'production',
    saveMissing: false,
  
    interpolation: {
      escapeValue: false, // not needed for react, it escapes by default
      formatSeparator: ',',
      format: (value, format, lng) => {
        if (format === 'uppercase') return value.toUpperCase();
        return value;
      }
    }
  });
}

export { i18n, languages };
