---
title: MazCarousel
description: MazCarousel is a stand-alone component to display and manage items in a row
head:
  - - meta
    - name: twitter:title
      content: MazCarousel | Maz-UI
    - name: twitter:description
      content: MazCarousel is a stand-alone component to display and manage items in a row
    - property: og:title
      content: MazCarousel | Maz-UI
    - property: og:description
      content: MazCarousel is a stand-alone component to display and manage items in a row
---

# MazCarousel

> Before you have to import the global css files in your project, follow instructions in [Getting Started](./../guide/getting-started.md)

## Basic usage

<br />

<MazCarousel>
  <template #title>
    <h4 class="maz-m-0">Carousel</h4>
  </template>
  <MazCard
    v-for="(item, i) in Array(8)"
    :key="i"
    :images="[
      'https://www.stevensegallery.com/250/300'
    ]"
    style="min-width: 250px;"
  >
    <template #title>
      <h4 class="maz-m-0">
        Steven Seagal
      </h4>
    </template>
    <template #content>
      <p class="maz-text-muted" style="margin-bottom: 0;">
        You're awesome! You're awesome!
      </p>
    </template>
  </MazCard>
</MazCarousel>

```vue
<template>
  <MazCarousel>
    <template #title>
      <h4 class="maz-m-0">Carousel</h4>
    </template>
    <MazCard
      v-for="(item, i) in Array(8)"
      :key="i"
      :images="[
        'https://www.stevensegallery.com/250/300'
      ]"
      style="min-width: 250px;"
    >
      <template #title>
        <h4 class="maz-m-0">
          Steven Seagal
        </h4>
      </template>
      <template #content>
        <p class="maz-text-muted" style="margin-bottom: 0;">
          You're awesome! You're awesome!
        </p>
      </template>
    </MazCard>
  </MazCarousel>
</template>

<script lang="ts" setup>
  import MazCarousel from 'maz-ui/components/MazCarousel'
</script>
```

## Options

### no-scroll-btn

This options will display the component without scroll buttons

## Props & Events emitted

<ComponentPropDoc component="MazCarousel" />