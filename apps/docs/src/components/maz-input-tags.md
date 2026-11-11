---
title: MazInputTags
description: MazInputTags is an input to enter several values as tags and return an array of strings. Type a value and press Enter or a comma to add it, Backspace or the cross of a tag to remove it. Same sizes and states as MazInput.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo>
  <MazInputTags
    v-model="tags"
    label="Technologies"
    block
  />

  <p class="maz:mt-4! maz:mb-0!">
    <b>Tags:</b> {{ tags }}
  </p>

<template #code>

```vue
<script lang="ts" setup>
import MazInputTags from 'maz-ui/components/MazInputTags'
import { ref } from 'vue'

const tags = ref(['vue', 'nuxt'])
</script>

<template>
  <MazInputTags
    v-model="tags"
    label="Technologies"
    block
  />
</template>
```

  </template>
</ComponentDemo>

- `Enter` or `,` adds the typed text, comma separated values add several tags at once. The duplicates are ignored.
- The text is also added when the input loses the focus, unless `:add-tags-on-blur="false"`.
- A first `Backspace` in the empty input marks the last tag, a second one removes it. The cross of a tag removes it.
- There is no floating label in the field: `label` is the placeholder of the input (unless `placeholder` is set) and its accessible name. Use `top-label` for a visible label above the field.

## Top label and assistive text

<ComponentDemo>
  <MazInputTags
    v-model="topLabelTags"
    top-label="Technologies"
    placeholder="Add a technology"
    assistive-text="Press Enter or a comma to add a technology"
    block
  />

<template #code>

```vue
<MazInputTags
  v-model="tags"
  top-label="Technologies"
  placeholder="Add a technology"
  assistive-text="Press Enter or a comma to add a technology"
  block
/>
```

  </template>
</ComponentDemo>

## Sizes

The sizes have the heights of `MazInput`: aligned in a form, a `MazInputTags` and a `MazInput` of the same size have the same height.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-3">
    <div v-for="size in sizes" :key="size" class="maz:flex maz:items-start maz:gap-2">
      <MazInputTags v-model="tags" :size="size" :label="size" class="maz:flex-1" />
      <MazInput :size="size" :label="`MazInput ${size}`" class="maz:flex-1" />
    </div>
  </div>

<template #code>

```vue
<MazInputTags v-model="tags" size="mini" label="mini" />
<MazInputTags v-model="tags" size="xs" label="xs" />
<MazInputTags v-model="tags" size="sm" label="sm" />
<MazInputTags v-model="tags" size="md" label="md" />
<MazInputTags v-model="tags" size="lg" label="lg" />
<MazInputTags v-model="tags" size="xl" label="xl" />
```

  </template>
</ComponentDemo>

## Colors

`color` sets the color of the focused field and of the tags.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-3">
    <MazInputTags v-for="color in colors" :key="color" v-model="tags" :color="color" :label="color" block />
  </div>

<template #code>

```vue
<MazInputTags v-model="tags" color="secondary" label="secondary" />
<MazInputTags v-model="tags" color="success" label="success" />
<MazInputTags v-model="tags" color="contrast" label="contrast" />
```

  </template>
</ComponentDemo>

## States

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-3">
    <MazInputTags v-model="tags" label="Error" error assistive-text="At least 3 technologies" block />
    <MazInputTags v-model="tags" label="Success" success block />
    <MazInputTags v-model="tags" label="Warning" warning block />
    <MazInputTags v-model="tags" label="Disabled" disabled block />
  </div>

<template #code>

```vue
<MazInputTags v-model="tags" label="Error" error assistive-text="At least 3 technologies" />
<MazInputTags v-model="tags" label="Success" success />
<MazInputTags v-model="tags" label="Warning" warning />
<MazInputTags v-model="tags" label="Disabled" disabled />
```

  </template>
</ComponentDemo>

## Rounded

<ComponentDemo>
  <MazInputTags v-model="tags" label="Technologies" rounded-size="full" block />

<template #code>

```vue
<MazInputTags v-model="tags" label="Technologies" rounded-size="full" />
```

  </template>
</ComponentDemo>

The other attributes (`name`, `autocomplete`, `@focus`...) are passed to the `<input>`.

<!--@include: ./../../.vitepress/generated-docs/maz-input-tags.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'

  const tags = ref(['vue', 'nuxt'])
  const topLabelTags = ref(['vue'])
  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
  const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'destructive', 'contrast']
</script>
