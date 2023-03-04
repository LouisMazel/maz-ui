---
title: MazSwitch
description: MazSwitch is a standalone component replaces the standard html input checkbox. Color option available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

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

<!--@include: ./../.vitepress/generated-docs/maz-switch.doc.md-->
