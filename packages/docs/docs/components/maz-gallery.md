---
title: MazGallery
description: MazGallery is a standalone component used to display images in a container and has many options and actions
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazGallery
  :images="images"
  :height="320"
/>

```vue
<template>
  <MazGallery
    :images="images"
    :height="320"
  />
</template>

<script lang="ts" setup>
  import MazGallery, { type MazGalleryImage } from 'maz-ui/components/MazGallery'

  const images: MazGalleryImage[] = [
    'https://placekitten.com/640/500',
    { src: 'https://placekitten.com/640/600', thumbnail: 'https://placekitten.com/100/100', alt: 'image description' },
    { src: 'https://placekitten.com/640/700', alt: 'image description' },
    'https://placekitten.com/640/800',
    'https://placekitten.com/640/1000',
    'https://placekitten.com/800/800'
  ]
</script>
```

<script lang="ts" setup>
  const images: MazGalleryImage[] = [
    'https://placekitten.com/640/500',
    { src: 'https://placekitten.com/640/600', thumbnail: 'https://placekitten.com/100/100', alt: 'image description' },
    { src: 'https://placekitten.com/640/700', alt: 'image description' },
    'https://placekitten.com/640/800',
    'https://placekitten.com/640/1000',
    'https://placekitten.com/800/800'
  ]
</script>

## Set height by CSS

<MazGallery
  :images="images"
  class="maz-h-48 mob-l:maz-h-60 tab-s:maz-h-80"
  no-height
/>

```html
<MazGallery
  :images="images"
  class="maz-h-48 mob-l:maz-h-60 tab-s:maz-h-80"
  no-height
/>
```

## Types

```ts
type MazGalleryImage =
  | {
      thumbnail?: string
      src: string
      alt?: string
    }
  | string
```

<!--@include: ./../.vitepress/generated-docs/maz-gallery.doc.md-->