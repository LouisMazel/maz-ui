---
title: MazInputKeyValue
description: MazInputKeyValue is a field to edit an object of strings as key and value pairs (environment variables, headers, metadata). Add and remove pairs, the duplicated keys are flagged. Same sizes and states as MazInput.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo>
  <MazInputKeyValue
    v-model="variables"
    top-label="Environment variables"
    block
  />

  <p class="maz:mt-4! maz:mb-0!">
    <b>Value:</b> {{ variables }}
  </p>

<template #code>

```vue
<script lang="ts" setup>
import MazInputKeyValue from 'maz-ui/components/MazInputKeyValue'
import { ref } from 'vue'

const variables = ref<Record<string, string>>({ NODE_ENV: 'production' })
</script>

<template>
  <MazInputKeyValue
    v-model="variables"
    top-label="Environment variables"
    block
  />
</template>
```

  </template>
</ComponentDemo>

- `v-model` is an object of strings. The add button appends an empty pair and focuses its key.
- The cross of a pair removes it.
- A pair without a key is not in the object until its key is typed. Keys are trimmed.
- When two pairs have the same key, the second one is flagged and left out of the object until the key is changed.

## Labels

`key-label`, `value-label` and `add-label` replace the default texts (translated). `label` names the group for screen readers, `top-label` shows a visible label above the fields (and names the group too).

<ComponentDemo>
  <MazInputKeyValue
    v-model="headers"
    top-label="HTTP headers"
    key-label="Header"
    value-label="Content"
    add-label="Add a header"
    assistive-text="One header per line"
    block
  />

<template #code>

```vue
<MazInputKeyValue
  v-model="headers"
  top-label="HTTP headers"
  key-label="Header"
  value-label="Content"
  add-label="Add a header"
  assistive-text="One header per line"
  block
/>
```

  </template>
</ComponentDemo>

## Limit the pairs

<ComponentDemo>
  <MazInputKeyValue v-model="limited" label="Labels" :max-items="2" block />

<template #code>

```vue
<MazInputKeyValue v-model="labels" label="Labels" :max-items="2" />
```

  </template>
</ComponentDemo>

## Sizes, colors and states

`size`, `rounded-size` and `color` work as on `MazInput`. `error`, `success`, `warning` and `disabled` apply to every field (`disabled` also hides the add button).

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazInputKeyValue v-model="small" size="sm" label="Small" color="secondary" block />
    <MazInputKeyValue v-model="small" label="Error" error assistive-text="Fix the values" block />
    <MazInputKeyValue v-model="small" label="Disabled" disabled block />
  </div>

<template #code>

```vue
<MazInputKeyValue v-model="pairs" size="sm" color="secondary" label="Small" />
<MazInputKeyValue v-model="pairs" label="Error" error assistive-text="Fix the values" />
<MazInputKeyValue v-model="pairs" label="Disabled" disabled />
```

  </template>
</ComponentDemo>

## Label above the field

Set `topLabel: true` in the [global defaults](../guide/global-defaults.md) to show the `label` above the field instead of floating inside it. A `top-label` set on an instance still wins. The key and value fields of the rows keep their floating label.

## Accessibility

- The component is a `group` named by `label` or `top-label`, and described by `assistive-text`.
- Every field has its own label, and the remove button of a pair is named after its key.
- A duplicated key is flagged with `aria-invalid` and a message under the field.

<!--@include: ./../../.vitepress/generated-docs/maz-input-key-value.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'

  const variables = ref({ NODE_ENV: 'production', PORT: '3000' })
  const headers = ref({ Accept: 'application/json' })
  const limited = ref({ team: 'core' })
  const small = ref({ A: '1' })
</script>
