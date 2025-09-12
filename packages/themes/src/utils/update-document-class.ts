import type { ThemeState } from '../types'
import { noTransition } from './no-transition'

export function updateDocumentClass(isDark: boolean, state?: ThemeState) {
  if (typeof document === 'undefined' || !state || state.darkModeStrategy === 'media' || state.mode === 'light') {
    return
  }

  noTransition(() => {
    if (isDark) {
      document.documentElement.classList.add(state.darkClass)
    }
    else {
      document.documentElement.classList.remove(state.darkClass)
    }
  })
}
