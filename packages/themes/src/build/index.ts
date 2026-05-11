import type { Duration, ThemePreset } from '../types'
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
  /** Light class name (default 'light') */
  lightClass?: string
  /** Whether to generate color scales */
  scaleColorVariables?: boolean
  /** Smooth color transition config. `false` (default) → instantaneous. */
  colorTransition?: false | { duration: Duration, easing: string }
}

export function buildThemeCSS(options: BuildThemeOptions): string {
  const {
    preset,
    mode = 'both',
    darkSelector = 'class',
    prefix = 'maz',
    darkClass = 'dark',
    lightClass = 'light',
    scaleColorVariables = true,
    colorTransition = false,
  } = options

  return generateCSS(preset, {
    mode,
    darkSelectorStrategy: darkSelector,
    prefix,
    darkClass,
    lightClass,
    scaleColorVariables,
    colorTransition,
  })
}

export function generateThemeBundle(presets: ThemePreset[], options: {
  mode?: 'light' | 'dark' | 'both'
  darkSelector?: 'class' | 'media'
  prefix?: string
  darkClass?: string
  lightClass?: string
  scaleColorVariables?: boolean
  colorTransition?: false | { duration: Duration, easing: string }
} = {}): Record<string, string> {
  const {
    mode = 'both',
    darkSelector = 'class',
    prefix = 'maz',
    darkClass = 'dark',
    lightClass = 'light',
    scaleColorVariables = true,
    colorTransition = false,
  } = options

  return presets.reduce((bundle, preset) => {
    bundle[preset.name] = buildThemeCSS({
      preset,
      mode,
      darkSelector,
      prefix,
      darkClass,
      lightClass,
      scaleColorVariables,
      colorTransition,
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
  lightClass?: string
  scaleColorVariables?: boolean
  colorTransition?: false | { duration: Duration, easing: string }
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
