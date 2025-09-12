import type { DarkModeStrategy, ThemeColors, ThemeFoundation, ThemeMode, ThemePreset } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { generateColorScale } from './color-utils'

export interface CriticalCSSOptions {
  /** Critical color variables to include */
  criticalColors?: (keyof ThemeColors)[]
  /** Critical foundation variables to include */
  criticalFoundation?: (keyof ThemeFoundation)[]
  /** Theme mode to generate */
  mode: ThemeMode
  /** Dark mode selector: 'class' (.dark) | 'media' (@media) */
  darkSelectorStrategy: DarkModeStrategy
  /** CSS variables prefix */
  prefix?: string
  /** Dark class name */
  darkClass: string
}

export interface FullCSSOptions {
  /** Critical variables to exclude (to avoid duplication) */
  excludeCritical?: (keyof ThemeColors | keyof ThemeFoundation)[]
  /** Theme mode to generate */
  mode: ThemeMode
  /** Dark mode selector: 'class' (.dark) | 'media' (@media) */
  darkSelectorStrategy: DarkModeStrategy
  /** CSS variables prefix */
  prefix?: string
  /** Include color scales (50-900) */
  includeColorScales?: boolean
  /** Dark class name */
  darkClass: string
}

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
] as const

const DEFAULT_CRITICAL_FOUNDATION: (keyof ThemeFoundation)[] = [
  'radius',
  'font-family',
  'base-font-size',
  'border-width',
] as const

const scaleColors = ['primary', 'secondary', 'accent', 'destructive', 'success', 'warning', 'info', 'contrast', 'background', 'foreground', 'border', 'muted', 'overlay', 'shadow'] as const

export function generateCriticalCSS(
  preset: ThemePreset,
  options: CriticalCSSOptions = {
    mode: 'both',
    darkSelectorStrategy: 'class',
    darkClass: 'dark',
  },
): string {
  const {
    criticalColors = DEFAULT_CRITICAL_COLORS,
    criticalFoundation = DEFAULT_CRITICAL_FOUNDATION,
    mode,
    darkSelectorStrategy,
    prefix = 'maz',
    darkClass = 'dark',
  } = options

  const foundationCritical = extractCriticalFoundation(preset.foundation, criticalFoundation)

  let css = '@layer maz-ui-theme {\n'

  // Light theme
  if (mode === 'light' || mode === 'both') {
    const lightCritical = extractCriticalVariables(preset.colors.light, criticalColors)

    css += generateVariablesBlock({
      selector: ':root',
      colors: lightCritical,
      foundation: foundationCritical,
      prefix,
    })
  }

  // Dark theme
  if (mode === 'dark' || mode === 'both') {
    const darkCritical = extractCriticalVariables(preset.colors.dark, criticalColors)

    css += generateVariablesBlock({
      selector: darkSelectorStrategy === 'media' ? ':root' : `.${darkClass}`,
      mediaQuery: darkSelectorStrategy === 'media' ? '@media (prefers-color-scheme: dark)' : undefined,
      colors: darkCritical,
      foundation: foundationCritical,
      prefix,
    })
  }

  css += '}\n'
  return css
}

export function generateFullCSS(
  preset: ThemePreset,
  options: FullCSSOptions = {
    mode: 'both',
    darkSelectorStrategy: 'class',
    darkClass: 'dark',
  },
): string {
  const {
    excludeCritical = DEFAULT_CRITICAL_COLORS,
    mode,
    darkSelectorStrategy,
    prefix = 'maz',
    includeColorScales = true,
    darkClass = 'dark',
  } = options

  const foundation = excludeFoundationVariables(preset.foundation, DEFAULT_CRITICAL_FOUNDATION)

  let css = '@layer maz-ui-theme {\n'

  if (mode === 'light' || mode === 'both') {
    const lightColors = excludeVariables(preset.colors.light, excludeCritical)

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
    const darkColors = excludeVariables(preset.colors.dark, excludeCritical)

    css += generateVariablesBlock({
      selector: darkSelectorStrategy === 'media' ? ':root' : `.${darkClass}`,
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

function excludeVariables(
  colors: ThemeColors,
  excludeKeys: (keyof ThemeColors | keyof ThemeFoundation)[],
): Partial<ThemeColors> {
  return Object.fromEntries(
    Object.entries(colors).filter(([key]) => !excludeKeys.includes(key as keyof ThemeColors)),
  )
}

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

  const content = variables.join('\n')

  if (mediaQuery) {
    return `\n  ${mediaQuery} {\n    ${selector} {\n${content.replace(/^/gm, '  ')}\n    }\n  }\n`
  }

  return `\n  ${selector} {\n${content}\n  }\n`
}

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

export enum CSS_IDS {
  FULL = 'maz-theme-full',
  CRITICAL = 'maz-theme-critical',
}

export function injectCSS(id: CSS_IDS, css: string): void {
  if (isServer())
    return

  const styleElements = document.querySelectorAll<HTMLStyleElement>(`#${id}`)

  if (!styleElements || styleElements.length === 0) {
    const element = document.createElement('style')
    element.id = id
    document.head.appendChild(element)

    element.textContent = css
    return
  }

  if (styleElements.length === 1) {
    styleElements[0].textContent = css
    return
  }

  if (styleElements.length > 1) {
    for (let i = 0; i < styleElements.length - 1; i++) {
      styleElements[i].remove()
    }

    styleElements[styleElements.length - 1].textContent = css
  }
}

export function removeCSS(id: CSS_IDS): void {
  if (isServer())
    return

  const styleElements = document.querySelectorAll<HTMLStyleElement>(`#${id}`)

  for (const styleElement of styleElements) {
    styleElement && styleElement.remove()
  }
}
