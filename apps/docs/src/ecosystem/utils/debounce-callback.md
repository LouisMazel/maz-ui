---
title: debounceCallback
description: Module-scoped one-shot debounce — schedule a callback that gets reset on each new call.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Unlike [`debounce`](./debounce), which builds a debounced wrapper around a function, `debounceCallback` is a procedural helper: each call schedules a callback after `delay` ms, cancelling any previous pending callback.

::: warning Shared module state
`debounceCallback` uses a single module-level timer. All consumers of this function share the same timer slot, so calling it from two unrelated places will cancel each other. Use [`debounceId`](./debounce-id) for isolated debounces.
:::

## Usage

```ts
import { debounceCallback } from '@maz-ui/utils'

debounceCallback(() => {
  console.log('runs only if no other call happens in the next 300 ms')
}, 300)
```

## API

```ts
function debounceCallback(
  callback: (...args: unknown[]) => unknown,
  delay: number,
): void
```

| Parameter  | Type       | Description                                |
| ---------- | ---------- | ------------------------------------------ |
| `callback` | `Function` | Function to run after the quiet window     |
| `delay`    | `number`   | Quiet window before firing, in milliseconds |
