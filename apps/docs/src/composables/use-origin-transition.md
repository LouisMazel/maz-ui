---
title: useOriginTransition
description: Make an element grow out of the button, the event or the point that opened it, and go back into it when it closes. The base of dialogs, lightboxes and menus that start from their trigger. SSR safe, reduced motion aware.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Use it with a `<Transition>` to open a panel, a dialog or a menu from where the user clicked, instead of a fade from nowhere. The animation uses the Web Animations API and the [motion tokens](./../guide/vue.md#motion) of the theme.

## Usage

Give it the trigger as `origin`, and use `enter` and `leave` as the hooks of a `<Transition :css="false">`.

<div class="origin-demo">
  <MazBtn ref="originDemoButton" @click="originDemoOpen = !originDemoOpen">
    {{ originDemoOpen ? 'Close' : 'Open the panel' }}
  </MazBtn>

  <Transition :css="false" @enter="originDemo.enter" @leave="originDemo.leave">
    <div v-if="originDemoOpen" class="origin-demo-panel">
      This panel grows from the button and goes back into it.
    </div>
  </Transition>
</div>

```vue
<script setup lang="ts">
import { useOriginTransition } from 'maz-ui/composables/useOriginTransition'
import { ref, useTemplateRef } from 'vue'

const isOpen = ref(false)
const button = useTemplateRef('button')

const { enter, leave } = useOriginTransition({ origin: () => button.value?.$el })
</script>

<template>
  <MazBtn ref="button" @click="isOpen = !isOpen">
    Open the panel
  </MazBtn>

  <Transition :css="false" @enter="enter" @leave="leave">
    <div v-if="isOpen" class="rounded-lg bg-surface-400 p-4">
      This panel grows from the button.
    </div>
  </Transition>
</template>
```

`done` is always called once, and the exit is shorter than the entrance (70 %). Closing during the entrance starts from where the element is, with no jump.

## The origin

`origin` is one of:

- an element, a ref of an element, or a getter returning one
- a CSS selector
- a pointer or mouse event: the element grows from the point of the click (from the target for a click with the keyboard)
- a `{ x, y }` point in viewport coordinates

```ts
const { enter, leave, setOrigin } = useOriginTransition()

function open(event: MouseEvent) {
  setOrigin(event)
  isOpen.value = true
}
```

Without an origin, the element under the last `pointerdown` is used (a button, a link... when the pointerdown is less than one second old). This works when a dialog is opened by code after a click. [useDialog](./use-dialog) and MazDialog will pass their trigger.

The element goes back to its origin on leave if this one is still in the page and visible. Otherwise it fades and scales to `0.97`.

## Reduced motion

With `prefers-reduced-motion`, or the [`motion` option](./../guide/vue.md#motion) of MazUi set to `reduced`, the element only fades, quickly. `animated: false` shows and hides it without animation.

## API

```ts
function useOriginTransition(options?: {
  origin?: MaybeRefOrGetter<Element | string | { x: number, y: number } | MouseEvent | null | undefined>
  duration?: MaybeRefOrGetter<number | undefined>
  easing?: string | { enter?: string, leave?: string }
  leaveRatio?: number
  fallback?: 'fade-scale' | 'fade' | 'none'
  animated?: MaybeRefOrGetter<boolean>
}): {
  enter: (el: Element, done: () => void) => void
  leave: (el: Element, done: () => void) => void
  setOrigin: (origin: OriginTransitionOrigin | undefined) => void
  captureLastPointer: () => void
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `origin` | last pointerdown | Where the element grows from |
| `duration` | `--maz-motion-normal` x `--maz-motion-scale` | Duration of the enter, in ms |
| `easing` | `--maz-easing-out` (enter), `--maz-easing-in` (leave) | CSS easing |
| `leaveRatio` | `0.7` | Duration of the leave relative to the enter |
| `fallback` | `'fade-scale'` | What to do without a usable origin: `'fade'`, or `'none'` to skip the animation |
| `animated` | `true` | `false` disables the animation |

`enter` and `leave` also work by hand, for an element you show and hide yourself.

### Last pointer

The last pointerdown is tracked by one shared passive listener, added on first use (never on the server). You can read it yourself:

```ts
import { getLastPointerTarget } from 'maz-ui/composables/useOriginTransition'

const trigger = getLastPointerTarget()
```

`getLastPointerTarget(maxAge = 1000)` returns the element (or its closest button, link...) under the last pointerdown, or `null` when it is older than `maxAge` ms or no longer in the page. It is more reliable than `document.activeElement`, which Safari does not move to a clicked button.

<script setup>
import { ref, useTemplateRef } from 'vue'
import { useOriginTransition } from 'maz-ui/composables/useOriginTransition'

const originDemoOpen = ref(false)
const originDemoButton = useTemplateRef('originDemoButton')
const originDemo = useOriginTransition({ origin: () => originDemoButton.value?.$el })
</script>

<style>
.origin-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  min-height: 11rem;
}
.origin-demo-panel {
  width: 18rem;
  padding: 1rem;
  border-radius: 0.75rem;
  color: white;
  background: var(--vp-c-brand-1, #6366f1);
}
</style>
