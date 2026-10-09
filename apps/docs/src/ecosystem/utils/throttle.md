---
title: throttle
description: Wrap a function so it runs immediately, then at most once every N milliseconds — perfect for scroll, mousemove and resize handlers.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Unlike [`debounce`](./debounce) — which waits for a quiet period — `throttle` lets the first call through and rate-limits the rest.

## Usage

```ts
import { throttle } from '@maz-ui/utils'

const onScroll = throttle(() => {
  console.log('scroll position', window.scrollY)
}, 200)

window.addEventListener('scroll', onScroll)
```

## API

```ts
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void
```

| Parameter | Type       | Description                                |
| --------- | ---------- | ------------------------------------------ |
| `func`    | `Function` | The function to throttle                   |
| `limit`   | `number`   | Minimum interval between executions, in ms |

The first call always runs immediately. Subsequent calls within `limit` are coalesced — only the most recent set of arguments is replayed once the window elapses.

## Examples

Throttle a window resize handler:

```ts
import { throttle } from '@maz-ui/utils'

const onResize = throttle(() => {
  console.log('width:', window.innerWidth)
}, 250)

window.addEventListener('resize', onResize)
```

## Related

- [`throttleId`](./throttle-id) — per-key throttle for async functions, returning a promise.
- [`debounce`](./debounce) — fires only once activity stops.
