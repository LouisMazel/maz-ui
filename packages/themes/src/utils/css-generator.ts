import type { Duration, RoundedScaleKey, ThemeColors, ThemeFoundation, ThemeMode, ThemePreset } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { DEFAULT_ROUNDED_RATIOS } from '../presets/_defaults'
import { normalizeColor } from './color-parser'
import { SCALE_MIX_PERCENTAGES, SCALED_COLOR_NAMES } from './scale-mix-percentages'

export interface CSSOptions {
  /** Theme mode to generate */
  mode: ThemeMode
  /** Dark mode selector: 'class' (.dark/.light) | 'media' (system pref only) */
  darkSelectorStrategy: 'class' | 'media'
  /** CSS variables prefix */
  prefix?: string
  /** Dark class name */
  darkClass: string
  /** Light class name (default 'light') */
  lightClass?: string
  /** Whether to emit color-mix scales (--X-50..950) */
  scaleColorVariables: boolean
  /** When truthy, emit @property registrations + transition on color vars. Default false. */
  colorTransition?: false | { duration: Duration, easing: string }
}

const ROUNDED_KEYS: readonly RoundedScaleKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

export function generateCSS(preset: ThemePreset, options: CSSOptions): string {
  const prefix = options.prefix ?? 'maz'
  const lightClass = options.lightClass ?? 'light'
  const colorTransition = options.colorTransition ?? false
  const transition = isValidTransition(colorTransition) ? colorTransition : false

  const lines: string[] = []

  if (transition) {
    lines.push(emitPropertyBlock(preset, prefix, options.mode))
  }

  lines.push('@layer theme {')

  lines.push(emitRootBlock(preset, prefix, options, transition))

  if (options.darkSelectorStrategy === 'class' && options.mode === 'both') {
    lines.push(`  .${options.darkClass} { color-scheme: only dark; }`)
    lines.push(`  .${lightClass} { color-scheme: only light; }`)
  }

  lines.push('}')
  return lines.join('\n')
}

function isValidTransition(
  t: false | { duration: Duration, easing: string },
): t is { duration: Duration, easing: string } {
  return t !== false
    && typeof t.duration === 'string'
    && t.duration.length > 0
    && typeof t.easing === 'string'
    && t.easing.length > 0
}

function emitRootBlock(
  preset: ThemePreset,
  prefix: string,
  options: CSSOptions,
  colorTransition: false | { duration: Duration, easing: string },
): string {
  const lines: string[] = ['  :root {']
  lines.push(`    color-scheme: ${resolveColorScheme(options.mode)};`)

  lines.push(...emitFoundation(preset.foundation, prefix))
  lines.push(...emitScales(preset.scales, prefix))
  lines.push(...emitComponents(preset, prefix, options.mode))
  lines.push(...emitColorVariables(preset.colors, options.mode, prefix))

  if (options.scaleColorVariables) {
    lines.push(...emitColorScales(preset.colors, options.mode, prefix))
  }

  if (colorTransition) {
    lines.push(emitTransition(preset, prefix, colorTransition, options.mode))
  }

  lines.push('  }')
  return lines.join('\n')
}

function resolveColorScheme(mode: ThemeMode): string {
  if (mode === 'light')
    return 'only light'
  if (mode === 'dark')
    return 'only dark'
  return 'light dark'
}

function emitColorVariables(
  colors: { light: ThemeColors, dark: ThemeColors },
  mode: ThemeMode,
  prefix: string,
): string[] {
  const lines: string[] = []
  const entries = Object.entries(colors.light) as Array<[keyof ThemeColors, string]>

  for (const [key, lightValue] of entries) {
    if (!lightValue)
      continue
    if (mode === 'light') {
      lines.push(`    --${prefix}-${key}: ${normalizeColor(lightValue)};`)
    }
    else if (mode === 'dark') {
      const darkValue = colors.dark[key] ?? lightValue
      lines.push(`    --${prefix}-${key}: ${normalizeColor(darkValue)};`)
    }
    else {
      const darkValue = colors.dark[key] ?? lightValue
      lines.push(`    --${prefix}-${key}: light-dark(${normalizeColor(lightValue)}, ${normalizeColor(darkValue)});`)
    }
  }
  return lines
}

function emitColorScales(
  colors: { light: ThemeColors, dark: ThemeColors },
  mode: ThemeMode,
  prefix: string,
): string[] {
  const lines: string[] = []
  const source = mode === 'dark' ? colors.dark : colors.light

  for (const name of SCALED_COLOR_NAMES) {
    if (!source[name])
      continue
    for (const [stepStr, conf] of Object.entries(SCALE_MIX_PERCENTAGES)) {
      const step = Number(stepStr)
      if (conf.mixWith === null) {
        lines.push(`    --${prefix}-${name}-${step}: var(--${prefix}-${name});`)
      }
      else {
        lines.push(`    --${prefix}-${name}-${step}: color-mix(in oklch, var(--${prefix}-${name}), ${conf.mixWith} ${conf.percent}%);`)
      }
    }
  }
  return lines
}

function emitFoundation(foundation: Partial<ThemeFoundation> | undefined, prefix: string): string[] {
  if (!foundation)
    return []
  const lines: string[] = []
  for (const [key, value] of Object.entries(foundation)) {
    if (value)
      lines.push(`    --${prefix}-${key}: ${value};`)
  }
  return lines
}

function emitScales(scales: ThemePreset['scales'] | undefined, prefix: string): string[] {
  if (!scales)
    return []
  const lines: string[] = []
  for (const key of ROUNDED_KEYS) {
    const value = scales.rounded?.[key]
    if (value) {
      lines.push(`    --${prefix}-rounded-${key}: ${value};`)
    }
    else if (key !== 'md') {
      const ratio = DEFAULT_ROUNDED_RATIOS[key]
      lines.push(`    --${prefix}-rounded-${key}: calc(var(--${prefix}-rounded-md) * ${ratio});`)
    }
  }
  for (const [key, value] of Object.entries(scales.shadow ?? {})) {
    if (value)
      lines.push(`    --${prefix}-shadow-style-${key}: ${value};`)
  }
  return lines
}

/**
 * Emit per-component bg vars. When mode is 'both', wrap the values in `light-dark()`
 * so the bg switches with `color-scheme`. When mode is 'light' or 'dark', emit only
 * the corresponding side. Container/input bg fall back to the other mode if their
 * own mode value is missing.
 */
function emitComponents(preset: ThemePreset, prefix: string, mode: ThemeMode): string[] {
  const lines: string[] = []
  const components = preset.components
  if (!components)
    return lines

  if (components.btn?.['font-weight']) {
    lines.push(`    --${prefix}-btn-font-weight: ${components.btn['font-weight']};`)
  }

  const emitBg = (componentKey: 'container' | 'input', cssKey: string) => {
    const bg = components[componentKey]?.bg
    if (!bg)
      return
    if (mode === 'light' && bg.light) {
      lines.push(`    --${prefix}-${cssKey}: ${normalizeColor(bg.light)};`)
    }
    else if (mode === 'dark' && bg.dark) {
      lines.push(`    --${prefix}-${cssKey}: ${normalizeColor(bg.dark)};`)
    }
    else if (mode === 'both' && (bg.light || bg.dark)) {
      const light = bg.light ?? bg.dark ?? ''
      const dark = bg.dark ?? bg.light ?? ''
      const normalizedLight = normalizeColor(light)
      const normalizedDark = normalizeColor(dark)
      if (normalizedLight === normalizedDark) {
        lines.push(`    --${prefix}-${cssKey}: ${normalizedLight};`)
      }
      else {
        lines.push(`    --${prefix}-${cssKey}: light-dark(${normalizedLight}, ${normalizedDark});`)
      }
    }
  }
  emitBg('container', 'container-bg')
  emitBg('input', 'input-bg')

  const inputTopLabelFw = components.input?.['top-label-font-weight']
  if (inputTopLabelFw) {
    lines.push(`    --${prefix}-input-top-label-font-weight: ${inputTopLabelFw};`)
  }

  return lines
}

function isColorEmitted(
  colors: { light: ThemeColors, dark: ThemeColors },
  key: keyof ThemeColors,
  mode: ThemeMode,
): boolean {
  if (mode === 'dark')
    return Boolean(colors.dark[key] ?? colors.light[key])
  return Boolean(colors.light[key])
}

function emitPropertyBlock(preset: ThemePreset, prefix: string, mode: ThemeMode): string {
  const colorKeys = Object.keys(preset.colors.light) as Array<keyof ThemeColors>
  const blocks = colorKeys
    .filter(key => isColorEmitted(preset.colors, key, mode))
    .map((key) => {
      const value = mode === 'dark'
        ? preset.colors.dark[key] ?? preset.colors.light[key] ?? 'oklch(0 0 0)'
        : preset.colors.light[key] ?? preset.colors.dark[key] ?? 'oklch(0 0 0)'
      const initial = normalizeColor(value)
      return [
        `@property --${prefix}-${key} {`,
        `  syntax: '<color>';`,
        `  inherits: true;`,
        `  initial-value: ${initial};`,
        `}`,
      ].join('\n')
    })
  return blocks.join('\n')
}

function emitTransition(
  preset: ThemePreset,
  prefix: string,
  conf: { duration: Duration, easing: string },
  mode: ThemeMode,
): string {
  const colorKeys = Object.keys(preset.colors.light) as Array<keyof ThemeColors>
  const segments = colorKeys
    .filter(key => isColorEmitted(preset.colors, key, mode))
    .map(k => `--${prefix}-${k} ${conf.duration} ${conf.easing}`)
  return `    transition: ${segments.join(', ')};`
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

  const lastElement = styleElements.at(-1)
  for (let i = 0; i < styleElements.length - 1; i++) {
    styleElements[i].remove()
  }
  if (lastElement)
    lastElement.textContent = css
}

export function removeCSS(id = CSS_ID): void {
  if (isServer())
    return
  document.querySelectorAll<HTMLStyleElement>(`#${id}`).forEach(el => el.remove())
}
