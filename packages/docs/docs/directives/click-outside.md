---
title: vClickOutside
description: vClickOutside is a Vue 3 directive to trigger a function when the user clicks outside from a element
---

# vClickOutside

Vue 3 directive to trigger a function when the user clicks outside from a element

## Basic usage

<div
  style="padding: 50px; background-color: var(--maz-color-bg-lighter);"
  class="flex flex-center rounded"
>
  <MazCard v-click-outside="clikedOutside">
    Click outside me
  </MazCard>
</div>

<div
  v-if="hasClikedOutside"
  style="padding: 16px; margin-top: 16px; background-color: var(--maz-color-success); color: black;"
  class="flex flex-center rounded"
>
  You clicked outside
</div>

```vue
<template>
  <div
    style="padding: 50px; background-color: var(--maz-color-bg-lighter);"
    class="flex flex-center rounded"
  >
    <MazCard v-click-outside="clikedOutside">
      Click outside me
    </MazCard>
  </div>

  <div
    v-if="hasClikedOutside"
    style="padding: 16px; margin-top: 16px; background-color: var(--maz-color-success); color: black;"
    class="flex flex-center rounded"
  >
    You clicked outside
  </div>
</template>

<script lang="ts" setup>
  import { vClickOutside } from 'maz-ui'
  import { ref } from 'vue'

  const hasClikedOutside = ref(false)

  const clikedOutside = () => {
    hasClikedOutside.value = true
    setTimeout(() => hasClikedOutside.value = false, 2000)
  }
</script>
```

## Global install

`main.ts`

```typescript
import { createApp } from 'vue'
import { vClickOutsideInstall } from 'maz-ui'
import errorPhoto from 'path/to/error-photo.png'

const app = createApp(App)

app.use(vClickOutsideInstall)

app.mount('#app')
```

<script lang="ts" setup>
  import { ref } from 'vue'
  import { vClickOutside } from 'maz-ui'

  const hasClikedOutside = ref(false)

  const clikedOutside = () => {
    hasClikedOutside.value = true
    setTimeout(() => hasClikedOutside.value = false, 2000)
  }
</script>