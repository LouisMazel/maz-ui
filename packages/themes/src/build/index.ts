import type { ThemePreset } from '../types'
import { generateCriticalCSS, generateFullCSS } from '../utils/css-generator'

export interface BuildThemeOptions {
  preset: ThemePreset
  /** Theme mode to generate */
  mode?: 'light' | 'dark' | 'both'
  /** Dark mode selector: 'class' (.dark) | 'media' (@media) */
  darkSelector?: 'class' | 'media'
  /** CSS variables prefix */
  prefix?: string
  /** Generate only critical CSS */
  criticalOnly?: boolean
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
    criticalOnly = false,
  } = options

  const cssOptions = {
    mode,
    darkSelectorStrategy: darkSelector,
    prefix,
    darkClass,
  }

  if (criticalOnly) {
    return generateCriticalCSS(preset, cssOptions)
  }

  // Générer le CSS complet (critique + full)
  const criticalCSS = generateCriticalCSS(preset, cssOptions)
  const fullCSS = generateFullCSS(preset, cssOptions)

  return `${criticalCSS}\n${fullCSS}`
}

export function generateThemeBundle(presets: ThemePreset[], options: {
  /** Mode de thème à générer */
  mode?: 'light' | 'dark' | 'both'
  /** Sélecteur pour le mode sombre */
  darkSelector?: 'class' | 'media'
  /** Préfixe des variables CSS */
  prefix?: string
  /** Générer seulement le CSS critique */
  criticalOnly?: boolean
} = {}): Record<string, string> {
  const {
    mode = 'both',
    darkSelector = 'class',
    prefix = 'maz',
    criticalOnly = false,
  } = options

  return presets.reduce((bundle, preset) => {
    bundle[preset.name] = buildThemeCSS({
      preset,
      mode,
      darkSelector,
      prefix,
      criticalOnly,
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
  critical: string
  full: string
  lightOnly: string
  darkOnly: string
} {
  const { prefix = 'maz', darkSelector = 'class', darkClass = 'dark' } = options

  const baseOptions = { prefix, darkSelectorStrategy: darkSelector, darkClass }

  return {
    critical: generateCriticalCSS(preset, { ...baseOptions, mode: 'both' }),
    full: generateFullCSS(preset, { ...baseOptions, mode: 'both' }),
    lightOnly: buildThemeCSS({ preset, mode: 'light', ...options }),
    darkOnly: buildThemeCSS({ preset, mode: 'dark', ...options }),
  }
}
