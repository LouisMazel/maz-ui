---
title: MazInput
description: MazInput is a standalone component replaces the standard html input text with a beautiful design system. Many options like colors, sizes, disabled, loading, error, warning, valid states, error messages, includes icons.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../mixins/getting-started.md-->

## Basic usage

<MazInput v-model="inputValue" label="Label" name="firstname" />

```vue
<template>
  <MazInput
    v-model="inputValue"
    label="Label"
  />
</template>

<script setup>
  import { ref } from 'vue'
  import MazInput from 'maz-ui/components/MazInput'

  const inputValue = ref('value')
</script>
```

## Options

### Password

<br />

<MazInput v-model="inputValue" label="Label" type="password" name="password" />

```html
<MazInput
  v-model="inputValue"
  label="Label"
  type="password"
/>
```

### Placeholder

<br />

<MazInput placeholder="placeholder" />

```html
<MazInput
  placeholder="placeholder"
/>
```

### Required

> Will add `*` charac to label and placeholder

<MazInput
  label="label required"
  required
/>

```html
<MazInput
  label="label required"
  required
/>
```

### Disabled

<br />

<MazInput
  v-model="inputValue"
  label="label disabled"
  disabled
/>

```html
<MazInput
  v-model="inputValue"
  label="label disabled"
  disabled
/>
```

### Hint

> Will replace the label, usefull to show error message

<MazInput
  v-model="inputValue"
  label="label hint"
  hint="An error occured"
  error
/>

```html
<MazInput
  v-model="inputValue"
  label="label hint"
  hint="An error occured"
  error
/>
```

### Icons

::: info
When you use `right-icon` or `left-icon`, the component use [MazIcon](./maz-icon.md)
:::

<MazInput
  v-model="inputValue"
  label="label icons"
  left-icon="cash"
  right-icon="user"
  />

> Use your own icons

<MazInput v-model="inputValue" label="label icons">
  <template #left-icon>
    <MazIcon name="check" />
  </template>
  <template #right-icon>
    <MazIcon name="user-group" />
  </template>
</MazInput>

```html
<MazInput
  v-model="inputValue"
  label="label icons"
  left-icon="cash"
  right-icon="user"
/>

<!-- or -->

<MazInput v-model="inputValue" label="label icons">
  <template #left-icon>
    <MazIcon name="check" />
  </template>
  <template #right-icon>
    <MazIcon name="user-group" />
  </template>
</MazInput>
```

### Auto focus

> Will focus automatically the component

<MazInput
  v-model="inputValue"
  label="label auto-focus"
/>

```html
<MazInput
  v-model="inputValue"
  label="label auto-focus"
  auto-focus
/>
```

### No radius

> Will remove the border radius

<MazInput
  v-model="inputValue"
  label="label no-radius"
  no-radius
/>

```html
<MazInput
  v-model="inputValue"
  label="label no-radius"
  no-radius
/>
```

### Debounce

> The value emit by the input will be delayed, usefull for searching

<MazInput v-model="inputValue" label="label debounce" debounce :debounce-delay="3000" />

input value: {{ inputValue ?? 'null' }}

```html
<!-- 3000ms = 3 secondes -->
<MazInput
  v-model="inputValue"
  label="label debounce"
  debounce
  :debounce-delay="3000"
/>
```

### Sizes

> Use the attribute `size` with a value in {{ sizes.join(', ') }}

<div class="flex flex-col gap-05">
  <MazInput
    v-for="size in sizes"
    :key="size"
    v-model="inputValue"
    :label="['mini', 'xs'].includes(size) ? undefined : size"
    :placeholder="['mini', 'xs'].includes(size) ? size : undefined"
    :size="size"
  />
</div>

```vue
<template>
  <MazInput
    v-for="size in sizes"
    :key="size"
    v-model="inputValue"
    :label="size"
    :size="size"
  />
</template>

<script setup>
  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>
```

### Colors

::: tip
Click on each input to show colors
:::

::: info
Use the attribute `color` with a value in this [list](./../guide/colors.md), the component will use this color
:::

<div class="flex flex-col gap-05">
  <MazInput
    v-for="{ name } in colorsArray"
    :key="name"
    v-model="inputValue"
    :label="name"
    :color="name"
  />
</div>

```vue
<template>
  <MazInput
    v-for="{ name } in colorsArray"
    :key="name"
    v-model="inputValue"
    :label="name"
    :color="name"
  />
</template>

<script setup>
  const colors = {
    primary: { name: 'primary', hex: '#1e90ff' },
    secondary: { name: 'secondary', hex: '#1cd1a1' },
    info: { name: 'info', hex: '#17a2b8' },
    success: { name: 'success', hex: '#9acd32' },
    warning: { name: 'warning', hex: '#fcb731' },
    danger: { name: 'danger', hex: '#ff6d6a' },
    white: { name: 'white', hex: '#fff' },
    black: { name: 'black', hex: '#000' },
  }
</script>
```

### State

<br />

#### Error

<MazInput v-model="inputValue" label="Label" error />

#### Warning

<MazInput v-model="inputValue" label="Label" warning />

#### Success

<MazInput v-model="inputValue" label="Label" success />

```html
<MazInput
  v-model="inputValue"
  label="Label"
  error
/>
<MazInput
  v-model="inputValue"
  label="Label"
  warning
/>
<MazInput
  v-model="inputValue"
  label="Label"
  success
/>
```

### Valid Button

<br />

<MazInput v-model="inputValue" label="Label" valid-button />

```vue
<template>
  <MazInput
    v-model="inputValue"
    label="Label"
    valid-button
  />
</template>
```

## Props & Events emitted

<ComponentPropDoc component="MazInput" />

<script setup>
  import { ref, computed } from 'vue'
  const inputValue = ref('value')

  const colors = {
    primary: { name: 'primary', hex: '#1e90ff' },
    secondary: { name: 'secondary', hex: '#1cd1a1' },
    info: { name: 'info', hex: '#17a2b8' },
    success: { name: 'success', hex: '#9acd32' },
    warning: { name: 'warning', hex: '#fcb731' },
    danger: { name: 'danger', hex: '#ff6d6a' },
    white: { name: 'white', hex: '#fff' },
    black: { name: 'black', hex: '#000' },
  }

  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']

  const colorsArray = computed(() => Object.values(colors))
</script>
