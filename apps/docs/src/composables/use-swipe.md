---
title: useSwipe
description: useSwipe is a Vue composable that simplifies the management of "swipe" interactions on HTML elements.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Introduction

`useSwipe` allows you to detect and react to swiping movements on an HTML element. It provides you with various information about the swipe movement, such as the direction, distance, start, and end coordinates.
You can use this information to implement specific interactions in your application, such as scrolling a carousel, opening a side menu, etc.

It is built on top of [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), so it works with **touch, mouse and pen** out of the box.

::: tip
For a real-time drag gesture (follow the pointer, snap back, drag-to-dismiss…) rather than discrete directional detection, use [useDrag](./use-drag.md).
:::

## Key Features

- Detects swipes in all 4 directions (left, right, up, down)
- Works with touch, mouse and pen (Pointer Events)
- Provides key information about the swipe movement (start/end coordinates, horizontal/vertical distance)
- Allows you to configure callbacks for each swipe direction
- Restrict the gesture to specific pointer types
- Possibility to customize the swipe detection threshold
- Automatically handles the addition and removal of event listeners
- Can be used with any HTML element

## Basic Usage

<div ref="swipeContainer" class="swipe-container">
  <p>
    Swipe in any direction<br>
    <span class="maz:text-xs maz:text-muted">
      (works with touch, mouse and pen)
    </span>
    <br><br>
    Last swipe direction: {{lastSwipeDirection || 'None'}}
  </p>
</div>

Here's an example of using the useSwipe composable:

```vue
<script lang="ts" setup>
import { useSwipe } from 'maz-ui/composables'
import { onMounted, onUnmounted, ref } from 'vue'

const swipeContainer = ref<HTMLDivElement>()

const lastSwipeDirection = ref<string>('None')

const { xDiff, yDiff, start, stop } = useSwipe({
  element: swipeContainer,
  onLeft: () => lastSwipeDirection.value = 'Swiped left',
  onRight: () => lastSwipeDirection.value = 'Swiped right',
  onUp: () => lastSwipeDirection.value = 'Swiped up',
  onDown: () => lastSwipeDirection.value = 'Swiped down',
  threshold: 50,
})

/**
 * Start listening for swipe events
 * You can also call start() directly
 * But it's better to call it in onMounted specially for SSR
 */
onMounted(() => {
  start()
})

// Stop listening for swipe events
onUnmounted(() => {
  stop()
})
</script>

<template>
  <div ref="swipeContainer" class="swipe-container">
    <p>
      Swipe in any direction<br>
      <span class="maz:text-sm maz:text-muted">
        (works with touch, mouse and pen)
      </span>
      <br><br>
      Last swipe direction: {{ lastSwipeDirection || 'None' }}
    </p>
  </div>
</template>

<style>
.swipe-container {
  border: 1px solid #e2e2e3;
  border-radius: 10px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.2rem;
}
</style>
```

<script lang="ts" setup>
import { useSwipe } from 'maz-ui/composables/useSwipe'
import { onMounted, onUnmounted, ref } from 'vue'

const swipeContainer = ref<HTMLDivElement>()

const lastSwipeDirection = ref<string>('None')

const { xDiff, yDiff, start, stop } = useSwipe({
  element: swipeContainer,
  onLeft: () => lastSwipeDirection.value = 'Swiped left',
  onRight: () => lastSwipeDirection.value = 'Swiped right',
  onUp: () => lastSwipeDirection.value = 'Swiped up',
  onDown: () => lastSwipeDirection.value = 'Swiped down',
  threshold: 50,
})

onMounted(() => {
  start()
})

onUnmounted(() => {
  stop()
})
</script>

<style>
.swipe-container {
  border: 1px solid #e2e2e3;
  border-radius: 10px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.2rem;
}
</style>

In this example, the `useSwipe` composable is used to detect swiping movements on an HTML element with the `container` class. When a swipe is detected, the horizontal (`xDiff`) and vertical (`yDiff`) coordinates of the movement are displayed.

Additionally, callbacks are defined for each swipe direction (`onLeft`, `onRight`, `onUp`, `onDown`), which will be called when the corresponding swipe is detected.

The swipe detection threshold is also customized to 50 pixels.

## Options

`useSwipe` accepts an options object with the following properties:

```ts
interface UseSwipeOptions {
  /**
   * The HTML element on which the swipe events will be handled. This can be either a direct reference to the element or a CSS selector.
   * @required
   */
  element: HTMLElement | string | Ref<HTMLElement>
  /** Callback executed when a left swipe is detected. */
  onLeft?: (event: PointerEvent) => void
  /** Callback executed when a right swipe is detected. */
  onRight?: (event: PointerEvent) => void
  /** Callback executed when an up swipe is detected. */
  onUp?: (event: PointerEvent) => void
  /** Callback executed when a down swipe is detected. */
  onDown?: (event: PointerEvent) => void
  /**
   * The minimum distance the swipe must travel to be considered valid.
   * @default 50
   */
  threshold?: number
  /**
   * Pointer types that can trigger the swipe.
   * @default ['mouse', 'touch', 'pen']
   */
  pointerTypes?: ('mouse' | 'touch' | 'pen')[]
  /**
   * Whether to prevent the default behavior of the pointer move event
   * (the move listener becomes non-passive when enabled).
   * @default false
   */
  preventDefaultOnMove?: boolean
  /**
   * Whether to prevent the default behavior of the mousewheel event.
   * @default false
   */
  preventDefaultOnMouseWheel?: boolean
  /**
   * Whether to start listening immediately on instantiation.
   * @default false
   */
  immediate?: boolean
  /**
   * Whether to trigger the swipe event only on pointer up.
   * @default false
   */
  triggerOnEnd?: boolean
}
```

## Composable Return

`useSwipe` returns an object with the following properties:

```ts
interface UseSwipeReturn {
  /** A function to start listening for swipe events. */
  start: () => void
  /** A function to stop listening for swipe events. */
  stop: () => void
  /** The horizontal difference between the start and end coordinates of the swipe. */
  xDiff: Ref<number | undefined>
  /** The vertical difference between the start and end coordinates of the swipe. */
  yDiff: Ref<number | undefined>
  /** The horizontal start coordinate of the swipe. */
  xStart: Ref<number | undefined>
  /** The horizontal end coordinate of the swipe. */
  xEnd: Ref<number | undefined>
  /** The vertical start coordinate of the swipe. */
  yStart: Ref<number | undefined>
  /** The vertical end coordinate of the swipe. */
  yEnd: Ref<number | undefined>
}
```

## Notes

- Make sure to call the `start()` function to start listening for swipe events.
- You can call the `stop()` function to stop listening for swipe events.
- If you use the composable in a Vue component, make sure to call it in the `setup()` and clean up the event listeners in the `onUnmounted()`.
- The composable automatically handles the addition and removal of event listeners based on the provided options.
- You can customize the swipe detection threshold by modifying the `threshold` option.
- If you want to prevent the default behavior of pointer move or mousewheel events, you can set the `preventDefaultOnMove` and `preventDefaultOnMouseWheel` options, respectively.
- Use the `pointerTypes` option to restrict the gesture to specific input types (e.g. `['touch']` for touch-only).
