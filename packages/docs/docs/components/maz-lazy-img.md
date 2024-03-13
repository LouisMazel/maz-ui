---
title: MazLazyImg
description: MazLazyImg is a standalone component to display images and svgs with lazy loading
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<MazLazyImg src="https://loremflickr.com/1000/1000" class="w-100"/>

```vue
<template>
  <MazLazyImg src="https://loremflickr.com/1000/1000" />
</template>

<script setup lang="ts">
  import MazLazyImg from 'maz-ui/components/MazLazyImg'
</script>
```

<!--@include: ./../.vitepress/generated-docs/maz-lazy-img.doc.md-->
