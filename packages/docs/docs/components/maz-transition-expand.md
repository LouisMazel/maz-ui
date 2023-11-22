---
title: MazTransitionExpand
description: MazTransitionExpand is a standalone component that collapses content with animations
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazBtn @click="isShown = !isShown">Toggle content</MazBtn>

You can change the animation duration with the prop `animation-duration`, should be a string - ex: `"400ms"`

<ClientOnly>
<div class="maz-flex maz-flex-col maz-gap-3">
  <MazCardSpotlight class="flex-1" style="padding: 16px;">
    <MazTransitionExpand>
      <div v-if="isShown" class="maz-px-4">
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
  </MazCardSpotlight>
  <MazCardSpotlight class="flex-1" style="padding: 16px;">
    <MazTransitionExpand>
      <div v-if="!isShown" class="maz-px-4">
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
  </MazCardSpotlight>
</div>
</ClientOnly>

```vue
<template>
  <MazBtn @click="isShown = !isShown">Toggle content</MazBtn>

  <div class="flex items-start">
    <MazCardSpotlight class="flex-1">
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
    </MazCardSpotlight>
    <MazCardSpotlight class="flex-1">
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
    </MazCardSpotlight>
  </div>
</template>

<script lang="ts" setup>
  import MazTransitionExpand from 'maz-ui/components/MazTransitionExpand'

  import { ref } from 'vue'
  const isShown = ref(false)
</script>
```

<script lang="ts" setup>
  import { ref } from 'vue'
  const isShown = ref(false)
</script>

<!--@include: ./../.vitepress/generated-docs/maz-transition-expand.doc.md-->
