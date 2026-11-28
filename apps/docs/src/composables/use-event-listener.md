---
title: useEventListener
description: Add an event listener to a window, a document, an element or a template ref, removed automatically when the component is unmounted. SSR safe.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Use it instead of `addEventListener` and `removeEventListener` by hand: nothing to clean up, nothing runs on the server.

## Usage

Move the pointer in the box, resize the window: the values follow. The button removes the listener.

<ComponentDemo expanded>
  <div class="maz:grid maz:gap-4 maz:tab-m:grid-cols-2">
    <div
      ref="pad"
      class="maz:flex maz:h-32 maz:items-center maz:justify-center maz:rounded-md maz:border maz:border-divider maz:bg-container maz:text-sm maz:text-muted"
    >
      Move the pointer here
    </div>
    <div class="maz:flex maz:flex-col maz:gap-2 maz:text-sm">
      <div>Pointer: <MazBadge color="info" size="sm">{{ pointer.x }}, {{ pointer.y }}</MazBadge></div>
      <div>Window width: <MazBadge color="primary" size="sm">{{ width }}px</MazBadge></div>
      <MazBtn size="sm" color="contrast" class="maz:self-start" @click="stopPointer()">Stop the pointer listener</MazBtn>
    </div>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { useEventListener } from 'maz-ui/composables/useEventListener'
import { reactive, ref, useTemplateRef } from 'vue'

const pad = useTemplateRef('pad')
const pointer = reactive({ x: 0, y: 0 })
const width = ref(0)

const stopPointer = useEventListener(pad, 'pointermove', (event) => {
  pointer.x = Math.round(event.offsetX)
  pointer.y = Math.round(event.offsetY)
})

useEventListener(window, 'resize', () => {
  width.value = window.innerWidth
}, { passive: true })
</script>

<template>
  <div ref="pad" class="h-32 rounded-md border">
    Move the pointer here
  </div>

  <p>Pointer: {{ pointer.x }}, {{ pointer.y }}</p>
  <p>Window width: {{ width }}px</p>

  <MazBtn @click="stopPointer()">
    Stop the pointer listener
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

When the target is a ref or a getter, the listener follows it: moved to the new element, removed when it is `null`. A component instance works too (its root element is used).

## API

```ts
function useEventListener(
  target: MaybeRefOrGetter<Window | Document | HTMLElement | EventTarget | null | undefined>,
  event: string | string[],
  listener: (event: Event) => void,
  options?: boolean | AddEventListenerOptions,
): () => void
```

The event names and the type of `event` follow the target (`WindowEventMap`, `DocumentEventMap`, `HTMLElementEventMap`). It returns a `stop` function to remove the listener before the unmount.

## Related

- [`useWindow`](./use-window): the same for the events of the window.
- [`useShortcut`](./use-shortcut): keyboard shortcuts.
- [`vClickOutside`](../directives/click-outside): a click outside of an element.

<script lang="ts" setup>
import { useEventListener } from 'maz-ui/composables/useEventListener'
import { onMounted, reactive, ref, useTemplateRef } from 'vue'

const pad = useTemplateRef('pad')
const pointer = reactive({ x: 0, y: 0 })
const width = ref(0)

const stopPointer = useEventListener(pad, 'pointermove', (event: PointerEvent) => {
  pointer.x = Math.round(event.offsetX)
  pointer.y = Math.round(event.offsetY)
})

useEventListener(() => (typeof window === 'undefined' ? undefined : window), 'resize', () => {
  width.value = window.innerWidth
}, { passive: true })

onMounted(() => {
  width.value = window.innerWidth
})
</script>
