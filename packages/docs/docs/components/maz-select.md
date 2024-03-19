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
  :options="['primary', 'secondary', 'info', 'success', 'danger', 'warning']"
/>

selectedValue: {{ selectedValue }}

```vue
<template>
  <MazSelect
    v-model="selectedValue"
    label="Select color"
    :color="color"
    :options="['primary', 'secondary', 'info', 'success', 'danger', 'warning']"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import MazSelect from 'maz-ui/components/MazSelect'

  const selectedValue = ref()
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

::: details Show code

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

## Opt Group

Group your options like a native optgroup

<MazSelect
  v-model="optGroupValue"
  label="Select options"
  :options="optGroup"
  multiple
/>

```vue
<template>
  <MazSelect
    v-model="optGroupValue"
    label="Select option"
    :options="optGroup"
    multiple
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  const selectedValue = ref()
  const optGroup = [
    { label: 'Basic colors', options: ['primary', 'secondary', 'danger'] },
    { label: 'Custom colors', options: [{ label: 'third', value: 'third' }] },
  ]
</script>
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
  <div class="flex items-center" style="width: 100%; gap: 1rem">
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
    <div class="flex items-center" style="width: 100%; gap: 1rem">
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
    { picture: 'https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&seed=JamesSmile', label: 'James Smile', value: 1 },
    { picture: 'https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&seed=BradSmile', label: 'Brad Smile', value: 2 },
    { picture: 'https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&seed=CedricSmile', label: 'Cedric Smile', value: 3 },
    { picture: 'https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&seed=HarrySmile', label: 'Harry Smile', value: 4 },
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

  const optGroupValue = ref()
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

  const optGroup = [
    { label: 'Basic colors', options: ['primary', 'secondary', 'danger'] },
    { label: 'Custom colors', options: [{ label: 'third', value: 'third' }] },
  ]

  const customTemplateOptions = [
    { picture: 'https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&seed=JamesSmile', label: 'James Smile', value: 1 },
    { picture: 'https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&seed=BradSmile', label: 'Brad Smile', value: 2 },
    { picture: 'https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&seed=CedricSmile', label: 'Cedric Smile', value: 3 },
    { picture: 'https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&seed=HarrySmile', label: 'Harry Smile', value: 4 },
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

  const alwaysShowMembersBets = ref()
</script>

### Types

```ts
type ModelValueSimple = string | number | null | undefined | boolean
```

<!--@include: ./../.vitepress/generated-docs/maz-select.doc.md-->
