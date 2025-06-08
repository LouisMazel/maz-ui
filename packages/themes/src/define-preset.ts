import type { BaseThemePreset, ThemePreset } from './types'
import { mazUi } from './presets'
import { mergePresets } from './utils/preset-merger'

export function definePreset({
  base = mazUi,
  overrides = {},
}: {
  base?: BaseThemePreset
  overrides?: Partial<ThemePreset>
}): BaseThemePreset {
  return mergePresets(base, overrides)
}
