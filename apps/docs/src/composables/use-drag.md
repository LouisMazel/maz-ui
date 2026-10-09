---
title: useDrag
description: useDrag is a Vue composable that tracks a pointer drag gesture (touch, mouse and pen) in real time, exposing the live offset, distance and direction.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Introduction

`useDrag` follows a pointer drag on an element and gives you the **live** offset, distance and direction, plus `onStart` / `onMove` / `onEnd` callbacks. It is the low-level gesture primitive behind components like [MazBottomSheet](../components/maz-bottom-sheet.md) (drag-to-dismiss), and it's useful to build sliders, sortable handles, swipeable cards, bottom sheets, custom carousels, etc.

It is built on top of [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), so it works with **touch, mouse and pen**.

::: tip
For discrete directional swipe detection (left / right / up / down with a threshold) rather than real-time tracking, use [useSwipe](./use-swipe.md).
:::

## Key Features

- Real-time pointer tracking (touch, mouse and pen)
- Live reactive state: `isDragging`, `offsetX`, `offsetY`, `distance`, `direction`
- `onStart` / `onMove` / `onEnd` callbacks with a full state snapshot
- Axis locking (`x`, `y` or `both`)
- Activation threshold, pointer-type filtering and reactive `disabled`
- Listeners are followed on the document, so the drag keeps working when the pointer leaves the element
- Automatically attaches/detaches when the target appears/disappears, and cleans up on unmount

## Basic Usage

Drag the card down: it follows your pointer and snaps back on release.

<div class="drag-demo">
  <div
    ref="dragHandle"
    class="drag-card"
    :class="{ '--dragging': dragging }"
    :style="{ transform: dragOffset ? `translateY(${dragOffset}px)` : undefined }"
  >
    {{ dragging ? `Dragging — ${Math.round(dragOffset)}px ${dragDirection ?? ''}` : 'Drag me down' }}
  </div>
</div>

```vue
<script lang="ts" setup>
import { useDrag } from 'maz-ui/composables'
import { ref } from 'vue'

const dragHandle = ref<HTMLElement>()
const dragOffset = ref(0)

const { isDragging: dragging, direction: dragDirection } = useDrag(dragHandle, {
  axis: 'y',
  onMove: ({ offsetY }) => {
    dragOffset.value = Math.max(0, offsetY)
  },
  onEnd: ({ offsetY }) => {
    if (offsetY > 150) {
      // trigger an action when dragged far enough
    }
    dragOffset.value = 0
  },
})
</script>

<template>
  <div
    ref="dragHandle"
    class="drag-card"
    :class="{ '--dragging': dragging }"
    :style="{ transform: dragOffset ? `translateY(${dragOffset}px)` : undefined }"
  >
    {{ dragging ? `Dragging — ${Math.round(dragOffset)}px ${dragDirection ?? ''}` : 'Drag me down' }}
  </div>
</template>

<style>
.drag-card {
  touch-action: none;
  cursor: grab;
  user-select: none;
}
.drag-card:not(.--dragging) {
  transition: transform 0.25s ease;
}
</style>
```

## Options

`useDrag(target, options)` - the `target` is a `MaybeRefOrGetter<HTMLElement | string | null | undefined>` and `options` accepts:

```ts
interface UseDragOptions {
  /**
   * Restrict the tracking to a single axis. Off-axis movement is ignored.
   * @default 'both'
   */
  axis?: 'x' | 'y' | 'both'
  /**
   * Minimum distance (px) the pointer must travel before the drag becomes active.
   * @default 0
   */
  threshold?: number
  /**
   * Pointer types allowed to initiate the drag.
   * @default ['mouse', 'touch', 'pen']
   */
  pointerTypes?: ('mouse' | 'touch' | 'pen')[]
  /**
   * Reactively disable the gesture.
   * @default false
   */
  disabled?: MaybeRefOrGetter<boolean>
  /**
   * Call `event.preventDefault()` on each pointer move while dragging.
   * @default false
   */
  preventDefault?: boolean
  /**
   * Call `event.stopPropagation()` on the pointer events.
   * @default false
   */
  stopPropagation?: boolean
  /**
   * Attach the listeners as soon as the target is available. When `false`, call `start()` manually.
   * @default true
   */
  immediate?: boolean
  /** Called once when the drag becomes active (threshold reached). */
  onStart?: (state: DragState) => void
  /** Called on every pointer move while dragging. */
  onMove?: (state: DragState) => void
  /** Called when the drag ends (pointer up or cancel). */
  onEnd?: (state: DragState) => void
}
```

Each callback receives a `DragState` snapshot:

```ts
interface DragState {
  /** Pointer offset from the drag start on the X axis (`0` when axis is `'y'`). */
  offsetX: number
  /** Pointer offset from the drag start on the Y axis (`0` when axis is `'x'`). */
  offsetY: number
  /** Absolute distance dragged from the start. */
  distance: number
  /** Dominant direction of the drag. */
  direction: 'up' | 'down' | 'left' | 'right' | undefined
  /** Pointer position when the drag started. */
  startX: number
  startY: number
  /** Current pointer position. */
  x: number
  y: number
  /** The underlying pointer event. */
  event: PointerEvent
}
```

## Composable Return

```ts
interface UseDragReturn {
  /** Whether a drag is currently active (threshold reached). */
  isDragging: Readonly<Ref<boolean>>
  /** Reactive pointer offset from the drag start on the X axis. */
  offsetX: Readonly<Ref<number>>
  /** Reactive pointer offset from the drag start on the Y axis. */
  offsetY: Readonly<Ref<number>>
  /** Reactive absolute distance dragged from the start. */
  distance: Readonly<Ref<number>>
  /** Reactive dominant direction of the drag. */
  direction: Readonly<Ref<'up' | 'down' | 'left' | 'right' | undefined>>
  /** Manually attach the listeners. */
  start: () => void
  /** Manually detach the listeners (also cancels an ongoing drag). */
  stop: () => void
}
```

## Notes

- Add `touch-action: none` on the draggable element to prevent the browser from scrolling while dragging.
- The composable attaches automatically on mount (`immediate: true` by default) and cleans up on unmount; use `start()` / `stop()` for manual control.
- `onEnd` only fires when an actual drag happened (the threshold was reached), so a simple tap will not trigger it.
- The target can be a ref, a getter or a CSS selector string, and the listeners re-attach automatically when it changes.

<script lang="ts" setup>
import { useDrag } from 'maz-ui/composables/useDrag'
import { ref } from 'vue'

const dragHandle = ref()
const dragOffset = ref(0)

const { isDragging: dragging, direction: dragDirection } = useDrag(dragHandle, {
  axis: 'y',
  onMove: ({ offsetY }) => {
    dragOffset.value = Math.max(0, offsetY)
  },
  onEnd: () => {
    dragOffset.value = 0
  },
})
</script>

<style>
.drag-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1rem;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
}
.drag-card {
  touch-action: none;
  cursor: grab;
  user-select: none;
  width: 100%;
  max-width: 320px;
  padding: 2.5rem 1rem;
  border-radius: 12px;
  text-align: center;
  font-size: 1.1rem;
  color: white;
  background: var(--vp-c-brand-1, #6366f1);
}
.drag-card:not(.--dragging) {
  transition: transform 0.25s ease;
}
.drag-card.--dragging {
  cursor: grabbing;
}
</style>
