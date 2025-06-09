---
title: MazSlider
description: MazSlider is a standalone component that replaces the standard html input range with a beautiful design system. Many options like multiple cursors and values, colors, sizes and logarithmic/exponential values are available
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazSlider v-model="sliderValue" class="vp-raw" />

```vue
<template>
  <MazSlider v-model="sliderValue" />
</template>

<script lang="ts" setup>
  import { MazSlider } from 'maz-ui/components'
  import { ref } from 'vue'
  const sliderValue = ref(50)
</script>
```

## Options

### Step

<MazSlider v-model="sliderValue" :step="10" class="vp-raw" />

```html
<MazSlider v-model="sliderValue" :step="10" class="vp-raw" />
```

### Multiple sliders & labels

<MazSlider v-model="multipleSilders" :labels="multipleSildersLabels" />

```vue
<template>
  <MazSlider v-model="multipleSilders" :labels="multipleSildersLabels" />
</template>

<script lang="ts" setup>
  import { MazSlider } from 'maz-ui/components'
  import { ref } from 'vue'
  const multipleSilders = ref([25, 50, 75])
  const multipleSildersLabels = ['Small', 'Middle', 'Big']
</script>
```

### Sizes & colors

<MazSlider
  v-model="multipleSilders"
  :labels="multipleSildersLabels"
  color="secondary"
  size="1.5rem"
/>

<MazSlider
  v-model="multipleSilders"
  :labels="multipleSildersLabels"
  color="destructive"
  size="1.2rem"
/>

<MazSlider
  v-model="multipleSilders"
  :labels="multipleSildersLabels"
  color="success"
  size="12px"
/>

<MazSlider
  v-model="multipleSilders"
  :labels="multipleSildersLabels"
  color="info"
  size="10px"
/>

```vue
<template>
  <MazSlider
    v-model="multipleSilders"
    :labels="multipleSildersLabels"
    color="secondary"
    size="1.5rem"
  />

  <MazSlider
    v-model="multipleSilders"
    :labels="multipleSildersLabels"
    color="destructive"
    size="1.2rem"
  />

  <MazSlider
    v-model="multipleSilders"
    :labels="multipleSildersLabels"
    color="success"
    size="12px"
  />

  <MazSlider
    v-model="multipleSilders"
    :labels="multipleSildersLabels"
    color="info"
    size="10px"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { MazSlider } from 'maz-ui/components'
  const multipleSilders = ref([25, 50, 75])
  const multipleSildersLabels = ['Small', 'Middle', 'Big']
</script>
```

### Logarithmic/exponential

<MazSlider
  v-model="logSilders"
  :labels="logSildersLabels"
  :min="50"
  :max="50000"
  logs
/>

```vue
<template>
  <MazSlider
    v-model="logSilders"
    :labels="logSildersLabels"
    :min="50"
    :max="50000"
    logs
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { MazSlider } from 'maz-ui/components'
  const logSilders = ref([50, 10000, 30000, 45000])
  const logSildersLabels: ['Micro', 'Small', 'Middle', 'Big']
</script>
```

## no-divider & no-zoom-animation

> Each sections between cursors has the same color

> Component don't have animation on cursor

<MazSlider
  v-model="multipleSilders"
  no-divider
  no-cursor-anim
/>

```vue
<template>
  <MazSlider
    v-model="multipleSilders"
    no-divider
    no-cursor-anim
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { MazSlider } from 'maz-ui/components'
  const multipleSilders = ref([25, 50, 75])
</script>
```

<script lang="ts" setup>
  import { ref } from 'vue'
  const sliderValue = ref(50)
  const multipleSilders = ref([25, 50, 75])
  const multipleSildersLabels = ['Small', 'Middle', 'Big']

  const logSilders = ref([50, 10000, 30000, 45000])
  const logSildersLabels = ['Micro', 'Small', 'Middle', 'Big']
</script>

<!--@include: ./../.vitepress/generated-docs/maz-slider.doc.md-->
