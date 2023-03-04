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
  <MazBtn @click="visibility.start()" color="info">
    Start
  </MazBtn>

  <MazBtn @click="visibility.destroy()" color="danger">
    Destroy
  </MazBtn>
</div>

::: tip
Switch tabs for a second to see events
:::

## How to use it ?

```vue
<template>
  <MazBtn @click="visibility.destroy()" color="danger">
    Destroy
  </MazBtn>

  <MazBtn @click="visibility.destroy()" color="danger">
    Destroy
  </MazBtn>

  <MazCard overflow-hidden style="width: 100%;">
    <h3>Logs</h3>

    <div v-for="({isVisible}, i) in events" :key="i">
      isVisible: {{isVisible}}
    </div>
  </MazCard>
</template>

<script lang="ts" setup>
  import { onMounted, ref, onBeforeUnmount } from 'vue'

  import { useUserVisibility } from 'maz-ui'

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

  const { visibility } = useUserVisibility({ callback, options })

  onMounted(() => {
    visibility.value.start()
  })

  onBeforeUnmount(() => {
    visibility.value.destroy()
  })d
</script>
```

<script lang="ts" setup>
  import { onMounted, ref, onBeforeUnmount } from 'vue'

  import { useUserVisibility } from 'maz-ui'

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

  const { visibility } = useUserVisibility({ callback, options })

  onMounted(() => {
    visibility.value.start()
  })

  onBeforeUnmount(() => {
    visibility.value.destroy()
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
type UserVisibilyStrictOptions = {
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

Will start the user visibilty tracking

```ts
visibility.start()
```

### Destroy

Will destroy the instance and stop the tracking

```ts
visibility.destroy()
```
