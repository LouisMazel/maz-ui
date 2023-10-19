---
title: toaster
description: Displays messages to your users in flexible toasts
---


# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip
This plugin has a composable for easier use, after installing it you can use [useToast](./../composables/use-toast.md)
:::

## Basic usage

<div class="maz-flex maz-flex-wrap maz-gap-2">
  <MazBtn color="info" @click="showInfo">
    Info toast on top
  </MazBtn>

  <MazBtn color="danger" @click="showError">
    Error toast on bottom with 1s timeout
  </MazBtn>

  <MazBtn color="warning" @click="showWarning">
    Warning toast on top right
  </MazBtn>

  <MazBtn color="success" @click="showSuccess">
    Persistent success toast on bottom left
  </MazBtn>
</div>

### Action and link

Toast can have a link or an action

<div class="maz-flex maz-flex-wrap maz-gap-2">
  <MazBtn color="info" @click="showInfoWithLink">
    Toast with  link
  </MazBtn>
  <MazBtn color="warning" @click="showInfoWithExternalLink">
    Toast with blank link
  </MazBtn>
  <MazBtn color="danger" @click="showInfoWithAction">
    Toast with action
  </MazBtn>
</div>

```vue
<template>
  <MazBtn color="info" @click="showInfo">
    Show persistent info toast on top
  </MazBtn>

  <MazBtn color="danger" @click="showError">
    Show error toast on bottom with 1s timeout
  </MazBtn>

  <MazBtn color="warning" @click="showWarning">
    Show warning toast on top right
  </MazBtn>

  <MazBtn color="success" @click="showSuccess">
    Show persistent success toast on bottom left
  </MazBtn>

  <MazBtn color="info" @click="showInfoWithLink">
    Toast with  link
  </MazBtn>
  <MazBtn color="warning" @click="showInfoWithExternalLink">
    Toast with blank link
  </MazBtn>
  <MazBtn color="danger" @click="showInfoWithAction">
    Toast with action
  </MazBtn>
</template>

<script lang="ts" setup>
  import { useToast } from 'maz-ui'

  const toast = useToast()

  function showInfo () {
    toast.info('Info message', {
      position: 'top',
      link: 'https://www.loicmazuel.com'
    })
  }

  function showError () {
    toast.error('Error message', {
      position: 'bottom',
      timeout: 1000,
    })
  }

  function showWarning () {
    toast.warning('Warning message', {
      position: 'top-right'
    })
  }

  function showSuccess () {
    toast.success('Success message', {
      position: 'bottom-left',
      persistent: true,
    })
  }

  function showInfoWithLink () {
    toast.info('Toast with link, click -->', {
      link: {
        href: 'https://www.loicmazuel.com',
      }
    })
  }

  function showInfoWithExternalLink () {
    toast.warning('Toast with link', {
      link: {
        href: 'https://www.loicmazuel.com',
        target: '_blank',
        closeToast: true,
        text: 'Follow link'
      }
    })
  }

  function showInfoWithAction () {
    toast.error('Toast with action', {
      action: {
        func: () => new Promise(async (resolve) => {
          await sleep(3000)
          resolve()
        }),
        text: 'Exec promise',
        closeToast: true
      }
    })
  }
</script>
```

<script lang="ts" setup>
  import { useToast, sleep } from 'maz-ui'

  const toast = useToast()

  function showInfo () {
    toast.info('Info message', {
      position: 'top',
    })
  }

  function showError () {
    toast.error('Error message', {
      position: 'bottom',
      timeout: 1000,
    })
  }

  function showWarning () {
    toast.warning('Warning message', {
      position: 'top-right',
    })
  }

  function showSuccess () {
    toast.success('Success message', {
      position: 'bottom-left',
      persistent: true,
    })
  }

  function showInfoWithLink () {
    toast.info('Toast with link, click -->', {
      link: {
        href: 'https://www.loicmazuel.com',
      }
    })
  }

  function showInfoWithExternalLink () {
    toast.warning('Toast with link', {
      link: {
        href: 'https://www.loicmazuel.com',
        target: '_blank',
        closeToast: true,
        text: 'Follow link'
      }
    })
  }

  function showInfoWithAction () {
    toast.error('Toast with action', {
      action: {
        func: () => new Promise(async (resolve) => {
          await sleep(3000)
          resolve()
        }),
        text: 'Exec promise',
        closeToast: true
      }
    })
  }
</script>

## Install

`main.ts` or `main.js`

```ts
import { createApp } from 'vue'
import { installToaster, ToasterOptions } from 'maz-ui'

const app = createApp(App)

// DEFAULT OPTIONS
const toasterOptions: ToasterOptions = {
  position: 'bottom-right',
  timeout: 10_000,
  persistent: false,
}

app.use(installToaster, toasterOptions)

app.mount('#app')
```

## Options

### Positions

```ts
type ToasterPosition =
  | 'top'
  | 'top-right'
  | 'top-left'
  | 'bottom'
  | 'bottom-right'
  | 'bottom-left'
```

### Persistent

```ts
const persistent: boolean = false
```

### Timeout

```ts
const timeout: number = 10000 // in ms
```

### Link

```ts
export type ToasterLink = {
  href: string
  text?: string
  target?: string
  closeToast?: boolean
}
```

### Action

```ts
export type ToasterAction = {
  func: (..._arguments: unknown[]) => unknown
  text: string
  closeToast?: boolean
}
```
