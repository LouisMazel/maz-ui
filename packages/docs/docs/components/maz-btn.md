---
title: MazBtn
description: MazBtn is a standalone component that replaces the standard html button with a beautiful design system. Many options like colors, sizes, disabled state, loading state, icons are included. Support of router-link and nuxt-link
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazBtn>Button</MazBtn>

```vue
<template>
  <MazBtn>Button</MazBtn>
</template>

<script lang="ts" setup>
  import MazBtn from 'maz-ui/components/MazBtn'
</script>
```

## Loading

<br />

<div class="flex items-start gap-05 flex-wrap">
  <div v-for="color of colors"
      :key="color" class="maz-flex maz-flex-col maz-flex-center">
    <MazBtn
      loading
      :color="color"
      right-icon="user"
    >
      {{ color }}
    </MazBtn>
    <span class="maz-text-muted maz-text-xs"> {{ color }} </span>
  </div>
</div>

::: details Show code

```vue
<template>
  <MazBtn
    v-for="color of colors"
    :key="color"
    loading
    :color="color"
  >
    {{ color }}
  </MazBtn>
</template>

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
    'transparent',
    'theme',
  ]
</script>
```

:::

## Sizes

::: tip
Use the attribute `size` with value **{{ sizes.join(', ') }}**
:::

<div class="flex items-start gap-05 items-center flex-wrap">
  <MazBtn v-for="size in sizes" :size="size">{{ size }}</MazBtn>
</div>

::: details Show code

```vue
<template>
  <MazBtn v-for="size in sizes" :size="size">{{ size }}</MazBtn>
</template>

<script setup lang="ts">
  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>
```

:::

## Colors

::: tip
Use the attribute `color` with a value in this [list](./../guide/colors.md), the component will use this color
:::

<div class="flex items-start gap-05 flex-wrap">
  <MazBtn v-for="color of colors" :key="color" :color="color">{{ color }}</MazBtn>
</div>

::: details Show code

```html
<MazBtn>primary</MazBtn>
<MazBtn color="secondary">secondary</MazBtn>
<MazBtn color="info">info</MazBtn>
<MazBtn color="success">success</MazBtn>
<MazBtn color="warning">warning</MazBtn>
<MazBtn color="danger">danger</MazBtn>
<MazBtn color="white">white</MazBtn>
<MazBtn color="black">black</MazBtn>
<MazBtn color="transparent">transparent</MazBtn>
```

:::

## Outline

<br />

<div class="flex items-start gap-05 flex-wrap">
  <MazBtn v-for="color of colors" :color="color" outline>{{ color }}</MazBtn>
</div>

::: details Show code

```html
<MazBtn outline>primary</MazBtn>
<MazBtn color="secondary" outline>secondary</MazBtn>
<MazBtn color="info" outline>info</MazBtn>
<MazBtn color="success" outline>success</MazBtn>
<MazBtn color="warning" outline>warning</MazBtn>
<MazBtn color="danger" outline>danger</MazBtn>
<MazBtn color="white" outline>white</MazBtn>
<MazBtn color="black" outline>black</MazBtn>
<MazBtn color="transparent" outline>transparent</MazBtn>
```

:::

## Pastel

::: tip
It's better in light mode
:::

<div class="flex items-start gap-05 rounded maz-p-3 flex-wrap">
  <MazBtn v-for="color of colors" :color="color" pastel>{{ color }}</MazBtn>
</div>

::: details Show code

```html
<MazBtn pastel>primary</MazBtn>
<MazBtn color="secondary" pastel>secondary</MazBtn>
<MazBtn color="info" pastel>info</MazBtn>
<MazBtn color="success" pastel>success</MazBtn>
<MazBtn color="warning" pastel>warning</MazBtn>
<MazBtn color="danger" pastel>danger</MazBtn>
<MazBtn color="white" pastel>white</MazBtn>
<MazBtn color="black" pastel>black</MazBtn>
<MazBtn color="transparent" pastel>transparent</MazBtn>
```

:::

## Rounded

<br />

<MazBtn rounded>rounded</MazBtn>

```html
<MazBtn rounded>rounded</MazBtn>
```

## Fab

<br />

<div class="maz-flex maz-gap-5 maz-items-center">
  <MazBtn fab icon="sun" size="mini" />
  <MazBtn fab icon="sun" size="xs" />
  <MazBtn fab icon="sun" size="sm" />
  <MazBtn fab>
    fab
  </MazBtn>
  <MazBtn fab icon="sun" size="lg" />
  <MazBtn fab icon="sun" size="xl" />
</div>

::: details Show code

```html
<MazBtn fab icon="sun" size="mini" />
<MazBtn fab icon="sun" size="xs" />
<MazBtn fab icon="sun" size="sm" />
<MazBtn fab>
  fab
</MazBtn>
<MazBtn fab icon="sun" size="lg" />
<MazBtn fab icon="sun" size="xl" />
```

:::

## Block

> Will take `width: 100%;`

<MazBtn block>block</MazBtn>

```html
<MazBtn block>block</MazBtn>
```

## Disabled

<br />

<MazBtn disabled>disabled</MazBtn>

```html
<MazBtn disabled>disabled</MazBtn>
```

## Icons

<div class="maz-flex maz-gap-2 maz-rounded maz-flex-wrap maz-items-center">
  <MazBtn :left-icon="CheckIcon" size="sm">
    left-icon
  </MazBtn>
  <MazBtn :right-icon="HomeIcon">
    right-icon
  </MazBtn>
  <MazBtn fab :icon="CommandLineIcon" size="lg" />
</div>

### Use icon name

::: details Show code

When you use the properties `right-icon`, `left-icon` or `icon` with the icon name (string), the component uses `<MazIcon name="..." />` component.

Check out how [MazIcon](./maz-icon.md) works, see all available icons and download them to put them in your public folder.

```html
<MazBtn left-icon="check" size="sm">
  left-icon
</MazBtn>
<MazBtn right-icon="home">
  right-icon
</MazBtn>
<MazBtn icon="command-line" fab size="lg" />
```

:::

### Use your own SVG icons

::: details Show code

```html
<MazBtn  size="sm">
  <template #left-icon>
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 12.75L10.5 18.75L19.5 5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </template>
  left-icon
</MazBtn>
<MazBtn>
  <template #right-icon>
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 12L11.2045 3.04549C11.6438 2.60615 12.3562 2.60615 12.7955 3.04549L21.75 12M4.5 9.75V19.875C4.5 20.4963 5.00368 21 5.625 21H9.75V16.125C9.75 15.5037 10.2537 15 10.875 15H13.125C13.7463 15 14.25 15.5037 14.25 16.125V21H18.375C18.9963 21 19.5 20.4963 19.5 19.875V9.75M8.25 21H16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </template>
  right-icon
</MazBtn>
<MazBtn fab size="lg">
  <template #icon>
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.75 7.5L9.75 9.75L6.75 12M11.25 12H14.25M5.25 20.25H18.75C19.9926 20.25 21 19.2426 21 18V6C21 4.75736 19.9926 3.75 18.75 3.75H5.25C4.00736 3.75 3 4.75736 3 6V18C3 19.2426 4.00736 20.25 5.25 20.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </template>
</MazBtn>
```

:::

### Use [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader)

::: details Show code

```vue
<template>
  <MazBtn :left-icon="CheckIcon" size="sm">
    left-icon
  </MazBtn>
  <MazBtn :right-icon="HomeIcon">
    right-icon
  </MazBtn>
  <MazBtn fab :icon="CommandLineIcon" size="lg" />
</template>

<script lang="ts" setup>
  import MazBtn from 'maz-ui/components/MazBtn'

  import CheckIcon from 'maz-ui/icons/check.svg'
  import HomeIcon from 'maz-ui/icons/home.svg'
  import CommandLineIcon from 'maz-ui/icons/command-line.svg'
</script>
```

:::

## Link

::: tip
With the attribute `variant="link"`, the button looks like a link but it's a button, so you can use the event `@click`

Additional props available include: `no-underline` & `no-leading`
:::

<MazBtn variant="link" @click="$emit('click')">Is Link</MazBtn>
<MazBtn variant="link" @click="$emit('click')" no-underline>Is Link</MazBtn>
<MazBtn variant="link" @click="$emit('click')" no-leading>Is Link</MazBtn>

::: details Show code

```html
<MazBtn variant="link" @click="$emit('click')">Is Link</MazBtn>
<MazBtn variant="link" @click="$emit('click')" no-underline>Is Link</MazBtn>
<MazBtn variant="link" @click="$emit('click')" no-leading>Is Link</MazBtn>
```

:::

## [HTMLLinkElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement)

::: info
When `href` attribute is provided, the component automatically becomes a `<a href="..." />`
:::

<MazBtn href="https://www.google.com" target="_blank">Is Button Link</MazBtn>

```html
<MazBtn href="https://www.google.com" target="_blank">
  Is Button Link
</MazBtn>
```

## [RouterLink](https://router.vuejs.org/api/#router-link)

::: info
When `to` attribute is provided, the component automatically becomes a `<RouterLink to="..." />`
:::

<MazBtn :to="{ path: '/made-with-maz-ui.html' }">Is Router Link</MazBtn>

```html
<MazBtn :to="{ path: '/made-with-maz-ui.html' }">
  Is RouterLink
</MazBtn>
```

<script setup lang="ts">
  import { computed } from 'vue'

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'danger',
    'white',
    'black',
    'transparent',
    'theme',
  ]

  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']

  import CheckIcon from 'maz-ui/icons/check.svg'
  import HomeIcon from 'maz-ui/icons/home.svg'
  import CommandLineIcon from 'maz-ui/icons/command-line.svg'
</script>

<!--@include: ./../.vitepress/generated-docs/maz-btn.doc.md-->