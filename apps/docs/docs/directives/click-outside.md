---
title: vClickOutside
description: vClickOutside is a Vue 3 directive to trigger a function when the user clicks outside an element
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

<ComponentDemo>
  <div
    style="padding: 50px; background-color: hsl(var(--maz-background-300));"
    class="flex flex-center rounded"
  >
    <MazCard v-click-outside="clikedOutside">
      Click outside me
    </MazCard>
  </div>

  <div
    v-if="hasClikedOutside"
    style="padding: 16px; margin-top: 16px; background-color: hsl(var(--maz-success)); color: black;"
    class="flex flex-center rounded"
  >
    You clicked outside
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { vClickOutside } from 'maz-ui/directives'
import { ref } from 'vue'

const hasClikedOutside = ref(false)

function clikedOutside() {
  hasClikedOutside.value = true
  setTimeout(() => hasClikedOutside.value = false, 2000)
}
</script>

<template>
  <div
    style="padding: 50px; background-color: hsl(var(--maz-background-300));"
    class="flex flex-center rounded"
  >
    <MazCard v-click-outside="clikedOutside">
      Click outside me
    </MazCard>
  </div>

  <div
    v-if="hasClikedOutside"
    style="padding: 16px; margin-top: 16px; background-color: hsl(var(--maz-success)); color: black;"
    class="flex flex-center rounded"
  >
    You clicked outside
  </div>
</template>
```

  </template>
</ComponentDemo>

## Global install

`main.ts`

```typescript
import { vClickOutsideInstall } from 'maz-ui/directives'
import { createApp } from 'vue'

const app = createApp(App)

app.use(vClickOutsideInstall)

app.mount('#app')
```

<script lang="ts" setup>
  import { ref } from 'vue'
  import { vClickOutside } from 'maz-ui/src/directives/vClickOutside'

  const hasClikedOutside = ref(false)

  const clikedOutside = () => {
    hasClikedOutside.value = true
    setTimeout(() => hasClikedOutside.value = false, 2000)
  }
</script>
