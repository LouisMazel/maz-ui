---
title: MazTabs
description: MazTabs is a stand-alone component replaces the standard html input checkbox. Color option available
---

# MazTabs

## Basic usage

<br />

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

<ComponentPropDoc component="MazTabsBar" />

### MazTabsContent

<ComponentPropDoc component="MazTabsContent" />

### MazTabsContentItem

<ComponentPropDoc component="MazTabsContentItem" />