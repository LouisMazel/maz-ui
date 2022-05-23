---
title: MazBadge
description: MazBadge is a stand-alone component to show short text in colored container
---

# MazBadge

> Before you have to import the global css files in your project, follow instructions in [Getting Started](./../guide/getting-started.md)

## Basic usage

<br />

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
  import MazBadge from 'maz-ui/components/MazBadge'
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
  import MazBadge from 'maz-ui/components/MazBadge'

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
  import MazBadge from 'maz-ui/components/MazBadge'

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
  import MazBadge from 'maz-ui/components/MazBadge'

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
  import MazBadge from 'maz-ui/components/MazBadge'
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
  import MazBadge from 'maz-ui/components/MazBadge'

  const roundedSize = ['sm', 'md', 'lg', 'xl', 'full']
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
  ]

  const roundedSize = ['sm', 'md', 'lg', 'xl', 'full']
</script>

## Props & Events emitted

<ComponentPropDoc component="MazBadge" />