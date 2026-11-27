---
title: MazDialog
description: MazDialog is a standalone dialog component to show important informations to the user or propose specific action. Many options are available. You can hide the header or the footer, full-size layout, differents states etc.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

::: tip
This component uses `<Teleport to="body">` with [MazBackdrop](./maz-backdrop.md), so you can implement this component anywhere and it inherits all its props
:::

## Basic usage

<ComponentDemo expanded>
  <MazBtn @click="isOpen = true">Open Dialog</MazBtn>

  <MazDialog v-model="isOpen" title="Dialog Title">
    <p>
      Your content
    </p>
    <template #footer="{ close }">
      <MazBtn @click="close">
        Confirm
      </MazBtn>
    </template>
  </MazDialog>

<template #code>

```vue
<script setup>
import MazDialog from 'maz-ui/components/MazDialog'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <MazBtn @click="isOpen = true">
    Open Dialog
  </MazBtn>

  <MazDialog v-model="isOpen" title="Dialog Title">
    <p>
      Your content
    </p>

    <template #footer="{ close }">
      <MazBtn @click="close">
        Confirm
      </MazBtn>
    </template>
  </MazDialog>
</template>
```

  </template>
</ComponentDemo>

## Scrollable

For long content, you can enable scrolling in content part (Header and footer slot remain visible at top and bottom)

<ComponentDemo>
  <MazBtn @click="scollableOpened = true">Open Scrollable Dialog</MazBtn>

  <MazDialog v-model="scollableOpened" title="Dialog Title" max-height="400px" scrollable>
    <template #title>
      Scrollable Dialog Title
    </template>
    <template #default>
      <p v-for="i in 40" :key="i" style="padding-bottom: 2rem;">
        Scroll down
      </p>
    </template>
    <template #footer>
      <MazBtn @click="scollableOpened = false">
        Confirm
      </MazBtn>
    </template>
  </MazDialog>

<template #code>

```html
<MazDialog v-model="scollableOpened" title="Dialog Title" max-height="400px" scrollable>
  <template #title> Scrollable Dialog Title </template>

  <template #default>
    <p v-for="i in 40" :key="i" style="padding-bottom: 2rem">Scroll down</p>
  </template>

  <template #footer>
    <MazBtn @click="scollableOpened = false"> Confirm </MazBtn>
  </template>
</MazDialog>
```

  </template>
</ComponentDemo>

## Width

On tablet and up, the dialog is sized by two CSS variables coming from the active theme preset (`components.dialog`):

- `--maz-dialog-max-width` (default `38rem`)
- `--maz-dialog-min-width` (default `32rem`)

You can set these defaults globally per preset — see [the theme `components.dialog` documentation](./../ecosystem/themes.md#dialog-sizing). To change the width of a single dialog, pass the `max-width` / `min-width` props — they always override the preset:

<ComponentDemo>
  <MazBtn @click="widthOpened = true">Open Wide Dialog</MazBtn>

  <MazDialog v-model="widthOpened" title="Custom width" max-width="50rem" min-width="40rem">
    <p>
      This dialog overrides the preset width through props.
    </p>
    <template #footer="{ close }">
      <MazBtn @click="close">
        Confirm
      </MazBtn>
    </template>
  </MazDialog>

<template #code>

```vue
<template>
  <MazDialog
    v-model="isOpen"
    title="Custom width"
    max-width="50rem"
    min-width="40rem"
  >
    <p>This dialog overrides the preset width through props.</p>
  </MazDialog>
</template>
```

  </template>
</ComponentDemo>

::: tip
The default widths are expressed in `rem`, so they scale with the preset's `base-font-size`. Presets with a larger base size (e.g. `ocean` at `16px`) ship rem values adjusted to keep the rendered pixel width consistent across presets.
:::

## Header divider and content padding

The header has the same space on every side. `header-divider` adds a line under it (a `scrollable` dialog always has one). The content is padded by default, set `:content-padding="false"` for full-bleed content (a list, a table, an image).

<ComponentDemo>
  <MazBtn @click="dividerOpened = true">Open dialog with divider</MazBtn>

  <MazDialog v-model="dividerOpened" title="Settings" header-divider>
    <p>Content under the divider.</p>
  </MazDialog>

<template #code>

```vue
<MazDialog v-model="isOpen" title="Settings" header-divider>
  <p>Content under the divider.</p>
</MazDialog>

<MazDialog v-model="isOpen" title="Files" :content-padding="false">
  <MazList>...</MazList>
</MazDialog>
```

  </template>
</ComponentDemo>

## Keep the dialog open

`before-close` is called before every close (close button, <kbd>Esc</kbd>, click outside, `close()`). Return `false`, or a promise of `false`, to keep the dialog open, for example while changes are not saved. Any other result closes it, and a thrown error or a rejected promise keeps it open. It is also available on `MazDrawer`, `MazBottomSheet` and `MazBackdrop`.

<ComponentDemo>
  <MazBtn @click="guardedOpened = true">Open guarded dialog</MazBtn>

  <MazDialog v-model="guardedOpened" title="Unsaved changes" :before-close="askBeforeClose">
    <p>Closing asks for a confirmation.</p>
  </MazDialog>

<template #code>

```vue
<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const dirty = ref(true)

function askBeforeClose() {
  if (dirty.value)
    return confirm('Discard the changes?')
}
</script>

<template>
  <MazDialog v-model="isOpen" title="Unsaved changes" :before-close="askBeforeClose">
    ...
  </MazDialog>
</template>
```

  </template>
</ComponentDemo>

::: tip
`@before-close` is only an event: it cannot cancel the close. Use the `before-close` prop. For a confirmation, `useDialog().confirm()` returns a `Promise<boolean>`: `before-close` can return it directly.
:::

## Accessibility

- The dialog is a modal `dialog` (`aria-modal`), labelled by its title and described by its content (override them with the `aria-labelledby` / `aria-describedby` props).
- The focus moves into the dialog on open, stays trapped inside and goes back to the previous element on close. <kbd>Esc</kbd> closes it (`close-on-escape`).
- While it is open, the rest of the page is `inert` (no focus, no click, hidden from assistive technologies), except the toasts and the live regions.

<!--@include: ./../../.vitepress/generated-docs/maz-dialog.doc.md-->

<script setup>
  import { ref } from 'vue'
  const isOpen = ref(false)
  const scollableOpened = ref(false)
  const widthOpened = ref(false)
  const dividerOpened = ref(false)
  const guardedOpened = ref(false)

  function askBeforeClose() {
    return globalThis.confirm('Discard the changes?')
  }
</script>
