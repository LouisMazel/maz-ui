import type { MazUiTranslationsInstance, MazUiTranslationsMessages, MazUiTranslationsOptions, MazUiTranslationsSchema, TranslationKey } from './types'
import { reactive, ref } from 'vue'

const defaultLocalesLoaders: Record<string, () => Promise<{ default: MazUiTranslationsSchema }>> = {
  './locales/en.ts': () => import('./locales/en').then(m => ({ default: m.default })),
  './locales/de.ts': () => import('./locales/de').then(m => ({ default: m.default })),
  './locales/es.ts': () => import('./locales/es').then(m => ({ default: m.default })),
  './locales/fr.ts': () => import('./locales/fr').then(m => ({ default: m.default })),
  './locales/it.ts': () => import('./locales/it').then(m => ({ default: m.default })),
  './locales/ja.ts': () => import('./locales/ja').then(m => ({ default: m.default })),
  './locales/pt.ts': () => import('./locales/pt').then(m => ({ default: m.default })),
  './locales/zh-CN.ts': () => import('./locales/zh-CN').then(m => ({ default: m.default })),
}

const defaultMessagesCache = new Map<string, MazUiTranslationsSchema>()

const locale = ref<string>('en')

const globalState = reactive({
  loadedLocales: new Set<string>(),
  messages: {} as Record<string, Partial<MazUiTranslationsSchema>>,
  userMessages: {} as MazUiTranslationsMessages,
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

function mergeMessages<T extends Partial<MazUiTranslationsSchema>>(target: T, source: T): T {
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

async function loadDefaultMessages(locale: string): Promise<MazUiTranslationsSchema> {
  if (defaultMessagesCache.has(locale)) {
    return defaultMessagesCache.get(locale)!
  }

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

function loadLocale(targetLocale: string): Promise<void> {
  if (globalState.loadedLocales.has(targetLocale)) {
    return Promise.resolve()
  }

  if (globalState.loadingPromises.has(targetLocale)) {
    return globalState.loadingPromises.get(targetLocale)!
  }

  const loadingPromise = (async () => {
    try {
      const localeDefaultMessages = await loadDefaultMessages(targetLocale)
      let localeUserMessages: Partial<MazUiTranslationsSchema> = {}

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

      globalState.messages[targetLocale] = mergeMessages(localeDefaultMessages, localeUserMessages)
      globalState.loadedLocales.add(targetLocale)
    }
    catch (error) {
      console.error(`Failed to load translations for locale "${targetLocale}":`, error)
      globalState.messages[targetLocale] = {}
      globalState.loadedLocales.add(targetLocale)
    }
    finally {
      globalState.loadingPromises.delete(targetLocale)
    }
  })()

  globalState.loadingPromises.set(targetLocale, loadingPromise)
  return loadingPromise
}

function isLocaleLoaded(localeToCheck: string) {
  return globalState.loadedLocales.has(localeToCheck)
}

function isLocaleLoading(localeToCheck: string) {
  return globalState.loadingPromises.has(localeToCheck)
}

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

function getMessages() {
  return globalState.messages
}

function getLoadedLocales() {
  return Object.keys(globalState.messages)
}

function setLocaleMessage(targetLocale: string, messages: Partial<MazUiTranslationsSchema>) {
  if (!globalState.messages[targetLocale]) {
    globalState.messages[targetLocale] = {}
  }
  globalState.messages[targetLocale] = mergeMessages(globalState.messages[targetLocale], messages)
  globalState.loadedLocales.add(targetLocale)
}

function t(key: TranslationKey, variables?: Record<string, unknown>, fallbackLocale?: string) {
  let message = getMessage(globalState.messages[locale.value], key)

  if (!message && fallbackLocale && locale.value !== fallbackLocale) {
    if (!globalState.loadedLocales.has(fallbackLocale)) {
      loadLocale(fallbackLocale).catch(error => console.error(`[@maz-ui/translations] Failed to load fallback locale: "${fallbackLocale}"`, error))
    }
    message = getMessage(globalState.messages[fallbackLocale], key)
  }

  if (!message && fallbackLocale !== 'en' && locale.value !== 'en') {
    if (!globalState.loadedLocales.has('en')) {
      loadLocale('en').catch(error => console.error(`[@maz-ui/translations] Failed to load en locale: "en"`, error))
      return key
    }
    message = getMessage(globalState.messages.en, key)
  }

  if (!message) {
    console.warn(`[@maz-ui/translations] Translation not found for key: "${key}"`)
    return key
  }

  return interpolate(String(message), variables)
}

async function setLocale(newLocale: string) {
  if (!globalState.loadedLocales.has(newLocale)) {
    await loadLocale(newLocale)
  }

  locale.value = newLocale
}

export function createMazTranslations(options: MazUiTranslationsOptions = {}) {
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
    getAvailableLocales,
    setLocaleMessage,
    getMessages,
    getLoadedLocales,
  } satisfies MazUiTranslationsInstance

  return instance
}
