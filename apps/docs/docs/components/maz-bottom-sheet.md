---
title: MazBottomSheet
description: MazBottomSheet is a standalone component like a simple dialog but at the bottom of screen. Useful for mobile UX.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

::: tip
This component uses the `<Teleport to="body">` with [MazBackdrop](./maz-backdrop.md), so you can implement this component anywhere and it inherits all its props
:::

## Basic usage

<ComponentDemo expanded>
  <MazBtn @click="isOpen = true">Open Bottom Sheet</MazBtn>

  <MazBottomSheet v-model="isOpen">
    <p style="text-align: center">
      Place your content here
    </p>
  </MazBottomSheet>

  <template #code>

  ```vue
  <template>
    <MazBtn @click="isOpen = true">Open Bottom Sheet</MazBtn>

    <MazBottomSheet v-model="isOpen">
      <p style="text-align: center">
        Place your content here
      </p>
    </MazBottomSheet>

    <script setup>
      import { ref } from 'vue'
      import { MazBtn, MazBottomSheet } from 'maz-ui/components'

      const isOpen = ref(false)
    </script>
  </template>
  ```

  </template>
</ComponentDemo>

<script setup>
  import { ref } from 'vue'
  const isOpen = ref(false)
</script>

<!--@include: ./../.vitepress/generated-docs/maz-bottom-sheet.doc.md-->
