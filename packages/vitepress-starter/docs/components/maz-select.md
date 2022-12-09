---
title: MazSelect
description: MazSelect is a standalone component replaces the standard html input select with a beautiful design system. Many options like multiple values, search text field, custom templates options, colors, sizes, disabled, loading, error, warning, valid states, error messages, includes icons.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../mixins/getting-started.md-->

<!--@include: ./../mixins/maz-input-props.md-->

## Usage

### Basic

<br/>

<MazSelect
  label="Select color"
  v-model="selectValue"
  :color="selectValue"
  :options="colors"
/>

```vue
<template>
  <MazSelect
    v-model="selectValue"
    label="Select color"
    :color="color"
    :options="colors"
  />
</template>

<script setup lang="ts">
  import MazSelect from 'maz-ui/components/MazInput'
  import { ref } from 'vue'

  const selectValue = ref()

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

### Search option

Use `search` property to add a search input in the options list

<br />

<MazSelect label="Select color" v-model="selectValue" :options="colors" search />

```html
<MazSelect
  v-model="selectValue"
  label="Select color"
  :options="colorsObject"
  search
/>
```

### Custom options UI

<br />

<MazSelect label="Select color" v-model="selectValue" :options="colors">
  <template #default="{ option, isSelected }">
    <div class="flex flex-center">
      <strong class="maz-mr-2">
        {{ option.label }}
      </strong>
      <span>is-selected: {{ isSelected }}</span>
    </div>
  </template>
</MazSelect>

```html
<MazSelect
  v-model="selectValue"
  :options="colors"
  label="Select color"
>
  <template #default="{ option, isSelected }">
    <div class="flex flex-center">
      <strong class="maz-mr-2">
        {{ option.label }}
      </strong>
      <span>is-selected: {{ isSelected }}</span>
    </div>
  </template>
</MazSelect>
```

## Documentation

### Options

By default, the options should be an array of `{ value: any, label: string }`

If you want custom keys of these options, you can use:

- `option-value-key` to override the key of the value in your option
- `option-label-key` to override the key of the label to show in the option list
- `option-input-value-key` to override the key of the value to show in the input

#### Example

<MazSelect
  v-model="selectValueCustom"
  :options="options"
  :color="selectValueCustom"
  option-value-key="valueOption"
  option-label-key="labelOption"
  option-input-value-key="inputLabel"
  search
/>

```vue
<template>
  <MazSelect
    v-model="selectValueCustom"
    :options="options"
    :color="selectValueCustom"
    option-value-key="valueOption"
    option-label-key="labelOption"
    option-input-value-key="inputLabel"
    search
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  const selectValueCustom = ref('danger')

  const options = [
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

## Props & Events emitted

<ComponentPropDoc component="MazSelect" />

<script setup lang="ts">
  import { ref } from 'vue'

  const selectValue = ref()
  const selectValueCustom = ref('danger')

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

  const options = [
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
