// core.ts - Really optimized version
import type { MazTranslationsInstance, MazTranslationsMessages, MazTranslationsOptions, MazTranslationsSchema, TranslationKey } from './types'
import { reactive, ref } from 'vue'

// Create dynamic loaders for default locales
const defaultLocalesLoaders: Record<string, () => Promise<{ default: MazTranslationsSchema }>> = {
  './locales/de.ts': () => import('./locales/de').then(m => ({ default: m.default })),
  './locales/en.ts': () => import('./locales/en').then(m => ({ default: m.default })),
  './locales/es.ts': () => import('./locales/es').then(m => ({ default: m.default })),
  './locales/fr.ts': () => import('./locales/fr').then(m => ({ default: m.default })),
  './locales/it.ts': () => import('./locales/it').then(m => ({ default: m.default })),
  './locales/ja.ts': () => import('./locales/ja').then(m => ({ default: m.default })),
  './locales/pt.ts': () => import('./locales/pt').then(m => ({ default: m.default })),
  './locales/zh-CN.ts': () => import('./locales/zh-CN').then(m => ({ default: m.default })),
}

// Cache for loaded default messages
const defaultMessagesCache = new Map<string, MazTranslationsSchema>()

// Global state - created immediately but empty
const globalState = reactive({
  loadedLocales: new Set<string>(),
  messages: {} as Record<string, Partial<MazTranslationsSchema>>,
  userMessages: {} as MazTranslationsMessages,
  loadingPromises: new Map<string, Promise<void>>(),
})

function getMessage(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

function setMessage(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {}
    }
    return current[key]
  }, obj)
  target[lastKey] = value
}

function isFlattenedObject(obj: any): boolean {
  if (!obj || typeof obj !== 'object')
    return false
  return Object.keys(obj).some(key => key.includes('.'))
}

function flattenToNested(flatObj: any): any {
  if (!isFlattenedObject(flatObj)) {
    return flatObj
  }

  const nested: any = {}
  for (const [key, value] of Object.entries(flatObj)) {
    if (key.includes('.')) {
      setMessage(nested, key, value)
    }
    else {
      nested[key] = value
    }
  }
  return nested
}

function mergeMessages<T extends Partial<MazTranslationsSchema>>(target: T, source: T): T {
  const normalizedSource = flattenToNested(source)
  const normalizedTarget = flattenToNested(target)

  const result = { ...normalizedTarget }
  for (const key in normalizedSource) {
    if (normalizedSource[key] && typeof normalizedSource[key] === 'object') {
      result[key] = mergeMessages(result[key] || {}, normalizedSource[key])
    }
    else {
      result[key] = normalizedSource[key]
    }
  }
  return result
}

function interpolate(message: string, variables?: Record<string, unknown>): string {
  if (!variables)
    return message

  return message.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined ? String(variables[key]) : match
  })
}

// Load default messages asynchronously
async function loadDefaultMessages(locale: string): Promise<MazTranslationsSchema> {
  // Check cache first
  if (defaultMessagesCache.has(locale)) {
    return defaultMessagesCache.get(locale)!
  }

  // Find the loader for this locale
  const loaderPath = `./locales/${locale}.ts`
  const loader = defaultLocalesLoaders[loaderPath]

  if (!loader) {
    return {}
  }

  try {
    const module = await loader()
    const messages = module.default
    defaultMessagesCache.set(locale, messages)
    return messages
  }
  catch (error) {
    console.error(`Failed to load default messages for locale "${locale}":`, error)
    return {}
  }
}

// Load a locale asynchronously
function loadLocale(targetLocale: string): Promise<void> {
  // If already loaded, return immediately
  if (globalState.loadedLocales.has(targetLocale)) {
    return Promise.resolve()
  }

  // If already loading, return the existing promise
  if (globalState.loadingPromises.has(targetLocale)) {
    return globalState.loadingPromises.get(targetLocale)!
  }

  // Create the loading promise
  const loadingPromise = (async () => {
    try {
      // Load default messages asynchronously
      const localeDefaultMessages = await loadDefaultMessages(targetLocale)
      let localeUserMessages: Partial<MazTranslationsSchema> = {}

      // Get user messages
      const userLoader = globalState.userMessages[targetLocale]
      if (userLoader) {
        if (typeof userLoader === 'function') {
          try {
            const userMessages = await userLoader()
            localeUserMessages = 'default' in userMessages ? userMessages.default : userMessages
          }
          catch (error) {
            console.error(`Failed to load user translations for locale "${targetLocale}":`, error)
            localeUserMessages = {}
          }
        }
        else {
          localeUserMessages = userLoader
        }
      }

      // Merge and store messages
      globalState.messages[targetLocale] = mergeMessages(localeDefaultMessages, localeUserMessages)
      globalState.loadedLocales.add(targetLocale)
    }
    catch (error) {
      console.error(`Failed to load translations for locale "${targetLocale}":`, error)
      globalState.messages[targetLocale] = {}
      globalState.loadedLocales.add(targetLocale)
    }
    finally {
      // Clean up the loading promise
      globalState.loadingPromises.delete(targetLocale)
    }
  })()

  // Store the promise to avoid multiple loads
  globalState.loadingPromises.set(targetLocale, loadingPromise)
  return loadingPromise
}

export function createMazTranslations(options: MazTranslationsOptions = {}) {
  const {
    locale: initialLocale = 'en',
    fallbackLocale = 'en',
    preloadFallback = true,
    messages = {},
  } = options

  // Local reactive state
  const locale = ref(initialLocale)

  // Store user messages in global state
  for (const [loc, msgs] of Object.entries(messages)) {
    globalState.userMessages[loc] = msgs

    if (msgs && typeof msgs === 'object') {
      globalState.messages[loc] = { ...globalState.messages[loc], ...msgs }
    }
  }

  // Asynchronous loading of real translations in the background
  setTimeout(() => {
    loadLocale(initialLocale).catch(console.error)
    if (preloadFallback && fallbackLocale !== initialLocale) {
      loadLocale(fallbackLocale).catch(console.error)
    }
  }, 0)

  // Translation function with smart fallback
  function t(key: TranslationKey, variables?: Record<string, unknown>) {
    // Try with the current locale
    let message = getMessage(globalState.messages[locale.value], key)

    // Fallback to the fallback locale
    if (!message && fallbackLocale && locale.value !== fallbackLocale) {
      if (!globalState.loadedLocales.has(fallbackLocale)) {
        // Load asynchronously if not yet loaded
        loadLocale(fallbackLocale).catch(console.error)
        return key // Immediate return to avoid blocking
      }
      message = getMessage(globalState.messages[fallbackLocale], key)
    }

    // Final fallback to English
    if (!message && fallbackLocale !== 'en' && locale.value !== 'en') {
      if (!globalState.loadedLocales.has('en')) {
        loadLocale('en').catch(console.error)
        return key
      }
      message = getMessage(globalState.messages.en, key)
    }

    // Return the key if no translation found
    if (!message) {
      console.warn(`[@maz-ui/translations] Translation not found for key: ${key}`)
      return key
    }

    return interpolate(String(message), variables)
  }

  // Change locale with asynchronous loading
  async function setLocale(newLocale: string) {
    // Load the new locale if needed
    if (!globalState.loadedLocales.has(newLocale)) {
      await loadLocale(newLocale)
    }

    // Change the locale (reactive)
    locale.value = newLocale
  }

  // Function to check if a locale is loaded
  function isLocaleLoaded(localeToCheck: string) {
    return globalState.loadedLocales.has(localeToCheck)
  }

  // Function to check if a locale is loading
  function isLocaleLoading(localeToCheck: string) {
    return globalState.loadingPromises.has(localeToCheck)
  }

  // Function to get available locales
  function getAvailableLocales() {
    const locales = new Set<string>()

    for (const [path, loader] of Object.entries(defaultLocalesLoaders)) {
      if (loader && typeof loader === 'function') {
        locales.add(path.replace('./locales/', '').replace('.ts', ''))
      }
    }

    for (const path of Object.keys(globalState.userMessages)) {
      locales.add(path)
    }

    return Array.from(locales)
  }

  // Function to get messages
  function getMessages() {
    return globalState.messages
  }

  // Function to get loaded locales
  function getLoadedLocales() {
    return Object.keys(globalState.messages)
  }

  // Function to add messages to an existing locale
  function setLocaleMessage(targetLocale: string, messages: Partial<MazTranslationsSchema>) {
    if (!globalState.messages[targetLocale]) {
      globalState.messages[targetLocale] = {}
    }
    globalState.messages[targetLocale] = mergeMessages(globalState.messages[targetLocale], messages)
    globalState.loadedLocales.add(targetLocale)
  }

  const instance = {
    locale,
    t,
    setLocale,
    isLocaleLoaded,
    isLocaleLoading,
    getAvailableLocales,
    setLocaleMessage,
    getMessages,
    getLoadedLocales,
  } satisfies MazTranslationsInstance

  return instance
}
