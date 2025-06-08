---
title: MazGallery
description: MazGallery is a standalone component used to display images in a container and has many options and actions
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazGallery
  :images
  :height="320"
/>

```vue
<script lang="ts" setup>
import { MazGallery, type MazGalleryImage } from 'maz-ui/components'

const images: MazGalleryImage[] = [
  'https://loremflickr.com/640/400',
  { src: 'https://loremflickr.com/640/600', thumbnail: 'https://loremflickr.com/100/100', alt: 'image description' },
  { src: 'https://loremflickr.com/640/700', alt: 'image description' },
  'https://loremflickr.com/640/800',
  'https://loremflickr.com/640/1000',
  'https://loremflickr.com/800/800'
]
</script>

<template>
  <MazGallery
    :images
    :height="320"
  />
</template>
```

## Set height by CSS

<MazGallery
  :images="images2"
  class="maz-h-48 mob-l:maz-h-60 tab-s:maz-h-80"
  :height="false"
/>

```html
<MazGallery :images="images" class="h-48 md:h-60 lg:h-80" :height="false" />
```

## Types

```ts
type MazGalleryImage
  = | {
    thumbnail?: string
    src: string
    alt?: string
  }
  | string
```

<!--@include: ./../.vitepress/generated-docs/maz-gallery.doc.md-->

<script lang="ts" setup>
  const images: MazGalleryImage[] = [
    'https://loremflickr.com/640/400',
    { src: 'https://loremflickr.com/640/600', thumbnail: 'https://loremflickr.com/100/100', alt: 'image description' },
    { src: 'https://loremflickr.com/640/700', alt: 'image description' },
    'https://loremflickr.com/640/800',
    'https://loremflickr.com/640/1000',
    'https://loremflickr.com/800/800'
  ]

  const images2: MazGalleryImage[] = [
    'https://loremflickr.com/500/400',
    { src: 'https://loremflickr.com/500/600', thumbnail: 'https://loremflickr.com/100/100', alt: 'image description' },
    { src: 'https://loremflickr.com/500/700', alt: 'image description' },
    'https://loremflickr.com/500/800',
    'https://loremflickr.com/500/1000',
    'https://loremflickr.com/500/800'
  ]
</script>
