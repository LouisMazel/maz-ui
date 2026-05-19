---
title: FlattenObjectKeys
description: Build a union of dot-separated leaf paths for a nested object, with an optional prefix.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Similar to [`DeepKeyOf`](./deep-key-of) but only yields **leaf** paths (skips intermediate object keys), and accepts a `Prefix` parameter for namespacing.

## Usage

```ts
import type { FlattenObjectKeys } from '@maz-ui/utils'

interface Config {
  app: {
    name: string
    version: number
  }
  debug: boolean
}

type Leaves = FlattenObjectKeys<Config>
// → 'app.name' | 'app.version' | 'debug'

type Namespaced = FlattenObjectKeys<Config, 'config.'>
// → 'config.app.name' | 'config.app.version' | 'config.debug'
```

## API

```ts
type FlattenObjectKeys<T extends Record<string, any>, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? FlattenObjectKeys<T[K], `${Prefix}${K extends string ? K : ''}.`>
    : `${Prefix}${K extends string ? K : ''}`
}[keyof T]
```

## Notes

- Unlike `DeepKeyOf`, intermediate object keys (e.g. `'app'` in the example) are not included — only the paths that resolve to non-object leaves.
