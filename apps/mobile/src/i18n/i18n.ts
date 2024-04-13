import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEN from '@/i18n/messages/en.json'
import translationFR from '@/i18n/messages/fr.json'

const resources = {
  en: {
    translation: translationEN,
  },
  fr: {
    translation: translationFR,
  },
}

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'en', // language to use (if you want to use a different language, make sure it's available in 'resources')
    fallbackLng: 'en', // language to use if translations in user language are not available

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
