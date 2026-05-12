import type { RoundedScaleKey, ThemeColors, ThemeFoundation, ThemeMode, ThemePreset } from '../types'
import { isServer } from '@maz-ui/utils/helpers/isServer'
import { DEFAULT_ROUNDED_RATIOS } from '../presets/_defaults'
import { normalizeColor } from './color-parser'

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
}

const ROUNDED_KEYS: readonly RoundedScaleKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

/**
 * Palette steps 50..950 expressed as OKLCh offsets relative to the base color.
 *
 * `l` is added to the base lightness (clamped to [0, 1]); `c` multiplies the
 * base chroma. Step 500 (`null`) aliases the base directly. The lightness
 * offsets match Tailwind v4's perceptual spread, and the chroma multiplier
 * tapers chroma near the extremes — extremes use less chroma to avoid garish
 * near-white / near-black tones — so derived shades stay vibrant rather than
 * washed-out as `color-mix(..., white|black N%)` would produce.
 */
export const SCALE_OFFSETS = {
  50: { l: 0.42, c: 0.1 },
  100: { l: 0.35, c: 0.3 },
  200: { l: 0.26, c: 0.6 },
  300: { l: 0.17, c: 0.85 },
  400: { l: 0.08, c: 1 },
  500: null,
  600: { l: -0.07, c: 1 },
  700: { l: -0.14, c: 1 },
  800: { l: -0.21, c: 0.85 },
  900: { l: -0.28, c: 0.65 },
  950: { l: -0.34, c: 0.45 },
} as const satisfies Record<number, { l: number, c: number } | null>

export type ScaleStep = keyof typeof SCALE_OFFSETS

/** Color names that receive a 50..950 scale. Foreground variants are NOT scaled. */
export const SCALED_COLOR_NAMES = [
  'primary',
  'secondary',
  'accent',
  'destructive',
  'success',
  'warning',
  'info',
  'contrast',
  'surface',
  'foreground',
  'divider',
  'muted',
  'overlay',
  'shadow',
] as const

export type ScaledColorName = (typeof SCALED_COLOR_NAMES)[number]

export function generateCSS(preset: ThemePreset, options: CSSOptions): string {
  const prefix = options.prefix ?? 'maz'
  const lightClass = options.lightClass ?? 'light'
  const { mode } = options

  const lines: string[] = ['@layer theme {', '  :root {']
  const colorScheme = mode === 'both' ? 'light dark' : `only ${mode}`
  lines.push(`    color-scheme: ${colorScheme};`)

  appendFoundation(lines, preset.foundation, prefix)
  appendScales(lines, preset.scales, prefix)
  appendComponents(lines, preset, prefix, mode)
  appendColorVariables(lines, preset.colors, mode, prefix)
  if (options.scaleColorVariables) {
    appendColorScales(lines, preset.colors, mode, prefix)
  }

  lines.push('  }')

  if (options.darkSelectorStrategy === 'class' && mode === 'both') {
    lines.push(`  .${options.darkClass} { color-scheme: only dark; }`)
    lines.push(`  .${lightClass} { color-scheme: only light; }`)
  }

  lines.push('}')
  return lines.join('\n')
}

function appendColorVariables(
  lines: string[],
  colors: { light: ThemeColors, dark: ThemeColors },
  mode: ThemeMode,
  prefix: string,
): void {
  for (const [key, lightValue] of Object.entries(colors.light) as Array<[keyof ThemeColors, string]>) {
    if (!lightValue)
      continue
    if (mode === 'both') {
      const dark = colors.dark[key] ?? lightValue
      lines.push(`    --${prefix}-${key}: light-dark(${normalizeColor(lightValue)}, ${normalizeColor(dark)});`)
    }
    else {
      const value = mode === 'dark' ? (colors.dark[key] ?? lightValue) : lightValue
      lines.push(`    --${prefix}-${key}: ${normalizeColor(value)};`)
    }
  }
}

function appendColorScales(
  lines: string[],
  colors: { light: ThemeColors, dark: ThemeColors },
  mode: ThemeMode,
  prefix: string,
): void {
  const source = mode === 'dark' ? colors.dark : colors.light
  for (const name of SCALED_COLOR_NAMES) {
    if (!source[name])
      continue
    const base = `var(--${prefix}-${name})`
    for (const [stepStr, off] of Object.entries(SCALE_OFFSETS)) {
      const v = `--${prefix}-${name}-${stepStr}`
      if (off === null) {
        lines.push(`    ${v}: ${base};`)
        continue
      }
      const lExpr = `clamp(0, calc(l ${off.l >= 0 ? '+' : '-'} ${Math.abs(off.l)}), 1)`
      const cExpr = off.c === 1 ? 'c' : `calc(c * ${off.c})`
      lines.push(`    ${v}: oklch(from ${base} ${lExpr} ${cExpr} h);`)
    }
  }
}

function appendFoundation(lines: string[], foundation: Partial<ThemeFoundation> | undefined, prefix: string): void {
  if (!foundation)
    return
  for (const [key, value] of Object.entries(foundation)) {
    if (value)
      lines.push(`    --${prefix}-${key}: ${value};`)
  }
}

function appendScales(lines: string[], scales: ThemePreset['scales'] | undefined, prefix: string): void {
  if (!scales)
    return
  for (const key of ROUNDED_KEYS) {
    const value = scales.rounded?.[key]
    if (value) {
      lines.push(`    --${prefix}-rounded-${key}: ${value};`)
    }
    else if (key !== 'md') {
      lines.push(`    --${prefix}-rounded-${key}: calc(var(--${prefix}-rounded-md) * ${DEFAULT_ROUNDED_RATIOS[key]});`)
    }
  }
  for (const [key, value] of Object.entries(scales.shadow ?? {})) {
    if (value)
      lines.push(`    --${prefix}-shadow-style-${key}: ${value};`)
  }
}

/**
 * Emit per-component bg vars. In `both` mode, values are wrapped in `light-dark()`
 * so they switch with `color-scheme`. Otherwise the matching side is emitted.
 */
function appendComponents(lines: string[], preset: ThemePreset, prefix: string, mode: ThemeMode): void {
  const components = preset.components
  if (!components)
    return

  if (components.btn?.['font-weight']) {
    lines.push(`    --${prefix}-btn-font-weight: ${components.btn['font-weight']};`)
  }

  const emitBg = (componentKey: 'container' | 'input', cssKey: string) => {
    const bg = components[componentKey]?.bg
    if (!bg)
      return
    if (mode === 'both' && (bg.light || bg.dark)) {
      const light = normalizeColor(bg.light ?? bg.dark ?? '')
      const dark = normalizeColor(bg.dark ?? bg.light ?? '')
      const value = light === dark ? light : `light-dark(${light}, ${dark})`
      lines.push(`    --${prefix}-${cssKey}: ${value};`)
    }
    else if (mode !== 'both' && bg[mode]) {
      lines.push(`    --${prefix}-${cssKey}: ${normalizeColor(bg[mode]!)};`)
    }
  }
  emitBg('container', 'container-bg')
  emitBg('input', 'input-bg')

  const inputTopLabelFw = components.input?.['top-label-font-weight']
  if (inputTopLabelFw) {
    lines.push(`    --${prefix}-input-top-label-font-weight: ${inputTopLabelFw};`)
  }
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
