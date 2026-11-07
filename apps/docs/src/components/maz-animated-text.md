---
title: MazAnimatedText
description: MazAnimatedText is a standalone component that animates text with a sliding blur effect. It can highlight the last word with a gradient background and supports different animation directions (up, down, left, right).
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

::: tip
This component is SSR friendly: the server renders the same markup as the client, so the text keeps its layout on hydration (no layout shift). The animation is pure CSS and starts on the first paint when the text is in the viewport, without waiting for JavaScript; below the viewport, it plays when the text enters it. With `prefers-reduced-motion: reduce`, the text is displayed without animation.
:::

<ComponentDemo expanded>
  <MazAnimatedText tag="h1" text="Hello" last-word="world" :delay="1000" :duration="2000" direction="up" :column-gap="0.5" :row-gap="0.5" />

<template #code>

```vue
<script lang="ts" setup>
import MazAnimatedText from 'maz-ui/components/MazAnimatedText'
</script>

<template>
  <MazAnimatedText tag="h1" text="Hello" last-word="world" :delay="1000" :duration="2000" direction="up" :column-gap="0.5" :row-gap="0.5" />
</template>
```

  </template>
</ComponentDemo>

<!--@include: ./../../.vitepress/generated-docs/maz-animated-text.doc.md-->
