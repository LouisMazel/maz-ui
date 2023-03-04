---
title: MazTabs
description: MazTabs is a standalone component to display content in tabs with animations
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

<div style="position: relative;">
  <MazTabsBar :items="tabs" color="secondary" />
  <MazTabsContent>
    <MazTabsContentItem :tab="1">
      <p> evzionfez </p>
    </MazTabsContentItem>
    <MazTabsContentItem :tab="2">
      <p> evzionfez </p>
    </MazTabsContentItem>
  </MazTabsContent>
</div>

```vue
<template>
  <MazTabsBar :items="tabs" color="secondary" />
</template>

<script lang="ts" setup>
  import MazTabsBar, { MazTabsItem } from 'maz-ui/components/MazTabsBar'
  import MazTabsContent from 'maz-ui/components/MazTabsContent'
  import MazTabsContentItem from 'maz-ui/components/MazTabsContentItem'

  const tabs: MazTabsItem[] = [
    { label: 'First Tab', disabled: false },
    { label: 'Second Tab', disabled: false }
  ]
</script>
```

<script lang="ts" setup>
  import { MazTabsItem } from 'maz-ui/components/MazTabsBar'

  const tabs: MazTabsItem[] = [
    { label: 'First Tab', disabled: false },
    { label: 'Second Tab', disabled: false }
  ]
</script>

## Props & Events emitted

### MazTabsBar

<!--@include: ./../.vitepress/generated-docs/maz-tabs-bar.doc.md-->

### MazTabsContent

<!--@include: ./../.vitepress/generated-docs/maz-tabs-content.doc.md-->

### MazTabsContentItem

<!--@include: ./../.vitepress/generated-docs/maz-tabs-content-item.doc.md-->
