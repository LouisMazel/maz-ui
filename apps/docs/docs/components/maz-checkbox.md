---
title: MazCheckbox
description: MazCheckbox is a standalone component that replaces the standard html input checkbox. Color options are available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

`v-model="{{checked}}"`

<MazCheckbox v-model="checked" :label="checked ? 'Checked' : 'Unchecked'" />

```vue
<script lang="ts" setup>
import { MazCheckbox } from 'maz-ui/components'
import { ref } from 'vue'

const checked = ref(false)
</script>

<template>
  <MazCheckbox v-model="checked" :label="checked ? 'Checked' : 'Unchecked'" />
</template>
```

## Colors

`v-model="{{chosenColors}}"`

<div class="maz-flex maz-flex-col maz-gap-2">
  <MazCheckbox
    v-for="color in colors"
    :key="color"
    v-model="chosenColors"
    :color="color"
    :id="color"
    :name="color"
    :value="color"
  >
    {{ color }}
  </MazCheckbox>
</div>

::: details View code

```vue
<script lang="ts" setup>
import { type Color, MazCheckbox } from 'maz-ui/components'
import { ref } from 'vue'

const chosenColors = ref([])

const colors: Color[] = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'destructive',
  'contrast',
  'accent',
]
</script>

<template>
  <MazCheckbox
    v-for="color in colors"
    :id="color"
    :key="color"
    v-model="chosenColors"
    :color="color"
    name="color"
    :value="color"
  >
    {{ color }}
  </MazCheckbox>
</template>
```

:::

## Sizing

`v-model="{{chosenSizes}}"`

<div class="maz-flex maz-flex-col maz-gap-2">
  <MazCheckbox
    v-for="size in sizes"
    :key="size"
    v-model="chosenSizes"
    name="size"
    :value="size"
    :size="size"
  >
    {{ size }}
  </MazCheckbox>
</div>

::: details View code

```vue
<script lang="ts" setup>
import { MazCheckbox, type Size } from 'maz-ui/components'
import { ref } from 'vue'

const chosenSizes = ref([])

const sizes: Size[] = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <MazCheckbox
    v-for="size in sizes"
    :key="size"
    v-model="chosenSizes"
    name="size"
    :value="size"
    :size="size"
  >
    {{ size }}
  </MazCheckbox>
</template>
```

:::

## Disabled

<div class="maz-flex maz-flex-col maz-gap-2">
  <MazCheckbox :model-value="false" disabled name="disabled">
    disabled
  </MazCheckbox>

  <MazCheckbox :model-value="true" disabled name="disabled">
    disabled & checked
  </MazCheckbox>
</div>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { type Color, type Size } from 'maz-ui/components'

  const checked = ref(false)
  const chosenColors = ref([])
  const chosenSizes = ref([])

  const colors: Color[] = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'destructive',
    'contrast',
    'accent',
  ]

  const sizes: Size[] = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>

<!--@include: ./../.vitepress/generated-docs/maz-checkbox.doc.md-->
