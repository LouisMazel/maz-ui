import type { MazTranslationsInstance, MazTranslationsOptions, MazTranslationsSchema, TranslationKey } from './types'
import { ref } from 'vue'

let globalInstance: MazTranslationsInstance | null = null
const defaultLocaleLoaders: Record<string, () => Promise<{ default: MazTranslationsSchema }>> = {
  'en': () => import('./locales/en'),
  'fr': () => import('./locales/fr'),
  'es': () => import('./locales/es'),
  'de': () => import('./locales/de'),
  'it': () => import('./locales/it'),
  'pt': () => import('./locales/pt'),
  'zh-CN': () => import('./locales/zh-CN'),
  'ja': () => import('./locales/ja'),
}

function get(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

function set(obj: any, path: string, value: any): void {
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

function isFlattened(obj: any): boolean {
  if (!obj || typeof obj !== 'object')
    return false
  return Object.keys(obj).some(key => key.includes('.'))
}

function flattenToNested(flatObj: any): any {
  if (!isFlattened(flatObj)) {
    return flatObj
  }

  const nested: any = {}
  for (const [key, value] of Object.entries(flatObj)) {
    if (key.includes('.')) {
      set(nested, key, value)
    }
    else {
      nested[key] = value
    }
  }
  return nested
}

function merge(target: any, source: any): any {
  const normalizedSource = flattenToNested(source)
  const normalizedTarget = flattenToNested(target)

  const result = { ...normalizedTarget }
  for (const key in normalizedSource) {
    if (normalizedSource[key] && typeof normalizedSource[key] === 'object') {
      result[key] = merge(result[key] || {}, normalizedSource[key])
    }
    else {
      result[key] = normalizedSource[key]
    }
  }
  return result
}

function interpolate(message: string, variables?: Record<string, any>): string {
  if (!variables)
    return message

  return message.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined ? String(variables[key]) : match
  })
}

export async function createMazTranslations(options: MazTranslationsOptions = {}) {
  const {
    locale: initialLocale = 'en',
    fallbackLocale = 'en',
    preloadFallback = true,
    messages = {},
  } = options

  const locale = ref(initialLocale)
  const messagesRef = ref<Record<string, Partial<MazTranslationsSchema>>>({})
  const loadedLocales = ref<Set<string>>(new Set())
  const loadingPromises = ref<Map<string, Promise<void>>>(new Map())

  const userMessageLoaders = ref<Record<string, (() => Promise<Partial<MazTranslationsSchema>>) | Partial<MazTranslationsSchema>>>({})

  for (const [loc, msgs] of Object.entries(messages)) {
    userMessageLoaders.value[loc] = typeof msgs === 'function' ? msgs : () => Promise.resolve(msgs)
  }

  function loadLocaleMessages(targetLocale: string) {
    if (loadedLocales.value.has(targetLocale)) {
      return
    }

    if (loadingPromises.value.has(targetLocale)) {
      return loadingPromises.value.get(targetLocale)!
    }

    const loadingPromise = (async () => {
      try {
        let defaultMessages: Partial<MazTranslationsSchema> = {}
        let userMessages: Partial<MazTranslationsSchema> = {}

        if (defaultLocaleLoaders[targetLocale]) {
          const defaultModule = await defaultLocaleLoaders[targetLocale]()
          defaultMessages = defaultModule.default
        }

        const userLoader = userMessageLoaders.value[targetLocale]
        if (userLoader) {
          if (typeof userLoader === 'function') {
            userMessages = await userLoader()
          }
          else {
            userMessages = userLoader
          }
        }

        messagesRef.value[targetLocale] = merge(defaultMessages, userMessages)
        loadedLocales.value.add(targetLocale)
      }
      catch (error) {
        console.error(`Failed to load translations for locale "${targetLocale}":`, error)
        messagesRef.value[targetLocale] = {}
        loadedLocales.value.add(targetLocale)
      }
      finally {
        loadingPromises.value.delete(targetLocale)
      }
    })()

    loadingPromises.value.set(targetLocale, loadingPromise)
    return loadingPromise
  }

  const localePromises: (Promise<void> | undefined)[] = []

  localePromises.push(loadLocaleMessages(initialLocale))

  if (preloadFallback && fallbackLocale !== initialLocale) {
    localePromises.push(loadLocaleMessages(fallbackLocale))
  }

  await Promise.all(localePromises)

  const t = (key: TranslationKey, variables?: Record<string, any>) => {
    let message = get(messagesRef.value[locale.value], key)

    if (!message && locale.value !== fallbackLocale) {
      if (!loadedLocales.value.has(fallbackLocale)) {
        loadLocaleMessages(fallbackLocale)?.catch(console.error)
        console.warn(`Fallback locale "${fallbackLocale}" not loaded yet for key "${key}", loading...`)
        return key
      }
      message = get(messagesRef.value[fallbackLocale], key)
    }

    if (!message && fallbackLocale !== 'en' && locale.value !== 'en') {
      if (!loadedLocales.value.has('en')) {
        loadLocaleMessages('en')?.catch(console.error)
        console.warn(`English fallback not loaded yet for key "${key}", loading...`)
        return key
      }
      message = get(messagesRef.value.en, key)
    }

    if (!message) {
      console.warn(`Translation key "${key}" not found for locale "${locale.value}"`)
      return key
    }

    return interpolate(String(message), variables)
  }

  const setLocale = async (newLocale: string) => {
    if (!loadedLocales.value.has(newLocale)) {
      await loadLocaleMessages(newLocale)
    }
    locale.value = newLocale
  }

  return { locale, t, setLocale } satisfies MazTranslationsInstance
}

export async function useMazTranslations(): Promise<MazTranslationsInstance> {
  if (!globalInstance) {
    globalInstance = await createMazTranslations()
  }
  return globalInstance
}

export function setGlobalMazTranslations(instance: MazTranslationsInstance): void {
  globalInstance = instance
}
