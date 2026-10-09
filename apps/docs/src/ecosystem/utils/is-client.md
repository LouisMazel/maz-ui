---
title: isClient
description: Check whether the code is running in a browser environment (has a `document`).
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { isClient } from '@maz-ui/utils'

if (isClient()) {
  document.body.classList.add('hydrated')
}
```

## API

```ts
function isClient(): boolean
```

Returns `true` if `document` is defined, `false` otherwise (e.g. SSR, Node.js, Web Workers).

## Notes

- The opposite is [`isServer`](./is-server).
- Implemented as a one-liner: `typeof document !== 'undefined'`.
- Prefer this over checking `process.client` (Nuxt) or `import.meta.env.SSR` (Vite) when you want a framework-agnostic check.
