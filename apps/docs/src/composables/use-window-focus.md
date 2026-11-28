---
title: useWindowFocus
description: Reactive focus of the window, true while the user is on the page, false when the window loses the focus.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

Click outside of the page, or on another window: the state changes.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:gap-2 maz:text-sm">
    <div>isFocused: <MazBadge :color="isFocused ? 'success' : 'warning'" size="sm">{{ isFocused }}</MazBadge></div>
    <div>Refreshes: <strong>{{ refreshCount }}</strong> (each time the window gets the focus back)</div>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { useWindowFocus } from 'maz-ui/composables/useWindowFocus'
import { ref, watch } from 'vue'

const { isFocused } = useWindowFocus()
const refreshCount = ref(0)

watch(isFocused, (focused) => {
  if (focused)
    refreshCount.value++
})
</script>

<template>
  <p>isFocused: {{ isFocused }}</p>
  <p>Refreshes: {{ refreshCount }}</p>
</template>
```

  </template>
</ComponentDemo>

## API

```ts
function useWindowFocus(options?: { initialValue?: boolean, internalWindow?: Window }): { isFocused: Ref<boolean> }
```

`initialValue` (default `false`) is the value on the server and, inside a component, until it is mounted (the first render matches the server markup, so hydration does not mismatch). To follow the visibility of the tab (hidden, visible), use [useUserVisibility](./use-user-visibility).

<script lang="ts" setup>
import { useWindowFocus } from 'maz-ui/composables/useWindowFocus'
import { ref, watch } from 'vue'

const { isFocused } = useWindowFocus()
const refreshCount = ref(0)

watch(isFocused, (focused) => {
  if (focused)
    refreshCount.value++
})
</script>
