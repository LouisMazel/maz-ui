---
title: MazTransitionExpand
description: MazTransitionExpand is a standalone component that collapses content with animations
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

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

<script lang="ts" setup>
  import { ref } from 'vue'
  const isShown = ref(false)
</script>

<!--@include: ./../.vitepress/generated-docs/maz-transition-expand.doc.md-->
