import { isServer } from '@maz-ui/utils/helpers/isServer'

const PRESET_COOKIE = 'maz-preset'

export function getCookie(key: string): string | null {
  if (isServer())
    return null

  const cookies = document.cookie.split(';')
  const cookie = cookies.find(c => c.trim().startsWith(`${key}=`))

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
}

export function setCookie(key: string, value: string): void {
  if (isServer())
    return

  document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
}

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
  if (isServer())
    return
  document.cookie = `${PRESET_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}
