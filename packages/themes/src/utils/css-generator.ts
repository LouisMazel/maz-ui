import type { DarkModeStrategy, ThemeColors, ThemeFoundation, ThemeMode, ThemePreset } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { normalizeColor } from './color-parser'
import { generateColorScale } from './color-utils'

export interface CSSOptions {
  /** Theme mode to generate */
  mode: ThemeMode
  /** Dark mode selector: 'class' (.dark) | 'media' (@media) */
  darkSelectorStrategy: DarkModeStrategy
  /** CSS variables prefix */
  prefix?: string
  /** Dark class name */
  darkClass: string
}

const scaleColors = ['primary', 'secondary', 'accent', 'destructive', 'success', 'warning', 'info', 'contrast', 'surface', 'foreground', 'divider', 'muted', 'overlay', 'shadow'] as const

export function generateCSS(
  preset: ThemePreset,
  options: CSSOptions = {
    mode: 'both',
    darkSelectorStrategy: 'class',
    darkClass: 'dark',
  },
): string {
  const {
    mode,
    darkSelectorStrategy,
    prefix = 'maz',
    darkClass = 'dark',
  } = options

  let css = '@layer theme {\n'

  const rootSelector = ':root'
  const darkClassSelector = `.${darkClass}`

  if (mode === 'light' || mode === 'both') {
    css += generateVariablesBlock({
      selector: rootSelector,
      colors: preset.colors.light,
      foundation: preset.foundation,
      prefix,
      preset,
      mode: 'light',
    })
  }

  if (mode === 'dark' || mode === 'both') {
    css += generateVariablesBlock({
      selector: darkSelectorStrategy === 'media' ? rootSelector : darkClassSelector,
      mediaQuery: darkSelectorStrategy === 'media' ? '@media (prefers-color-scheme: dark)' : undefined,
      colors: preset.colors.dark,
      foundation: mode === 'dark' ? preset.foundation : undefined,
      prefix,
      preset,
      isDark: true,
      mode: 'dark',
    })
  }

  css += '}\n'

  return css
}

function generateVariablesBlock({
  selector,
  mediaQuery,
  colors,
  foundation,
  prefix,
  preset,
  isDark = false,
  mode = 'light',
}: {
  selector: string
  mediaQuery?: string
  colors?: Partial<ThemeColors>
  foundation?: Partial<ThemeFoundation>
  prefix: string
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

  // Static scales (radius / shadow) live on the light root block only.
  if (!isDark && preset?.scales) {
    variables.push(...generateScaleVariables(preset.scales, prefix))
  }

  if (preset?.components) {
    variables.push(...generateComponentVariables(preset.components, mode, prefix))
  }

  if (preset) {
    const sourceColors = isDark ? preset.colors.dark : preset.colors.light
    variables.push(...generateAllColorScales(sourceColors, prefix))
  }

  const content = variables.join('\n')

  if (mediaQuery) {
    return `\n  ${mediaQuery} {\n    ${selector} {\n${content.replace(/^/gm, '  ')}\n    }\n  }\n`
  }

  return `\n  ${selector} {\n${content}\n  }\n`
}

function generateScaleVariables(scales: ThemePreset['scales'], prefix: string): string[] {
  const lines: string[] = []

  Object.entries(scales.rounded ?? {}).forEach(([key, value]) => {
    if (value)
      lines.push(`  --${prefix}-rounded-${key}: ${value};`)
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

  if (styleElements.length === 0) {
    const element = document.createElement('style')
    element.id = id
    element.textContent = css
    document.head.appendChild(element)
    return
  }

  if (styleElements.length === 1) {
    styleElements[0].textContent = css
    return
  }

  // Drop duplicates, keep only the last and update its content.
  const lastElement = styleElements.at(-1)
  for (let i = 0; i < styleElements.length - 1; i++) {
    styleElements[i].remove()
  }
  if (lastElement) {
    lastElement.textContent = css
  }
}

export function removeCSS(id = CSS_ID): void {
  if (isServer())
    return

  document.querySelectorAll<HTMLStyleElement>(`#${id}`).forEach(el => el.remove())
}
