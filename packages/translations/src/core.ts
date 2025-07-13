import type { MazTranslationsInstance, MazTranslationsOptions, MazTranslationsSchema, TranslationKey } from './types'
import { ref } from 'vue'

let globalInstance: MazTranslationsInstance | null = null

// Load all default locales synchronously at build time
const defaultLocalesFiles = import.meta.glob('./locales/*.ts', { eager: true }) as Record<string, { default: MazTranslationsSchema }>

// Extract default messages by locale
const defaultMessages: Record<string, MazTranslationsSchema> = {}
for (const [path, module] of Object.entries(defaultLocalesFiles)) {
  const locale = path.replace('./locales/', '').replace('.ts', '')
  defaultMessages[locale] = module.default
}
// Set of loaded locales
const loadedLocales = ref<Set<string>>(new Set())
// Store of messages by locale
const messagesRef = ref<Record<string, Partial<MazTranslationsSchema>>>({})
// Store of messages provided by the user
const userMessages = ref<Record<string, (() => Promise<Partial<MazTranslationsSchema>>) | Partial<MazTranslationsSchema>>>({})

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

function loadLocale(targetLocale: string, sync = false): Promise<void> | void {
  if (loadedLocales.value.has(targetLocale)) {
    return sync ? undefined : Promise.resolve()
  }

  try {
    // Always get default messages synchronously (they're already loaded)
    const localeDefaultMessages = defaultMessages[targetLocale] || {}
    let localeUserMessages: Partial<MazTranslationsSchema> = {}

    // Get user messages
    const userLoader = userMessages.value[targetLocale]
    if (userLoader) {
      if (typeof userLoader === 'function') {
        if (sync) {
          // In sync mode, we can't wait for async user messages
          console.warn(`User messages for locale "${targetLocale}" are async but sync loading requested`)
        }
        else {
          // Async mode - load user messages
          return userLoader().then((loadedUserMessages) => {
            messagesRef.value[targetLocale] = mergeMessages(localeDefaultMessages, loadedUserMessages)
            loadedLocales.value.add(targetLocale)
          }).catch((error) => {
            console.error(`Failed to load user translations for locale "${targetLocale}":`, error)
            messagesRef.value[targetLocale] = localeDefaultMessages
            loadedLocales.value.add(targetLocale)
          })
        }
      }
      else {
        // User messages are already loaded
        localeUserMessages = userLoader
      }
    }

    // Merge and store messages
    messagesRef.value[targetLocale] = mergeMessages(localeDefaultMessages, localeUserMessages)
    loadedLocales.value.add(targetLocale)
  }
  catch (error) {
    console.error(`Failed to load translations for locale "${targetLocale}":`, error)
    messagesRef.value[targetLocale] = {}
    loadedLocales.value.add(targetLocale)
  }

  return sync ? undefined : Promise.resolve()
}

export function createMazTranslations(options: MazTranslationsOptions = {}) {
  const {
    locale: initialLocale = 'en',
    fallbackLocale = 'en',
    preloadFallback = true,
    messages = {},
  } = options

  const locale = ref(initialLocale)

  // Store user messages
  for (const [loc, msgs] of Object.entries(messages)) {
    userMessages.value[loc] = msgs
  }

  // Load initial locale synchronously
  loadLocale(initialLocale, true)

  // Load fallback locale synchronously if preloadFallback is true
  if (preloadFallback && fallbackLocale && fallbackLocale !== initialLocale) {
    loadLocale(fallbackLocale, true)
  }

  const t = (key: TranslationKey, variables?: Record<string, unknown>) => {
    let message = getMessage(messagesRef.value[locale.value], key)

    if (!message && fallbackLocale && locale.value !== fallbackLocale) {
      if (!loadedLocales.value.has(fallbackLocale)) {
        if (preloadFallback) {
          console.warn(`Fallback locale "${fallbackLocale}" should be preloaded but is missing for key "${key}"`)
        }
        else {
          // Load fallback locale asynchronously only when needed
          loadLocale(fallbackLocale)?.catch?.(console.error)
          console.warn(`Fallback locale "${fallbackLocale}" not loaded yet for key "${key}", loading...`)
        }
        return key
      }
      message = getMessage(messagesRef.value[fallbackLocale], key)
    }

    if (!message && fallbackLocale !== 'en' && locale.value !== 'en') {
      if (!loadedLocales.value.has('en')) {
        // Load English as last resort fallback asynchronously
        loadLocale('en')?.catch?.(console.error)
        console.warn(`English fallback not loaded yet for key "${key}", loading...`)
        return key
      }
      message = getMessage(messagesRef.value.en, key)
    }

    if (!message) {
      console.warn(`Translation key "${key}" not found for locale "${locale.value}"`)
      return key
    }

    return interpolate(String(message), variables)
  }

  const setLocale = async (newLocale: string) => {
    if (!loadedLocales.value.has(newLocale)) {
      await loadLocale(newLocale)
    }
    locale.value = newLocale
  }

  const instance = { locale, t, setLocale } satisfies MazTranslationsInstance

  return instance
}

export function useMazTranslations(): MazTranslationsInstance {
  if (!globalInstance) {
    globalInstance = createMazTranslations()
  }
  return globalInstance
}

export function setGlobalMazTranslations(instance: MazTranslationsInstance): void {
  globalInstance = instance
}
