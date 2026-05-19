---
title: getBrowserLocale
description: Read the user's browser language tag (e.g. `'fr-FR'`, `'en-US'`) — returns `undefined` on the server.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { getBrowserLocale } from '@maz-ui/utils'

const locale = getBrowserLocale() // 'fr-FR' | 'en-US' | … | undefined
```

## API

```ts
function getBrowserLocale(): string | undefined
```

Returns `navigator.language` on the client. On the server (no `navigator`), returns `undefined`.

## Notes

- For IP-based country detection instead of the browser-declared locale, see [`fetchLocaleIp`](./fetch-locale-ip).
- The returned tag follows [BCP 47](https://www.rfc-editor.org/info/bcp47).
