import type { ColorMode } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { getCookie } from './cookie-storage'

export function getSavedColorMode(): ColorMode | undefined {
  const savedMode = getCookie('maz-color-mode') as ColorMode | null
  if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
    return savedMode
  }

  return undefined
}

export function getColorMode(colorMode?: ColorMode): ColorMode {
  if (colorMode && ['light', 'dark'].includes(colorMode)) {
    return colorMode
  }

  const savedMode = getSavedColorMode()
  if (savedMode) {
    return savedMode
  }

  return 'auto'
}

export function getSystemColorMode() {
  if (isServer() || typeof globalThis.matchMedia !== 'function') {
    return 'light'
  }

  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
