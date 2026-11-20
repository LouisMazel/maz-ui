---
title: useInstanceUniqId
description: A unique and SSR-safe id for each instance of a component (prefixed with the component name, built on Vue useId), or the id given by the user - to link a label, an input and its hint with for, aria-describedby or aria-controls.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```vue
<script lang="ts" setup>
import { useInstanceUniqId } from 'maz-ui/composables/useInstanceUniqId'

const props = defineProps<{ id?: string, label: string, hint?: string }>()

const instanceId = useInstanceUniqId({
  componentName: 'MyField',
  providedId: props.id,
})
</script>

<template>
  <label :for="instanceId">{{ label }}</label>
  <input :id="instanceId" :aria-describedby="hint ? `${instanceId}-hint` : undefined">
  <p v-if="hint" :id="`${instanceId}-hint`">
    {{ hint }}
  </p>
</template>
```

Without the `id` prop, the id looks like `MyField-v-0`: the same on the server and on the client, so the hydration does not break. With `id="email"`, it is `email`.

## Parameters

| Parameter       | Type     | Description                                                  |
| --------------- | -------- | ------------------------------------------------------------ |
| `componentName` | `string` | Prefix of the generated id                                   |
| `providedId`    | `string` | Id to use instead of the generated one (usually a prop)      |

## Return

`ComputedRef<string>`: the id. Use `instanceId` in the template, `instanceId.value` in the script.

## Notes

- `providedId` is read as a plain value: a later change of the prop is not followed.
- Call it in `setup`, like Vue `useId`. For an id outside of a component, use `useId` of Vue directly.

## Types

```ts
function useInstanceUniqId(options: {
  componentName: string
  providedId?: string
}): ComputedRef<string>
```
