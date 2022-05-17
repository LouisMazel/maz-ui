---
title: vZoomImg
description: vZoomImg is a Vue 3 directive to enlarge an image like a modal on click, if you have several images, you can pass them like a carousel
---

# vZoomImg

`vZoomImg` is a Vue 3 directive to enlarge an image like a modal, if you have several images, you can pass them like a carousel (the directive search others intances in the page)

> Can be mixed with [vLazyImg](/maz-ui-3/directives/lazy-img.html) directive

## Basic usage

> Click on the photo

<MazCard overflow-hidden>
  <img
    src="https://cdn.artphotolimited.com/images/5ff5a529bd40b83c5a537440/1000x1000/gerard-depardieu-1983.jpg"
    v-zoom-img="{ src: 'https://cdn.artphotolimited.com/images/5ff5a529bd40b83c5a537440/1000x1000/gerard-depardieu-1983.jpg' }"
  />
</MazCard>
<br />
<br />
<MazBtn v-zoom-img="{ src: 'https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg' }">
  Show photo
</MazBtn>

```vue
<template>
  <MazCard overflow-hidden>
    <img
      src="https://cdn.artphotolimited.com/images/5ff5a529bd40b83c5a537440/1000x1000/gerard-depardieu-1983.jpg"
      v-zoom-img="{ src: 'https://cdn.artphotolimited.com/images/5ff5a529bd40b83c5a537440/1000x1000/gerard-depardieu-1983.jpg' }"
    />
  </MazCard>

  <MazBtn v-zoom-img="{ src: 'https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg' }">
    Show photo
  </MazBtn>
</template>

<script lang="ts" setup>
  import { vZoomImg } from 'maz-ui'
</script>
```

## Options

<br />

<MazCard overflow-hidden>
  <img
    src="https://www.francetvinfo.fr/pictures/5u9TF9KLx9yxCgqfDV4k0Zk6R3E/752x423/2014/07/01/edd_1.jpg"
    v-zoom-img="lazyBinding"
  />
</MazCard>

<script lang="ts" setup>
  import { vZoomImg } from 'maz-ui'

  const lazyBinding: vZoomImgBinding = {
    src: 'https://www.francetvinfo.fr/pictures/5u9TF9KLx9yxCgqfDV4k0Zk6R3E/752x423/2014/07/01/edd_1.jpg',
    alt: 'alt image',
    blur: false,
    scale: false,
    disabled: false
  }
</script>

```vue
<template>
  <MazCard overflow-hidden>
    <img
      src="https://www.francetvinfo.fr/pictures/5u9TF9KLx9yxCgqfDV4k0Zk6R3E/752x423/2014/07/01/edd_1.jpg"
      v-zoom-img="lazyBinding"
    />
  </MazCard>
</template>

<script lang="ts" setup>
  import { vZoomImg } from 'maz-ui'

  const lazyBinding: vZoomImgBinding = {
    src: 'https://www.francetvinfo.fr/pictures/5u9TF9KLx9yxCgqfDV4k0Zk6R3E/752x423/2014/07/01/edd_1.jpg',
    alt: 'alt image', // will be set on the zoomed image
    blur: false,
    scale: false,
    disabled: false
  }
</script>
```

## Global install

`main.ts`

```typescript
import { createApp } from 'vue'
import { vZoomImgInstall, vZoomImgOptions } from 'maz-ui'

const app = createApp(App)

const vLazyImgOptions: vZoomImgOptions = {
  disabled: false,
  scale: true,
  blur: true,
}

app.use(vZoomImgInstall, vLazyImgOptions)

app.mount('#app')
```