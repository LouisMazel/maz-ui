import type { ThemePreset } from '@maz-ui/themes'
import type { PresetValue } from '../project/preset'
import type { ReviewContext } from './types'

import { folio, mazUi, nova, obsidian, ocean, pristine } from '@maz-ui/themes/presets'
import { evaluateColor, getContrastRatio } from '@maz-ui/themes/utils/resolve-preset'
import { readPresets } from '../project/preset'

const MIN_CONTRAST = 3
const BRAND_ROLES = ['primary', 'secondary'] as const
const MODES = ['light', 'dark'] as const

const KNOWN_PRESETS: Record<string, ThemePreset> = {
  'mazUi': mazUi,
  'maz-ui': mazUi,
  'ocean': ocean,
  'pristine': pristine,
  'obsidian': obsidian,
  'nova': nova,
  'folio': folio,
}

function colorOf(value: PresetValue | undefined): string | undefined {
  return typeof value === 'string' && !value.startsWith('<expr:') && evaluateColor(value)
    ? value
    : undefined
}

function modeColors(overrides: PresetValue | undefined, mode: string): Record<string, PresetValue> {
  const colors = (overrides as { [key: string]: PresetValue } | undefined)?.[mode]

  return colors && typeof colors === 'object' && !Array.isArray(colors)
    ? colors
    : {}
}

function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
}

function locateColor(code: string, role: string, value: string): number {
  const match = new RegExp(String.raw`['"]?\b${role}['"]?\s*:\s*['"\`]${escapeRegExp(value)}`).exec(code)

  return match?.index ?? Math.max(0, code.indexOf('definePreset'))
}

function surfaceOf(overridden: Record<string, PresetValue>, base: ThemePreset | undefined, mode: string): string | undefined {
  if (overridden.surface !== undefined)
    return colorOf(overridden.surface)

  const fromBase = base?.colors?.[mode as 'light' | 'dark']?.surface

  if (fromBase)
    return fromBase

  return mode === 'light'
    ? 'oklch(1 0 0)'
    : undefined
}

function paleMessage(role: string, mode: string, ratio: number): string {
  return role === 'secondary'
    ? `\`secondary\` (${mode}) is too pale: ${ratio.toFixed(2)}:1 against the surface (3:1 minimum). In maz-ui \`secondary\` is the second strong brand color, not a muted surface like in shadcn/ui: \`MazBtn color="secondary" outlined\` and \`text-secondary\` become invisible.`
    : `\`primary\` (${mode}) is too pale: ${ratio.toFixed(2)}:1 against the surface (3:1 minimum). Buttons, links, focus rings and outlines use it as text or border color.`
}

/** Flags `primary` and `secondary` colors of a `definePreset` that are too pale to read on the surface of the same mode */
export function checkPresetColors(code: string, offset: number, context: ReviewContext): void {
  if (!code.includes('definePreset'))
    return

  for (const preset of readPresets('', code)) {
    const base = preset.base
      ? KNOWN_PRESETS[preset.base]
      : undefined

    for (const mode of MODES) {
      const overridden = modeColors(preset.overrides.colors, mode)
      const surface = surfaceOf(overridden, base, mode)

      for (const role of BRAND_ROLES) {
        const value = colorOf(overridden[role])
        const ratio = surface && value
          ? getContrastRatio(value, surface)
          : MIN_CONTRAST

        if (!value || ratio >= MIN_CONTRAST)
          continue

        context.report({
          rule: 'pale-brand-color',
          severity: 'warning',
          message: paleMessage(role, mode, ratio),
          suggestion: 'Use a stronger color (lower lightness in light mode, higher in dark mode). For discreet backgrounds use `bg-surface`, `bg-container`, `bg-muted/10`, the `-50`/`-100` steps, or `MazBtn pastel` / `outlined`.',
        }, offset + locateColor(code, role, value))
      }
    }
  }
}
