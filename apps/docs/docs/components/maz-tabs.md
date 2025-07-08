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
<script lang="ts" setup>
import { MazTabs, MazTabsBar, type MazTabsBarItem, MazTabsContent, MazTabsContentItem } from 'maz-ui/components'

const tabs: MazTabsBarItem[] = [
  { label: 'First Tab', disabled: false },
  { label: 'Second Tab', disabled: false, badge: { color: 'destructive', content: 1, roundedSize: 'full' } },
  { label: 'Third Tab', disabled: true },
]
</script>

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
```

## With model-value

<MazTabs v-model="currentTab">
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

<br />

<MazBtn @click="currentTab = currentTab === 1 ? 2 : 1">
Set model-value to {{currentTab === 1 ? 2 : 1}}
</MazBtn>

::: details View code

```vue
<script lang="ts" setup>
import { ref } from 'vue'

const currentTab = ref(2)

const tabs: MazTabsBarItem[] = ['First Tab', 'Second Tab', 'Third Tab']
</script>

<template>
  <MazTabs v-model="currentTab">
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

  <br>

  <MazBtn @click="currentTab = currentTab === 1 ? 2 : 1">
    Set model-value to {{ currentTab === 1 ? 2 : 1 }}
  </MazBtn>
</template>
```

:::

## Persistent tab

To keep the tab current when the page reloads, you can use the `persistent` props on the component `<MazTabsBar />`.

The component will save the current table index in the URL of the page via a query parameter.

You can choose the name of this query parameter with the props `query-param` `@default 'tab'`

<MazTabs>
  <MazTabsBar :items="tabs2" persistent />

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

## Custom tabs with slot

<MazTabs>
  <MazTabsBar :items="tabs2">
    <template #item="{ item, index, active }">
      {{ item.label }}
      <MazBadge
        size="0.6rem"
        rounded-size="full"
        :color="active ? 'primary' : 'gray'"
      >
        {{ index}}
      </MazBadge>
    </template>
  </MazTabsBar>
</MazTabs>

```html
<MazTabs>
  <MazTabsBar :items="tabs">
    <template #item="{ item, index, active }">
      {{ item.label }}

      <MazBadge size="0.6rem" rounded-size="full" :color="active ? 'primary' : 'gray'"> {{ index }} </MazBadge>
    </template>
  </MazTabsBar>
</MazTabs>
```

<script lang="ts" setup>
  import { ref } from 'vue'

  const currentTab = ref(2)

  const tabs: MazTabsBarItem[] = [
    { label: 'First Tab', disabled: false },
    { label: 'Second Tab', disabled: false, badge: { color: 'destructive', content: 1, roundedSize: 'full' } },
    { label: 'Third Tab', disabled: true },
  ]

  const tabs2: MazTabsBarItem[] = ['First Tab', 'Second Tab', 'Third Tab', 'Fourth Tab', 'Fifth Tab', 'Sixth Tab', 'Seventh Tab', 'Eighth Tab', 'Ninth Tab', 'Tenth Tab']
</script>

## Types

```ts
type MazTabsBarItem
  = | {
    /**
     * Label of the tab
     */
    label: string
    /**
     * Will disable the tab
     * @default false
     */
    disabled?: boolean
    /**
     * Badge to display in the tab
     * Inherit all props of MazBadge component
     */
    badge?: MazBadgeProps & {
      /**
       * Content of the badge
       */
      content: string | number | boolean
    }
  }
  | string
```

## Props & Events emitted

## MazTabs

<!--@include: ./../.vitepress/generated-docs/maz-tabs.doc.md-->

## MazTabsBar

<!--@include: ./../.vitepress/generated-docs/maz-tabs-bar.doc.md-->

## MazTabsContent

<!--@include: ./../.vitepress/generated-docs/maz-tabs-content.doc.md-->

## MazTabsContentItem

<!--@include: ./../.vitepress/generated-docs/maz-tabs-content-item.doc.md-->
