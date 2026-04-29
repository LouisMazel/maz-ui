import type { ThemePreset } from '../types'
import { generateCSS } from '../utils/css-generator'

export interface BuildThemeOptions {
  preset: ThemePreset
  /** Theme mode to generate */
  mode?: 'light' | 'dark' | 'both'
  /** Dark mode selector: 'class' (.dark) | 'media' (@media) */
  darkSelector?: 'class' | 'media'
  /** CSS variables prefix */
  prefix?: string
  /** Dark class name */
  darkClass?: string
}

export function buildThemeCSS(options: BuildThemeOptions): string {
  const {
    preset,
    mode = 'both',
    darkSelector = 'class',
    prefix = 'maz',
    darkClass = 'dark',
  } = options

  return generateCSS(preset, {
    mode,
    darkSelectorStrategy: darkSelector,
    prefix,
    darkClass,
  })
}

export function generateThemeBundle(presets: ThemePreset[], options: {
  mode?: 'light' | 'dark' | 'both'
  darkSelector?: 'class' | 'media'
  prefix?: string
} = {}): Record<string, string> {
  const {
    mode = 'both',
    darkSelector = 'class',
    prefix = 'maz',
  } = options

  return presets.reduce((bundle, preset) => {
    bundle[preset.name] = buildThemeCSS({
      preset,
      mode,
      darkSelector,
      prefix,
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

export function buildSeparateThemeFiles(preset: ThemePreset, options: {
  prefix?: string
  darkSelector?: 'class' | 'media'
  darkClass?: string
} = {}): {
  full: string
  lightOnly: string
  darkOnly: string
} {
  return {
    full: buildThemeCSS({ preset, mode: 'both', ...options }),
    lightOnly: buildThemeCSS({ preset, mode: 'light', ...options }),
    darkOnly: buildThemeCSS({ preset, mode: 'dark', ...options }),
  }
}
