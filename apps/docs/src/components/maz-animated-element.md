---
title: MazAnimatedElement
description: MazAnimatedElement is a standalone component that animates its content with a sliding blur effect when it enters the viewport. It supports different animation directions (up, down, left, right) and allows customizing the animation delay and duration.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo expanded>
  <MazAnimatedElement direction="up" :delay="1000" :duration="2000">
    <MazAvatar src="https://github.com/LouisMazel.png" size="lg" />
  </MazAnimatedElement>

<template #code>

```vue
<script lang="ts" setup>
import MazAnimatedElement from 'maz-ui/components/MazAnimatedElement'
</script>

<template>
  <MazAnimatedElement direction="up" :delay="1000" :duration="2000">
    <MazAvatar src="https://github.com/LouisMazel.png" size="lg" />
  </MazAnimatedElement>
</template>
```

  </template>
</ComponentDemo>

<!--@include: ./../../.vitepress/generated-docs/maz-animated-element.doc.md-->
