---
description: MazInputPrice is a stand-alone component replaces the standard html input text and format the text enter according with the currency provided
---

# MazInputPrice

> Before you have to import the global css files in your project, follow instructions in [Getting Started](./../guide/getting-started.md)

## Basic usage

<MazInputPrice
  v-model="priceValue"
  label="Enter your price"
  currency="USD"
  locale="en-US"
  :min="5"
  :max="1000"
  @formatted="formattedPrice = $event"
/>

priceValue: {{ priceValue }}

formattedPrice: {{ formattedPrice }}
<script lang="ts" setup>
  import { ref } from 'vue'

  const priceValue = ref(2)
  const formattedPrice = ref()
</script>

```vue
<template>
  <MazInputPrice
    v-model="priceValue"
    label="Enter your price"
    currency="USD"
    locale="en-US"
    :min="5"
    :max="1000"
    @formatted="formattedPrice = $event"
  />
</template>


<script lang="ts" setup>
  import { ref } from 'vue'
  import MazInputPrice from 'maz-ui/components/MazInputPrice'

  const priceValue = ref(2)
  const formattedPrice = ref()
</script>
```

## Props, Events emitted

<ComponentPropDoc component="MazInputPrice" />