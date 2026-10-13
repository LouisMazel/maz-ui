---
title: isServer
description: Check whether the code is running on the server (no `window` or `document`).
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { isServer } from '@maz-ui/utils'

if (isServer()) {
  return placeholder
}
```

## API

```ts
function isServer(): boolean
```

Returns `true` when either `document` or `window` is undefined — covers Node.js, Bun, Deno, Edge runtimes and Web Workers.

## Notes

- The opposite is [`isClient`](./is-client).
- Useful for guarding `window`-dependent code from SSR errors.
