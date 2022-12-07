---
title: MazBottomSheet
description: MazBottomSheet is a standalone component like a simple dialog but at the bottom of screen
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../mixins/getting-started.md-->

> This component use `<Teleport to="body">`, so you can implement this component everywhere

> This component use [MazBackdrop](./maz-backdrop.md), so it inherits all his props

## Basic usage

<br />

<MazBtn @click="isOpen = true">Open Bottom Sheet</MazBtn>

<MazBottomSheet v-model="isOpen">
  <h3 class="maz-text-center">
    Your content
  </h3>
  <div class="maz-flex maz-flex-center">
    <MazBtn
      outline
      @click="isOpen = false"
    >
      Close Bottom Sheet
    </MazBtn>
  </div>
</MazBottomSheet>

<script setup>
  import { ref } from 'vue'
  const isOpen = ref(false)
</script>

```vue
<template>
  <MazBtn @click="isOpen = true">Open Bottom Sheet</MazBtn>

  <MazBottomSheet v-model="isOpen">
    <h3 class="maz-text-center">
      Your content
    </h3>
    <div class="maz-flex maz-flex-center">
      <MazBtn
        outline
        @click="isOpen = false"
      >
        Close Bottom Sheet
      </MazBtn>
    </div>
  </MazBottomSheet>

  <script setup>
    import { ref } from 'vue'
    import MazBottomSheet from 'maz-ui/components/MazBottomSheet'

    const isOpen = ref(false)
  </script>
</template>
```

## Props & Events emitted

<ComponentPropDoc component="MazBottomSheet" />