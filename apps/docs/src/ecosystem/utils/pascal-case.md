---
title: pascalCase
description: Convert any common string casing — kebab, snake, space-separated, camelCase or UPPERCASE — to PascalCase.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { pascalCase } from '@maz-ui/utils'

pascalCase('my-component-name') // → 'MyComponentName'
pascalCase('hello_world') // → 'HelloWorld'
pascalCase('hello world') // → 'HelloWorld'
pascalCase('helloWorld') // → 'HelloWorld'
```

## API

```ts
function pascalCase(str: string): string
```

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `str`     | `string` | The string to convert |

## Notes

- Detects `-`, `_` and space separators automatically.
- Handles ALL-CAPS inputs by lowercasing before re-capitalizing.
- For fine-grained control, use [`normalizeString`](./normalize-string) with `{ case: 'PascalCase' }`.
