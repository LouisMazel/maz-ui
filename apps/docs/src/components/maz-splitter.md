---
title: MazSplitter
description: MazSplitter splits an area into resizable panels separated by a handle. The handle works with the mouse, the touch and the keyboard, and the sizes can be remembered.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Describe the panels with the `panels` prop. Each panel renders in the slot named after its `id`. The component fills its parent: give the parent a height.

<ComponentDemo expanded>
  <div class="maz:h-48 maz:overflow-hidden maz:rounded-lg maz:border maz:border-divider">
    <MazSplitter :panels="panels">
      <template #list><p class="maz:p-3">List</p></template>
      <template #detail><p class="maz:p-3">Detail</p></template>
    </MazSplitter>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazSplitter from 'maz-ui/components/MazSplitter'

const panels = [
  { id: 'list', size: 30, min: 15, max: 60 },
  { id: 'detail' },
]
</script>

<template>
  <div class="h-48">
    <MazSplitter :panels="panels">
      <template #list>List</template>
      <template #detail>Detail</template>
    </MazSplitter>
  </div>
</template>
```

  </template>
</ComponentDemo>

<script lang="ts" setup>
import { ref } from 'vue'

const panels = [
  { id: 'list', size: 30, min: 15, max: 60, collapsible: true },
  { id: 'detail' },
]
const stackedPanels = [{ id: 'top', size: 40 }, { id: 'bottom' }]
const sizes = ref([30, 70])
</script>

## Sizes

Sizes are in percent. A panel without `size` shares the remaining space. `min` (10 by default) and `max` limit each panel.

Use `v-model:sizes` to read or set the sizes, and `storage-key` to remember them in `localStorage`. The saved sizes are read after the mount, so the server and the client render the same markup.

<ComponentDemo>
  <div class="maz:h-40 maz:overflow-hidden maz:rounded-lg maz:border maz:border-divider">
    <MazSplitter v-model:sizes="sizes" :panels="panels" storage-key="docs-splitter">
      <template #list><p class="maz:p-3">{{ Math.round(sizes[0]) }}%</p></template>
      <template #detail><p class="maz:p-3">{{ Math.round(sizes[1]) }}%</p></template>
    </MazSplitter>
  </div>

<template #code>

```vue
<template>
  <MazSplitter v-model:sizes="sizes" :panels="panels" storage-key="my-splitter" />
</template>
```

  </template>
</ComponentDemo>

## Orientation

`orientation="vertical"` stacks the panels.

<ComponentDemo>
  <div class="maz:h-56 maz:overflow-hidden maz:rounded-lg maz:border maz:border-divider">
    <MazSplitter orientation="vertical" :panels="stackedPanels">
      <template #top><p class="maz:p-3">Top</p></template>
      <template #bottom><p class="maz:p-3">Bottom</p></template>
    </MazSplitter>
  </div>

<template #code>

```vue
<template>
  <div class="h-56">
    <MazSplitter orientation="vertical" :panels="panels" />
  </div>
</template>
```

  </template>
</ComponentDemo>

## Collapse and reset

Set `collapsible: true` on a panel: press `Enter` on its handle to collapse it, and again to restore it. Dragging the panel under half of its `min` collapses it too. A double click on the handle resets the initial sizes.

## Accessibility and motion

- Each handle is a focusable `separator` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-controls` (window splitter pattern).
- Arrows move the handle by `step` (2 by default, `Shift` for ten times more), `Home` and `End` go to the limits. The horizontal arrows are mirrored in a right-to-left context.
- A collapsed panel is `inert`, so its content leaves the tab order.
- The handle only changes its color, and not at all when the user reduces motion.

<!--@include: ./../../.vitepress/generated-docs/maz-splitter.doc.md-->
