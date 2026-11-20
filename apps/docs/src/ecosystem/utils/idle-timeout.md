---
title: IdleTimeout
description: Detect user inactivity (no mouse, keyboard, touch or wheel activity for a given time) and run a callback when the user becomes idle, and again when they are back.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

`IdleTimeout` listens to the user input events on an element (`document.body` by default): `mousedown`, `mousemove` (only when the pointer really moves), `click`, `keydown`, `wheel`, `mousewheel`, `DOMMouseScroll`, `touchstart`, `touchmove`, `MSPointerDown` and `MSPointerMove`. When none of them fires for `timeout` ms, the user is idle and your callback runs.

In a Vue component, use [useIdleTimeout](../../composables/use-idle-timeout).

## Usage

```ts
import { IdleTimeout } from '@maz-ui/utils/helpers/idleTimeout'

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
| `immediate` | `boolean`                  | `true`      | Run the callback with `isIdle: false` when tracking starts.                           |

### Methods

- **`start()`**: listen to the events and start the timer. The constructor calls it on the client (nothing happens on the server). Call it again to restart after `destroy()`.
- **`pause()` / `resume()`**: freeze the timer and ignore the events, then restart it with the remaining time. `pause()` does nothing once the user is idle.
- **`reset()`**: restart the timer from the full `timeout`, the user is active again.
- **`destroy()`**: remove the listeners and the timer.

### Callback

The callback runs with `isIdle: true` after `timeout` ms without activity, and with `isIdle: false` and the DOM `eventType` on each activity (the timer restarts). It also runs with `isIdle: false` on `start()` (with `immediate`), `resume()` and `reset()`. It runs on every activity event, `mousemove` included: keep it light.

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

- [`UserVisibility`](./user-visibility): track whether the tab is visible instead of the activity in the page.
