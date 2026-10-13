---
title: isEqual
description: Deep structural equality check for primitives, arrays, plain objects and Dates.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { isEqual } from '@maz-ui/utils'

isEqual({ a: 1, b: [2, 3] }, { a: 1, b: [2, 3] }) // true
isEqual([1, 2, 3], [1, 2, 3]) // true
isEqual(new Date('2024-01-01'), new Date('2024-01-01')) // true
isEqual({ a: 1 }, { a: 1, b: 2 }) // false
```

## API

```ts
function isEqual(a: unknown, b: unknown): boolean
```

| Parameter | Type      | Description       |
| --------- | --------- | ----------------- |
| `a`       | `unknown` | First value       |
| `b`       | `unknown` | Second value      |

## Behaviour

- **Primitives** (`null`, `undefined`, `string`, `number`, `boolean`, `symbol`, `bigint`) — compared with `===`.
- **Dates** — compared by `getTime()`.
- **Arrays** — same length and every element deeply equal.
- **Plain objects** — same set of keys and every value deeply equal.
- **Anything else** (Maps, Sets, class instances, functions) is not specifically handled; comparisons fall back to `===`.
