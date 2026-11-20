---
title: useIdleTimeout
description: Detect when the user stops using the page (no mouse, keyboard, touch or wheel activity for a given time) and run a callback, to show an "Are you still here?" dialog, log out or pause work. Built on the IdleTimeout helper of @maz-ui/utils.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

The composable returns an `IdleTimeout` instance. Your callback runs when the user becomes idle, and again each time they become active.

<ComponentDemo>
  <div class="maz:flex maz:items-center maz:flex-wrap maz:gap-2">
    <MazBtn color="info" @click="idleTimeout.start()">
      Start
    </MazBtn>
    <MazBtn color="warning" @click="idleTimeout.pause()">
      Pause
    </MazBtn>
    <MazBtn @click="idleTimeout.resume()">
      Resume
    </MazBtn>
    <MazBtn color="secondary" @click="idleTimeout.reset()">
      Reset
    </MazBtn>
    <MazBtn color="destructive" @click="idleTimeout.destroy()">
      Destroy
    </MazBtn>
  </div>

  <MazCard block class="maz:mt-4">
    <div class="maz:flex maz:gap-4">
      <span>isIdle: {{ state.isIdle }}</span>
      <span>eventType: {{ state.eventType ?? '-' }}</span>
    </div>
  </MazCard>

  <p class="maz:mt-4 maz:text-warning">
    Wait 5 seconds without any action to see the dialog
  </p>

<template #code>

```vue
<script lang="ts" setup>
import type { IdleTimeoutCallback } from '@maz-ui/utils/helpers/idleTimeout'
import MazBtn from 'maz-ui/components/MazBtn'
import MazCard from 'maz-ui/components/MazCard'
import { useDialog } from 'maz-ui/composables/useDialog'
import { useIdleTimeout } from 'maz-ui/composables/useIdleTimeout'
import { ref } from 'vue'

const dialog = useDialog()

const timeout = 5000

const state = ref<{ isIdle: boolean, eventType?: string }>({ isIdle: false })

const onIdleChange: IdleTimeoutCallback = async ({ isIdle, eventType, instance }) => {
  state.value = { isIdle, eventType }

  if (!isIdle)
    return

  instance.destroy()

  try {
    await dialog.open({
      title: 'Are you still here?',
      message: `You have been inactive for ${timeout / 1000} seconds, do you want to continue?`,
      cancelText: 'No',
      confirmText: 'Yes',
    }).promise

    instance.start()
  }
  catch {
    // the user answered "No": log out for example
  }
}

const idleTimeout = useIdleTimeout({
  callback: onIdleChange,
  options: { timeout },
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <MazBtn color="info" @click="idleTimeout.start()">
      Start
    </MazBtn>
    <MazBtn color="warning" @click="idleTimeout.pause()">
      Pause
    </MazBtn>
    <MazBtn @click="idleTimeout.resume()">
      Resume
    </MazBtn>
    <MazBtn color="secondary" @click="idleTimeout.reset()">
      Reset
    </MazBtn>
    <MazBtn color="destructive" @click="idleTimeout.destroy()">
      Destroy
    </MazBtn>
  </div>

  <MazCard block class="mt-4">
    <div class="flex gap-4">
      <span>isIdle: {{ state.isIdle }}</span>
      <span>eventType: {{ state.eventType ?? '-' }}</span>
    </div>
  </MazCard>
</template>
```

  </template>
</ComponentDemo>

<script lang="ts" setup>
  import { ref } from 'vue'

  import { useIdleTimeout } from 'maz-ui/composables/useIdleTimeout'
  import { useDialog } from 'maz-ui/composables/useDialog'

  const dialog = useDialog()

  const timeout = 5000

  const state = ref({ isIdle: false, eventType: undefined })

  async function onIdleChange({ isIdle, eventType, instance }) {
    state.value = { isIdle, eventType }

    if (!isIdle)
      return

    instance.destroy()

    try {
      await dialog.open({
        title: 'Are you still here?',
        message: `You have been inactive for ${timeout / 1000} seconds, do you want to continue?`,
        cancelText: 'No',
        confirmText: 'Yes',
      }).promise

      instance.start()
    }
    catch {}
  }

  const idleTimeout = useIdleTimeout({
    callback: onIdleChange,
    options: { timeout },
  })
</script>

## Lifecycle

- On the client, tracking starts as soon as `useIdleTimeout` is called. On the server, nothing happens: in a Nuxt page, the setup runs again on the client and starts it there.
- The instance is destroyed when the component is unmounted (or the `effectScope` stopped): the listeners and the timer are removed.
- The instance is not reactive: keep what you display in a `ref`, from the callback (as in the demo above).

## Callback

```ts
type IdleTimeoutCallback = (payload: {
  isIdle: boolean
  eventType?: string
  instance: IdleTimeout
}) => unknown
```

The callback runs:

| When                                                  | `isIdle` | `eventType`                     |
| ----------------------------------------------------- | -------- | ------------------------------- |
| No activity during `timeout` ms                       | `true`   | `undefined`                     |
| On each user activity (the timer restarts)           | `false`  | the DOM event, e.g. `mousemove` |
| On `start()` (only with `immediate: true`)            | `false`  | `undefined`                     |
| On `resume()`, `reset()`, and when you set `idle`     | current  | `undefined`                     |

The callback runs on every activity event, `mousemove` included: keep it light.

`instance` is the `IdleTimeout` instance, to `destroy()` or `start()` it from the callback.

## Listened events

`mousedown`, `mousemove` (only when the pointer really moves), `click`, `keydown`, `wheel`, `mousewheel`, `DOMMouseScroll`, `touchstart`, `touchmove`, `MSPointerDown` and `MSPointerMove`, on the `element` option (`document.body` by default).

## Options

| Option      | Type                      | Default         | Description                                                      |
| ----------- | ------------------------- | --------------- | ---------------------------------------------------------------- |
| `timeout`   | `number`                  | `300000` (5 min) | Inactivity duration, in milliseconds, before the user is idle   |
| `element`   | `HTMLElement \| Document` | `document.body` | Element on which the events are listened                         |
| `once`      | `boolean`                 | `false`         | Destroy the instance after the first idle                        |
| `immediate` | `boolean`                 | `true`          | Run the callback with `isIdle: false` when tracking starts       |

## Return

An `IdleTimeout` instance:

| Member      | Type                 | Description                                                                  |
| ----------- | -------------------- | ---------------------------------------------------------------------------- |
| `start()`   | `() => void`         | Listen to the events and start the timer (again after `destroy()`)          |
| `pause()`   | `() => void`         | Freeze the timer and ignore the events, does nothing once the user is idle |
| `resume()`  | `() => void`         | Restart the timer with the remaining time                                    |
| `reset()`   | `() => void`         | Restart the timer from the full `timeout`, the user is active again         |
| `destroy()` | `() => void`         | Remove the listeners and the timer                                           |
| `idle`      | `boolean`            | Whether the user is idle. Set it to force the state (`true` runs the idle callback) |
| `timeout`   | `number`             | Get or change the timeout, used from the next restart of the timer           |
| `destroyed` | `boolean` (readonly) | Whether `destroy()` was called                                               |

## Without Vue

The composable only creates the instance: use [IdleTimeout](../ecosystem/utils/idle-timeout) from `@maz-ui/utils` outside of a component.
