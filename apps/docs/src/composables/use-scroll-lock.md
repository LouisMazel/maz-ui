---
title: useScrollLock
description: Lock the scroll of the page or of an element - behind a mobile menu, an overlay or a fullscreen panel - without moving the content.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

Click the button, then try to scroll the page.

<ComponentDemo>
  <div class="maz:flex maz:items-center maz:gap-3">
    <MazBtn :color="isLocked ? 'destructive' : 'primary'" @click="toggle()">
      {{ isLocked ? 'Unlock the scroll' : 'Lock the scroll' }}
    </MazBtn>
    <MazBadge :color="isLocked ? 'destructive' : 'success'">{{ isLocked ? 'locked' : 'free' }}</MazBadge>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { useScrollLock } from 'maz-ui/composables/useScrollLock'

const { isLocked, toggle } = useScrollLock()
</script>

<template>
  <MazBtn @click="toggle()">
    {{ isLocked ? 'Unlock the scroll' : 'Lock the scroll' }}
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## With a menu

`isLocked` is writable: bind it to the state of your menu.

```ts
import { useScrollLock } from 'maz-ui/composables/useScrollLock'
import { ref, watch } from 'vue'

const isMenuOpen = ref(false)
const { isLocked } = useScrollLock()

watch(isMenuOpen, (open) => {
  isLocked.value = open
})
```

The second argument locks it from the start: `useScrollLock(undefined, true)`.

## An element

Pass an element (or a ref, a component) to lock its own scroll.

```ts
const panel = useTemplateRef('panel')

const { lock, unlock } = useScrollLock(panel)
```

## Behavior

- The default target is the page (`document.documentElement`).
- The width of the scrollbar is kept as a `padding-inline-end`: the content does not move. It is also set as `--scrollbar-width`, for your fixed elements.
- Several locks can be held at once on the same element: it scrolls again when the last one is released.
- The lock is released when the component is unmounted. The previous `overflow` and padding are restored.
- On the server, nothing is locked.

## Types

```ts
type ScrollLockTarget = HTMLElement | ComponentPublicInstance | undefined | null

function useScrollLock(target?: MaybeRefOrGetter<ScrollLockTarget>, initialValue?: boolean): {
  /** Writable: `isLocked.value = true` locks the scroll */
  isLocked: WritableComputedRef<boolean>
  lock: () => void
  unlock: () => void
  toggle: () => void
}
```

<script lang="ts" setup>
import { useScrollLock } from 'maz-ui/composables/useScrollLock'

const { isLocked, toggle } = useScrollLock()
</script>
