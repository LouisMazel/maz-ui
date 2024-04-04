---
title: MazInput
description: MazInput is a standalone component that replaces the standard html input text with a beautiful design system. Many options like colors, sizes, disabled, loading, error, warning, valid states, error messages and icons are included.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazInput v-model="inputValue" label="Label" name="firstname" />

```vue
<template>
  <MazInput
    v-model="inputValue"
    label="Label"
    autocomplete="off"
  />
</template>

<script setup>
  import { ref } from 'vue'
  import MazInput from 'maz-ui/components/MazInput'

  const inputValue = ref('value')
</script>
```

## Password

<form>
  <MazInput v-model="passwordValue" label="Label" type="password" name="password" autocomplete="nope" />
</form>

```html
<MazInput v-model="passwordValue" label="Label" type="password" />
```

## Placeholder

<MazInput v-model="inputValue" placeholder="placeholder" autocomplete="off" />

```html
<MazInput v-model="inputValue" placeholder="placeholder" />
```

## Required

> Will add `*` charac to label and placeholder

<MazInput v-model="inputValue" label="label required" required autocomplete="off" />

```html
<MazInput v-model="inputValue" label="label required" required />
```

## Disabled

<MazInput v-model="inputValue" label="label disabled" disabled autocomplete="off" />

::: details View code

```html
<MazInput
  v-model="inputValue"
  label="label disabled"
  disabled
/>
```

:::

## Hint

> Will replace the label, useful to display error message

<MazInput v-model="inputValue" label="label hint" hint="An error occured" error autocomplete="off" />

::: details View code

```html
<MazInput
  v-model="inputValue"
  label="label hint"
  hint="An error occured"
  error
/>
```

:::

## Icons

<MazInput
  v-model="inputValue"
  label="label icons"
  left-icon="banknotes"
  right-icon="user"
  autocomplete="off"
/>

### Use icon name

::: details View code

When you use the properties `right-icon`, `left-icon` or `icon` with the icon name (string), the component uses `<MazIcon name="..." />` component.

Check out how [MazIcon](./maz-icon.md) works, see all available icons and download them to put them in your public folder.

```html
<MazInput
  v-model="inputValue"
  label="label icons"
  left-icon="banknotes"
  right-icon="user"
/>
```

:::

### Use your own SVG icons

::: details View code

```html
<MazInput
  v-model="inputValue"
  label="label icons"
>
  <template #left-icon>
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 18.75C7.71719 18.75 13.0136 19.4812 18.0468 20.8512C18.7738 21.0491 19.5 20.5086 19.5 19.7551V18.75M3.75 4.5V5.25C3.75 5.66421 3.41421 6 3 6H2.25M2.25 6V5.625C2.25 5.00368 2.75368 4.5 3.375 4.5H20.25M2.25 6V15M20.25 4.5V5.25C20.25 5.66421 20.5858 6 21 6H21.75M20.25 4.5H20.625C21.2463 4.5 21.75 5.00368 21.75 5.625V15.375C21.75 15.9963 21.2463 16.5 20.625 16.5H20.25M21.75 15H21C20.5858 15 20.25 15.3358 20.25 15.75V16.5M20.25 16.5H3.75M3.75 16.5H3.375C2.75368 16.5 2.25 15.9963 2.25 15.375V15M3.75 16.5V15.75C3.75 15.3358 3.41421 15 3 15H2.25M15 10.5C15 12.1569 13.6569 13.5 12 13.5C10.3431 13.5 9 12.1569 9 10.5C9 8.84315 10.3431 7.5 12 7.5C13.6569 7.5 15 8.84315 15 10.5ZM18 10.5H18.0075V10.5075H18V10.5ZM6 10.5H6.0075V10.5075H6V10.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </template>
  <template #right-icon>
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.75 6C15.75 8.07107 14.071 9.75 12 9.75C9.9289 9.75 8.24996 8.07107 8.24996 6C8.24996 3.92893 9.9289 2.25 12 2.25C14.071 2.25 15.75 3.92893 15.75 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4.5011 20.1182C4.5714 16.0369 7.90184 12.75 12 12.75C16.0982 12.75 19.4287 16.0371 19.4988 20.1185C17.216 21.166 14.6764 21.75 12.0003 21.75C9.32396 21.75 6.78406 21.1659 4.5011 20.1182Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </template>
</MazInput>
```

:::

### Use [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader)

::: details View code

```vue
<template>
  <MazInput
    v-model="inputValue"
    label="label icons"
    :left-icon="BanknotesIcon"
    :right-icon="UserIcon"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazInput from 'maz-ui/components/MazInput'
  import BanknotesIcon from 'maz-ui/icons/banknotes.svg'
  import UserIcon from 'maz-ui/icons/user.svg'

  const inputValue = ref('value')
</script>
```

:::

## Auto focus

> Will focus automatically the component

<MazInput
  v-model="inputValue"
  label="label auto-focus"
  autocomplete="off"
/>

```html
<MazInput
  v-model="inputValue"
  label="label auto-focus"
  auto-focus
/>
```

## No radius

> Will remove the border radius

<MazInput
  v-model="inputValue"
  label="label no-radius"
  no-radius
  autocomplete="off"
/>

```html
<MazInput
  v-model="inputValue"
  label="label no-radius"
  no-radius
/>
```

## Debounce

> The value emit by the input will be delayed, usefull for searching

<MazInput v-model="inputValue" label="label debounce" debounce :debounce-delay="3000" autocomplete="off" />

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

## Sizes

> Use the attribute `size` with a value in {{ sizes.join(', ') }}

<div class="flex flex-col gap-05">
  <MazInput
    v-for="size in sizes"
    :key="size"
    v-model="inputValue"
    :label="['mini', 'xs'].includes(size) ? undefined : size"
    :placeholder="['mini', 'xs'].includes(size) ? size : undefined"
    :size="size"
    autocomplete="off"
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

<script setup lang="ts">
  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>
```

## Colors

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
    autocomplete="off"
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

## Rounded Size

Use the attribute `rounded-size` with a value in `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`

<MazInput rounded-size="none" placeholder="Rounded input" autocomplete="off" />
<br />
<MazInput rounded-size="sm" placeholder="Rounded input" autocomplete="off" />
<br />
<MazInput rounded-size="md" placeholder="Rounded input" autocomplete="off" />
<br />
<MazInput rounded-size="lg" placeholder="Rounded input" autocomplete="off" />
<br />
<MazInput rounded-size="xl" placeholder="Rounded input" autocomplete="off" />
<br />
<MazInput rounded-size="full" placeholder="Rounded input" autocomplete="off" />

```html
  <MazInput rounded-size="none" placeholder="Rounded input" />
  <MazInput rounded-size="sm" placeholder="Rounded input" />
  <MazInput rounded-size="md" placeholder="Rounded input" />
  <MazInput rounded-size="lg" placeholder="Rounded input" />
  <MazInput rounded-size="xl" placeholder="Rounded input" />
  <MazInput rounded-size="full" placeholder="Rounded input" />
```

## State

### Error

<MazInput v-model="inputValue" label="Label" error autocomplete="off" />

### Warning

<MazInput v-model="inputValue" label="Label" warning autocomplete="off" />

### Success

<MazInput v-model="inputValue" label="Label" success autocomplete="off" />

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

## Valid Button

<MazInput v-model="inputValue" label="Label" valid-button autocomplete="off" />

```vue
<template>
  <MazInput
    v-model="inputValue"
    label="Label"
    valid-button
  />
</template>
```

<script setup lang="ts">
  import { ref, computed } from 'vue'
  const inputValue = ref('value')
  const passwordValue = ref()

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

<!--@include: ./../.vitepress/generated-docs/maz-input.doc.md-->