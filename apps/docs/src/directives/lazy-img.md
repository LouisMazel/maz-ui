---
title: vLazyImg
description: vLazyImg is a Vue directive to lazy load images with many options. Images are loaded when they enter the viewport, using a shared IntersectionObserver for optimal performance.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip Performance
Every element bound to the directive shares a pooled `IntersectionObserver` (grouped by observer options) and keeps its state per element. You can render hundreds of lazy images - like a list of [`MazAvatar`](./../components/maz-avatar.md) - with only a handful of observers and no leak when elements unmount.
:::

## Basic usage

<img
  alt="Lazy loaded image"
  style="background-color: var(--maz-surface-300); width: 80%;"
  class="flex flex-center rounded"
  v-lazy-img="'https://placedog.net/1500/1000'"
/>

```vue
<script lang="ts" setup>
import { vLazyImg } from 'maz-ui/directives'
</script>

<template>
  <img
    v-lazy-img="'https://placedog.net/1500/1000'"
    style="background-color: var(--maz-surface-300); width: 80%;"
    class="flex flex-center rounded"
  >
</template>
```

## Use background image

> Instead of `v-lazy-img` use `v-lazy-img:bg-image`

<div
  style="height: 200px; width: 100%; background-size: contain;"
  class="flex flex-center rounded"
  v-lazy-img:bg-image="'https://placedog.net/1500/1000'"
/>

```vue
<template>
  <div
    v-lazy-img:bg-image="'https://placedog.net/1500/1000'"
    style="height: 200px; width: 100%; background-size: contain;"
    class="flex flex-center rounded"
  />
</template>
```

## Disable lazy loading

Set `disabled: true` to load the image immediately, bypassing the `IntersectionObserver`. Useful for above-the-fold images or server-side rendering.

```vue
<template>
  <img
    v-lazy-img="{ src: 'https://placedog.net/1500/1000', disabled: true }"
  >
</template>
```

## Fallback image on error

Provide a `fallbackSrc` to replace the image when it fails to load. Set `fallbackSrc: false` to keep the broken image instead of loading the default placeholder.

<img class="maz:size-40" v-lazy-img="{ src: 'https://broken-link.example' }" alt="broken image" />

```vue
<template>
  <img
    v-lazy-img="{
      src: 'https://broken-link.example',
      fallbackSrc: '/images/fallback.png',
    }"
  >
</template>
```

## Options

> Open the developer console to show logs

<img
  alt="Lazy loaded image with options"
  style="background-color: var(--maz-surface-300); width: 80%;"
  class="flex flex-center rounded"
  v-lazy-img="lazyBinding"
/>

```vue
<script lang="ts" setup>
import { vLazyImg, type vLazyImgBindingValue } from 'maz-ui/directives'

const lazyBinding: vLazyImgBindingValue = {
  src: 'https://placedog.net/1500/1000',
  baseClass: 'custom-class',
  loadingClass: 'custom-class-loading',
  loadedClass: 'custom-class-loaded',
  errorClass: 'custom-class-error',
  fallbackClass: 'custom-class-fallback',
  observerOnce: false, // run onIntersecting each time the user scrolls onto the image
  loadOnce: false,
  onLoading: (el: Element) => console.log('loading', el),
  onLoaded: (el: Element) => console.log('loaded', el),
  onError: (el: Element) => console.log('error', el),
  onIntersecting: (el: Element) => console.log('intersecting', el),
}
</script>

<template>
  <img
    v-lazy-img="lazyBinding"
    style="background-color: var(--maz-surface-300); width: 80%;"
    class="flex flex-center rounded"
  >
</template>
```

## Global install

### Vue

```typescript
import { vLazyImgInstall, type vLazyImgOptions } from 'maz-ui/directives'
import { createApp } from 'vue'

const app = createApp(App)

// all options (optional)
const vLazyImgOptions: vLazyImgOptions = {
  baseClass: 'm-lazy-img',
  loadedClass: 'm-lazy-loaded',
  loadingClass: 'm-lazy-loading',
  errorClass: 'm-lazy-error',
  fallbackClass: 'm-lazy-fallback',
  observerOnce: true,
  loadOnce: true,
  observerOptions: {
    root: undefined,
    rootMargin: undefined,
    threshold: 0.1,
  },
  fallbackSrc: '/images/fallback.png', // or `false` to disable the default placeholder
  onLoading: (el: Element) => console.log('loading', el),
  onLoaded: (el: Element) => console.log('loaded', el),
  onError: (el: Element) => console.log('error', el),
  onIntersecting: (el: Element) => console.log('intersecting', el),
}

app.use(vLazyImgInstall, vLazyImgOptions)

app.mount('#app')
```

### Nuxt

Please refer to the [Nuxt module documentation](./../ecosystem/nuxt.md) for more information.

## Types

```ts
export interface vLazyImgOptions {
  baseClass?: string
  loadingClass?: string
  loadedClass?: string
  errorClass?: string
  fallbackClass?: string
  observerOnce?: boolean
  loadOnce?: boolean
  observerOptions?: {
    root?: HTMLElement | null
    threshold: number
    rootMargin?: string
  }
  /** Image loaded on error - set to `false` to keep the broken image */
  fallbackSrc?: string | false
  onLoading?: (el: Element) => unknown
  onLoaded?: (el: Element) => unknown
  onError?: (el: Element) => unknown
  onIntersecting?: (el: Element) => unknown
}

interface vLazyImgBindingOptions extends vLazyImgOptions {
  /** The source of the image when the binding value is an options object */
  src?: string
  /** Load the image immediately, bypassing the IntersectionObserver */
  disabled?: boolean
}

export type vLazyImgBindingValue = string | vLazyImgBindingOptions
```

<script lang="ts" setup>
  import { vLazyImg, type vLazyImgBindingValue } from 'maz-ui/directives/vLazyImg'

  const lazyBinding: vLazyImgBindingValue = {
    src: 'https://placedog.net/1500/1000',
    baseClass: 'custom-class',
    loadingClass: 'custom-class-loading',
    loadedClass: 'custom-class-loaded',
    errorClass: 'custom-class-error',
    fallbackClass: 'custom-class-fallback',
    observerOnce: false,
    loadOnce: true,
    onLoading: (el: Element) => console.log('loading', el),
    onLoaded: (el: Element) => console.log('loaded', el),
    onError: (el: Element) => console.log('error', el),
    onIntersecting: (el: Element) => console.log('intersecting', el),
  }
</script>
