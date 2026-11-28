---
title: MazSlider
description: MazSlider is a standalone component that replaces the standard html input range with a beautiful design system. Many options like multiple cursors and values, colors, sizes and logarithmic/exponential values are available
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<div class="vp-raw">
<MazSlider v-model="sliderValue" class="vp-raw" />
</div>

```vue
<script lang="ts" setup>
import MazSlider from 'maz-ui/components/MazSlider'
import { ref } from 'vue'
const sliderValue = ref(50)
</script>

<template>
  <MazSlider v-model="sliderValue" />
</template>
```

## Options

### Step

<div class="vp-raw">
<MazSlider v-model="sliderStepValue" :step="10" class="vp-raw" />
</div>

```html
<MazSlider v-model="value" :step="10" class="vp-raw" />
```

### Multiple sliders & labels

<div class="vp-raw">
<MazSlider v-model="multipleSilders" :labels="multipleSildersLabels" />
</div>

```vue
<script lang="ts" setup>
import MazSlider from 'maz-ui/components/MazSlider'
import { ref } from 'vue'
const multipleSilders = ref([25, 50, 75])
const multipleSildersLabels = ['Small', 'Middle', 'Big']
</script>

<template>
  <MazSlider v-model="multipleSilders" :labels="multipleSildersLabels" />
</template>
```

### Sizes & colors

<div class="vp-raw">
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
</div>

```vue
<script lang="ts" setup>
import MazSlider from 'maz-ui/components/MazSlider'
import { ref } from 'vue'
const multipleSilders = ref([25, 50, 75])
const multipleSildersLabels = ['Small', 'Middle', 'Big']
</script>

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
```

### Logarithmic/exponential

<div class="vp-raw">
<MazSlider
  v-model="logSilders"
  :labels="logSildersLabels"
  :min="50"
  :max="50000"
  log
/>
</div>

```vue
<script lang="ts" setup>
import MazSlider from 'maz-ui/components/MazSlider'
import { ref } from 'vue'
const logSilders = ref([50, 10000, 30000, 45000])
const logSildersLabels: ['Micro', 'Small', 'Middle', 'Big']
</script>

<template>
  <MazSlider
    v-model="logSilders"
    :labels="logSildersLabels"
    :min="50"
    :max="50000"
    log
  />
</template>
```

## hide dividers & cursor animation

> Each sections between cursors has the same color
>
> Component don't have animation on cursor

<div class="vp-raw">
<MazSlider
  v-model="multipleSilders"
  :divider="false"
  :cursor-anim="false"
/>
</div>

```vue
<script lang="ts" setup>
import MazSlider from 'maz-ui/components/MazSlider'
import { ref } from 'vue'
const multipleSilders = ref([25, 50, 75])
</script>

<template>
  <MazSlider
    v-model="multipleSilders"
    :divider="false"
    :cursor-anim="false"
  />
</template>
```

## Ticks

`ticks` draws a tick for each step. The ticks follow the fill and take the color of the slider as it passes them. Not used with `log` nor with more than 100 steps.

<ComponentDemo>
  <MazSlider v-model="ticksValue" :step="10" ticks />

<template #code>

```html
<MazSlider v-model="value" :step="10" ticks />
```

  </template>
</ComponentDemo>

## Motion

- While a cursor is dragged or focused, a bubble with its value pops out of it.
- The cursor sinks a little when pressed.
- The ticks change color as the fill passes them.

In right-to-left languages the fill starts from the right and <kbd>←</kbd> increases the value. Set `:animated="false"` to turn the bubble and the ticks transitions off. Reduced motion is respected.

<script lang="ts" setup>
  import { ref } from 'vue'
  const sliderValue = ref(50)
  const sliderStepValue = ref(50)
  const ticksValue = ref(30)
  const multipleSilders = ref([25, 50, 75])
  const multipleSildersLabels = ['Small', 'Middle', 'Big']

  const logSilders = ref([50, 10000, 30000, 45000])
  const logSildersLabels = ['Micro', 'Small', 'Middle', 'Big']
</script>

## Accessibility

Each cursor is a `slider` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-valuetext` when `labels` are set.

**Keyboard**: <kbd>←</kbd> / <kbd>↓</kbd> and <kbd>→</kbd> / <kbd>↑</kbd> move by one `step`, <kbd>Page Down</kbd> / <kbd>Page Up</kbd> by ten steps, <kbd>Home</kbd> / <kbd>End</kbd> to the lowest / highest value allowed for the cursor (a cursor never passes its neighbours).

<!--@include: ./../../.vitepress/generated-docs/maz-slider.doc.md-->