---
title: MazLightbox
description: MazLightbox is a full-screen image viewer. The image grows from its thumbnail, with navigation, swipe, zoom, caption and counter. It is also what the v-fullscreen-img directive and MazGallery open.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Give it a list of images and bind `v-model`. The image grows from the button that opened it.

<ComponentDemo>
  <MazBtn @click="open = true">
    Open the lightbox
  </MazBtn>

  <MazLightbox v-model="open" :images />

<template #code>

```vue
<script lang="ts" setup>
import { ref } from 'vue'
import MazLightbox from 'maz-ui/components/MazLightbox'

const open = ref(false)
const images = [
  'https://picsum.photos/id/1015/1200/800',
  'https://picsum.photos/id/1016/1200/800',
  'https://picsum.photos/id/1018/800/1200',
]
</script>

<template>
  <button @click="open = true">Open</button>
  <MazLightbox v-model="open" :images />
</template>
```

  </template>
</ComponentDemo>

## Captions

An image is a string or `{ src, alt, caption, fullSrc }`. The caption shows `caption`, or `alt` when there is none.

<ComponentDemo>
  <MazBtn @click="openCaptions = true">
    With captions
  </MazBtn>

  <MazLightbox v-model="openCaptions" v-model:index="index" :images="captioned" />

<template #code>

```vue
<MazLightbox
  v-model="open"
  v-model:index="index"
  :images="[
    { src: '/lake.jpg', alt: 'A lake', caption: 'Lake at dawn' },
    { src: '/forest.jpg', alt: 'A forest' },
  ]"
/>
```

  </template>
</ComponentDemo>

## High resolution

`src` is shown at once (a thumbnail already loaded is fine) and `fullSrc` replaces it when it is ready. The previous and the next images are preloaded.

```vue
<MazLightbox v-model="open" :images="[{ src: '/photo-small.jpg', fullSrc: '/photo-large.jpg' }]" />
```

## Origin

The image grows from the element that was clicked last, and goes back to it. Set `origin` to choose it: an element, a selector, an event, a `{ x, y }` point, or a function that returns one for an index, to follow the thumbnail of the shown image. If the page scrolled, the image goes back to where the thumbnail is now.

```vue
<MazLightbox v-model="open" :images :origin="(index) => thumbnails[index]" />
```

## Navigation and zoom

| Action | Mouse and keyboard | Touch |
| --- | --- | --- |
| Next, previous | Arrows (direction aware: `ArrowLeft` is next in right to left), `Home`, `End`, buttons | Swipe |
| Zoom | Click on the image (zooms on the clicked point), `+`, `-`, `0` | Pinch, tap |
| Move a zoomed image | Drag | Drag |
| Close | `Escape`, click outside the image, close button | Drag down |

Set `:zoom="false"` to turn the zoom off, `:loop="false"` to stop at the first and the last images.

## Slots

Replace the caption with `#caption`, add actions next to the close button with `#toolbar`.

<ComponentDemo>
  <MazBtn @click="openSlots = true">
    With a toolbar
  </MazBtn>

  <MazLightbox v-model="openSlots" :images>
    <template #toolbar="{ image }">
      <a :href="image.src" download class="maz:rounded-full maz:bg-overlay/40 maz:px-3 maz:py-2 maz:text-sm maz:text-white">
        Download
      </a>
    </template>
  </MazLightbox>

<template #code>

```vue
<MazLightbox v-model="open" :images>
  <template #toolbar="{ image }">
    <a :href="image.src" download>Download</a>
  </template>
</MazLightbox>
```

  </template>
</ComponentDemo>

## Motion

The image grows from its origin with [useOriginTransition](./../composables/use-origin-transition.md): the duration and the easing come from the `--maz-motion-normal` and `--maz-easing-out` tokens, and only `transform` and `opacity` move. The images slide and fade into each other in the direction of the navigation (reversed in right to left). Reduced motion, and the `motion` option of `MazUi`, replace it with a short fade. `:animated="false"` turns it off, `animation` sets a duration and an easing.

## Accessibility

It is a modal dialog (`role="dialog"`, `aria-modal`) labelled by the alt of the image, `label` overrides it. The focus stays inside, `Escape` closes only the top overlay, and the focus goes back to the thumbnail. The buttons are labelled with the translations of `@maz-ui/translations`.

## With a directive and a gallery

Most of the time you do not use the component directly: [v-fullscreen-img](./../directives/fullscreen-img.md) opens it from an image, and [MazGallery](./maz-gallery.md) opens it from its images.

<!--@include: ./../../.vitepress/generated-docs/maz-lightbox.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'

  const open = ref(false)
  const openCaptions = ref(false)
  const openSlots = ref(false)
  const index = ref(0)

  const images = [
    'https://picsum.photos/id/1015/1200/800',
    'https://picsum.photos/id/1016/1200/800',
    'https://picsum.photos/id/1018/800/1200',
  ]

  const captioned = [
    { src: 'https://picsum.photos/id/1015/1200/800', alt: 'A river between mountains', caption: 'The river at dawn' },
    { src: 'https://picsum.photos/id/1016/1200/800', alt: 'A canyon' },
    { src: 'https://picsum.photos/id/1018/800/1200', alt: 'Mountains and a lake', caption: 'Portrait format' },
  ]
</script>
