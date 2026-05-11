import type { ColorMode, ThemeState } from '../types'
import { noTransition } from './no-transition'

export function updateDocumentClass(colorMode: ColorMode, state?: ThemeState): void {
  if (typeof document === 'undefined' || !state || state.darkModeStrategy === 'media' || state.mode !== 'both') {
    return
  }

  const apply = () => {
    const html = document.documentElement
    html.classList.remove(state.darkClass, state.lightClass)
    if (colorMode === 'dark')
      html.classList.add(state.darkClass)
    else if (colorMode === 'light')
      html.classList.add(state.lightClass)
  }

  if (state.colorTransition === false) {
    noTransition(apply)
  }
  else {
    apply()
  }
}
