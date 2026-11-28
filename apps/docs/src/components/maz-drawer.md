---
title: MazDrawer
description: MazDrawer is a panel that slides in from the top, the bottom, the left or the right side of the screen over a backdrop, for side menus, filters or details
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

::: tip
This component uses `<Teleport to="body">` with [MazBackdrop](./maz-backdrop.md), so you can implement this component anywhere and it inherits all its props
:::

## Basic usage

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:gap-2 maz:flex-center">
    <MazBtn @click="isOpenedTop = !isOpenedTop">
      Open top drawer
    </MazBtn>
    <div class="maz:flex maz:flex-wrap maz:gap-2">
      <MazBtn @click="isOpenedLeft = !isOpenedLeft">
        Open left drawer
      </MazBtn>
      <MazBtn @click="isOpenedRight = !isOpenedRight">
        Open right drawer
      </MazBtn>
    </div>
    <MazBtn @click="isOpenedBottom = !isOpenedBottom">
      Open bottom drawer
    </MazBtn>
  </div>

<template #code>

```html
<MazBtn @click="isOpenedTop = !isOpenedTop"> Open top drawer </MazBtn>
<MazBtn @click="isOpenedLeft = !isOpenedLeft"> Open left drawer </MazBtn>
<MazBtn @click="isOpenedRight = !isOpenedRight"> Open right drawer </MazBtn>
<MazBtn @click="isOpenedBottom = !isOpenedBottom"> Open bottom drawer </MazBtn>

<MazDrawer side="top" v-model="isOpenedTop">
  <template #title> Drawer top </template>
  <template #default="{ close }">
    <div style="padding: 16px">
      <p>Content</p>
      <div class="flex flex-wrap gap-2 mt-4">
        <MazBtn color="destructive" @click="close"> Close </MazBtn>
      </div>
    </div>
  </template>
</MazDrawer>

<MazDrawer side="bottom" v-model="isOpenedBottom">
  <template #title> Drawer bottom </template>
  <template #default="{ close }">
    <div style="padding: 16px">
      <p>Content</p>
      <div class="flex flex-wrap gap-2 mt-4">
        <MazBtn color="destructive" @click="close"> Close </MazBtn>
      </div>
    </div>
  </template>
</MazDrawer>

<MazDrawer side="start" v-model="isOpenedLeft">
  <template #title> Drawer left </template>
  <template #default="{ close }">
    <div style="padding: 16px">
      <p>Content</p>
      <div class="flex flex-wrap gap-2 mt-4">
        <MazBtn color="destructive" @click="close"> Close </MazBtn>
      </div>
    </div>
  </template>
</MazDrawer>

<MazDrawer side="end" v-model="isOpenedRight">
  <template #title> Drawer right </template>
  <template #default="{ close }">
    <div style="padding: 16px">
      <p>Content</p>
      <div class="flex flex-wrap gap-2 mt-4">
        <MazBtn color="destructive" @click="close"> Close </MazBtn>
      </div>
    </div>
  </template>
</MazDrawer>
```

  </template>
</ComponentDemo>

<div class="vp-raw">
<MazDrawer side="top" v-model="isOpenedTop">
  <template #title>
    Drawer top
  </template>
  <template #default="{ close }">
    <div style="padding: 16px;">
      <p>
        Content
      </p>
      <div class="maz:flex maz:flex-wrap maz:gap-2 maz:mt-4">
        <MazBtn color="destructive" @click="close">
          Close
        </MazBtn>
      </div>
    </div>
  </template>
</MazDrawer>
</div>

<div class="vp-raw">
<MazDrawer side="bottom" v-model="isOpenedBottom">
  <template #title>
    Drawer bottom
  </template>
  <template #default="{ close }">
    <div style="padding: 16px;">
      <p>
        Content
      </p>
      <div class="maz:flex maz:flex-wrap maz:gap-2 maz:mt-4">
        <MazBtn color="destructive" @click="close">
          Close
        </MazBtn>
      </div>
    </div>
  </template>
</MazDrawer>
</div>

<div class="vp-raw">
<MazDrawer side="start" v-model="isOpenedLeft">
  <template #title>
    Drawer left
  </template>
  <template #default="{ close }">
    <div style="padding: 16px;">
      <p>
        Content
      </p>
      <div class="maz:flex maz:flex-wrap maz:gap-2 maz:mt-4">
        <MazBtn color="destructive" @click="close">
          Close
        </MazBtn>
      </div>
    </div>
  </template>
</MazDrawer>
</div>

<div class="vp-raw">
<MazDrawer side="end" v-model="isOpenedRight">
  <template #title>
    Drawer right
  </template>
  <template #default="{ close }">
    <div style="padding: 16px;">
      <p>
        Content
      </p>
      <div class="maz:flex maz:flex-wrap maz:gap-2 maz:mt-4">
        <MazBtn color="destructive" @click="close">
          Close
        </MazBtn>
      </div>
    </div>
  </template>
</MazDrawer>
</div>

<script lang="ts" setup>
  import { ref } from 'vue'

  const isOpenedTop = ref(false)
  const isOpenedBottom = ref(false)
  const isOpenedRight = ref(false)
  const isOpenedLeft = ref(false)
  const swipeOpened = ref(false)
</script>

## Swipe to close

Swipe the drawer towards its side to close it: it follows your finger, a quick flick closes it, and released too early it springs back. A drawer on the `start` side is on the right in a right-to-left page, and its swipe follows.

A finger or a pen swipes from anywhere, except in a content that can still scroll that way. A mouse drags the header. Fields and any element with `data-maz-no-drag` never start a swipe. Turn it off with `:swipe-to-close="false"`.

<ComponentDemo>
  <MazBtn @click="swipeOpened = true">Open a swipeable drawer</MazBtn>

<template #code>

```html
<!-- on by default -->
<MazDrawer v-model="isOpen" side="end" title="Swipe me" />

<!-- off -->
<MazDrawer v-model="isOpen" :swipe-to-close="false" />
```

  </template>
</ComponentDemo>

<div class="vp-raw">
<MazDrawer v-model="swipeOpened" side="end" title="Swipe me">
  <div style="padding: 16px;">
    <p>Swipe this drawer to the right to close it. With a mouse, drag its header.</p>
  </div>
</MazDrawer>
</div>

## Keep the drawer open

`before-close` returning `false` (or a promise of `false`) keeps the drawer open, Escape and click outside included. Any other result closes it.

```vue
<MazDrawer v-model="isOpen" :before-close="() => !hasChanges">
  ...
</MazDrawer>
```

## Motion

The drawer slides in from its side and out faster, with the motion tokens of the theme. Released after a swipe, it springs back with `--maz-easing-spring`. Only `transform` and `translate` move. Under reduced motion, the springs are instant. See [Motion](./../guide/motion.md).

## Accessibility

The drawer is a modal `dialog` labelled by its `title`. The focus is trapped inside while it is open, <kbd>Esc</kbd> closes it, and the rest of the page is `inert` (except the toasts and the live regions). Swiping is a shortcut: the close button and <kbd>Esc</kbd> still close it. The close button is labelled from `@maz-ui/translations` (`aria.close`).

<!--@include: ./../../.vitepress/generated-docs/maz-drawer.doc.md-->
