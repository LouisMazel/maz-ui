---
title: MazCommandPalette
description: MazCommandPalette is a search window (Ctrl K or Cmd K) to run commands and go to pages from the keyboard. The list is filtered while you type, and Enter runs the chosen command.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Give it `groups` of commands. Press `Ctrl K` (`Cmd K` on macOS) to open it. Type to filter, use the arrows to move and `Enter` to run the command.

Use the `trigger` slot to add a button: the window grows out of it.

<ComponentDemo expanded>
  <MazCommandPalette v-model:open="open" :groups="groups" @select="last = $event.label">
    <template #trigger="{ open: show }">
      <MazBtn @click="show">
        Open the palette
      </MazBtn>
    </template>
  </MazCommandPalette>
  <p class="maz:mt-3 maz:text-muted">Last command: {{ last }}</p>

<template #code>

```vue
<script lang="ts" setup>
import MazBtn from 'maz-ui/components/MazBtn'
import MazCommandPalette from 'maz-ui/components/MazCommandPalette'
import { ref } from 'vue'

const open = ref(false)

const groups = [
  {
    label: 'Navigation',
    items: [
      { label: 'Go home', description: 'Back to the start', to: '/' },
      { label: 'Open the docs', href: 'https://maz-ui.com' },
    ],
  },
  {
    label: 'Actions',
    items: [
      { label: 'Change the theme', keywords: ['dark', 'light'], shortcut: 'Ctrl D', action: () => toggleTheme() },
      { label: 'Delete the project', disabled: true },
    ],
  },
]
</script>

<template>
  <MazCommandPalette v-model:open="open" :groups>
    <template #trigger="{ open: show }">
      <MazBtn @click="show">
        Open the palette
      </MazBtn>
    </template>
  </MazCommandPalette>
</template>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  import { MazCog6Tooth } from '@maz-ui/icons/static/MazCog6Tooth'
  import { MazHome } from '@maz-ui/icons/static/MazHome'
  import { MazStar } from '@maz-ui/icons/static/MazStar'
  import { ref } from 'vue'

  const open = ref(false)
  const last = ref('none')

  const groups = [
    {
      label: 'Navigation',
      items: [
        { id: 'home', label: 'Go home', description: 'Back to the start', icon: MazHome, keywords: ['index'] },
        { id: 'settings', label: 'Open the settings', icon: MazCog6Tooth, shortcut: 'Ctrl ,', keywords: ['preferences'] },
      ],
    },
    {
      label: 'Actions',
      items: [
        { id: 'star', label: 'Add to favorites', icon: MazStar, keywords: ['star'] },
        { id: 'delete', label: 'Delete the project (unavailable)', disabled: true },
      ],
    },
  ]
</script>

## Commands

A command is `{ label, description?, icon?, keywords?, shortcut?, disabled? }` plus what it does:

- `action`: a function, called when the command is chosen.
- `to`: a route, with the router of the app.
- `href` (and `target`): a URL.

The search looks at the `label`, then at the `keywords` and at the `description`. The letters found in the label are underlined. `shortcut` is only a text shown at the end: it does not register a keyboard shortcut.

## Global shortcut

`shortcut` is `mod+k` by default (`mod` is Cmd on macOS and Ctrl elsewhere). The same shortcut opens and closes the palette. Use `:shortcut="false"` to remove it, and open the palette yourself with `v-model:open` or the `trigger` slot.

```vue
<MazCommandPalette v-model:open="open" :groups :shortcut="false" />
<MazCommandPalette v-model:open="open" :groups shortcut="mod+j" />
```

## Slots

`item` replaces the content of a command and `empty` the text shown when nothing matches.

```vue
<MazCommandPalette :groups>
  <template #item="{ item, isActive }">
    <strong :class="{ 'text-primary': isActive }">{{ item.label }}</strong>
  </template>

  <template #empty="{ query }">
    <p class="p-6 text-center">Nothing for "{{ query }}"</p>
  </template>
</MazCommandPalette>
```

## Options

- `close-on-select` (default `true`): set `:close-on-select="false"` to keep the palette open after a command.
- `animated` (default `true`): the highlight slides between the commands under the pointer.
- `max-width` (default `40rem`) and `placeholder`.

## Accessibility and motion

- The search field is an ARIA combobox that controls a listbox. The active command is announced through `aria-activedescendant`: the focus never leaves the field.
- `ArrowUp` and `ArrowDown` move and skip the disabled commands, `PageUp` and `PageDown` (or `Ctrl Home` and `Ctrl End`) go to the first and last command, `Enter` runs the command, `Escape` closes the palette and gives the focus back.
- A hidden live region announces the number of results.
- The window is a modal dialog: the focus is trapped and the page behind is inert.
- The highlight slides with the pointer only. With the keyboard, it jumps at once.
- With reduced motion, the window and the highlight do not move.
- Only `transform` and `opacity` are animated, with the motion tokens of the theme. Positions use logical properties, so right to left works.

## Events

`select` is emitted with the chosen command, before its `action` runs.

<!--@include: ./../../.vitepress/generated-docs/maz-command-palette.doc.md-->
