---
title: MazCheckbox
description: MazCheckbox is a standalone component that replaces the standard html input checkbox. Color options are available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazCheckbox v-model="checked">
  {{ checked ? 'Checked' : 'Unchecked' }}
</MazCheckbox>

```vue
<template>
  <MazCheckbox v-model="checked">
    {{ checked ? 'Checked' : 'Unchecked' }}
  </MazCheckbox>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazCheckbox from 'maz-ui/components/MazCheckbox'

  const checked = ref(false)
</script>
```

## Colors

<div class="maz-flex maz-flex-col maz-gap-2">
  <MazCheckbox v-for="color in colors" :color="color" :id="color" :name="color" :key="color" v-model="checked">
    {{ color }}
  </MazCheckbox>
</div>

::: details Show code

```vue
<template>
  <MazCheckbox v-for="color in colors" :color="color" :name="color" :key="color" v-model="checked">
    {{ color }}
  </MazCheckbox>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazCheckbox, { type Color } from 'maz-ui/components/MazCheckbox'

  const checked = ref(false)

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

<div class="maz-flex maz-flex-col maz-gap-2">
  <MazCheckbox v-for="size in sizes" :key="size" v-model="checked" :size="size">
    {{ size }}
  </MazCheckbox>
</div>

::: details Show code

```vue
<template>
  <MazCheckbox v-for="size in sizes" :key="size" v-model="checked" :size="size">
    {{ size }}
  </MazCheckbox>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazCheckbox, { type Size } from 'maz-ui/components/MazCheckbox'

  const checked = ref(false)

  const sizes: Size[] = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>
```

:::

<script lang="ts" setup>
  import { ref } from 'vue'
  const checked = ref(false)

  import { type Color, type Size } from 'maz-ui/components/MazCheckbox'

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

<!--@include: ./../.vitepress/generated-docs/maz-checkbox.doc.md-->
