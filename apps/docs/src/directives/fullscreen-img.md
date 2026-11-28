---
title: vFullscreenImg
description: vFullscreenImg is a Vue directive that opens an image in a full-screen viewer. The image grows from its thumbnail, with zoom, swipe, keyboard navigation and groups of images
---


# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

The image grows from its thumbnail and goes back to it. The thumbnail is a button for the keyboard: `Enter` or `Space` opens it.

<div class="vp-raw">
<img
  v-fullscreen-img
  src="https://picsum.photos/id/1015/1000/500"
  alt="A river between mountains"
/>
</div>

```vue
<template>
  <img
    v-fullscreen-img
    src="https://picsum.photos/id/1015/1000/500"
    alt="A river between mountains"
  />
</template>

<script setup lang="ts">
  import { vFullscreenImg } from 'maz-ui/directives/vFullscreenImg'
</script>
```

The viewer ([MazLightbox](./../components/maz-lightbox.md)) is loaded on the first click, not before.

## Groups

The images of the same container are browsed together: arrows (or swipe), counter, caption.

<div class="vp-raw maz:flex maz:gap-2">
  <img
    v-for="id in [1015, 1016, 1018]"
    :key="id"
    v-fullscreen-img="{ src: `https://picsum.photos/id/${id}/1200/800`, alt: `Photo ${id}` }"
    :src="`https://picsum.photos/id/${id}/300/200`"
    :alt="`Photo ${id}`"
    class="maz:h-24 maz:rounded-md"
  />
</div>

```html
<div>
  <img v-fullscreen-img="{ src: '/photos/1.jpg' }" src="/thumbs/1.jpg" alt="First" />
  <img v-fullscreen-img="{ src: '/photos/2.jpg' }" src="/thumbs/2.jpg" alt="Second" />
</div>
```

The group is, in this order:

1. the images with the same `group` name, wherever they are;
2. the images inside the closest ancestor with the attribute `data-maz-lightbox-group`;
3. the images that share the same parent element.

```html
<div data-maz-lightbox-group>
  <figure><img v-fullscreen-img="'/photos/1.jpg'" src="/thumbs/1.jpg" /></figure>
  <figure><img v-fullscreen-img="'/photos/2.jpg'" src="/thumbs/2.jpg" /></figure>
</div>

<img v-fullscreen-img="{ src: '/photos/3.jpg', group: 'trip' }" src="/thumbs/3.jpg" />
<img v-fullscreen-img="{ src: '/photos/4.jpg', group: 'trip' }" src="/thumbs/4.jpg" />
```

## High resolution and caption

`src` is shown first, `fullSrc` replaces it once loaded. The caption is `caption`, or the `alt`.

```html
<img
  v-fullscreen-img="{ src: '/photo-1200.jpg', fullSrc: '/photo-4000.jpg', caption: 'Lake at dawn' }"
  src="/thumb.jpg"
  alt="A lake"
/>
```

## Hover effects

`scaleOnHover` and `blurOnHover` use classes and the theme motion, not inline styles.

<img
  v-fullscreen-img="{
    scaleOnHover: true,
    blurOnHover: true,
  }"
  src="https://picsum.photos/id/1016/1000/600"
  alt="A canyon"
/>

```html
<img
  v-fullscreen-img="{
    scaleOnHover: true,
    blurOnHover: true,
  }"
  src="/photo.jpg"
/>
```

## On custom element

<div class="vp-raw">
<MazBtn
  v-fullscreen-img="'https://picsum.photos/id/1018/1000/700'"
>
  Click me to show image
</MazBtn>
</div>

```html
<MazBtn
  v-fullscreen-img="'/photo.jpg'"
>
  Click me to show image
</MazBtn>
```

## Options

| Option | Default | Description |
| --- | --- | --- |
| `src` | `src` attribute | Image shown in the viewer |
| `alt` | `alt` attribute | Alternative text, and caption when there is no `caption` |
| `caption` | | Text under the image |
| `fullSrc` | | High-resolution image, swapped in when loaded |
| `group` | | Name of the group |
| `zoom` | `true` | Zoom on click, pinch and keys |
| `offset` | `80` | Margin around the image in px |
| `animation` | theme tokens | `{ duration, easing }` of the grow from the thumbnail |
| `scaleOnHover`, `blurOnHover` | `false` | Hover effects |
| `disabled` | `false` | Turn the directive off |

## Motion

The image grows from the thumbnail with the duration and the easing of the theme (`--maz-motion-normal`, `--maz-easing-out`), and goes back into it, even if the page scrolled. Reduced motion gives a short fade. See [MazLightbox](./../components/maz-lightbox.md#motion).

## Global install

### Vue

`main.ts`

```ts
import { createApp } from 'vue'
import { vFullscreenImgInstall } from 'maz-ui/directives/vFullscreenImg'

const app = createApp(App)

app.use(vFullscreenImgInstall)

app.mount('#app')
```

### Nuxt

Please refer to the [Nuxt module documentation](./../ecosystem/nuxt.md) for more information.

## Types

```ts
interface VFullscreenImgOptions {
  disabled?: boolean
  scaleOnHover?: boolean
  blurOnHover?: boolean
  zoom?: boolean
  offset?: number
  animation?: { duration?: number, easing?: string }
  group?: string
  caption?: string
  fullSrc?: string
}

interface VFullscreenImgBindingOptions extends VFullscreenImgOptions {
  src: string
  alt?: string | null
}

type VFullscreenImgBindingValue = string | VFullscreenImgBindingOptions | undefined
```

<script setup lang="ts">
  import { vFullscreenImg } from 'maz-ui/directives/vFullscreenImg'
</script>
