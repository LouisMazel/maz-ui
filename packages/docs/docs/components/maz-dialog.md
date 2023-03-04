---
title: MazDialog
description: MazDialog is a standalone dialog component to show important informations to the user or propose specific action. Many options available. You can hide the header or the footer, full-size layout, differents states etc.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

::: tip
This component use `<Teleport to="body">` with [MazBackdrop](./maz-backdrop.md), so you can implement this component everywhere and it inherits all his props
:::

## Basic usage

<MazBtn @click="isOpen = true">Open Dialog</MazBtn>

<MazDialog v-model="isOpen" title="Dialog Title">
  <p>
    Your content
  </p>
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

  <MazDialog v-model="isOpen" title="Dialog Title">
    <p>
      Your content
    </p>
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

<!--@include: ./../.vitepress/generated-docs/maz-dialog.doc.md-->
