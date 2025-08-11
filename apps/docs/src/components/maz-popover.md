---
title: MazPopover
description: MazPopover is a versatile Vue component for displaying content in overlays that bypass overflow constraints of parent elements
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

<ComponentDemo>
  <div class="maz-flex maz-gap-4 maz-flex-wrap">
    <MazPopover trigger="click">
      <template #trigger>
        <MazBtn>
          Click me
        </MazBtn>
      </template>
      <div class="maz-p-4">
        <h3 class="maz-text-lg maz-font-semibold maz-mb-2">Popover Content</h3>
        <p class="maz-text-sm">This is the content inside the popover.</p>
      </div>
    </MazPopover>
    <MazPopover trigger="hover">
      <template #trigger>
        <MazBtn color="secondary">
          Hover me
        </MazBtn>
      </template>
      <div class="maz-p-4">
        <p class="maz-text-sm">This popover appears on hover!</p>
      </div>
    </MazPopover>
    <MazPopover trigger="manual">
      <template #trigger="{ toggle }">
        <MazBtn color="accent" @click="toggle">
          Manual trigger
        </MazBtn>
      </template>
      <div class="maz-p-4">
        <p class="maz-text-sm">This popover appears manually!</p>
      </div>
    </MazPopover>
  </div>

<template #code>

```vue
<template>
  <MazPopover>
    <template #trigger>
      <MazBtn>
        Click me
      </MazBtn>
    </template>
    <div class="maz-p-4">
      <h3 class="maz-mb-2 maz-text-lg maz-font-semibold">
        Popover Content
      </h3>
      <p class="maz-text-sm">
        This is the content inside the popover.
      </p>
    </div>
  </MazPopover>

  <MazPopover trigger="hover">
    <template #trigger>
      <MazBtn color="secondary">
        Hover me
      </MazBtn>
    </template>
    <div class="maz-p-4">
      <p class="maz-text-sm">
        This popover appears on hover!
      </p>
    </div>
  </MazPopover>
</template>
```

  </template>
</ComponentDemo>

## Adaptive trigger

The `adaptive` trigger mode automatically adapts to the user's device:
- **Desktop**: Uses hover behavior (mouseenter/mouseleave)
- **Mobile/Touch devices**: Uses click behavior

This provides the best user experience across all devices without requiring manual configuration.

<ComponentDemo>
  <div class="maz-flex maz-gap-4 maz-flex-wrap">
    <MazPopover trigger="adaptive">
      <template #trigger>
        <MazBtn color="primary">
          Adaptive Trigger
        </MazBtn>
      </template>
      <div class="maz-p-4">
        <h3 class="maz-text-lg maz-font-semibold maz-mb-2">Smart Behavior</h3>
        <p class="maz-text-sm maz-mb-2">
          On desktop: Hover to open, move away to close
        </p>
        <p class="maz-text-sm">
          On mobile: Tap to open, tap outside to close
        </p>
      </div>
    </MazPopover>
    <MazPopover trigger="adaptive" keep-open-on-hover>
      <template #trigger>
        <MazBtn color="secondary">
          Adaptive + Keep Open
        </MazBtn>
      </template>
      <div class="maz-p-4">
        <p class="maz-text-sm maz-mb-2">
          This combines adaptive behavior with keep-open-on-hover for menus.
        </p>
        <button class="maz-block maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400 maz-rounded">
          Menu Item 1
        </button>
        <button class="maz-block maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400 maz-rounded">
          Menu Item 2
        </button>
      </div>
    </MazPopover>
  </div>

<template #code>

```vue
<template>
  <!-- Basic adaptive trigger -->
  <MazPopover trigger="adaptive">
    <template #trigger>
      <MazBtn color="primary">
        Adaptive Trigger
      </MazBtn>
    </template>
    <div class="maz-p-4">
      <h3 class="maz-text-lg maz-font-semibold maz-mb-2">Smart Behavior</h3>
      <p class="maz-text-sm maz-mb-2">
        On desktop: Hover to open, move away to close
      </p>
      <p class="maz-text-sm">
        On mobile: Tap to open, tap outside to close
      </p>
    </div>
  </MazPopover>

  <!-- Adaptive with keep-open-on-hover for menus -->
  <MazPopover trigger="adaptive" keep-open-on-hover>
    <template #trigger>
      <MazBtn color="secondary">
        Adaptive Menu
      </MazBtn>
    </template>
    <div class="maz-p-4">
      <p class="maz-text-sm maz-mb-2">
        Perfect for dropdown menus that work on all devices
      </p>
      <button class="maz-block maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400 maz-rounded">
        Menu Item 1
      </button>
      <button class="maz-block maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400 maz-rounded">
        Menu Item 2
      </button>
    </div>
  </MazPopover>
</template>
```

  </template>
</ComponentDemo>

## Positions

::: tip

The position prop is used to position the popover relative to the trigger. The chosen position will force the popover to be displayed in the chosen position.

:::

<ComponentDemo>
  <div class="maz-grid maz-grid-cols-2 maz-gap-4 md:maz-grid-cols-4">
    <MazPopover trigger="hover" position="top">
      <template #trigger>
        <MazBtn block>
          Top
        </MazBtn>
      </template>
      <div class="maz-p-3">
        <p class="maz-text-sm">Top positioned popover</p>
      </div>
    </MazPopover>
    <MazPopover trigger="hover" position="bottom">
      <template #trigger>
        <MazBtn block>
          Bottom
        </MazBtn>
      </template>
      <div class="maz-p-3">
        <p class="maz-text-sm">Bottom positioned popover</p>
      </div>
    </MazPopover>
    <MazPopover trigger="hover" position="left">
      <template #trigger>
        <MazBtn block>
          Left
        </MazBtn>
      </template>
      <div class="maz-p-3">
        <p class="maz-text-sm">Left positioned popover</p>
      </div>
    </MazPopover>
    <MazPopover trigger="hover" position="right">
      <template #trigger>
        <MazBtn block>
          Right
        </MazBtn>
      </template>
      <div class="maz-p-3">
        <p class="maz-text-sm">Right positioned popover</p>
      </div>
    </MazPopover>
  </div>

<template #code>

```vue
<template>
  <MazPopover trigger="hover" position="top">
    <template #trigger>
      <MazBtn>Top</MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">
        Top positioned popover
      </p>
    </div>
  </MazPopover>

  <MazPopover trigger="hover" position="bottom">
    <template #trigger>
      <MazBtn>Bottom</MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">
        Bottom positioned popover
      </p>
    </div>
  </MazPopover>

  <MazPopover trigger="hover" position="left">
    <template #trigger>
      <MazBtn>Left</MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">
        Left positioned popover
      </p>
    </div>
  </MazPopover>

  <MazPopover trigger="hover" position="right">
    <template #trigger>
      <MazBtn>Right</MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">
        Right positioned popover
      </p>
    </div>
  </MazPopover>
</template>
```

  </template>
</ComponentDemo>

## Advanced positions

<ComponentDemo>
  <div class="maz-grid maz-grid-cols-2 maz-gap-4 md:maz-grid-cols-3">
    <MazPopover position="top-start">
      <template #trigger>
        <MazBtn block size="sm">
          Top Start
        </MazBtn>
      </template>
      <div class="maz-p-3">
        <p class="maz-text-sm">Top start aligned</p>
      </div>
    </MazPopover>
    <MazPopover position="top-end">
      <template #trigger>
        <MazBtn block size="sm">
          Top End
        </MazBtn>
      </template>
      <div class="maz-p-3">
        <p class="maz-text-sm">Top end aligned</p>
      </div>
    </MazPopover>
    <MazPopover position="bottom-start">
      <template #trigger>
        <MazBtn block size="sm">
          Bottom Start
        </MazBtn>
      </template>
      <div class="maz-p-3">
        <p class="maz-text-sm">Bottom start aligned</p>
      </div>
    </MazPopover>
    <MazPopover position="bottom-end">
      <template #trigger>
        <MazBtn block size="sm">
          Bottom End
        </MazBtn>
      </template>
      <div class="maz-p-3">
        <p class="maz-text-sm">Bottom end aligned</p>
      </div>
    </MazPopover>
    <MazPopover position="left-start">
      <template #trigger>
        <MazBtn block size="sm">
          Left Start
        </MazBtn>
      </template>
      <div class="maz-p-3">
        <p class="maz-text-sm">Left start aligned</p>
      </div>
    </MazPopover>
    <MazPopover position="left-end">
      <template #trigger>
        <MazBtn block size="sm">
          Left End
        </MazBtn>
      </template>
      <div class="maz-p-3">
        <p class="maz-text-sm">Left end aligned</p>
      </div>
    </MazPopover>
    <MazPopover position="right-start">
      <template #trigger>
        <MazBtn block size="sm">
          Right Start
        </MazBtn>
      </template>
      <div class="maz-p-3">
        <p class="maz-text-sm">Right start aligned</p>
      </div>
    </MazPopover>
    <MazPopover position="right-end">
      <template #trigger>
        <MazBtn block size="sm">
          Right End
        </MazBtn>
      </template>
      <div class="maz-p-3">
        <p class="maz-text-sm">Right end aligned</p>
      </div>
    </MazPopover>
    <MazPopover position="auto">
      <template #trigger>
        <MazBtn block size="sm" color="accent">
          Auto Position
        </MazBtn>
      </template>
      <div class="maz-p-3">
        <p class="maz-text-sm">Automatically positioned based on available space</p>
      </div>
    </MazPopover>
  </div>

<template #code>

```vue
<template>
  <MazPopover position="top-start">
    <template #trigger>
      <MazBtn block size="sm">
        Top Start
      </MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">Top start aligned</p>
    </div>
  </MazPopover>
  <MazPopover position="top-end">
    <template #trigger>
      <MazBtn block size="sm">
        Top End
      </MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">Top end aligned</p>
    </div>
  </MazPopover>
  <MazPopover position="bottom-start">
    <template #trigger>
      <MazBtn block size="sm">
        Bottom Start
      </MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">Bottom start aligned</p>
    </div>
  </MazPopover>
  <MazPopover position="bottom-end">
    <template #trigger>
      <MazBtn block size="sm">
        Bottom End
      </MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">Bottom end aligned</p>
    </div>
  </MazPopover>

  <MazPopover position="left-start">
    <template #trigger>
      <MazBtn block size="sm">
        Left Start
      </MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">Left start aligned</p>
    </div>
  </MazPopover>
  <MazPopover position="left-end">
    <template #trigger>
      <MazBtn block size="sm">
        Left End
      </MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">Left end aligned</p>
    </div>
  </MazPopover>

  <MazPopover position="right-start">
    <template #trigger>
      <MazBtn block size="sm">
        Right Start
      </MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">Right start aligned</p>
    </div>
  </MazPopover>
  <MazPopover position="right-end">
    <template #trigger>
      <MazBtn block size="sm">
        Right End
      </MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">Right end aligned</p>
    </div>
  </MazPopover>

  <MazPopover position="auto">
    <template #trigger>
      <MazBtn color="accent">
        Auto Position
      </MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">
        Automatically positioned based on available space
      </p>
    </div>
  </MazPopover>
</template>
```

  </template>
</ComponentDemo>

## Prefer position and fallback position

::: tip

The prefer-position and fallback-position props are used to position the popover relative to the trigger. The prefer-position is the position that will be used if it's available, and the fallback-position is the position that will be used if the prefer-position is not available.

When you not specify a fallback position, the popover will fallback on the best position available.

:::

<ComponentDemo>
  <div class="maz-flex maz-gap-4">
    <MazPopover prefer-position="top-start" fallback-position="bottom-start">
      <template #trigger>
        <MazBtn>
          Prefer position and fallback position
        </MazBtn>
      </template>
      <div class="maz-p-4">
        <p class="maz-text-sm">This popover will prefer the top position, but if it's not available, it will fallback to the bottom position.</p>
      </div>
    </MazPopover>
  </div>

<template #code>

```html
<MazPopover prefer-position="top-start" fallback-position="bottom-start">
  <template #trigger>
    <MazBtn>
      Prefer position and fallback position
    </MazBtn>
  </template>
  <div class="maz-p-4">
    <p class="maz-text-sm">This popover will prefer the top position, but if it's not available, it will fallback to the bottom position.</p>
  </div>
</MazPopover>
```

</template>
</ComponentDemo>


## Colors

<ComponentDemo>
  <div class="maz-flex maz-gap-4 maz-flex-wrap">
    <MazPopover color="background" trigger="hover">
      <template #trigger>
        <MazBtn color="contrast">Background</MazBtn>
      </template>
      <div class="maz-p-4">
        <p class="maz-text-sm">This popover has a default color!</p>
      </div>
    </MazPopover>
    <MazPopover color="primary" trigger="hover">
      <template #trigger>
        <MazBtn color="primary">Primary</MazBtn>
      </template>
      <div class="maz-p-4">
        <p class="maz-text-sm">This popover has a primary color!</p>
      </div>
    </MazPopover>
    <MazPopover color="secondary" trigger="hover">
      <template #trigger>
        <MazBtn color="secondary">Secondary</MazBtn>
      </template>
      <div class="maz-p-4">
        <p class="maz-text-sm">This popover has a secondary color!</p>
      </div>
    </MazPopover>
    <MazPopover color="accent" trigger="hover">
      <template #trigger>
        <MazBtn color="accent">Accent</MazBtn>
      </template>
      <div class="maz-p-4">
        <p class="maz-text-sm">This popover has a accent color!</p>
      </div>
    </MazPopover>
    <MazPopover color="contrast" trigger="hover">
      <template #trigger>
        <MazBtn color="contrast">Contrast</MazBtn>
      </template>
      <div class="maz-p-4">
        <p class="maz-text-sm">This popover has a contrast color!</p>
      </div>
    </MazPopover>
    <MazPopover color="success" trigger="hover">
      <template #trigger>
        <MazBtn color="success">Success</MazBtn>
      </template>
      <div class="maz-p-4">
        <p class="maz-text-sm">This popover has a success color!</p>
      </div>
    </MazPopover>
    <MazPopover color="info" trigger="hover">
      <template #trigger>
        <MazBtn color="info">Info</MazBtn>
      </template>
      <div class="maz-p-4">
        <p class="maz-text-sm">This popover has a info color!</p>
      </div>
    </MazPopover>
    <MazPopover color="destructive" trigger="hover">
      <template #trigger>
        <MazBtn color="destructive">Destructive</MazBtn>
      </template>
      <div class="maz-p-4">
        <p class="maz-text-sm">This popover has a destructive color!</p>
      </div>
    </MazPopover>
    <MazPopover color="warning" trigger="hover">
      <template #trigger>
        <MazBtn color="warning">Warning</MazBtn>
      </template>
      <div class="maz-p-4">
        <p class="maz-text-sm">This popover has a warning color!</p>
      </div>
    </MazPopover>
  </div>

<template #code>

```vue
<template>
  <MazPopover color="background" trigger="hover">
    <template #trigger>
      <MazBtn color="contrast">Background</MazBtn>
    </template>
    <div class="maz-p-4">
      <p class="maz-text-sm">This popover has a default color!</p>
    </div>
  </MazPopover>
  <MazPopover color="primary" trigger="hover">
    <template #trigger>
      <MazBtn color="primary">Primary</MazBtn>
    </template>
    <div class="maz-p-4">
      <p class="maz-text-sm">This popover has a primary color!</p>
    </div>
  </MazPopover>
  <MazPopover color="secondary" trigger="hover">
    <template #trigger>
      <MazBtn color="secondary">Secondary</MazBtn>
    </template>
    <div class="maz-p-4">
      <p class="maz-text-sm">This popover has a secondary color!</p>
    </div>
  </MazPopover>
  <MazPopover color="accent" trigger="hover">
    <template #trigger>
      <MazBtn color="accent">Accent</MazBtn>
    </template>
    <div class="maz-p-4">
      <p class="maz-text-sm">This popover has a accent color!</p>
    </div>
  </MazPopover>
  <MazPopover color="contrast" trigger="hover">
    <template #trigger>
      <MazBtn color="contrast">Contrast</MazBtn>
    </template>
    <div class="maz-p-4">
      <p class="maz-text-sm">This popover has a contrast color!</p>
    </div>
  </MazPopover>
  <MazPopover color="success" trigger="hover">
    <template #trigger>
      <MazBtn color="success">Success</MazBtn>
    </template>
    <div class="maz-p-4">
      <p class="maz-text-sm">This popover has a success color!</p>
    </div>
  </MazPopover>
  <MazPopover color="info" trigger="hover">
    <template #trigger>
      <MazBtn color="info">Info</MazBtn>
    </template>
    <div class="maz-p-4">
      <p class="maz-text-sm">This popover has a info color!</p>
    </div>
  </MazPopover>
  <MazPopover color="destructive" trigger="hover">
    <template #trigger>
      <MazBtn color="destructive">Destructive</MazBtn>
    </template>
    <div class="maz-p-4">
      <p class="maz-text-sm">This popover has a destructive color!</p>
    </div>
  </MazPopover>
  <MazPopover color="warning" trigger="hover">
    <template #trigger>
      <MazBtn color="warning">Warning</MazBtn>
    </template>
    <div class="maz-p-4">
      <p class="maz-text-sm">This popover has a warning color!</p>
    </div>
  </MazPopover>
</template>
```

</template>

</ComponentDemo>

## Tooltip role

A directive is available to more easily add a tooltip to an element, see [vTooltip](./../directives/tooltip.md) for more information.

<ComponentDemo>
  <div class="maz-flex maz-gap-4 maz-flex-wrap maz-items-center">
    <MazPopover role="tooltip" trigger="hover" position="top">
      <template #trigger>
        <MazBtn color="info">
          Hover for tooltip
        </MazBtn>
      </template>
      <div class="maz-p-2">
        <p class="maz-text-xs">This is a tooltip with proper ARIA attributes</p>
      </div>
    </MazPopover>
    <MazPopover
      role="tooltip"
      trigger="hover"
      position="bottom"
      panel-class="!maz-bg-gray-800 !maz-text-white !maz-border-gray-700"
    >
      <template #trigger>
        <span class="maz-underline maz-cursor-help">
          Hover this text
        </span>
      </template>
      <div class="maz-p-2">
        <p class="maz-text-xs">Custom styled tooltip</p>
      </div>
    </MazPopover>
    <MazPopover
      role="tooltip"
      trigger="hover"
      :delay="1000"
      position="right"
    >
      <template #trigger>
        <MazInformationCircle class="maz-cursor-help maz-text-info maz-text-xl" />
      </template>
      <div class="maz-p-2 maz-max-w-48">
        <p class="maz-text-xs">This tooltip has a 1000ms delay before showing</p>
      </div>
    </MazPopover>
  </div>

<template #code>

```vue
<template>
  <MazPopover role="tooltip" trigger="hover" position="top">
    <template #trigger>
      <MazBtn color="info">
        Hover for tooltip
      </MazBtn>
    </template>
    <div class="maz-p-2">
      <p class="maz-text-xs">This is a tooltip with proper ARIA attributes</p>
    </div>
  </MazPopover>
  <MazPopover
    role="tooltip"
    trigger="hover"
    position="bottom"
    panel-class="!maz-bg-gray-800 !maz-text-white !maz-border-gray-700"
  >
    <template #trigger>
      <span class="maz-underline maz-cursor-help">
        Hover this text
      </span>
    </template>
    <div class="maz-p-2">
      <p class="maz-text-xs">Custom styled tooltip</p>
    </div>
  </MazPopover>
  <MazPopover
    role="tooltip"
    trigger="hover"
    :delay="1000"
    position="right"
  >
    <template #trigger>
      <MazInformationCircle class="maz-cursor-help maz-text-info maz-text-xl" />
    </template>
    <div class="maz-p-2 maz-max-w-48">
      <p class="maz-text-xs">This tooltip has a 1000ms delay before showing</p>
    </div>
  </MazPopover>
</template>
```

  </template>
</ComponentDemo>

## Controlled popover

<ComponentDemo>
  <div class="maz-flex maz-gap-4 maz-flex-wrap maz-items-center">
    <MazPopover v-model="isOpen" trigger="manual">
      <template #trigger="{ toggle }">
        <MazBtn @click="toggle">
          Controlled Trigger
        </MazBtn>
      </template>
      <div class="maz-p-4">
        <h4 class="maz-font-semibold maz-mb-2">Controlled Popover</h4>
        <p class="maz-text-sm maz-mb-3">This popover is controlled externally.</p>
        <MazBtn @click="isOpen = false" size="sm" color="destructive">
          Close
        </MazBtn>
      </div>
    </MazPopover>
    <MazBtn @click="isOpen = !isOpen" color="secondary">
      {{ isOpen ? 'Close' : 'Open' }} Popover
    </MazBtn>
    <span class="maz-text-sm maz-text-muted">
      Popover is {{ isOpen ? 'open' : 'closed' }}
    </span>
  </div>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <MazPopover v-model="isOpen" trigger="manual">
    <template #trigger="{ toggle }">
      <MazBtn @click="toggle">
        Controlled Trigger
      </MazBtn>
    </template>
    <div class="maz-p-4">
      <h4 class="maz-font-semibold maz-mb-2">Controlled Popover</h4>
      <p class="maz-text-sm maz-mb-3">This popover is controlled externally.</p>
      <MazBtn @click="isOpen = false" size="sm" color="destructive">
        Close
      </MazBtn>
    </div>
  </MazPopover>
  <MazBtn @click="isOpen = !isOpen" color="secondary">
    {{ isOpen ? 'Close' : 'Open' }} Popover
  </MazBtn>
  <span class="maz-text-sm maz-text-muted">
    Popover is {{ isOpen ? 'open' : 'closed' }}
  </span>

  <MazBtn color="secondary" @click="isOpen = !isOpen">
    {{ isOpen ? 'Close' : 'Open' }} Popover
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Menu example

<ComponentDemo>
  <div class="maz-flex maz-gap-4">
    <MazPopover position="bottom-start">
      <template #trigger>
        <MazBtn>
          <MazIcon name="cog-6-tooth" class="maz-mr-2" />
          Settings
          <MazIcon name="chevron-down" class="maz-ml-2" />
        </MazBtn>
      </template>
      <div class="maz-py-1 maz-min-w-48">
        <button
          v-for="item in menuItems"
          :key="item.label"
          class="maz-w-full maz-px-4 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400 maz-flex maz-items-center maz-gap-2"
          @click="handleMenuClick(item.action)"
        >
          <MazIcon :name="item.icon" class="maz-w-4 maz-h-4" />
          {{ item.label }}
        </button>
      </div>
    </MazPopover>
    <MazPopover position="bottom-end">
      <template #trigger>
        <MazBtn color="transparent" fab :icon="MazEllipsisVertical" />
      </template>
      <div class="maz-py-1 maz-min-w-32">
        <button class="maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400">
          Edit
        </button>
        <button class="maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400">
          Share
        </button>
        <hr class="maz-my-1 maz-border-divider">
        <button class="maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400 maz-text-destructive">
          Delete
        </button>
      </div>
    </MazPopover>
  </div>

<template #code>

```vue
<script setup>
const menuItems = [
  { label: 'Profile', icon: 'user', action: 'profile' },
  { label: 'Settings', icon: 'cog-6-tooth', action: 'settings' },
  { label: 'Sign out', icon: 'arrow-right-on-rectangle', action: 'signout' }
]

function handleMenuClick(action) {
  console.log('Menu action:', action)
}
</script>

<template>
  <MazPopover position="bottom-start">
    <template #trigger>
      <MazBtn>
        <MazIcon name="cog-6-tooth" class="maz-mr-2" />
        Settings
        <MazIcon name="chevron-down" class="maz-ml-2" />
      </MazBtn>
    </template>
    <div class="maz-py-1 maz-min-w-48">
      <button
        v-for="item in menuItems"
        :key="item.label"
        class="maz-w-full maz-px-4 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400 maz-flex maz-items-center maz-gap-2"
        @click="handleMenuClick(item.action)"
      >
        <MazIcon :name="item.icon" class="maz-w-4 maz-h-4" />
        {{ item.label }}
      </button>
    </div>
  </MazPopover>

  <MazPopover position="bottom-end">
    <template #trigger>
      <MazBtn color="transparent" size="sm">
        <MazIcon name="ellipsis-vertical" />
      </MazBtn>
    </template>
    <div class="maz-py-1 maz-min-w-32">
      <button class="maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400">
        Edit
      </button>
      <button class="maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400">
        Share
      </button>
      <hr class="maz-my-1 maz-border-divider">
      <button class="maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400 maz-text-destructive">
        Delete
      </button>
    </div>
  </MazPopover>
</template>
```

  </template>
</ComponentDemo>

## Keep open on hover

> With this option, the popover will stay open when you hover over it (a timeout is used to close the popover after a certain time).

<ComponentDemo>
  <MazPopover position="bottom-end" keep-open-on-hover trigger="hover">
    <template #trigger>
      <MazBtn color="secondary">
        Keep open on hover
      </MazBtn>
    </template>
    <div class="maz-py-1 maz-min-w-32">
      <button class="maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400">
        Edit
      </button>
      <button class="maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400">
        Share
      </button>
      <hr class="maz-my-1 maz-border-divider">
      <button class="maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400 maz-text-destructive">
        Delete
      </button>
    </div>
  </MazPopover>

<template #code>

```vue
<template>
  <MazPopover position="bottom-end" keep-open-on-hover trigger="hover">
    <template #trigger>
      <MazBtn color="secondary">
        Keep open on hover
      </MazBtn>
    </template>
    <div class="maz-py-1 maz-min-w-32">
      <button class="maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400">
        Edit
      </button>
      <button class="maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400">
        Share
      </button>
      <hr class="maz-my-1 maz-border-divider">
      <button class="maz-w-full maz-px-3 maz-py-2 maz-text-left maz-text-sm hover:maz-bg-surface-600 dark:hover:maz-bg-surface-400 maz-text-destructive">
        Delete
      </button>
    </div>
  </MazPopover>
</template>
```

</template>
</ComponentDemo>

## Form example

<ComponentDemo>
  <div class="maz-max-w-md">
    <MazPopover position="bottom-start" :close-on-click-outside="false" :close-on-escape="false">
      <template #trigger>
        <MazBtn block>
          <MazIcon name="plus" class="maz-mr-2" />
          Add Item
        </MazBtn>
      </template>
      <div class="maz-p-4 maz-w-80">
        <h3 class="maz-text-lg maz-font-semibold maz-mb-4">Add New Item</h3>
        <form @submit.prevent="handleSubmit" class="maz-space-y-4">
          <MazInput
            v-model="formData.name"
            label="Name"
            required
          />
          <MazTextarea
            v-model="formData.description"
            label="Description"
            rows="3"
          />
          <div class="maz-flex maz-gap-2">
            <MazBtn type="submit" color="success" size="sm">
              Save
            </MazBtn>
            <MazBtn type="button" color="transparent" size="sm" @click="resetForm">
              Reset
            </MazBtn>
          </div>
        </form>
      </div>
    </MazPopover>
  </div>

<template #code>

```vue
<script setup>
import { reactive } from 'vue'

const formData = reactive({
  name: '',
  description: ''
})

function handleSubmit() {
  console.log('Form submitted:', formData)
  resetForm()
}

function resetForm() {
  formData.name = ''
  formData.description = ''
}
</script>

<template>
  <MazPopover position="bottom-start" :close-on-click-outside="false">
    <template #trigger>
      <MazBtn block>
        <MazIcon name="plus" class="maz-mr-2" />
        Add Item
      </MazBtn>
    </template>
    <div class="maz-w-80 maz-p-4">
      <h3 class="maz-mb-4 maz-text-lg maz-font-semibold">
        Add New Item
      </h3>
      <form class="maz-space-y-4" @submit.prevent="handleSubmit">
        <MazInput
          v-model="formData.name"
          label="Name"
          placeholder="Enter item name"
          required
        />
        <MazTextarea
          v-model="formData.description"
          label="Description"
          placeholder="Enter description"
          rows="3"
        />
        <div class="maz-flex maz-gap-2">
          <MazBtn type="submit" color="success" size="sm">
            Save
          </MazBtn>
          <MazBtn type="button" color="transparent" size="sm" @click="resetForm">
            Reset
          </MazBtn>
        </div>
      </form>
    </div>
  </MazPopover>
</template>
```

  </template>
</ComponentDemo>

## Configuration options

<ComponentDemo>
  <div class="maz-grid maz-grid-cols-1 md:maz-grid-cols-2 maz-gap-4">
    <div>
      <h4 class="maz-font-semibold maz-mb-3">Persistent (no auto-close)</h4>
      <MazPopover persistent>
        <template #trigger>
          <MazBtn color="warning">
            Persistent Popover
          </MazBtn>
        </template>
        <template #default="{ close }">
          <div class="maz-p-4">
            <p class="maz-text-sm maz-mb-3">This popover won't close on click outside or ESC.</p>
              <MazBtn @click="close" size="sm" color="destructive">
                Close manually
              </MazBtn>
          </div>
        </template>
      </MazPopover>
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-3">Custom offset</h4>
      <MazPopover :offset="20" position="top">
        <template #trigger>
          <MazBtn color="accent">
            Large Offset
          </MazBtn>
        </template>
        <div class="maz-p-3">
          <p class="maz-text-sm">20px offset from trigger</p>
        </div>
      </MazPopover>
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-3">Custom styling</h4>
      <MazPopover
        panel-class="maz-bg-gradient-to-r maz-from-purple-500 maz-to-pink-500 maz-text-white maz-border-none"
        position="bottom"
      >
        <template #trigger>
          <MazBtn color="contrast">
            Styled Popover
          </MazBtn>
        </template>
        <div class="maz-p-4">
          <p class="maz-text-sm maz-font-semibold">Beautiful gradient background!</p>
        </div>
      </MazPopover>
    </div>
    <div>
      <h4 class="maz-font-semibold maz-mb-3">Disabled state</h4>
      <MazPopover disabled>
        <template #trigger>
          <MazBtn disabled>
            Disabled Popover
          </MazBtn>
        </template>
        <div class="maz-p-3">
          <p class="maz-text-sm">This won't show</p>
        </div>
      </MazPopover>
    </div>
  </div>

<template #code>

```vue
<template>
  <!-- Persistent popover -->
  <MazPopover persistent>
    <template #trigger>
      <MazBtn color="warning">
        Persistent Popover
      </MazBtn>
    </template>
    <div class="maz-p-4">
      <p class="maz-mb-3 maz-text-sm">
        This popover won't close on click outside or ESC.
      </p>
      <MazBtn size="sm" color="destructive" @click="close">
        Close manually
      </MazBtn>
    </div>
  </MazPopover>

  <!-- Custom offset -->
  <MazPopover :offset="20" position="top">
    <template #trigger>
      <MazBtn color="accent">
        Large Offset
      </MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">
        20px offset from trigger
      </p>
    </div>
  </MazPopover>

  <!-- Custom styling -->
  <MazPopover
    panel-class="maz-bg-gradient-to-r maz-from-purple-500 maz-to-pink-500 maz-text-white maz-border-none"
    position="bottom"
  >
    <template #trigger>
      <MazBtn color="contrast">
        Styled Popover
      </MazBtn>
    </template>
    <div class="maz-p-4">
      <p class="maz-text-sm maz-font-semibold">
        Beautiful gradient background!
      </p>
    </div>
  </MazPopover>

  <!-- Disabled -->
  <MazPopover disabled>
    <template #trigger>
      <MazBtn disabled>
        Disabled Popover
      </MazBtn>
    </template>
    <div class="maz-p-3">
      <p class="maz-text-sm">
        This won't show
      </p>
    </div>
  </MazPopover>
</template>
```

  </template>
</ComponentDemo>

## Events

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazPopover
      @open="onOpen"
      @close="onClose"
      @toggle="onToggle"
    >
      <template #trigger>
        <MazBtn>
          Event Example
        </MazBtn>
      </template>
      <div class="maz-p-4">
        <p class="maz-text-sm">Check the console for events!</p>
      </div>
    </MazPopover>
    <div class="maz-p-4 maz-border dark:maz-bg-surface-400 maz-rounded maz-text-sm">
      <h4 class="maz-font-semibold maz-mb-2">Event Log:</h4>
      <div v-if="events.length === 0" class="maz-text-muted">
        No events yet. Try opening the popover above.
      </div>
      <div v-for="(event, index) in events" :key="index" class="maz-mb-1">
        <span class="maz-font-mono maz-text-primary">{{ event.type }}</span>
        <span class="maz-text-muted maz-ml-2">{{ event.time }}</span>
      </div>
    </div>
  </div>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const events = ref([])

function onOpen() {
  console.log('Popover opened')
  events.value.push({
    type: 'open',
    time: new Date().toLocaleTimeString()
  })
}

function onClose() {
  console.log('Popover closed')
  events.value.push({
    type: 'close',
    time: new Date().toLocaleTimeString()
  })
}

function onToggle(isOpen) {
  console.log('Popover toggled:', isOpen)
  events.value.push({
    type: `toggle (${isOpen ? 'open' : 'close'})`,
    time: new Date().toLocaleTimeString()
  })
}
</script>

<template>
  <MazPopover
    @open="onOpen"
    @close="onClose"
    @toggle="onToggle"
  >
    <template #trigger>
      <MazBtn>
        Event Example
      </MazBtn>
    </template>
    <div class="maz-p-4">
      <p class="maz-text-sm">
        Check the console for events!
      </p>
    </div>
  </MazPopover>
</template>
```

  </template>
</ComponentDemo>

## Position values

- `auto` - Automatically choose best position
- `top`, `bottom`, `left`, `right` - Basic positions
- `top-start`, `top-end` - Top with start/end alignment
- `bottom-start`, `bottom-end` - Bottom with start/end alignment
- `left-start`, `left-end` - Left with start/end alignment
- `right-start`, `right-end` - Right with start/end alignment

## Accessibility

MazPopover follows WAI-ARIA guidelines:

- **Focus management**: Automatically manages focus when opening/closing
- **Keyboard navigation**: Supports Escape key and Tab navigation
- **ARIA attributes**: Proper `role`, `aria-modal`, `aria-labelledby`, etc.
- **Screen reader support**: Appropriate roles for different use cases

### Best practices

- Use `role="tooltip"` for simple informational overlays
- Use `role="dialog"` for interactive content
- Provide meaningful `aria-labelledby` or `aria-describedby` attributes
- Ensure trigger elements are focusable and have proper labels

<script setup>
import { ref, reactive } from 'vue'
import MazPopover from 'maz-ui/src/components/MazPopover.vue'
import { MazInformationCircle, MazEllipsisVertical } from '@maz-ui/icons'

const isOpen = ref(false)
const events = ref([])

const formData = reactive({
  name: '',
  description: ''
})

const menuItems = [
  { label: 'Profile', icon: 'user', action: 'profile' },
  { label: 'Settings', icon: 'cog-6-tooth', action: 'settings' },
  { label: 'Sign out', icon: 'arrow-right-on-rectangle', action: 'signout' }
]

function handleMenuClick(action) {
  console.log('Menu action:', action)
}

function handleSubmit() {
  console.log('Form submitted:', formData)
  resetForm()
}

function resetForm() {
  formData.name = ''
  formData.description = ''
}

function onOpen() {
  console.log('Popover opened')
  events.value.push({
    type: 'open',
    time: new Date().toLocaleTimeString()
  })
}

function onClose() {
  console.log('Popover closed')
  events.value.push({
    type: 'close',
    time: new Date().toLocaleTimeString()
  })
}

function onToggle(isOpenValue) {
  console.log('Popover toggled:', isOpenValue)
  events.value.push({
    type: `toggle (${isOpenValue ? 'open' : 'close'})`,
    time: new Date().toLocaleTimeString()
  })
}
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-popover.doc.md-->
