---
title: MazBtn
description: MazBtn is a standalone component that replaces the standard html button with a beautiful design system. Many options like colors, sizes, disabled state, loading state, icons are included. Support of router-link and nuxt-link
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo expanded>
  <MazBtn>Button</MazBtn>

  <template #code>

  ```vue
  <template>
    <MazBtn>Button</MazBtn>
  </template>

  <script setup lang="ts">
    import { MazBtn } from 'maz-ui/components'
  </script>
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
  <template>
    <MazBtn v-for="size in sizes" :size="size">{{ size }}</MazBtn>
  </template>

  <script setup lang="ts">
    const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
  </script>
  ```

  </template>
</ComponentDemo>

## Colors

Use the attribute `color` with a value in this [list](./../guide/colors.md), the component will use this color

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
<MazBtn color="danger">danger</MazBtn>
<MazBtn color="white">white</MazBtn>
<MazBtn color="black">black</MazBtn>
<MazBtn color="transparent">transparent</MazBtn>
```

  </template>
</ComponentDemo>

## Outline

Transform the button into an outline button with the attribute `outline`

<ComponentDemo>
<div class="flex items-start gap-05 flex-wrap">
  <MazBtn v-for="color of colors" :color="color" outline>{{ color }}</MazBtn>
</div>

<template #code>

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

  </template>
</ComponentDemo>

## Loading

The loading state is available with the attribute `loading`

<ComponentDemo>
  <div class="flex items-start gap-05 flex-wrap">
    <div v-for="color of colors"
        :key="color" class="maz-flex maz-flex-col maz-flex-center">
      <MazBtn
        loading
        :color="color"
        left-icon="user"
        right-icon="user"
      >
        {{ color }}
      </MazBtn>
      <span class="maz-text-muted maz-text-xs"> {{ color }} </span>
    </div>
  </div>

  <template #code>

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

  </template>
</ComponentDemo>

## Pastel

The pastel state is available with the attribute `pastel`

::: info
It's better in light mode
:::

<ComponentDemo>

  <div class="flex items-start gap-05 rounded maz-p-3 flex-wrap">
    <MazBtn v-for="color of colors" :color="color" pastel>{{ color }}</MazBtn>
  </div>

  <template #code>

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

  </template>
</ComponentDemo>

## Rounded Size

Choose the size of the rounded with the attribute `rounded-size` and value `none`, `sm`, `md`, `lg`, `xl`, `full`

<ComponentDemo>

  <div class="flex items-start gap-05 rounded maz-p-3 flex-wrap">
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

  <template #code>

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
  <div class="maz-flex maz-flex-col maz-gap-2">
    <MazBtn block justify="center" icon="users" right-icon="sun" size="md">center</MazBtn>
    <MazBtn block justify="start" icon="users" right-icon="sun" size="md">start</MazBtn>
    <MazBtn block justify="end" icon="users" right-icon="sun" size="md">end</MazBtn>
    <MazBtn block justify="space-between" icon="users" right-icon="sun" size="md">between</MazBtn>
    <MazBtn block justify="space-around" icon="users" right-icon="sun" size="md">around</MazBtn>
    <MazBtn block justify="space-evenly" icon="users" right-icon="sun" size="md">evenly</MazBtn>
  </div>

  <template #code>

  ```html
  <MazBtn block justify="center" icon="users" right-icon="sun" size="md">center</MazBtn>
  <MazBtn block justify="start" icon="users" right-icon="sun" size="md">start</MazBtn>
  <MazBtn block justify="end" icon="users" right-icon="sun" size="md">end</MazBtn>
  <MazBtn block justify="space-between" icon="users" right-icon="sun" size="md">between</MazBtn>
  <MazBtn block justify="space-around" icon="users" right-icon="sun" size="md">around</MazBtn>
  <MazBtn block justify="space-evenly" icon="users" right-icon="sun" size="md">evenly</MazBtn>
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
  <div class="maz-flex maz-gap-2 maz-rounded maz-flex-wrap maz-items-center">
    <MazBtn :left-icon="CheckIcon" size="sm">
      left-icon
    </MazBtn>
    <MazBtn :right-icon="HomeIcon">
      right-icon
    </MazBtn>
    <MazBtn fab :icon="CommandLineIcon" size="lg" />
  </div>

  <template #code>

  ```html
  <MazBtn left-icon="check" size="sm">
    left-icon
  </MazBtn>
  <MazBtn right-icon="home">
    right-icon
  </MazBtn>
  <MazBtn icon="command-line" fab size="lg" />
  ```

  </template>
</ComponentDemo>

### Use icon name

::: details View code

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

::: details View code

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

::: details View code

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
  import { MazBtn } from 'maz-ui/components'

  import CheckIcon from 'maz-ui/icons/check.svg'
  import HomeIcon from 'maz-ui/icons/home.svg'
  import CommandLineIcon from 'maz-ui/icons/command-line.svg'
</script>
```

:::

### Use your own components

::: details View code

<MazBtn :left-icon="MazSpinner" size="sm" color="theme">
  left-icon
</MazBtn>

```vue
<template>
  <MazBtn :left-icon="MazSpinner" size="sm" color="info">
    left-icon
  </MazBtn>
</template>

<script lang="ts" setup>
  import { MazBtn, MazSpinner } from 'maz-ui/components'
</script>
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
  import { MazSpinner } from 'maz-ui/src/components/index'

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