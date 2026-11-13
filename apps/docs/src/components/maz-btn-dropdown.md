---
title: MazBtnDropdown
description: MazBtnDropdown is a split button. The main action is on the left, and its variants are in a menu behind the chevron on the right ("Save" and "Save as draft", "Merge" and "Squash and merge"). It takes the visual props of MazBtn and the menu of MazDropdown.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

::: tip MazBtnDropdown or MazDropdown?
- **MazBtnDropdown**: two buttons. A click on the main action runs it, the chevron opens the menu of its variants.
- **[MazDropdown](./maz-dropdown.md)**: one button, whose only role is to open the menu (a "More" or "Account" menu).
:::

## Basic usage

The default slot is the content of the main action, which emits `click`. The `items` are the variants, listed in the menu of the chevron: they take the same options as the [items of MazDropdown](./maz-dropdown.md) (`label`, `onClick`, `href`, `to`, `target`, `color`, `disabled`...). The menu closes when an item is clicked.

`menu-label` is required: it is the accessible name of the chevron, also shown as its native tooltip.

<ComponentDemo expanded>
  <MazBtnDropdown :items="items" menu-label="Other save options" @click="lastAction = 'Save'">
    Save
  </MazBtnDropdown>

  <p class="maz:mt-2 maz:text-sm maz:text-muted">
    Last action: {{ lastAction }}
  </p>

  <template #code>

```vue
<script lang="ts" setup>
import type { MazBtnDropdownProps } from 'maz-ui/components/MazBtnDropdown'
import MazBtnDropdown from 'maz-ui/components/MazBtnDropdown'
import { ref } from 'vue'

const lastAction = ref('none')

const items: MazBtnDropdownProps['items'] = [
  { label: 'Save as draft', onClick: () => { lastAction.value = 'Save as draft' } },
  { label: 'Save and publish', onClick: () => { lastAction.value = 'Save and publish' } },
  { label: 'Delete', color: 'destructive', onClick: () => { lastAction.value = 'Delete' } },
]
</script>

<template>
  <MazBtnDropdown :items="items" menu-label="Other save options" @click="lastAction = 'Save'">
    Save
  </MazBtnDropdown>
</template>
```

  </template>
</ComponentDemo>

Without `items` (or with an empty array), the chevron is hidden and the component is a simple button with its rounded corners: handy when the variants depend on the context.

## Colors and styles

`color`, `outlined` and `pastel` apply to both parts.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-3">
    <MazBtnDropdown v-for="color in colors" :key="color" :items="items" :color="color" menu-label="Other save options">
      {{ color }}
    </MazBtnDropdown>
  </div>
  <div class="maz:mt-3 maz:flex maz:flex-wrap maz:items-center maz:gap-3">
    <MazBtnDropdown :items="items" outlined menu-label="Other save options">
      Outlined
    </MazBtnDropdown>
    <MazBtnDropdown :items="items" pastel menu-label="Other save options">
      Pastel
    </MazBtnDropdown>
    <MazBtnDropdown :items="items" color="contrast" rounded-size="full" menu-label="Other save options">
      Rounded full
    </MazBtnDropdown>
  </div>

  <template #code>

```vue
<template>
  <MazBtnDropdown :items="items" color="secondary" menu-label="Other save options">
    Save
  </MazBtnDropdown>

  <MazBtnDropdown :items="items" outlined menu-label="Other save options">
    Outlined
  </MazBtnDropdown>

  <MazBtnDropdown :items="items" pastel menu-label="Other save options">
    Pastel
  </MazBtnDropdown>

  <!-- Only the outer corners are rounded -->
  <MazBtnDropdown :items="items" color="contrast" rounded-size="full" menu-label="Other save options">
    Rounded full
  </MazBtnDropdown>
</template>
```

  </template>
</ComponentDemo>

## Sizes

`size` applies to both parts, `items-size` to the items of the menu (`sm` by default).

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-3">
    <MazBtnDropdown v-for="size in sizes" :key="size" :items="items" :size="size" menu-label="Other save options">
      {{ size }}
    </MazBtnDropdown>
  </div>

  <template #code>

```vue
<template>
  <MazBtnDropdown :items="items" size="mini" menu-label="Other save options">
    mini
  </MazBtnDropdown>
  <MazBtnDropdown :items="items" size="xl" items-size="md" menu-label="Other save options">
    xl
  </MazBtnDropdown>
</template>
```

  </template>
</ComponentDemo>

## Icon and full width

`start-icon` adds an icon before the content of the main action. With `block`, the component takes the full width of its container: the main action grows, the chevron keeps its size.

<ComponentDemo>
  <MazBtnDropdown :items="items" :start-icon="MazArrowDownTray" block menu-label="Other download formats">
    Download PDF
  </MazBtnDropdown>

  <template #code>

```vue
<script lang="ts" setup>
import { MazArrowDownTray } from '@maz-ui/icons/raw/MazArrowDownTray'
import MazBtnDropdown from 'maz-ui/components/MazBtnDropdown'

const items = [
  { label: 'Download CSV', onClick: () => {} },
  { label: 'Download XLSX', onClick: () => {} },
]
</script>

<template>
  <MazBtnDropdown :items="items" :start-icon="MazArrowDownTray" block menu-label="Other download formats">
    Download PDF
  </MazBtnDropdown>
</template>
```

  </template>
</ComponentDemo>

## Tooltip

`tooltip` adds a tooltip to the main action only: the chevron keeps its native tooltip, from `menu-label`. It takes a text, or the options of the [v-tooltip directive](../directives/tooltip.md) (`text`, `position`, `color`...).

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-3">
    <MazBtnDropdown :items="items" tooltip="Save the document" menu-label="Other save options">
      Save
    </MazBtnDropdown>
    <MazBtnDropdown :items="items" :tooltip="{ text: 'Publish to production', position: 'bottom', color: 'warning' }" color="warning" menu-label="Other publish options">
      Publish
    </MazBtnDropdown>
  </div>

  <template #code>

```vue
<template>
  <MazBtnDropdown :items="items" tooltip="Save the document" menu-label="Other save options">
    Save
  </MazBtnDropdown>

  <MazBtnDropdown
    :items="items"
    :tooltip="{ text: 'Publish to production', position: 'bottom', color: 'warning' }"
    color="warning"
    menu-label="Other publish options"
  >
    Publish
  </MazBtnDropdown>
</template>
```

  </template>
</ComponentDemo>

## Trigger and position

By default, the menu opens on click of the chevron. Set `trigger` to `hover`, or to `adaptive` (hover on desktop, click on touch devices). `position` places the menu relative to the chevron (`bottom-end` by default).

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-3">
    <MazBtnDropdown :items="items" trigger="hover" menu-label="Other save options">
      Hover
    </MazBtnDropdown>
    <MazBtnDropdown :items="items" trigger="adaptive" position="top-start" menu-label="Other save options">
      Adaptive, on top
    </MazBtnDropdown>
  </div>

  <template #code>

```vue
<template>
  <MazBtnDropdown :items="items" trigger="hover" menu-label="Other save options">
    Hover
  </MazBtnDropdown>

  <MazBtnDropdown :items="items" trigger="adaptive" position="top-start" menu-label="Other save options">
    Adaptive, on top
  </MazBtnDropdown>
</template>
```

  </template>
</ComponentDemo>

## Loading and disabled states

- `loading` shows the loader of the main action only.
- `disabled` disables both parts.
- `action-disabled` disables only the main action, the menu stays usable: the main target is not available, but its variants are.
- `menu-disabled` disables only the chevron.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-3">
    <MazBtnDropdown :items="items" loading menu-label="Other save options">
      Loading
    </MazBtnDropdown>
    <MazBtnDropdown :items="items" disabled menu-label="Other save options">
      Disabled
    </MazBtnDropdown>
    <MazBtnDropdown :items="items" action-disabled menu-label="Other save options">
      Action disabled
    </MazBtnDropdown>
    <MazBtnDropdown :items="items" menu-disabled menu-label="Other save options">
      Menu disabled
    </MazBtnDropdown>
  </div>

  <template #code>

```vue
<template>
  <MazBtnDropdown :items="items" loading menu-label="Other save options">
    Loading
  </MazBtnDropdown>
  <MazBtnDropdown :items="items" disabled menu-label="Other save options">
    Disabled
  </MazBtnDropdown>
  <MazBtnDropdown :items="items" action-disabled menu-label="Other save options">
    Action disabled
  </MazBtnDropdown>
  <MazBtnDropdown :items="items" menu-disabled menu-label="Other save options">
    Menu disabled
  </MazBtnDropdown>
</template>
```

  </template>
</ComponentDemo>

## In a form

Set `type="submit"` to submit a form with the main action. The chevron never submits the form.

```vue
<template>
  <form @submit.prevent="save">
    <MazInput v-model="title" label="Title" />

    <MazBtnDropdown type="submit" :items="items" menu-label="Other save options">
      Save
    </MazBtnDropdown>
  </form>
</template>
```

## Custom item labels

The `menuitem-label` slot replaces the label of each item. It receives `{ item }`.

<ComponentDemo>
  <MazBtnDropdown :items="shortcutItems" menu-label="Other save options">
    Save
    <template #menuitem-label="{ item }">
      <span class="maz:flex maz:w-full maz:items-center maz:justify-between maz:gap-4">
        {{ item.label }}
        <kbd class="maz:text-xs maz:text-muted">{{ item.shortcut }}</kbd>
      </span>
    </template>
  </MazBtnDropdown>

  <template #code>

```vue
<script lang="ts" setup>
import MazBtnDropdown from 'maz-ui/components/MazBtnDropdown'

const items = [
  { label: 'Save as draft', shortcut: '⌘ D', onClick: () => {} },
  { label: 'Save and publish', shortcut: '⌘ ⇧ S', onClick: () => {} },
]
</script>

<template>
  <MazBtnDropdown :items="items" menu-label="Other save options">
    Save
    <template #menuitem-label="{ item }">
      <span class="flex w-full items-center justify-between gap-4">
        {{ item.label }}
        <kbd class="text-xs text-muted">{{ item.shortcut }}</kbd>
      </span>
    </template>
  </MazBtnDropdown>
</template>
```

  </template>
</ComponentDemo>

## Global defaults

`size` and `roundedSize` can be set for every instance with the [global defaults](../guide/global-defaults.md), under the `MazBtnDropdown` key (or `global` for every component).

```ts
app.use(MazUi, {
  defaults: {
    MazBtnDropdown: { size: 'sm', roundedSize: 'full' },
  },
})
```

## Accessibility

- The two parts are wrapped in an element with `role="group"`. Name the group with `aria-label` when the page has several split buttons.
- The chevron is a real button named by `menu-label`, with `aria-haspopup="menu"` and `aria-expanded`. Give `menu-label` in the language of the page and describe the variants ("Other save options"), not the icon ("Chevron").
- The menu is the one of [MazDropdown](./maz-dropdown.md#accessibility): keyboard navigation with the arrow keys, `Escape` to close it.

<script lang="ts" setup>
import { MazArrowDownTray } from '@maz-ui/icons/raw/MazArrowDownTray'
import { ref } from 'vue'

const lastAction = ref('none')

const items = [
  { label: 'Save as draft', onClick: () => { lastAction.value = 'Save as draft' } },
  { label: 'Save and publish', onClick: () => { lastAction.value = 'Save and publish' } },
  { label: 'Delete', color: 'destructive', onClick: () => { lastAction.value = 'Delete' } },
]

const shortcutItems = [
  { label: 'Save as draft', shortcut: '⌘ D', onClick: () => { lastAction.value = 'Save as draft' } },
  { label: 'Save and publish', shortcut: '⌘ ⇧ S', onClick: () => { lastAction.value = 'Save and publish' } },
]

const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'destructive', 'contrast']
const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-btn-dropdown.doc.md-->
