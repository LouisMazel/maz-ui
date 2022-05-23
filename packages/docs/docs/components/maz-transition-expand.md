---
description: MazTransitionExpand is a stand-alone component replaces the standard html button with a beautiful design system. Many options like colors, sizes, disabled state, loading state, includes icons. Support of router-link and nuxt-link
---

# MazTransitionExpand

> Before you have to import the global css files in your project, follow instructions in [Getting Started](./../guide/getting-started.md)

## Basic usage

<br />

<MazBtn @click="isShown = !isShown">Toggle content</MazBtn>

<br />
<br />

<ClientOnly>
<div class="flex items-start gap-05">
  <MazCard class="flex-1">
    <MazTransitionExpand>
      <div v-if="isShown">
        <p>content 1</p>
        <p>content 1</p>
        <p>content 1</p>
        <p>content 1</p>
        <p>content 1</p>
        <p>content 1</p>
        <p>content 1</p>
        <p>content 1</p>
        <p>content 1</p>
        <p>content 1</p>
        <p>content 1</p>
        <p>content 1</p>
      </div>
    </MazTransitionExpand>
  </MazCard>
  <MazCard class="flex-1">
    <MazTransitionExpand>
      <div v-if="!isShown">
        <p>content 2</p>
        <p>content 2</p>
        <p>content 2</p>
        <p>content 2</p>
        <p>content 2</p>
        <p>content 2</p>
        <p>content 2</p>
        <p>content 2</p>
        <p>content 2</p>
        <p>content 2</p>
        <p>content 2</p>
        <p>content 2</p>
      </div>
    </MazTransitionExpand>
  </MazCard>
</div>
</ClientOnly>

```vue
<template>
  <MazBtn @click="isShown = !isShown">Toggle content</MazBtn>

  <div class="flex items-start">
    <MazCard class="flex-1">
      <MazTransitionExpand>
        <div v-if="isShown">
          <p>content 1</p>
          <p>content 1</p>
          <p>content 1</p>
          <p>content 1</p>
          <p>content 1</p>
          <p>content 1</p>
          <p>content 1</p>
          <p>content 1</p>
          <p>content 1</p>
          <p>content 1</p>
          <p>content 1</p>
          <p>content 1</p>
        </div>
      </MazTransitionExpand>
    </MazCard>
    <MazCard class="flex-1">
      <MazTransitionExpand>
        <div v-if="!isShown">
          <p>content 2</p>
          <p>content 2</p>
          <p>content 2</p>
          <p>content 2</p>
          <p>content 2</p>
          <p>content 2</p>
          <p>content 2</p>
          <p>content 2</p>
          <p>content 2</p>
          <p>content 2</p>
          <p>content 2</p>
          <p>content 2</p>
        </div>
      </MazTransitionExpand>
    </MazCard>
  </div>
</template>

<script lang="ts" setup>
  import MazTransitionExpand from 'maz-ui/components/MazTransitionExpand'

  import { ref } from 'vue'
  const isShown = ref(false)
</script>
```

## Props & Events emitted

<ComponentPropDoc component="MazTransitionExpand" />

<script lang="ts" setup>
  import { ref } from 'vue'
  const isShown = ref(false)
</script>