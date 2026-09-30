import { isServer } from './isServer'

export type CookieSameSite = 'Lax' | 'Strict' | 'None' | 'lax' | 'strict' | 'none'

export interface CookieOptions {
  /** Path attribute. Defaults to `'/'`. Pass `null` to omit. */
  path?: string | null
  /** Domain attribute. */
  domain?: string
  /** Lifetime in seconds. Defaults to one year. Pass `null` to omit (session cookie). */
  maxAge?: number | null
  /** Explicit expiration date. Takes precedence over `maxAge` when both are set. */
  expires?: Date
  /** Restrict the cookie to HTTPS connections. */
  secure?: boolean
  /** Same-site policy. Defaults to `'Lax'`. Pass `null` to omit. */
  sameSite?: CookieSameSite | null
  /** Mark the cookie as partitioned (CHIPS). */
  partitioned?: boolean
}

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

/**
 * Read a cookie by key.
 *
 * - On the client, the cookie is read from `document.cookie`.
 * - On the server, pass the raw `Cookie` request header via `cookieHeader`
 *   (e.g. from `useSSRContext().event.node.req.headers.cookie` in Nuxt) to
 *   resolve the value during SSR. Without it, the function returns `null`.
 */
export function getCookie(key: string, cookieHeader?: string): string | null {
  const source = isServer() ? cookieHeader : document.cookie

  if (!source)
    return null

  const cookies = source.split(';')
  const cookie = cookies.find(c => c.trim().startsWith(`${key}=`))

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
}

/**
 * Write a cookie via `document.cookie` with full attribute support.
 *
 * No-op on the server. `HttpOnly` is intentionally omitted as it cannot be set
 * from `document.cookie` (browsers reject it).
 */
export function setCookie(key: string, value: string, options: CookieOptions = {}): void {
  if (isServer())
    return

  const {
    path = '/',
    domain,
    maxAge = ONE_YEAR_SECONDS,
    expires,
    secure,
    sameSite = 'Lax',
    partitioned,
  } = options

  const parts: string[] = [`${key}=${encodeURIComponent(value)}`]

  if (path != null)
    parts.push(`path=${path}`)
  if (domain)
    parts.push(`domain=${domain}`)
  if (maxAge != null)
    parts.push(`max-age=${maxAge}`)
  if (expires)
    parts.push(`expires=${expires.toUTCString()}`)
  if (secure)
    parts.push('secure')
  if (sameSite != null)
    parts.push(`SameSite=${sameSite}`)
  if (partitioned)
    parts.push('partitioned')

  document.cookie = parts.join('; ')
}

/**
 * Delete a cookie by writing `max-age=0`. `path` and `domain` must match the
 * cookie's original attributes for the browser to actually drop it.
 */
export function deleteCookie(key: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
  setCookie(key, '', { ...options, maxAge: 0 })
}
