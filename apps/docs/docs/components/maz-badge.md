---
title: MazBadge
description: MazBadge is a standalone component to show short text in colored container
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazBadge>
  Badge
</MazBadge>

```vue
<script lang="ts" setup>
import { MazBadge } from 'maz-ui/components'
</script>

<template>
  <MazBadge>
    Badge
  </MazBadge>
</template>
```

## Options

> See all options props [here](#props-events-emitted)

### Colors

<br />

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazBadge v-for="color in colors" :key="color" :color="color">
    {{ color }}
  </MazBadge>
</div>

```vue
<script lang="ts" setup>
import { MazBadge } from 'maz-ui/components'

const colors = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'destructive',
  'contrast',
  'accent',
  'gray',
]
</script>

<template>
  <MazBadge v-for="color in color" :key="color" :color="color">
    {{ color }}
  </MazBadge>
</template>
```

### Outline

<br />

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazBadge v-for="color in colors" :key="color" :color="color" outline>
    {{ color }}
  </MazBadge>
</div>

```vue
<script lang="ts" setup>
import { MazBadge } from 'maz-ui/components'

const colors = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'destructive',
  'white',
  'black',
  'gray',
]
</script>

<template>
  <MazBadge v-for="color in color" :key="color" :color="color" outline>
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
import { MazBadge } from 'maz-ui/components'

const colors = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'destructive',
  'white',
  'black',
  'gray',
]
</script>

<template>
  <MazBadge v-for="color in color" :key="color" :color="color" pastel>
    {{ color }}
  </MazBadge>
</template>
```

### Size

<br />

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazBadge size="0.8rem">
    0.8rem
  </MazBadge>
  <MazBadge size="1.2rem">
    1.2rem
  </MazBadge>
  <MazBadge size="1.6rem">
    1.6rem
  </MazBadge>
  <MazBadge size="2rem">
    2rem
  </MazBadge>
  <MazBadge size="2.4rem">
    2.4rem
  </MazBadge>
</div>

```vue
<script lang="ts" setup>
import { MazBadge } from 'maz-ui/components'
</script>

<template>
  <MazBadge size="0.8rem">
    0.8rem
  </MazBadge>
  <MazBadge size="1.2rem">
    1.2rem
  </MazBadge>
  <MazBadge size="1.6rem">
    1.6rem
  </MazBadge>
  <MazBadge size="2rem">
    2rem
  </MazBadge>
  <MazBadge size="2.4rem">
    2.4rem
  </MazBadge>
</template>
```

### Rounded sizes

<br />

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazBadge v-for="size in roundedSize" :key="size" :rounded-size="size" size="1.2rem">
    {{ size }}
  </MazBadge>
</div>

```vue
<script lang="ts" setup>
import { MazBadge } from 'maz-ui/components'

const roundedSize = ['none', 'sm', 'md', 'lg', 'xl', 'full']
</script>

<template>
  <MazBadge v-for="size in roundedSize" :key="size" :rounded-size="size" size="1.2rem">
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
    'gray',
  ]

  const roundedSize = ['none', 'sm', 'md', 'lg', 'xl', 'full']
</script>

<!--@include: ./../.vitepress/generated-docs/maz-badge.doc.md-->
