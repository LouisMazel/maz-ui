---
title: MazInputNumber
description: MazInputNumber is a standalone component that replaces the standard html input text and formats the number according to the locale provided
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<!--@include: ./../.vitepress/mixins/maz-input-props.md-->

## Basic usage

<MazInputNumber
  v-model="numberValue"
  label="Enter number"
  :min="5"
  :max="10000"
  :step="1"
  color="secondary"
/>

numberValue: {{ numberValue }}

<script lang="ts" setup>
  import { ref } from 'vue'

  const numberValue = ref(2)
</script>

```vue
<template>
  <MazInputNumber
    v-model="numberValue"
    label="Enter number"
    :min="5"
    :max="10000"
    :step="1"
    size="md"
    color="secondary"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazInputNumber from 'maz-ui/components/MazInputNumber'
  const numberValue = ref(2)
</script>
```

## Props, Events emitted

<ComponentPropDoc component="MazInputNumber" />
