---
title: MazTextarea
description: MazTextarea is a standalone component that replaces the standard html textarea input with a beautiful design system. Many options like colors, disabled, error, warning, success and error messages are available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

::: info
This component has the "autogrow" feature, so when the user writes, the textarea expands automatically
:::

## Basic usage

<MazTextarea
  v-model="value"
  name="comment"
  id="comment"
  label="Enter your comment"
/>

```vue
<template>
  <MazTextarea
    v-model="value"
    name="comment"
    id="comment"
    label="Enter your comment"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazTextarea from 'maz-ui/components/MazTextarea'

  const value = ref()
</script>
```

<script lang="ts" setup>
  import { ref } from 'vue'

  const value = ref()
</script>

## Props & Events emitted

<ComponentPropDoc component="MazTextarea" />
