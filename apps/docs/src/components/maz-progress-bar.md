---
title: MazProgressBar
description: MazProgressBar is a linear bar showing the progress of a task or a measure in a known range, with a single value or stacked colored segments (a distribution), and an accessible label and value text.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

`value` goes from 0 to `max` (default `100`). The bar takes the full width of its container, the filled part animates when the value changes.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazProgressBar :value="progress" label="Upload" />
    <div class="maz:flex maz:gap-2">
      <MazBtn size="sm" color="container" @click="progress = Math.max(progress - 10, 0)">-10</MazBtn>
      <MazBtn size="sm" color="container" @click="progress = Math.min(progress + 10, 100)">+10</MazBtn>
    </div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazProgressBar from 'maz-ui/components/MazProgressBar'
import { ref } from 'vue'

const progress = ref(40)
</script>

<template>
  <MazProgressBar :value="progress" label="Upload" />
</template>
```

  </template>
</ComponentDemo>

## Max

With `max`, `value` is on its scale: 3 of 5 steps.

<ComponentDemo>
  <MazProgressBar :value="3" :max="5" label="Onboarding" value-text="3 of 5 steps" />

<template #code>

```vue
<MazProgressBar :value="3" :max="5" label="Onboarding" value-text="3 of 5 steps" />
```

  </template>
</ComponentDemo>

## Colors

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-3">
    <MazProgressBar v-for="color in colors" :key="color" :value="65" :color="color" :label="color" />
  </div>

<template #code>

```vue
<MazProgressBar :value="65" color="primary" label="primary" />
<MazProgressBar :value="65" color="secondary" label="secondary" />
<MazProgressBar :value="65" color="accent" label="accent" />
<MazProgressBar :value="65" color="info" label="info" />
<MazProgressBar :value="65" color="success" label="success" />
<MazProgressBar :value="65" color="warning" label="warning" />
<MazProgressBar :value="65" color="destructive" label="destructive" />
<MazProgressBar :value="65" color="contrast" label="contrast" />
```

  </template>
</ComponentDemo>

## Sizes and rounded

`size` sets the thickness (default `sm`), `rounded-size` the rounded of the bar (default `full`).

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-3">
    <MazProgressBar v-for="size in sizes" :key="size" :value="50" :size="size" :label="size" />
    <MazProgressBar :value="50" size="xl" rounded-size="none" label="xl, no rounded" />
    <MazProgressBar :value="50" size="xl" rounded-size="md" label="xl, rounded md" />
  </div>

<template #code>

```vue
<MazProgressBar :value="50" size="mini" label="mini" />
<MazProgressBar :value="50" size="xs" label="xs" />
<MazProgressBar :value="50" size="sm" label="sm" />
<MazProgressBar :value="50" size="md" label="md" />
<MazProgressBar :value="50" size="lg" label="lg" />
<MazProgressBar :value="50" size="xl" label="xl" />
<MazProgressBar :value="50" size="xl" rounded-size="none" label="xl, no rounded" />
<MazProgressBar :value="50" size="xl" rounded-size="md" label="xl, rounded md" />
```

  </template>
</ComponentDemo>

## Segments

`segments` stacks several values in one bar, each with its own color: a distribution (dependencies to update by kind of update, tests by status). Without `max`, their sum fills the bar; with `max`, the rest stays empty. `gap` leaves a small space between the segments.

The `label` of the segments is read in the accessible value of the bar ("12 patch, 5 minor, 2 major").

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazProgressBar :segments="updates" size="md" gap label="Updates" />
    <MazProgressBar :segments="updates" :max="30" size="md" gap label="Updates out of 30 dependencies" />
  </div>

<template #code>

```vue
<script lang="ts" setup>
import type { MazProgressBarSegment } from 'maz-ui/components/MazProgressBar'
import MazProgressBar from 'maz-ui/components/MazProgressBar'

const updates: MazProgressBarSegment[] = [
  { value: 12, color: 'success', label: 'patch' },
  { value: 5, color: 'warning', label: 'minor' },
  { value: 2, color: 'destructive', label: 'major' },
]
</script>

<template>
  <MazProgressBar :segments="updates" size="md" gap label="Updates" />
  <MazProgressBar :segments="updates" :max="30" size="md" gap label="Updates out of 30 dependencies" />
</template>
```

  </template>
</ComponentDemo>

## Accessibility

- `role` is `progressbar` by default, for the progress of a task. Use `meter` for a measure in a known range that is not a progress (disk usage, projects up to date).
- `label` gives the accessible name of the bar: always set it (or `aria-labelledby`) when no visible text names the bar.
- `value-text` replaces the number read by the screen readers ("3 of 5 steps"). With labelled `segments`, the value text lists them.

```vue
<MazProgressBar role="meter" :value="72" label="Disk usage" value-text="72 GB of 100 GB" color="warning" />
```

<!--@include: ./../../.vitepress/generated-docs/maz-progress-bar.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'

  const progress = ref(40)
  const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'destructive', 'contrast']
  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
  const updates = [
    { value: 12, color: 'success', label: 'patch' },
    { value: 5, color: 'warning', label: 'minor' },
    { value: 2, color: 'destructive', label: 'major' },
  ]
</script>
