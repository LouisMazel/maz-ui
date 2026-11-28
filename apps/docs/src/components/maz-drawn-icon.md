---
title: MazDrawnIcon
description: MazDrawnIcon is an icon drawn with strokes. It draws itself when it appears or when you set `drawn` to true. Ideal for success, error and validation feedback.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

The icon draws itself when it appears. Press the button to draw it again.

<ComponentDemo expanded>
  <div class="maz:flex maz:items-center maz:gap-6">
    <MazDrawnIcon name="check-circle" size="xl" :drawn="drawn" class="maz:text-success" />
    <MazBtn size="sm" :aria-pressed="drawn" @click="drawn = !drawn">
      {{ drawn ? 'Hide' : 'Draw' }}
    </MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazBtn from 'maz-ui/components/MazBtn'
import MazDrawnIcon from 'maz-ui/components/MazDrawnIcon'
import { ref } from 'vue'

const drawn = ref(true)
</script>

<template>
  <MazDrawnIcon name="check-circle" size="xl" :drawn="drawn" class="text-success" />

  <MazBtn :aria-pressed="drawn" @click="drawn = !drawn">
    {{ drawn ? 'Hide' : 'Draw' }}
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Icons

Seven icons are available. The icons with a circle draw it first, then the mark inside.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
    <div v-for="name in names" :key="name" class="maz:flex maz:flex-col maz:items-center maz:gap-2">
      <MazDrawnIcon :name="name" size="xl" :drawn="drawn" />
      <span class="maz:text-xs maz:text-muted">{{ name }}</span>
    </div>
  </div>

<template #code>

```vue
<template>
  <MazDrawnIcon name="check" />
  <MazDrawnIcon name="x-mark" />
  <MazDrawnIcon name="minus" />
  <MazDrawnIcon name="check-circle" />
  <MazDrawnIcon name="x-circle" />
  <MazDrawnIcon name="exclamation-circle" />
  <MazDrawnIcon name="information-circle" />
</template>
```

  </template>
</ComponentDemo>

## size and color

`size` takes `xs`, `sm`, `md`, `lg`, `xl` or any CSS length, like [MazIcon](./maz-icon.md). The icon uses `currentColor`: set the color with a text class.

<ComponentDemo>
  <div class="maz:flex maz:items-center maz:gap-4">
    <MazDrawnIcon name="check" size="sm" class="maz:text-success" />
    <MazDrawnIcon name="x-circle" size="lg" class="maz:text-destructive" />
    <MazDrawnIcon name="information-circle" size="3rem" class="maz:text-info" />
  </div>

<template #code>

```vue
<template>
  <MazDrawnIcon name="check" size="sm" class="text-success" />
  <MazDrawnIcon name="x-circle" size="lg" class="text-destructive" />
  <MazDrawnIcon name="information-circle" size="3rem" class="text-info" />
</template>
```

  </template>
</ComponentDemo>

## stroke width, duration and delay

`strokeWidth` is in the units of the 24x24 viewBox (default `2`). `duration` is the duration of each stroke, `delay` waits before the drawing starts. Both take a CSS time.

<ComponentDemo>
  <MazDrawnIcon name="check-circle" size="xl" :stroke-width="1" duration="1s" delay="300ms" :drawn="drawn" />

<template #code>

```vue
<MazDrawnIcon name="check-circle" size="xl" :stroke-width="1" duration="1s" delay="300ms" />
```

  </template>
</ComponentDemo>

## Accessibility

The icon is decorative by default (`aria-hidden="true"`). Use `label` when it is the only thing that carries the meaning: it adds `role="img"` and `aria-label`.

<ComponentDemo>
  <MazDrawnIcon name="check-circle" size="xl" label="Saved" class="maz:text-success" :drawn="drawn" />

<template #code>

```vue
<MazDrawnIcon name="check-circle" label="Saved" class="text-success" />
```

  </template>
</ComponentDemo>

With reduced motion (system preference or the `motion` option of `MazUi`), the icon is shown drawn, without animation.

<!--@include: ./../../.vitepress/generated-docs/maz-drawn-icon.doc.md-->

<script setup lang="ts">
import { ref } from 'vue'

const drawn = ref(true)
const names = ['check', 'x-mark', 'minus', 'check-circle', 'x-circle', 'exclamation-circle', 'information-circle'] as const
</script>
