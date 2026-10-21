---
title: throttleId
description: Throttle an async function with isolated state per identifier — runs immediately, then at most once per interval.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

`throttleId` is the async, keyed counterpart of [`throttle`](./throttle). The first call runs immediately and returns its promise; further calls within `interval` are coalesced and resolve to the result of the last replayed call.

## Usage

```ts
import { throttleId } from '@maz-ui/utils'

const trackEvent = throttleId(
  'analytics',
  async (event: { name: string }) => {
    return fetch('/track', { method: 'POST', body: JSON.stringify(event) })
  },
  1000,
)

trackEvent({ name: 'scroll' })
trackEvent({ name: 'scroll' }) // coalesced into the first call
```

## API

```ts
function throttleId<T, Args extends unknown[]>(
  identifier: string,
  func: (...args: Args) => T | Promise<T>,
  interval: number,
): (...args: Args) => Promise<T>
```

| Parameter    | Type       | Description                                            |
| ------------ | ---------- | ------------------------------------------------------ |
| `identifier` | `string`   | Unique key isolating this throttle from others         |
| `func`       | `Function` | The async (or sync) function to throttle               |
| `interval`   | `number`   | Minimum interval between executions, in milliseconds   |

## Related

- [`debounceId`](./debounce-id) — wait for silence instead of rate-limiting.
- [`throttle`](./throttle) — non-async, single-instance throttle.
