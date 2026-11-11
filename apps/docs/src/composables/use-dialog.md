---
title: useDialog
description: Vue composable for handling dialog plugin in your components
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: warning
You must install [dialog plugin](./../plugins/dialog.md#install) before use it
:::

::: tip
More info about [dialog plugin](./../plugins/dialog.md) in its documentation
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
