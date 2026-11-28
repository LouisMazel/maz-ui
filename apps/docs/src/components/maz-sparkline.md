---
title: MazSparkline
description: MazSparkline is a tiny trend line, the size of a word, to put in a sentence or a table cell. It draws itself when it enters the screen and the last point pops. Plain SVG, no Chart.js.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Pass the values in `data`, from the oldest to the newest.

<ComponentDemo>
  <p class="maz:text-lg">
    Sales <MazSparkline :data="[3, 5, 4, 8, 7, 11, 10, 14]" /> are rising.
  </p>

<template #code>

```vue
<script lang="ts" setup>
import MazSparkline from 'maz-ui/components/MazSparkline'
</script>

<template>
  <p>Sales <MazSparkline :data="[3, 5, 4, 8, 7, 11, 10, 14]" /> are rising.</p>
</template>
```

  </template>
</ComponentDemo>

## Color, area and curve

`color` takes a theme color, a free CSS color or `currentColor`. `fill` colors the area under the line. `smooth` is on by default and never overshoots the data: set it to `false` for straight segments.

<ComponentDemo>
  <div class="maz:flex maz:items-center maz:gap-4">
    <MazSparkline :data="[9, 7, 8, 4, 5, 2]" color="destructive" fill :width="96" :height="28" />
    <MazSparkline :data="[2, 6, 3, 8, 5, 9]" color="success" :smooth="false" :width="96" :height="28" />
    <MazSparkline :data="[1, 3, 2, 5]" color="currentColor" />
  </div>

<template #code>

```vue
<template>
  <MazSparkline :data="[9, 7, 8, 4, 5, 2]" color="destructive" fill :width="96" :height="28" />
  <MazSparkline :data="[2, 6, 3, 8, 5, 9]" color="success" :smooth="false" :width="96" :height="28" />
  <MazSparkline :data="[1, 3, 2, 5]" color="currentColor" />
</template>
```

  </template>
</ComponentDemo>

## Size

`width` and `height` are in pixels (default 64 x 20). The line is never stretched: the ratio is kept.

## Accessibility and motion

- The chart is an image (`role="img"`) with a summary: the trend, the minimum, the maximum and the last value, formatted with `locale` and `format`. Replace it with `label`.
- The line draws itself when the chart enters the screen, then the last point pops. The observer is shared with the other reveals of the library.
- Nothing animates with reduced motion or with `animated` set to `false`. The server renders the final chart.

<!--@include: ./../../.vitepress/generated-docs/maz-sparkline.doc.md-->
