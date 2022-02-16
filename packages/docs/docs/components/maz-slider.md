---
description: MazSlider is a stand-alone component replaces the standard html input range with a beautiful design system. Many options like multiple cursors and values, colors, sizes and logarithmic/exponential values
---

# MazSlider

> Before you have to import the global css files in your project, follow instructions in [Getting Started](/maz-ui-3/guide/getting-started.html)

## Basic usage

<br />

<MazSlider v-model="sliderValue" />

```vue
<template>
  <MazSlider v-model="sliderValue" />
</template>

<script lang="ts" setup>
  import MazSlider from 'maz-ui/components/MazSlider'
  import { ref } from 'vue'
  const sliderValue = ref(50)
</script>
```

## Options

### Multiple sliders & labels

<MazSlider v-model="multipleSilders" :labels="multipleSildersLabels" />

```vue
<template>
  <MazSlider v-model="multipleSilders" :labels="multipleSildersLabels" />
</template>

<script lang="ts" setup>
  import MazSlider from 'maz-ui/components/MazSlider'
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
  color="danger"
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
    color="danger"
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
  import MazSlider from 'maz-ui/components/MazSlider'
  import { ref } from 'vue'
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
  import MazSlider from 'maz-ui/components/MazSlider'
  import { ref } from 'vue'
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
  import MazSlider from 'maz-ui/components/MazSlider'
  import { ref } from 'vue'
  const multipleSilders = ref([25, 50, 75])
</script>
```

## Props & Events emitted

<ComponentPropDoc component="MazSlider" />

<script lang="ts" setup>
  import { ref } from 'vue'
  const sliderValue = ref(50)
  const multipleSilders = ref([25, 50, 75])
  const multipleSildersLabels = ['Small', 'Middle', 'Big']

  const logSilders = ref([50, 10000, 30000, 45000])
  const logSildersLabels = ['Micro', 'Small', 'Middle', 'Big']
</script>