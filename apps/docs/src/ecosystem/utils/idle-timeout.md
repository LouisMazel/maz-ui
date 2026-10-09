---
title: IdleTimeout
description: Detect user inactivity (mouse, keyboard, touch, scroll) and run a callback when the user becomes idle.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

`IdleTimeout` listens for a range of user-input events (`mousedown`, `keydown`, `touchstart`, `wheel`, …) on a target element. When none of them fire for `timeout` ms, the user is considered idle and your callback is invoked.

## Usage

```ts
import { IdleTimeout } from '@maz-ui/utils'

const watcher = new IdleTimeout(
  ({ isIdle }) => {
    if (isIdle) {
      console.log('User went idle')
    }
    else {
      console.log('User is back')
    }
  },
  { timeout: 60_000 }, // 1 minute
)

// later
watcher.destroy()
```

## API

```ts
class IdleTimeout {
  constructor(callback: IdleTimeoutCallback, options?: IdleTimeoutOptions)

  start(): void
  pause(): void
  resume(): void
  reset(): void
  destroy(): void

  readonly destroyed: boolean
  idle: boolean
  timeout: number
}

type IdleTimeoutCallback = (payload: {
  isIdle: boolean
  eventType?: string
  instance: IdleTimeout
}) => unknown
```

### Options

| Option      | Type                       | Default     | Description                                                                            |
| ----------- | -------------------------- | ----------- | -------------------------------------------------------------------------------------- |
| `timeout`   | `number`                   | `300_000`   | Idle duration in milliseconds (default 5 minutes).                                    |
| `element`   | `HTMLElement \| Document`  | `document.body` | Element to attach event listeners to.                                                  |
| `once`      | `boolean`                  | `false`     | When `true`, automatically calls `destroy()` after the first idle trigger.            |
| `immediate` | `boolean`                  | `true`      | Fire the callback once on construction. Useful to set `false` in SSR contexts.        |

### Methods

- **`start()`** — Attach listeners and (re)start the timer. The constructor calls this automatically on the client.
- **`pause()` / `resume()`** — Freeze and unfreeze the countdown without losing the elapsed time.
- **`reset()`** — Restart the timer from scratch.
- **`destroy()`** — Detach all listeners. The watcher cannot be reused after destroy.

## Examples

Auto-logout after 10 minutes of inactivity:

```ts
const idle = new IdleTimeout(
  ({ isIdle }) => {
    if (isIdle) {
      logout()
    }
  },
  { timeout: 10 * 60 * 1000, once: true },
)
```

## Related

- [`UserVisibility`](./user-visibility) — track tab focus / visibility instead of in-page activity.
