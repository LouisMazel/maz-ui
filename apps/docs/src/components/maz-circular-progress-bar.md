---
title: MazCircularProgressBar
description: MazCircularProgressBar displays a percentage or a progress in an animated ring, with a configurable size, color, duration and content in the center
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo>
  <MazCircularProgressBar :percentage="75" suffix="%" />

<template #code>

```vue
<script lang="ts" setup>
import MazCircularProgressBar from 'maz-ui/components/MazCircularProgressBar'
</script>

<template>
  <MazCircularProgressBar :percentage="75" suffix="%" />
</template>
```

  </template>
</ComponentDemo>

## Size

The size of the component can be changed by passing the `size` prop. The value could be a string in px, em or rem.

<ComponentDemo>
  <div class="maz:flex maz:gap-3 maz:flex-wrap maz:items-center">
    <MazCircularProgressBar :percentage="75" suffix="%" size="3em" />
    <MazCircularProgressBar :percentage="75" suffix="%" size="100px" />
    <MazCircularProgressBar :percentage="75" suffix="%" size="10rem" />
    <MazCircularProgressBar :percentage="75" suffix="%" size="15rem" />
  </div>

<template #code>

```vue
<MazCircularProgressBar :percentage="75" suffix="%" size="3em" />

<MazCircularProgressBar :percentage="75" suffix="%" size="100px" />

<MazCircularProgressBar :percentage="75" suffix="%" size="10rem" />

<MazCircularProgressBar :percentage="75" suffix="%" size="15rem" />
```

  </template>
</ComponentDemo>

## Duration

The duration of the animation can be changed by passing the `duration` prop. The value could be a number in milliseconds.

<ComponentDemo>
  <MazCircularProgressBar :percentage="75" :duration="5000" />

<template #code>

```vue
<MazCircularProgressBar :percentage="75" :duration="5000" />
```

  </template>
</ComponentDemo>

## Color

<ComponentDemo>
  <div class="maz:flex maz:gap-3 maz:flex-wrap maz:items-center">
    <MazCircularProgressBar :percentage="75" color="primary" />
    <MazCircularProgressBar :percentage="75" color="secondary" />
    <MazCircularProgressBar :percentage="75" color="info" />
    <MazCircularProgressBar :percentage="75" color="success" />
    <MazCircularProgressBar :percentage="75" color="warning" />
    <MazCircularProgressBar :percentage="75" color="destructive" />
    <MazCircularProgressBar :percentage="75" color="neutral" />
  </div>

<template #code>

```vue
<MazCircularProgressBar :percentage="75" :duration="5000" />
```

  </template>
</ComponentDemo>

## Free color

`color` also takes any CSS color, for a gauge that shows data. The gradient of the stroke is derived from it. See [Free colors](./../guide/free-colors.md) for the accepted values and how the rest is derived.

<ComponentDemo>
  <div class="maz:flex maz:gap-3 maz:flex-wrap maz:items-center">
    <MazCircularProgressBar :percentage="75" color="#8b5cf6" />
    <MazCircularProgressBar :percentage="40" color="oklch(0.75 0.15 150)" />
  </div>

<template #code>

```vue
<template>
  <MazCircularProgressBar :percentage="75" color="#8b5cf6" />
  <MazCircularProgressBar :percentage="40" color="oklch(0.75 0.15 150)" />
</template>
```

  </template>
</ComponentDemo>

## Auto-color

The color of the component is automatically according to the percentage. The color will be green if the percentage is egal to 100%, orange if below 100%, and red if below 50%.

<ComponentDemo>
  <div class="maz:flex maz:gap-3 maz:flex-wrap maz:items-center">
    <MazCircularProgressBar :percentage="0" auto-color size="9rem" />
    <MazCircularProgressBar :percentage="25" auto-color size="9rem" />
    <MazCircularProgressBar :percentage="50" auto-color size="9rem" />
    <MazCircularProgressBar :percentage="100" auto-color size="9rem" />
  </div>

<template #code>

```vue
<MazCircularProgressBar :percentage="0" auto-color size="9rem" />

<MazCircularProgressBar :percentage="25" auto-color size="9rem" />

<MazCircularProgressBar :percentage="50" auto-color size="9rem" />

<MazCircularProgressBar :percentage="100" auto-color size="9rem" />
```

  </template>
</ComponentDemo>

## Slot

Replace the percentage value by a custom slot.

Obviously, the "counter animation" will not work in this case.

<ComponentDemo>
  <div class="maz:flex maz:gap-3 maz:flex-wrap maz:items-center">
    <MazCircularProgressBar :percentage="50">
      2/4
    </MazCircularProgressBar>
  </div>

<template #code>

```vue
<MazCircularProgressBar :percentage="75" :duration="5000" />
```

  </template>
</ComponentDemo>

## Rolling digits and check

By default the number counts up when the circle comes into view. With `roll`, the digits roll instead each time `percentage` changes. With `check`, a check replaces the number once the circle is full.

<ComponentDemo>
  <div class="maz:flex maz:items-center maz:gap-6">
    <MazCircularProgressBar :percentage="circularValue" roll check suffix="%" size="6em" />
    <div class="maz:flex maz:gap-2">
      <MazBtn size="sm" @click="circularValue = Math.max(0, circularValue - 25)">-25</MazBtn>
      <MazBtn size="sm" @click="circularValue = Math.min(100, circularValue + 25)">+25</MazBtn>
    </div>
  </div>

<template #code>

```html
<MazCircularProgressBar :percentage="percentage" roll check suffix="%" />
```

  </template>
</ComponentDemo>

## Indeterminate

When the progress is unknown, `indeterminate` turns an arc around the circle.

<ComponentDemo>
  <MazCircularProgressBar :percentage="0" indeterminate size="5em" />

<template #code>

```html
<MazCircularProgressBar :percentage="0" indeterminate />
```

  </template>
</ComponentDemo>

With reduced motion, the arc and the digits stay still.

<script setup lang="ts">
  import { ref } from 'vue'

  const circularValue = ref(50)
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-circular-progress-bar.doc.md-->
