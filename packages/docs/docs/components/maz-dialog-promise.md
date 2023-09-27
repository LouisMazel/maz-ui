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

<script setup lang="ts">
  import { ref } from 'vue'
  import {
    useMazDialogPromise, type DialogData, type DialogButton,
  } from 'maz-ui'

  const { showDialogAndWaitChoice } = useMazDialogPromise()
  const confirmDialog = ref(false)

  const askToUser = async () => {
    try {
      const responseOne = await showDialogAndWaitChoice('one')
      console.log('responseOne', responseOne)
      const responseTwo = await showDialogAndWaitChoice('two')
      console.log('responseTwo', responseTwo)
      confirmDialog.value = true
    } catch (error) {
      console.log(error)
    }
  }

  const dataPromiseOne: DialogData = {
    title: 'Delete user',
    message: 'Are you sure you want to delete this user?',
  }

  const buttons: DialogButton[] = [
    {
      text: 'Cancel',
      type: 'reject',
      color: 'danger',
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
</script>

```vue
<template>
  <MazBtn @click="askToUser">Ask user</MazBtn>

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

<script setup>
  import { ref } from 'vue'

  import MazDialogPromise, {
    useMazDialogPromise, type DialogButton, type DialogData
  } from 'maz-ui/components/MazDialogPromise'

  import MazDialog from 'maz-ui/components/MazDialog'

  const confirmDialog = ref(false)

  const { showDialogAndWaitChoice } = useMazDialogPromise()

  const dataPromiseOne: DialogData = {
    title: 'Delete user',
    message: 'Are you sure you want to delete this user?',
  }

  const buttons: DialogButton[] = [
    {
      text: 'Cancel',
      type: 'reject',
      color: 'danger',
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

  const askToUser = async () => {
    try {
      const responseOne = await showDialogAndWaitChoice('one')
      console.log('responseOne', responseOne)
      const responseTwo = await showDialogAndWaitChoice('two')
      console.log('responseTwo', responseTwo)
      confirmDialog.value = true
    } catch (error) {
      console.log(error)
    }
  }
</script>
```

## Types

```ts
type DialogData = {
  title: string
  message: string
  cancelText?: string
  confirmText?: string
}

type DialogButton = {
  response?: string | boolean
  type: 'resolve' | 'reject'
  color?: Color
  size?: Size
  text: string
  outline?: boolean
  rounded?: boolean
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

type Color =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'white'
  | 'black'
  | 'transparent'

type Size = 'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
```

<!--@include: ./../.vitepress/generated-docs/maz-dialog-promise.doc.md-->
