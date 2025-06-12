import type { ThemePreset, ThemePresetOverrides } from './types'
import { mazUi } from './presets'
import { mergePresets } from './utils/preset-merger'

export function definePreset({
  base = mazUi,
  overrides = {},
}: {
  base?: ThemePreset
  overrides: ThemePresetOverrides
}): ThemePreset {
  return mergePresets(base, overrides)
}
