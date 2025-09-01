---
title: aos (animation on scroll)
description: Plugin to animate elements on your page as you scroll.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip
This plugin has a composable for easier use, after installing it, you can use [useAos](./../composables/use-aos.md)
:::

## Installation

All options are listed in the [Global Options](#global-options) section.

::: code-group

```ts [Vue]
import { createApp } from 'vue'
import router from './router'
import { AosPlugin, AosOptions } from 'maz-ui/plugins/aos'

// ⚠️ import necessary CSS file ⚠️
import 'maz-ui/aos-styles'

const app = createApp(App)

app.use(router)

const aosOptions: AosOptions = {
  animation: {
    duration: 1000,
    once: false,
    delay: 0,
  },
  delay: 100,
  router,
}

app.use(AosPlugin, aosOptions)

app.mount('#app')
```

```ts [Nuxt]
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    composables: {
      useAos: {
        animation: {
          duration: 1000,
          once: false,
          delay: 0,
        },
        delay: 100,
      },
    },
  },
})
```

:::

## Basic usage

<MazCard overflow-hidden data-maz-aos="scale-out" id="parentCard">
  <div class="maz-flex" style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
    <MazAvatar
      data-maz-aos-delay="300"
      data-maz-aos="scale-in"
      size="2rem"
      src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=maz-ui"
    />
    <div>
      <h1
        data-maz-aos="fade-down"
        data-maz-aos-delay="600"
        data-maz-aos-anchor="#parentCard"
        style="margin: 0;"
      >
        Maz-UI
      </h1>
      <p
        data-maz-aos="zoom-in-left"
        data-maz-aos-delay="900"
        style="margin: 0"
        class="maz-text-muted"
      >
        Library
      </p>
    </div>
  </div>
  <p
    data-maz-aos="flip-up"
    data-maz-aos-delay="1200"
    data-maz-aos-duration="1000"
    style="margin: 0"
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
</MazCard>

```html{1,13}
<MazCard overflow-hidden data-maz-aos="scale-out" id="parentCard">
  <div class="maz-flex" style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
    <MazAvatar
      data-maz-aos-delay="300"
      data-maz-aos="scale-in"
      size="2rem"
      src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=maz-ui"
    />
    <div>
      <h1
        data-maz-aos="fade-down"
        data-maz-aos-delay="600"
        data-maz-aos-anchor="#parentCard"
        style="margin: 0;"
      >
        Maz-UI
      </h1>
      <p
        data-maz-aos="zoom-in-left"
        data-maz-aos-delay="900"
        style="margin: 0"
        class="maz-text-muted"
      >
        Library
      </p>
    </div>
  </div>
  <p
    data-maz-aos="flip-up"
    data-maz-aos-delay="1200"
    data-maz-aos-duration="1000"
    style="margin: 0"
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
</MazCard>
```

## Atributes

| Attribute             | Description                                                                                                                 | Example value                | Default value |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------- |
| data-maz-aos          | animation name                                                                                                              | fade-up                      | -             |
| data-maz-aos-duration | \*Duration of animation (ms)                                                                                                | 50 to 3000 (with step of 50) | 300           |
| data-maz-aos-easing   | Choose timing function to ease elements in different ways                                                                   | ease-in-sine                 | linear        |
| data-maz-aos-delay    | Delay animation (ms)                                                                                                        | 50 to 3000 (with step of 50) | 0             |
| data-maz-aos-anchor   | Anchor element, whose offset will be counted to trigger animation instead of actual elements offset. ONLY with ID attribute | #selector                    | undefined     |
| data-maz-aos-once     | Choose wheter animation should fire once, or every time you scroll up/down to element                                       | true                         | false         |

## Animations

### Fade

- fade-up
- fade-down
- fade-right
- fade-left
- fade-up-right
- fade-up-left
- fade-down-right
- fade-down-left

### Zoom

- zoom-in
- zoom-in-up
- zoom-in-down
- zoom-in-right
- zoom-in-left
- zoom-out
- zoom-out-up
- zoom-out-down
- zoom-out-right
- zoom-out-left

### Slide

- slide-up
- slide-down
- slide-right
- slide-left

### Flip

- flip-left
- flip-right
- flip-up
- flip-down

### Rotate

- rotate-left
- rotate-right

### Scale

- scale-in
- scale-out

## Easing

You can choose one of these timing function to animate elements nicely:

- linear
- ease
- ease-in
- ease-out
- ease-in-out
- ease-in-back
- ease-out-back
- ease-in-out-back
- ease-in-sine
- ease-out-sine
- ease-in-out-sine
- ease-in-quad
- ease-out-quad
- ease-in-out-quad
- ease-in-cubic
- ease-out-cubic
- ease-in-out-cubic
- ease-in-quart
- ease-out-quart
- ease-in-out-quart

## Nuxt

::: tip
For **NuxtJS v3** and higher, use the dedicated Nuxt module to take advantage of auto-imports of components, plugins, composables and css files: [Nuxt Module Documentation](./../guide/nuxt.md)
:::

Should be executed on client side

`nuxt.config.(ts|js)`

```ts
export default defineNuxtConfig({
  css: ['maz-ui/aos-styles'],
})
```

`plugins/maz-aos.client.ts`

```ts
import { AosOptions, installAos } from 'maz-ui/plugins'

export default ({ vueApp, $router: router }) => {
  const options: AosOptions = {
    router,
    animation: {
      duration: 1000,
      delay: 0,
      once: false,
    },
  }

  vueApp.use(installAos, options)
}
```

## Run animations programatically

You can run animations programatically with the useAos composable.
This is useful if you want to run animations after the page is loaded or if no router is provided.

```vue
<script lang="ts" setup>
import { useAos } from 'maz-ui/composables'
import { onMounted } from 'vue'

const aos = useAos()

onMounted(() => {
  // should be run on client side
  aos.runAnimations()
})
</script>

<template>
  <div id="parentCard" data-maz-aos="scale-out">
    <p
      data-maz-aos-delay="300"
      data-maz-aos="scale-in"
      size="2rem"
      src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=maz-ui"
    >
      In the heart of Hollywood's narrow alleyways, there existed an actor like no other—a charismatic feline named Whiskers. With his sleek black fur and piercing eyes, he stole the spotlight in every appearance. Whiskers, known for his versatility and natural talent, seamlessly slipped into dramatic, comedic, or action-packed roles.
    </p>
  </div>
</template>
```

## Global Options

```ts
export interface AosOptions {
  /**
   * provide your router to launch animation after each navigation
   * @default undefined
   */
  router?: Router
  /**
   * duration in ms before start animations (useful when the HTML rendering is slow)
   * @default 100
   */
  delay?: number
  observer?: {
    /**
     * Scope animation to specific parent HTMLElement
     * @default undefined
     */
    root?: Element | Document | null
    /**
     * margin around elements to trigger the animations - Ex: "100px"
     * @default undefined
     */
    rootMargin?: string
    /**
     * Ratio concerponding to the element size
     * @default 0.2
     */
    threshold?: number | number[]
  }
  animation?: {
    /**
     * if `false` the animation is played each times when the element is visible
     * @default true
     */
    once?: boolean
    /**
     * Default animation duration in ms
     * @default 300
     */
    duration?: number
    /**
     * Default animation delay in ms
     * @default 0
     */
    delay?: number
  }
}
```
