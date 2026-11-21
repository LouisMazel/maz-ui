---
title: isProduction
description: Check whether the app runs in production, from the `process.env.NODE_ENV` replaced by its bundler, without crashing when there is no bundler.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { isProduction } from '@maz-ui/utils/helpers/isProduction'

if (!isProduction()) {
  console.warn('Only shown in development')
}
```

## API

```ts
function isProduction(): boolean
```

Returns `true` when `process.env.NODE_ENV` is `'production'`. Vite, webpack and Rollup replace `process.env.NODE_ENV` when they build the app.

## Notes

- Without bundler (a CDN with an import map), `process` does not exist: `isProduction()` returns `false` instead of throwing.
- Use it in a library, instead of `process.env.NODE_ENV !== 'production'`, for the warnings shown only in development.
