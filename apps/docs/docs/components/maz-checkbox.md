---
title: MazCheckbox
description: MazCheckbox is a standalone component that replaces the standard html input checkbox. Color options are available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

```v-model="{{checked}}"```

<MazCheckbox v-model="checked" :label="checked ? 'Checked' : 'Unchecked'" />

```vue
<template>
  <MazCheckbox v-model="checked" :label="checked ? 'Checked' : 'Unchecked'" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { MazCheckbox } from 'maz-ui/components'

  const checked = ref(false)
</script>
```

## Colors

```v-model="{{chosenColors}}"```

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
<template>
  <MazCheckbox
    v-for="color in colors"
    :key="color"
    v-model="chosenColors"
    :color="color"
    :id="color"
    name="color"
    :value="color"
  >
    {{ color }}
  </MazCheckbox>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { MazCheckbox, type Color } from 'maz-ui/components'

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
```

:::

## Sizing

```v-model="{{chosenSizes}}"```

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

<script lang="ts" setup>
  import { ref } from 'vue'
  import { MazCheckbox, type Size } from 'maz-ui/components'

  const chosenSizes = ref([])

  const sizes: Size[] = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>
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
  import { type Color, type Size } from 'maz-ui/components'

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
