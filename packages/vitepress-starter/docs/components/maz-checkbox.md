---
title: MazCheckbox
description: MazCheckbox is a standalone component replaces the standard html input checkbox. Color option available
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../mixins/getting-started.md-->

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
