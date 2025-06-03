---
title: vLazyImg
description: vLazyImg is a Vue 3 directive to lazy load images with many options. The image will be loaded on user's scroll
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

<img
  style="background-color: var(--maz-color-bg-lighter); width: 80%;"
  class="flex flex-center rounded"
  v-lazy-img="'https://loremflickr.com/1500/1000'"
/>

```vue
<template>
  <img
    style="background-color: var(--maz-color-bg-lighter); width: 80%;"
    class="flex flex-center rounded"
    v-lazy-img="'https://loremflickr.com/1500/1000'"
  />
</template>

<script lang="ts" setup>
  import { vLazyImg } from 'maz-ui'
</script>
```

## Use background image

> Instead of `v-lazy-img` use `v-lazy-img:bg-image`

<div
  style="height: 200px; width: 100%; background-size: contain;"
  class="flex flex-center rounded"
  v-lazy-img:bg-image="'https://loremflickr.com/1500/1000'"
/>

```vue
<template>
  <div
    style="height: 200px; width: 100%; background-size: contain;"
    class="flex flex-center rounded"
    v-lazy-img:bg-image="'https://loremflickr.com/1500/1000'"
  />
</template>
```

## Options

> Open the developer console to show logs

<img
  style="background-color: var(--maz-color-bg-lighter); width: 80%;"
  class="flex flex-center rounded"
  v-lazy-img="lazyBinding"
/>

```vue
<template>
  <img
    style="background-color: var(--maz-color-bg-lighter); width: 80%;"
    class="flex flex-center rounded"
    v-lazy-img="lazyBinding"
  />
</template>

<script lang="ts" setup>
  import { vLazyImg, vLazyImgBindingValue } from 'maz-ui'
  import { ref } from 'vue'

  const lazyBinding: vLazyImgBindingValue = {
    src: 'https://loremflickr.com/1500/1000',
    baseClass: 'custom-class',
    loadingClass: 'custom-class-loading',
    loadedClass: 'custom-class-loaded',
    errorClass: 'custom-class-error',
    noPhotoClass: 'custom-class-no-photo',
    observerOnce: false, // launch onIntersecting function each times where the user scrolls on the image
    loadOnce: false,
    onLoading: (el: Element) => console.log('loading', el),
    onLoaded: (el: Element) => console.log('loaded', el),
    onError: (el: Element) => console.log('error', el),
    onIntersecting: (el: Element) => console.log('intersecting', el),
  }
</script>
```

## Global install

`main.ts`

```typescript
import { createApp } from 'vue'
import { vLazyImgInstall, vLazyImgOptions } from 'maz-ui'
import errorPhoto from 'path/to/error-photo.png'

const app = createApp(App)

// all options (optional)
const vLazyImgOptions: vLazyImgOptions = {
  baseClass: 'm-lazy-img',
  loadedClass: 'm-lazy-loaded',
  loadingClass: 'm-lazy-loading',
  errorClass: 'm-lazy-error',
  noPhotoClass: 'm-lazy-no-photo',
  noPhoto: false,
  observerOnce: true,
  loadOnce: true,
  noUseErrorPhoto: false,
  observerOptions: {
    root: undefined,
    rootMargin: undefined,
    threshold: 0.1,
  },
  errorPhoto,
  onLoading: (el: Element) => console.log('loading', el),
  onLoaded: (el: Element) => console.log('loaded', el),
  onError: (el: Element) => console.log('error', el),
  onIntersecting: (el: Element) => console.log('intersecting', el),
}

app.use(vLazyImgInstall, vLazyImgOptions)

app.mount('#app')
```

## Types

```ts
export interface vLazyImgOptions {
  baseClass?: string
  loadingClass?: string
  loadedClass?: string
  errorClass?: string
  noPhotoClass?: string
  noPhoto?: boolean
  observerOnce?: boolean
  loadOnce?: boolean
  observerOptions?: {
    root?: HTMLElement | null
    threshold: number
    rootMargin?: string
  }
  fallbackSrc?: string
  onLoading?: (el: Element) => unknown
  onLoaded?: (el: Element) => unknown
  onError?: (el: Element) => unknown
  onIntersecting?: (el: Element) => unknown
}

interface vLazyImgBindingOptions extends vLazyImgOptions {
  src?: string
  disabled?: boolean
}

export type vLazyImgBindingValue = string | vLazyImgBindingOptions
```

<script lang="ts" setup>
  import { vLazyImg, vLazyImgBindingValue } from 'maz-ui'
  import { ref } from 'vue'

  const lazyBinding: vLazyImgBindingValue = {
    src: 'https://loremflickr.com/1500/1000',
    baseClass: 'custom-class',
    loadingClass: 'custom-class-loading',
    loadedClass: 'custom-class-loaded',
    errorClass: 'custom-class-error',
    noPhotoClass: 'custom-class-no-photo',
    noUseErrorPhoto: true,
    observerOnce: false,
    loadOnce: true,
    onLoading: (el: Element) => console.log('loading', el),
    onLoaded: (el: Element) => console.log('loaded', el),
    onError: (el: Element) => console.log('error', el),
    onIntersecting: (el: Element) => console.log('intersecting', el),
  }
</script>
