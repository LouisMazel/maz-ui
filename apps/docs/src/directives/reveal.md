---
title: vReveal
description: vReveal is a Vue directive that reveals an element when it enters the screen - fade, slide, blur, curtain, iris, lines and words of a text, cascades and scroll-linked progress, in CSS, with reduced motion and RTL handled.
head:
  - - meta
    - name: keywords
      content: reveal, scroll animation, animate on scroll, aos, fade in, slide in, curtain, clip-path, text reveal, stagger, scroll-driven animation, v-reveal, data-maz-reveal
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

Give an effect to the directive. The element is shown when it enters the screen.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3">
    <MazBtn size="sm" @click="key++">Replay</MazBtn>
    <div :key="key" class="maz:grid maz:w-full maz:gap-3 maz:sm:grid-cols-3">
      <div v-reveal="'slide-up'" class="maz:rounded-md maz:bg-primary maz:p-6 maz:text-center maz:text-primary-foreground">Slide up</div>
      <div v-reveal="{ effect: 'slide-up', delay: 150 }" class="maz:rounded-md maz:bg-primary maz:p-6 maz:text-center maz:text-primary-foreground">With a delay</div>
      <div v-reveal="{ effect: 'blur', delay: 300 }" class="maz:rounded-md maz:bg-primary maz:p-6 maz:text-center maz:text-primary-foreground">Blur</div>
    </div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { vReveal } from 'maz-ui/directives/vReveal'
</script>

<template>
  <div v-reveal="'slide-up'">Slide up</div>
  <div v-reveal="{ effect: 'slide-up', delay: 150 }">With a delay</div>
  <div v-reveal="{ effect: 'blur', delay: 300 }">Blur</div>
</template>
```

</template>
</ComponentDemo>

Elements that enter the screen together follow each other automatically, with a small and capped delay.

::: tip
No CSS to import: the directive loads its styles the first time it is used. Nothing is hidden on the server, without JavaScript, nor before the hydration.
:::

## Effects

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3">
    <MazBtn size="sm" @click="key++">Replay</MazBtn>
    <div :key="key" class="maz:grid maz:w-full maz:grid-cols-2 maz:gap-3 maz:sm:grid-cols-4">
      <div
        v-for="(effect, index) in effects"
        :key="effect"
        v-reveal="{ effect, delay: index * 60 }"
        class="maz:rounded-md maz:bg-primary maz:p-6 maz:text-center maz:text-sm maz:text-primary-foreground"
      >
        {{ effect }}
      </div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div v-reveal="'fade'">fade</div>
  <div v-reveal="'slide-end'">slide-end</div>
  <div v-reveal="'curtain-up'">curtain-up</div>
  <div v-reveal="'iris'">iris</div>
</template>
```

</template>
</ComponentDemo>

| Effect | What it does |
| --- | --- |
| `fade` | Fades in |
| `slide-up`, `slide-down` | Slides in from the bottom or the top |
| `slide-start`, `slide-end` | Slides in from the start or the end side (follows the direction, so RTL works) |
| `blur` | Comes out of a blur |
| `scale` | Grows a little |
| `curtain-up`, `curtain-down`, `curtain-start`, `curtain-end` | A curtain opens in that direction (`clip-path`) |
| `iris` | A circle opens from the center |
| `settle` | A curtain with a small zoom out: an image that lands |
| `lines`, `words` | The lines or the words of a text, see [below](#lines-and-words) |

Add `blur: true` to any effect to get a blur with it.

## Cascade

`stagger` reveals the children of an element one after the other, with the effect of the element.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3">
    <MazBtn size="sm" @click="key++">Replay</MazBtn>
    <ul :key="key" v-reveal="{ effect: 'slide-up', stagger: 100, blur: true }" class="maz:m-0 maz:flex maz:w-full maz:list-none maz:flex-col maz:gap-2 maz:p-0">
      <li v-for="item in 4" :key="item" class="maz:rounded-md maz:border maz:border-divider maz:bg-container maz:p-3">Item {{ item }}</li>
    </ul>
  </div>

<template #code>

```vue
<template>
  <ul v-reveal="{ effect: 'slide-up', stagger: 100, blur: true }">
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  </ul>
</template>
```

</template>
</ComponentDemo>

## Lines and words

`lines` makes the lines of a text rise from a mask. `words` brings the words one after the other. The text stays readable by screen readers, and the text is restored when the reveal is done.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3">
    <MazBtn size="sm" @click="key++">Replay</MazBtn>
    <div :key="key" class="maz:flex maz:w-full maz:flex-col maz:gap-4">
      <h3 v-reveal="'lines'" class="maz:m-0 maz:max-w-md maz:text-2xl maz:font-semibold">Every line of this title rises from its own mask, one after the other</h3>
      <p v-reveal="'words'" class="maz:m-0 maz:max-w-md maz:text-muted">Words arrive one by one and follow the width of the page.</p>
    </div>
  </div>

<template #code>

```vue
<template>
  <h2 v-reveal="'lines'">Every line of this title rises from its own mask</h2>
  <p v-reveal="'words'">Words arrive one by one.</p>
</template>
```

</template>
</ComponentDemo>

Lines are the ones rendered on the screen, or the parts split by `<br>`. Use a text that does not change after the first render. To style the words of a text yourself, see [MazAnimatedText](./../components/maz-animated-text.md).

## Linked to the scroll

With `mode: 'scroll'`, the progress follows the scroll (`animation-timeline: view()`). Browsers without it use the normal reveal.

<ComponentDemo>
  <div v-reveal="{ effect: 'curtain-up', mode: 'scroll' }" class="maz:rounded-md maz:bg-primary maz:p-10 maz:text-center maz:text-primary-foreground">
    I open while you scroll the page
  </div>

<template #code>

```vue
<template>
  <div v-reveal="{ effect: 'curtain-up', mode: 'scroll' }">
    I open while you scroll
  </div>
</template>
```

</template>
</ComponentDemo>

## Component

[MazReveal](./../components/maz-reveal.md) wraps a block. It takes the same options as props.

```vue
<script lang="ts" setup>
import MazReveal from 'maz-ui/components/MazReveal'
</script>

<template>
  <MazReveal effect="curtain-up" :delay="200">
    <img src="/cover.jpg" alt="Cover">
  </MazReveal>
</template>
```

## HTML you do not control

For markdown, a CMS or static HTML, use `data-maz-reveal` and `useReveal`. It scans the page on mount and after each navigation with Vue Router.

```ts
import { useReveal } from 'maz-ui/composables/useReveal'

useReveal()
// or the elements of a selector, with default options
useReveal({ selector: '.prose > *', effect: 'slide-up', root: article })
```

```html
<p data-maz-reveal="slide-up" data-maz-reveal-delay="200">Hello</p>
<ul data-maz-reveal="fade" data-maz-reveal-stagger="80">...</ul>
```

Attributes: `data-maz-reveal` (the effect), `-delay`, `-duration`, `-stagger`, `-threshold`, `-once="false"`, `-blur` and `-mode="scroll"`. Call `scan()` to reveal the elements added later.

## Options

| Option | Description | Default |
| --- | --- | --- |
| `effect` | One of the effects above | `'slide-up'` |
| `delay` | Delay before the reveal, in ms | `0` |
| `duration` | Duration, in ms | the `--maz-motion-slower` token |
| `once` | Reveal once. `false` hides the element again when it leaves the screen | `true` |
| `stagger` | Delay in ms between the children (or the lines and words) | none |
| `mode` | `'enter'` or `'scroll'` | `'enter'` |
| `threshold` | Visible ratio (0 to 1) that triggers. By default, the reveal starts when the element crosses the bottom 10% of the screen | none |
| `blur` | Add a blur to the effect | `false` |

Tune it from CSS on any element: `--maz-reveal-distance` (distance of the slides), `--maz-reveal-blur` and `--maz-reveal-easing`. `v-reveal="false"` turns the reveal off.

## Motion

- Only `opacity`, `transform`, `filter` and `clip-path` move, so there is no layout shift.
- With reduced motion, every effect becomes a short fade. The `motion` option of `MazUi` is followed.
- Directions follow the reading direction in RTL (`slide-start`, `slide-end`, `curtain-start`, `curtain-end`).
- One `IntersectionObserver` serves all the elements of the page.

::: warning
Never reveal the main content at the top of the page (the image or the title that is the LCP): it would be hidden then shown after the hydration.
:::

## Global installation

```ts
import { vRevealInstall } from 'maz-ui/directives/vReveal'

app.use(vRevealInstall)
```

With Nuxt: `mazUi: { directives: { vReveal: true } }`.

## Migrate from the AOS plugin

The AOS plugin (`data-maz-aos`, `useAos`, `maz-ui/aos.css`) is replaced by vReveal: no plugin, no CSS file, no option in `MazUi`.

| AOS | vReveal |
| --- | --- |
| `fade-up`, `slide-up`, `fade-up-right`, `fade-up-left` | `slide-up` |
| `fade-down`, `slide-down`, `fade-down-right`, `fade-down-left` | `slide-down` |
| `fade-right`, `slide-right` | `slide-start` |
| `fade-left`, `slide-left` | `slide-end` |
| `zoom-in`, `zoom-in-*`, `scale-in` | `scale` |
| `zoom-out`, `zoom-out-*`, `scale-out` | `fade` |
| `flip-left`, `flip-right`, `rotate-left`, `rotate-right` | `curtain-start`, `curtain-end` |
| `flip-up`, `flip-down` | `curtain-up`, `curtain-down` |
| `data-maz-aos-delay`, `-duration` | `data-maz-reveal-delay`, `-duration` (or the `delay` and `duration` options) |
| `data-maz-aos-once` | `data-maz-reveal-once` (`once` is `true` by default) |
| `data-maz-aos-anchor` | put `stagger` on the parent |
| `data-maz-aos-easing` | `--maz-reveal-easing` |
| `useAos().runAnimations()` | `useReveal().scan()` |

## Types

```ts
type RevealEffect = 'fade' | 'slide-up' | 'slide-down' | 'slide-start' | 'slide-end' | 'blur' | 'scale'
  | 'curtain-up' | 'curtain-down' | 'curtain-start' | 'curtain-end' | 'iris' | 'settle' | 'lines' | 'words'

interface VRevealOptions {
  effect?: RevealEffect
  delay?: number
  duration?: number
  once?: boolean
  stagger?: number
  mode?: 'enter' | 'scroll'
  threshold?: number
  blur?: boolean
}

type VRevealBindingValue = RevealEffect | VRevealOptions | false | undefined
```

<script lang="ts" setup>
import { vReveal } from 'maz-ui/directives/vReveal'
import { ref } from 'vue'

const key = ref(0)

const effects = ['fade', 'slide-up', 'slide-down', 'slide-start', 'slide-end', 'blur', 'scale', 'curtain-up', 'curtain-down', 'curtain-start', 'curtain-end', 'iris', 'settle']
</script>
