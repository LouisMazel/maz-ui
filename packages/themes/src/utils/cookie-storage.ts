import type { SavedPreset } from './theme-preferences'
import { clearPresetPreference, readPresetPreference, savePresetPreference } from './theme-preferences'

export { PRESET_COOKIE } from './theme-preferences'
export type { SavedPreset } from './theme-preferences'

export function getSavedPreset(): SavedPreset | null {
  return readPresetPreference()
}

export function savePreset(base: string, active: string): void {
  savePresetPreference(base, active)
}

/** Drop the `maz-preset` cookie (saved preset no longer resolves). */
export function clearSavedPresetName(): void {
  clearPresetPreference()
}
