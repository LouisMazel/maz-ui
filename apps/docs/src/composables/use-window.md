---
title: useWindow
description: The window of the page and a way to listen to its events, SSR safe, with the listeners removed when the component is unmounted.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

It is the base of [useWindowSize](./use-window-size) and [useWindowFocus](./use-window-focus), built on [useEventListener](./use-event-listener).

## Usage

```ts
import { useWindow } from 'maz-ui/composables/useWindow'

const { window, isSupported, on } = useWindow()

const stop = on('online', () => console.log('back online'))
on(['resize', 'orientationchange'], update, { passive: true })
```

## API

```ts
function useWindow(options?: { internalWindow?: Window }): {
  window: Window | undefined
  isSupported: boolean
  on: (event, listener, options?) => () => void
}
```

`window` is `undefined` on the server, and `on` does nothing there. `on` returns a function that removes the listener.
