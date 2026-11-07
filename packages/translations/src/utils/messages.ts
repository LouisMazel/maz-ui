import type { TranslationsStore } from '../states'
import type { MazUiTranslationsSchema, TranslationKey } from '../types'
import { legacyStore } from '../states'
import { loadLocale } from './locales'

export function getMessage(obj: any, path: string): any {
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

export function mergeMessages<T extends Partial<MazUiTranslationsSchema>>(target: T, source: T): T {
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

export function interpolate(message: string, variables?: Record<string, unknown>): string {
  if (!variables)
    return message

  return message.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined
      ? String(variables[key])
      : match
  })
}

function findMessage(store: TranslationsStore, targetLocale: string, key: string): string | undefined {
  const message = getMessage(store.state.messages[targetLocale], key)
  // A key of a group of messages (an object) is missing, not `[object Object]`
  return (typeof message === 'string' && message !== '') || typeof message === 'number'
    ? String(message)
    : undefined
}

/** Whether `t()` loads a fallback locale by itself: not loaded, loading nor failed (an explicit call retries it). */
function shouldAutoLoadLocale(targetLocale: string, store: TranslationsStore): boolean {
  return !store.state.loadedLocales.has(targetLocale)
    && !store.state.loadingPromises.has(targetLocale)
    && !store.failedLocales.has(targetLocale)
}

function findFallbackMessage(store: TranslationsStore, targetLocale: string, key: string): string | undefined {
  if (shouldAutoLoadLocale(targetLocale, store)) {
    loadLocale(targetLocale, store)
  }
  return findMessage(store, targetLocale, key)
}

/**
 * Message of `key` in the current locale, then in `fallbackLocale`, then in English. A fallback
 * locale not loaded yet starts loading (the message follows once it is loaded).
 */
export function t(key: TranslationKey, variables?: Record<string, unknown>, fallbackLocale?: string, store: TranslationsStore = legacyStore) {
  const current = store.locale.value
  let message = findMessage(store, current, key)

  if (message === undefined && fallbackLocale && current !== fallbackLocale) {
    message = findFallbackMessage(store, fallbackLocale, key)
  }

  if (message === undefined && fallbackLocale !== 'en' && current !== 'en') {
    message = findFallbackMessage(store, 'en', key)
  }

  if (message === undefined) {
    // While a locale loads, a missing message is expected: only warn once everything is loaded
    if (store.state.loadedLocales.has(current) && store.state.loadingPromises.size === 0) {
      console.warn(`[@maz-ui/translations] Translation not found for key: "${key}"`)
    }
    return key
  }

  return interpolate(message, variables)
}
