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

## Options

### Loading

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

### Sizes

::: tip
Use the attribute `size` with value **{{ sizes.join(', ') }}**
:::

<div class="flex items-start gap-05 items-center flex-wrap">
  <MazBtn v-for="size in sizes" :size="size">{{ size }}</MazBtn>
</div>

```vue
<template>
  <MazBtn v-for="size in sizes" :size="size">{{ size }}</MazBtn>
</template>

<script setup lang="ts">
  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>
```

### Colors

::: tip
Use the attribute `color` with a value in this [list](./../guide/colors.md), the component will use this color
:::

<div class="flex items-start gap-05 flex-wrap">
  <MazBtn v-for="color of colors" :key="color" :color="color">{{ color }}</MazBtn>
</div>

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

### Outline

<br />

<div class="flex items-start gap-05 flex-wrap">
  <MazBtn v-for="color of colors" :color="color" outline>{{ color }}</MazBtn>
</div>

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

### Pastel

::: tip
It's better in light mode
:::

<div class="flex items-start gap-05 rounded maz-p-3 flex-wrap">
  <MazBtn v-for="color of colors" :color="color" pastel>{{ color }}</MazBtn>
</div>

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

### Rounded

<br />

<MazBtn rounded>rounded</MazBtn>

```html
<MazBtn rounded>rounded</MazBtn>
```

### Fab

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

### Block

> Will take `width: 100%;`

<MazBtn block>block</MazBtn>

```html
<MazBtn block>block</MazBtn>
```

### Disabled

<br />

<MazBtn disabled>disabled</MazBtn>

```html
<MazBtn disabled>disabled</MazBtn>
```

### Icons

::: info
When you use `right-icon` or `left-icon`, the component uses [MazIcon](./maz-icon.md)
:::

<div class="flex items-start gap-05 rounded flex-wrap">
  <MazBtn left-icon="check" size="sm">
    left-icon
  </MazBtn>
  <MazBtn right-icon="home">
    right-icon
  </MazBtn>
  <MazBtn left-icon="command-line" right-icon="trash" size="lg">
    left-right-icon
  </MazBtn>
</div>

```html
<MazBtn left-icon="check" size="sm">
  left-icon
</MazBtn>
<MazBtn right-icon="home">
  right-icon
</MazBtn>
<MazBtn left-icon="command-line" right-icon="trash" size="lg">
  left-right-icon
</MazBtn>
```

Use your own icons

<div class="flex items-start gap-05 rounded flex-wrap">
  <MazBtn>
    <template #left-icon>
      <MazIcon name="check" />
    </template>
    left-icon
  </MazBtn>
  <MazBtn>
    <template #right-icon>
      <MazIcon name="home" />
    </template>
    right-icon
  </MazBtn>
  <MazBtn>
    <template #left-icon>
      <MazIcon name="command-line" />
    </template>
    right-icon
    <template #right-icon>
      <MazIcon name="information-circle" />
    </template>
  </MazBtn>
</div>

```html
<MazBtn>
  <template #left-icon>
    <MazIcon name="check" />
  </template>
  left-icon
</MazBtn>
<MazBtn>
  <template #right-icon>
    <MazIcon name="home" />
  </template>
  right-icon
</MazBtn>
<MazBtn>
  <template #left-icon>
    <MazIcon name="command-line" />
  </template>
  right-icon
  <template #right-icon>
    <MazIcon name="information-circle" />
  </template>
</MazBtn>
```

### Link

::: tip
With the attribute `variant="link"`, the button looks like a link but it's a button, so you can use the event `@click`

Additional props available include: `no-underline` & `no-leading`
:::

<MazBtn variant="link" @click="$emit('click')">Is Link</MazBtn>
<MazBtn variant="link" @click="$emit('click')" no-underline>Is Link</MazBtn>
<MazBtn variant="link" @click="$emit('click')" no-leading>Is Link</MazBtn>

```html
<MazBtn variant="link" @click="$emit('click')">Is Link</MazBtn>
<MazBtn variant="link" @click="$emit('click')" no-underline>Is Link</MazBtn>
<MazBtn variant="link" @click="$emit('click')" no-leading>Is Link</MazBtn>
```

### [HTMLLinkElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement)

::: info
When `href` attribute is provided, the component automatically becomes a `<a href="..." />`
:::

<MazBtn href="https://www.google.com" target="_blank">Is Button Link</MazBtn>

```html
<MazBtn href="https://www.google.com" target="_blank">
  Is Button Link
</MazBtn>
```

### [RouterLink](https://router.vuejs.org/api/#router-link)

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
</script>

<!--@include: ./../.vitepress/generated-docs/maz-btn.doc.md-->