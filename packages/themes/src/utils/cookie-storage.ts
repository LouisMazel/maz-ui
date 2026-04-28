import { isServer } from '@maz-ui/utils/helpers/isServer'

const ONE_YEAR = 60 * 60 * 24 * 365
const PRESET_COOKIE = 'maz-preset'

export function getCookie(key: string): string | null {
  if (isServer())
    return null

  const cookies = document.cookie.split(';')
  const cookie = cookies.find(c => c.trim().startsWith(`${key}=`))

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
}

export function setCookie(key: string, value: string, maxAge = ONE_YEAR): void {
  if (isServer())
    return

  document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function deleteCookie(key: string): void {
  if (isServer())
    return

  document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax`
}

/**
 * Returns the preset name persisted in the `maz-preset` cookie, or `null`.
 * Pure cookie read — caller is responsible for resolving the name to an
 * actual preset (and for clearing the cookie if it turns out to be invalid).
 */
export function getSavedPresetName(): string | null {
  return getCookie(PRESET_COOKIE)
}

/**
 * Persist the resolved preset name. No-op when the value already matches the
 * cookie or when running on the server.
 */
export function saveResolvedPresetName(name: string): void {
  if (isServer() || !name)
    return

  if (getCookie(PRESET_COOKIE) === name)
    return

  setCookie(PRESET_COOKIE, name)
}

/**
 * Drop the `maz-preset` cookie — used when the saved name no longer
 * resolves to a known preset.
 */
export function clearSavedPresetName(): void {
  deleteCookie(PRESET_COOKIE)
}
