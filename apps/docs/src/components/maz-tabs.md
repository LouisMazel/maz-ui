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
    <MazTabsContentItem :tab="1" class="maz:py-4">
      Tab 1
    </MazTabsContentItem>
    <MazTabsContentItem :tab="2" class="maz:py-4">
      Tab 2
    </MazTabsContentItem>
    <MazTabsContentItem :tab="3" class="maz:py-4">
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
      <MazTabsContentItem :tab="1" class="maz:py-4">
        Tab 1
      </MazTabsContentItem>
      <MazTabsContentItem :tab="2" class="maz:py-4">
        Tab 2
      </MazTabsContentItem>
      <MazTabsContentItem :tab="3" class="maz:py-4">
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
    <MazTabsContentItem :tab="1" class="maz:py-4">
      Tab 1
    </MazTabsContentItem>
    <MazTabsContentItem :tab="2" class="maz:py-4">
      Tab 2
    </MazTabsContentItem>
    <MazTabsContentItem :tab="3" class="maz:py-4">
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
      <MazTabsContentItem :tab="1" class="maz:py-4">
        Tab 1
      </MazTabsContentItem>
      <MazTabsContentItem :tab="2" class="maz:py-4">
        Tab 2
      </MazTabsContentItem>
      <MazTabsContentItem :tab="3" class="maz:py-4">
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
    <MazTabsContentItem :tab="1" class="maz:py-4">
      Tab 1
    </MazTabsContentItem>
    <MazTabsContentItem :tab="2" class="maz:py-4">
      Tab 2
    </MazTabsContentItem>
    <MazTabsContentItem :tab="3" class="maz:py-4">
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
        size="mini"
        rounded-size="full"
        :color="active ? 'primary' : 'transparent'"
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

      <MazBadge size="mini" rounded-size="full" :color="active ? 'primary' : 'transparent'"> {{ index }} </MazBadge>
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

  const standaloneModel = ref('weekly')

  const standaloneItems = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ]
</script>

## Size and rounded size

Each tab is rendered with a [`MazBtn`](./maz-btn.md), so you can control its `size` (`MazSize`) and `rounded-size` (`MazRoundedSize`, applied to the bar, the indicator and each tab).

These props can be set on `MazTabsBar` directly, or on `MazTabs` which forwards them to its `MazTabsBar`. They are also globalizable through the [global defaults](./../guide/global-defaults.md) (`MazTabsBar` or `global` entry).

<MazTabs size="sm" rounded-size="lg">
  <MazTabsBar :items="tabs2" />
</MazTabs>

```vue
<template>
  <!-- size & rounded-size forwarded from MazTabs to MazTabsBar -->
  <MazTabs size="sm" rounded-size="lg">
    <MazTabsBar :items="tabs" />
    <!-- ... -->
  </MazTabs>

  <!-- or directly on MazTabsBar -->
  <MazTabsBar :items="tabs" size="lg" rounded-size="full" />
</template>
```

Each item can also override the `size` and `rounded-size` (and accepts every other [`MazBtn`](./maz-btn.md) prop, except `active`, `block`, `type`, `loading` and `fab`).

## Active color

The active tab is highlighted by the indicator. Use the `color` prop (`MazColor`) on `MazTabsBar` (or on `MazTabs`, which forwards it) to color it. When omitted, the default neutral indicator is used.

<MazTabs>
  <MazTabsBar :items="tabs2" color="primary" />
</MazTabs>

```vue
<template>
  <MazTabsBar :items="tabs" color="primary" />
</template>
```

## Standalone usage

`MazTabsBar` can be used on its own, without `MazTabs`, as an independent switcher with its own `v-model`.

::: tip Nested inside a `MazTabs`
If your page is already wrapped by a `MazTabs`, a nested `MazTabsBar` would otherwise be linked to that parent (clicking a tab would change the page). Add the `standalone` prop to make it fully independent (it then ignores the parent's selection, size, rounded-size and color):

```vue
<MazTabsBar v-model="selected" :items="items" standalone />
```
:::

The model returns the `1`-based index of the selected tab, unless the items provide a `value` (`string | number`), in which case that value is returned. The model type is inferred from the items passed: declare the items `as const` (or with literal `value`s) to get a strict union type for the model and the `@update:model-value` event.

<MazTabsBar v-model="standaloneModel" :items="standaloneItems" color="secondary" rounded-size="full" />

<br />

<p>Selected value: <strong>{{ standaloneModel }}</strong></p>

```vue
<script lang="ts" setup>
import { MazTabsBar, type MazTabsBarItem } from 'maz-ui/components'
import { ref } from 'vue'

const selected = ref('weekly')

const items = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
] as const satisfies readonly MazTabsBarItem[]
</script>

<template>
  <MazTabsBar v-model="selected" :items="items" color="secondary" rounded-size="full" />
  <!-- selected & @update:model-value === 'daily' | 'weekly' | 'monthly' -->
</template>
```

When no `value` is set on the items, the model is a number (the `1`-based index):

```vue
<script lang="ts" setup>
const selected = ref(1)
const items = ['First', 'Second', 'Third']
</script>

<template>
  <MazTabsBar v-model="selected" :items="items" />
  <!-- selected === 1 | 2 | 3 -->
</template>
```

## Types

```ts
type MazTabsBarItem<Value extends string | number = string | number>
  // Inherits all MazBtn props except 'active' | 'block' | 'type' | 'loading' | 'fab'
  = | (Omit<MazBtnProps, 'active' | 'block' | 'type' | 'loading' | 'fab'> & {
    /**
     * Label of the tab
     */
    label: string
    /**
     * Value returned by the model when the tab is selected (standalone usage).
     * When omitted, the model returns the 1-based index of the tab.
     */
    value?: Value
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
  })
  | string
```

## Props & Events emitted

## MazTabs

<!--@include: ./../../.vitepress/generated-docs/maz-tabs.doc.md-->

## MazTabsBar

<!--@include: ./../../.vitepress/generated-docs/maz-tabs-bar.doc.md-->

## MazTabsContent

<!--@include: ./../../.vitepress/generated-docs/maz-tabs-content.doc.md-->

## MazTabsContentItem

<!--@include: ./../../.vitepress/generated-docs/maz-tabs-content-item.doc.md-->
