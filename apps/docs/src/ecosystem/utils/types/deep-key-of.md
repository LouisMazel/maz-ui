---
title: DeepKeyOf
description: Recursively build a union of dot-separated key paths for any nested object type.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Use it to type i18n keys, nested form paths, or any string that must reference a leaf of a known object shape.

## Usage

```ts
import type { DeepKeyOf } from '@maz-ui/utils'

interface Config {
  app: {
    name: string
    theme: {
      mode: 'light' | 'dark'
      primary: string
    }
  }
  version: number
}

type Keys = DeepKeyOf<Config>
// → 'app.name' | 'app.theme.mode' | 'app.theme.primary' | 'version'
```

## API

```ts
type DeepKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string
      ? T[K] extends object
        ? `${K}.${DeepKeyOf<T[K]>}`
        : K
      : never
    }[keyof T]
  : never
```

## Notes

- Numeric and symbol keys are excluded — only `string`-keyed properties are walked.
- Array types are objects, so `DeepKeyOf<{ items: string[] }>` produces `'items.0' | 'items.1' | …` only if the array has tuple typing. With a regular `string[]`, the recursion terminates at `'items'`.
