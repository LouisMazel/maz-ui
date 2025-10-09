---
title: MazIcon
description: MazIcon is a standalone component to load your svg files
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip
  Download icons pack [here](#get-icons-pack)
:::

## How to use?

**2 ways to use this component:**

- Use a component (like `MazStar` exported from `@maz-ui/icons`) with `icon` prop
- Use a name (like `academic-cap`) with `name` prop or `src` prop (e.g: `src="/path/icon.svg"`)

## Example

- Basically, this component will render your SVG from your project.
- The component will fetch the SVG from the `public` folder and parse it to render it.
- Place your SVG files in a public folder (default `/icons`, use `path` prop to change it)

## Icon Component

`icon` is the icon component to render - e.g: `import { MazStar } from '@maz-ui/icons'`

Can be custom component from your stack - e.g: `import ComponentIcon from './path_to_your/ComponentIcon.vue'`

<ComponentDemo>

  <MazIcon :icon="icons.MazStar" />

  <template #code>

```vue
<script lang="ts" setup>
  import { MazStar } from '@maz-ui/icons'
</script>

<template>
  <MazIcon :icon="MazStar" />
</template>
```

  </template>
</ComponentDemo>

## Path + Name

- `name` is the SVG file name without extension
- `path` should be the folder where your svg files are stored in your public assets. Can be gloablly provided by using `mazIconPath` - [follow this documentation](#options)

<ComponentDemo>

  <MazIcon name="academic-cap" path="/icons" />

  <template #code>

```html
<MazIcon name="academic-cap" path="/icons" />
```

  </template>
</ComponentDemo>

## Src

Provide the full src path to the icon

<ComponentDemo>

  <MazIcon src="/icons/academic-cap.svg" />

  <template #code>

```html
<MazIcon src="/icons/academic-cap.svg" />
```

  </template>
</ComponentDemo>

## Sizing

### Predefined sizes

Can be `xs`, `sm`, `md`, `lg`, `xl`

<ComponentDemo>
  <div class="maz-flex maz-gap-2 maz-flex-wrap maz-items-center">
    <MazIcon v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" :size="size" :icon="icons.MazStar" />
  </div>

  <template #code>

```vue
<script lang="ts" setup>
  import { MazStar } from '@maz-ui/icons'
</script>

<template>
  <MazIcon v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" :size="size" :icon="MazStar" />
</template>
```

  </template>
</ComponentDemo>

### Custom size

Can be any valid CSS size - e.g: `1em`, `1rem`, `10px`, `100%`, `10vw`, `10vh`

Allowed units: `px`, `em`, `rem`, `%`, `vw`, `vh`, `cm`, `mm`, `in`, `pt`, `pc`, `ex`

<ComponentDemo>
  <div class="maz-flex maz-gap-2 maz-flex-wrap maz-items-center">
    <MazIcon size="0.5em" :icon="icons.MazStar" />
    <MazIcon size="1em" :icon="icons.MazStar" />
    <MazIcon size="24px" :icon="icons.MazStar" />
    <MazIcon size="4rem" :icon="icons.MazStar" />
    <MazIcon size="8rem" :icon="icons.MazStar" />
  </div>

  <template #code>

```vue
<script lang="ts" setup>
  import { MazStar } from '@maz-ui/icons'
</script>

<template>
  <MazIcon size="0.5em" :icon="icons.MazStar" />
  <MazIcon size="1em" :icon="icons.MazStar" />
  <MazIcon size="24px" :icon="icons.MazStar" />
  <MazIcon size="4rem" :icon="icons.MazStar" />
  <MazIcon size="8rem" :icon="icons.MazStar" />
</template>
```

  </template>
</ComponentDemo>

## Options

### Set MazIcon path globally

```typescript
import { createApp } from 'vue'
const app = createApp(App)

app.provide('mazIconPath', '/your/custom/path')
```

## All icons

### Get Icons Pack

This pack is the Heroicons icons set with some others from maz-ui

<MazBtn download href="/icons/_icons.zip" right-icon="arrow-down-tray">
  Download pack
</MazBtn>

Source: [Hericons](https://heroicons.com/)

You can also find icons in the [icon set page](./../guide/icon-set.md)

<div class="flex items-start flex-wrap gap-05">
  <div v-for="({ component, name }, i) in iconsList" :key="i" class="flex flex-col flex-center maz-p-2 maz-rounded maz-border">
    <MazIcon :icon="component" size="lg" />
    <span style="font-size: 11px;">
      {{ name }}
    </span>
  </div>
</div>

<script setup lang="ts">
  import * as icons from '@maz-ui/icons'

  const iconsList = Object.entries(icons).map(([key, value]) => ({
    name: key,
    component: value,
  }))
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-icon.doc.md-->
