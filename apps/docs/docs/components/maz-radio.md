---
title: MazRadio
description: MazRadio is a standalone component
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

`v-model="{{chosenColor ?? 'undefined'}}"`

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
<script lang="ts" setup>
import { MazRadio } from 'maz-ui/components'
import { ref } from 'vue'

const chosenColor = ref('primary')
const chosenSize = ref('mini')

const colors: Color[] = [
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

<template>
  <MazRadio
    v-for="color in colors"
    :key="color"
    v-model="chosenColor"
    name="chosenColor"
    :color="color"
    :value="color"
  >
    {{ color }}
  </MazRadio>
</template>
```

:::

## Sizing

`v-model="{{chosenSize ?? 'undefined'}}"`

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
<script lang="ts" setup>
import { MazRadio, type Size } from 'maz-ui/components'
import { ref } from 'vue'

const chosenSize = ref('mini')

const sizes: Size[] = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <MazRadio
    v-for="size in sizes"
    :key="size"
    v-model="chosenSize"
    name="chosenSize"
    :size="size"
    :value="size"
    :label="size"
  />
</template>
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
    'destructive',
    'accent',
    'contrast',
  ]

  const sizes: Size[] = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>

<!--@include: ./../.vitepress/generated-docs/maz-radio.doc.md-->
