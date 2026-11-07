import type { TranslationsStore } from '../states'
import type { MazUiTranslationsMessages, MazUiTranslationsSchema } from '../types'
import en from '../locales/en'
import { legacyStore } from '../states'
import { mergeMessages } from './messages'

/** Default messages loaded on demand. English is bundled: it is the default locale and the last fallback, so the first render never shows keys. */
const lazyDefaultLocales: Record<string, () => Promise<{ default: MazUiTranslationsSchema }>> = {
  'de': () => import('./../locales/de'),
  'es': () => import('./../locales/es'),
  'fr': () => import('./../locales/fr'),
  'it': () => import('./../locales/it'),
  'ja': () => import('./../locales/ja'),
  'pt': () => import('./../locales/pt'),
  'zh-CN': () => import('./../locales/zh-CN'),
}

/** Default messages are static: the cache is shared by every instance and every server request. */
const defaultMessagesCache = new Map<string, MazUiTranslationsSchema>([
  ['en', en],
])

function hasDefaultMessages(locale: string): boolean {
  return locale === 'en' || locale in lazyDefaultLocales
}

/** Default messages available without waiting: cached, or empty for a locale without default messages. */
function getCachedDefaultMessages(locale: string): MazUiTranslationsSchema | undefined {
  if (defaultMessagesCache.has(locale))
    return defaultMessagesCache.get(locale)

  return hasDefaultMessages(locale)
    ? undefined
    : {}
}

async function importDefaultMessages(locale: string): Promise<MazUiTranslationsSchema> {
  const { default: messages } = await lazyDefaultLocales[locale]()
  defaultMessagesCache.set(locale, messages)
  return messages
}

export async function loadDefaultMessages(locale: string): Promise<MazUiTranslationsSchema> {
  const cached = getCachedDefaultMessages(locale)
  if (cached)
    return cached

  try {
    return await importDefaultMessages(locale)
  }
  catch (error) {
    console.error(`[@maz-ui/translations] Failed to load default messages for locale "${locale}":`, error)
    return {}
  }
}

async function resolveUserMessages(userMessages: MazUiTranslationsMessages[string] | undefined): Promise<Partial<MazUiTranslationsSchema>> {
  if (typeof userMessages !== 'function')
    return userMessages ?? {}

  const resolved = await userMessages()
  return 'default' in resolved
    ? resolved.default
    : resolved
}

function applyLocaleMessages(store: TranslationsStore, targetLocale: string, defaultMessages: MazUiTranslationsSchema, userMessages: Partial<MazUiTranslationsSchema>): void {
  store.state.messages[targetLocale] = mergeMessages(
    mergeMessages(defaultMessages, userMessages),
    store.overrides[targetLocale] ?? {},
  )
}

export function getAvailableLocales(store: TranslationsStore = legacyStore) {
  const locales = new Set<string>()

  for (const defaultLocale of [
    'en',
    ...Object.keys(lazyDefaultLocales),
  ]) {
    locales.add(defaultLocale)
  }

  for (const path of Object.keys(store.state.userMessages)) {
    locales.add(path)
  }

  return [...locales]
}

/**
 * Loads the default and user messages of a locale. Applied synchronously when they are already
 * available (English, a cached locale, object messages). Never rejects: a failure is logged, the
 * locale stays not loaded and the next explicit call retries.
 */
export function loadLocale(targetLocale: string, store: TranslationsStore = legacyStore): Promise<void> {
  const { state } = store

  if (state.loadedLocales.has(targetLocale)) {
    return Promise.resolve()
  }

  const pending = state.loadingPromises.get(targetLocale)
  if (pending) {
    return pending
  }

  store.failedLocales.delete(targetLocale)
  const userLoader = state.userMessages[targetLocale]
  const cachedDefaultMessages = getCachedDefaultMessages(targetLocale)

  if (cachedDefaultMessages && typeof userLoader !== 'function') {
    applyLocaleMessages(store, targetLocale, cachedDefaultMessages, userLoader ?? {})
    state.loadedLocales.add(targetLocale)
    return Promise.resolve()
  }

  const loadingPromise = (async () => {
    try {
      const defaultMessages = cachedDefaultMessages ?? await importDefaultMessages(targetLocale)

      try {
        applyLocaleMessages(store, targetLocale, defaultMessages, await resolveUserMessages(userLoader))
        state.loadedLocales.add(targetLocale)
      }
      catch (error) {
        console.error(`[@maz-ui/translations] Failed to load user translations for locale "${targetLocale}":`, error)
        applyLocaleMessages(store, targetLocale, defaultMessages, {})
        store.failedLocales.add(targetLocale)
      }
    }
    catch (error) {
      console.error(`[@maz-ui/translations] Failed to load translations for locale "${targetLocale}":`, error)
      store.failedLocales.add(targetLocale)
    }
    finally {
      state.loadingPromises.delete(targetLocale)
    }
  })()

  state.loadingPromises.set(targetLocale, loadingPromise)
  return loadingPromise
}

export function getMessages(store: TranslationsStore = legacyStore) {
  return store.state.messages
}

export function isLocaleLoaded(localeToCheck: string, store: TranslationsStore = legacyStore) {
  return store.state.loadedLocales.has(localeToCheck)
}

export function isLocaleLoading(localeToCheck: string, store: TranslationsStore = legacyStore) {
  return store.state.loadingPromises.has(localeToCheck)
}

/**
 * Adds messages to a locale, over its default and user messages. The default messages of the
 * locale are still loaded when it is used.
 */
export function setLocaleMessage(targetLocale: string, messages: Partial<MazUiTranslationsSchema>, store: TranslationsStore = legacyStore) {
  const { state } = store
  store.overrides[targetLocale] = mergeMessages(store.overrides[targetLocale] ?? {}, messages)
  state.messages[targetLocale] = mergeMessages(state.messages[targetLocale] ?? {}, messages)

  // Nothing else to load for a locale without default nor user messages
  if (!hasDefaultMessages(targetLocale) && state.userMessages[targetLocale] === undefined) {
    state.loadedLocales.add(targetLocale)
  }
}

/** Switches the locale once its messages are loaded. The last call wins over a slower previous one. */
export async function setLocale(newLocale: string, store: TranslationsStore = legacyStore) {
  const request = ++store.localeRequest

  if (!store.state.loadedLocales.has(newLocale)) {
    await loadLocale(newLocale, store)
  }

  if (request === store.localeRequest) {
    store.locale.value = newLocale
  }
}

export function getLoadedLocales(store: TranslationsStore = legacyStore) {
  return [...store.state.loadedLocales]
}
