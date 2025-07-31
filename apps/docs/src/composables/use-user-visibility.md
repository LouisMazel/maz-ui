---
title: user-visibility
description: Plugin to see and manage the user page visibility
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip
Useful to know if the user is displaying your website
:::

## Demo

<MazCard overflow-hidden style="width: 100%; margin-bottom: 1rem;">
  <h3 style="margin-top: 0; margin-bottom: 1rem;">Logs</h3>

  <div v-for="({isVisible}, i) in events" :key="i">
    isVisible: {{isVisible}}
  </div>
</MazCard>

<div class="flex items-start gap-05 items-center flex-wrap">
  <MazBtn @click="userVisibility.start()" color="info">
    Start
  </MazBtn>

<MazBtn @click="userVisibility.destroy()" color="destructive">
Destroy
</MazBtn>

</div>

::: tip
Switch tabs for a second to see events
:::

## How to use it?

```vue
<script lang="ts" setup>
import { useUserVisibility } from 'maz-ui/composables'

import { onBeforeUnmount, onMounted, ref } from 'vue'

const events = ref([])

function callback({ isVisible }) {
  console.log('isVisible', isVisible)
  events.value.push({ isVisible })
}

const options = {
  immediate: true,
  once: false,
  timeout: 1000,
  ssr: true,
}

const userVisibility = useUserVisibility({ callback, options })

onMounted(() => {
  userVisibility.start()
})

onBeforeUnmount(() => {
  userVisibility.destroy()
})
</script>

<template>
  <MazBtn color="destructive" @click="userVisibility.destroy()">
    Destroy
  </MazBtn>

  <MazBtn color="destructive" @click="userVisibility.destroy()">
    Destroy
  </MazBtn>

  <MazCard overflow-hidden style="width: 100%;">
    <h3>Logs</h3>

    <div v-for="({ isVisible }, i) in events" :key="i">
      isVisible: {{ isVisible }}
    </div>
  </MazCard>
</template>
```

<script lang="ts" setup>
  import { onMounted, ref, onBeforeUnmount } from 'vue'

  import { useUserVisibility } from 'maz-ui/src/composables/useUserVisibility'

  const events = ref([])

  const callback = ({ isVisible }) => {
    console.log('isVisible', isVisible)
    events.value.push({ isVisible: isVisible })
  }

  const options = {
    immediate: true,
    once: false,
    timeout: 1000,
    ssr: true,
  }

  const userVisibility = useUserVisibility({ callback, options })

  onMounted(() => {
    userVisibility.start()
  })

  onBeforeUnmount(() => {
    userVisibility.destroy()
  })
</script>

## Callback

```ts
export type UserVisibilyCallback = ({
  isVisible,
}: {
  isVisible: boolean
}) => void
```

## Options

```ts
interface UserVisibilyStrictOptions {
  immediate: boolean
  timeout: number
  once: boolean
  ssr: boolean // if `true`
}
```

### Default Options

```ts
const defaultOptions: UserVisibilyOptions = {
  immediate: false,
  timeout: 5000,
  once: false,
  ssr: false,
}
```

## Actions

### Start

Will start the user visibility tracking

```ts
userVisibility.start()
```

### Destroy

Will destroy the instance and stop the tracking

```ts
userVisibility.destroy()
```
