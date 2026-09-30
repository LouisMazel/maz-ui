---
title: debounce
description: Wrap a function so it only runs after a quiet period — every new call resets the timer.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Useful for input handlers, resize listeners, search-as-you-type and any callback that should not fire on every event.

## Usage

```ts
import { debounce } from '@maz-ui/utils'

const onSearch = debounce((query: string) => {
  console.log('searching for', query)
}, 300)

onSearch('h')
onSearch('he')
onSearch('hel')
// only the last call (with "hel") runs, 300 ms after the third call
```

## API

```ts
function debounce<F extends (...args: any[]) => any>(
  fn: F,
  delay: number,
): (...args: Parameters<F>) => void
```

| Parameter | Type       | Description                                   |
| --------- | ---------- | --------------------------------------------- |
| `fn`      | `Function` | The function to debounce                      |
| `delay`   | `number`   | Quiet window in milliseconds before `fn` runs |

The returned function shares no state with other debounced wrappers — each call to `debounce()` creates a fresh timer.

## Examples

Debounce a Vue input handler:

```vue
<script setup lang="ts">
import { debounce } from '@maz-ui/utils'

const onInput = debounce((event: Event) => {
  console.log((event.target as HTMLInputElement).value)
}, 250)
</script>

<template>
  <input @input="onInput">
</template>
```

## Related

- [`debounceId`](./debounce-id) — debounce an async function, keyed by an identifier, returning a promise.
- [`debounceCallback`](./debounce-callback) — module-scoped one-shot debounce.
- [`throttle`](./throttle) — rate-limits instead of waiting for silence.
