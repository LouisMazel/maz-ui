---
title: useIdleTimeout
description: A Vue 3 composable that provides an easy way to track user inactivity on your website and execute a callback function when the user becomes idle.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: info
A plugin to know the amount of time a user has spent on your website
:::

## Demo

<ComponentDemo>
  <div class="flex items-start gap-05 items-center flex-wrap">
    <MazBtn @click="idleTimeout.start()" color="info">
      Start
    </MazBtn>
    <MazBtn @click="idleTimeout.pause()" color="warning">
      Pause
    </MazBtn>
    <MazBtn @click="idleTimeout.resume()">
      Resume
    </MazBtn>
    <MazBtn @click="idleTimeout.reset()" color="secondary">
      Reset
    </MazBtn>
    <MazBtn @click="idleTimeout.destroy()" color="destructive">
      Destroy
    </MazBtn>
  </div>

  <br />

  <MazCard block>
    <div style="display: flex;">
      <div style="flex: 1;">isIdle: {{event.isIdle ?? false}}</div>
      <div v-if="event.eventType" style="flex: 1; padding-left: 10px;">eventType: {{event.eventType ?? '-' }}</div>
    </div>
  </MazCard>

  <br />
  <br />

  <p class="maz-text-warning">Wait 5 seconds without any actions to see the dialog popup</p>

  <template #code>

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
    <MazBtn @click="idle.destroy()" color="destructive">
      Destroy
    </MazBtn>

    <MazCard block>
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
    import { MazBtn, MazCard } from 'maz-ui/components'

    import { onMounted, ref, onBeforeUnmount } from 'vue'

    import { useIdleTimeout, useDialog } from 'maz-ui/composables'

    const dialog = useDialog()

    const event = ref({})

    const timeout = 5000

    const idleTimeout = useIdleTimeout({
      callback,
      options: {
        timeout,
        immediate: false,
        once: false,
      },
    })

    async function callback({ isIdle, eventType, instance }) {
      console.log({ isIdle, eventType })
      event.value = { isIdle, eventType }

      if (isIdle) {
        try {
          instance.destroy()
          await dialog.open({
            title: 'Are you still here?',
            message: `You have been inactive for ${timeout / 1000} secondes, do you want to continue?`,
            cancelText: 'No',
            confirmText: 'Yes',
          }).promise
          instance.start()
        } catch (e) {
          // do something like logout the user
        }
      }
    }

    onMounted(() => {
      // should be executed on client side
      idleTimeout.start()
    })

    onBeforeUnmount(() => {
      // Destroy the instance when the component is destroyed to avoid memory leaks
      idleTimeout.destroy()
    })
  </script>
  ```

  </template>
</ComponentDemo>

<script lang="ts" setup>
  import { onMounted, ref, onBeforeUnmount } from 'vue'

  import { useIdleTimeout } from 'maz-ui/src/composables/useIdleTimeout'
  import { useDialog } from 'maz-ui/src/composables/useDialog'

  const dialog = useDialog()

  const event = ref({})

  const timeout = 5000

  const idleTimeout = useIdleTimeout({
    callback,
    options: {
      timeout,
      immediate: false,
      once: false,
    },
  })

  async function callback({ isIdle, eventType, instance }) {
    console.log({ isIdle, eventType })
    event.value = { isIdle, eventType }

    if (isIdle) {
      try {
        instance.destroy()
        await dialog.open({
          title: 'Are you still here?',
          message: `You have been inactive for ${timeout / 1000} secondes, do you want to continue?`,
          data: {
            cancelText: 'No',
            confirmText: 'Yes',
          }
        }).promise
        instance.start()
      } catch (e) {
        instance.destroy()
      }
    }
  }

  onMounted(() => {
    // should be executed on client
    idleTimeout.start()
  })

  onBeforeUnmount(() => {
    idleTimeout.destroy()
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
  /** @default document.body */
  element?: HTMLElement | Document
  /** @default 60 * 1000 * 5 --> 5 minutes */
  timeout?: number
  /** @default false */
  once?: boolean
  /** @default true */
  immediate?: boolean
}
```

## Actions

### Start

Start tracking user - needed for SSR when `immediate` option is set to false (execute it on client side)

```ts
idleTimeout.start()
```

### Pause

Will pause the timeout and events, can't be executed when the timeout has expired

```ts
idleTimeout.pause()
```

### Resume

Resume the instance will reinit the timeout

```ts
idleTimeout.resume()
```

### Reset

Reset the timeout of the instance like a restart

```ts
idleTimeout.reset()
```

### Destroy

Will destroy the instance and stop tracking

```ts
idleTimeout.destroy()
```
