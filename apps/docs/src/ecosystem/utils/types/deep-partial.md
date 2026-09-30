---
title: DeepPartial
description: Recursive variant of TypeScript's `Partial<T>` — every property at every depth becomes optional.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import type { DeepPartial } from '@maz-ui/utils'

interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
  }
  theme: {
    primary: string
    secondary: string
  }
}

const update: DeepPartial<UserSettings> = {
  notifications: { email: false },
}
```

## API

```ts
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T
```

## Notes

- Primitives (`string`, `number`, `boolean`, `null`, `undefined`, …) are returned unchanged.
- Useful for partial-update payloads (`PATCH` requests, merge functions, default-options patterns).
