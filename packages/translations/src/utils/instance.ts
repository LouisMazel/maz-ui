import type { TranslationsStore } from '../states'
import type { MazUiTranslationsInstance, MazUiTranslationsOptions, TranslationKey } from '../types'
import { toRaw } from 'vue'
import { createTranslationsStore } from '../states'
import { getAvailableLocales, getLoadedLocales, getMessages, isLocaleLoaded, isLocaleLoading, loadLocale, setLocale, setLocaleMessage } from './locales'
import { mergeMessages, t } from './messages'

export interface CreateMazUiTranslationsInternalOptions {
  /**
   * Store to use instead of a new one (the plugin in the browser uses the store of the deprecated exports)
   * @internal
   */
  store?: TranslationsStore
}

function registerUserMessages(store: TranslationsStore, messages: NonNullable<MazUiTranslationsOptions['messages']>): void {
  const { state } = store

  for (const [loc, msgs] of Object.entries(messages)) {
    // New messages for a locale already loaded (installed again): load it again with them
    if (toRaw(state.userMessages[loc]) !== toRaw(msgs)) {
      state.loadedLocales.delete(loc)
    }
    state.userMessages[loc] = msgs

    if (typeof msgs === 'object') {
      state.messages[loc] = mergeMessages(state.messages[loc] ?? {}, msgs)
    }
  }
}

/**
 * Creates a translations instance with its own locale and messages. The locale and the fallback
 * locale start loading at once: await `ready` before rendering on the server (SSR) or before the
 * hydration, so the first render has the messages.
 */
export function createMazUiTranslations(options: MazUiTranslationsOptions = {}, { store: providedStore }: CreateMazUiTranslationsInternalOptions = {}): MazUiTranslationsInstance {
  const {
    locale: initialLocale = 'en',
    fallbackLocale = 'en',
    preloadFallback = true,
    messages = {
      en: {},
    },
  } = options

  const store = providedStore ?? createTranslationsStore(initialLocale)
  store.locale.value = initialLocale
  registerUserMessages(store, messages)

  const ready = Promise.all([
    loadLocale(initialLocale, store),
    preloadFallback && fallbackLocale !== initialLocale
      ? loadLocale(fallbackLocale, store)
      : undefined,
  ]).then(() => {})

  return {
    locale: store.locale,
    t: (key: TranslationKey, variables?: Record<string, unknown>) => t(key, variables, fallbackLocale, store),
    setLocale: (newLocale: string) => setLocale(newLocale, store),
    isLocaleLoaded: (localeToCheck: string) => isLocaleLoaded(localeToCheck, store),
    isLocaleLoading: (localeToCheck: string) => isLocaleLoading(localeToCheck, store),
    setLocaleMessage: (targetLocale, localeMessages) => setLocaleMessage(targetLocale, localeMessages, store),
    getMessages: () => getMessages(store),
    getLoadedLocales: () => getLoadedLocales(store),
    getAvailableLocales: () => getAvailableLocales(store),
    ready,
  }
}
