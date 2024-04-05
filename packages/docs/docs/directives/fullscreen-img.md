---
title: v-fullscreen-img
description: Displays images fullscreen on click
---


# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

<img
  v-fullscreen-img
  src="https://loremflickr.com/1000/500"
/>

```vue
<template>
  <img
    v-fullscreen-img
    src="https://loremflickr.com/1000/500"
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
  src="https://loremflickr.com/1000/600"
/>

```html
<img
  v-fullscreen-img="{
    scaleOnHover: true,
    blurOnHover: true,
  }"
  src="https://loremflickr.com/1000/600"
/>
```

## On custom element

<MazBtn
  v-fullscreen-img="'https://loremflickr.com/1000/700'"
>
  Click me to show image
</MazBtn>

```html
<MazBtn
  v-fullscreen-img="'https://loremflickr.com/1000/700'"
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

## Types

```ts
interface vFullscreenImgBindingOptions extends vFullscreenImgOptions {
  src: string
  alt?: string | null
}

export type vFullscreenImgBindingValue = string | vFullscreenImgBindingOptions | undefined
```
