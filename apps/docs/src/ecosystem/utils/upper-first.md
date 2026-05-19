---
title: upperFirst
description: Uppercase the first character of a string and leave the rest unchanged.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { upperFirst } from '@maz-ui/utils'

upperFirst('hello') // → 'Hello'
upperFirst('hELLO') // → 'HELLO'
upperFirst('') // → ''
```

## API

```ts
function upperFirst(value: string): string
```

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `value`   | `string` | The string to process |

## Notes

- Does **not** lowercase the remaining characters — use [`capitalize`](./capitalize) for the same behaviour when you control the input shape.
