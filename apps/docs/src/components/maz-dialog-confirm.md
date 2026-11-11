---
title: MazDialogConfirm
description: MazDialogConfirm is a standalone component that dialogs with the user to show important information and propose confirmation. You should wait for this response with await.

---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

::: info
This component uses [MazDialog](./maz-dialog.md), so it inherits all its props
:::

::: tip
This component uses `<Teleport to="body">` with [MazBackdrop](./maz-backdrop.md), so you can implement this component anywhere and it inherits all its props
:::

## Basic usage

<div class="vp-raw">
<MazBtn @click="askToUser">Ask user</MazBtn>
</div>

<div class="vp-raw">
<MazDialogConfirm identifier="one" accept-text="Ok" reject-text="Reject" />
</div>

<div class="vp-raw">
<MazDialogConfirm identifier="two" :buttons="buttons">
  <template #title>
    Do you really want to delete this user?
  </template>
  <template #default>
    Are you really sure you want to delete this user?
  </template>
</MazDialogConfirm>
</div>

<div class="vp-raw">
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
</div>

```vue
<script setup>
import MazDialogConfirm, { useMazDialogConfirm } from 'maz-ui/components/MazDialogConfirm'
import MazDialog from 'maz-ui/components/MazDialog'

import { ref } from 'vue'

const confirmDialog = ref(false)

const { showDialogAndWaitChoice, data } = useMazDialogConfirm()

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
    response: 'cancel',
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
    const acceptResponse = await showDialogAndWaitChoice('one')
    toast.success(acceptResponse, {
      position: 'top-right'
    })
    const rejectResponse = await showDialogAndWaitChoice('two')
    toast.success(rejectResponse, {
      position: 'top-right'
    })
    confirmDialog.value = true
  }
  catch (rejectResponse) {
    toast.error(rejectResponse, {
      position: 'top-right'
    })
  }
}
</script>

<template>
  <MazBtn @click="askToUser">
    Ask user
  </MazBtn>

  <MazDialogConfirm
    :data="dataPromiseOne"
    identifier="one"
  />

  <MazDialogConfirm identifier="two" :buttons="buttons">
    <template #title>
      Do you really want to delete this user?
    </template>
    <template #default>
      Are you really sure you want to delete this user?
    </template>
  </MazDialogConfirm>

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

## Rich content and reactive buttons

The default slot accepts any content (list, alert, form), and receives the `accept` and `reject` functions. The `accept-props` and `reject-props` are regular props: bind them to a reactive state to disable or put the button in loading state.

```vue
<MazDialogConfirm
  identifier="publish"
  :accept-props="{ disabled: !hasIdentity, type: 'accept', color: 'success' }"
>
  <template #default>
    <MazAlert color="warning">Set your git identity first</MazAlert>
    <ul>
      <li v-for="file in files" :key="file">{{ file }}</li>
    </ul>
  </template>
</MazDialogConfirm>
```

With the [dialog plugin](./../plugins/dialog.md#rich-content), use the `content` option and reactive `acceptProps` instead.

## Types

```ts
interface MazDialogConfirmData {
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
   * @type {MazDialogConfirmButton[]}
   */
  buttons?: MazDialogConfirmButton[]
}

// All props of MazBtn
interface MazDialogConfirmButton {
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

<!--@include: ./../../.vitepress/generated-docs/maz-dialog-confirm.doc.md-->

<script setup lang="ts">
  import { ref } from 'vue'
  import { useToast } from 'maz-ui/composables/useToast'
  import MazDialogConfirm, {
    useMazDialogConfirm, type MazDialogConfirmButton, type MazDialogConfirmData
  } from 'maz-ui/components/MazDialogConfirm'

  const { showDialogAndWaitChoice, data } = useMazDialogConfirm()
  const confirmDialog = ref(false)
  const toast = useToast()

  async function askToUser () {
    try {
      const acceptResponse = await showDialogAndWaitChoice('one')
      toast.success(acceptResponse, {
        position: 'top-right'
      })
      const rejectResponse = await showDialogAndWaitChoice('two')
      toast.success(rejectResponse, {
        position: 'top-right'
      })
      confirmDialog.value = true
    } catch (rejectResponse) {
      toast.error(rejectResponse, {
        position: 'top-right'
      })
    }
  }

  data.value = {
    title: 'Delete user',
    message: 'Are you sure you want to delete this user?',
  }

  const buttons: MazDialogConfirmButton[] = [
    {
      text: 'Cancel',
      type: 'reject',
      color: 'destructive',
      outlined: true,
      response: 'cancel',
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
