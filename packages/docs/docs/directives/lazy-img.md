---
title: vLazyImg
description: vLazyImg is a Vue 3 directive to lazy load image with many options the image will be loaded on user scroll
---

# vLazyImg

`vLazyImg` is a Vue 3 directive to lazy load image with many options, the image will be loaded on user scroll

## Basic usage

<img
  style="background-color: var(--maz-color-bg-lighter); width: 80%;"
  class="flex flex-center rounded"
  v-lazy-img="'https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg'"
/>

```vue
<template>
  <img
    style="background-color: var(--maz-color-bg-lighter); width: 80%;"
    class="flex flex-center rounded"
    v-lazy-img="'https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg'"
  />
</template>

<script lang="ts" setup>
  import { vLazyImg } from 'maz-ui'
  import { ref } from 'vue'

  const hasClikedOutside = ref(false)

  const clikedOutside = () => {
    hasClikedOutside.value = true
    setTimeout(() => hasClikedOutside.value = false, 2000)
  }
</script>
```

## Use background image

> Instead of `v-lazy-img` use `v-lazy-img:bg-image`

<div
  style="height: 200px; width: 100%; background-size: contain;"
  class="flex flex-center rounded"
  v-lazy-img:bg-image="'https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg'"
/>

```vue
<template>
  <div
    style="height: 200px; width: 100%; background-size: contain;"
    class="flex flex-center rounded"
    v-lazy-img:bg-image="'https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg'"
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
  import { vLazyImg, vLazyImgBinding } from 'maz-ui'
  import { ref } from 'vue'

  const lazyBinding: vLazyImgBinding = {
    src: 'https://cdn.artphotolimited.com/images/5ff5a529bd40b83c5a537440/1000x1000/gerard-depardieu-1983.jpg',
    baseClass: 'custom-class',
    loadingClass: 'custom-class-loading',
    loadedClass: 'custom-class-loaded',
    errorClass: 'custom-class-error',
    noPhotoClass: 'custom-class-no-photo',
    noUseErrorPhoto: true,
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

<script lang="ts" setup>
  import { vLazyImg, vLazyImgBinding } from 'maz-ui'
  import { ref } from 'vue'

  const lazyBinding: vLazyImgBinding = {
    src: 'https://cdn.artphotolimited.com/images/5ff5a529bd40b83c5a537440/1000x1000/gerard-depardieu-1983.jpg',
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