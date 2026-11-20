---
title: useFreezeValue
description: Take a frozen snapshot of a value (ref or plain value) at a given moment - an object or an array that cannot be modified and no longer follows the source - for example to keep the initial values of a form.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

Keep the initial values of a form to know whether it changed, or to reset it:

```vue
<script lang="ts" setup>
import { isEqual } from '@maz-ui/utils/helpers/isEqual'
import { useFreezeValue } from 'maz-ui/composables/useFreezeValue'
import { computed, ref } from 'vue'

const form = ref({ name: 'Ana', email: 'ana@example.com' })

const initialValues = useFreezeValue(form)

const isDirty = computed(() => !isEqual(form.value, initialValues))

function reset() {
  form.value = { ...initialValues }
}
</script>
```

## Behavior

- The value is read once, when `useFreezeValue` is called: later changes of the ref are not followed.
- An object or an array is copied, then frozen with `Object.freeze`: modifying it does nothing (or throws in strict mode), and the source is not frozen.
- The freeze is shallow: the nested objects are shared with the source and can still change. Pass a deep copy (`structuredClone(toRaw(form.value))`) for nested values.
- A primitive (string, number, boolean...) is returned as is.

## Types

```ts
function useFreezeValue<T>(value: MaybeRef<T>): Readonly<T>
```
