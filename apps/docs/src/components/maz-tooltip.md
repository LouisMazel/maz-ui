---
title: MazTooltip
description: MazTooltip shows a short bubble when the element is hovered or focused. It supports a rich content, a keyboard shortcut and a group mode where a single bubble slides from one element to the next.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Wrap the element and give the `text`. The bubble opens after a short delay and closes with `Escape`.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-wrap maz:gap-4">
    <MazTooltip text="Save the file">
      <MazBtn>Hover or focus me</MazBtn>
    </MazTooltip>
    <MazTooltip text="Delete" color="destructive" position="bottom">
      <MazBtn color="destructive">Bottom</MazBtn>
    </MazTooltip>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazBtn from 'maz-ui/components/MazBtn'
import MazTooltip from 'maz-ui/components/MazTooltip'
</script>

<template>
  <MazTooltip text="Save the file">
    <MazBtn>Hover or focus me</MazBtn>
  </MazTooltip>

  <MazTooltip text="Delete" color="destructive" position="bottom">
    <MazBtn color="destructive">Bottom</MazBtn>
  </MazTooltip>
</template>
```

  </template>
</ComponentDemo>

## Shortcut and rich content

`shortcut` shows a keyboard shortcut next to the text. Use the same text as `useShortcut` (its `label`). The `content` slot replaces `text`.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:gap-4">
    <MazTooltip text="Search" shortcut="Ctrl K">
      <MazBtn color="secondary">With a shortcut</MazBtn>
    </MazTooltip>
    <MazTooltip position="right">
      <MazBtn color="info">Rich content</MazBtn>
      <template #content>
        <strong>Title</strong><br>
        <span>A sentence to explain.</span>
      </template>
    </MazTooltip>
  </div>

<template #code>

```vue
<MazTooltip text="Search" shortcut="Ctrl K">
  <MazBtn>With a shortcut</MazBtn>
</MazTooltip>

<MazTooltip position="right">
  <MazBtn>Rich content</MazBtn>

  <template #content>
    <strong>Title</strong>
    <span>A sentence to explain.</span>
  </template>
</MazTooltip>
```

  </template>
</ComponentDemo>

## Group

Give the same `group` name to several tooltips, for example the buttons of a toolbar. When you move from one to the next, one bubble slides to the new button instead of closing and opening again.

<ComponentDemo>
  <div class="maz:flex maz:gap-2">
    <MazTooltip v-for="item in toolbar" :key="item.label" :text="item.label" group="docs-toolbar" :delay="150">
      <MazBtn :icon="item.icon" :aria-label="item.label" color="surface" />
    </MazTooltip>
  </div>

<template #code>

```vue
<MazTooltip v-for="item in toolbar" :key="item.label" :text="item.label" group="toolbar">
  <MazBtn :icon="item.icon" :aria-label="item.label" color="surface" />
</MazTooltip>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  import { MazCog6Tooth } from '@maz-ui/icons/static/MazCog6Tooth'
  import { MazHome } from '@maz-ui/icons/static/MazHome'
  import { MazStar } from '@maz-ui/icons/static/MazStar'
  import { MazUser } from '@maz-ui/icons/static/MazUser'

  const toolbar = [
    { label: 'Home', icon: MazHome },
    { label: 'Profile', icon: MazUser },
    { label: 'Settings', icon: MazCog6Tooth },
    { label: 'Favorites', icon: MazStar },
  ]
</script>

## Delay

`delay` is 300 ms by default. A tooltip that opens right after another one closed has no delay, so a row of buttons feels instant once the first bubble is open.

## Open it yourself

`v-model` is the open state. The exposed `open()` and `close()` work without delay.

## MazTooltip or v-tooltip

Use the `v-tooltip` directive for a simple text on any element. Use `MazTooltip` for a rich content, a shortcut, a group, or to control the open state.

## Accessibility and motion

- The bubble has `role="tooltip"` and the element is linked to it with `aria-describedby`.
- It opens on focus as well as on hover, and `Escape` closes it without moving the focus. Pressing the element closes it too.
- A tooltip only describes: do not put a link or a button inside it, and do not hide the only name of a button there. A button with only an icon still needs an `aria-label`.
- With reduced motion, the bubble fades in and the group does not slide.
- Only `transform` and `opacity` are animated, with the motion tokens of the theme.

## Events

`open` and `close`.

<!--@include: ./../../.vitepress/generated-docs/maz-tooltip.doc.md-->
