import type { MazUiTranslationsInstance } from '../types'

let activeTranslations: MazUiTranslationsInstance | undefined

/**
 * Last translations instance installed in the browser, for the `useTranslations()` calls made outside
 * a component (store, router guard...). Never used on the server: it would leak between requests.
 */
export function setActiveTranslations(i18n: MazUiTranslationsInstance): void {
  activeTranslations = i18n
}

export function getActiveTranslations(): MazUiTranslationsInstance | undefined {
  return activeTranslations
}
