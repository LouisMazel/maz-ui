---
title: MazBtn
description: MazBtn is a standalone component that replaces the standard html button with a beautiful design system. Many options like colors, sizes, disabled state, loading state, icons are included. Support of router-link and nuxt-link
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo expanded>
  <MazBtn>Button</MazBtn>

<template #code>

```vue
<script setup lang="ts">
import MazBtn from 'maz-ui/components/MazBtn'
</script>

<template>
  <MazBtn>Button</MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Sizes

Use the attribute `size` with value `{{ sizes.join(', ') }}`

<ComponentDemo>
  <div class="flex items-start gap-05 items-center flex-wrap">
    <MazBtn v-for="size in sizes" :size="size">{{ size }}</MazBtn>
  </div>

<template #code>

```vue
<script setup lang="ts">
const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <MazBtn v-for="size in sizes" :key="size" :size="size">
    {{ size }}
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Colors

<ComponentDemo>
  <div class="flex items-start gap-05 flex-wrap">
    <MazBtn v-for="color of colors" :key="color" :color="color">{{ color }}</MazBtn>
  </div>

<template #code>

```html
<MazBtn>primary</MazBtn>
<MazBtn color="secondary">secondary</MazBtn>
<MazBtn color="info">info</MazBtn>
<MazBtn color="success">success</MazBtn>
<MazBtn color="warning">warning</MazBtn>
<MazBtn color="destructive">destructive</MazBtn>
<MazBtn color="contrast">contrast</MazBtn>
<MazBtn color="accent">accent</MazBtn>
<MazBtn color="surface">surface</MazBtn>
<MazBtn color="transparent">transparent</MazBtn>
```

  </template>
</ComponentDemo>

## Outlined

Transform the button into an outlined button with the attribute `outlined`

<ComponentDemo>
<div class="flex items-start gap-05 flex-wrap">
  <MazBtn v-for="color of colors" :color="color" outlined>{{ color }}</MazBtn>
</div>

<template #code>

```html
<MazBtn outlined>primary</MazBtn>
<MazBtn color="secondary" outlined>secondary</MazBtn>
<MazBtn color="info" outlined>info</MazBtn>
<MazBtn color="success" outlined>success</MazBtn>
<MazBtn color="warning" outlined>warning</MazBtn>
<MazBtn color="destructive" outlined>destructive</MazBtn>
<MazBtn color="contrast" outlined>contrast</MazBtn>
<MazBtn color="accent" outlined>accent</MazBtn>
<MazBtn color="surface" outlined>surface</MazBtn>
<MazBtn color="transparent" outlined>transparent</MazBtn>
```

  </template>
</ComponentDemo>

## Loading

The loading state is available with the attribute `loading`

<ComponentDemo>
  <div class="flex items-start gap-05 flex-wrap">
    <div v-for="color of colors"
        :key="color" class="maz:flex maz:flex-col maz:flex-center">
      <MazBtn
        loading
        :color="color"
        start-icon="user"
        end-icon="user"
      >
        {{ color }}
      </MazBtn>
      <span class="maz:text-muted maz:text-xs"> {{ color }} </span>
    </div>
  </div>

<template #code>

```vue
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
  'transparent',
  'background',
]
</script>

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
```

  </template>
</ComponentDemo>

## Pastel

The pastel state is available with the attribute `pastel`

::: info
Better in light mode
:::

<ComponentDemo>

  <div class="flex items-start gap-05 rounded maz:p-3 flex-wrap">
    <MazBtn v-for="color of colors" :color="color" pastel>{{ color }}</MazBtn>
  </div>

<template #code>

```html
<MazBtn pastel>primary</MazBtn>
<MazBtn color="secondary" pastel>secondary</MazBtn>
<MazBtn color="info" pastel>info</MazBtn>
<MazBtn color="success" pastel>success</MazBtn>
<MazBtn color="warning" pastel>warning</MazBtn>
<MazBtn color="destructive" pastel>destructive</MazBtn>
<MazBtn color="contrast" pastel>contrast</MazBtn>
<MazBtn color="accent" pastel>accent</MazBtn>
<MazBtn color="surface" pastel>surface</MazBtn>
<MazBtn color="transparent" pastel>transparent</MazBtn>
```

  </template>
</ComponentDemo>

## Rounded Size

Choose the size of the rounded with the attribute `rounded-size` and value `none`, `sm`, `md`, `lg`, `xl`, `full`

<ComponentDemo>

  <div class="flex items-start gap-05 rounded maz:p-3 flex-wrap">
    <MazBtn v-for="size of ['none', 'sm', 'md', 'lg', 'xl', 'full']" :rounded-size="size">{{ size }}</MazBtn>
  </div>

<template #code>

```html
<MazBtn rounded-size="none">none</MazBtn>
<MazBtn rounded-size="sm">sm</MazBtn>
<MazBtn rounded-size="md">md</MazBtn>
<MazBtn rounded-size="lg">lg</MazBtn>
<MazBtn rounded-size="xl">xl</MazBtn>
<MazBtn rounded-size="full">full</MazBtn>
```

  </template>
</ComponentDemo>

## Fab

The button can be a fab button with the attribute `fab`

<ComponentDemo>
  <div class="maz:flex maz:gap-5 maz:items-center">
    <MazBtn fab icon="/sun.svg" size="mini" />
    <MazBtn fab icon="/sun.svg" size="xs" />
    <MazBtn fab icon="/sun.svg" size="sm" />
    <MazBtn fab>
      fab
    </MazBtn>
    <MazBtn fab icon="/sun.svg" size="lg" />
    <MazBtn fab icon="/sun.svg" size="xl" />
  </div>

<template #code>

```html
<MazBtn fab icon="/sun.svg" size="mini" />
<MazBtn fab icon="/sun.svg" size="xs" />
<MazBtn fab icon="/sun.svg" size="sm" />
<MazBtn fab> fab </MazBtn>
<MazBtn fab icon="/sun.svg" size="lg" />
<MazBtn fab icon="/sun.svg" size="xl" />
```

  </template>
</ComponentDemo>

## Block

Will take `width: 100%;`

<ComponentDemo>
  <MazBtn block>block</MazBtn>

<template #code>

```html
<MazBtn block>block</MazBtn>
```

  </template>
</ComponentDemo>

## Justify

This property is used to align the content of the button.

By default, the justify is `center`

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-2">
    <MazBtn block justify="center" icon="/users.svg" end-icon="/sun.svg" size="md">center</MazBtn>
    <MazBtn block justify="start" icon="/users.svg" end-icon="/sun.svg" size="md">start</MazBtn>
    <MazBtn block justify="end" icon="/users.svg" end-icon="/sun.svg" size="md">end</MazBtn>
    <MazBtn block justify="space-between" icon="/users.svg" end-icon="/sun.svg" size="md">between</MazBtn>
    <MazBtn block justify="space-around" icon="/users.svg" end-icon="/sun.svg" size="md">around</MazBtn>
    <MazBtn block justify="space-evenly" icon="/users.svg" end-icon="/sun.svg" size="md">evenly</MazBtn>
  </div>

<template #code>

```html
<MazBtn block justify="center" icon="/users.svg" end-icon="/sun.svg" size="md">center</MazBtn>
<MazBtn block justify="start" icon="/users.svg" end-icon="/sun.svg" size="md">start</MazBtn>
<MazBtn block justify="end" icon="/users.svg" end-icon="/sun.svg" size="md">end</MazBtn>
<MazBtn block justify="space-between" icon="/users.svg" end-icon="/sun.svg" size="md">between</MazBtn>
<MazBtn block justify="space-around" icon="/users.svg" end-icon="/sun.svg" size="md">around</MazBtn>
<MazBtn block justify="space-evenly" icon="/users.svg" end-icon="/sun.svg" size="md">evenly</MazBtn>
```

  </template>

</ComponentDemo>

## Disabled

<ComponentDemo>
  <MazBtn disabled>disabled</MazBtn>

<template #code>

```html
<MazBtn disabled>disabled</MazBtn>
```

  </template>
</ComponentDemo>

## Icons

<ComponentDemo>
  <h4 class="maz:mb-2 maz:font-semibold maz:text-lg">
    Start Icon and End Icon
  </h4>

  <div class="maz:flex maz:gap-2 maz:rounded-md maz:flex-wrap maz:items-center">
    <MazBtn :start-icon="MazCheck" size="mini">
      start-icon
    </MazBtn>
    <MazBtn :start-icon="MazCheck" size="xs">
      start-icon
    </MazBtn>
    <MazBtn :start-icon="MazCheck" size="sm">
      start-icon
    </MazBtn>
    <MazBtn :end-icon="MazCheck" size="md">
      end-icon
    </MazBtn>
    <MazBtn :end-icon="MazCheck" size="lg">
      end-icon
    </MazBtn>
    <MazBtn :end-icon="MazCheck" size="xl">
      end-icon
    </MazBtn>
  </div>

  <h4 class="maz:my-2 maz:font-semibold maz:text-lg">
    Fab
  </h4>

  <div class="maz:flex maz:gap-2 maz:rounded-md maz:flex-wrap maz:items-center">
    <MazBtn fab :icon="MazCommandLine" size="mini" />
    <MazBtn fab :icon="MazCommandLine" size="xs" />
    <MazBtn fab :icon="MazCommandLine" size="sm" />
    <MazBtn fab :icon="MazCommandLine" size="md" />
    <MazBtn fab :icon="MazCommandLine" size="lg" />
    <MazBtn fab :icon="MazCommandLine" size="xl" />
  </div>

  <h4 class="maz:my-2 maz:font-semibold maz:text-lg">
    Icon component
  </h4>

  <div class="maz:flex maz:gap-2 maz:rounded-md maz:flex-wrap maz:items-center">
    <MazBtn :start-icon="MazSpinner" size="md" color="warning">
      icon component
    </MazBtn>
  </div>

<template #code>

```html
<MazBtn :start-icon="MazCheck" size="mini">
  start-icon
</MazBtn>
<MazBtn :start-icon="MazCheck" size="xs">
  start-icon
</MazBtn>
<MazBtn :start-icon="MazCheck" size="sm">
  start-icon
</MazBtn>
<MazBtn :start-icon="MazCheck" size="md">
  start-icon
</MazBtn>
<MazBtn :start-icon="MazCheck" size="lg">
  start-icon
</MazBtn>
<MazBtn :start-icon="MazCheck" size="xl">
  start-icon
</MazBtn>
<MazBtn fab :icon="MazCommandLine" size="lg" />
<MazBtn :start-icon="MazSpinner" size="sm" color="warning">
  icon component
</MazBtn>
```

  </template>
</ComponentDemo>

### Use icon path

::: details View code

When you use the properties `end-icon`, `start-icon` or `icon` with the icon path, the component uses `<MazIcon icon="..." />` component.

Check out how [MazIcon](./maz-icon.md) works, see all available icons and download them to put them in your public folder.

```html
<MazBtn start-icon="/check.svg" size="sm"> start-icon </MazBtn>
<MazBtn end-icon="/home.svg"> end-icon </MazBtn>
<MazBtn icon="/command-line.svg" fab size="lg" />
```

:::

### Use your own SVG icons

::: details View code

```html
<MazBtn size="sm">
  <template #start-icon>
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.5 12.75L10.5 18.75L19.5 5.25"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </template>
  start-icon
</MazBtn>
<MazBtn>
  <template #end-icon>
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.25 12L11.2045 3.04549C11.6438 2.60615 12.3562 2.60615 12.7955 3.04549L21.75 12M4.5 9.75V19.875C4.5 20.4963 5.00368 21 5.625 21H9.75V16.125C9.75 15.5037 10.2537 15 10.875 15H13.125C13.7463 15 14.25 15.5037 14.25 16.125V21H18.375C18.9963 21 19.5 20.4963 19.5 19.875V9.75M8.25 21H16.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </template>
  end-icon
</MazBtn>
<MazBtn fab size="lg">
  <template #icon>
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.75 7.5L9.75 9.75L6.75 12M11.25 12H14.25M5.25 20.25H18.75C19.9926 20.25 21 19.2426 21 18V6C21 4.75736 19.9926 3.75 18.75 3.75H5.25C4.00736 3.75 3 4.75736 3 6V18C3 19.2426 4.00736 20.25 5.25 20.25Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </template>
</MazBtn>
```

:::

### Use [@maz-ui/icons](./../guide/icons.md)

::: details View code

```vue
<script lang="ts" setup>
import MazBtn from 'maz-ui/components/MazBtn'

import { MazCheck } from '@maz-ui/icons/raw/MazCheck'
import { MazHome } from '@maz-ui/icons/raw/MazHome'
import { MazCommandLine } from '@maz-ui/icons/raw/MazCommandLine'
</script>

<template>
  <MazBtn :start-icon="MazCheck" size="sm">
    start-icon
  </MazBtn>
  <MazBtn :end-icon="MazHome">
    end-icon
  </MazBtn>
  <MazBtn fab :icon="MazCommandLine" size="lg" />
</template>
```

:::

### Use [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader)

::: details View code

```vue
<script lang="ts" setup>
import MazBtn from 'maz-ui/components/MazBtn'

import MazCheck from '@maz-ui/icons/svg/check.svg?component'
import MazHome from '@maz-ui/icons/svg/home.svg?component'
import MazCommandLine from '@maz-ui/icons/svg/command-line.svg?component'
</script>

<template>
  <MazBtn :start-icon="MazCheck" size="sm">
    start-icon
  </MazBtn>
  <MazBtn :end-icon="MazHome">
    end-icon
  </MazBtn>
  <MazBtn fab :icon="MazCommandLine" size="lg" />
</template>
```

:::

### Use your own components

::: details View code

```vue
<script lang="ts" setup>
import { MazBtn, MazSpinner } from 'maz-ui/components'
</script>

<template>
  <MazBtn :start-icon="MazSpinner" size="sm" color="info">
    start-icon
  </MazBtn>
</template>
```

:::

### Pass a full `MazIconProps` object

`startIcon`, `endIcon` and `icon` accept either a bare value (Vue component, URL, raw SVG string) **or** a full `MazIconProps` object. The latter is useful when you want to override the auto-derived size, set a `<title>` for screen readers, flip a directional icon for RTL, or attach extra SVG attributes.

::: details View code

```vue
<script lang="ts" setup>
import MazBtn from 'maz-ui/components/MazBtn'
import { MazStar } from '@maz-ui/icons/raw/MazStar'
</script>

<template>
  <!-- The button picks an icon size from its own size — `sm` defaults to a small icon. -->
  <MazBtn size="sm" :start-icon="MazStar">favorite</MazBtn>

  <!-- Pass an object to override per-icon. -->
  <MazBtn
    size="sm"
    :start-icon="{
      icon: MazStar,
      size: 'xl',
      title: 'Favorite',
      flipIconForRtl: true,
    }"
  >
    favorite
  </MazBtn>
</template>
```

:::

## [HTMLLinkElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement)

::: info
When `href` attribute is provided, the component automatically becomes a `<a href="..." />`
:::

<MazBtn href="https://www.google.com" target="_blank">Is Button Link</MazBtn>

```html
<MazBtn href="https://www.google.com" target="_blank"> Is Button Link </MazBtn>
```

## [RouterLink](https://router.vuejs.org/api/#router-link)

::: info
When `to` attribute is provided, the component automatically becomes a `<RouterLink to="..." />`
:::

<MazBtn :to="{ path: '/made-with-maz-ui.html' }">Is Router Link</MazBtn>

```html
<MazBtn :to="{ path: '/made-with-maz-ui.html' }"> Is RouterLink </MazBtn>
```

<script setup lang="ts">
  import { computed } from 'vue'
  import { MazCheck } from '@maz-ui/icons/raw/MazCheck'
  import { MazHome } from '@maz-ui/icons/raw/MazHome'
  import { MazCommandLine } from '@maz-ui/icons/raw/MazCommandLine'
  import MazSpinner from 'maz-ui/components/MazSpinner'

  const colors = [
    'primary',
    'secondary',
    'accent',
    'info',
    'success',
    'warning',
    'destructive',
    'contrast',
    'background',
    'transparent',
  ]

  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']

</script>

<!--@include: ./../../.vitepress/generated-docs/maz-btn.doc.md-->
