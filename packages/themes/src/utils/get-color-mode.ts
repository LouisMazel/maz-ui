import type { ColorMode } from '../types'
import type { SystemColorMode } from './theme-preferences'
import { readColorModePreference, saveSystemColorMode } from './theme-preferences'

export { COLOR_MODE_COOKIE, getSystemColorMode } from './theme-preferences'

/** Color mode chosen by the user, from the `maz-color-mode` cookie. */
export function getSavedColorMode(): ColorMode | undefined {
  return readColorModePreference().colorMode
}

export function getColorMode(colorMode?: ColorMode): ColorMode {
  if (colorMode === 'light' || colorMode === 'dark')
    return colorMode

  return getSavedColorMode() ?? 'auto'
}

/** @deprecated The system preference is saved in the `maz-color-mode` cookie: use `saveSystemColorMode` */
export function saveResolvedColorMode(resolvedMode: SystemColorMode): void {
  saveSystemColorMode(resolvedMode)
}

/** @deprecated The system preference is read from the `maz-color-mode` cookie: use `readColorModePreference().system` */
export function getSavedResolvedColorMode(): SystemColorMode | undefined {
  return readColorModePreference().system
}
