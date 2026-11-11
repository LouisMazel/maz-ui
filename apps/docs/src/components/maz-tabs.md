---
title: MazTabs
description: MazTabs is a standalone component to display content in tabs with animations
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

<div class="vp-raw">
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
</div>

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
      <MazTabsContentItem :tab="1" class="py-4">
        Tab 1
      </MazTabsContentItem>
      <MazTabsContentItem :tab="2" class="py-4">
        Tab 2
      </MazTabsContentItem>
      <MazTabsContentItem :tab="3" class="py-4">
        Tab 3
      </MazTabsContentItem>
    </MazTabsContent>
  </MazTabs>
</template>
```

## With model-value

<div class="vp-raw">
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
</div>

<br />

<div class="vp-raw">
<MazBtn @click="currentTab = currentTab === 1 ? 2 : 1">
Set model-value to {{currentTab === 1 ? 2 : 1}}
</MazBtn>
</div>

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
      <MazTabsContentItem :tab="1" class="py-4">
        Tab 1
      </MazTabsContentItem>
      <MazTabsContentItem :tab="2" class="py-4">
        Tab 2
      </MazTabsContentItem>
      <MazTabsContentItem :tab="3" class="py-4">
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

<div class="vp-raw">
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
</div>

## Custom tabs with slot

<div class="vp-raw">
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
</div>

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

  const badgeTabs: MazTabsBarItem[] = [
    { label: 'Inbox', badge: { content: 12, color: 'primary', pastel: true, roundedSize: 'full' } },
    { label: 'Mentions', badge: { content: true, color: 'destructive' } },
    { label: 'Archive' },
  ]

  const indicatorTabs: MazTabsBarItem[] = [
    { label: 'Activity', indicator: true },
    { label: 'Messages', indicator: { content: 128, max: 99, color: 'destructive' } },
    { label: 'Updates', indicator: { color: 'success', pulse: true, label: 'New updates' } },
    { label: 'Settings' },
  ]

  const standaloneModel = ref('weekly')

  const standaloneItems = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ]
</script>

## Badges and indicators

Each item can show a **badge** next to its label, or an **indicator** on the top end corner of the tab.

- `badge` renders a [`MazBadge`](./maz-badge.md) (all its props are accepted) with a `content`: a number or a text, `true` for a small dot without text, `false` to hide it.
- `indicator` renders a [`MazIndicator`](./maz-indicator.md) attached to the tab: `true` for a dot, a number or a text for a counter (`99+` above `max`), or an object with all the props of `MazIndicator` (`color`, `max`, `pulse`, `position`, `label`...). Give it a `label` when the indicator carries a meaning the tab label does not say.

<div class="vp-raw maz:flex maz:flex-col maz:items-start maz:gap-4">
  <MazTabsBar :items="badgeTabs" standalone />
  <MazTabsBar :items="indicatorTabs" standalone />
</div>

```vue
<script lang="ts" setup>
import type { MazTabsBarItem } from 'maz-ui/components'

const badgeTabs: MazTabsBarItem[] = [
  { label: 'Inbox', badge: { content: 12, color: 'primary', pastel: true, roundedSize: 'full' } },
  { label: 'Mentions', badge: { content: true, color: 'destructive' } },
  { label: 'Archive' },
]

const indicatorTabs: MazTabsBarItem[] = [
  { label: 'Activity', indicator: true },
  { label: 'Messages', indicator: { content: 128, max: 99, color: 'destructive' } },
  { label: 'Updates', indicator: { color: 'success', pulse: true, label: 'New updates' } },
  { label: 'Settings' },
]
</script>

<template>
  <MazTabsBar :items="badgeTabs" />
  <MazTabsBar :items="indicatorTabs" />
</template>
```

Use the `badge-content` slot to replace the content of a badge, and the `indicator` slot (`{ text, index }`) to replace the text of a counter indicator.

## Size and rounded size

Each tab is rendered with a [`MazBtn`](./maz-btn.md), so you can control its `size` (`MazSize`) and `rounded-size` (`MazRoundedSize`, applied to the bar, the indicator and each tab).

These props can be set on `MazTabsBar` directly, or on `MazTabs` which forwards them to its `MazTabsBar`. They are also globalizable through the [global defaults](./../guide/global-defaults.md) (`MazTabsBar` or `global` entry).

<div class="vp-raw">
<MazTabs size="sm" rounded-size="lg">
  <MazTabsBar :items="tabs2" />
</MazTabs>
</div>

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

<div class="vp-raw">
<MazTabs>
  <MazTabsBar :items="tabs2" color="primary" />
</MazTabs>
</div>

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

<div class="vp-raw">
<MazTabsBar v-model="standaloneModel" :items="standaloneItems" color="secondary" rounded-size="full" />
</div>

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
     * Badge to display in the tab, next to its label
     * Inherit all props of MazBadge component
     */
    badge?: MazBadgeProps & {
      /**
       * Content of the badge. `true` renders a dot without text, `false` hides the badge
       */
      content: string | number | boolean
    }
    /**
     * Indicator on the top end corner of the tab: `true` for a dot,
     * a number or a text for a counter, or the props of MazIndicator
     */
    indicator?: boolean | number | string | MazIndicatorProps
  })
  | string
```

## Accessibility

The tabs follow the [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/):

- `MazTabsBar` is a `tablist` (pass an `aria-label` to name it), each item is a `tab` with `aria-selected`, linked to its `MazTabsContentItem` (`tabpanel`) through `aria-controls` / `aria-labelledby`.
- **Keyboard**: only the selected tab is in the tab sequence, <kbd>←</kbd> / <kbd>→</kbd> select the previous / next tab (reversed in RTL), <kbd>Home</kbd> / <kbd>End</kbd> the first / last one. Disabled tabs are skipped.

## Props & Events emitted

## MazTabs

<!--@include: ./../../.vitepress/generated-docs/maz-tabs.doc.md-->

## MazTabsBar

<!--@include: ./../../.vitepress/generated-docs/maz-tabs-bar.doc.md-->

## MazTabsContent

<!--@include: ./../../.vitepress/generated-docs/maz-tabs-content.doc.md-->

## MazTabsContentItem

<!--@include: ./../../.vitepress/generated-docs/maz-tabs-content-item.doc.md-->
