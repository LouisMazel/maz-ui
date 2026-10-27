---
title: MazLoadingBar
description: MazLoadingBar is an indeterminate progress bar to show that something is loading, typically at the top of a page or a container
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazLoadingBar color="secondary" />

```vue
<script lang="ts" setup>
import MazLoadingBar from 'maz-ui/components/MazLoadingBar'
</script>

<template>
  <MazLoadingBar color="secondary" />
</template>
```

<!--@include: ./../../.vitepress/generated-docs/maz-loading-bar.doc.md-->
