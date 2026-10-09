import { deleteCookie, getCookie, setCookie } from '@maz-ui/utils/helpers/cookie'

const PRESET_COOKIE = 'maz-preset'

export interface SavedPreset {
  /** Identity of the preset declared in the app config (the "base"). */
  base: string
  /** Currently active preset name (equals `base` unless switched at runtime). */
  active: string
}

/**
 * Parse the `maz-preset` cookie. Format is `"<base>:<active>"` where `base` is
 * the configured preset identity, so a cookie written by another app or a
 * previous config on the same host is detectable as foreign. A legacy
 * plain-name value (no `:`) is treated as unscoped and returns `null` so it
 * cannot hijack the configured preset.
 */
export function getSavedPreset(): SavedPreset | null {
  const raw = getCookie(PRESET_COOKIE)
  if (!raw)
    return null

  const separatorIndex = raw.indexOf(':')
  if (separatorIndex === -1)
    return null

  const base = raw.slice(0, separatorIndex)
  const active = raw.slice(separatorIndex + 1)
  if (!base || !active)
    return null

  return { base, active }
}

/** Serialize `base`/`active` into the `maz-preset` cookie, no-op if unchanged. */
export function savePreset(base: string, active: string): void {
  if (!base || !active)
    return

  const value = `${base}:${active}`
  if (getCookie(PRESET_COOKIE) === value)
    return

  setCookie(PRESET_COOKIE, value)
}

/** Drop the `maz-preset` cookie (saved preset no longer resolves). */
export function clearSavedPresetName(): void {
  deleteCookie(PRESET_COOKIE)
}
