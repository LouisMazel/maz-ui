---
title: MazSelect
description: MazSelect is a stand-alone component replaces the standard html input select with a beautiful design system. Many options like multiple values, search text field, custom templates options, colors, sizes, disabled, loading, error, warning, valid states, error messages, includes icons.
---

# MazSelect

> Before you have to import the global css files in your project, follow instructions in [Getting Started](/maz-ui-3/guide/getting-started.html)

## Basic usage

> `options` should be an array of `{ value: any, label: string }`

> This component use [MazInput](/maz-ui-3/components/maz-input.html), so it inherits all his props

<div class="flex flex-col gap-05">
  <MazSelect
    v-for="color in colors"
    :key="color"
    label="Select color"
    v-model="selectValue"
    :color="color"
    :options="colorsObject"
  />
</div>

<script setup lang="ts">
  import { ref } from 'vue'

  const selectValue = ref()

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'danger',
    'white',
    'black',
  ]

  const colorsObject = colors.map((color) => ({
    value: color,
    label: color,
  }))
</script>

```vue
<template>
  <MazSelect
    v-for="color in colors"
    :key="color"
    v-model="selectValue"
    label="Select color"
    :color="color"
    :options="colors"
  />
</template>

<script setup lang="ts">
  import MazSelect from 'maz-ui/components/MazInput'
  import { ref } from 'vue'

  const selectValue = ref()

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'danger',
    'white',
    'black',
  ]

  const colorsObject = colors.map((color) => ({
    value: color,
    label: color,
  }))
</script>
```

## Props & Events emitted

<ComponentPropDoc component="MazSelect" />