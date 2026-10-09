---
title: truthyFilter
description: Type guard that filters out falsy values (`false`, `''`, `0`, `null`, `undefined`) while narrowing the TypeScript type.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Pass it directly to `Array.prototype.filter` to drop nullish/empty entries while telling TypeScript the result no longer contains those types.

## Usage

```ts
import { truthyFilter } from '@maz-ui/utils'

const items: (string | null | undefined)[] = ['a', null, 'b', undefined, '']
const cleaned = items.filter(truthyFilter)
// cleaned has type string[]
// cleaned = ['a', 'b']
```

## API

```ts
type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T

function truthyFilter<T>(value: T): value is Truthy<T>
```

The function returns `Boolean(value)` — its real value is in the type predicate, which narrows away the falsy variants for downstream type-checking.
