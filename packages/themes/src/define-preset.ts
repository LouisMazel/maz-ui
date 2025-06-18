import type { MazUiThemeOptions } from './plugin'
import type { ThemePreset, ThemePresetName, ThemePresetOverrides } from './types'
import { getPreset } from './utils'
import { mergePresets } from './utils/preset-merger'

/**
 * Define a custom theme preset
 *
 * @example
 * ```ts
 * // Utilisation asynchrone avec une base string
 * const customTheme = await definePreset({
 *   base: 'mazUi',
 *   overrides: {
 *     colors: {
 *       light: { primary: '210 100% 50%' }
 *     }
 *   }
 * })
 *
 * // Utilisation synchrone avec un objet preset
 * import { mazUi } from './presets/mazUi'
 * const customTheme = definePreset({
 *   base: mazUi,
 *   overrides: {
 *     foundation: { radius: '1rem' }
 *   }
 * })
 *
 * // Utilisation asynchrone sans base (utilise 'maz-ui' par défaut)
 * const customTheme = await definePreset({
 *   overrides: {
 *     colors: {
 *       dark: { background: '0 0% 5%' }
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
  base?: ThemePresetName
  overrides: ThemePresetOverrides
}): Promise<ThemePreset>

export function definePreset({
  base = 'maz-ui' as const,
  overrides = {},
}: {
  base?: MazUiThemeOptions['preset']
  overrides: ThemePresetOverrides
}): ThemePreset | Promise<ThemePreset> {
  if (typeof base === 'string') {
    return getPreset(base).then(basePreset => mergePresets(basePreset, overrides))
  }
  else {
    return mergePresets(base, overrides)
  }
}
