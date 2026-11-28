---
title: useWindow
description: The window of the page and a way to listen to its events, SSR safe, with the listeners removed when the component is unmounted.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

It is the base of [useWindowSize](./use-window-size) and [useWindowFocus](./use-window-focus), built on [useEventListener](./use-event-listener).

## Usage

Go offline in your browser (or turn off the network): the events are listened with `on`.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:gap-2 maz:text-sm">
    <div>Network: <MazBadge :color="online ? 'success' : 'destructive'" size="sm">{{ online ? 'online' : 'offline' }}</MazBadge></div>
    <div>Events received: <strong>{{ events }}</strong></div>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { useWindow } from 'maz-ui/composables/useWindow'
import { ref } from 'vue'

const { on } = useWindow()

const online = ref(true)
const events = ref(0)

on(['online', 'offline'], (event) => {
  online.value = event.type === 'online'
  events.value++
})
</script>

<template>
  <p>Network: {{ online ? 'online' : 'offline' }}</p>
  <p>Events received: {{ events }}</p>
</template>
```

  </template>
</ComponentDemo>

`on` also returns a function that removes the listener:

```ts
import { useWindow } from 'maz-ui/composables/useWindow'

const { window, isSupported, on } = useWindow()

const stop = on('resize', update, { passive: true })
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

<script lang="ts" setup>
import { useWindow } from 'maz-ui/composables/useWindow'
import { ref } from 'vue'

const { on } = useWindow()

const online = ref(true)
const events = ref(0)

on(['online', 'offline'], (event) => {
  online.value = event.type === 'online'
  events.value++
})
</script>
