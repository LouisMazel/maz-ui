---
title: MazSkeleton
description: MazSkeleton is a standalone component to display loading placeholders with animated shimmer effect
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

<!--@include: ./../../.vitepress/mixins/translated-component.md-->

## Basic usage

The skeleton displays a loading placeholder with a shimmer animation by default.

<ComponentDemo>
  <MazSkeleton />

<template #code>

```vue
<script lang="ts" setup>
import MazSkeleton from 'maz-ui/components/MazSkeleton'
</script>

<template>
  <MazSkeleton />
</template>
```

</template>
</ComponentDemo>

## Shapes

Use the `shape` prop to change the skeleton shape: `rectangle` (default), `circle`, or `square`.

<ComponentDemo>
  <div class="maz-flex maz-gap-4 maz-items-center">
    <div class="maz-flex maz-flex-col maz-items-center maz-gap-2">
      <MazSkeleton shape="rectangle" width="100px" height="1rem" />
      <span class="maz-text-sm maz-text-muted">rectangle</span>
    </div>
    <div class="maz-flex maz-flex-col maz-items-center maz-gap-2">
      <MazSkeleton shape="circle" size="3rem" />
      <span class="maz-text-sm maz-text-muted">circle</span>
    </div>
    <div class="maz-flex maz-flex-col maz-items-center maz-gap-2">
      <MazSkeleton shape="square" size="3rem" />
      <span class="maz-text-sm maz-text-muted">square</span>
    </div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazSkeleton from 'maz-ui/components/MazSkeleton'
</script>

<template>
  <MazSkeleton shape="rectangle" width="100px" height="1rem" />
  <MazSkeleton shape="circle" size="3rem" />
  <MazSkeleton shape="square" size="3rem" />
</template>
```

</template>
</ComponentDemo>

## Sizes

Use the `size` prop to set both width and height (for circle and square shapes), or use `width` and `height` props for more control.

<ComponentDemo>
  <div class="maz-flex maz-gap-4 maz-items-end">
    <MazSkeleton shape="circle" size="2rem" />
    <MazSkeleton shape="circle" size="3rem" />
    <MazSkeleton shape="circle" size="4rem" />
    <MazSkeleton shape="circle" size="5rem" />
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazSkeleton from 'maz-ui/components/MazSkeleton'
</script>

<template>
  <MazSkeleton shape="circle" size="2rem" />
  <MazSkeleton shape="circle" size="3rem" />
  <MazSkeleton shape="circle" size="4rem" />
  <MazSkeleton shape="circle" size="5rem" />
</template>
```

</template>
</ComponentDemo>

## Custom dimensions

For rectangles, use `width` and `height` props for precise control.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazSkeleton width="100%" height="0.75rem" />
    <MazSkeleton width="80%" height="0.75rem" />
    <MazSkeleton width="60%" height="0.75rem" />
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazSkeleton from 'maz-ui/components/MazSkeleton'
</script>

<template>
  <MazSkeleton width="100%" height="0.75rem" />
  <MazSkeleton width="80%" height="0.75rem" />
  <MazSkeleton width="60%" height="0.75rem" />
</template>
```

</template>
</ComponentDemo>

## Rounded sizes

Control the border radius using the `rounded-size` prop.

<ComponentDemo>
  <div class="maz-flex maz-gap-4 maz-flex-wrap">
    <div v-for="size in roundedSizes" :key="size" class="maz-flex maz-flex-col maz-items-center maz-gap-2">
      <MazSkeleton :rounded-size="size" width="80px" height="2rem" />
      <span class="maz-text-sm maz-text-muted">{{ size }}</span>
    </div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazSkeleton from 'maz-ui/components/MazSkeleton'
</script>

<template>
  <MazSkeleton rounded-size="none" width="80px" height="2rem" />
  <MazSkeleton rounded-size="sm" width="80px" height="2rem" />
  <MazSkeleton rounded-size="md" width="80px" height="2rem" />
  <MazSkeleton rounded-size="lg" width="80px" height="2rem" />
  <MazSkeleton rounded-size="xl" width="80px" height="2rem" />
  <MazSkeleton rounded-size="full" width="80px" height="2rem" />
</template>
```

</template>
</ComponentDemo>

## Disable animation

Use the `animated` prop set to `false` to disable the shimmer animation.

<ComponentDemo>
  <div class="maz-flex maz-gap-4">
    <div class="maz-flex maz-flex-col maz-items-center maz-gap-2">
      <MazSkeleton shape="circle" size="3rem" :animated="true" />
      <span class="maz-text-sm maz-text-muted">animated</span>
    </div>
    <div class="maz-flex maz-flex-col maz-items-center maz-gap-2">
      <MazSkeleton shape="circle" size="3rem" :animated="false" />
      <span class="maz-text-sm maz-text-muted">static</span>
    </div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazSkeleton from 'maz-ui/components/MazSkeleton'
</script>

<template>
  <MazSkeleton shape="circle" size="3rem" :animated="true" />
  <MazSkeleton shape="circle" size="3rem" :animated="false" />
</template>
```

</template>
</ComponentDemo>

## Card skeleton example

Combine multiple skeletons to create loading placeholders for complex layouts.

<ComponentDemo>
  <div class="maz-flex maz-gap-4 maz-p-4 maz-w-full maz-max-w-sm">
    <MazSkeleton shape="circle" size="3rem" />
    <div class="maz-flex maz-flex-col maz-gap-2 maz-flex-1">
      <MazSkeleton width="60%" height="0.875rem" />
      <MazSkeleton width="40%" height="0.75rem" />
    </div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazSkeleton from 'maz-ui/components/MazSkeleton'
</script>

<template>
  <div class="card-skeleton">
    <MazSkeleton shape="circle" size="3rem" />
    <div class="content">
      <MazSkeleton width="60%" height="0.875rem" />
      <MazSkeleton width="40%" height="0.75rem" />
    </div>
  </div>
</template>
```

</template>
</ComponentDemo>

## Article skeleton example

Create an article loading placeholder with various skeleton elements.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4 maz-w-full maz-max-w-md">
    <MazSkeleton width="100%" height="200px" rounded-size="lg" />
    <div class="maz-flex maz-flex-col maz-gap-2">
      <MazSkeleton width="80%" height="1.5rem" />
      <MazSkeleton width="100%" height="0.75rem" />
      <MazSkeleton width="100%" height="0.75rem" />
      <MazSkeleton width="60%" height="0.75rem" />
    </div>
    <div class="maz-flex maz-gap-2 maz-items-center">
      <MazSkeleton shape="circle" size="2rem" />
      <MazSkeleton width="100px" height="0.75rem" />
    </div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazSkeleton from 'maz-ui/components/MazSkeleton'
</script>

<template>
  <div class="article-skeleton">
    <!-- Featured image -->
    <MazSkeleton width="100%" height="200px" rounded-size="lg" />

    <!-- Title and description -->
    <MazSkeleton width="80%" height="1.5rem" />
    <MazSkeleton width="100%" height="0.75rem" />
    <MazSkeleton width="100%" height="0.75rem" />
    <MazSkeleton width="60%" height="0.75rem" />

    <!-- Author -->
    <div class="author">
      <MazSkeleton shape="circle" size="2rem" />
      <MazSkeleton width="100px" height="0.75rem" />
    </div>
  </div>
</template>
```

</template>
</ComponentDemo>

## List skeleton example

Create a list loading placeholder.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-3 maz-w-full maz-max-w-sm">
    <div v-for="i in 4" :key="i" class="maz-flex maz-gap-3 maz-items-center maz-p-2 maz-bg-surface-50 dark:maz-bg-surface-800 maz-rounded">
      <MazSkeleton shape="square" size="2.5rem" rounded-size="md" />
      <div class="maz-flex maz-flex-col maz-gap-1 maz-flex-1">
        <MazSkeleton width="70%" height="0.75rem" />
        <MazSkeleton width="50%" height="0.625rem" />
      </div>
    </div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazSkeleton from 'maz-ui/components/MazSkeleton'
</script>

<template>
  <div class="list-skeleton">
    <div v-for="i in 4" :key="i" class="list-item">
      <MazSkeleton shape="square" size="2.5rem" rounded-size="md" />
      <div class="content">
        <MazSkeleton width="70%" height="0.75rem" />
        <MazSkeleton width="50%" height="0.625rem" />
      </div>
    </div>
  </div>
</template>
```

</template>
</ComponentDemo>

## Accessibility

The component includes proper accessibility attributes:
- `role="status"` to indicate loading state
- `aria-live="polite"` for screen reader announcements
- Customizable `aria-label` and `loading-text` props

<ComponentDemo>
  <MazSkeleton
    shape="circle"
    size="3rem"
    aria-label="Loading user avatar"
    loading-text="Please wait while loading..."
  />

<template #code>

```vue
<script lang="ts" setup>
import MazSkeleton from 'maz-ui/components/MazSkeleton'
</script>

<template>
  <MazSkeleton
    shape="circle"
    size="3rem"
    aria-label="Loading user avatar"
    loading-text="Please wait while loading..."
  />
</template>
```

</template>
</ComponentDemo>

<!--@include: ./../../.vitepress/generated-docs/maz-skeleton.doc.md-->

<script lang="ts" setup>
const roundedSizes = ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const
</script>
