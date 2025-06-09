---
title: MazReadingProgressBar
description: MazReadingProgressBar is a standalone component to display a reading progress bar
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

This component use the `<Teleport />` component to move the progress bar to the top of the page. You can set the `teleport-selector` prop to change the target of the teleportation.

## Basic usage

Look at the top of the page to see the component in action (scroll in page to inscrease progress bar width).

<MazReadingProgressBar content-selector=".VPDoc" teleport-selector="#app" />

```vue
<script lang="ts" setup>
import MazReadingProgressBar from 'maz-ui/components/MazReadingProgressBar'
</script>

<template>
  <MazReadingProgressBar content-selector=".VPDoc" teleport-selector="#app" />
</template>
```

## Types

### Props

```ts
export interface Props {
  /**
   * Height of the progress bar
   * @default 4px
   */
  height?: string
  /**
   * Color of the progress bar
   * @default primary
   */
  color?: Color
  /**
   * Selector of the element to teleport the progress bar
   * @default body
   */
  teleportSelector?: string
  /**
   * Selector of the element to get the height
   * @default body
   */
  contentSelector?: string
  /**
   * Offset of the progress bar
   * @default 0
   */
  offset?: number
  /**
   * Class of the progress bar
   * @default undefined
   */
  barClass?: HTMLAttributes['class']
  /**
   * Instead of using the height of the content with a selector, you can set a scroll distance
   * @default undefined
   */
  distance?: number
}
```

<!--@include: ./../.vitepress/generated-docs/maz-reading-progress-bar.doc.md-->
