---
description: Display messages to your users in flexible toasts
---

# toaster

> Display messages to your users in flexibles toasts

## Basic usage

<br />


<div class="flex flex-wrap gap-05">
  <MazBtn color="info" @click="showInfo">
    Show info toast on top
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
</template>

<script lang="ts" setup>
  import { inject } from 'vue'
  import { ToasterHandler } from 'maz-ui'

  const toast = inject<ToasterHandler>('toast')

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
      position: 'top-right'
    })
  }

  function showSuccess () {
    toast.success('Success message', {
      position: 'bottom-left',
      persistent: true,
    })
  }
</script>
```

<script lang="ts" setup>
  import { inject } from 'vue'

  import { ToasterHandler } from 'maz-ui'

  const toast = inject<ToasterHandler>('toast')

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
type ToasterPositions =
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
