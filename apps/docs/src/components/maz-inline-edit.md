---
title: MazInlineEdit
description: MazInlineEdit is a text that becomes a field when it is clicked. The field takes exactly the place of the text, Enter saves with a drawn check, and Escape brings the old text back by rolling it.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Click the text, or press Enter or F2 when it has the focus. Enter saves, Escape restores the old text, and leaving the field saves.

<ComponentDemo expanded>
  <MazInlineEdit v-model="title" class="maz:text-xl maz:font-semibold" />

<template #code>

```vue
<script lang="ts" setup>
import MazInlineEdit from 'maz-ui/components/MazInlineEdit'
import { ref } from 'vue'

const title = ref('Quarterly report')
</script>

<template>
  <MazInlineEdit v-model="title" class="text-xl font-semibold" />
</template>
```

  </template>
</ComponentDemo>

## tag

`tag` is the element of the displayed text: use `h1` for a title. The text stays a button inside it.

<ComponentDemo>
  <MazInlineEdit v-model="title" tag="h2" class="maz:text-2xl maz:font-bold" placeholder="Untitled" />

<template #code>

```vue
<MazInlineEdit v-model="title" tag="h2" class="text-2xl font-bold" placeholder="Untitled" />
```

  </template>
</ComponentDemo>

## validate

`validate` gets the text and returns `true`, or the error message shown under the field. The text is not saved until it is valid.

<ComponentDemo>
  <MazInlineEdit v-model="name" :validate="validate" />

<template #code>

```vue
<script lang="ts" setup>
function validate(value: string) {
  return value.trim().length >= 3 || 'At least 3 characters'
}
</script>

<template>
  <MazInlineEdit v-model="name" :validate="validate" />
</template>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  import { ref } from 'vue'

  const title = ref('Quarterly report')
  const name = ref('Alice')

  function validate(value: string) {
    return value.trim().length >= 3 || 'At least 3 characters'
  }
</script>

## Events

- `submit`: the new text is saved (Enter, or blur).
- `update:model-value`: the text changed.
- `cancel`: the editing was cancelled (Escape).

With `:submit-on-blur="false"`, leaving the field restores the old text.

## Accessibility and motion

- The text is a real `button`, so it is in the tab sequence. Its name is the text followed by "Edit".
- The field is named with `label` (default "Edit"). An error is linked with `aria-describedby`, announced as an alert, and sets `aria-invalid`.
- After Enter or Escape, the focus goes back to the text.
- The text and the field share one grid cell: there is no layout shift. The error and the hint (pencil, check) are positioned out of the flow.
- The check and the rolling use the motion tokens and are off with reduced motion.

<!--@include: ./../../.vitepress/generated-docs/maz-inline-edit.doc.md-->
