---
title: formatJson
description: Tiny wrapper around `JSON.stringify` with sensible default indentation.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { formatJson } from '@maz-ui/utils'

formatJson({ name: 'Alice', age: 30 })
// {
//   "name": "Alice",
//   "age": 30
// }

formatJson({ a: 1 }, 4) // → indent with 4 spaces
```

## API

```ts
function formatJson(json: unknown, indent?: number): string
```

| Parameter | Type      | Default | Description                              |
| --------- | --------- | ------- | ---------------------------------------- |
| `json`    | `unknown` | —       | Any JSON-serialisable value              |
| `indent`  | `number`  | `2`     | Number of spaces per indentation level   |
