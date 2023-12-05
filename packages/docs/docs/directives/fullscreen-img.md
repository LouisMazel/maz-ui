---
title: v-fullscreen-img
description: Displays images fullscreen on click
---


# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

<img
  v-fullscreen-img
  src="https://focus.telerama.fr/2023/04/11/0/0/2620/2589/1200/0/60/0/90ca012_1681206353942-opaleplus-opale56033-01.jpg"
/>

```vue
<template>
  <img
    v-fullscreen-img
    src="https://focus.telerama.fr/2023/04/11/0/0/2620/2589/1200/0/60/0/90ca012_1681206353942-opaleplus-opale56033-01.jpg"
  />
</template>

<script setup lang="ts">
  import { vFullscreenImg } from 'maz-ui'
</script>
```

## With animate options

<img
  v-fullscreen-img="{
    scaleOnHover: true,
    blurOnHover: true,
  }"
  src="https://cdn.artphotolimited.com/images/5ff5a529bd40b83c5a537440/1000x1000/gerard-depardieu-1983.jpg"
/>

```html
<img
  v-fullscreen-img="{
    scaleOnHover: true,
    blurOnHover: true,
  }"
  src="https://cdn.artphotolimited.com/images/5ff5a529bd40b83c5a537440/1000x1000/gerard-depardieu-1983.jpg"
/>
```

## On custom element

<MazBtn
  v-fullscreen-img="'https://images.midilibre.fr/api/v1/images/view/5b4c543c8fe56f4b75185454/large/image.jpg'"
>
  Click me to show image
</MazBtn>

```html
<MazBtn
  v-fullscreen-img="'https://images.midilibre.fr/api/v1/images/view/5b4c543c8fe56f4b75185454/large/image.jpg'"
>
  Click me to show image
</MazBtn>
```

## Global install

### Vue.JS

`main.ts`

```ts
import { createApp } from 'vue'
import { vFullscreenImgInstall } from 'maz-ui'

const app = createApp(App)

app.use(vFullscreenImgInstall)

app.mount('#app')
```

### Nuxt.JS

```ts
export default defineNuxtPlugin({ vueApp }) => {
  vueApp.use(vFullscreenImgInstall)
})
```

Or use Maz-ui Nuxt Module:

`nuxt.config.(ts, js)`

```ts
export default defineNuxtConfig({
  modules: ['maz-ui/nuxt'],
  mazUi: {
    installVFullscreenImg: true
  }
})
```
