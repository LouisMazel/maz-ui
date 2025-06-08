import type { BaseThemePreset, ThemeAppearance, ThemeColors } from '../types'
import { generateColorScale } from './color-utils'

export function generateThemeCSS(preset: BaseThemePreset, options: { darkMode?: 'auto' | 'class' | 'media', prefix?: string } = {}): string {
  const { darkMode = 'class', prefix = 'maz' } = options

  let css = `@layer maz-ui-theme {\n`

  css += generateColorVariables({ colors: preset.colors.light, appearance: preset.appearance, selector: ':root', prefix, scale: true })

  if (darkMode === 'class') {
    css += generateColorVariables({ colors: preset.colors.dark, selector: '.dark', prefix, scale: true })
  }
  else if (darkMode === 'media') {
    css += generateColorVariables({ colors: preset.colors.dark, selector: '', mediaQuery: '@media (prefers-color-scheme: dark)', prefix, scale: true })
  }

  return css
}

export function generateCriticalThemeCSS(preset: BaseThemePreset, options: { darkMode?: 'auto' | 'class' | 'media', prefix?: string } = {}): string {
  const { darkMode = 'class', prefix = 'maz' } = options

  const criticalColors: (keyof ThemeColors)[] = [
    'background',
    'foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'text',
    'border',
  ]

  const criticalAppearance: (keyof ThemeAppearance)[] = [
    'radius',
    'font-family',
  ]

  const lightColors = Object.fromEntries(
    criticalColors.map(key => [key, preset.colors?.light?.[key]]),
  )

  const darkColors = Object.fromEntries(
    criticalColors.map(key => [key, preset.colors?.dark?.[key]]),
  )

  const appearance = Object.fromEntries(
    criticalAppearance.map(key => [key, preset.appearance?.[key]]),
  )

  let css = '@layer maz-ui-theme {\n'

  css += `  ${generateColorVariables({ colors: lightColors, appearance, selector: ':root', prefix, scale: false })}\n`

  if (darkMode === 'class') {
    css += `  ${generateColorVariables({ colors: darkColors, selector: '.dark', prefix, scale: false })}`
  }
  else if (darkMode === 'media') {
    css += `  ${generateColorVariables({ colors: darkColors, mediaQuery: '@media (prefers-color-scheme: dark)', prefix, scale: false })}`
  }

  css += '}\n'

  return css
}

function generateColorVariables<T extends ThemeColors, Scale extends boolean>({
  colors,
  appearance,
  selector = '',
  mediaQuery,
  prefix = 'maz',
  scale,
}: { colors: Scale extends true ? T : Partial<T>, appearance?: Partial<ThemeAppearance>, selector?: string, mediaQuery?: string, prefix: string, scale: Scale }): string {
  const noScaleColors: (keyof ThemeColors)[] = ['border', 'muted', 'overlay']

  let variables = ''

  if (scale === false) {
    variables += Object.entries(colors)
      .map(([key, value]) => {
        if (!noScaleColors.includes(key as keyof ThemeColors)) {
          return `    --${prefix}-${key}-500: ${value};`
        }
        return `    --${prefix}-${key}: ${value};`
      })
      .join('\n')
  }

  if (appearance) {
    const appearanceVariables = Object.entries(appearance)
      .map(([key, value]) => `  --${prefix}-${key}: ${value};`)
      .join('\n')

    variables += `  \n${appearanceVariables}\n`
  }

  if (scale === true) {
    variables += `      \n${generateColorScaleVariables({ baseColor: colors.primary!, colorName: 'primary', prefix })}`
    variables += `      \n${generateColorScaleVariables({ baseColor: colors.secondary!, colorName: 'secondary', prefix })}`
    variables += `      \n${generateColorScaleVariables({ baseColor: colors.accent!, colorName: 'accent', prefix })}`
    variables += `      \n${generateColorScaleVariables({ baseColor: colors.destructive!, colorName: 'destructive', prefix })}`
    variables += `      \n${generateColorScaleVariables({ baseColor: colors.success!, colorName: 'success', prefix })}`
    variables += `      \n${generateColorScaleVariables({ baseColor: colors.warning!, colorName: 'warning', prefix })}`
    variables += `      \n${generateColorScaleVariables({ baseColor: colors.contrast!, colorName: 'contrast', prefix })}`
  }

  return `${selector || mediaQuery} {\n${variables}\n  }\n`
}

function generateColorScaleVariables({ baseColor, colorName, prefix = 'maz' }: { baseColor: string, colorName: string, prefix: string }): string {
  const scale = generateColorScale(baseColor)

  const variables = Object.entries(scale)
    .map(([key, value]) => `  --${prefix}-${colorName}-${key}: ${value};`)
    .join('\n')

  return `${variables}\n`
}

export function injectCSS(css: string, id: string = 'maz-theme-vars'): void {
  if (typeof document === 'undefined')
    return

  let styleElement = document.getElementById(id) as HTMLStyleElement | null

  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = `${id}`
    document.head.appendChild(styleElement)
  }

  styleElement.textContent = css
}

export function removeCSS(id: string = 'maz-theme-vars'): void {
  if (typeof document === 'undefined')
    return

  const styleElement = document.getElementById(`${id}`)
  if (styleElement) {
    styleElement.remove()
  }
}
