---
title: useMutationObserver
description: Watch the changes of a DOM element (children added or removed, attributes, text) with a MutationObserver that follows a template ref, is created after the render and disconnected on unmount. SSR safe.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

<div class="vp-raw maz:flex maz:flex-col maz:items-start maz:gap-4">
  <div class="maz:flex maz:gap-2">
    <MazBtn @click="items.push(`Item ${items.length + 1}`)">
      Add an item
    </MazBtn>
    <MazBtn color="secondary" :disabled="!items.length" @click="items.pop()">
      Remove an item
    </MazBtn>
  </div>
  <ul ref="list" class="maz:list-disc maz:ps-6">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
  <p class="maz:text-muted">Mutations: {{ count }}</p>
</div>

```vue
<script lang="ts" setup>
import { useMutationObserver } from 'maz-ui/composables/useMutationObserver'
import { ref, useTemplateRef } from 'vue'

const list = useTemplateRef('list')
const items = ref<string[]>([])
const count = ref(0)

useMutationObserver(list, (mutations) => {
  count.value += mutations.length
}, { childList: true })
</script>

<template>
  <MazBtn @click="items.push(`Item ${items.length + 1}`)">
    Add an item
  </MazBtn>

  <ul ref="list">
    <li v-for="item in items" :key="item">
      {{ item }}
    </li>
  </ul>

  <p>Mutations: {{ count }}</p>
</template>
```

<script lang="ts" setup>
  import { useMutationObserver } from 'maz-ui/composables/useMutationObserver'
  import { ref, useTemplateRef } from 'vue'

  const list = useTemplateRef('list')
  const items = ref([])
  const count = ref(0)

  useMutationObserver(list, (mutations) => {
    count.value += mutations.length
  }, { childList: true })
</script>

## What to watch

The options are the ones of [MutationObserver.observe()](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe). Give at least one of `childList`, `attributes` or `characterData`:

```ts
useMutationObserver(element, onChange, {
  attributes: true,
  attributeFilter: ['class', 'aria-expanded'],
})

useMutationObserver(element, onChange, {
  childList: true,
  subtree: true,
  characterData: true,
})
```

## Lifecycle

- The target can be an element, a component instance (its root element is observed), a ref or a getter. The observer is created after the render, and recreated when the target changes.
- The observer is disconnected when the component is unmounted (or the `effectScope` stopped), even when the observed element outlives it (`document.body`). Call `stop()` to disconnect it earlier.
- On the server, nothing is observed and `isSupported` is `false`.

## Options

`MutationObserverInit` (`childList`, `attributes`, `attributeFilter`, `attributeOldValue`, `characterData`, `characterDataOldValue`, `subtree`), plus:

| Option           | Type     | Default                            | Description                                       |
| ---------------- | -------- | ---------------------------------- | ------------------------------------------------- |
| `internalWindow` | `Window` | `globalThis` on the client         | Window that provides `MutationObserver`           |

## Return

| Property      | Type                                    | Description                                                          |
| ------------- | --------------------------------------- | -------------------------------------------------------------------- |
| `isSupported` | `Ref<boolean>`                          | `MutationObserver` is available                                      |
| `stop`        | `() => void`                            | Disconnect the observer and stop following the target               |
| `takeRecords` | `() => MutationRecord[] \| undefined`   | The pending mutations not given to the callback yet                 |

## Types

```ts
function useMutationObserver(
  target: MaybeRefOrGetter<HTMLElement | SVGElement | ComponentPublicInstance | undefined | null>,
  callback: MutationCallback,
  options?: UseMutationObserverOptions,
): UseMutationObserverReturn
```
