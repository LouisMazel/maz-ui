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
        <h4 class="maz:m-0">
          Doggo
        </h4>
      </template>
      <template #content-body>
        <p class="maz:text-muted" style="margin-bottom: 0;">
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
        <h4 class="m-0">
          Doggo
        </h4>
      </template>
      <template #content-body>
        <p class="text-muted" style="margin-bottom: 0;">
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
      <h4 class="maz:text-2xl maz:font-bold">Carousel</h4>
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
        <h4 class="maz:m-0">
          Doggo
        </h4>
      </template>
      <template #content-body>
        <p class="maz:text-muted" style="margin-bottom: 0;">
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
      <h4 class="text-2xl font-bold">Carousel</h4>
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
        <h4 class="m-0">
          Doggo
        </h4>
      </template>
      <template #content-body>
        <p class="text-muted" style="margin-bottom: 0;">
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
        <h4 class="maz:m-0">
          Doggo
        </h4>
      </template>
      <template #content-body>
        <p class="maz:text-muted" style="margin-bottom: 0;">
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
        <h4 class="m-0">
          Doggo
        </h4>
      </template>
      <template #content-body>
        <p class="text-muted" style="margin-bottom: 0;">
          It's a beautifull doggo, no ?
        </p>
      </template>
    </MazCard>
  </MazCarousel>
</template>
```

  </template>
</ComponentDemo>

### counter

Show the current page and the page count next to the buttons. The current page rolls.

<ComponentDemo>
  <MazCarousel title="With a counter" counter>
    <MazCard
      v-for="(item, i) in Array(8)"
      :key="i"
      style="min-width: 250px;"
    >
      <template #content-title>
        <h4 class="maz:m-0">
          Doggo {{ i + 1 }}
        </h4>
      </template>
      <template #content-body>
        <p class="maz:text-muted" style="margin-bottom: 0;">
          It's a beautifull doggo, no ?
        </p>
      </template>
    </MazCard>
  </MazCarousel>

  <template #code>

```html
<MazCarousel title="With a counter" counter>
  <MazCard v-for="item in items" :key="item.id">...</MazCard>
</MazCarousel>
```

  </template>
</ComponentDemo>

### progress

A thin bar under the items follows the scroll position.

```html
<MazCarousel progress>...</MazCarousel>
```

### drag-scroll

Drag the items with the mouse. They keep gliding a little when you release. Touch screens already scroll, and a click that ends a drag does not open a link.

<ComponentDemo>
  <MazCarousel title="Drag me" drag-scroll progress counter>
    <MazCard
      v-for="(item, i) in Array(8)"
      :key="i"
      style="min-width: 250px;"
    >
      <template #content-title>
        <h4 class="maz:m-0">
          Doggo {{ i + 1 }}
        </h4>
      </template>
      <template #content-body>
        <p class="maz:text-muted" style="margin-bottom: 0;">
          It's a beautifull doggo, no ?
        </p>
      </template>
    </MazCard>
  </MazCarousel>

  <template #code>

```html
<MazCarousel drag-scroll progress counter>...</MazCarousel>
```

  </template>
</ComponentDemo>

## Motion

- The counter rolls, the progress bar glides, and `drag-scroll` adds a little inertia.
- The buttons scroll by one page, in the direction of the text (reversed in RTL).
- Reduced motion removes the rolling and the inertia.

<!--@include: ./../../.vitepress/generated-docs/maz-carousel.doc.md-->
