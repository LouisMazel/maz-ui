import { deleteCookie, getCookie, setCookie } from '@maz-ui/utils/helpers/cookie'

const PRESET_COOKIE = 'maz-preset'

/** Persisted preset name from `maz-preset` cookie, or `null`. */
export function getSavedPresetName(): string | null {
  return getCookie(PRESET_COOKIE)
}

/** Write `name` to the `maz-preset` cookie, no-op if value already matches. */
export function saveResolvedPresetName(name: string): void {
  if (!name || getCookie(PRESET_COOKIE) === name)
    return
  setCookie(PRESET_COOKIE, name)
}

/** Drop the `maz-preset` cookie (saved name no longer resolves). */
export function clearSavedPresetName(): void {
  deleteCookie(PRESET_COOKIE)
}
