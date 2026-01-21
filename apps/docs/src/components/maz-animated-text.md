---
title: MazAnimatedText
description: MazAnimatedText is a standalone component that animates text with a sliding blur effect. It can highlight the last word with a gradient background and supports different animation directions (up, down, left, right).
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

::: tip
This component is SSR friendly. It will display the brut text on the server side with the chosen tag, and the animated text on the client side.
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
