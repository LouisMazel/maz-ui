---
title: MazContainer
description: MazContainer is a lightweight component to wrap content with optional header, border, elevation, and rounded corners - a simpler alternative to MazCard
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

::: tip
MazContainer is designed to be a lighter alternative to [MazCard](/components/maz-card.html). Use it when you need a simple container with basic styling options without the extra features like galleries, collapsible content, or actions.
:::

## Basic usage

<ComponentDemo>
  <MazContainer>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
  </MazContainer>

  <template #code>

```vue
<template>
  <MazContainer>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
  </MazContainer>
</template>

<script lang="ts" setup>
  import MazContainer from 'maz-ui/components/MazContainer'
</script>
```

  </template>
</ComponentDemo>

## With title

Add a header with a title using the `title` prop or the `title` slot.

<ComponentDemo>
  <MazContainer title="Section Title">
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
  </MazContainer>

  <template #code>

```vue
<template>
  <MazContainer title="Section Title">
    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
  </MazContainer>
</template>
```

  </template>
</ComponentDemo>

## With icons

Add icons to the header using `left-icon` and `right-icon` props.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazContainer title="Settings" left-icon="cog-6-tooth">
      Configure your application settings here.
    </MazContainer>
    <MazContainer title="User Profile" left-icon="user" right-icon="pencil">
      View and edit your profile information.
    </MazContainer>
  </div>

  <template #code>

```vue
<template>
  <MazContainer title="Settings" left-icon="cog-6-tooth">
    Configure your application settings here.
  </MazContainer>

  <MazContainer title="User Profile" left-icon="user" right-icon="pencil">
    View and edit your profile information.
  </MazContainer>
</template>
```

  </template>
</ComponentDemo>

## Styling options

### Elevation

Add shadow to make the container stand out.

<ComponentDemo>
  <MazContainer elevation :bordered="false">
    Container with elevation effect and no border.
  </MazContainer>

  <template #code>

```vue
<template>
  <MazContainer elevation :bordered="false">
    Container with elevation effect and no border.
  </MazContainer>
</template>
```

  </template>
</ComponentDemo>

### Bordered

By default, the container has a border. You can disable it.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazContainer title="With border (default)">
      This container has a border.
    </MazContainer>
    <MazContainer title="Without border" :bordered="false">
      This container has no border.
    </MazContainer>
  </div>

  <template #code>

```vue
<template>
  <MazContainer title="With border (default)">
    This container has a border.
  </MazContainer>

  <MazContainer title="Without border" :bordered="false">
    This container has no border.
  </MazContainer>
</template>
```

  </template>
</ComponentDemo>

### Transparent

Remove the background color with the `transparent` prop.

<ComponentDemo>
  <MazContainer title="Transparent container" transparent>
    This container has a transparent background.
  </MazContainer>

  <template #code>

```vue
<template>
  <MazContainer title="Transparent container" transparent>
    This container has a transparent background.
  </MazContainer>
</template>
```

  </template>
</ComponentDemo>

### Rounded sizes

Customize the border radius with the `rounded-size` prop.

<ComponentDemo>
  <div class="maz-flex maz-flex-wrap maz-gap-4">
    <MazContainer v-for="size in roundedSizes" :key="size" :rounded-size="size">
      {{ size }}
    </MazContainer>
  </div>

  <template #code>

```vue
<template>
  <MazContainer v-for="size in roundedSizes" :key="size" :rounded-size="size">
    {{ size }}
  </MazContainer>
</template>

<script lang="ts" setup>
  import MazContainer from 'maz-ui/components/MazContainer'

  const roundedSizes = ['none', 'sm', 'md', 'lg', 'xl', 'full']
</script>
```

  </template>
</ComponentDemo>

### No padding

Remove internal padding with `:padding="false"`.

<ComponentDemo>
  <MazContainer title="No padding" :padding="false">
    Content without container padding - useful for custom layouts.
  </MazContainer>

  <template #code>

```vue
<template>
  <MazContainer title="No padding" :padding="false">
    Content without container padding - useful for custom layouts.
  </MazContainer>
</template>
```

  </template>
</ComponentDemo>

## Full width

Use the `block` prop to make the container take full width.

<ComponentDemo>
  <MazContainer title="Full width container" block>
    This container spans the full width of its parent.
  </MazContainer>

  <template #code>

```vue
<template>
  <MazContainer title="Full width container" block>
    This container spans the full width of its parent.
  </MazContainer>
</template>
```

  </template>
</ComponentDemo>

## Custom header

Use the `header` slot to fully customize the header, or use `title`, `icon-left`, and `icon-right` slots for more granular control.

<ComponentDemo>
  <MazContainer>
    <template #header>
      <div class="maz-flex maz-items-center maz-justify-between maz-w-full maz-px-4 maz-py-3 maz-bg-primary maz-text-primary-foreground">
        <span class="maz-font-semibold">Custom Header</span>
        <MazBadge size="0.8rem" color="white" class="maz-text-primary">
          New
        </MazBadge>
      </div>
    </template>
    Content with a fully customized header.
  </MazContainer>

  <template #code>

```vue
<template>
  <MazContainer>
    <template #header>
      <div class="maz-flex maz-items-center maz-justify-between maz-w-full maz-px-4 maz-py-3 maz-bg-primary maz-text-primary-foreground">
        <span class="maz-font-semibold">Custom Header</span>
        <MazBadge size="0.8rem" color="white" class="maz-text-primary">
          New
        </MazBadge>
      </div>
    </template>
    Content with a fully customized header.
  </MazContainer>
</template>
```

  </template>
</ComponentDemo>

## Combining options

<ComponentDemo>
  <MazContainer
    title="Dashboard Overview"
    left-icon="chart-bar"
    elevation
    :bordered="false"
    rounded-size="xl"
    block
  >
    <div class="maz-flex maz-gap-4 maz-flex-wrap">
      <MazContainer class="maz-flex-1 maz-min-w-[150px]">
        <p class="maz-text-muted maz-text-sm">Users</p>
        <p class="maz-text-2xl maz-font-bold">1,234</p>
      </MazContainer>
      <MazContainer class="maz-flex-1 maz-min-w-[150px]">
        <p class="maz-text-muted maz-text-sm">Revenue</p>
        <p class="maz-text-2xl maz-font-bold">$12.5k</p>
      </MazContainer>
      <MazContainer class="maz-flex-1 maz-min-w-[150px]">
        <p class="maz-text-muted maz-text-sm">Orders</p>
        <p class="maz-text-2xl maz-font-bold">567</p>
      </MazContainer>
    </div>
  </MazContainer>

  <template #code>

```vue
<template>
  <MazContainer
    title="Dashboard Overview"
    left-icon="chart-bar"
    elevation
    :bordered="false"
    rounded-size="xl"
    block
  >
    <div class="maz-flex maz-gap-4 maz-flex-wrap">
      <MazContainer class="maz-flex-1 maz-min-w-[150px]">
        <p class="maz-text-muted maz-text-sm">Users</p>
        <p class="maz-text-2xl maz-font-bold">1,234</p>
      </MazContainer>
      <MazContainer class="maz-flex-1 maz-min-w-[150px]">
        <p class="maz-text-muted maz-text-sm">Revenue</p>
        <p class="maz-text-2xl maz-font-bold">$12.5k</p>
      </MazContainer>
      <MazContainer class="maz-flex-1 maz-min-w-[150px]">
        <p class="maz-text-muted maz-text-sm">Orders</p>
        <p class="maz-text-2xl maz-font-bold">567</p>
      </MazContainer>
    </div>
  </MazContainer>
</template>
```

  </template>
</ComponentDemo>

<script lang="ts" setup>
  const roundedSizes = ['none', 'sm', 'md', 'lg', 'xl', 'full']
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-container.doc.md-->
