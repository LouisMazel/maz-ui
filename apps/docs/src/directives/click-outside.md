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
    class="maz-flex maz-flex-center maz-rounded"
  >
    <MazCard v-click-outside="clikedOutside">
      Click outside me
    </MazCard>
  </div>

  <div
    v-if="hasClikedOutside"
    style="padding: 16px; margin-top: 16px; background-color: hsl(var(--maz-success)); color: black;"
    class="maz-flex maz-flex-center maz-rounded"
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

## Advanced usage with options

The directive can accept an options object to customize its behavior:

<ComponentDemo>
  <div
    style="padding: 50px; background-color: hsl(var(--maz-background-300));"
    class="maz-flex maz-flex-center maz-rounded"
  >
    <MazCard v-click-outside="{ callback: clickedOutsideWithIgnore, ignore: ['.ignore-me'] }">
      <div class="maz-p-4">
        <p>Click outside me (but not on the button below)</p>
        <MazBtn class="ignore-me maz-mt-2" color="secondary">
          This button is ignored
        </MazBtn>
      </div>
    </MazCard>
  </div>

  <div
    v-if="hasClickedOutsideWithIgnore"
    style="padding: 16px; margin-top: 16px; background-color: hsl(var(--maz-warning)); color: black;"
    class="maz-flex maz-flex-center maz-rounded"
  >
    You clicked outside (button clicks are ignored)
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { vClickOutside } from 'maz-ui/directives'
import { ref } from 'vue'

const hasClickedOutsideWithIgnore = ref(false)

function clickedOutsideWithIgnore() {
  hasClickedOutsideWithIgnore.value = true
  setTimeout(() => hasClickedOutsideWithIgnore.value = false, 2000)
}
</script>

<template>
  <MazCard v-click-outside="{ callback: clickedOutsideWithIgnore, ignore: ['.ignore-me'] }">
    <div class="p-4">
      <p>Click outside me (but not on the button below)</p>
      <MazBtn class="ignore-me mt-2" color="secondary">
        This button is ignored
      </MazBtn>
    </div>
  </MazCard>
</template>
```

  </template>
</ComponentDemo>

## Using the `once` option

The directive can be configured to trigger only once:

<ComponentDemo>
  <div
    style="padding: 50px; background-color: hsl(var(--maz-background-300));"
    class="maz-flex maz-flex-center maz-rounded"
  >
    <MazCard v-click-outside="{ callback: clickedOnce, once: true }">
      Click outside me (works only once)
    </MazCard>
  </div>

  <div
    v-if="hasClickedOnce"
    style="padding: 16px; margin-top: 16px; background-color: hsl(var(--maz-info)); color: white;"
    class="maz-flex maz-flex-center maz-rounded"
  >
    This will only show once!
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { vClickOutside } from 'maz-ui/directives'
import { ref } from 'vue'

const hasClickedOnce = ref(false)

function clickedOnce() {
  hasClickedOnce.value = true
  // This callback will only be triggered once
}
</script>

<template>
  <MazCard v-click-outside="{ callback: clickedOnce, once: true }">
    Click outside me (works only once)
  </MazCard>
</template>
```

  </template>
</ComponentDemo>

## All options combined

Here's an example using all available options:

```vue
<script lang="ts" setup>
import { vClickOutside, type VClickOutsideOptions } from 'maz-ui/directives'

const options: VClickOutsideOptions = {
  callback: handleClickOutside,
  ignore: ['.modal', '.tooltip', '.dropdown-menu'],
  capture: true,
  once: false
}

function handleClickOutside(event: Event) {
  console.log('Clicked outside!', event)
}
</script>

<template>
  <div v-click-outside="options">
    <!-- Your content -->
  </div>
</template>
```

## API Reference

### Usage Patterns

```vue
<!-- Simple function -->
<div v-click-outside="myCallback">...</div>

<!-- With options object -->
<div v-click-outside="{ callback: myCallback, ignore: ['.ignore'] }">...</div>
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `callback` | `Function` | `undefined` | **Required.** Function to call when clicking outside |
| `ignore` | `string[]` | `[]` | Array of CSS selectors to ignore when detecting clicks |
| `capture` | `boolean` | `false` | Whether to use capture phase for event listening |
| `once` | `boolean` | `false` | Whether to trigger the callback only once |

### Type Definitions

```typescript
interface VClickOutsideOptions {
  callback: (...args: any[]) => any
  ignore?: string[]
  capture?: boolean
  once?: boolean
}

type vClickOutsideBindingValue =
  | ((...args: any[]) => any)
  | VClickOutsideOptions
```

## Global install

### Vue

```typescript
import { vClickOutsideInstall } from 'maz-ui/directives'
import { createApp } from 'vue'

const app = createApp(App)

app.use(vClickOutsideInstall)

app.mount('#app')
```

### Nuxt

Please refer to the [Nuxt module documentation](./../guide/nuxt.md) for more information.

<script lang="ts" setup>
  import { ref } from 'vue'
  import { vClickOutside } from 'maz-ui/src/directives/vClickOutside'

  const hasClikedOutside = ref(false)
  const hasClickedOutsideWithIgnore = ref(false)
  const hasClickedOnce = ref(false)

  const clikedOutside = () => {
    hasClikedOutside.value = true
    setTimeout(() => hasClikedOutside.value = false, 2000)
  }

  const clickedOutsideWithIgnore = () => {
    hasClickedOutsideWithIgnore.value = true
    setTimeout(() => hasClickedOutsideWithIgnore.value = false, 2000)
  }

  const clickedOnce = () => {
    hasClickedOnce.value = true
  }
</script>
