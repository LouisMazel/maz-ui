---
title: MazInputNumber
description: MazInputNumber is a number input component with increment and decrement buttons for user-friendly input. Customizable size, disabled state, and limit values.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<!--@include: ./../.vitepress/mixins/maz-input-props.md-->

## Basic usage

<MazInputNumber
  v-model="numberValue"
  placeholder="Enter number"
  :min="5"
  :max="10000"
  :step="5"
  color="secondary"
  style="width: 200px;"
/>

`numberValue: {{ numberValue }}`

<script lang="ts" setup>
  import { ref } from 'vue'

  const numberValue = ref()
</script>

```vue
<template>
  <MazInputNumber
    v-model="numberValue"
    placeholder="Enter number"
    :min="5"
    :max="10000"
    :min="5"
    size="md"
    color="secondary"
    style="width: 200px;"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazInputNumber from 'maz-ui/components/MazInputNumber'
  const numberValue = ref(2)
</script>
```

<!--@include: ./../.vitepress/generated-docs/maz-input-number.doc.md-->
