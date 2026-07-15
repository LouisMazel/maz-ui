import type { ColorMode, ThemeState } from '../types'
import { getSystemColorMode } from './get-color-mode'
import { noTransition } from './no-transition'

export function updateDocumentClass(colorMode: ColorMode, state?: ThemeState): void {
  if (typeof document === 'undefined' || !state || state.darkModeStrategy === 'media' || state.mode !== 'both') {
    return
  }

  const resolved = colorMode === 'auto' ? getSystemColorMode() : colorMode
  const classToAdd = resolved === 'dark' ? state.darkClass : state.lightClass

  noTransition(() => {
    const html = document.documentElement
    html.classList.remove(state.darkClass, state.lightClass)
    html.classList.add(classToAdd)
  })
}
