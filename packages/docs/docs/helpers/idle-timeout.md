---
description: Helper to see and manage the user activity
---

# idle-timeout

Helper to see and manage the user activity

## Demo

<br />

**options**: `IdleTimeoutOptions`

```ts
const options: IdleTimeoutOptions = {
  element: document.body,
  timeout: 3000,
  immediate: true,
  once: false,
}
```

**callback**: `IdleTimeoutCallback`

```ts
const idleTimeoutCallback: IdleTimeoutCallback = ({ isIdle, eventType }) => {
  console.log({ isIdle, eventType })

  event.value = {
    isIdle,
    eventType,
  }
}
```

<br />

<div class="flex items-start gap-05 items-center flex-wrap">
  <MazBtn @click="idleTimeoutInstance?.pause" color="warning">
    Pause
  </MazBtn>
  <MazBtn @click="idleTimeoutInstance?.resume">
    Resume
  </MazBtn>
  <MazBtn @click="idleTimeoutInstance?.reset" color="secondary">
    Reset
  </MazBtn>
  <MazBtn @click="idleTimeoutInstance?.destroy" color="danger">
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
  <MazBtn @click="idleTimeoutInstance?.pause" color="warning">
    Pause
  </MazBtn>
  <MazBtn @click="idleTimeoutInstance?.resume">
    Resume
  </MazBtn>
  <MazBtn @click="idleTimeoutInstance?.reset" color="secondary">
    Reset
  </MazBtn>
  <MazBtn @click="idleTimeoutInstance?.destroy" color="danger">
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
  import { onMounted, ref } from 'vue'

  import MazBtn from 'maz-ui/components/MazBtn'
  import MazCard from 'maz-ui/components/MazCard'

  import { IdleTimeout } from 'maz-ui/package/helpers'
  // for typescript users
  import type { IdleTimeoutOptions, IdleTimeoutCallback } from 'maz-ui'

  const event = ref<{ isIdle: boolean, eventType?: string }>({})

  const idleTimeoutCallback: IdleTimeoutCallback = (payload) => {
    console.log({ isIdle, eventType })

    event.value = {
      isIdle,
      eventType,
    }
  }

  const idleTimeoutInstance = ref<IdleTimeout>()

  onMounted(() => {
    const idleTimeoutOptions: IdleTimeoutOptions = {
      element: document.body,
      timeout: 3000,
      immediate: true,
      once: false,
    }

    idleTimeoutInstance.value = new IdleTimeout(idleTimeoutCallback, idleTimeoutOptions)
  })
</script>
```

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'

  import MazBtn from 'maz-ui/components/MazBtn'
  import MazCard from 'maz-ui/components/MazCard'

  import { IdleTimeout } from 'maz-ui/package/helpers'
  // for typescript users
  import type { IdleTimeoutOptions, IdleTimeoutCallback } from 'maz-ui'

  const event = ref<{ isIdle: boolean, eventType?: string }>({})

  const idleTimeoutCallback: IdleTimeoutCallback = ({ isIdle, eventType }) => {
    console.log({ isIdle, eventType })

    event.value = {
      isIdle,
      eventType,
    }
  }

  const idleTimeoutInstance = ref<IdleTimeout>()

  onMounted(() => {
    const idleTimeoutOptions: IdleTimeoutOptions = {
      element: document.body,
      timeout: 3000,
      immediate: true,
      once: false,
    }

    idleTimeoutInstance.value = new IdleTimeout(idleTimeoutCallback, idleTimeoutOptions)
  })
</script>

## Options

### Default Options

```ts
const defaultOptions: IdleTimeoutStrictOption = {
  element: document.body,
  timeout: 60 * 1000 * 5, // 5 minutes
  once: false,
  immediate: false,
}
```

### Actions

#### Pause

Pause the instance

```ts
idleTimeoutInstance.pause()
```

#### Resume

Resume the instance

```ts
idleTimeoutInstance.resume()
```

#### Reset

Reset the timeout of the instance

```ts
idleTimeoutInstance.reset()
```

#### Destroy

Will destroy the instance

```ts
idleTimeoutInstance.destroy()
```
