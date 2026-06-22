---
title: MazBottomSheet
description: MazBottomSheet is a standalone component like a simple dialog but anchored at the bottom of the screen. Full-width on mobile and constrained/centered on desktop, with a header (icon, title, close button), a footer and many replaceable slots. Useful for mobile UX.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

::: tip
This component uses the `<Teleport to="body">` with [MazBackdrop](./maz-backdrop.md), so you can implement this component anywhere and it inherits all its props (`persistent`, `closeOnEscape`, etc.)
:::

## Basic usage

The sheet has a header (with the `title` and a close button) and an optional `footer` slot. It opens full-width on mobile and is constrained/centered on desktop (see [Max width](#max-width)).

<ComponentDemo expanded>
  <MazBtn @click="basicOpened = true">Open Bottom Sheet</MazBtn>

  <MazBottomSheet v-model="basicOpened" title="Bottom Sheet Title">
    <p>Your content goes here.</p>
    <template #footer="{ close }">
      <MazBtn color="transparent" @click="close">Cancel</MazBtn>
      <MazBtn @click="close">Confirm</MazBtn>
    </template>
  </MazBottomSheet>

<template #code>

```vue
<script setup>
import MazBottomSheet from 'maz-ui/components/MazBottomSheet'
import { ref } from 'vue'

const basicOpened = ref(false)
</script>

<template>
  <MazBtn @click="basicOpened = true">
    Open Bottom Sheet
  </MazBtn>

  <MazBottomSheet v-model="basicOpened" title="Bottom Sheet Title">
    <p>Your content goes here.</p>

    <template #footer="{ close }">
      <MazBtn color="transparent" @click="close">
        Cancel
      </MazBtn>
      <MazBtn @click="close">
        Confirm
      </MazBtn>
    </template>
  </MazBottomSheet>
</template>
```

  </template>
</ComponentDemo>

## Swipe to close (iOS-like)

By default a drag handle (grab bar) is shown at the top of the sheet, and you can **close the sheet by dragging that handle down** - the sheet follows your pointer and either dismisses (past the threshold) or snaps back. This works with both touch and mouse.

Disable it with `:swipe-to-close="false"` (the handle is then hidden too), or replace the handle with the `#handle` slot. A `persistent` sheet never dismisses on swipe: it snaps back instead.

<ComponentDemo>
  <MazBtn @click="swipeOpened = true">Open swipeable sheet</MazBtn>

  <MazBottomSheet v-model="swipeOpened" title="Drag me down">
    <p>Grab the bar at the top and drag down to close, or release before the threshold to snap back.</p>
  </MazBottomSheet>

<template #code>

```html
<!-- enabled by default -->
<MazBottomSheet v-model="swipeOpened" title="Drag me down">
  <p>Grab the bar at the top and drag down to close.</p>
</MazBottomSheet>

<!-- disable the handle and the gesture -->
<MazBottomSheet v-model="swipeOpened" :swipe-to-close="false" title="No swipe" />

<!-- custom handle -->
<MazBottomSheet v-model="swipeOpened" title="Custom handle">
  <template #handle>
    <span class="maz:h-1.5 maz:w-12 maz:rounded-full maz:bg-primary" />
  </template>
</MazBottomSheet>
```

  </template>
</ComponentDemo>

## Header with an icon

Pass an `icon` (an icon value or a full `MazIconProps` object) to display it on the left of the title.

<ComponentDemo>
  <MazBtn @click="iconOpened = true">Open with icon</MazBtn>

  <MazBottomSheet v-model="iconOpened" title="Notifications" icon="/bell.svg">
    <p>You have 3 new notifications.</p>
    <template #footer="{ close }">
      <MazBtn @click="close">Mark all as read</MazBtn>
    </template>
  </MazBottomSheet>

<template #code>

```html
<MazBottomSheet v-model="iconOpened" title="Notifications" icon="/bell.svg">
  <p>You have 3 new notifications.</p>

  <template #footer="{ close }">
    <MazBtn @click="close">Mark all as read</MazBtn>
  </template>
</MazBottomSheet>
```

  </template>
</ComponentDemo>

## Replaceable slots

Everything in the header is replaceable: use `#icon` and `#title` to customize parts of the default header, or `#header` to replace the whole header (you get the `close` function as a binding).

<ComponentDemo>
  <MazBtn @click="slotsOpened = true">Open custom header</MazBtn>

  <MazBottomSheet v-model="slotsOpened">
    <template #icon>
      <MazAvatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" size="sm" />
    </template>
    <template #title>
      <span class="maz:text-primary">Custom title</span>
    </template>
    <p>The icon and the title slots are fully replaceable.</p>
  </MazBottomSheet>

<template #code>

```html
<MazBottomSheet v-model="slotsOpened">
  <template #icon>
    <MazAvatar src="/avatar.jpg" size="sm" />
  </template>

  <template #title>
    <span class="maz:text-primary">Custom title</span>
  </template>

  <p>The icon and the title slots are fully replaceable.</p>
</MazBottomSheet>

<!-- or replace the whole header -->
<MazBottomSheet v-model="slotsOpened">
  <template #header="{ close }">
    <div class="maz:flex maz:items-center maz:justify-between maz:p-4">
      <strong>My header</strong>
      <MazBtn size="sm" color="transparent" @click="close">Close</MazBtn>
    </div>
  </template>
</MazBottomSheet>
```

  </template>
</ComponentDemo>

## Max width

On mobile the sheet is always **full-width**. From the tablet breakpoint and up, it is **constrained** to `max-width` and centered horizontally. The default `max-width` is `35rem`; pass the `max-width` prop (a [`MazSizeUnit`](#props)) to override it.

<ComponentDemo>
  <MazBtn @click="wideOpened = true">Open wide sheet</MazBtn>

  <MazBottomSheet v-model="wideOpened" title="Wide sheet" max-width="60rem">
    <p>This sheet is constrained to 60rem on desktop and full-width on mobile.</p>
  </MazBottomSheet>

<template #code>

```html
<MazBottomSheet v-model="wideOpened" title="Wide sheet" max-width="60rem">
  <p>This sheet is constrained to 60rem on desktop and full-width on mobile.</p>
</MazBottomSheet>
```

  </template>
</ComponentDemo>

## Without header

Hide the whole header with `hide-header`, or only the close button with `hide-close-button`.

<ComponentDemo>
  <MazBtn @click="noHeaderOpened = true">Open without header</MazBtn>

  <MazBottomSheet v-model="noHeaderOpened" hide-header>
    <div class="maz:flex maz:flex-col maz:gap-3 maz:text-center">
      <p>No header here, you control the whole layout.</p>
      <MazBtn @click="noHeaderOpened = false">Got it</MazBtn>
    </div>
  </MazBottomSheet>

<template #code>

```html
<MazBottomSheet v-model="noHeaderOpened" hide-header>
  <div class="maz:flex maz:flex-col maz:gap-3 maz:text-center">
    <p>No header here, you control the whole layout.</p>
    <MazBtn @click="noHeaderOpened = false">Got it</MazBtn>
  </div>
</MazBottomSheet>
```

  </template>
</ComponentDemo>

## Persistent

A `persistent` sheet cannot be closed by clicking outside or pressing escape, and the close button is removed. Provide your own action to close it.

<ComponentDemo>
  <MazBtn @click="persistentOpened = true">Open persistent sheet</MazBtn>

  <MazBottomSheet v-model="persistentOpened" title="Action required" icon="/exclamation-triangle.svg" persistent>
    <p>You must confirm before closing this sheet.</p>
    <template #footer>
      <MazBtn @click="persistentOpened = false">I understand</MazBtn>
    </template>
  </MazBottomSheet>

<template #code>

```html
<MazBottomSheet v-model="persistentOpened" title="Action required" persistent>
  <p>You must confirm before closing this sheet.</p>

  <template #footer>
    <MazBtn @click="persistentOpened = false">I understand</MazBtn>
  </template>
</MazBottomSheet>
```

  </template>
</ComponentDemo>

## Full example

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazCard>
      <template #title>
        <div class="maz:flex maz:items-center maz:gap-3">
          <MazAvatar src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100" size="lg" />
          <div>
            <h3 class="maz:text-lg maz:font-semibold">Nike Air Max</h3>
            <p class="maz:text-muted maz:text-sm">Premium Running Shoes</p>
          </div>
        </div>
      </template>
      <div class="maz:space-y-4">
        <div class="maz:flex maz:items-center maz:justify-between">
          <span class="maz:font-medium">Price:</span>
          <span class="maz:text-xl maz:font-bold maz:text-primary">$129.99</span>
        </div>
        <div class="maz:flex maz:gap-2">
          <MazBtn color="primary" @click="openProductOptions">
            <MazIcon icon="/cog.svg" class="maz:me-2" />
            Customize Options
          </MazBtn>
          <MazBtn color="secondary" @click="openUserSettings">
            <MazIcon icon="/user.svg" class="maz:me-2" />
            Profile Settings
          </MazBtn>
        </div>
      </div>
    </MazCard>
    <MazCard v-if="selectedOptions.size || selectedOptions.color" class="maz:bg-secondary/10">
      <template #title>Selected Options</template>
      <div class="maz:flex maz:gap-4">
        <MazBadge v-if="selectedOptions.size" color="info">
          Size: {{ selectedOptions.size }}
        </MazBadge>
        <MazBadge v-if="selectedOptions.color" color="success">
          Color: {{ selectedOptions.color }}
        </MazBadge>
        <MazBadge v-if="quantity > 1" color="warning">
          Qty: {{ quantity }}
        </MazBadge>
      </div>
    </MazCard>
  </div>
  <MazBottomSheet v-model="isProductOpen" title="Customize Your Shoes" icon="/cog.svg" :padding="false">
    <div class="maz:space-y-6 maz:p-6">
      <div>
        <h4 class="maz:text-lg maz:font-semibold maz:mb-3">Select Size</h4>
        <div class="maz:grid maz:grid-cols-4 maz:gap-2">
          <MazBtn
            v-for="size in sizes"
            :key="size"
            :color="selectedOptions.size === size ? 'primary' : 'secondary'"
            size="sm"
            @click="selectedOptions.size = size"
          >
            {{ size }}
          </MazBtn>
        </div>
      </div>
      <div>
        <h4 class="maz:text-lg maz:font-semibold maz:mb-3">Select Color</h4>
        <div class="maz:grid maz:grid-cols-3 maz:gap-3">
          <div
            v-for="color in colors"
            :key="color.name"
            class="maz:flex maz:flex-col maz:items-center maz:cursor-pointer maz:p-3 maz:rounded-lg maz:border-2 maz:transition-all"
            :class="selectedOptions.color === color.name ? 'maz:border-primary maz:bg-primary/10' : 'maz:border-divider maz:hover:border-primary/50'"
            @click="selectedOptions.color = color.name"
          >
            <div
              class="maz:w-8 maz:h-8 maz:rounded-full maz:mb-2"
              :style="{ backgroundColor: color.value }"
            />
            <span class="maz:text-sm maz:font-medium">{{ color.name }}</span>
          </div>
        </div>
      </div>
      <div>
        <MazInputNumber
          v-model="quantity"
          label="Quantity"
          :min="1"
          :max="10"
        />
      </div>
    </div>
    <template #footer="{ close }">
      <MazBtn color="transparent" @click="close">Cancel</MazBtn>
      <MazBtn color="primary" @click="addToCart">
        <MazIcon icon="/shopping-cart.svg" class="maz:me-2" />
        Add to Cart (${{ (129.99 * quantity).toFixed(2) }})
      </MazBtn>
    </template>
  </MazBottomSheet>

  <MazBottomSheet v-model="isUserOpen" title="Profile Settings" icon="/user.svg" max-width="48rem" :padding="false">
    <div class="maz:space-y-6 maz:p-6">
      <div class="maz:flex maz:items-center maz:gap-4 maz:p-4 maz:bg-secondary/10 maz:rounded-lg">
        <MazAvatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" size="xl" />
        <div>
          <h4 class="maz:font-semibold">John Doe</h4>
          <p class="maz:text-muted maz:text-sm">john.doe@example.com</p>
          <MazBadge color="success" size="xs">Premium Member</MazBadge>
        </div>
      </div>
      <div class="maz:flex maz:gap-4 maz:items-start">
        <MazInput
          v-model="userForm.name"
          label="Full Name"
          placeholder="Enter your name"
        />
        <MazInput
          v-model="userForm.email"
          label="Email"
          type="email"
          placeholder="Enter your email"
        />
        <MazSelect
          v-model="userForm.country"
          label="Country"
          :options="countries"
          placeholder="Select your country"
        />
      </div>
      <div class="maz:flex maz:gap-4">
        <div class="maz:flex maz:items-center maz:justify-between maz:p-4 maz:border maz:border-divider maz:rounded-lg">
          <div>
            <p class="maz:font-medium">Email Notifications</p>
            <p class="maz:text-sm maz:text-muted">Receive updates about your orders</p>
          </div>
          <MazSwitch v-model="userForm.notifications" />
        </div>
        <div class="maz:flex maz:items-center maz:justify-between maz:p-4 maz:border maz:border-divider maz:rounded-lg">
          <div>
            <p class="maz:font-medium">Dark Mode</p>
            <p class="maz:text-sm maz:text-muted">Switch to dark theme</p>
          </div>
          <MazSwitch v-model="userForm.darkMode" />
        </div>
      </div>
    </div>
    <template #footer="{ close }">
      <MazBtn color="transparent" @click="close">Cancel</MazBtn>
      <MazBtn color="primary" @click="saveSettings">
        <MazIcon icon="/check.svg" class="maz:me-2" />
        Save Changes
      </MazBtn>
    </template>
  </MazBottomSheet>

<template #code>

```vue
<script setup>
import MazBottomSheet from 'maz-ui/components/MazBottomSheet'
import { reactive, ref } from 'vue'

const isProductOpen = ref(false)
const quantity = ref(1)
const selectedOptions = reactive({ size: '', color: '' })

function openProductOptions() {
  isProductOpen.value = true
}
</script>

<template>
  <MazBtn color="primary" @click="openProductOptions">
    Customize Options
  </MazBtn>

  <MazBottomSheet v-model="isProductOpen" title="Customize Your Shoes" icon="/cog.svg" :padding="false">
    <div class="maz:space-y-6 maz:p-6">
      <h4 class="maz:mb-3 maz:text-lg maz:font-semibold">
        Select Size
      </h4>
      <div class="maz:grid maz:grid-cols-4 maz:gap-2">
        <MazBtn
          v-for="size in sizes"
          :key="size"
          :color="selectedOptions.size === size ? 'primary' : 'secondary'"
          size="sm"
          @click="selectedOptions.size = size"
        >
          {{ size }}
        </MazBtn>
      </div>
    </div>

    <template #footer="{ close }">
      <MazBtn color="transparent" @click="close">
        Cancel
      </MazBtn>
      <MazBtn color="primary" @click="addToCart">
        Add to Cart (${{ (129.99 * quantity).toFixed(2) }})
      </MazBtn>
    </template>
  </MazBottomSheet>
</template>
```

  </template>
</ComponentDemo>

<!--@include: ./../../.vitepress/generated-docs/maz-bottom-sheet.doc.md-->

<script setup>
  import { ref, reactive } from 'vue'

  const basicOpened = ref(false)
  const swipeOpened = ref(false)
  const iconOpened = ref(false)
  const slotsOpened = ref(false)
  const wideOpened = ref(false)
  const noHeaderOpened = ref(false)
  const persistentOpened = ref(false)

  const isProductOpen = ref(false)
  const isUserOpen = ref(false)
  const quantity = ref(1)

  const selectedOptions = reactive({
    size: '',
    color: ''
  })

  const userForm = reactive({
    name: 'John Doe',
    email: 'john.doe@example.com',
    country: 'US',
    notifications: true,
    darkMode: false
  })

  const sizes = ['7', '8', '9', '10', '11', '12']
  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' }
  ]

  const countries = [
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'France', value: 'FR' },
    { label: 'Germany', value: 'DE' }
  ]

  function openProductOptions() {
    isProductOpen.value = true
  }

  function openUserSettings() {
    isUserOpen.value = true
  }

  function addToCart() {
    if (!selectedOptions.size || !selectedOptions.color) {
      alert('Please select size and color first!')
      return
    }
    alert(`Added ${quantity.value} ${selectedOptions.color} shoes (size ${selectedOptions.size}) to cart!`)
    isProductOpen.value = false
  }

  function saveSettings() {
    alert('Settings saved successfully!')
    isUserOpen.value = false
  }
</script>
