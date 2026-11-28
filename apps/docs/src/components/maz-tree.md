---
title: MazTree
description: MazTree is a tree view following the WAI-ARIA tree pattern - folders that open at their real height, icons by type, status marks, single or multiple selection, keyboard and lazy loading.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Pass `items`. An item with `children` is a folder. Use `v-model` for the selected id and `v-model:expanded` for the open folders.

<ComponentDemo>
  <MazTree v-model="selected" v-model:expanded="expanded" :items="items" label="Project files" class="maz:w-72" />

<template #code>

```vue
<script lang="ts" setup>
import type { MazTreeItem } from 'maz-ui/components/MazTree'
import MazTree from 'maz-ui/components/MazTree'
import { ref } from 'vue'

const selected = ref<string>()
const expanded = ref(['src'])

const items: MazTreeItem[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'main', label: 'main.ts', status: 'modified' },
      { id: 'app', label: 'App.vue' },
      { id: 'new', label: 'Tree.vue', status: 'added' },
    ],
  },
  { id: 'readme', label: 'README.md' },
]
</script>

<template>
  <MazTree v-model="selected" v-model:expanded="expanded" :items="items" label="Project files" class="w-72" />
</template>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  import { ref } from 'vue'

  const selected = ref<string>()
  const expanded = ref(['src'])
  const checked = ref(['app'])

  const items = [
    {
      id: 'src',
      label: 'src',
      children: [
        { id: 'main', label: 'main.ts', status: 'modified' },
        { id: 'app', label: 'App.vue' },
        { id: 'new', label: 'Tree.vue', status: 'added' },
        { id: 'old', label: 'Legacy.vue', status: 'deleted' },
        { id: 'off', label: 'locked.ts', disabled: true },
      ],
    },
    { id: 'readme', label: 'README.md' },
  ]

  async function load() {
    await new Promise(resolve => setTimeout(resolve, 800))

    return [{ id: 'l1', label: 'first.txt' }, { id: 'l2', label: 'second.txt' }]
  }
</script>

## Multiple selection

With `multiple`, each item has a checkbox and `v-model` is an array of ids. A folder is checked when all its items are, and mixed when only some are. Checking a folder checks its enabled items.

<ComponentDemo>
  <MazTree v-model="checked" :items="items" multiple label="Files to export" class="maz:w-72" />

<template #code>

```vue
<template>
  <MazTree v-model="checked" :items="items" multiple label="Files to export" />
</template>
```

  </template>
</ComponentDemo>

## Status marks

Add `status` (`added`, `modified`, `deleted`) to an item to show a colored letter at the end of its row. A deleted item is struck through. A screen reader reads the status in words.

## Icons and labels

Folders and files have their own icons (open and closed folder). Set `icon` on an item to change it. The `item` slot replaces the label (`item`, `expanded`, `selected`, `level`).

## Lazy loading

Set `lazy: true` on a folder and give a `load` function. The first time the folder opens, a spinner replaces the chevron, then the folder opens at the height of its children. If `load` fails, the folder stays closed and `load-error` is emitted.

<ComponentDemo>
  <MazTree :items="[{ id: 'remote', label: 'Remote folder', lazy: true }]" :load="load" label="Remote" class="maz:w-72" />

<template #code>

```vue
<script lang="ts" setup>
async function load(item: MazTreeItem) {
  const response = await fetch(`/api/folders/${item.id}`)

  return response.json()
}
</script>

<template>
  <MazTree :items="[{ id: 'remote', label: 'Remote folder', lazy: true }]" :load="load" label="Remote" />
</template>
```

  </template>
</ComponentDemo>

## Keyboard

| Key | Action |
| --- | --- |
| Up, Down | Move to the previous or next visible item |
| Right | Open a closed folder, then go to its first item |
| Left | Close an open folder, then go to the parent |
| Home, End | First and last visible item |
| Enter | Open or close a folder, select the item |
| Space | Select the item (check it with `multiple`) |
| `*` | Open all the folders at the same level |
| Letters | Jump to the next item that starts with them |

The tree is one tab stop (roving tabindex). Disabled items are skipped.

## Accessibility and motion

- Roles: `tree`, `treeitem` and `group`, with `aria-expanded`, `aria-level`, `aria-setsize` and `aria-posinset`. Give the tree a `label`.
- Single selection uses `aria-selected`. Multiple selection uses `aria-checked` (`mixed` for a partly checked folder).
- Folders open with a height animation and `visibility`, so the closed items are out of the tab order and of the accessibility tree.
- In right-to-left pages, the indentation, the chevrons and the arrow keys are mirrored.
- Reduced motion removes the animations.

<!--@include: ./../../.vitepress/generated-docs/maz-tree.doc.md-->
