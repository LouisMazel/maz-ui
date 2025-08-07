---
title: MazLazyImg
description: MazLazyImg is a standalone component to display images and svgs with lazy loading
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<MazLazyImg src="https://placedog.net/1000/1000" block />

```vue
<script setup lang="ts">
import MazLazyImg from 'maz-ui/components/MazLazyImg'
</script>

<template>
  <MazLazyImg src="https://placedog.net/1000/1000" block />
</template>
```

<!--@include: ./../../.vitepress/generated-docs/maz-lazy-img.doc.md-->
