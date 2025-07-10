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
import { useDialog, useToast } from 'maz-ui/composables'

const dialog = useDialog()
const toast = useToast()

async function openDialog() {
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
  <div class="maz-flex maz-flex-wrap maz-gap-2">
    <MazBtn color="contrast" @click="openDialogActions">
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
  <div class="maz-flex maz-flex-wrap maz-gap-2">
    <MazBtn color="contrast" @click="openDialogResponse">
      Show dialog with custom response
    </MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { useDialog, useToast } from 'maz-ui/composables'

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
        type: 'resolve',
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
  <MazBtn color="contrast" @click="openDialogPromised">
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
    <MazBtn color="contrast" @click="openAndCloseDialog">
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
  <MazBtn color="contrast" @click="openAndCloseDialog">
    Open and close dialog
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

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

type DialogOptions = Partial<Omit<MazDialogPromiseProps, 'modelValue'>> & {
  /**
   * Dialog identifier - identifier to manage multiple dialogs
   * @default 'main-dialog'
   */
  identifier?: string
  /**
   * Custom buttons to display in the dialog and replace the default confirm and cancel buttons
   * @default [{ text: 'Confirm', color: 'success', type: 'accept' }, { text: 'Cancel', color: 'destructive', type: 'reject' }]
   */
  buttons?: MazDialogPromiseButton[]
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
  import { useDialog, useToast } from 'maz-ui/src/composables/index'

  const dialog = useDialog()
  const toast = useToast()

  async function openDialog() {
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
          type: 'resolve',
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
