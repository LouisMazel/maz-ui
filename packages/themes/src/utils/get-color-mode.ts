import type { ColorMode } from '../types'

export function getColorMode(colorMode?: ColorMode): ColorMode {
  if (colorMode && ['light', 'dark'].includes(colorMode)) {
    return colorMode
  }

  if (typeof localStorage !== 'undefined') {
    const savedMode = localStorage.getItem('maz-color-mode') as ColorMode | null
    if (savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
      return savedMode
    }
  }

  return getSystemPrefersDark()
}

export function getSystemPrefersDark() {
  const isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

  return isDark ? 'dark' : 'light'
}
