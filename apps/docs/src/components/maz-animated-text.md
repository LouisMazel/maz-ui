---
title: MazAnimatedText
description: MazAnimatedText is a standalone component that animates text with a sliding blur effect. It can highlight the last word with a gradient background and supports different animation directions (up, down, left, right).
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

::: tip
This component is SSR friendly: the server renders the same markup as the client, so the text keeps its layout on hydration (no layout shift). The text is visible without JavaScript, and the words come in one after the other when it enters the screen once the page is hydrated (built on [vReveal](./../directives/reveal.md)). With `prefers-reduced-motion: reduce`, the text fades in quickly.
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
