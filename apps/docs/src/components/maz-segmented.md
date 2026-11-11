---
title: MazSegmented
description: MazSegmented is a segmented control to pick one value among a few options, with a sliding indicator, icons, colors and full keyboard navigation. Use it for view modes, filters and settings with two to five choices.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Bind the selected value with `v-model` and describe the segments with `options`. Always name the control with `aria-label` (or `aria-labelledby`).

<ComponentDemo expanded>
  <MazSegmented v-model="period" :options="periodOptions" aria-label="Billing period" />
  <p class="maz:mt-3 maz:text-sm maz:text-muted">Selected: {{ period }}</p>

  <template #code>

```vue
<script lang="ts" setup>
import MazSegmented from 'maz-ui/components/MazSegmented'
import { ref } from 'vue'

const period = ref('monthly')

const periodOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' },
]
</script>

<template>
  <MazSegmented v-model="period" :options="periodOptions" aria-label="Billing period" />
</template>
```

  </template>
</ComponentDemo>

An option is `{ label?, value, icon?, ariaLabel?, title?, disabled? }`. The `value` can be a string, a number or a boolean, and `v-model` has the same type. The `change` event is emitted with the new value when the user selects a segment.

## Icons

Add an `icon` before the label, or use an icon alone. A segment with an icon only has no text for assistive technologies: **`ariaLabel` is required** on it. Hover hints are not a replacement, but they help sighted users: the `title` of an option shows as a native tooltip (with a keyboard shortcut, for example).

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <MazSegmented v-model="view" :options="viewOptions" aria-label="Display mode" />
    <MazSegmented v-model="theme" :options="themeOptions" aria-label="Color mode" />
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { MazComputerDesktop } from '@maz-ui/icons/static/MazComputerDesktop'
import { MazListBullet } from '@maz-ui/icons/static/MazListBullet'
import { MazMoon } from '@maz-ui/icons/static/MazMoon'
import { MazSquares2x2 } from '@maz-ui/icons/static/MazSquares2x2'
import { MazSun } from '@maz-ui/icons/static/MazSun'
import MazSegmented from 'maz-ui/components/MazSegmented'
import { ref } from 'vue'

const view = ref('list')
const theme = ref('auto')

// Icons only: `ariaLabel` names each segment
const viewOptions = [
  { icon: MazListBullet, value: 'list', ariaLabel: 'List view', title: 'List view' },
  { icon: MazSquares2x2, value: 'grid', ariaLabel: 'Grid view', title: 'Grid view' },
]

// Icon + label: the label is the accessible name
const themeOptions = [
  { icon: MazSun, label: 'Light', value: 'light' },
  { icon: MazMoon, label: 'Dark', value: 'dark' },
  { icon: MazComputerDesktop, label: 'Auto', value: 'auto' },
]
</script>

<template>
  <MazSegmented v-model="view" :options="viewOptions" aria-label="Display mode" />
  <MazSegmented v-model="theme" :options="themeOptions" aria-label="Color mode" />
</template>
```

  </template>
</ComponentDemo>

`icon` also accepts an object of [MazIcon](./maz-icon.md) props (`{ icon, size, ... }`) to fine-tune a single icon.

## Colors

Without `color`, the selected segment is a neutral raised surface, like the native segmented controls. With `color`, the selected segment is filled with the color and its `-foreground`.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3">
    <MazSegmented v-model="status" :options="statusOptions" aria-label="Status (neutral)" />
    <MazSegmented v-for="color in colors" :key="color" v-model="status" :options="statusOptions" :color="color" :aria-label="`Status (${color})`" />
  </div>

  <template #code>

```vue
<template>
  <!-- Neutral raised segment -->
  <MazSegmented v-model="status" :options="statusOptions" aria-label="Status" />

  <MazSegmented v-model="status" :options="statusOptions" color="primary" aria-label="Status" />
  <MazSegmented v-model="status" :options="statusOptions" color="success" aria-label="Status" />
  <MazSegmented v-model="status" :options="statusOptions" color="destructive" aria-label="Status" />
</template>
```

  </template>
</ComponentDemo>

Available colors: `primary`, `secondary`, `accent`, `info`, `success`, `warning`, `destructive` and `contrast`.

## Sizes

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3">
    <MazSegmented v-for="size in sizes" :key="size" v-model="sizeValue" :options="sizeOptions" :size="size" :aria-label="`Size ${size}`" />
  </div>

  <template #code>

```vue
<template>
  <MazSegmented v-model="value" :options="options" size="mini" aria-label="Mini" />
  <MazSegmented v-model="value" :options="options" size="xs" aria-label="Extra small" />
  <MazSegmented v-model="value" :options="options" size="sm" aria-label="Small" />
  <MazSegmented v-model="value" :options="options" size="md" aria-label="Medium" />
  <MazSegmented v-model="value" :options="options" size="lg" aria-label="Large" />
  <MazSegmented v-model="value" :options="options" size="xl" aria-label="Extra large" />
</template>
```

  </template>
</ComponentDemo>

Each size has the height of the `MazBtn` of the same size, so a segmented control and buttons line up in a toolbar.

## Rounded size

`rounded-size` applies to the control and to its segments: `none`, `sm`, `md` (default), `lg`, `xl` or `full` for a pill.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3">
    <MazSegmented v-model="roundedValue" :options="roundedOptions" rounded-size="none" aria-label="Square" />
    <MazSegmented v-model="roundedValue" :options="roundedOptions" rounded-size="xl" aria-label="Extra rounded" />
    <MazSegmented v-model="roundedValue" :options="roundedOptions" rounded-size="full" color="primary" aria-label="Pill" />
  </div>

  <template #code>

```vue
<template>
  <MazSegmented v-model="value" :options="options" rounded-size="none" aria-label="Square" />
  <MazSegmented v-model="value" :options="options" rounded-size="xl" aria-label="Extra rounded" />
  <MazSegmented v-model="value" :options="options" rounded-size="full" color="primary" aria-label="Pill" />
</template>
```

  </template>
</ComponentDemo>

## Block

`block` takes the full width of the container, and the segments share it equally. Handy in a dialog, a drawer or a mobile layout.

<ComponentDemo>
  <div class="maz:max-w-md">
    <MazSegmented v-model="period" :options="periodOptions" block aria-label="Billing period" />
  </div>

  <template #code>

```vue
<template>
  <div class="max-w-md">
    <MazSegmented v-model="period" :options="periodOptions" block aria-label="Billing period" />
  </div>
</template>
```

  </template>
</ComponentDemo>

## Disabled

`disabled` on the control disables every segment. An option with `disabled: true` disables only that segment: the keyboard navigation skips it.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <MazSegmented v-model="plan" :options="planOptions" aria-label="Plan" />
    <MazSegmented v-model="plan" :options="planOptions" disabled aria-label="Plan (disabled)" />
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import MazSegmented from 'maz-ui/components/MazSegmented'
import { ref } from 'vue'

const plan = ref('pro')

const planOptions = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
  // Not available yet: skipped by the arrow keys
  { label: 'Enterprise', value: 'enterprise', disabled: true },
]
</script>

<template>
  <MazSegmented v-model="plan" :options="planOptions" aria-label="Plan" />

  <!-- The whole control -->
  <MazSegmented v-model="plan" :options="planOptions" disabled aria-label="Plan" />
</template>
```

  </template>
</ComponentDemo>

## Custom segment content

The `item` slot replaces the content of a segment. It receives the `option` and `selected`, so you can show a count, a badge or a different icon for the selected state. Keep it non-interactive: the segment is already a button.

<ComponentDemo>
  <MazSegmented v-model="inbox" :options="inboxOptions" aria-label="Inbox filter">
    <template #item="{ option, selected }">
      <span class="maz:flex maz:items-center maz:gap-1.5">
        {{ option.label }}
        <span
          class="maz:rounded-full maz:px-1.5 maz:text-xs maz:tabular-nums"
          :class="selected ? 'maz:bg-primary maz:text-primary-foreground' : 'maz:bg-foreground/10 maz:text-muted'"
        >
          {{ counts[option.value] }}
        </span>
      </span>
    </template>
  </MazSegmented>

  <template #code>

```vue
<script lang="ts" setup>
import MazSegmented from 'maz-ui/components/MazSegmented'
import { ref } from 'vue'

const inbox = ref('all')

const inboxOptions = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Mentions', value: 'mentions' },
]

const counts = { all: 128, unread: 12, mentions: 3 }
</script>

<template>
  <MazSegmented v-model="inbox" :options="inboxOptions" aria-label="Inbox filter">
    <template #item="{ option, selected }">
      <span class="flex items-center gap-1.5">
        {{ option.label }}
        <span
          class="rounded-full px-1.5 text-xs tabular-nums"
          :class="selected ? 'bg-primary text-primary-foreground' : 'bg-foreground/10 text-muted'"
        >
          {{ counts[option.value] }}
        </span>
      </span>
    </template>
  </MazSegmented>
</template>
```

  </template>
</ComponentDemo>

## Global defaults

`size` and `roundedSize` can be set once for every `MazSegmented` through the [global defaults](./../guide/global-defaults.md), and a prop on an instance still wins.

```ts
app.use(MazUi, {
  defaults: {
    MazSegmented: { size: 'sm', roundedSize: 'full' },
  },
})
```

## Accessibility

- The control is a `role="radiogroup"` and each segment a `role="radio"` with `aria-checked`: assistive technologies announce "Grid view, radio button, 2 of 2".
- Name the group with `aria-label`, or with `aria-labelledby` pointing at a visible label. Name icon-only segments with the `ariaLabel` of the option.
- Roving tabindex: a single `Tab` stop for the whole control, on the selected segment (or the first enabled one when nothing is selected).
- Keyboard: `ArrowRight` and `ArrowDown` select the next segment, `ArrowLeft` and `ArrowUp` the previous one, `Home` and `End` the first and the last. Arrows are mirrored in right-to-left languages. Moving the focus selects the segment, like a native radio group, and wraps around at the ends.
- Disabled segments are skipped by the keyboard and keep `disabled`.
- The sliding indicator is decorative (`aria-hidden`), and the selected state does not rely on the color alone: the selected segment is also raised or filled.
- Use it for two to five short choices that apply immediately. For navigation between panels use [MazTabs](./maz-tabs.md), for a long list of choices [MazSelect](./maz-select.md), and for an independent on/off setting [MazSwitch](./maz-switch.md).

<script lang="ts" setup>
import { MazComputerDesktop } from '@maz-ui/icons/static/MazComputerDesktop'
import { MazListBullet } from '@maz-ui/icons/static/MazListBullet'
import { MazMoon } from '@maz-ui/icons/static/MazMoon'
import { MazSquares2x2 } from '@maz-ui/icons/static/MazSquares2x2'
import { MazSun } from '@maz-ui/icons/static/MazSun'
import { ref } from 'vue'

const period = ref('monthly')
const periodOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' },
]

const view = ref('list')
const viewOptions = [
  { icon: MazListBullet, value: 'list', ariaLabel: 'List view' },
  { icon: MazSquares2x2, value: 'grid', ariaLabel: 'Grid view' },
]

const theme = ref('auto')
const themeOptions = [
  { icon: MazSun, label: 'Light', value: 'light' },
  { icon: MazMoon, label: 'Dark', value: 'dark' },
  { icon: MazComputerDesktop, label: 'Auto', value: 'auto' },
]

const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'destructive', 'contrast']
const status = ref('active')
const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Paused', value: 'paused' },
  { label: 'Archived', value: 'archived' },
]

const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
const sizeValue = ref('b')
const sizeOptions = [
  { label: 'Day', value: 'a' },
  { label: 'Week', value: 'b' },
  { label: 'Month', value: 'c' },
]

const roundedValue = ref('b')
const roundedOptions = sizeOptions

const plan = ref('pro')
const planOptions = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise', disabled: true },
]

const inbox = ref('all')
const inboxOptions = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Mentions', value: 'mentions' },
]
const counts = { all: 128, unread: 12, mentions: 3 }
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-segmented.doc.md-->
