---
title: MazDialog
description: MazDialog is a stand-alone dialog component to show important informations to the user or propose specific action. Many options available. You can hide the header or the footer, full-size layout, differents states etc.
---

# MazDialog

> Before you have to import the global css files in your project, follow instructions in [Getting Started](./../guide/getting-started.md)

> This component use `<Teleport to="body">`, so you can implement this component everywhere

## Basic usage

<br />

<MazBtn @click="isOpen = true">Open Dialog</MazBtn>

<MazDialog v-model="isOpen">
  <div class="maz-text-center maz-w-full">
    Your content
  </div>
  <template #footer>
    <MazBtn @click="isOpen = false">
      Confirm
    </MazBtn>
  </template>
</MazDialog>

<script setup>
  import { ref } from 'vue'
  const isOpen = ref(false)
</script>

```vue
<template>
  <MazBtn @click="isOpen = true">Open Dialog</MazBtn>

  <MazDialog v-model="isOpen">
    <div class="maz-text-center maz-w-full">
      Your content
    </div>
    <template #footer>
      <MazBtn @click="isOpen = false">
        Confirm
      </MazBtn>
    </template>
  </MazDialog>
</template>

<script setup>
  import { ref } from 'vue'
  import MazDialog from 'maz-ui/components/MazDialog'

  const isOpen = ref(false)
</script>
```

## Props & Events emitted

<ComponentPropDoc component="MazDialog" />
