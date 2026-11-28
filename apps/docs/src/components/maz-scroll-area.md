---
title: MazScrollArea
description: MazScrollArea is a scrolling area with a thin scrollbar, the same on every browser, and fades on the edges where content remains. The scroll stays native.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Set a `max-height`: the area scrolls when its content is taller. The edges fade while content remains.

<ComponentDemo expanded>
  <MazScrollArea max-height="10rem" label="Lines" class="maz:rounded-lg maz:border maz:border-divider maz:p-3">
    <p v-for="line in 20" :key="line" class="maz:py-1">Line {{ line }}</p>
  </MazScrollArea>

<template #code>

```vue
<script lang="ts" setup>
import MazScrollArea from 'maz-ui/components/MazScrollArea'
</script>

<template>
  <MazScrollArea max-height="10rem" label="Lines" class="rounded-lg border border-divider p-3">
    <p v-for="line in 20" :key="line">Line {{ line }}</p>
  </MazScrollArea>
</template>
```

  </template>
</ComponentDemo>

## Horizontal

`orientation="horizontal"` scrolls sideways (`both` scrolls in both directions). Use `max-width` to limit the width.

<ComponentDemo>
  <MazScrollArea orientation="horizontal" label="Tiles" class="maz:rounded-lg maz:border maz:border-divider maz:p-3">
    <div class="maz:flex maz:gap-3 maz:pb-3">
      <div v-for="tile in 14" :key="tile" class="maz:flex maz:h-20 maz:w-28 maz:shrink-0 maz:items-center maz:justify-center maz:rounded-md maz:bg-primary maz:text-primary-foreground">{{ tile }}</div>
    </div>
  </MazScrollArea>

<template #code>

```vue
<template>
  <MazScrollArea orientation="horizontal" label="Tiles">
    <div class="flex gap-3 pb-3">
      <div v-for="tile in 14" :key="tile" class="h-20 w-28 shrink-0 rounded-md bg-primary" />
    </div>
  </MazScrollArea>
</template>
```

  </template>
</ComponentDemo>

## Fades

Set `:fade="false"` to remove them, or `fade-size` to change their size (`2rem` by default). They appear and disappear with a short transition.

## Accessibility and motion

- The scroll is native: wheel, touch, keyboard and find in page work as usual.
- When the content scrolls, the area gets `tabindex="0"` so a keyboard user can scroll it. With a `label`, it also becomes a `region` named by it.
- The scrollbar uses `scrollbar-width` and `scrollbar-color` (with a `::-webkit-scrollbar` fallback) and follows the text color, so it fits light and dark.
- The fades transition is off when the user reduces motion.

<!--@include: ./../../.vitepress/generated-docs/maz-scroll-area.doc.md-->
