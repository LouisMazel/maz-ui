---
title: MazLoadingBar
description: MazLoadingBar is an indeterminate progress bar to show that something is loading, typically at the top of a page or a container
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<div class="vp-raw">
<MazLoadingBar color="secondary" />
</div>

```vue
<script lang="ts" setup>
import MazLoadingBar from 'maz-ui/components/MazLoadingBar'
</script>

<template>
  <MazLoadingBar color="secondary" />
</template>
```

## Page loader

Set `loading` to drive the bar like a page loader. It advances by steps that slow down and never reaches the end while `loading` is `true`. When `loading` becomes `false`, it runs to the end and slips out.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-3">
    <MazLoadingBar :loading="barLoading" height="4px" />
    <MazBtn size="sm" class="maz:self-start" @click="barLoading = !barLoading">{{ barLoading ? 'Finish' : 'Start' }}</MazBtn>
  </div>

<template #code>

```html
<MazLoadingBar :loading="isLoading" height="4px" />
```

  </template>
</ComponentDemo>

Without `loading`, the bar slides endlessly.

## Motion

The bar moves with `transform` only. With reduced motion, it does not move.

<script setup lang="ts">
  import { ref } from 'vue'

  const barLoading = ref(false)
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-loading-bar.doc.md-->
