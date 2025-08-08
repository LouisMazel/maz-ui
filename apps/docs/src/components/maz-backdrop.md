---
title: MazBackdrop
description: MazBackdrop is a flexible backdrop component that provides a foundation for modals, drawers, bottom sheets and any overlay content. It handles focus management, keyboard navigation, and animations automatically.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

::: tip
This component uses `<Teleport to="body">` and is the foundation for [MazDialog](./maz-dialog.md), [MazDrawer](./maz-drawer.md), and [MazBottomSheet](./maz-bottom-sheet.md)
:::

## Basic usage

MazBackdrop creates a semi-transparent overlay that covers the entire screen. Think of it like a dark blanket that appears behind your content to make it stand out.

<ComponentDemo expanded>
  <MazBtn @click="basicOpen = true">Open Backdrop</MazBtn>

  <MazBackdrop v-model="basicOpen" justify="center" align="center">
    <div class="demo-content">
      <h3>Hello! I'm on top of the backdrop</h3>
      <p>Click outside or press Escape to close</p>
      <MazBtn @click="basicOpen = false">Close</MazBtn>
    </div>
  </MazBackdrop>

  <template #code>

```vue
<script setup>
import MazBackdrop from 'maz-ui/components/MazBackdrop'
import { ref } from 'vue'

const basicOpen = ref(false)
</script>

<template>
  <MazBtn @click="basicOpen = true">
    Open Backdrop
  </MazBtn>

  <MazBackdrop v-model="basicOpen" justify="center" align="center">
    <div class="my-content">
      <h3>Hello! I'm on top of the backdrop</h3>
      <p>Click outside or press Escape to close</p>
      <MazBtn @click="basicOpen = false">Close</MazBtn>
    </div>
  </MazBackdrop>
</template>

<style lang="css" scoped>
.demo-content {
  background: hsl(var(--maz-background));
  padding: 2rem;
  border-radius: var(--maz-radius);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  text-align: center;
}

.demo-content h3 {
  margin-top: 0;
}

.demo-content p {
  margin-bottom: 1.5rem;
  color: hsl(var(--maz-muted));
}
</style>
```

  </template>
</ComponentDemo>

## Persistent backdrop

A persistent backdrop cannot be closed by clicking outside or pressing Escape. Perfect for important confirmations!

<ComponentDemo>
  <MazBtn @click="persistentOpen = true">Open Persistent Backdrop</MazBtn>

  <MazBackdrop v-model="persistentOpen" persistent align="center" justify="center">
    <div class="demo-content">
      <h3>I'm persistent!</h3>
      <p>You can only close me by clicking the button below</p>
      <MazBtn @click="persistentOpen = false" color="danger">
        Force Close
      </MazBtn>
    </div>
  </MazBackdrop>

  <template #code>

```html
<MazBackdrop v-model="persistentOpen" persistent align="center" justify="center">
  <div class="my-content">
    <h3>I'm persistent!</h3>
    <p>You can only close me by clicking the button below</p>
    <MazBtn @click="persistentOpen = false" color="danger">
      Force Close
    </MazBtn>
  </div>
</MazBackdrop>
```

  </template>
</ComponentDemo>

## Content positioning

You can control where your content appears using `justify` and `align` props. It's like choosing where to place a sticker on your screen!

<ComponentDemo>
  <div class="maz-flex maz-flex-wrap maz-gap-2">
    <MazBtn @click="topLeftOpen = true">Top Left</MazBtn>
    <MazBtn @click="centerOpen = true">Center</MazBtn>
    <MazBtn @click="bottomRightOpen = true">Bottom Right</MazBtn>
  </div>

  <!-- Top Left -->
  <MazBackdrop v-model="topLeftOpen" justify="start" align="start" content-padding>
    <div class="demo-content">
      <h3>I'm at the top left!</h3>
      <MazBtn @click="topLeftOpen = false" size="sm">Close</MazBtn>
    </div>
  </MazBackdrop>

  <!-- Center -->
  <MazBackdrop v-model="centerOpen" justify="center" align="center" content-padding>
    <div class="demo-content">
      <h3  3>I'm perfectly centered!</h3>
      <MazBtn @click="centerOpen = false" size="sm">Close</MazBtn>
    </div>
  </MazBackdrop>

  <!-- Bottom Right -->
  <MazBackdrop v-model="bottomRightOpen" justify="end" align="end" content-padding>
    <div class="demo-content">
      <h3>I'm at the bottom right!</h3>
      <MazBtn @click="bottomRightOpen = false" size="sm">Close</MazBtn>
    </div>
  </MazBackdrop>

  <template #code>

```html
<!-- Top Left -->
<MazBackdrop v-model="topLeftOpen" justify="start" align="start" content-padding>
  <div class="my-content">
    <h3>I'm at the top left!</h3>
    <MazBtn @click="topLeftOpen = false">Close</MazBtn>
  </div>
</MazBackdrop>

<!-- Center -->
<MazBackdrop v-model="centerOpen" justify="center" align="center" content-padding>
  <div class="my-content">
    <h3>I'm perfectly centered!</h3>
    <MazBtn @click="centerOpen = false">Close</MazBtn>
  </div>
</MazBackdrop>

<!-- Bottom Right -->
<MazBackdrop v-model="bottomRightOpen" justify="end" align="end" content-padding>
  <div class="my-content">
    <h3>I'm at the bottom right!</h3>
    <MazBtn @click="bottomRightOpen = false">Close</MazBtn>
  </div>
</MazBackdrop>
```

  </template>
</ComponentDemo>

## Custom animations

MazBackdrop comes with built-in animations, but you can customize them with the `transition-name` prop.

<ComponentDemo>
  <MazBtn @click="animatedOpen = true">Open with Custom Animation</MazBtn>

  <MazBackdrop v-model="animatedOpen" transition-name="modal-anim">
    <div class="demo-content">
      <h3>I slide and scale in!</h3>
      <p>This uses the same animation as MazDialog</p>
      <MazBtn @click="animatedOpen = false">Close</MazBtn>
    </div>
  </MazBackdrop>

  <template #code>

```html
<MazBackdrop v-model="animatedOpen" transition-name="modal-anim">
  <div class="my-content">
    <h3>I slide and scale in!</h3>
    <p>This uses the same animation as MazDialog</p>
    <MazBtn @click="animatedOpen = false">Close</MazBtn>
  </div>
</MazBackdrop>
```

  </template>
</ComponentDemo>

## Accessibility features

MazBackdrop automatically handles:
- **Focus trap**: Tab navigation stays within your content
- **Keyboard support**: Escape key to close (unless persistent)
- **Screen readers**: Proper ARIA attributes for accessibility
- **Scroll lock**: Prevents background scrolling when open

These features work automatically - you don't need to do anything extra!

<!--@include: ./../../.vitepress/generated-docs/maz-backdrop.doc.md-->

<script setup>
  import { ref } from 'vue'

  const basicOpen = ref(false)
  const persistentOpen = ref(false)
  const topLeftOpen = ref(false)
  const centerOpen = ref(false)
  const bottomRightOpen = ref(false)
  const animatedOpen = ref(false)
</script>

<style lang="postcss" scoped>
.demo-content {
  background: hsl(var(--maz-background));
  padding: 2rem;
  border-radius: var(--maz-radius);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  text-align: center;
}

.demo-content h3 {
  margin-top: 0;
}

.demo-content p {
  margin-bottom: 1.5rem;
  color: hsl(var(--maz-muted));
}
</style>
