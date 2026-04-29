---
title: MazBadge
description: MazBadge is a standalone component to show short text in colored container
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazBadge>
  Badge
</MazBadge>

```vue
<script lang="ts" setup>
  import MazBadge from 'maz-ui/components/MazBadge'
</script>

<template>
  <MazBadge>
    Badge
  </MazBadge>
</template>
```

## Options

> See all options props [here](#props)

### Colors

<br />

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazBadge v-for="color in colors" :key="color" :color="color">
    {{ color }}
  </MazBadge>
</div>

```vue
<script lang="ts" setup>
  import MazBadge from 'maz-ui/components/MazBadge'

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'destructive',
    'contrast',
    'accent',
    'background',
    'transparent',
  ]
</script>

<template>
  <MazBadge v-for="color in color" :key="color" :color="color">
    {{ color }}
  </MazBadge>
</template>
```

### Outlined

<br />

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazBadge v-for="color in colors" :key="color" :color="color" outlined>
    {{ color }}
  </MazBadge>
</div>

```vue
<script lang="ts" setup>
import MazBadge from 'maz-ui/components/MazBadge'

const colors = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'destructive',
  'contrast',
  'accent',
  'background',
  'transparent',
]
</script>

<template>
  <MazBadge v-for="color in color" :key="color" :color="color" outlined>
    {{ color }}
  </MazBadge>
</template>
```

### Pastel

<br />

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazBadge v-for="color in colors" :key="color" :color="color" pastel>
    {{ color }}
  </MazBadge>
</div>

```vue
<script lang="ts" setup>
  import MazBadge from 'maz-ui/components/MazBadge'

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'destructive',
    'contrast',
    'accent',
    'background',
    'transparent',
  ]
</script>

<template>
  <MazBadge v-for="color in color" :key="color" :color="color" pastel>
    {{ color }}
  </MazBadge>
</template>
```

### Size

The `size` prop accepts one of the standardized `MazSize` values (`'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`). The default is `'md'`. Padding, line-height and dimensions all scale relative to the chosen font-size, so a single keyword controls the whole badge footprint.

<br />

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazBadge v-for="size in sizes" :key="size" :size="size">
    {{ size }}
  </MazBadge>
</div>

```vue
<script lang="ts" setup>
import MazBadge from 'maz-ui/components/MazBadge'

const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <MazBadge v-for="size in sizes" :key="size" :size="size">
    {{ size }}
  </MazBadge>
</template>
```

### Rounded sizes

<br />

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazBadge v-for="size in roundedSize" :key="size" :rounded-size="size">
    {{ size }}
  </MazBadge>
</div>

```vue
<script lang="ts" setup>
import MazBadge from 'maz-ui/components/MazBadge'

const roundedSize = ['none', 'sm', 'md', 'lg', 'xl', 'full']
</script>

<template>
  <MazBadge v-for="size in roundedSize" :key="size" :rounded-size="size">
    {{ size }}
  </MazBadge>
</template>
```

<script lang="ts" setup>
  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'destructive',
    'contrast',
    'accent',
    'background',
    'transparent',
  ]

  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']

  const roundedSize = ['none', 'sm', 'md', 'lg', 'xl', 'full']
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-badge.doc.md-->
