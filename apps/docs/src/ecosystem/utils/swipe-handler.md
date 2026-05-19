---
title: Swipe
description: Detect directional touch swipes on an element with configurable threshold and optional mouse-wheel guards.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

`Swipe` attaches touch listeners to a DOM element and fires callbacks for left, right, up and down swipes once a configurable distance threshold is crossed.

## Usage

```ts
import { Swipe } from '@maz-ui/utils'

const swipe = new Swipe({
  element: '#carousel',
  immediate: true,
  onLeft: () => carousel.next(),
  onRight: () => carousel.prev(),
})

// later
swipe.stop()
```

## API

```ts
class Swipe {
  constructor(options: SwipeOptions)

  start(element?: HTMLElement | string | null): void
  stop(): void

  xStart?: number
  yStart?: number
  xEnd?: number
  yEnd?: number
  xDiff?: number
  yDiff?: number
}
```

### Options

| Option                       | Type                                | Default | Description                                                                |
| ---------------------------- | ----------------------------------- | ------- | -------------------------------------------------------------------------- |
| `element`                    | `HTMLElement \| string \| null`     | `null`  | Target element or CSS selector.                                            |
| `threshold`                  | `number`                            | `50`    | Minimum distance in px before a swipe is recognised.                       |
| `onLeft` / `onRight` / `onUp` / `onDown` | `(event: TouchEvent) => void`       | —       | Direction callbacks.                                                       |
| `onValuesChanged`            | `(values: SwipeValues) => void`     | —       | Fires whenever start/end/diff values are updated — useful for live tracking. |
| `preventDefaultOnTouchMove`  | `boolean`                           | `false` | Calls `event.preventDefault()` on `touchmove`.                             |
| `preventDefaultOnMouseWheel` | `boolean`                           | `false` | Calls `event.preventDefault()` on `mousewheel`.                            |
| `immediate`                  | `boolean`                           | `false` | Attach listeners immediately from the constructor.                          |
| `triggerOnEnd`               | `boolean`                           | `false` | Fire direction callbacks on `touchend` instead of on every `touchmove`.    |

### Methods

- **`start(element?)`** — Begin listening. Optionally re-target a new element.
- **`stop()`** — Detach all listeners. Live values reset.

## Examples

Slide-based gallery:

```ts
new Swipe({
  element: '.gallery',
  immediate: true,
  threshold: 80,
  triggerOnEnd: true,
  onLeft: () => gallery.next(),
  onRight: () => gallery.previous(),
})
```

Live progress while dragging:

```ts
new Swipe({
  element: '.draggable',
  immediate: true,
  onValuesChanged: ({ xDiff }) => {
    if (typeof xDiff === 'number') {
      drawer.style.transform = `translateX(${-xDiff}px)`
    }
  },
})
```
