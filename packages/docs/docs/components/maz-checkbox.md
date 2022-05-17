---
title: MazCheckbox
description: MazCheckbox is a stand-alone component replaces the standard html input checkbox. Color option available
---

# MazCheckbox

> Before you have to import the global css files in your project, follow instructions in [Getting Started](/maz-ui-3/guide/getting-started.html)

<MazCheckbox v-for="color in colors" :color="color" :id="color" :name="color" :key="color" v-model="inputValue" style="margin-bottom: 12px;">
  {{ color }}
</MazCheckbox>

<script lang="ts" setup>
  import { ref } from 'vue'
  const inputValue = ref(false)

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
</script>

```vue
<template>
  <MazCheckbox v-for="color in colors" :color="color" :name="color" :key="color" v-model="inputValue">
    {{ color }}
  </MazCheckbox>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazCheckbox from 'maz-ui/components/MazCheckbox'

  const inputValue = ref(false)

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
</script>
```

## Props & Events emitted

<ComponentPropDoc component="MazCheckbox" />