import type { DarkModeStrategy, ThemeColors, ThemeFoundation, ThemeMode, ThemePreset } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { normalizeColor } from './color-parser'
import { generateColorScale } from './color-utils'

export interface CSSOptions {
  /** Generate only critical CSS variables */
  onlyCritical?: boolean
  /** Critical color variables to include (only used when onlyCritical is true) */
  criticalColors?: (keyof ThemeColors)[]
  /** Critical foundation variables to include (only used when onlyCritical is true) */
  criticalFoundation?: (keyof ThemeFoundation)[]
  /** Theme mode to generate */
  mode: ThemeMode
  /** Dark mode selector: 'class' (.dark) | 'media' (@media) */
  darkSelectorStrategy: DarkModeStrategy
  /** CSS variables prefix */
  prefix?: string
  /** Include color scales (50-900) - only used when onlyCritical is false */
  includeColorScales?: boolean
  /** Dark class name */
  darkClass: string
}

const DEFAULT_CRITICAL_COLORS: (keyof ThemeColors)[] = [
  'surface',
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
  'divider',
] as const

const DEFAULT_CRITICAL_FOUNDATION: (keyof ThemeFoundation)[] = [
  'font-family',
  'font-mono',
  'font-display',
  'base-font-size',
  'border-width',
] as const

const scaleColors = ['primary', 'secondary', 'accent', 'destructive', 'success', 'warning', 'info', 'contrast', 'surface', 'foreground', 'divider', 'muted', 'overlay', 'shadow'] as const

export function generateCSS(
  preset: ThemePreset,
  options: CSSOptions = {
    onlyCritical: false,
    mode: 'both',
    darkSelectorStrategy: 'class',
    darkClass: 'dark',
  },
): string {
  const {
    onlyCritical = false,
    criticalColors = DEFAULT_CRITICAL_COLORS,
    criticalFoundation = DEFAULT_CRITICAL_FOUNDATION,
    mode,
    darkSelectorStrategy,
    prefix = 'maz',
    includeColorScales = true,
    darkClass = 'dark',
  } = options

  let css = '@layer theme {\n'

  if (mode === 'light' || mode === 'both') {
    css += generateLightThemeVariables(preset, {
      onlyCritical,
      criticalColors,
      criticalFoundation,
      prefix,
      includeColorScales,
    })
  }

  if (mode === 'dark' || mode === 'both') {
    css += generateDarkThemeVariables(preset, {
      onlyCritical,
      criticalColors,
      criticalFoundation,
      mode,
      darkSelectorStrategy,
      prefix,
      includeColorScales,
      darkClass,
    })
  }

  css += '}\n'

  return css
}

function generateLightThemeVariables(
  preset: ThemePreset,
  options: {
    onlyCritical: boolean
    criticalColors: (keyof ThemeColors)[]
    criticalFoundation: (keyof ThemeFoundation)[]
    prefix: string
    includeColorScales: boolean
  },
): string {
  const { onlyCritical, criticalColors, criticalFoundation, prefix, includeColorScales } = options

  const lightColors = onlyCritical
    ? extractCriticalVariables(preset.colors.light, criticalColors)
    : preset.colors.light

  const lightFoundation = onlyCritical
    ? extractCriticalFoundation(preset.foundation, criticalFoundation)
    : preset.foundation

  return generateVariablesBlock({
    selector: ':root',
    colors: lightColors,
    foundation: lightFoundation,
    prefix,
    includeScales: !onlyCritical && includeColorScales,
    includeStaticScales: !onlyCritical,
    preset: !onlyCritical ? preset : undefined,
    mode: 'light',
  })
}

function generateDarkThemeVariables(
  preset: ThemePreset,
  options: {
    onlyCritical: boolean
    criticalColors: (keyof ThemeColors)[]
    criticalFoundation: (keyof ThemeFoundation)[]
    mode: ThemeMode
    darkSelectorStrategy: DarkModeStrategy
    prefix: string
    includeColorScales: boolean
    darkClass: string
  },
): string {
  const { onlyCritical, criticalColors, criticalFoundation, mode, darkSelectorStrategy, prefix, includeColorScales, darkClass } = options

  const darkColors = onlyCritical
    ? extractCriticalVariables(preset.colors.dark, criticalColors)
    : preset.colors.dark

  const darkFoundation = getDarkFoundation(onlyCritical, mode, preset.foundation, criticalFoundation)

  return generateVariablesBlock({
    selector: darkSelectorStrategy === 'media' ? ':root' : `.${darkClass}`,
    mediaQuery: darkSelectorStrategy === 'media' ? '@media (prefers-color-scheme: dark)' : undefined,
    colors: darkColors,
    foundation: darkFoundation,
    prefix,
    includeScales: !onlyCritical && includeColorScales,
    includeStaticScales: false,
    preset: !onlyCritical ? preset : undefined,
    isDark: true,
    mode: 'dark',
  })
}

function getDarkFoundation(
  onlyCritical: boolean,
  mode: ThemeMode,
  foundation: ThemeFoundation | undefined,
  criticalFoundation: (keyof ThemeFoundation)[],
): Partial<ThemeFoundation> | undefined {
  if (onlyCritical) {
    return extractCriticalFoundation(foundation, criticalFoundation)
  }
  return mode === 'dark' ? foundation : undefined
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

function generateVariablesBlock({
  selector,
  mediaQuery,
  colors,
  foundation,
  prefix,
  includeScales = false,
  includeStaticScales = false,
  preset,
  isDark = false,
  mode = 'light',
}: {
  selector: string
  mediaQuery?: string
  colors?: Partial<ThemeColors>
  foundation?: Partial<ThemeFoundation>
  prefix: string
  includeScales?: boolean
  /** Emit mode-agnostic scales (radius/shadow) — only on the light root block. */
  includeStaticScales?: boolean
  preset?: ThemePreset
  isDark?: boolean
  /** Current mode being emitted — used to pick the right `components.{container,input}.bg` value. */
  mode?: 'light' | 'dark'
}): string {
  const variables: string[] = []

  if (colors) {
    Object.entries(colors).forEach(([key, value]) => {
      if (value) {
        variables.push(`  --${prefix}-${key}: ${normalizeColor(value)};`)
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

  if (includeStaticScales && preset?.scales) {
    variables.push(...generateScaleVariables(preset.scales, prefix))
  }

  if (preset?.components) {
    variables.push(...generateComponentVariables(preset.components, mode, prefix))
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

function generateScaleVariables(scales: ThemePreset['scales'], prefix: string): string[] {
  const lines: string[] = []

  Object.entries(scales.radius ?? {}).forEach(([key, value]) => {
    if (value)
      lines.push(`  --${prefix}-radius-${key}: ${value};`)
  })

  Object.entries(scales.shadow ?? {}).forEach(([key, value]) => {
    if (value)
      lines.push(`  --${prefix}-shadow-style-${key}: ${value};`)
  })

  return lines
}

function generateComponentVariables(
  components: NonNullable<ThemePreset['components']>,
  mode: 'light' | 'dark',
  prefix: string,
): string[] {
  const lines: string[] = []

  if (components.btn?.['font-weight']) {
    lines.push(`  --${prefix}-btn-font-weight: ${components.btn['font-weight']};`)
  }

  const containerBg = components.container?.bg?.[mode]
  if (containerBg) {
    lines.push(`  --${prefix}-container-bg: ${normalizeColor(containerBg)};`)
  }

  const inputBg = components.input?.bg?.[mode]
  if (inputBg) {
    lines.push(`  --${prefix}-input-bg: ${normalizeColor(inputBg)};`)
  }

  return lines
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

export const CSS_ID = 'maz-theme-css'

export function injectCSS(id = CSS_ID, css: string): void {
  if (isServer())
    return

  const styleElements = [...document.querySelectorAll<HTMLStyleElement>(`#${id}`)]

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

  const lastElement = styleElements.at(-1)

  if (styleElements.length > 1) {
    for (let i = 0; i < styleElements.length - 1; i++) {
      styleElements[i].remove()
    }

    if (lastElement) {
      lastElement.textContent = css
    }
  }
}

export function removeCSS(id = CSS_ID): void {
  if (isServer())
    return

  const styleElements = document.querySelectorAll<HTMLStyleElement>(`#${id}`)

  for (const styleElement of styleElements) {
    styleElement && styleElement.remove()
  }
}
