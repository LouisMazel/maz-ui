---
title: MazMiddleTruncate
description: MazMiddleTruncate cuts a text that is too long in the middle, so the start and the end stay readable (a file name keeps its extension). The full text opens from the center on hover and focus.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Put the component in a container that has a width. It measures the real width of the text and cuts only when needed.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-3">
    <input v-model.number="width" type="range" min="80" max="420" aria-label="Width" />
    <div :style="{ width: `${width}px` }">
      <MazMiddleTruncate text="annual-financial-report-final-2026.pdf" />
    </div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazMiddleTruncate from 'maz-ui/components/MazMiddleTruncate'
</script>

<template>
  <div class="w-48">
    <MazMiddleTruncate text="annual-financial-report-final-2026.pdf" />
  </div>
</template>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  import { ref } from 'vue'

  const width = ref(200)
</script>

## The end of the text

By default the end keeps the extension and five characters before it (`-2026.pdf`), or six characters when there is no extension. Set `endChars` to change it, and `ellipsis` for another mark.

<ComponentDemo>
  <div class="maz:w-48">
    <MazMiddleTruncate text="annual-financial-report-final-2026.pdf" :end-chars="12" />
  </div>

<template #code>

```vue
<template>
  <MazMiddleTruncate text="annual-financial-report-final-2026.pdf" :end-chars="12" />
</template>
```

  </template>
</ComponentDemo>

## Full text

When the text is cut, hover it or give it the focus: the full text opens from the center in a small panel. Set `reveal` to `false` to remove it.

## Accessibility and motion

- The full text is the accessible name. The cut text is hidden from screen readers.
- A cut text can be focused with the keyboard to open the full text. A text that fits is not focusable.
- There is no layout shift: the container keeps its size and the text stays on one line. Before the measure, and on the server, the text shows whole with a classic ellipsis.
- With reduced motion, the full text appears without the opening animation.

<!--@include: ./../../.vitepress/generated-docs/maz-middle-truncate.doc.md-->
