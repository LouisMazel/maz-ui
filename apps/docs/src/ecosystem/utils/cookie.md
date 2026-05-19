---
title: cookie
description: Read, write and delete browser cookies with full attribute support — `path`, `domain`, `maxAge`, `expires`, `secure`, `sameSite`, `partitioned`.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

The module exports three functions: `getCookie`, `setCookie`, `deleteCookie`. Reads work both on the client (via `document.cookie`) and on the server (when you pass the raw `Cookie` header).

## getCookie

```ts
import { getCookie } from '@maz-ui/utils'

const theme = getCookie('theme') // 'dark' | null
```

```ts
function getCookie(key: string, cookieHeader?: string): string | null
```

| Parameter      | Type     | Description                                                                                  |
| -------------- | -------- | -------------------------------------------------------------------------------------------- |
| `key`          | `string` | Cookie name                                                                                  |
| `cookieHeader` | `string` | (Optional) Raw `Cookie` request header — pass during SSR (e.g. from `useSSRContext()` in Nuxt) |

Returns the URL-decoded value, or `null` when the cookie is absent.

## setCookie

```ts
import { setCookie } from '@maz-ui/utils'

setCookie('theme', 'dark')

setCookie('session', token, {
  maxAge: 60 * 60, // 1 hour
  secure: true,
  sameSite: 'Strict',
})
```

```ts
function setCookie(key: string, value: string, options?: CookieOptions): void
```

No-op on the server.

### Options

| Option        | Type      | Default          | Description                                                                       |
| ------------- | --------- | ---------------- | --------------------------------------------------------------------------------- |
| `path`        | `string`  | `'/'`            | Path attribute. Pass `null` to omit.                                              |
| `domain`      | `string`  | —                | Domain attribute.                                                                 |
| `maxAge`      | `number`  | `31_536_000` (1y) | Lifetime in seconds. Pass `null` for a session cookie.                            |
| `expires`     | `Date`    | —                | Explicit expiration date. Takes precedence over `maxAge`.                         |
| `secure`      | `boolean` | —                | Restrict to HTTPS.                                                                |
| `sameSite`    | `'Lax' \| 'Strict' \| 'None'` | `'Lax'` | Same-site policy. Pass `null` to omit.                                            |
| `partitioned` | `boolean` | —                | Mark the cookie as partitioned (CHIPS).                                           |

::: warning `HttpOnly`
`HttpOnly` cannot be set from `document.cookie` — browsers reject it. Use a server-set cookie for that.
:::

## deleteCookie

```ts
import { deleteCookie } from '@maz-ui/utils'

deleteCookie('session')
deleteCookie('analytics-id', { domain: '.example.com' })
```

```ts
function deleteCookie(key: string, options?: Pick<CookieOptions, 'path' | 'domain'>): void
```

For the deletion to take effect, `path` and `domain` must match the values used when the cookie was set.
