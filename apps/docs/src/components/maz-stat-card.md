---
title: MazStatCard
description: MazStatCard is a KPI card - a key figure that rolls, its variation, and the trend in the background. A marker follows the pointer and shows the value of the point, with the keyboard too.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Give a `label` and a `value`. Add `data` to draw the trend.

<ComponentDemo>
  <MazStatCard
    class="maz:w-72"
    label="Revenue"
    :value="48250"
    locale="en-US"
    :format="{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }"
    :delta="12"
    delta-label="vs last month"
    :data="[32, 35, 33, 38, 41, 39, 44, 47, 45, 52, 49, 56]"
  />

<template #code>

```vue
<script lang="ts" setup>
import MazStatCard from 'maz-ui/components/MazStatCard'
</script>

<template>
  <MazStatCard
    class="w-72"
    label="Revenue"
    :value="48250"
    :format="{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }"
    :delta="12"
    delta-label="vs last month"
    :data="[32, 35, 33, 38, 41, 39, 44, 47, 45, 52, 49, 56]"
  />
</template>
```

  </template>
</ComponentDemo>

## Variation

`delta` is in percent (`12` shows `+12%`). It is green when it goes up and red when it goes down. When lower is better (errors, churn), set `inverse`.

<ComponentDemo>
  <MazStatCard class="maz:w-64" label="Error rate" :value="1.4" :format="{ maximumFractionDigits: 1 }" :delta="-18" inverse />

<template #code>

```vue
<template>
  <MazStatCard class="w-64" label="Error rate" :value="1.4" :delta="-18" inverse />
</template>
```

  </template>
</ComponentDemo>

## Points and marker

Move the pointer over the chart: a marker snaps to the nearest point and shows its value. Give `labels` to name the points (`Mon`, `Tue`...). `color` and `smooth` style the curve.

## Accessibility and motion

- The card is a `group` named by its label. The delta shows a sign and an arrow, not only a color.
- The chart is a `slider`: focus it, then use the left and right arrows, `Home` and `End`. The value of the point is read with its label. `Escape` hides the marker.
- The figure rolls when `value` changes, the curve draws itself when the card enters the screen. Both are off with reduced motion.
- The chart stays left to right in right-to-left pages.

<!--@include: ./../../.vitepress/generated-docs/maz-stat-card.doc.md-->
