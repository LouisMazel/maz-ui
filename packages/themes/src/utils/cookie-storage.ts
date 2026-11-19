import type { SavedPreset } from './theme-preferences.ts'
import { clearPresetPreference, readPresetPreference, savePresetPreference } from './theme-preferences.ts'

export { PRESET_COOKIE } from './theme-preferences.ts'
export type { SavedPreset } from './theme-preferences.ts'

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
