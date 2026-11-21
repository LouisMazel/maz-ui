---
title: useDialog
description: Open a confirmation or information dialog from your script and await the answer of the user (confirm or cancel), with customizable buttons, without plugin to install, instead of window.confirm.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip
No plugin to install. Global options, custom buttons, rich content and all the options: [dialog documentation](./../plugins/dialog.md)
:::

## Usage

<ComponentDemo>
  <MazBtn
    @click="openDialog"
  >
    Open Dialog
  </MazBtn>

<template #code>

```vue
<script lang="ts" setup>
import { useDialog } from 'maz-ui/composables/useDialog'
import { useToast } from 'maz-ui/composables/useToast'

const dialog = useDialog()

const toast = useToast()

function openDialog() {
  dialog.open({
    title: 'Dialog title',
    message: 'Dialog message',
    onAccept: (response) => {
      toast.success(`Dialog accepted`, {
        position: 'bottom',
      })
    },
    onReject: (response) => {
      toast.error(`Dialog rejected`, {
        position: 'bottom',
      })
    },
  })
}
</script>

<template>
  <MazBtn @click="openDialog">
    Open Dialog
  </MazBtn>
</template>
```

  </template>

</ComponentDemo>

## Await the choice

`confirm` returns a `Promise<boolean>` resolved with `true` on accept and `false` on reject or close (button, escape, backdrop, replacement by a dialog with the same identifier). See [await the choice with confirm](./../plugins/dialog.md#await-the-choice-with-confirm), [rich content](./../plugins/dialog.md#rich-content) and [reactive buttons](./../plugins/dialog.md#reactive-buttons).

```ts
import { useDialog } from 'maz-ui/composables/useDialog'

const dialog = useDialog()

const confirmed = await dialog.confirm({
  title: 'Delete user',
  message: 'This action cannot be undone.',
})
```

<script lang="ts" setup>
  import { useDialog } from 'maz-ui/composables/useDialog'
  import { useToast } from 'maz-ui/composables/useToast'

  const dialog = useDialog()
  const toast = useToast()

  function openDialog() {
    dialog.open({
      title: 'Dialog title',
      message: 'Dialog message',
      onAccept: (response) => {
        toast.success(`Dialog accepted`, {
          position: 'bottom',
        })
      },
      onReject: (response) => {
        toast.error(`Dialog rejected`, {
          position: 'bottom',
        })
      },
    })
  }
</script>
