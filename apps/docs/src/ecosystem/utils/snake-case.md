---
title: snakeCase
description: Convert any common string casing to snake_case — handles camelCase, PascalCase, kebab-case, spaces and consecutive capitals.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { snakeCase } from '@maz-ui/utils'

snakeCase('myComponent') // → 'my_component'
snakeCase('MyComponent') // → 'my_component'
snakeCase('XMLParser') // → 'xml_parser'
snakeCase('hello-world') // → 'hello_world'
snakeCase('hello world') // → 'hello_world'
```

## API

```ts
function snakeCase(str: string): string
```

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `str`     | `string` | The string to convert |

## Notes

- Consecutive uppercase letters are handled (e.g. `XMLParser` → `xml_parser`).
- Leading and trailing underscores are stripped.
- Multiple separators collapse into a single underscore.
