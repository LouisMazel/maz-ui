---
title: MazTabs
description: MazTabs is a standalone component to display content in tabs with animations
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

<MazTabs>
  <MazTabsBar :items="tabs" />

  <MazTabsContent>
    <MazTabsContentItem :tab="1" class="maz-py-4">
      Tab 1
    </MazTabsContentItem>
    <MazTabsContentItem :tab="2" class="maz-py-4">
      Tab 2
    </MazTabsContentItem>
    <MazTabsContentItem :tab="3" class="maz-py-4">
      Tab 3
    </MazTabsContentItem>
  </MazTabsContent>
</MazTabs>

```vue
<template>
  <MazTabs>
    <MazTabsBar :items="tabs" />

    <MazTabsContent>
      <MazTabsContentItem :tab="1" class="maz-py-4">
        Tab 1
      </MazTabsContentItem>
      <MazTabsContentItem :tab="2" class="maz-py-4">
        Tab 2
      </MazTabsContentItem>
      <MazTabsContentItem :tab="3" class="maz-py-4">
        Tab 3
      </MazTabsContentItem>
    </MazTabsContent>
  </MazTabs>
</template>

<script lang="ts" setup>
  import MazTabs from 'maz-ui/components/MazTabs'
  import MazTabsBar, { MazTabsBarItem } from 'maz-ui/components/MazTabsBar'
  import MazTabsContent from 'maz-ui/components/MazTabsContent'
  import MazTabsContentItem from 'maz-ui/components/MazTabsContentItem'

  const tabs: MazTabsBarItem[] = [
    { label: 'First Tab', disabled: false },
    { label: 'Second Tab', disabled: false },
    { label: 'Third Tab', disabled: true },
  ]
</script>
```

## With model-value

<MazTabs v-model="currentTab">
  <MazTabsBar :items="tabs2" color="secondary" />

  <MazTabsContent>
    <MazTabsContentItem :tab="1" class="maz-py-4">
      Tab 1
    </MazTabsContentItem>
    <MazTabsContentItem :tab="2" class="maz-py-4">
      Tab 2
    </MazTabsContentItem>
    <MazTabsContentItem :tab="3" class="maz-py-4">
      Tab 3
    </MazTabsContentItem>
  </MazTabsContent>
</MazTabs>

<br />

<MazBtn @click="currentTab = 1">
  Set model-value to 1
</MazBtn>


::: details Show code

```vue
<template>
  <MazTabs v-model="currentTab">
    <MazTabsBar :items="tabs" color="secondary" />

    <MazTabsContent>
      <MazTabsContentItem :tab="1" class="maz-py-4">
        Tab 1
      </MazTabsContentItem>
      <MazTabsContentItem :tab="2" class="maz-py-4">
        Tab 2
      </MazTabsContentItem>
      <MazTabsContentItem :tab="3" class="maz-py-4">
        Tab 3
      </MazTabsContentItem>
    </MazTabsContent>
  </MazTabs>

  <br />

  <MazBtn @click="currentTab = 1">
    Set model-value to 1
  </MazBtn>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const currentTab = ref(2)

  const tabs: MazTabsBarItem[] = ['First Tab', 'Second Tab', 'Third Tab']
</script>
```

:::

## Persistent tab

To keep the tab current when the page reloads, you can use the `persistent` props on the component `<MazTabsBar />`.

The component will save the current table index in the URL of the page via a query parameter.

You can choose the name of this query parameter with the props `query-param` `@default 'tab'`

<MazTabs>
  <MazTabsBar :items="tabs2" color="secondary" persistent />

  <MazTabsContent>
    <MazTabsContentItem :tab="1" class="maz-py-4">
      Tab 1
    </MazTabsContentItem>
    <MazTabsContentItem :tab="2" class="maz-py-4">
      Tab 2
    </MazTabsContentItem>
    <MazTabsContentItem :tab="3" class="maz-py-4">
      Tab 3
    </MazTabsContentItem>
  </MazTabsContent>
</MazTabs>

<script lang="ts" setup>
  import { ref } from 'vue'

  const currentTab = ref(2)

  const tabs: MazTabsBarItem[] = [
    { label: 'First Tab', disabled: false },
    { label: 'Second Tab', disabled: false },
    { label: 'Third Tab', disabled: true },
  ]

  const tabs2: MazTabsBarItem[] = ['First Tab', 'Second Tab', 'Third Tab']
</script>

## Types

```ts
type MazTabsBarItem =
  | {
      label: string
      disabled?: boolean
    }
  | string

type MazTabsBarItems = MazTabsBarItem[]
```

## Props & Events emitted

### MazTabsBar

<!--@include: ./../.vitepress/generated-docs/maz-tabs-bar.doc.md-->

### MazTabsContent

<!--@include: ./../.vitepress/generated-docs/maz-tabs-content.doc.md-->

### MazTabsContentItem

<!--@include: ./../.vitepress/generated-docs/maz-tabs-content-item.doc.md-->
