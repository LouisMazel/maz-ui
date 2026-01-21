---
title: MazCarousel
description: MazCarousel is a standalone component to display and manage items in a row
head:
  - - meta
    - name: twitter:title
      content: MazCarousel | Maz-UI
    - name: twitter:description
      content: MazCarousel is a standalone component to display and manage items in a row
    - property: og:title
      content: MazCarousel | Maz-UI
    - property: og:description
      content: MazCarousel is a standalone component to display and manage items in a row
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

<!--@include: ./../../.vitepress/mixins/translated-component.md-->

## Basic usage

<ComponentDemo>
  <MazCarousel title="Carousel title">
    <MazCard
      v-for="(item, i) in Array(8)"
      :key="i"
      :gallery="{
        images: [
          `https://placedog.net/250/300?random`
        ]
      }"
      style="min-width: 250px;"
    >
      <template #content-title>
        <h4 class="maz-m-0">
          Doggo
        </h4>
      </template>
      <template #content-body>
        <p class="maz-text-muted" style="margin-bottom: 0;">
          It's a beautifull doggo, no ?
        </p>
      </template>
    </MazCard>
  </MazCarousel>

  <template #code>

```vue
<script lang="ts" setup>
import MazCarousel from 'maz-ui/components/MazCarousel'
import MazCard from 'maz-ui/components/MazCard'
</script>

<template>
  <MazCarousel title="Carousel title">
    <MazCard
      v-for="(item, i) in Array(8)"
      :key="i"
      :gallery="{
        images: [
          'https://placedog.net/250/300?random',
        ],
      }"
      style="min-width: 250px;"
    >
      <template #title>
        <h4 class="maz-m-0">
          Doggo
        </h4>
      </template>
      <template #content-body>
        <p class="maz-text-muted" style="margin-bottom: 0;">
          It's a beautifull doggo, no ?
        </p>
      </template>
    </MazCard>
  </MazCarousel>
</template>
```

  </template>
</ComponentDemo>

## Options

### hide-scrollbar

This options will display the component without scrollbar only when the component is not hovered, focused or active

<ComponentDemo>
  <MazCarousel hide-scrollbar>
    <template #title>
      <h4 class="maz-text-2xl maz-font-bold">Carousel</h4>
    </template>
    <MazCard
      v-for="(item, i) in Array(8)"
      :key="i"
      :gallery="{
        images: [
          'https://placedog.net/400/200?random'
        ]
      }"
      style="min-width: 250px;"
    >
      <template #content-title>
        <h4 class="maz-m-0">
          Doggo
        </h4>
      </template>
      <template #content-body>
        <p class="maz-text-muted" style="margin-bottom: 0;">
          It's a beautifull doggo, no ?
        </p>
      </template>
    </MazCard>
  </MazCarousel>

  <template #code>

```vue
<script lang="ts" setup>
import MazCarousel from 'maz-ui/components/MazCarousel'
import MazCard from 'maz-ui/components/MazCard'
</script>

<template>
  <MazCarousel hide-scrollbar>
    <template #title>
      <h4 class="maz-text-2xl maz-font-bold">Carousel</h4>
    </template>
    <MazCard
      v-for="(item, i) in Array(8)"
      :key="i"
      :gallery="{
        images: [
          'https://placedog.net/400/200?random'
        ]
      }"
      style="min-width: 250px;"
    >
      <template #content-title>
        <h4 class="maz-m-0">
          Doggo
        </h4>
      </template>
      <template #content-body>
        <p class="maz-text-muted" style="margin-bottom: 0;">
          It's a beautifull doggo, no ?
        </p>
      </template>
    </MazCard>
  </MazCarousel>
</template>
```

  </template>
</ComponentDemo>

### hide-scroll-buttons

This options will display the component without scroll buttons

<ComponentDemo>
  <MazCarousel hide-scroll-buttons title="Carousel without scroll buttons">
    <MazCard
      v-for="(item, i) in Array(8)"
      :key="i"
      :gallery="{
        images: [
          'https://placedog.net/300/200'
        ]
      }"
      style="min-width: 250px;"
    >
      <template #content-title>
        <h4 class="maz-m-0">
          Doggo
        </h4>
      </template>
      <template #content-body>
        <p class="maz-text-muted" style="margin-bottom: 0;">
          It's a beautifull doggo, no ?
        </p>
      </template>
    </MazCard>
  </MazCarousel>

  <template #code>

```vue
<script lang="ts" setup>
import MazCarousel from 'maz-ui/components/MazCarousel'
import MazCard from 'maz-ui/components/MazCard'
</script>

<template>
  <MazCarousel hide-scroll-buttons title="Carousel without scroll buttons">
    <MazCard
      v-for="(item, i) in Array(8)"
      :key="i"
      :gallery="{
        images: [
          'https://placedog.net/300/200'
        ]
      }"
      style="min-width: 250px;"
    >
      <template #content-title>
        <h4 class="maz-m-0">
          Doggo
        </h4>
      </template>
      <template #content-body>
        <p class="maz-text-muted" style="margin-bottom: 0;">
          It's a beautifull doggo, no ?
        </p>
      </template>
    </MazCard>
  </MazCarousel>
</template>
```

  </template>
</ComponentDemo>

<!--@include: ./../../.vitepress/generated-docs/maz-carousel.doc.md-->
