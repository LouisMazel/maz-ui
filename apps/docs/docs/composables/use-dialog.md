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
import { useDialog } from 'maz-ui/composables'

const dialog = useDialog()

function openDialog() {
  dialog.open({
    title: 'Dialog title',
    message: 'Dialog message',
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

<script lang="ts" setup>
  import { useDialog } from 'maz-ui/src/composables/useDialog'

  const dialog = useDialog()

  function openDialog() {
    dialog.open({
      title: 'Dialog title',
      message: 'Dialog message',
    })
  }
</script>
