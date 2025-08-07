---
title: MazSwitch
description: MazSwitch is a standalone component that replaces the standard html input checkbox. Color options are available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<div class="maz-flex maz-flex-col maz-gap-3">
  <MazSwitch
    v-for="color in colors"
    v-model="switchValue"
    :color="color"
    :name="color"
    :key="color"
  >
    {{ color }}
  </MazSwitch>

  <p>Disabled</p>

  <MazSwitch
    v-model="switchValueDisabled"
    name="disabled"
    disabled
  >
    Disabled
  </MazSwitch>
</div>

```vue
<template>
  <MazSwitch
    v-for="color in colors"
    v-model="switchValue"
    :color="color"
    :name="color"
    :key="color"
  />

  <p>Disabled</p>

  <MazSwitch
    v-model="switchValue"
    name="disabled"
    disabled
  >
    {{ color }}
  </MazSwitch>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazSwitch from 'maz-ui/components/MazSwitch'

  const switchValue = ref(false)
  const switchValueDisabled = ref(false)

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'destructive',
    'accent',
    'contrast',
  ]
</script>
```

<!--@include: ./../../.vitepress/generated-docs/maz-switch.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'
  const switchValue = ref(false)
  const switchValueDisabled = ref(false)

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'destructive',
    'accent',
    'contrast',
  ]
</script>
