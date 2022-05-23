---
description: MazSwitch is a stand-alone component replaces the standard html input checkbox. Color option available.
---

# MazSwitch

> Before you have to import the global css files in your project, follow instructions in [Getting Started](./../guide/getting-started.md)

<MazSwitch
  v-for="color in colors"
  v-model="switchValue"
  :color="color"
  :name="color"
  :key="color"
  style="margin-bottom: 12px;"
/>

<script lang="ts" setup>
  import { ref } from 'vue'
  const switchValue = ref(false)

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'danger',
  ]
</script>

```vue
<template>
  <MazSwitch
    v-for="color in colors"
    v-model="switchValue"
    :color="color"
    :name="color"
    :key="color"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazSwitch from 'maz-ui/components/MazSwitch'

  const switchValue = ref(false)

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'danger',
  ]
</script>
```

## Props & Events emitted

<ComponentPropDoc component="MazSwitch" />