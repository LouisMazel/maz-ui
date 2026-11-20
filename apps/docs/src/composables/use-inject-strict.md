---
title: useInjectStrict
description: inject() that throws a clear error when the value is not provided, instead of returning undefined - for the context of a parent component (form, tabs, accordion...) that its children cannot work without.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

The parent provides a context, the children read it with `useInjectStrict`: the returned value is never `undefined`, so it needs no check nor `!`.

```ts
// tabs-context.ts
import type { InjectionKey, Ref } from 'vue'

export interface TabsContext {
  active: Ref<string>
  select: (name: string) => void
}

export const TABS_KEY: InjectionKey<TabsContext> = Symbol('tabs')
```

```vue
<!-- MyTabs.vue -->
<script lang="ts" setup>
import { provide, ref } from 'vue'
import { TABS_KEY } from './tabs-context'

const active = ref('general')

provide(TABS_KEY, {
  active,
  select: (name) => { active.value = name },
})
</script>
```

```vue
<!-- MyTab.vue -->
<script lang="ts" setup>
import { useInjectStrict } from 'maz-ui/composables/useInjectStrict'
import { TABS_KEY } from './tabs-context'

const props = defineProps<{ name: string }>()

const { active, select } = useInjectStrict(TABS_KEY, undefined, 'MyTab must be used inside MyTabs')
</script>

<template>
  <button :aria-selected="active === props.name" @click="select(props.name)">
    <slot />
  </button>
</template>
```

Used outside of `MyTabs`, `MyTab` throws `TypeError: MyTab must be used inside MyTabs`.

## Parameters

| Parameter      | Type                                   | Description                                                                            |
| -------------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| `key`          | `InjectionKey<T> \| string \| symbol`  | Key given to `provide`. An `InjectionKey<T>` types the result                         |
| `fallback`     | `T`                                    | Value used when nothing is provided: then nothing is thrown                            |
| `errorMessage` | `string`                               | Message of the error. Default: `[maz-ui](injectStrict) Could not resolve <key>`        |

## Notes

- It throws a `TypeError` when the resolved value is falsy: providing `0`, `''`, `false` or `null` also throws. Provide an object or a ref.
- Like `inject`, call it in `setup` (or in another composable called in `setup`).

## Types

```ts
function useInjectStrict<T>(
  key: string | InjectionKey<T> | symbol,
  fallback?: T,
  errorMessage?: string,
): T
```
