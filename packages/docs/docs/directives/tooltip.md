---
title: vTooltip
description: vTooltip is a Vue 3 directive to display a text when the user hovers an element
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

<ComponentDemo>
  <p class="maz-mb-4">
    Hover the buttons
  </p>
  <div
    class="maz-flex maz-gap-3 maz-flex-wrap"
  >
    <MazBtn v-tooltip="'This is a top tooltip'">
      Top
    </MazBtn>
    <MazBtn v-tooltip.right="'This is a top tooltip'">
      Right
    </MazBtn>
    <MazBtn v-tooltip.left="'This is a top tooltip'">
      Left
    </MazBtn>
    <MazBtn v-tooltip.bottom="'This is a top tooltip'">
      Bottom
    </MazBtn>
  </div>

  <template #code>

  ```vue
  <template>
    <MazBtn v-tooltip="'This is a top tooltip'">
      Top
    </MazBtn>
    <MazBtn v-tooltip.right="'This is a top tooltip'">
      Right
    </MazBtn>
    <MazBtn v-tooltip.left="'This is a top tooltip'">
      Left
    </MazBtn>
    <MazBtn v-tooltip.bottom="'This is a top tooltip'">
      Bottom
    </MazBtn>
  </template>

  <script lang="ts" setup>
    import { vTooltip } from 'maz-ui'
  </script>
  ```

  </template>
</ComponentDemo>

## Colors

<ComponentDemo>
  <p class="maz-mb-4">
    Hover the buttons
  </p>
  <div
    class="maz-flex maz-gap-3 maz-flex-wrap"
  >
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'primary' }">
      Primary
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'secondary' }" color="secondary">
      Secondary
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'success' }" color="success">
      Success
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'warning' }" color="warning">
      Warning
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'danger' }" color="danger">
      Danger
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'info' }" color="info">
      Info
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'light' }" color="white">
      light
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'dark' }" color="black">
      Dark
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'white' }" color="white">
      White
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'black' }" color="black">
      Black
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'theme' }" color="theme">
      theme
    </MazBtn>
  </div>

  <template #code>

  ```vue
  <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'primary' }">
    Primary
  </MazBtn>
  <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'secondary' }" color="secondary">
    Secondary
  </MazBtn>
  <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'success' }" color="success">
    Success
  </MazBtn>
  <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'warning' }" color="warning">
    Warning
  </MazBtn>
  <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'danger' }" color="danger">
    Danger
  </MazBtn>
  <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'info' }" color="info">
    Info
  </MazBtn>
  <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'light' }" color="white">
    light
  </MazBtn>
  <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'dark' }" color="black">
    Dark
  </MazBtn>
  <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'white' }" color="white">
    White
  </MazBtn>
  <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'black' }" color="black">
    Black
  </MazBtn>
  <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'theme' }" color="theme">
    theme
  </MazBtn>
  ```

  </template>
</ComponentDemo>

## Open programmatically

<ComponentDemo>
  <div class="maz-flex maz-gap-3 maz-flex-wrap">
    <MazBtn v-tooltip.top="{ text: 'Tooltip text', open: open }">
      Primary
    </MazBtn>
    <MazBtn @click="open = !open" color="secondary">
      Toggle tooltip
    </MazBtn>
  </div>

  <template #code>

  ```vue
  <template>
    <MazBtn v-tooltip.top="{ text: 'Tooltip text', open: open }">
      Primary
    </MazBtn>
    <MazBtn @click="open = !open" color="secondary">
      Toggle tooltip
    </MazBtn>
  </template>

  <script lang="ts" setup>
    import { ref } from 'vue'
    import { vTooltip } from 'maz-ui'
    const open = ref(true)
  </script>
  ```

  </template>
</ComponentDemo>

## Global install

### Vue 3

`main.ts`

```typescript
import { createApp } from 'vue'
import { vTooltipInstall } from 'maz-ui'

const app = createApp(App)

// Options are optional
app.use(vTooltipInstall, {
  position: 'top',
  color: 'primary',
})

app.mount('#app')
```

### Nuxt

Please refer to the [Nuxt module documentation](./../guide/nuxt.md) for more information.

## Types

```ts
type vTooltipOptions = {
  position?: 'top' | 'bottom' | 'left' | 'right'
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "danger" | "white" | "black" | "theme" | "default" | "light" | "dark"
}

type vTooltipBindingValue =
  | string
  | ({
      text: string
      open?: boolean
    } & vTooltipOptions)
```

<script lang="ts" setup>
  import { ref } from 'vue'
  import { vTooltip } from 'maz-ui'
  const open = ref(true)
</script>
