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
<template>
  <MazBadge>
    Badge
  </MazBadge>
</template>

<script lang="ts" setup>
  import { MazBadge } from 'maz-ui/components'
</script>
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
<template>
  <MazBadge v-for="color in color" :key="color" :color="color">
    {{ color }}
  </MazBadge>
</template>

<script lang="ts" setup>
  import { MazBadge } from 'maz-ui/components'

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'danger',
    'white',
    'black',
    'gray',
  ]
</script>
```

### Outline

<br />

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazBadge v-for="color in colors" :key="color" :color="color" outline>
    {{ color }}
  </MazBadge>
</div>

```vue
<template>
  <MazBadge v-for="color in color" :key="color" :color="color" outline>
    {{ color }}
  </MazBadge>
</template>

<script lang="ts" setup>
  import { MazBadge } from 'maz-ui/components'

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'danger',
    'white',
    'black',
    'gray',
  ]
</script>
```

### Pastel

<br />

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazBadge v-for="color in colors" :key="color" :color="color" pastel>
    {{ color }}
  </MazBadge>
</div>

```vue
<template>
  <MazBadge v-for="color in color" :key="color" :color="color" pastel>
    {{ color }}
  </MazBadge>
</template>

<script lang="ts" setup>
  import { MazBadge } from 'maz-ui/components'

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'danger',
    'white',
    'black',
    'gray',
  ]
</script>
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

<script lang="ts" setup>
  import { MazBadge } from 'maz-ui/components'
</script>
```

### Rounded sizes

<br />

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazBadge v-for="size in roundedSize" :key="size" :rounded-size="size" size="1.2rem">
    {{ size }}
  </MazBadge>
</div>

```vue
<template>
  <MazBadge v-for="size in roundedSize" :key="size" :rounded-size="size" size="1.2rem">
    {{ size }}
  </MazBadge>
</template>

<script lang="ts" setup>
  import { MazBadge } from 'maz-ui/components'

  const roundedSize = ['none', 'sm', 'md', 'lg', 'xl', 'full']
</script>
```

<script lang="ts" setup>
  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'danger',
    'white',
    'black',
    'gray',
    'theme',
  ]

  const roundedSize = ['none', 'sm', 'md', 'lg', 'xl', 'full']
</script>

<!--@include: ./../.vitepress/generated-docs/maz-badge.doc.md-->
