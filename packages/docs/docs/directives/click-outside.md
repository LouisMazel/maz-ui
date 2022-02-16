---
title: vClickOutside
description: vClickOutside is a Vue 3 directive to trigger a function when the user clicks outside from a element
---

# vClickOutside

Vue 3 directive to trigger a function when the user clicks outside from a element

## Basic usage

<div
  style="padding: 50px; background-color: var(--maz-color-bg-lighter);"
  class="flex flex-center rounded"
>
  <MazCard v-click-outside="clikedOutside">
    Click outside me
  </MazCard>
</div>

<div
  v-if="hasClikedOutside"
  style="padding: 16px; margin-top: 16px; background-color: var(--maz-color-success); color: black;"
  class="flex flex-center rounded"
>
  You clicked outside
</div>

```vue
<template>
  <div
    style="padding: 50px; background-color: var(--maz-color-bg-lighter);"
    class="flex flex-center rounded"
  >
    <MazCard v-click-outside="clikedOutside">
      Click outside me
    </MazCard>
  </div>

  <div
    v-if="hasClikedOutside"
    style="padding: 16px; margin-top: 16px; background-color: var(--maz-color-success); color: black;"
    class="flex flex-center rounded"
  >
    You clicked outside
  </div>
</template>

<script lang="ts" setup>
  import { vClickOutside } from 'maz-ui'
  import { ref } from 'vue'

  const hasClikedOutside = ref(false)

  const clikedOutside = () => {
    hasClikedOutside.value = true
    setTimeout(() => hasClikedOutside.value = false, 2000)
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
  import { vClickOutside } from 'maz-ui'
  import { ref } from 'vue'

  const hasClikedOutside = ref(false)

  const clikedOutside = () => {
    hasClikedOutside.value = true
    setTimeout(() => hasClikedOutside.value = false, 2000)
  }

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