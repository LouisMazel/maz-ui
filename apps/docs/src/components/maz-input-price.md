---
title: MazInputPrice
description: MazInputPrice is a standalone component that replaces the standard html input text and formats the text enter according to the currency provided
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

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
<script lang="ts" setup>
import { MazInputPrice } from 'maz-ui/components'
import { ref } from 'vue'

const priceValue = ref(2)
const formattedPrice = ref()
</script>

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
```

<!--@include: ./../.vitepress/mixins/maz-input-props.md-->
<!--@include: ./../../.vitepress/generated-docs/maz-input-price.doc.md-->
