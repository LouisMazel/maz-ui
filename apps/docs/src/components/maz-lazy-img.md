---
title: MazLazyImg
description: MazLazyImg is a standalone component to display images and svgs with lazy loading
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

<MazLazyImg src="https://placedog.net/1000/1000" block />

```vue
<script setup lang="ts">
import MazLazyImg from 'maz-ui/components/MazLazyImg'
</script>

<template>
  <MazLazyImg src="https://placedog.net/1000/1000" block />
</template>
```

::: tip Performance
`MazLazyImg` relies on the [`vLazyImg`](./../directives/lazy-img.md) directive, whose `IntersectionObserver`s are pooled and shared across every instance - rendering many images (galleries, lists, avatars) stays cheap.
:::

## Responsive sources

Pass an object with `sources` to serve different images depending on the media query (like a native `<picture>`).

```vue
<template>
  <MazLazyImg
    :src="{
      sources: [
        { srcset: 'https://placedog.net/600/400', media: '(max-width: 600px)' },
        { srcset: 'https://placedog.net/1500/1000', media: '(min-width: 601px)' },
      ],
    }"
    block
  />
</template>
```

## Image height full

By default the image is displayed with `width: 100%`. Enable `image-height-full` to fill the **height** instead: the image keeps its aspect ratio, fills 100% of the height and overflows/crops horizontally. Handy for wide images or SVGs inside a fixed-height container.

```vue
<template>
  <div style="height: 200px;">
    <MazLazyImg image-height-full src="https://placedog.net/1500/1000" />
  </div>
</template>
```

## Fallback on error

Provide `fallback-src` to swap the image when it fails to load.

<MazLazyImg
  block
  src="https://broken-link-image-src.example"
  fallback-src="https://placedog.net/500/500?id=42"
/>

```vue
<template>
  <MazLazyImg
    src="https://broken-link-image-src.example"
    fallback-src="https://placedog.net/500/500"
    block
  />
</template>
```

## Without loader

Hide the spinner shown while the image is loading with `hide-loader`.

```vue
<template>
  <MazLazyImg src="https://placedog.net/1000/1000" hide-loader block />
</template>
```

<!--@include: ./../../.vitepress/generated-docs/maz-lazy-img.doc.md-->
