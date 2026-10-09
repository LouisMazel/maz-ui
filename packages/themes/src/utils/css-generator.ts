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
}

const ROUNDED_KEYS: readonly RoundedScaleKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

export function generateCSS(preset: ThemePreset, options: CSSOptions): string {
  const prefix = options.prefix ?? 'maz'
  const lightClass = options.lightClass ?? 'light'
  const { mode } = options

  const lines: string[] = ['@layer theme {', '  :root {']
  // In 'class' strategy the .dark/.light selectors are the source of truth.
  // Defaulting :root to 'light' makes "no class" resolve to light (matches what
  // a host like VitePress or Tailwind `darkMode: 'class'` expects), instead of
  // following the system pref via `light-dark()` and desyncing from the host.
  const colorScheme = mode !== 'both'
    ? `only ${mode}`
    : options.darkSelectorStrategy === 'class' ? 'light' : 'light dark'
  lines.push(`    color-scheme: ${colorScheme};`)

  appendFoundation(lines, preset.foundation, prefix)
  appendScales(lines, preset.scales, prefix)
  appendComponents(lines, preset, prefix, mode)
  appendColorVariables(lines, preset.colors, mode, prefix)

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

  if (components.dialog?.['max-width']) {
    lines.push(`    --${prefix}-dialog-max-width: ${components.dialog['max-width']};`)
  }
  if (components.dialog?.['min-width']) {
    lines.push(`    --${prefix}-dialog-min-width: ${components.dialog['min-width']};`)
  }

  const emitBg = (componentKey: 'container' | 'input', cssKey: string) => {
    const bg = components[componentKey]?.bg
    if (!bg)
      return
    if (mode === 'both') {
      const fallback = bg.light ?? bg.dark
      if (!fallback)
        return
      const light = normalizeColor(bg.light ?? fallback)
      const dark = normalizeColor(bg.dark ?? fallback)
      const value = light === dark ? light : `light-dark(${light}, ${dark})`
      lines.push(`    --${prefix}-${cssKey}: ${value};`)
    }
    else if (bg[mode]) {
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

  const styleElements = document.querySelectorAll<HTMLStyleElement>(`#${id}`)
  // Keep the last element (most recent), drop the rest, then update its content.
  // If none exist, create a fresh <style>.
  let target = styleElements[styleElements.length - 1] as HTMLStyleElement | undefined
  for (let i = 0; i < styleElements.length - 1; i++) {
    styleElements[i].remove()
  }
  if (!target) {
    target = document.createElement('style')
    target.id = id
    document.head.appendChild(target)
  }
  target.textContent = css
}

export function removeCSS(id = CSS_ID): void {
  if (isServer())
    return
  document.querySelectorAll<HTMLStyleElement>(`#${id}`).forEach(el => el.remove())
}
