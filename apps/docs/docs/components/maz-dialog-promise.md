---
title: MazDialogPromise
description: MazDialogPromise is a standalone component that dialogs with the user to show important information and propose confirmation. You should wait for this response with await.

---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

::: info
This component uses [MazDialog](./maz-dialog.md), so it inherits all its props
:::

::: tip
This component uses `<Teleport to="body">` with [MazBackdrop](./maz-backdrop.md), so you can implement this component anywhere and it inherits all its props
:::

## Basic usage

<MazBtn @click="askToUser">Ask user</MazBtn>

<MazDialogPromise identifier="one" />

<MazDialogPromise identifier="two" :buttons="buttons">
  <template #title>
    Do you really want to delete this user?
  </template>
  <template #default>
    Are you really sure you want to delete this user?
  </template>
</MazDialogPromise>

<MazDialog v-model="confirmDialog">
  <template #title>
    User deleted
  </template>
  <template #default>
    User has been deleted!
  </template>
  <template #footer="{ close }">
    <MazBtn @click="close">
      Ok
    </MazBtn>
  </template>
</MazDialog>

```vue
<script setup>
import { MazDialog, MazDialogPromise, useMazDialogPromise } from 'maz-ui/components'

import { ref } from 'vue'

const confirmDialog = ref(false)

const { showDialogAndWaitChoice, data } = useMazDialogPromise()

data.value = {
  title: 'Delete user',
  message: 'Are you sure you want to delete this user?',
}

const buttons: DialogCustomButton[] = [
  {
    text: 'Cancel',
    type: 'reject',
    color: 'destructive',
    outlined: true,
    response: new Error('cancel'),
    size: 'sm',
  },
  {
    text: 'Delete!',
    type: 'resolve',
    color: 'success',
    response: 'delete',
    size: 'lg',
  },
]

async function askToUser() {
  try {
    const responseOne = await showDialogAndWaitChoice('one')
    toast.success(responseOne, {
      position: 'top-right'
    })
    const responseTwo = await showDialogAndWaitChoice('two')
    toast.success(responseTwo, {
      position: 'top-right'
    })
    confirmDialog.value = true
  }
  catch (error) {
    toast.error(error.message ?? error, {
      position: 'top-right'
    })
  }
}
</script>

<template>
  <MazBtn @click="askToUser">
    Ask user
  </MazBtn>

  <MazDialogPromise
    :data="dataPromiseOne"
    identifier="one"
  />

  <MazDialogPromise identifier="two" :buttons="buttons">
    <template #title>
      Do you really want to delete this user?
    </template>
    <template #default>
      Are you really sure you want to delete this user?
    </template>
  </MazDialogPromise>

  <MazDialog v-model="confirmDialog">
    <template #title>
      User deleted
    </template>
    <template #default>
      User has been deleted!
    </template>
    <template #footer="{ close }">
      <MazBtn @click="close">
        Ok
      </MazBtn>
    </template>
  </MazDialog>
</template>
```

## Types

```ts
interface MazDialogPromiseData {
  /**
   * Dialog title
   */
  title?: string
  /**
   * Dialog message
   */
  message?: string
  /**
   * Dialog custom buttons
   * @default [{ text: 'Confirm', color: 'success', type: 'accept' }, { text: 'Cancel', color: 'destructive', type: 'reject' }]
   * @type {MazDialogPromiseButton[]}
   */
  buttons?: MazDialogPromiseButton[]
}

interface MazDialogPromiseButton {
  text?: string
  block?: boolean
  color?: Color
  disabled?: boolean
  loading?: boolean
  outlined?: boolean
  rounded?: boolean
  size?: Size
  text: string
  type: 'accept' | 'reject'
  response?: unknown
}

type Color = 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'accent'
    | 'contrast'
    | 'transparent'

type Size = 'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
```

<!--@include: ./../.vitepress/generated-docs/maz-dialog-promise.doc.md-->

<script setup lang="ts">
  import { ref } from 'vue'
  import { useToast } from 'maz-ui/src/composables/useToast'
  import MazDialogPromise, {
    useMazDialogPromise, type MazDialogPromiseButton, type MazDialogPromiseData
  } from 'maz-ui/src/components/MazDialogPromise.vue'

  const { showDialogAndWaitChoice, data } = useMazDialogPromise()
  const confirmDialog = ref(false)
  const toast = useToast()

  async function askToUser () {
    try {
      const responseOne = await showDialogAndWaitChoice('one')
      toast.success(responseOne, {
        position: 'top-right'
      })
      const responseTwo = await showDialogAndWaitChoice('two')
      toast.success(responseTwo, {
        position: 'top-right'
      })
      confirmDialog.value = true
    } catch (error) {
      toast.error(error.message, {
        position: 'top-right'
      })
    }
  }

  data.value = {
    title: 'Delete user',
    message: 'Are you sure you want to delete this user?',
  }

  const buttons: MazDialogPromiseButton[] = [
    {
      text: 'Cancel',
      type: 'reject',
      color: 'destructive',
      outlined: true,
      response: new Error('cancel'),
      size: 'sm',
    },
    {
      text: 'Delete!',
      type: 'accept',
      color: 'success',
      response: 'delete',
      size: 'lg',
    },
  ]
</script>
