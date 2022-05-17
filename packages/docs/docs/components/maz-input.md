---
title: MazInput
description: MazInput is a stand-alone component replaces the standard html input text or textarea with a beautiful design system. Many options like colors, sizes, disabled, loading, error, warning, valid states, error messages, includes icons.
---

# MazInput

> Before you have to import the global css file in your project, follow instructions in [Getting Started](/maz-ui-3/guide/getting-started.html)

## Basic usage

<br />

<MazInput v-model="inputValue" label="Label" name="firstname" id="first" />

```vue
<template>
  <MazInput v-model="inputValue" label="Label" />
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

<MazInput v-model="inputValue" label="Label" type="password" name="password" id="seconde" />

```vue
<template>
  <MazInput v-model="inputValue" label="Label" type="password" />
</template>
```

### Placeholder

<br />

<MazInput v-model="inputValue" placeholder="placeholder" id="placeholder" />

```vue
<template>
  <MazInput placeholder="placeholder" id="placeholder" />
</template>
```

### Required

> Will add `*` charac to label and placeholder

<MazInput v-model="inputValue"  id="required" label="label required" required />

```vue
<template>
  <MazInput v-model="inputValue"  id="required" label="label required" required />
</template>
```

### Disabled

<br />

<MazInput v-model="inputValue"  id="disabled" label="label disabled" disabled />

```vue
<template>
  <MazInput v-model="inputValue"  id="disabled" label="label disabled" disabled />
</template>
```

### Hint

> Will replace the label, usefull to show error message

<MazInput v-model="inputValue"  id="hint" label="label hint" hint="An error occured" error />

```vue
<template>
  <MazInput v-model="inputValue"  id="hint" label="label hint" hint="An error occured" error />
</template>
```

### Icons

> When you use `right-icon` or `left-icon`, the component use [MazIcon](/maz-ui-3/components/maz-icon.html)

<MazInput v-model="inputValue"  id="icons" label="label icons" left-icon="cash" right-icon="user" />

> Use your own icons

<MazInput v-model="inputValue"  id="icons-own" label="label icons">
  <template #left-icon>
    <MazIcon name="check" />
  </template>
  <template #right-icon>
    <MazIcon name="user-group" />
  </template>
</MazInput>

```vue
<template>
  <MazInput v-model="inputValue"  id="icons" label="label icons" left-icon="cash" right-icon="user" />

  <!-- or -->

  <MazInput v-model="inputValue"  id="icons" label="label icons">
  <template #left-icon>
    <MazIcon name="check" />
  </template>
  <template #right-icon>
    <MazIcon name="user-group" />
  </template>
</MazInput>
</template>
```

### No radius

> Will remove the border radius

<MazInput v-model="inputValue"  id="no-radius" label="label no-radius" no-radius />

```vue
<template>
  <MazInput v-model="inputValue"  id="no-radius" label="label no-radius" auto-focus />
</template>
```

### Debounce

> The value emit by the input will be delayed, usefull for searching

<MazInput v-model="inputValue" id="debounce" label="label debounce" debounce :debounce-delay="3000" />

input value: {{ inputValue ?? 'null' }}

```vue
<template>
  <!-- 3000ms = 3 secondes -->
  <MazInput v-model="inputValue"
    id="debounce"
    label="label debounce"
    debounce
    :debounce-delay="3000"
  />
</template>
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
    :id="size"
  />
</div>

```vue
<template>
  <MazInput v-for="size in sizes" :key="size" v-model="inputValue" :label="size" :size="size" :id="size" />
</template>
<script>
  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>
```

### Colors

> Click on each input to show colors
<br />
> Use the attribute `color` with a value in this [list](/maz-ui-3/guide/colors.html), the component will use this color

<div class="flex flex-col gap-05">
  <MazInput v-for="{ name } in colorsArray" :key="name" v-model="inputValue" :label="name" :color="name" :id="name" />
</div>

```vue
<template>
  <MazInput v-model="inputValue" label="primary" color="primary" id="primary" />
</template>
```

### State

#### Error

<br />

<MazInput v-model="inputValue" label="Label" error id="error-state" />

#### Warning

<br />

<MazInput v-model="inputValue" label="Label" warning id="warning-state" />

#### Success

<br />

<MazInput v-model="inputValue" label="Label" success id="success-state" />

```vue
<template>
  <MazInput v-model="inputValue" label="Label" error id="error-state" />
  <MazInput v-model="inputValue" label="Label" warning id="warning-state" />
  <MazInput v-model="inputValue" label="Label" success id="success-state" />
</template>
```

### Valid Button

<br />

<MazInput v-model="inputValue" label="Label" valid-button id="valid-button" />

```vue
<template>
  <MazInput v-model="inputValue" label="Label" valid-button id="valid-button" />
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
