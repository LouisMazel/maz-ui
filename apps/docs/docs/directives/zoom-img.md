---
title: vZoomImg
description: vZoomImg is a Vue 3 directive to enlarge an image like a modal on click, if you have several images, you can pass them like a carousel
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

> Can be mixed with [vLazyImg](./lazy-img.md) directive

## Basic usage

> Click on the photo

<MazCard overflow-hidden>
  <img
    src="https://loremflickr.com/1500/1000"
    v-zoom-img="{ src: 'https://loremflickr.com/1500/1000' }"
  />
</MazCard>
<br />
<br />
<MazBtn v-zoom-img="{ src: 'https://loremflickr.com/1000/500' }">
  Show photo
</MazBtn>

```vue
<script lang="ts" setup>
import { vZoomImg } from 'maz-ui/directives'
</script>

<template>
  <MazCard overflow-hidden>
    <img
      v-zoom-img="{ src: 'https://loremflickr.com/1500/1000' }"
      src="https://loremflickr.com/1500/1000"
    >
  </MazCard>

  <MazBtn v-zoom-img="{ src: 'https://loremflickr.com/1000/500' }">
    Show photo
  </MazBtn>
</template>
```

## Options

<br />

<MazCard overflow-hidden>
  <img
    src="https://loremflickr.com/1200/800"
    v-zoom-img="zoomImgBinding"
  />
</MazCard>

<script lang="ts" setup>
  import { vZoomImg } from 'maz-ui/src/directives/vZoomImg'

  const zoomImgBinding: vZoomImgBinding = {
    src: 'https://loremflickr.com/1200/800',
    alt: 'alt image',
    blur: false,
    scale: false,
    disabled: false
  }
</script>

```vue
<script lang="ts" setup>
import { vZoomImg, type vZoomImgBindingValue } from 'maz-ui/directives'

const zoomImgBinding: vZoomImgBindingValue = {
  src: 'https://loremflickr.com/1200/800',
  alt: 'alt image', // will be set on the zoomed image
  blur: false,
  scale: false,
  disabled: false
}
</script>

<template>
  <MazCard overflow-hidden>
    <img
      v-zoom-img="zoomImgBinding"
      src="https://loremflickr.com/1200/800"
    >
  </MazCard>
</template>
```

## Global install

`main.ts`

```typescript
import { vZoomImgInstall, type vZoomImgOptions } from 'maz-ui/directives'
import { createApp } from 'vue'

const app = createApp(App)

app.use(vZoomImgInstall)

app.mount('#app')
```

## Types

```ts
export interface vZoomImgOptions {
  disabled?: boolean
  scale?: boolean
  blur?: boolean
}

interface vZoomImgBindingOptions extends vZoomImgOptions {
  src: string
  alt?: string
}

export type vZoomImgBindingValue = string | vZoomImgBindingOptions
```
