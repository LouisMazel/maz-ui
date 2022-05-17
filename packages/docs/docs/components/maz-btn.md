---
title: MazBtn
description: MazBtn is a stand-alone component replaces the standard html button with a beautiful design system. Many options like colors, sizes, disabled state, loading state, includes icons. Support of router-link and nuxt-link
---

# MazBtn

> Before you have to import the global css files in your project, follow instructions in [Getting Started](/maz-ui-3/guide/getting-started.html)

## Basic usage

<br />

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

<MazBtn loading>Button</MazBtn>

```vue
<template>
  <MazBtn loading>Button</MazBtn>
</template>
```

### Sizes

> Use the attribute `size` with a value in **{{ sizes.join(', ') }}**

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

> Use the attribute `color` with a value in this [list](/maz-ui-3/guide/colors.html), the component will use this color

<div class="flex items-start gap-05 flex-wrap">
  <MazBtn v-for="{ name } in colorsArray" :color="name">{{ name }}</MazBtn>
</div>

```vue
<template>
  <MazBtn>primary</MazBtn>
  <MazBtn color="secondary">secondary</MazBtn>
  <MazBtn color="info">info</MazBtn>
  <MazBtn color="success">success</MazBtn>
  <MazBtn color="warning">warning</MazBtn>
  <MazBtn color="danger">danger</MazBtn>
  <MazBtn color="white">white</MazBtn>
  <MazBtn color="black">black</MazBtn>
  <MazBtn color="transparent">transparent</MazBtn>
</template>
```

### Outline

<br />

<div class="flex items-start gap-05 flex-wrap">
  <MazBtn v-for="{ name } in colorsArray" :color="name" outline>{{ name }}</MazBtn>
</div>

```vue
<template>
  <MazBtn outline>primary</MazBtn>
  <MazBtn color="secondary" outline>secondary</MazBtn>
  <MazBtn color="info" outline>info</MazBtn>
  <MazBtn color="success" outline>success</MazBtn>
  <MazBtn color="warning" outline>warning</MazBtn>
  <MazBtn color="danger" outline>danger</MazBtn>
  <MazBtn color="white" outline>white</MazBtn>
  <MazBtn color="black" outline>black</MazBtn>
  <MazBtn color="transparent" outline>transparent</MazBtn>
</template>
```

### Pastel

> It's better in light mode

<br />

<div class="flex items-start gap-05 rounded maz-p-3 flex-wrap">
  <MazBtn v-for="{ name } in colorsArray" :color="name" pastel>{{ name }}</MazBtn>
</div>

```vue
<template>
  <MazBtn pastel>primary</MazBtn>
  <MazBtn color="secondary" pastel>secondary</MazBtn>
  <MazBtn color="info" pastel>info</MazBtn>
  <MazBtn color="success" pastel>success</MazBtn>
  <MazBtn color="warning" pastel>warning</MazBtn>
  <MazBtn color="danger" pastel>danger</MazBtn>
  <MazBtn color="white" pastel>white</MazBtn>
  <MazBtn color="black" pastel>black</MazBtn>
  <MazBtn color="transparent" pastel>transparent</MazBtn>
</template>
```

### Rounded

> Rounded button

<MazBtn rounded>rounded</MazBtn>

```vue
<template>
  <MazBtn rounded>rounded</MazBtn>
</template>
```

### Fab

> Round button

<MazBtn fab>fab</MazBtn>

```vue
<template>
  <MazBtn fab>fab</MazBtn>
</template>
```

### Block

> Will take `width: 100%;`

<MazBtn block>block</MazBtn>

```vue
<template>
  <MazBtn block>block</MazBtn>
</template>
```

### Disabled

<br />

<MazBtn disabled>disabled</MazBtn>

```vue
<template>
  <MazBtn disabled>disabled</MazBtn>
</template>
```

### Icons

> When you use `right-icon` or `left-icon`, the component use [MazIcon](/maz-ui-3/components/maz-icon.html)

<div class="flex items-start gap-05 rounded flex-wrap">
  <MazBtn left-icon="check">
    left-icon
  </MazBtn>
  <MazBtn right-icon="home">
    right-icon
  </MazBtn>
  <MazBtn left-icon="terminal" right-icon="trash">
    left-right-icon
  </MazBtn>
</div>

```vue
<template>
  <MazBtn left-icon="check">
    left-icon
  </MazBtn>
  <MazBtn right-icon="home">
    right-icon
  </MazBtn>
  <MazBtn left-icon="terminal" right-icon="trash">
    left-right-icon
  </MazBtn>
</template>
```

> Use your own icons

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
      <MazIcon name="terminal" />
    </template>
    right-icon
    <template #right-icon>
      <MazIcon name="information-circle" />
    </template>
  </MazBtn>
</div>

```vue
<template>
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
      <MazIcon name="terminal" />
    </template>
    right-icon
    <template #right-icon>
      <MazIcon name="information-circle" />
    </template>
  </MazBtn>
</template>
```

### Link

> With the attribute `variant="link"`, the button looks like a link but it's a button, so you can use the event `@click`
<br />
> Additional prop available `no-underline` & `no-leading`

<MazBtn variant="link" @click="$emit('click')">Is Link</MazBtn>
<MazBtn variant="link" @click="$emit('click')" no-underline>Is Link</MazBtn>
<MazBtn variant="link" @click="$emit('click')" no-leading>Is Link</MazBtn>

```vue
<template>
  <MazBtn variant="link" @click="$emit('click')">Is Link</MazBtn>
  <MazBtn variant="link" @click="$emit('click')" no-underline>Is Link</MazBtn>
  <MazBtn variant="link" @click="$emit('click')" no-leading>Is Link</MazBtn>
</template>
```

### [HTMLLinkElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement)

> When `href` attribute is provided, the component automatically becomes a `<a href="..." />`

<MazBtn href="https://www.google.com" target="_blank">Is Button Link</MazBtn>

```vue
<template>
  <MazBtn href="https://www.google.com" target="_blank">
    Is Button Link
  </MazBtn>
</template>
```

### [RouterLink](https://router.vuejs.org/api/#router-link)

> When `to` attribute is provided, the component automatically becomes a `<RouterLink to="..." />`

<MazBtn :to="{ path: '/made-with-maz-ui.html' }">Is Router Link</MazBtn>

```vue
<template>
  <MazBtn :to="{ path: '/made-with-maz-ui.html' }">
    Is RouterLink
  </MazBtn>
</template>
```

## Props & Events emitted

<ComponentPropDoc component="MazBtn" />

<script setup lang="ts">
  import { computed } from 'vue'

  const colors = {
    primary: { name: 'primary', hex: '#1e90ff' },
    secondary: { name: 'secondary', hex: '#1cd1a1' },
    info: { name: 'info', hex: '#17a2b8' },
    success: { name: 'success', hex: '#9acd32' },
    warning: { name: 'warning', hex: '#fcb731' },
    danger: { name: 'danger', hex: '#ff6d6a' },
    white: { name: 'white', hex: '#fff' },
    black: { name: 'black', hex: '#000' },
    transparent: { name: 'transparent', hex: 'transparent' },
  }

  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']

  const colorsArray = computed(() => Object.values(colors))
</script>
