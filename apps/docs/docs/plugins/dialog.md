---
title: dialog
description: Displays messages to your users in flexible and promised dialogs
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

It is a simple and easy-to-use plugin that allows you to display messages to your users in flexible and promised dialogs. The plugin will mount the `MazDialogPromise` component to the root of your application and provide you with a handler to open the dialog, close it and return a promise.

::: tip
This plugin has a composable for easier use, after installing it you can use [useDialog](./../composables/use-dialog.md)
:::

## Basic usage

You can display a simple dialog with a title and a message. The dialog will have a confirm and a cancel button. The confirm button will resolve the promise and the cancel button will reject it.

<ComponentDemo>
  <div class="maz-flex maz-flex-wrap maz-gap-2">
    <MazBtn color="contraste" @click="openDialogTexts">
      Show dialog
    </MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { useDialog, useToast } from 'maz-ui/composables'

const dialog = useDialog()
const toast = useToast()

async function openDialog() {
  const { promise } = dialog.open({
    title: 'Dialog title',
    message: 'Dialog message',
  })

  try {
    await promise

    toast.success('Dialog confirmed', {
      position: 'bottom',
    })
  }
  catch (error) {
    toast.error('Dialog cancelled', {
      position: 'bottom',
    })
  }
}
</script>

<template>
  <MazBtn color="contraste" @click="openDialog">
    Show dialog
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Change button texts

The confirmText and cancelText properties allow you to change the texts of the confirm and cancel buttons.

<ComponentDemo>
  <div class="maz-flex maz-flex-wrap maz-gap-2">
    <MazBtn color="contraste" @click="openDialogTexts">
      Show dialog with custom button texts
    </MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { useDialog, useToast } from 'maz-ui/composables'

const dialog = useDialog()
const toast = useToast()

function openDialogTexts() {
  dialog.open({
    title: 'Dialog title',
    message: 'Dialog message',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
  })
}
</script>

<template>
  <MazBtn color="contraste" @click="openDialogTexts">
    Show dialog with custom button texts
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Custom buttons with actions

The buttons property allows you to display custom buttons in the dialog and replace the default confirm and cancel buttons. You can use all props of [`MazBtn`](./../components/maz-btn.md#props) component. Each button can have a custom action to execute when clicked.

<ComponentDemo>
  <div class="maz-flex maz-flex-wrap maz-gap-2">
    <MazBtn color="contraste" @click="openDialogActions">
      Show dialog with custom buttons
    </MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { useDialog, useToast } from 'maz-ui/composables'

const dialog = useDialog()
const toast = useToast()

function openDialogActions() {
  dialog.open({
    title: 'Dialog title',
    message: 'Dialog message',
    buttons: [
      {
        text: 'Cancel 😱',
        color: 'contraste',
        outline: true,
        onClick: () => {
          toast.info('Custom button clicked', {
            position: 'bottom',
          })
        },
      },
      {
        text: 'Confirm 🚀',
        color: 'contraste',
        onClick: () => {
          toast.success('Custom button 2 clicked', {
            position: 'bottom',
          })
        },
      }
    ],
  })
}
</script>

<template>
  <MazBtn color="contraste" @click="openDialogActions">
    Show dialog with custom buttons
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Custom promised buttons

The buttons property allows you to display custom buttons in the dialog and replace the default confirm and cancel buttons. Each button can have a custom action to execute when clicked. The type property allows you to define the type of the button. The response property allows you to define the response of the promise when the button is clicked.

<ComponentDemo>
  <div class="maz-flex maz-flex-wrap maz-gap-2">
    <MazBtn color="contraste" @click="openDialogPromised">
      Show dialog with custom promised buttons
    </MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { useDialog, useToast } from 'maz-ui/composables'

const dialog = useDialog()
const toast = useToast()

async function openDialogPromised() {
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
        type: 'resolve',
        response: 'Accepted Response',
        color: 'success',
      }
    ],
  })

  try {
    const reponse = await promise

    toast.success(`Dialog resolved with: ${reponse}`, {
      position: 'bottom',
    })
  }
  catch (error) {
    toast.error(`Dialog rejected with: ${error}`, {
      position: 'bottom',
    })
  }
}
</script>

<template>
  <MazBtn color="contraste" @click="openDialogPromised">
    Show dialog with custom promised buttons
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Close dialog

You can close the dialog programmatically by calling the close method returned by the open method.

<ComponentDemo>
  <div class="maz-flex maz-flex-wrap maz-gap-2">
    <MazBtn color="contraste" @click="openAndCloseDialog">
      Open and close dialog
    </MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { useDialog, useToast } from 'maz-ui/composables'

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
  <MazBtn color="contraste" @click="openAndCloseDialog">
    Open and close dialog
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Install

`main.ts` or `main.js`

```ts
import { DialogOptions, installDialog } from 'maz-ui/plugins'
import { createApp } from 'vue'

const app = createApp(App)

const dialogOptions: DialogOptions = {
  identifier: 'my-dialog',
  promiseCallback: () => {
    console.log('Dialog closed')
  },
}

app.use(installDialog, dialogOptions)

app.mount('#app')
```

## Options

### Usage

```ts
import { type DialogHandler, useInjectStrict } from 'maz-ui/composables'

const dialog = useInjectStrict<DialogHandler>('dialog')
/*
 * or use `useDialog` composable to get the dialog handler
 * const dialog = useDialog()
 */

const options: DialogOptions = {
  title: 'Dialog title',
  message: 'Dialog message',
}

dialog.open(options)
```

### Type

```ts
import type { MazBtnProps } from 'maz-ui/components'

type DialogOptions = Partial<Omit<MazDialogPromiseProps, 'modelValue'>> & {
  /**
   * Dialog identifier - identifier to manage multiple dialogs
   * @default 'main-dialog'
   */
  identifier?: string
  /** Is callback function to execute when the dialog is resolved */
  promiseCallback?: () => unknown
  /**
   * Custom buttons to display in the dialog and replace the default confirm and cancel buttons
   * @type {DialogCustomButton[]}
   */
  buttons?: DialogCustomButton[]
  /** Confirm button props and data */
  confirmButton: {
    /**
     * Replace the confirm button text
     * @default 'Confirm'
     */
    text?: string
  } & MazBtnProps
  /** Cancel button props and data */
  cancelButton: {
    /**
     * Replace the cancel button text
     * @default 'Cancel'
     */
    text?: string
  } & MazBtnProps
}
```

<script lang="ts" setup>
  import { useDialog, useToast } from 'maz-ui/src/composables/index'

  const dialog = useDialog()
  const toast = useToast()

  async function openDialog() {
    const { promise } = dialog.open({
      title: 'Dialog title',
      message: 'Dialog message',
    })

    try {
      await promise

      toast.success('Dialog confirmed', {
        position: 'bottom',
      })
    } catch (error) {
      toast.error('Dialog cancelled', {
        position: 'bottom',
      })
    }
  }

  async function openDialogTexts() {
    const { promise } = dialog.open({
      title: 'Dialog title',
      message: 'Dialog message',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
    })

    try {
      await promise

      toast.success('Dialog confirmed', {
        position: 'bottom',
      })
    } catch (error) {
      toast.error('Dialog cancelled', {
        position: 'bottom',
      })
    }
  }

  async function openDialogActions() {
    dialog.open({
      title: 'Dialog title',
      message: 'Dialog message',
      buttons: [
        {
          text: 'Cancel 😱',
          color: 'contraste',
          outline: true,
          onClick: () => {
            toast.info('Custom button clicked', {
              position: 'bottom',
            })
          },
        },
        {
          text: 'Confirm 🚀',
          color: 'contraste',
          onClick: () => {
            toast.success('Custom button 2 clicked', {
              position: 'bottom',
            })
          },
        }
      ],
    })
  }

  async function openDialogPromised() {
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
          type: 'resolve',
          response: 'Accepted Response',
          color: 'secondary',
        }
      ],
    })

    try {
      const reponse = await promise

      toast.success(`Dialog resolved with: ${reponse}`, {
        position: 'bottom',
      })
    } catch (error) {
      toast.error(`Dialog rejected with: ${error}`, {
        position: 'bottom',
      })
    }
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
