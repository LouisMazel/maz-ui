---
title: camelCase
description: Convert a kebab-case string to camelCase by stripping dashes and uppercasing the following letter.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { camelCase } from '@maz-ui/utils'

camelCase('my-component-name') // → 'myComponentName'
camelCase('hello-world') // → 'helloWorld'
```

## API

```ts
function camelCase(str: string): string
```

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `str`     | `string` | The string to convert |

## Notes

`camelCase` is intentionally minimal — it only handles `kebab-case` input. For more general normalization (snake_case, spaces, PascalCase), use [`normalizeString`](./normalize-string) with the `case: 'camelCase'` option.
