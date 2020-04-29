import Vue from 'vue'
export const getDefaultLocale = () => {
  if (typeof window === 'undefined') return null

  const { userLanguage, language } = window.navigator
  const locale = (userLanguage || language || 'en').substr(0, 2)
  return locale
}

export const EventBus = new Vue()
