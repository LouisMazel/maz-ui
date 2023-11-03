---
title: MazSelect - with "multiple" options
description: MazSelect is a standalone component that replaces the standard html input select with a beautiful design system. There are many options like multiple values, search text field, custom templates options, colors, sizes, disabled, loading, error, warning, valid states, error messages, and icons.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<!--@include: ./../.vitepress/mixins/maz-input-props.md-->

## Basic usage

<MazSelect
  label="Select color"
  v-model="selectedValue"
  :color="selectedValue"
  :options="colors"
/>

selectedValue: {{ selectedValue }}

```vue
<template>
  <MazSelect
    v-model="selectedValue"
    label="Select color"
    :color="color"
    :options="colors"
  />
</template>

<script setup lang="ts">
  import MazSelect from 'maz-ui/components/MazSelect'
  import { ref } from 'vue'

  const selectedValue = ref()

  const colors = [
    { label: 'primary', value: 'primary' },
    { label: 'secondary', value: 'secondary' },
    { label: 'info', value: 'info' },
    { label: 'success', value: 'success' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' },
    { label: 'white', value: 'white' },
    { label: 'black', value: 'black' },
  ]
</script>
```

## Multiple

<MazSelect
  v-model="selectedValues"
  :options="colors"
  label="Choose options"
  multiple
/>

selectedValues: {{ selectedValues }}

```html
<MazSelect
  v-model="selectedValues"
  :options="colors"
  label="Choose options"
  multiple
/>
```

## Search option

Use `search` property to add a search input in the options list

::: tip
You can use your own template to replace the empty icon when no results are found

::: details

```html
<MazSelect>
  <template #no-results>
    <div class="p-4 text-center">
      No result
    </div>
  </template>
</MazSelect>
```

:::

<MazSelect label="Select color" v-model="selectedValue" :options="colors" search />

```html
<MazSelect
  v-model="selectedValue"
  label="Select color"
  :options="colors"
  search
/>
```

## Custom template options

<br />

<MazSelect
  label="Select color"
  v-model="selectedUser"
  :options="customTemplateOptions"
  v-slot="{ option, isSelected }"
  search
>
  <div class="flex items-center" style="padding-top: 0.5rem; padding-bottom: 0.5rem; width: 100%; gap: 1rem">
    <MazAvatar size="0.8rem" :src="option.picture" />
    <strong>
      {{ option.label }}
    </strong>
  </div>
</MazSelect>

```vue{6}
<template>
  <MazSelect
    label="Select color"
    v-model="selectedUser"
    :options="customTemplateOptions"
    v-slot="{ option, isSelected }"
    search
  >
    <div class="flex items-center" style="padding-top: 0.5rem; padding-bottom: 0.5rem; width: 100%; gap: 1rem">
      <MazAvatar size="0.8rem" :src="option.picture" />
      <strong>
        {{ option.label }}
      </strong>
    </div>
  </MazSelect>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazSelect from 'maz-ui/components/MazSelect'
  import MazAvatar from 'maz-ui/components/MazAvatar'

  const selectedUser = ref()

  const customTemplateOptions = [
    { picture: 'https://placekitten.com/100/100', label: 'James Kitten', value: 1 },
    { picture: 'https://placekitten.com/500/500', label: 'Brad Kitten', value: 2 },
    { picture: 'https://placekitten.com/300/300', label: 'Cedric Kitten', value: 3 },
    { picture: 'https://placekitten.com/400/400', label: 'Harry Kitten', value: 4 },
  ]
</script>
```

## Custom options model

By default, the options should be an array of `{ value: any, label: string }`

If you want custom keys of these options, you can use:

- `option-value-key` to override the key of the value in your option
- `option-label-key` to override the key of the label to show in the option list
- `option-input-value-key` to override the key of the value to show in the input

### Example

<br />

<MazSelect
  v-model="selectedValueCustom"
  :options="customOptions"
  :color="selectedValueCustom"
  option-value-key="valueOption"
  option-label-key="labelOption"
  option-input-value-key="inputLabel"
  search
/>

```vue
<template>
  <MazSelect
    v-model="selectedValueCustom"
    :options="options"
    :color="selectedValueCustom"
    option-value-key="valueOption"
    option-label-key="labelOption"
    option-input-value-key="inputLabel"
    search
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  const selectedValueCustom = ref('danger')

  const customOptions = [
    { valueOption: 'primary', labelOption: 'primary label', inputLabel: 'primary input', },
    { valueOption: 'secondary', labelOption: 'secondary label', inputLabel: 'secondary input', },
    { valueOption: 'info', labelOption: 'info label', inputLabel: 'info input', },
    { valueOption: 'success', labelOption: 'success label', inputLabel: 'success input', },
    { valueOption: 'warning', labelOption: 'warning label', inputLabel: 'warning input', },
    { valueOption: 'danger', labelOption: 'danger label', inputLabel: 'danger input', },
    { valueOption: 'white', labelOption: 'white label', inputLabel: 'white input', },
    { valueOption: 'black', labelOption: 'black label', inputLabel: 'black input', },
  ]
</script>
```

<script setup lang="ts">
  import { ref } from 'vue'

  const selectedValue = ref()
  const selectedValueCustom = ref('danger')
  const selectedUser = ref()
  const selectedValues = ref()

  const colors = [
    { label: 'primary', value: 'primary' },
    { label: 'secondary', value: 'secondary' },
    { label: 'info', value: 'info' },
    { label: 'success', value: 'success' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' },
    { label: 'white', value: 'white' },
    { label: 'black', value: 'black' },
  ]

  const customTemplateOptions = [
    { picture: 'https://placekitten.com/100/100', label: 'James Kitten', value: 1 },
    { picture: 'https://placekitten.com/500/500', label: 'Brad Kitten', value: 2 },
    { picture: 'https://placekitten.com/300/300', label: 'Cedric Kitten', value: 3 },
    { picture: 'https://placekitten.com/400/400', label: 'Harry Kitten', value: 4 },
  ]

  const customOptions = [
    { valueOption: 'primary', labelOption: 'primary label', inputLabel: 'primary input', },
    { valueOption: 'secondary', labelOption: 'secondary label', inputLabel: 'secondary input', },
    { valueOption: 'info', labelOption: 'info label', inputLabel: 'info input', },
    { valueOption: 'success', labelOption: 'success label', inputLabel: 'success input', },
    { valueOption: 'warning', labelOption: 'warning label', inputLabel: 'warning input', },
    { valueOption: 'danger', labelOption: 'danger label', inputLabel: 'danger input', },
    { valueOption: 'white', labelOption: 'white label', inputLabel: 'white input', },
    { valueOption: 'black', labelOption: 'black label', inputLabel: 'black input', },
  ]
</script>

<!--@include: ./../.vitepress/generated-docs/maz-select.doc.md-->
