import type { BaseThemePreset, ThemeAppearance, ThemeColors } from '../types'
import { generateColorScale } from './color-utils'

// =============================================================================
// TYPES & CONSTANTS
// =============================================================================

type ThemeMode = 'light' | 'dark' | 'both'
type DarkSelector = 'class' | 'media'

export interface CriticalCSSOptions {
  /** Critical color variables to include */
  criticalColors?: (keyof ThemeColors)[]
  /** Critical appearance variables to include */
  criticalAppearance?: (keyof ThemeAppearance)[]
  /** Theme mode to generate */
  mode?: ThemeMode
  /** Dark mode selector: 'class' (.dark) | 'media' (@media) */
  darkSelector?: DarkSelector
  /** CSS variables prefix */
  prefix?: string
}

export interface FullCSSOptions {
  /** Critical variables to exclude (to avoid duplication) */
  excludeCritical?: (keyof ThemeColors)[]
  /** Theme mode to generate */
  mode?: ThemeMode
  /** Dark mode selector: 'class' (.dark) | 'media' (@media) */
  darkSelector?: DarkSelector
  /** CSS variables prefix */
  prefix?: string
  /** Include color scales (50-900) */
  includeColorScales?: boolean
}

// Default critical variables
const DEFAULT_CRITICAL_COLORS: (keyof ThemeColors)[] = [
  'background',
  'foreground',
  'primary',
  'secondary',
  'border',
]

const DEFAULT_CRITICAL_APPEARANCE: (keyof ThemeAppearance)[] = [
  'radius',
  'font-family',
]

const scaleColors = ['primary', 'secondary', 'accent', 'destructive', 'success', 'warning', 'info', 'contrast', 'background', 'foreground', 'border', 'muted', 'overlay', 'shadow'] as const

/**
 * Generates critical CSS to prevent FOUC
 * Contains only essential variables
 */
export function generateCriticalCSS(
  preset: BaseThemePreset,
  options: CriticalCSSOptions = {},
): string {
  const {
    criticalColors = DEFAULT_CRITICAL_COLORS,
    criticalAppearance = DEFAULT_CRITICAL_APPEARANCE,
    mode = 'both',
    darkSelector = 'class',
    prefix = 'maz',
  } = options

  const lightCritical = extractCriticalVariables(preset.colors.light, criticalColors)
  const darkCritical = extractCriticalVariables(preset.colors.dark, criticalColors)
  const appearanceCritical = extractCriticalAppearance(preset.appearance, criticalAppearance)

  let css = '@layer maz-ui-theme {\n'

  // Light theme
  if (mode === 'light' || mode === 'both') {
    css += generateVariablesBlock({
      selector: ':root',
      colors: lightCritical,
      appearance: appearanceCritical,
      prefix,
    })
  }

  // Dark theme
  if (mode === 'dark' || mode === 'both') {
    css += generateVariablesBlock({
      selector: darkSelector === 'media' ? ':root' : '.dark',
      mediaQuery: darkSelector === 'media' ? '@media (prefers-color-scheme: dark)' : undefined,
      colors: darkCritical,
      appearance: mode === 'dark' ? appearanceCritical : undefined, // Appearance only if dark mode only
      prefix,
    })
  }

  css += '}\n'
  return css
}

// =============================================================================
// FULL CSS - All variables except critical ones
// =============================================================================

/**
 * Generates full CSS without critical variables
 * Avoids duplication with critical CSS
 */
export function generateFullCSS(
  preset: BaseThemePreset,
  options: FullCSSOptions = {},
): string {
  const {
    excludeCritical = DEFAULT_CRITICAL_COLORS,
    mode = 'both',
    darkSelector = 'class',
    prefix = 'maz',
    includeColorScales = true,
  } = options

  const lightColors = excludeVariables(preset.colors.light, excludeCritical)
  const darkColors = excludeVariables(preset.colors.dark, excludeCritical)
  const appearance = excludeAppearanceVariables(preset.appearance, DEFAULT_CRITICAL_APPEARANCE)

  let css = '@layer maz-ui-theme {\n'

  if (mode === 'light' || mode === 'both') {
    css += generateVariablesBlock({
      selector: ':root',
      colors: lightColors,
      appearance,
      prefix,
      includeScales: includeColorScales,
      preset,
    })
  }

  // Dark theme - Remaining variables + scales
  if (mode === 'dark' || mode === 'both') {
    css += generateVariablesBlock({
      selector: darkSelector === 'media' ? ':root' : '.dark',
      mediaQuery: darkSelector === 'media' ? '@media (prefers-color-scheme: dark)' : undefined,
      colors: darkColors,
      appearance: mode === 'dark' ? appearance : undefined, // Appearance only if dark mode only
      prefix,
      includeScales: includeColorScales,
      preset,
      isDark: true,
    })
  }

  css += '}\n'
  return css
}

// =============================================================================
// UTILITIES - Helper functions
// =============================================================================

/**
 * Extracts critical color variables
 */
function extractCriticalVariables(
  colors: ThemeColors,
  criticalKeys: (keyof ThemeColors)[],
): Partial<ThemeColors> {
  return Object.fromEntries(
    criticalKeys
      .filter(key => colors[key])
      .map(key => [key, colors[key]]),
  )
}

/**
 * Extracts critical appearance variables
 */
function extractCriticalAppearance(
  appearance: ThemeAppearance | undefined,
  criticalKeys: (keyof ThemeAppearance)[],
): Partial<ThemeAppearance> {
  if (!appearance)
    return {}

  return Object.fromEntries(
    criticalKeys
      .filter(key => appearance[key])
      .map(key => [key, appearance[key]]),
  )
}

/**
 * Excludes critical variables from colors
 */
function excludeVariables(
  colors: ThemeColors,
  excludeKeys: (keyof ThemeColors)[],
): Partial<ThemeColors> {
  return Object.fromEntries(
    Object.entries(colors).filter(([key]) => !excludeKeys.includes(key as keyof ThemeColors)),
  )
}

/**
 * Excludes critical appearance variables
 */
function excludeAppearanceVariables(
  appearance: ThemeAppearance | undefined,
  excludeKeys: (keyof ThemeAppearance)[],
): Partial<ThemeAppearance> {
  if (!appearance)
    return {}

  return Object.fromEntries(
    Object.entries(appearance).filter(([key]) => !excludeKeys.includes(key as keyof ThemeAppearance)),
  )
}

/**
 * Generates a CSS variables block
 */
function generateVariablesBlock({
  selector,
  mediaQuery,
  colors,
  appearance,
  prefix,
  includeScales = false,
  preset,
  isDark = false,
}: {
  selector: string
  mediaQuery?: string
  colors?: Partial<ThemeColors>
  appearance?: Partial<ThemeAppearance>
  prefix: string
  includeScales?: boolean
  preset?: BaseThemePreset
  isDark?: boolean
}): string {
  const variables: string[] = []

  if (colors) {
    Object.entries(colors).forEach(([key, value]) => {
      if (value) {
        variables.push(`  --${prefix}-${key}: ${value};`)
      }
    })
  }

  if (appearance) {
    Object.entries(appearance).forEach(([key, value]) => {
      if (value) {
        variables.push(`  --${prefix}-${key}: ${value};`)
      }
    })
  }

  if (includeScales && preset) {
    const sourceColors = isDark ? preset.colors.dark : preset.colors.light
    const colorScales = generateAllColorScales(sourceColors, prefix)
    variables.push(...colorScales)
  }

  // CSS block construction
  const content = variables.join('\n')

  if (mediaQuery) {
    return `\n  ${mediaQuery} {\n    ${selector} {\n${content.replace(/^/gm, '  ')}\n    }\n  }\n`
  }

  return `\n  ${selector} {\n${content}\n  }\n`
}

/**
 * Generates all color scales (50-900)
 */
function generateAllColorScales(colors: ThemeColors, prefix: string): string[] {
  const colorScales: string[] = []

  scaleColors.forEach((colorName) => {
    const baseColor = colors[colorName]
    if (baseColor) {
      const scale = generateColorScale(baseColor)
      Object.entries(scale).forEach(([scaleKey, scaleValue]) => {
        colorScales.push(`  --${prefix}-${colorName}-${scaleKey}: ${scaleValue};`)
      })
    }
  })

  return colorScales
}

// =============================================================================
// INJECTION UTILITIES - For runtime use
// =============================================================================

/**
 * Injects CSS into the DOM
 */
export function injectCSS(css: string, id: string = 'maz-theme-vars'): void {
  if (typeof document === 'undefined')
    return

  let styleElement = document.getElementById(id) as HTMLStyleElement | null

  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = id
    document.head.appendChild(styleElement)
  }

  styleElement.textContent = css
}

/**
 * Supprime le CSS du DOM
 */
export function removeCSS(id: string = 'maz-theme-vars'): void {
  if (typeof document === 'undefined')
    return

  const styleElement = document.getElementById(id)
  if (styleElement) {
    styleElement.remove()
  }
}
