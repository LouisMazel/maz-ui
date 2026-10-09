---
title: DeepRequired
description: Recursive variant of TypeScript's `Required<T>` — strips `?` from every property at every depth.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

The mirror image of [`DeepPartial`](./deep-partial). Useful when you want a fully-resolved internal type derived from a public options interface.

## Usage

```ts
import type { DeepRequired } from '@maz-ui/utils'

interface Options {
  cache?: {
    ttl?: number
    strategy?: 'memory' | 'disk'
  }
}

type ResolvedOptions = DeepRequired<Options>
// {
//   cache: {
//     ttl: number
//     strategy: 'memory' | 'disk'
//   }
// }
```

## API

```ts
type DeepRequired<T> = Required<{
  [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>
}>
```
