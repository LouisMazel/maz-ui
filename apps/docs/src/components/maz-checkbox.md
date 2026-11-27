---
title: MazCheckbox
description: MazCheckbox is a standalone component that replaces the standard html input checkbox. Color options are available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

`v-model="{{checked}}"`

<div class="vp-raw">
<MazCheckbox v-model="checked" :label="checked ? 'Checked' : 'Unchecked'" />
</div>

```vue
<script lang="ts" setup>
import MazCheckbox from 'maz-ui/components/MazCheckbox'
import { ref } from 'vue'

const checked = ref(false)
</script>

<template>
  <MazCheckbox v-model="checked" :label="checked ? 'Checked' : 'Unchecked'" />
</template>
```

## Colors

`v-model="{{chosenColors}}"`

<div class="vp-raw maz:flex maz:flex-col maz:gap-2">
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
import type { Color } from 'maz-ui/components'
import MazCheckbox from 'maz-ui/components/MazCheckbox'
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

<div class="vp-raw maz:flex maz:flex-col maz:gap-2">
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
import type { MazSize } from 'maz-ui/components'
import MazCheckbox from 'maz-ui/components/MazCheckbox'
import { ref } from 'vue'

const chosenSizes = ref([])

const sizes: MazSize[] = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
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

## Indeterminate

`indeterminate` shows a dash instead of the check, sets `aria-checked="mixed"` and the native `indeterminate` property of the input. It is the state of a "select all" checkbox when only some of the children are selected. It only changes the display: it does not change the model, so compute it from the children. A click on an indeterminate checkbox emits the opposite of its model, so a "select all" checkbox with `false` as model selects everything.

<div class="vp-raw maz:flex maz:flex-col maz:gap-2">
  <MazCheckbox
    :model-value="allSelected"
    :indeterminate="someSelected"
    @update:model-value="toggleAll"
  >
    Select all
  </MazCheckbox>
  <div class="maz:flex maz:flex-col maz:gap-2 maz:ps-8">
    <MazCheckbox v-for="fruit in fruits" :key="fruit" v-model="selectedFruits" :value="fruit" size="sm">
      {{ fruit }}
    </MazCheckbox>
  </div>
</div>

::: details View code

```vue
<script lang="ts" setup>
import MazCheckbox from 'maz-ui/components/MazCheckbox'
import { computed, ref } from 'vue'

const fruits = ['Apple', 'Banana', 'Cherry']
const selectedFruits = ref<string[]>(['Banana'])

const allSelected = computed(() => selectedFruits.value.length === fruits.length)
const someSelected = computed(() => selectedFruits.value.length > 0 && !allSelected.value)

function toggleAll(checked: boolean) {
  selectedFruits.value = checked ? [...fruits] : []
}
</script>

<template>
  <MazCheckbox :model-value="allSelected" :indeterminate="someSelected" @update:model-value="toggleAll">
    Select all
  </MazCheckbox>

  <MazCheckbox v-for="fruit in fruits" :key="fruit" v-model="selectedFruits" :value="fruit" size="sm">
    {{ fruit }}
  </MazCheckbox>
</template>
```

:::

[MazChecklist](./maz-checklist.md) has no select-all row: put a `MazCheckbox` with `indeterminate` above it, computed from the `v-model` of the checklist as above.

## Disabled

<div class="vp-raw maz:flex maz:flex-col maz:gap-2">
  <MazCheckbox :model-value="false" disabled name="disabled">
    disabled
  </MazCheckbox>

  <MazCheckbox :model-value="true" disabled name="disabled">
    disabled & checked
  </MazCheckbox>
</div>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { type Color, type Size } from 'maz-ui/components'

  const checked = ref(false)
  const chosenColors = ref([])
  const chosenSizes = ref([])

  const fruits = ['Apple', 'Banana', 'Cherry']
  const selectedFruits = ref<string[]>(['Banana'])
  const allSelected = computed(() => selectedFruits.value.length === fruits.length)
  const someSelected = computed(() => selectedFruits.value.length > 0 && !allSelected.value)
  function toggleAll(checked: boolean) {
    selectedFruits.value = checked ? [...fruits] : []
  }

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

<!--@include: ./../../.vitepress/generated-docs/maz-checkbox.doc.md-->
