---
title: GenericInstanceType
description: Extract the public instance type from a generic Vue component — solves the limitation where `InstanceType<typeof Component>` returns `any` for generic SFCs.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Vue's `InstanceType<typeof Component>` does not work on **generic** components (`<script setup lang="ts" generic="T">`). `GenericInstanceType` walks the type to recover the exposed methods/refs typing.

See the underlying TypeScript / Vue Language Tools issue: [vuejs/language-tools#3206](https://github.com/vuejs/language-tools/issues/3206).

## Usage

```ts
import type { GenericInstanceType } from '@maz-ui/utils'
import { ref } from 'vue'
import MyGenericList from './MyGenericList.vue'

const listRef = ref<GenericInstanceType<typeof MyGenericList> | null>(null)

// listRef.value.focus() is fully typed
```

## API

```ts
type GenericInstanceType<T> = T extends new (...args: any[]) => infer R
  ? R
  : T extends (...args: any[]) => infer R
    ? R extends { __ctx?: infer K }
      ? Exclude<K, void> extends { expose: (...args: infer Y) => void }
        ? Y[0] & InstanceType<DefineComponent>
        : any
      : any
    : any
```

## Notes

- Use this only for generic components. For non-generic SFCs, plain `InstanceType<typeof Component>` already works and is clearer.
