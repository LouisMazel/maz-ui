---
title: MazInputNumber
description: MazInputNumber is a number input component with increment and decrement buttons for user-friendly input. Customizable size, disabled state, and limit values.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo>
  <MazInputNumber
    v-model="numberValue"
    placeholder="Enter number"
    :min="5"
    :step="5"
    :max="10000"
    color="secondary"
    style="min-width: 200px"
  />

  <br />
  <br />

`numberValue: {{ numberValue }}`

<template #code>

```vue
<script lang="ts" setup>
import { MazInputNumber } from 'maz-ui/components'
import { ref } from 'vue'
const numberValue = ref(2)
</script>

<template>
  <MazInputNumber
    v-model="numberValue"
    placeholder="Enter number"
    :min="5"
    :step="5"
    :max="10000"
    color="secondary"
    style="min-width: 200px"
  />
</template>
```

  </template>
</ComponentDemo>

## No buttons

You can remove the buttons with the props `hide-buttons`

<ComponentDemo>
  <MazInputNumber
    v-model="numberValue"
    placeholder="Enter number"
    hide-buttons
  />

<template #code>

```html
<MazInputNumber v-model="numberValue" placeholder="Enter number" hide-buttons />
```

  </template>
</ComponentDemo>

<!--@include: ./../.vitepress/mixins/maz-input-props.md-->
<!--@include: ./../../.vitepress/generated-docs/maz-input-number.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'
  const numberValue = ref()
</script>
