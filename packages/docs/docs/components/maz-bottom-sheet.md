---
title: MazBottomSheet
description: MazBottomSheet is a stand-alone component like a simple dialog but at the bottom of screen
---

# MazBottomSheet

> Before you have to import the global css files in your project, follow instructions in [Getting Started](./../guide/getting-started.md)

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
