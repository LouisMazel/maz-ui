import type { ThemePreset } from '../types'
import { generateCSS } from '../utils/css-generator'

interface SharedOptions {
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
}

export interface BuildThemeOptions extends SharedOptions {
  preset: ThemePreset
}

export function buildThemeCSS({
  preset,
  mode = 'both',
  darkSelector = 'class',
  prefix = 'maz',
  darkClass = 'dark',
  lightClass = 'light',
  scaleColorVariables = true,
}: BuildThemeOptions): string {
  return generateCSS(preset, {
    mode,
    darkSelectorStrategy: darkSelector,
    prefix,
    darkClass,
    lightClass,
    scaleColorVariables,
  })
}

export function generateThemeBundle(presets: ThemePreset[], options: SharedOptions = {}): Record<string, string> {
  return presets.reduce((bundle, preset) => {
    bundle[preset.name] = buildThemeCSS({ preset, ...options })
    return bundle
  }, {} as Record<string, string>)
}

export function createThemeStylesheet(css: string, options: { id?: string, media?: string } = {}): string {
  const { id = 'maz-theme', media } = options
  const mediaAttr = media ? ` media="${media}"` : ''
  return `<style id="${id}"${mediaAttr}>\n${css}\n</style>`
}

export function buildSeparateThemeFiles(preset: ThemePreset, options: Omit<SharedOptions, 'mode'> = {}): {
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
