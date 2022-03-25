---
description: Plugin to animate elements on your page as you scroll.
---

# animation on scroll (aos)

> Plugin to animate elements on your page as you scroll.

This plugin use the browser native [Intersection Observer API](https://developer.mozilla.org/fr/docs/Web/API/Intersection_Observer_API)

## Basic usage

<br />

<MazCard overflow-hidden data-maz-aos="scale-out" id="parentCard">
  <MazAvatar
    data-maz-aos-delay="300"
    data-maz-aos="scale-in"
    size="2rem"
    src="https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg"
  />
  <h1
    data-maz-aos="slide-right"
    data-maz-aos-delay="600"
    data-maz-aos-anchor="#parentCard"
    style="margin-top: 12px; margin-bottom: 12px;"
  >
    Gérard Depardieu
  </h1>
  <p
    data-maz-aos="zoom-in-left"
    data-maz-aos-delay="900"
    style="margin-top: 0"
    class="maz-text-muted"
  >
    Actor
  </p>
  <p
    data-maz-aos="flip-left"
    data-maz-aos-delay="1200"
    data-maz-aos-duration="2000"
    style="margin-top: 0"
  >
    Gérard Depardieu, né le 27 décembre 1948 à Châteauroux, est un acteur, chanteur, réalisateur, producteur de cinéma, de télévision et de théâtre franco-russe. Il est aussi homme d'affaires, notamment dans le domaine de la viticulture.
  </p>
</MazCard>

```vue
<template>
  <MazCard overflow-hidden data-maz-aos="scale-out" id="parentCard">
    <MazAvatar
      data-maz-aos-delay="300"
      data-maz-aos="scale-in"
      size="2rem"
      src="https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg"
    />
    <h1
      data-maz-aos="slide-right"
      data-maz-aos-delay="600"
      data-maz-aos-anchor="#parentCard"
      style="margin-top: 12px; margin-bottom: 12px;"
    >
      Gérard Depardieu
    </h1>
    <p
      data-maz-aos="zoom-in-left"
      data-maz-aos-delay="900"
      style="margin-top: 0"
      class="maz-text-muted"
    >
      Actor
    </p>
    <p
      data-maz-aos="flip-left"
      data-maz-aos-delay="1200"
      data-maz-aos-duration="2000"
      style="margin-top: 0"
    >
      Gérard Depardieu, né le 27 décembre 1948 à Châteauroux, est un acteur, chanteur, réalisateur, producteur de cinéma, de télévision et de théâtre franco-russe. Il est aussi homme d'affaires, notamment dans le domaine de la viticulture.
    </p>
  </MazCard>
</template>
```

## Atributes

| Attribute | Description | Example value | Default value |
|---------------------------|-------------|---------------|---------|
| data-maz-aos | animation name | fade-up | - |
| data-maz-aos-duration | *Duration of animation (ms) | 50 to 3000 | 400 |
| data-maz-aos-easing | Choose timing function to ease elements in different ways | ease-in-sine | linear |
| data-maz-aos-delay | Delay animation (ms) | 50 to 3000 | 0 |
| data-maz-aos-anchor | Anchor element, whose offset will be counted to trigger animation instead of actual elements offset. ONLY with ID attribute | #selector | undefined |
| data-maz-aos-once | Choose wheter animation should fire once, or every time you scroll up/down to element | true | false |

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

## Install

### Vue

`main.ts` or `main.js`

```ts
import { createApp, useRouter } from 'vue'
import { installAos, AosOptions } from 'maz-ui'

// ⚠️ import necessary CSS file ⚠️
import 'maz-ui/css/aos.css'

const app = createApp(App)

const router = useRouter()

const options: AosOptions = {
  router,
  animation: {
    duration: 1000,
    once: false,
  },
}

app.use(installAos, options)

app.mount('#app')
```

### Nuxt

Should be executed on client side

`nuxt.config.(ts|js)`

```ts
export default {
  // optional (nuxt will automatically install plugins in `plugins` folder)
  plugins: [
    { '@/plugins/maz-aos.client.ts', mode: 'client' } // ⚠️
  ],
  css: [
    'maz-ui/css/aos.css'
  ],
  build: {
    transpile: ['maz-ui'], // ⚠️ important ⚠️
  },
}
```

`plugins/maz-aos.client.ts`

```ts
import { installAos, AosOptions } from 'maz-ui'

export default ({ vueApp, $router: router }) => {
  const options: AosOptions = {
    router,
    animation: {
      duration: 1000,
      once: false,
    },
  }

  vueApp.use(installAos, options)
}
```

## Global Options

```ts
export interface AosOptions {
  /* provide your router to launch animation after each navigation */
  router?: Router
  /* duration in ms before each animation (useful when the HTML rendering is slow) */
  delay?: number // DEFAULT: 100
  observer?: {
    /* scope animation to specific parent element */
    root?: Element | Document | null; // DEFAULT: undefined
    /* margin around elements to trigger the animations */
    rootMargin?: string; // DEFAULT: undefined
    /* Ratio concerponding to the element size */
    threshold?: number | number[]; // DEFAULT: 0.2
  }
  animation?: {
    /* if false the animation is played each times when the element is visible */
    once?: boolean // DEFAULT: true
    /* default animation duration in ms */
    duration?: number // DEFAULT: 400
  }
}
```
