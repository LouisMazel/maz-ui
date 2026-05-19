---
title: kebabCase
description: Convert any common string casing to kebab-case — handles camelCase, PascalCase, snake_case, spaces and consecutive capitals.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { kebabCase } from '@maz-ui/utils'

kebabCase('myComponent') // → 'my-component'
kebabCase('MyComponent') // → 'my-component'
kebabCase('XMLParser') // → 'xml-parser'
kebabCase('hello_world') // → 'hello-world'
kebabCase('hello world') // → 'hello-world'
```

## API

```ts
function kebabCase(str: string): string
```

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `str`     | `string` | The string to convert |

## Notes

- Consecutive uppercase letters are handled (e.g. `XMLParser` → `xml-parser`).
- Leading and trailing dashes are stripped.
- Multiple separators collapse into a single dash.
