import { isServer } from '@maz-ui/utils/helpers/isServer'

const PRESET_COOKIE = 'maz-preset'

/**
 * Read a cookie by key.
 *
 * - On the client, the cookie is read from `document.cookie`.
 * - On the server, pass the raw `Cookie` request header via `cookieHeader`
 *   (e.g. from `useSSRContext().event.node.req.headers.cookie` in Nuxt) to
 *   resolve the value during SSR. Without it, the function returns `null`.
 */
export function getCookie(key: string, cookieHeader?: string): string | null {
  const source = isServer()
    ? cookieHeader
    : typeof document !== 'undefined'
      ? document.cookie
      : undefined

  if (!source)
    return null

  const cookies = source.split(';')
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
