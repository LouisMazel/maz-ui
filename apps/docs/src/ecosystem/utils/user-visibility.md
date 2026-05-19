---
title: UserVisibility
description: Track whether the user is currently looking at the tab using the Page Visibility API, with an optional grace timeout before declaring them away.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

`UserVisibility` listens to `visibilitychange` events. When the tab becomes hidden, it waits `timeout` ms before invoking the callback with `isVisible: false` — this avoids spurious switches when the user briefly tabs away.

## Usage

```ts
import { UserVisibility } from '@maz-ui/utils'

const watcher = new UserVisibility(
  ({ isVisible }) => {
    if (isVisible) {
      resumeVideo()
    }
    else {
      pauseVideo()
    }
  },
  { timeout: 3000 },
)

// later
watcher.destroy()
```

## API

```ts
class UserVisibility {
  constructor(callback: UserVisibilyCallback, options?: UserVisibilyOptions)

  start(): void
  destroy(): void
}

type UserVisibilyCallback = (payload: { isVisible: boolean }) => void
```

### Options

| Option      | Type      | Default | Description                                                                       |
| ----------- | --------- | ------- | --------------------------------------------------------------------------------- |
| `timeout`   | `number`  | `5000`  | Grace period in ms before a hidden tab fires the `isVisible: false` callback.    |
| `immediate` | `boolean` | `true`  | Fire the callback once on construction with the current visibility state.        |
| `once`      | `boolean` | `false` | Auto-destroy after the first callback invocation.                                |

## Examples

Pause expensive timers when the user tabs away:

```ts
new UserVisibility(
  ({ isVisible }) => {
    isVisible ? animations.resume() : animations.pause()
  },
  { timeout: 0 }, // react immediately
)
```

## Related

- [`IdleTimeout`](./idle-timeout) — track in-page activity instead of tab visibility.
