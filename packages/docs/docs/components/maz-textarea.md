---
description: MazTextarea is a stand-alone component replaces the standard html textarea input with a beautiful design system. Many options like colors, disabled, error, warning, success, error messages.
---

# MazTextarea

> Before you have to import the global css files in your project, follow instructions in [Getting Started](./../guide/getting-started.md)

<!-- <MazTextarea
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
</script> -->

```vue
<template>
  <MazTextarea
    v-for="color in colors"
    v-model="switchValue"
    :color="color"
    :name="color"
    :key="color"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazTextarea from 'maz-ui/components/MazTextarea'

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

<!-- ## Props & Events emitted

<ComponentPropDoc component="MazTextarea" /> -->