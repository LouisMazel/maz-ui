import type { DarkModeStrategy, ThemeColors, ThemeFoundation, ThemePreset } from '../types'
import { generateColorScale } from './color-utils'

// =============================================================================
// TYPES & CONSTANTS
// =============================================================================

type ThemeMode = 'light' | 'dark' | 'both'

export interface CriticalCSSOptions {
  /** Critical color variables to include */
  criticalColors?: (keyof ThemeColors)[]
  /** Critical foundation variables to include */
  criticalFoundation?: (keyof ThemeFoundation)[]
  /** Theme mode to generate */
  mode?: ThemeMode
  /** Dark mode selector: 'class' (.dark) | 'media' (@media) */
  darkSelectorStrategy?: DarkModeStrategy
  /** CSS variables prefix */
  prefix?: string
}

export interface FullCSSOptions {
  /** Critical variables to exclude (to avoid duplication) */
  excludeCritical?: (keyof ThemeColors | keyof ThemeFoundation)[]
  /** Theme mode to generate */
  mode?: ThemeMode
  /** Dark mode selector: 'class' (.dark) | 'media' (@media) */
  darkSelectorStrategy?: DarkModeStrategy
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
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'success',
  'success-foreground',
  'warning',
  'warning-foreground',
  'info',
  'info-foreground',
  'contrast',
  'contrast-foreground',
  'muted',
  'shadow',
  'border',
]

const DEFAULT_CRITICAL_FOUNDATION: (keyof ThemeFoundation)[] = [
  'radius',
  'font-family',
  'base-font-size',
  'border-width',
]

const scaleColors = ['primary', 'secondary', 'accent', 'destructive', 'success', 'warning', 'info', 'contrast', 'background', 'foreground', 'border', 'muted', 'overlay', 'shadow'] as const

/**
 * Generates critical CSS to prevent FOUC
 * Contains only essential variables
 */
export function generateCriticalCSS(
  preset: ThemePreset,
  options: CriticalCSSOptions = {},
): string {
  const {
    criticalColors = DEFAULT_CRITICAL_COLORS,
    criticalFoundation = DEFAULT_CRITICAL_FOUNDATION,
    mode = 'both',
    darkSelectorStrategy = 'class',
    prefix = 'maz',
  } = options

  const lightCritical = extractCriticalVariables(preset.colors.light, criticalColors)
  const darkCritical = extractCriticalVariables(preset.colors.dark, criticalColors)
  const foundationCritical = extractCriticalFoundation(preset.foundation, criticalFoundation)

  let css = '@layer maz-ui-theme {\n'

  // Light theme
  if (mode === 'light' || mode === 'both') {
    css += generateVariablesBlock({
      selector: ':root',
      colors: lightCritical,
      foundation: foundationCritical,
      prefix,
    })
  }

  // Dark theme
  if (mode === 'dark' || mode === 'both') {
    css += generateVariablesBlock({
      selector: darkSelectorStrategy === 'media' ? ':root' : '.dark',
      mediaQuery: darkSelectorStrategy === 'media' ? '@media (prefers-color-scheme: dark)' : undefined,
      colors: darkCritical,
      foundation: foundationCritical,
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
  preset: ThemePreset,
  options: FullCSSOptions = {},
): string {
  const {
    excludeCritical = DEFAULT_CRITICAL_COLORS,
    mode = 'both',
    darkSelectorStrategy = 'class',
    prefix = 'maz',
    includeColorScales = true,
  } = options

  const lightColors = excludeVariables(preset.colors.light, excludeCritical)
  const darkColors = excludeVariables(preset.colors.dark, excludeCritical)
  const foundation = excludeFoundationVariables(preset.foundation, DEFAULT_CRITICAL_FOUNDATION)

  let css = '@layer maz-ui-theme {\n'

  if (mode === 'light' || mode === 'both') {
    css += generateVariablesBlock({
      selector: ':root',
      colors: lightColors,
      foundation,
      prefix,
      includeScales: includeColorScales,
      preset,
    })
  }

  // Dark theme - Remaining variables + scales
  if (mode === 'dark' || mode === 'both') {
    css += generateVariablesBlock({
      selector: darkSelectorStrategy === 'media' ? ':root' : '.dark',
      mediaQuery: darkSelectorStrategy === 'media' ? '@media (prefers-color-scheme: dark)' : undefined,
      colors: darkColors,
      foundation: mode === 'dark' ? foundation : undefined, // Appearance only if dark mode only
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
 * Extracts critical foundation variables
 */
function extractCriticalFoundation(
  foundation: ThemeFoundation | undefined,
  criticalKeys: (keyof ThemeFoundation)[],
): Partial<ThemeFoundation> {
  if (!foundation)
    return {}

  return Object.fromEntries(
    criticalKeys
      .filter(key => foundation[key])
      .map(key => [key, foundation[key]]),
  )
}

/**
 * Excludes critical variables from colors
 */
function excludeVariables(
  colors: ThemeColors,
  excludeKeys: (keyof ThemeColors | keyof ThemeFoundation)[],
): Partial<ThemeColors> {
  return Object.fromEntries(
    Object.entries(colors).filter(([key]) => !excludeKeys.includes(key as keyof ThemeColors)),
  )
}

/**
 * Excludes critical foundation variables
 */
function excludeFoundationVariables(
  foundation: ThemeFoundation | undefined,
  excludeKeys: (keyof ThemeFoundation)[],
): Partial<ThemeFoundation> {
  if (!foundation)
    return {}

  return Object.fromEntries(
    Object.entries(foundation).filter(([key]) => !excludeKeys.includes(key as keyof ThemeFoundation)),
  )
}

/**
 * Generates a CSS variables block
 */
function generateVariablesBlock({
  selector,
  mediaQuery,
  colors,
  foundation,
  prefix,
  includeScales = false,
  preset,
  isDark = false,
}: {
  selector: string
  mediaQuery?: string
  colors?: Partial<ThemeColors>
  foundation?: Partial<ThemeFoundation>
  prefix: string
  includeScales?: boolean
  preset?: ThemePreset
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

  if (foundation) {
    Object.entries(foundation).forEach(([key, value]) => {
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
