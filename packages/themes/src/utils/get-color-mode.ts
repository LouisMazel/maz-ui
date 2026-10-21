import type { ColorMode } from '../types'
import { getCookie, setCookie } from '@maz-ui/utils/helpers/cookie'
import { isServer } from '@maz-ui/utils/helpers/isServer'

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

export function saveResolvedColorMode(resolvedMode: 'light' | 'dark'): void {
  setCookie('maz-resolved-color-mode', resolvedMode)
}

export function getSavedResolvedColorMode(): 'light' | 'dark' | undefined {
  const saved = getCookie('maz-resolved-color-mode') as 'light' | 'dark' | null
  if (saved && ['light', 'dark'].includes(saved)) {
    return saved
  }
  return undefined
}
