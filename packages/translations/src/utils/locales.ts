import type { MazUiTranslationsSchema } from '../types'
import { globalState, locale } from '../states'
import { mergeMessages } from './messages'

const defaultLocalesLoaders: Record<string, () => Promise<{ default: MazUiTranslationsSchema }>> = {
  './locales/en.ts': () => import('./../locales/en').then(m => ({ default: m.default })),
  './locales/de.ts': () => import('./../locales/de').then(m => ({ default: m.default })),
  './locales/es.ts': () => import('./../locales/es').then(m => ({ default: m.default })),
  './locales/fr.ts': () => import('./../locales/fr').then(m => ({ default: m.default })),
  './locales/it.ts': () => import('./../locales/it').then(m => ({ default: m.default })),
  './locales/ja.ts': () => import('./../locales/ja').then(m => ({ default: m.default })),
  './locales/pt.ts': () => import('./../locales/pt').then(m => ({ default: m.default })),
  './locales/zh-CN.ts': () => import('./../locales/zh-CN').then(m => ({ default: m.default })),
}

const defaultMessagesCache = new Map<string, MazUiTranslationsSchema>()

export async function loadDefaultMessages(locale: string): Promise<MazUiTranslationsSchema> {
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

export function getAvailableLocales() {
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

export function loadLocale(targetLocale: string): Promise<void> {
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

export function getMessages() {
  return globalState.messages
}

export function isLocaleLoaded(localeToCheck: string) {
  return globalState.loadedLocales.has(localeToCheck)
}

export function isLocaleLoading(localeToCheck: string) {
  return globalState.loadingPromises.has(localeToCheck)
}

export function setLocaleMessage(targetLocale: string, messages: Partial<MazUiTranslationsSchema>) {
  if (!globalState.messages[targetLocale]) {
    globalState.messages[targetLocale] = {}
  }
  globalState.messages[targetLocale] = mergeMessages(globalState.messages[targetLocale], messages)
  globalState.loadedLocales.add(targetLocale)
}

export async function setLocale(newLocale: string) {
  if (!globalState.loadedLocales.has(newLocale)) {
    await loadLocale(newLocale)
  }

  locale.value = newLocale
}

export function getLoadedLocales() {
  return Object.keys(globalState.messages)
}
