---
title: MazBadge
description: MazBadge is a standalone component to show short text in colored container
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<div class="vp-raw">
<MazBadge>
  Badge
</MazBadge>
</div>

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

<div class="vp-raw flex space-between gap-05 items-center flex-wrap">
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
    'surface',
    'container',
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

<div class="vp-raw flex space-between gap-05 items-center flex-wrap">
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
  'surface',
  'container',
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

<div class="vp-raw flex space-between gap-05 items-center flex-wrap">
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
    'surface',
    'container',
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

<div class="vp-raw flex space-between gap-05 items-center flex-wrap">
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

<div class="vp-raw flex space-between gap-05 items-center flex-wrap">
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

### Removable

Add `removable` to show a remove button at the end of the badge: it emits `remove` with the click event and has an accessible label ("Remove", translated), which you can change with `remove-label`. The button uses the color of the badge text and a visible focus ring, so it works with every color and with `outlined` and `pastel`.

<div class="vp-raw flex gap-05 items-center flex-wrap">
  <MazBadge v-for="color in colors" :key="color" :color="color" removable @remove="removed = color">
    {{ color }}
  </MazBadge>
  <MazBadge color="info" pastel removable>pastel</MazBadge>
  <MazBadge color="info" outlined removable>outlined</MazBadge>
</div>

Last removed: {{ removed }}

```vue
<script lang="ts" setup>
import MazBadge from 'maz-ui/components/MazBadge'
import { ref } from 'vue'

const tags = ref(['Vue', 'Nuxt', 'Vite'])

function removeTag(tag: string) {
  tags.value = tags.value.filter(t => t !== tag)
}
</script>

<template>
  <MazBadge v-for="tag in tags" :key="tag" removable @remove="removeTag(tag)">
    {{ tag }}
  </MazBadge>
</template>
```

<script lang="ts" setup>
  import { ref } from 'vue'

  const removed = ref('none')

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'destructive',
    'contrast',
    'accent',
    'surface',
    'container',
    'transparent',
  ]

  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']

  const roundedSize = ['none', 'sm', 'md', 'lg', 'xl', 'full']
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-badge.doc.md-->
