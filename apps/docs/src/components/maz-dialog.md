---
title: MazDialog
description: MazDialog is a standalone dialog component to show important informations to the user or propose specific action. Many options are available. You can hide the header or the footer, full-size layout, differents states etc.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

::: tip
This component uses `<Teleport to="body">` with [MazBackdrop](./maz-backdrop.md), so you can implement this component anywhere and it inherits all its props
:::

## Basic usage

<ComponentDemo expanded>
  <MazBtn @click="isOpen = true">Open Dialog</MazBtn>

  <MazDialog v-model="isOpen" title="Dialog Title">
    <p>
      Your content
    </p>
    <template #footer="{ close }">
      <MazBtn @click="close">
        Confirm
      </MazBtn>
    </template>
  </MazDialog>

<template #code>

```vue
<script setup>
import MazDialog from 'maz-ui/components/MazDialog'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <MazBtn @click="isOpen = true">
    Open Dialog
  </MazBtn>

  <MazDialog v-model="isOpen" title="Dialog Title">
    <p>
      Your content
    </p>

    <template #footer="{ close }">
      <MazBtn @click="close">
        Confirm
      </MazBtn>
    </template>
  </MazDialog>
</template>
```

  </template>
</ComponentDemo>

## Scrollable

For long content, you can enable scrolling in content part (Header and footer slot remain visible at top and bottom)

<ComponentDemo>
  <MazBtn @click="scollableOpened = true">Open Scrollable Dialog</MazBtn>

  <MazDialog v-model="scollableOpened" title="Dialog Title" max-height="400px" scrollable>
    <template #title>
      Scrollable Dialog Title
    </template>
    <template #default>
      <p v-for="i in 40" :key="i" style="padding-bottom: 2rem;">
        Scroll down
      </p>
    </template>
    <template #footer>
      <MazBtn @click="scollableOpened = false">
        Confirm
      </MazBtn>
    </template>
  </MazDialog>

<template #code>

```html
<MazDialog v-model="scollableOpened" title="Dialog Title" max-height="400px" scrollable>
  <template #title> Scrollable Dialog Title </template>

  <template #default>
    <p v-for="i in 40" :key="i" style="padding-bottom: 2rem">Scroll down</p>
  </template>

  <template #footer>
    <MazBtn @click="scollableOpened = false"> Confirm </MazBtn>
  </template>
</MazDialog>
```

  </template>
</ComponentDemo>

<!--@include: ./../../.vitepress/generated-docs/maz-dialog.doc.md-->

<script setup>
  import { ref } from 'vue'
  const isOpen = ref(false)
  const scollableOpened = ref(false)
</script>
