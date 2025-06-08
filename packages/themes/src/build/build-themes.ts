import type { BaseThemePreset } from '../types'
import { generateCriticalThemeCSS, generateThemeCSS } from '../utils/css-generator'

export interface BuildThemeOptions {
  preset: BaseThemePreset
  darkMode?: 'auto' | 'class' | 'media'
  critical?: boolean
}

export function buildThemeCSS(options: BuildThemeOptions): string {
  const { preset, darkMode = 'class', critical = false } = options

  if (critical) {
    return generateCriticalThemeCSS(preset, { darkMode })
  }

  return generateThemeCSS(preset, { darkMode })
}

export function generateThemeBundle(presets: BaseThemePreset[], options: {
  darkMode?: 'auto' | 'class' | 'media'
  critical?: boolean
} = {}): Record<string, string> {
  const { darkMode = 'class', critical = false } = options

  return presets.reduce((bundle, preset) => {
    bundle[preset.name] = buildThemeCSS({
      preset,
      darkMode,
      critical,
    })
    return bundle
  }, {} as Record<string, string>)
}

export function createThemeStylesheet(css: string, options: {
  id?: string
  media?: string
} = {}): string {
  const { id = 'maz-theme', media } = options

  let styleTag = `<style id="${id}"`

  if (media) {
    styleTag += ` media="${media}"`
  }

  styleTag += `>\n${css}\n</style>`

  return styleTag
}
