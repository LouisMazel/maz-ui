---
title: MazLazyImg
description: MazLazyImg is a standalone component to display images and svgs with lazy loading
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<MazLazyImg image="https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg" />

```vue
<template>
  <MazLazyImg image="https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg" />
</template>

<script setup lang="ts">
  import MazLazyImg from 'maz-ui/components/MazLazyImg'
</script>
```

## Props & Events emitted

<ComponentPropDoc component="MazLazyImg" />
