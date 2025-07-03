import type { ColorMode } from '../types'
import { getCookie } from './cookie-storage'

export function getColorMode(colorMode?: ColorMode): ColorMode {
  if (colorMode && ['light', 'dark'].includes(colorMode)) {
    return colorMode
  }

  const savedMode = getCookie('maz-color-mode') as ColorMode | null
  if (savedMode && ['light', 'dark'].includes(savedMode)) {
    return savedMode
  }

  return getSystemPrefersDark()
}

export function getSystemPrefersDark() {
  const isDark = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches

  return isDark ? 'dark' : 'light'
}
