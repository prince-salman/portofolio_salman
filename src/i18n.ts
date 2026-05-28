import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import id from './locales/id.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import pt from './locales/pt.json';
import ar from './locales/ar.json';

const resources = {
  id: { translation: id },
  en: { translation: en },
  zh: { translation: zh },
  pt: { translation: pt },
  ar: { translation: ar },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'id',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
