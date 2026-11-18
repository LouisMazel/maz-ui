---
title: dialog
description: Displays messages to your users in flexible and promised dialogs
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

It is a simple and easy-to-use plugin that allows you to display messages to your users in flexible and promised dialogs. The plugin will mount the `MazDialogConfirm` component to the root of your application and provide you with a handler to open the dialog, close it and return a promise.

::: tip
This plugin has a composable for easier use, after installing it you can use [useDialog](./../composables/use-dialog.md)
:::

## Installation

::: code-group

```ts [Vue]
import { createApp } from 'vue'
import { DialogPlugin, DialogOptions } from 'maz-ui/plugins/dialog'

const app = createApp(App)

const dialogOptions: DialogOptions = {
  // ...
}

app.use(DialogPlugin, dialogOptions)

app.mount('#app')
```

```ts [Nuxt]
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    composables: {
      useDialog: true,
    },
  },
})
```

:::

## Basic usage

You can display a simple dialog with a title and a message. The dialog will have a confirm and a cancel button. The confirm button will resolve the promise and the cancel button will reject it.

<ComponentDemo>
  <MazBtn color="contrast" @click="openDialog">
    Show dialog
  </MazBtn>

<template #code>

```vue
<script lang="ts" setup>
import { useDialog } from 'maz-ui/composables/useDialog'
import { useToast } from 'maz-ui/composables/useToast'

const dialog = useDialog()
const toast = useToast()

async function openDialog() {
  dialog.open({
    title: 'Dialog title',
    message: 'Dialog message',
    acceptText: 'Accept',
    rejectText: 'Reject',
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
  <MazBtn color="contrast" @click="openDialog">
    Show dialog
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Custom buttons with on click actions

The buttons property allows you to display custom buttons in the dialog and replace the default confirm and cancel buttons. You can use all props of [`MazBtn`](./../components/maz-btn.md#props) component. Each button can have a custom action to execute when clicked.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:gap-2">
    <MazBtn color="contrast" @click="openDialogActions">
      Show dialog with custom buttons
    </MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { useDialog } from 'maz-ui/composables/useDialog'
import { useToast } from 'maz-ui/composables/useToast'

const dialog = useDialog()
const toast = useToast()

function openDialogActions() {
  dialog.open({
    title: 'Dialog title',
    message: 'Dialog message',
    buttons: [
      {
        text: 'Cancel 😱',
        color: 'contrast',
        outlined: true,
        onClick: () => {
          toast.info('Cancel button clicked', {
            position: 'bottom',
          })
        },
      },
      {
        text: 'Confirm 🚀',
        color: 'contrast',
        onClick: () => {
          toast.success('Confirm button clicked', {
            position: 'bottom',
          })
        },
      }
    ],
    onClose: () => {
      toast.info('Dialog closed', {
        position: 'bottom',
      })
    },
  })
}
</script>

<template>
  <MazBtn color="contrast" @click="openDialogActions">
    Show dialog with custom buttons
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Custom response

The buttons property allows you to display custom buttons in the dialog and replace the default confirm and cancel buttons. Each button can have a custom response to return when clicked. The type property allows you to define the type of the button. The response property allows you to define the response of the promise when the button is clicked.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:gap-2">
    <MazBtn color="contrast" @click="openDialogResponse">
      Show dialog with custom response
    </MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { useDialog } from 'maz-ui/composables/useDialog'
import { useToast } from 'maz-ui/composables/useToast'

const dialog = useDialog()
const toast = useToast()

async function openDialogResponse() {
  const { promise } = dialog.open({
    title: 'Dialog title',
    message: 'Dialog message',
    buttons: [
      {
        text: 'Reject',
        type: 'reject',
        response: 'Rejected Response',
        color: 'destructive',
      },
      {
        text: 'Accept',
        type: 'accept',
        response: 'Accepted Response',
        color: 'secondary',
      }
    ],
    onAccept: (response) => {
      toast.success(`Dialog accepted with: ${response}`, {
        position: 'bottom',
      })
    },
    onReject: (response) => {
      toast.error(`Dialog rejected with: ${response}`, {
        position: 'bottom',
      })
    },
  })
}
</script>

<template>
  <MazBtn color="contrast" @click="openDialogResponse">
    Show dialog with custom response
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Close dialog

You can close the dialog programmatically by calling the close method returned by the open method.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:gap-2">
    <MazBtn color="contrast" @click="openAndCloseDialog">
      Open and close dialog
    </MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { useDialog } from 'maz-ui/composables/useDialog'
import { useToast } from 'maz-ui/composables/useToast'

const dialog = useDialog()

function openAndCloseDialog() {
  const { close } = dialog.open({
    title: 'Dialog title',
    message: 'Wait 5 seconds to close the dialog',
    buttons: [],
    persistent: true,
  })

  setTimeout(() => {
    close()
  }, 5000)
}
</script>

<template>
  <MazBtn color="contrast" @click="openAndCloseDialog">
    Open and close dialog
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Await the choice with confirm

`dialog.confirm(options)` returns a `Promise<boolean>`: `true` when the user accepts, `false` otherwise (reject button, close button, escape key, click on the backdrop, `close()` or a newer dialog with the same `identifier` replacing it). The promise always resolves exactly once and never rejects, so a `try/catch` is not needed. It takes the same options as `open`, except `onAccept`, `onReject` and `onClose`.

```vue
<script lang="ts" setup>
import { useDialog } from 'maz-ui/composables/useDialog'

const dialog = useDialog()

async function removeUser() {
  const confirmed = await dialog.confirm({
    title: 'Delete user',
    message: 'This action cannot be undone.',
    acceptText: 'Delete',
    rejectText: 'Keep',
  })

  if (confirmed) {
    await deleteUser()
  }
}
</script>
```

## Rich content

Use `content` to render a component (or a functional component / render function) in the body instead of the `message`. It receives the props of `contentProps`, plus the `accept` and `reject` functions of the dialog. `contentProps` can be a ref, a getter or a reactive object: the content stays up to date while the dialog is open.

```vue
<script lang="ts" setup>
import { useDialog } from 'maz-ui/composables/useDialog'
import { h, ref } from 'vue'
import MazAlert from 'maz-ui/components/MazAlert'
import ChangesList from './ChangesList.vue'

const dialog = useDialog()
const files = ref(['a.ts', 'b.ts'])

async function publish() {
  const confirmed = await dialog.confirm({
    title: 'Publish changes',
    content: ChangesList,
    contentProps: () => ({ files: files.value }),
  })
}

function warn() {
  dialog.open({
    title: 'Warning',
    content: () => h(MazAlert, { color: 'warning' }, () => 'Check your settings first'),
  })
}
</script>
```

## Reactive buttons

`acceptProps` and `rejectProps` can be a ref, a getter or a reactive object. The buttons update while the dialog is open, for example to block the confirmation until a condition is met.

```vue
<script lang="ts" setup>
import { useDialog } from 'maz-ui/composables/useDialog'
import { computed, ref } from 'vue'

const dialog = useDialog()
const hasIdentity = ref(false)

async function commit() {
  const confirmed = await dialog.confirm({
    title: 'Commit',
    message: 'Commit all the changes?',
    acceptProps: computed(() => ({
      type: 'accept',
      color: 'success',
      disabled: !hasIdentity.value,
    })),
  })
}
</script>
```

## Options

### Usage

```ts
import { useDialog } from 'maz-ui/composables/useDialog'

const dialog = useDialog()

const options: DialogOptions = {
  title: 'Dialog title',
  message: 'Dialog message',
}

dialog.open(options)
```

### Type

```ts
import type { MazBtnProps } from 'maz-ui/components/MazBtn'
import type { Component, MaybeRefOrGetter } from 'vue'

type DialogOptions = Partial<Omit<MazDialogConfirmProps, 'modelValue' | 'acceptProps' | 'rejectProps'>> & {
  /**
   * Dialog identifier - identifier to manage multiple dialogs
   * @default 'main-dialog'
   */
  identifier?: string
  /**
   * Custom buttons to display in the dialog and replace the default confirm and cancel buttons
   * @default [{ text: 'Confirm', color: 'success', type: 'accept' }, { text: 'Cancel', color: 'destructive', type: 'reject' }]
   */
  buttons?: MazDialogConfirmButton[]
  /**
   * Props of the accept button, a ref, a getter or a reactive object to update the button while the dialog is open
   */
  acceptProps?: MaybeRefOrGetter<MazDialogConfirmProps['acceptProps']>
  /**
   * Props of the reject button, a ref, a getter or a reactive object to update the button while the dialog is open
   */
  rejectProps?: MaybeRefOrGetter<MazDialogConfirmProps['rejectProps']>
  /**
   * Component (or functional component / render function) rendered in the body instead of the message
   * It receives `contentProps`, `accept` and `reject`
   */
  content?: Component
  /**
   * Props of the content component, a ref, a getter or a reactive object
   */
  contentProps?: MaybeRefOrGetter<Record<string, unknown>>
  /**
   * Function to execute when the dialog is accepted (when the user click on the confirm button)
   * Only available if the button type is 'accept'
   */
  onAccept?: () => unknown
  /**
   * Function to execute when the dialog is rejected (when the user click on the cancel button)
   * Only available if the button type is 'reject'
   */
  onReject?: () => unknown
  /**
   * Function to execute when the dialog is closed
   */
  onClose?: () => unknown
}
```

<script lang="ts" setup>
  import { useDialog } from 'maz-ui/composables/useDialog'
  import { useToast } from 'maz-ui/composables/useToast'

  const dialog = useDialog()
  const toast = useToast()

  async function openDialog() {
    dialog.open({
      title: 'Dialog title',
      message: 'Dialog message',
      acceptText: 'Accept',
      rejectText: 'Reject',
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

  async function openDialogActions() {
    dialog.open({
      title: 'Dialog title',
      message: 'Dialog message',
      buttons: [
        {
          text: 'Cancel 😱',
          color: 'destructive',
          outlined: true,
          onClick: () => {
            toast.error('Cancel button clicked', {
              position: 'bottom',
            })
          },
        },
        {
          text: 'Confirm 🚀',
          color: 'primary',
          onClick: () => {
            toast.success('Confirm button clicked', {
              position: 'bottom',
            })
          },
        }
      ],
      onClose: () => {
        toast.info('Dialog closed', {
          position: 'bottom',
        })
      },
    })
  }

  async function openDialogResponse() {
    const { promise } = dialog.open({
      title: 'Dialog title',
      message: 'Dialog message',
      buttons: [
        {
          text: 'Reject',
          type: 'reject',
          response: 'Rejected Response',
          color: 'destructive',
        },
        {
          text: 'Accept',
          type: 'accept',
          response: 'Accepted Response',
          color: 'secondary',
        }
      ],
      onAccept: (response) => {
        toast.success(`Dialog accepted with: ${response}`, {
          position: 'bottom',
        })
      },
      onReject: (response) => {
        toast.error(`Dialog rejected with: ${response}`, {
          position: 'bottom',
        })
      },
    })
  }

  async function openAndCloseDialog() {
    const { close } = dialog.open({
      title: 'Dialog title',
      message: 'Wait 5 seconds to close the dialog',
      buttons: [],
      persistent: true,
    })

    setTimeout(() => {
      close()
    }, 5000);
  }
</script>
