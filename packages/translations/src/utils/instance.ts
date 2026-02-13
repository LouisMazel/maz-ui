import type { MazUiTranslationsInstance, MazUiTranslationsOptions, TranslationKey } from '../types'
import { globalState, locale } from '../states'
import { getAvailableLocales, getLoadedLocales, getMessages, isLocaleLoaded, isLocaleLoading, loadLocale, setLocale, setLocaleMessage } from './locales'
import { t } from './messages'

export function createMazUiTranslations(options: MazUiTranslationsOptions = {}) {
  const {
    locale: initialLocale = 'en',
    fallbackLocale = 'en',
    preloadFallback = true,
    messages = {
      en: {},
    },
  } = options

  locale.value = initialLocale

  for (const [loc, msgs] of Object.entries(messages)) {
    globalState.userMessages[loc] = msgs

    if (msgs && typeof msgs === 'object') {
      globalState.messages[loc] = { ...globalState.messages[loc], ...msgs }
    }
  }

  setTimeout(() => {
    loadLocale(initialLocale).catch(error => console.error(`[@maz-ui/translations] Failed to load locale: "${initialLocale}"`, error))
    if (preloadFallback && fallbackLocale !== initialLocale) {
      loadLocale(fallbackLocale).catch(error => console.error(`[@maz-ui/translations] Failed to load fallback locale: "${fallbackLocale}"`, error))
    }
  }, 0)

  const instance = {
    locale,
    t: (key: TranslationKey, variables?: Record<string, unknown>) => t(key, variables, fallbackLocale),
    setLocale,
    isLocaleLoaded,
    isLocaleLoading,
    setLocaleMessage,
    getMessages,
    getLoadedLocales,
    getAvailableLocales,
  } satisfies MazUiTranslationsInstance

  return instance
}
