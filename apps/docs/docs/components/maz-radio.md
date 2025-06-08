---
title: MazRadio
description: MazRadio is a standalone component
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

```v-model="{{chosenColor ?? 'undefined'}}"```

<div class="maz-flex maz-flex-col maz-gap-2">
  <MazRadio
    v-for="color in colors"
    v-model="chosenColor"
    name="chosenColor"
    :color="color"
    :key="color"
    :value="color"
  >
    {{ color }}
  </MazRadio>
</div>

::: details View code

```vue
<template>
  <MazRadio
    v-for="color in colors"
    v-model="chosenColor"
    name="chosenColor"
    :color="color"
    :key="color"
    :value="color"
  >
    {{ color }}
  </MazRadio>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { MazRadio } from 'maz-ui/components'

  const chosenColor = ref('primary')
  const chosenSize = ref('mini')

  const colors: Color[] = [
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

:::

## Sizing

```v-model="{{chosenSize ?? 'undefined'}}"```

<div class="maz-flex maz-flex-col maz-gap-2">
  <MazRadio
    v-for="size in sizes"
    v-model="chosenSize"
    name="chosenSize"
    :key="size"
    :size="size"
    :value="size"
    :label="size"
  />
</div>

::: details View code

```vue
<template>
  <MazRadio
    v-for="size in sizes"
    v-model="chosenSize"
    name="chosenSize"
    :key="size"
    :size="size"
    :value="size"
    :label="size"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { MazRadio, type Size } from 'maz-ui/components'

  const chosenSize = ref('mini')

  const sizes: Size[] = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>
```

:::

## Disabled

<div class="maz-flex maz-flex-col maz-gap-2">
  <MazRadio disabled name="disabled" value="disabled2">
    disabled
  </MazRadio>

  <MazRadio model-value="disabled" disabled name="disabled" value="disabled">
    disabled & selected
  </MazRadio>
</div>

<script lang="ts" setup>
  import { ref } from 'vue'
  const chosenColor = ref()
  const chosenSize = ref()

  const colors: Color[] = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'danger',
    'white',
    'black',
  ]

  const sizes: Size[] = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>

<!--@include: ./../.vitepress/generated-docs/maz-radio.doc.md-->
