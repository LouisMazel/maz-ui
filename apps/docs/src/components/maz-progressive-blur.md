---
title: MazProgressiveBlur
description: MazProgressiveBlur is a blur that grows toward an edge without a hard line, to place under a sticky bar or at the bottom of a scrolling list.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Put it in a positioned parent, over the content. It sits on the `bottom` edge by default and ignores the pointer, so the content below stays usable.

<ComponentDemo expanded>
  <div class="maz:relative maz:h-48 maz:overflow-hidden maz:rounded-lg maz:border maz:border-divider">
    <div class="maz:h-full maz:overflow-auto maz:p-4">
      <p v-for="line in 20" :key="line" class="maz:py-1">Line {{ line }}</p>
    </div>
    <MazProgressiveBlur height="5rem" />
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazProgressiveBlur from 'maz-ui/components/MazProgressiveBlur'
</script>

<template>
  <div class="relative h-48 overflow-hidden">
    <div class="h-full overflow-auto p-4">
      <p v-for="line in 20" :key="line">Line {{ line }}</p>
    </div>
    <MazProgressiveBlur height="5rem" />
  </div>
</template>
```

  </template>
</ComponentDemo>

## Position, size and strength

`position` is `top`, `bottom`, `start` or `end` (the last two follow the reading direction). `height` is the size of the band (its width for `start` and `end`) and `strength` is the blur of the edge, in pixels (12 by default).

```vue
<template>
  <MazProgressiveBlur position="top" height="4rem" :strength="20" />
</template>
```

Under a sticky bar, put the component in the positioned parent of the bar, right under it.

## Accessibility and fallback

- It is decorative: `aria-hidden` and `pointer-events: none`.
- Where `backdrop-filter` is not supported, it shows a gradient of the surface color instead of the blur.
- Nothing animates, so there is nothing to reduce.

<!--@include: ./../../.vitepress/generated-docs/maz-progressive-blur.doc.md-->
