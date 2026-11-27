---
title: useEventListener
description: Add an event listener to a window, a document, an element or a template ref, removed automatically when the component is unmounted. SSR safe.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Use it instead of `addEventListener` and `removeEventListener` by hand: nothing to clean up, nothing runs on the server.

## Usage

```vue
<script lang="ts" setup>
import { useEventListener } from 'maz-ui/composables/useEventListener'
import { useTemplateRef } from 'vue'

const button = useTemplateRef('button')

useEventListener(window, 'resize', onResize, { passive: true })
useEventListener(button, ['focus', 'blur'], onFocusChange)
</script>

<template>
  <button ref="button">
    Save
  </button>
</template>
```

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
