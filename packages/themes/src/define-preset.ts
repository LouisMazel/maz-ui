import type { ThemePreset, ThemePresetName, ThemePresetOverrides } from './types'
import { getPreset } from './utils'
import { mergePresets } from './utils/preset-merger'

/**
 * Define a custom theme preset
 *
 * @example
 * ```ts
 * const customTheme = await definePreset({
 *   base: 'mazUi',
 *   overrides: {
 *     colors: {
 *       light: { primary: '210 100% 50%' }
 *     }
 *   }
 * })
 *
 * import { mazUi } from './presets/mazUi'
 * const customTheme = definePreset({
 *   base: mazUi,
 *   overrides: {
 *     foundation: { 'base-font-size': '1rem' }
 *   }
 * })
 *
 * const customTheme = await definePreset({
 *   overrides: {
 *     colors: {
 *       dark: { surface: '0 0% 5%' }
 *     }
 *   }
 * })
 * ```
 */

export function definePreset(options: {
  base: ThemePreset
  overrides: ThemePresetOverrides
}): ThemePreset

export function definePreset(options: {
  base: ThemePresetName
  overrides: ThemePresetOverrides
}): Promise<ThemePreset>

export function definePreset({
  base = 'maz-ui' as const,
  overrides = {},
}: {
  base: ThemePreset | ThemePresetName
  overrides: ThemePresetOverrides
}): ThemePreset | Promise<ThemePreset> {
  if (typeof base === 'string') {
    return getPreset(base).then(basePreset => mergePresets(basePreset, overrides))
  }
  else {
    return mergePresets(base, overrides)
  }
}
