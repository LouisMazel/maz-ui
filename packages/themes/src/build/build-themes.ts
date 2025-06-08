import type { BaseThemePreset } from '../types'
import { generateCriticalCSS, generateFullCSS } from '../utils/css-generator'

export interface BuildThemeOptions {
  preset: BaseThemePreset
  /** Mode de thème à générer */
  mode?: 'light' | 'dark' | 'both'
  /** Sélecteur pour le mode sombre */
  darkSelector?: 'class' | 'media'
  /** Préfixe des variables CSS */
  prefix?: string
  /** Générer seulement le CSS critique */
  criticalOnly?: boolean
}

export function buildThemeCSS(options: BuildThemeOptions): string {
  const {
    preset,
    mode = 'both',
    darkSelector = 'class',
    prefix = 'maz',
    criticalOnly = false,
  } = options

  const cssOptions = {
    mode,
    darkSelector,
    prefix,
  }

  if (criticalOnly) {
    return generateCriticalCSS(preset, cssOptions)
  }

  // Générer le CSS complet (critique + full)
  const criticalCSS = generateCriticalCSS(preset, cssOptions)
  const fullCSS = generateFullCSS(preset, cssOptions)

  return `${criticalCSS}\n${fullCSS}`
}

export function generateThemeBundle(presets: BaseThemePreset[], options: {
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

// Utilitaires supplémentaires pour les builds optimisés
export function buildSeparateThemeFiles(preset: BaseThemePreset, options: {
  prefix?: string
  darkSelector?: 'class' | 'media'
} = {}): {
    critical: string
    full: string
    lightOnly: string
    darkOnly: string
  } {
  const { prefix = 'maz', darkSelector = 'class' } = options

  const baseOptions = { prefix, darkSelector }

  return {
    critical: generateCriticalCSS(preset, { ...baseOptions, mode: 'both' }),
    full: generateFullCSS(preset, { ...baseOptions, mode: 'both' }),
    lightOnly: buildThemeCSS({ preset, mode: 'light', ...options }),
    darkOnly: buildThemeCSS({ preset, mode: 'dark', ...options }),
  }
}
