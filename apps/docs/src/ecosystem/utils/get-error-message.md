---
title: getErrorMessage
description: Extract a human-readable message from anything thrown — `Error`, `string`, `{ message }` objects, or arbitrary values.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Especially useful inside `catch` blocks where the caught value is typed `unknown`.

## Usage

```ts
import { getErrorMessage } from '@maz-ui/utils'

try {
  await doSomething()
}
catch (error) {
  console.error(getErrorMessage(error))
}
```

## API

```ts
function getErrorMessage(error: unknown): string
```

## Resolution rules

The helper inspects `error` in this order:

1. `error instanceof Error` → returns `error.message`.
2. `typeof error === 'string'` → returns `error` as-is.
3. `error` is a plain object with a `message` property → returns `String(error.message)`.
4. `error` is otherwise truthy → returns `String(error)`.
5. `error` is falsy → returns `'An unexpected error occurred'`.
