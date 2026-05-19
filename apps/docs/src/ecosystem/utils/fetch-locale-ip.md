---
title: fetchLocaleIp
description: Resolve the visitor's ISO country code from their IP address using the free `ipwho.is` service.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Useful for pre-filling locale-aware UI — phone-number country selectors, currency hints, default language — before the user has interacted with the page.

## Usage

```ts
import { fetchLocaleIp } from '@maz-ui/utils'

const countryCode = await fetchLocaleIp()
// 'FR' | 'US' | …  or undefined if the request fails
```

## API

```ts
function fetchLocaleIp(): Promise<string | undefined>
```

Returns the ISO 3166-1 alpha-2 country code (e.g. `'FR'`), or `undefined` if the request fails. Errors are caught and logged via `console.error` — the call never throws.

## Notes

- Hits `https://ipwho.is` — a public, no-key service. Consider rate limits and privacy for production usage.
- Returns `undefined` rather than throwing so a fallback path (default locale, manual selection) can be wired without `try/catch`.
- For a static locale source, see [`getBrowserLocale`](./get-browser-locale).
