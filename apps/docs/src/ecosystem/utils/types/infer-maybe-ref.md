---
title: InferMaybeRef
description: Unwrap a Vue `Ref<U>` to its inner `U` — leaves non-ref types unchanged.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Useful when authoring composables that accept either a plain value or a `Ref`, and you want a unified type for the inner value.

## Usage

```ts
import type { InferMaybeRef } from '@maz-ui/utils'
import { ref } from 'vue'

const a = ref(42)
const b = 42

type A = InferMaybeRef<typeof a> // number
type B = InferMaybeRef<typeof b> // number
```

## API

```ts
import type { Ref } from 'vue'

type InferMaybeRef<T> = T extends Ref<infer U> ? U : T
```

## Notes

- Pairs well with Vue's built-in [`unref()`](https://vuejs.org/api/reactivity-utilities.html#unref), which provides the same behaviour at runtime.
