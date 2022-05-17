---
description: Helper to see and mange the user page visibility
---

# user-visibility

Helper to see and mange the user page visibility

## Demo

<br />

**options**: `IdleTimeoutOptions`

```ts
const userVisibilyOptions: UserVisibilyOptions = {
  immediate: true,
  once: false,
  timeout: 1000,
}
```

**callback**: `IdleTimeoutCallback`

```ts
const userVisibilyCallback: UserVisibilyCallback = ({ isVisible }) => {
  console.log('isVisible', isVisible)
  event.value.push({ isVisible: isVisible })
}
```

<br />

<MazBtn @click="userVisibilityInstance?.destroy" color="danger">
  Destroy
</MazBtn>

<br />
<br />

<MazCard overflow-hidden style="width: 100%;">
  <div v-for="({isVisible}, i) in events" :key="i">
    isVisible: {{isVisible}}
  </div>
</MazCard>

**Switch tabs for a second to see events**

## How to use it ?

```vue
<template>
  <MazBtn @click="userVisibilityInstance?.destroy" color="danger">
    Destroy
  </MazBtn>

  <MazCard overflow-hidden style="width: 100%;">
    <div v-for="({isVisible}, i) in events" :key="i">
      isVisible: {{isVisible}}
    </div>
  </MazCard>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'

  import MazBtn from 'maz-ui/components/MazBtn'
  import MazCard from 'maz-ui/components/MazCard'

  import { UserVisibility } from 'maz-ui/package/helpers'
  // for typescript users
  import type { UserVisibilyOptions, UserVisibilyCallback } from 'maz-ui'

  const events = ref<{ isVisible: boolean }[]>([])

  const userVisibilyCallback: UserVisibilyCallback = ({ isVisible }) => {
    console.log('isVisible', isVisible)
    events.value.push({ isVisible: isVisible })
  }

  const userVisibilyOptions: UserVisibilyOptions = {
    immediate: false,
    once: false,
    timeout: 1000,
  }

  const userVisibilityInstance = ref<UserVisibility>()

  onMounted(() => {
    userVisibilityInstance.value = new UserVisibility(userVisibilyCallback, userVisibilyOptions)
  })
</script>
```

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'

  import MazBtn from 'maz-ui/components/MazBtn'
  import MazCard from 'maz-ui/components/MazCard'

  import { UserVisibility } from 'maz-ui/package/helpers'
  // for typescript users
  import type { UserVisibilyOptions, UserVisibilyCallback } from 'maz-ui'

  const events = ref<{ isVisible: boolean }[]>([])

  const userVisibilyCallback: UserVisibilyCallback = ({ isVisible }) => {
    console.log('isVisible', isVisible)
    events.value.push({ isVisible: isVisible })
  }

  const userVisibilyOptions: UserVisibilyOptions = {
    immediate: true,
    once: false,
    timeout: 1000,
  }

  const userVisibilityInstance = ref<UserVisibility>()

  onMounted(() => {
    userVisibilityInstance.value = new UserVisibility(userVisibilyCallback, userVisibilyOptions)
  })
</script>

## Options

### Default Options

```ts
const defaultOptions: UserVisibilyOptions = {
  immediate: false,
  timeout: 5000,
  once: false,
}
```

### Actions

#### Destroy

Will destroy the instance

```ts
userVisibilityInstance.destroy()
```
