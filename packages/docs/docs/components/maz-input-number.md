---
description: MazInputNumber is a stand-alone component replaces the standard html input text and format the text enter according with the currency provided
---

# MazInputNumber

MazInputNumber is a stand-alone component replaces the standard html input text and format the text enter according with the currency provided

> Before you have to import the global css files in your project, follow instructions in [Getting Started](./../guide/getting-started.md)
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