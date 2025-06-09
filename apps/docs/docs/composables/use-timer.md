---
title: useTimer
description: The useTimer composable manages timeouts. It allows you to start, pause, resume, and stop a timer with reactive updates on the remaining time. Ideal for handling asynchronous operations or user interactions with a specified timeout.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

---

The composable provides the following functionality:

- **start**: Initiates a timer that decrements the remaining time every second until the timeout is reached. When the timeout is reached, it executes the provided callback function.
- **pause**: Pauses the active timer, allowing it to be resumed later from the point it was paused.
- **resume**: Resumes the timer from the point it was paused, considering the remaining time.
- **stop**: Stops the timer completely, resetting the remaining time to the initial timeout value.
- **remainingTime**: A reactive variable that holds the current remaining time in milliseconds. It updates reactively as the timer progresses.

The composable also includes cleanup logic using onBeforeUnmount to ensure that the timer is stopped when the component is unmounted.

This composable can be used in Vue 3 components to handle timeouts in a flexible and reactive manner.

## Usage

**Remaning time**: {{ remainingTime }}ms

<div class="maz-flex maz-items-center maz-gap-2">
  <MazBtn @click="start">
    Start
  </MazBtn>
  <MazBtn color="destructive" @click="stop">
    Stop
  </MazBtn>
  <MazBtn color="warning" @click="pause">
    Pause
  </MazBtn>
  <MazBtn color="secondary" @click="resume">
    Resume
  </MazBtn>
</div>

<script lang="ts" setup>
  import { useTimer } from 'maz-ui/src/composables/useTimer'
  import { useToast } from 'maz-ui/src/composables/useToast'

  const toast = useToast()

  const { start, stop, pause, resume, remainingTime } = useTimer({
    timeout: 4000,
    callback: () => toast.info('Timeout end', {
      button: {
        onClick: start,
        text: 're-start',
        closeToast: true,
      },
    })
  })
</script>

```vue
<template>
  <MazBtn @click="start">
    Start
  </MazBtn>
  <MazBtn color="destructive" @click="stop">
    Stop
  </MazBtn>
  <MazBtn color="warning" @click="pause">
    Pause
  </MazBtn>
  <MazBtn color="secondary" @click="resume">
    Resume
  </MazBtn>
</template>

<script lang="ts" setup>
  import { useTimer, useToast } from 'maz-ui/composables'

  const toast = useToast()

  const { start, stop, pause, resume, remainingTime } = useTimer({
    timeout: 4000,
    callback: () => toast.info('Timeout end', {
      button: {
        onClick: start,
        text: 're-start',
        closeToast: true,
      },
    })
  })
</script>
```

## Set timeout with start function

Starts the timer with the specified timeout. If the timeout is not provided, it uses the default value of 1000ms.

```ts
const { start } = useTimer()

start(4000)
```

## Types

```ts
export interface TimerOptions {
  /**
   * The time in milliseconds
   * @default 1000
   */
  timeout?: number
  /**
   * The callback to execute when the timer is finished
   * @default undefined
   */
  callback?: () => unknown
  /**
   * The interval to update the remaining time
   * @default 200
   */
  remainingTimeUpdate?: number
  /**
   * The offset time to execute the callback
   * @default 0
   */
  callbackOffsetTime?: number
}
```
