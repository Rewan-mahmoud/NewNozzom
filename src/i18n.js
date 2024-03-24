import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { setLanguage } from "./features/ln/i18nSlice";
import ar from "./languages/ar.json"; 
import en from "./languages/en.json"; 
import store from "./app/store";

// Translations
const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ar",
    keySeparator: false,
    lng: 'ar',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on("languageChanged", (lng) => {
  store.dispatch(setLanguage(lng));
});

export default i18n;
