import type { Ref } from 'vue'
import type { ThemeState } from '../types'

let activeThemeState: Ref<ThemeState | undefined> | undefined

/**
 * Last theme state installed or used in the browser, for the `useTheme()` calls made outside
 * a component (store, router guard...). Never used on the server: it would leak between requests.
 */
export function setActiveThemeState(themeState: Ref<ThemeState | undefined>): void {
  activeThemeState = themeState
}

export function getActiveThemeState(): Ref<ThemeState | undefined> | undefined {
  return activeThemeState
}
