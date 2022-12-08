---
title: useIdleTimeout
description: Plugin to track user activity and manage it
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip
Useful to know exactly time spend by user on your website
:::

## Demo

<br />

<div class="flex items-start gap-05 items-center flex-wrap">
  <MazBtn @click="idle.start()" color="info">
    Start
  </MazBtn>
  <MazBtn @click="idle.pause()" color="warning">
    Pause
  </MazBtn>
  <MazBtn @click="idle.resume()">
    Resume
  </MazBtn>
  <MazBtn @click="idle.reset()" color="secondary">
    Reset
  </MazBtn>
  <MazBtn @click="idle.destroy()" color="danger">
    Destroy
  </MazBtn>
</div>

<br />

<MazCard overflow-hidden style="width: 100%;">
  <div style="display: flex;">
    <div style="flex: 1;">isIdle: {{event.isIdle ?? false}}</div>
    <div v-if="event.eventType" style="flex: 1; padding-left: 10px;">eventType: {{event.eventType ?? '-' }}</div>
  </div>
</MazCard>

**Wait 3 seconds without any actions to see the idle change to true**

## How to use it ?

```vue
<template>
  <MazBtn @click="idle.start()" color="info">
    Start
  </MazBtn>
  <MazBtn @click="idle.pause()" color="warning">
    Pause
  </MazBtn>
  <MazBtn @click="idle.resume()">
    Resume
  </MazBtn>
  <MazBtn @click="idle.reset()" color="secondary">
    Reset
  </MazBtn>
  <MazBtn @click="idle.destroy()" color="danger">
    Destroy
  </MazBtn>

  <MazCard overflow-hidden style="width: 100%;">
    <div style="display: flex;">
      <div style="flex: 1;">
        isIdle: {{event.isIdle}}
      </div>
      <div v-if="event.eventType" style="flex: 1; padding-left: 10px;">
        eventType: {{event.eventType}}
      </div>
    </div>
  </MazCard>
</template>

<script lang="ts" setup>
  import MazBtn from 'maz-ui/components/MazBtn'
  import MazCard from 'maz-ui/components/MazCard'

  import { onMounted, ref, onBeforeUnmount } from 'vue'

  import { useIdleTimeout } from 'maz-ui'

  const event = ref({})

  const callback = ({ isIdle, eventType }) => {
    console.log({ isIdle, eventType })
    event.value = { isIdle, eventType }
  }

  const options = {
    element: document.body,
    timeout: 3000,
    immediate: false,
    once: false,
  }

  // should be executed on client
  const callback = ({ isIdle, event }) => {
    console.log({ isIdle, event })
    event.value = { isIdle, event }
  }

  onMounted(() => {
    idle.value.start()
  })

  onBeforeUnmount(() => {
    idle.value.destroy()
  })
</script>
```

<script lang="ts" setup>
  import MazBtn from 'maz-ui/components/MazBtn'
  import MazCard from 'maz-ui/components/MazCard'

  import { onMounted, ref, onBeforeUnmount } from 'vue'

  import { useIdleTimeout } from 'maz-ui'

  const event = ref({})

  const callback = ({ isIdle, eventType }) => {
    console.log({ isIdle, eventType })
    event.value = { isIdle, eventType }
  }

  const options = {
    element: document.body,
    timeout: 3000,
    immediate: false,
    once: false,
  }

  // should be executed on client
  const { idle } = useIdleTimeout({
    callback,
    options,
  })

  onMounted(() => {
    idle.value.start()
  })

  onBeforeUnmount(() => {
    idle.value.destroy()
  })
</script>

## Callback

```ts
type IdleTimeoutCallback = (payload: {
  isIdle: boolean
  eventType?: string
}) => void
```

## Options

```ts
interface IdleTimeoutStrictOption {
  element?: HTMLElement | Document // DEFAULT: document.body
  timeout?: number // in milliseconds - DEFAULT: 60 * 1000 * 5 = 5 minutes
  once?: boolean // DEFAULT: false
  immediate?: boolean // DEFAULT: true
}
```

### Default Options

```ts
const defaultOptions: IdleTimeoutStrictOption = {
  element: document.body,
  timeout: 60 * 1000 * 5, // 5 minutes
  once: false,
  immediate: false,
}
```

## Actions

### Start

Start tracking user - needed for SSR when `immediate` option is set to false (execute it on client side)

```ts
idle.value.start()
```

### Pause

Will pause the timeout and events

```ts
idle.value.pause()
```

### Resume

Resume the instance will reinit the timeout

```ts
idle.value.resume()
```

### Reset

Reset the timeout of the instance like a restart

```ts
idle.value.reset()
```

### Destroy

Will destroy the instance and stop tracking

```ts
idle.value.destroy()
```
