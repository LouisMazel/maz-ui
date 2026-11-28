---
title: MazContextMenu
description: MazContextMenu opens a menu where you right click (long press on touch screens, Shift F10 with the keyboard). The menu grows out of the exact point of the click and stays inside the screen.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Wrap the zone that opens the menu and give the `items`.

<ComponentDemo expanded>
  <MazContextMenu :items="items">
    <div
      tabindex="0"
      class="maz:flex maz:h-40 maz:items-center maz:justify-center maz:rounded-lg maz:border maz:border-dashed maz:border-divider maz:p-4 maz:text-center maz:text-muted"
    >
      Right click here, long press, or focus then Shift F10
    </div>
  </MazContextMenu>
  <p class="maz:mt-3 maz:text-muted">Last action: {{ last }}</p>

<template #code>

```vue
<script lang="ts" setup>
import MazContextMenu from 'maz-ui/components/MazContextMenu'

const items = [
  { label: 'Rename', shortcut: 'F2', action: () => rename() },
  { label: 'Duplicate', shortcut: 'Ctrl D', action: () => duplicate() },
  { label: 'Share', disabled: true },
  { separator: true },
  { label: 'Delete', color: 'destructive', action: () => remove() },
]
</script>

<template>
  <MazContextMenu :items>
    <div tabindex="0" class="h-40 rounded-lg border border-dashed p-4">
      Right click here
    </div>
  </MazContextMenu>
</template>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  import { MazDocumentDuplicate } from '@maz-ui/icons/static/MazDocumentDuplicate'
  import { MazPencil } from '@maz-ui/icons/static/MazPencil'
  import { MazTrash } from '@maz-ui/icons/static/MazTrash'
  import { ref } from 'vue'

  const last = ref('none')

  const items = [
    { label: 'Rename', icon: MazPencil, shortcut: 'F2', action: () => (last.value = 'Rename') },
    { label: 'Duplicate', icon: MazDocumentDuplicate, shortcut: 'Ctrl D', action: () => (last.value = 'Duplicate') },
    { label: 'Share (unavailable)', disabled: true },
    { separator: true },
    { label: 'Delete', icon: MazTrash, color: 'destructive' as const, action: () => (last.value = 'Delete') },
  ]
</script>

## Items

An item is `{ label, icon?, shortcut?, color?, disabled? }` plus what it does:

- `action` (or `onClick`, to reuse the items of `MazDropdown`): a function.
- `to`: a route. `href` and `target`: a URL.

`{ separator: true }` draws a line between two groups. Use `color: 'destructive'` for a dangerous action.

## Open it yourself

`v-model` is the open state. `openAt(x, y)` opens the menu at a point of the screen (in pixels from the top left of the viewport).

```vue
<script lang="ts" setup>
import { useTemplateRef } from 'vue'

const menu = useTemplateRef('menu')
</script>

<template>
  <MazContextMenu ref="menu" :items />
  <MazBtn @click="menu?.openAt(200, 120)">Open</MazBtn>
</template>
```

## Options

- `long-press` (default `true`): a long press (500 ms) opens the menu on touch screens. The click that follows is ignored.
- `disabled`: the native menu of the browser stays available.
- `animated` (default `true`): the highlight slides between the items under the pointer.
- `items-size`, `label` and `menu-panel-class`.

The `item` slot replaces an item.

## Accessibility and motion

- The menu follows the ARIA menu pattern: `role="menu"` with `role="menuitem"` items and `role="separator"` lines.
- `Shift F10` and the `Menu` key open it from the focused element, with the focus on the first item. With the mouse, the focus is on the menu and the first arrow key goes to the first or the last item.
- `ArrowUp`, `ArrowDown`, `Home` and `End` move the focus and skip the disabled items. Typing a letter goes to the next item that starts with it.
- `Enter` and `Space` run the item. `Escape` and `Tab` close the menu, and the focus goes back to where it was.
- Give the menu a `label` when the default text ("Context menu") is not enough.
- The menu grows out of the point of the click. With reduced motion, it fades in.
- The highlight slides with the pointer only. Only `transform` and `opacity` are animated, with the motion tokens of the theme.

## Events

- `select`: an item is chosen, with the item.
- `open` and `close`.

<!--@include: ./../../.vitepress/generated-docs/maz-context-menu.doc.md-->
