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

MazDialogPromise is a standalone component that dialogs with the user to show important information and propose confirmation. You should wait for this response with await.

## Basic usage

<MazBtn @click="askToUser">Ask user</MazBtn>

<MazDialogPromise
  :data="{
    title: 'Delete user',
    message: 'Are you sure to delete this user ?',
  }"
  identifier="one"
/>
<MazDialogPromise identifier="two">
  <template #title>
    Do you really want to delete this user ?
  </template>
  <template #default>
    Are you really sure you want to delete this user ?
  </template>
</MazDialogPromise>

<MazDialog v-model="confirmDialog">
  <template #title>
    User deleted
  </template>
  <template #default>
    User has been deleted !
  </template>
</MazDialog>

<script setup>
  import { ref } from 'vue'
  import {
    useMazDialogPromise,
  } from 'maz-ui/components/MazDialogPromise'

  const { showDialogAndWaitChoice } = useMazDialogPromise()
  const confirmDialog = ref(false)

  const askToUser = async () => {
    await showDialogAndWaitChoice('one')
    await showDialogAndWaitChoice('two')
    confirmDialog.value = true
  }
</script>

```vue
<template>
  <MazBtn @click="askToUser">Ask user</MazBtn>

  <MazDialogPromise
    :data="{
      title: 'Delete user',
      message: 'Are you sure you want to delete this user ?',
    }"
    identifier="one"
  />
  <MazDialogPromise identifier="two">
    <template #title>
      Do you really want to delete this user ?
    </template>
    <template #default>
      Are you really sure you want to delete this user ?
    </template>
  </MazDialogPromise>

  <MazDialog v-model="confirmDialog">
    <template #title>
      User deleted
    </template>
    <template #default>
      User has been deleted !
    </template>
  </MazDialog>
</template>

<script setup>
  import { ref } from 'vue'
  import MazDialogPromise, {
    useMazDialogPromise,
  } from 'maz-ui/components/MazDialogPromise'
  import MazDialog from 'maz-ui/components/MazDialog'

  const confirmDialog = ref(false)

  const { showDialogAndWaitChoice } = useMazDialogPromise()

  const askToUser = async () => {
    await showDialogAndWaitChoice('one')
    await showDialogAndWaitChoice('two')
    confirmDialog.value = true
  }
</script>
```

<!--@include: ./../.vitepress/generated-docs/maz-dialog-promise.doc.md-->
