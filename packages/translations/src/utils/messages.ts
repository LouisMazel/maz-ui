import type { MazUiTranslationsSchema, TranslationKey } from '../types'
import { globalState, locale } from '../states'
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
    return variables[key] !== undefined ? String(variables[key]) : match
  })
}

export function t(key: TranslationKey, variables?: Record<string, unknown>, fallbackLocale?: string) {
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
