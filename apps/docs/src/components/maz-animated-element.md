---
title: MazAnimatedElement
description: MazAnimatedElement is a standalone component that animates its content with a sliding blur effect when it enters the viewport. It supports different animation directions (up, down, left, right) and allows customizing the animation delay and duration.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

::: tip
This component is SSR friendly: its content is in the server markup and is visible without JavaScript. Once the page is hydrated, it plays when the element enters the screen (it is built on [vReveal](./../directives/reveal.md)). With `prefers-reduced-motion: reduce`, the content fades in quickly. Do not put it on the main content at the top of the page (the LCP).
:::

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
