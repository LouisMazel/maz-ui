---
title: MazInput
description: MazInput is a standalone component that replaces the standard html input text with a beautiful design system. Many options like colors, sizes, disabled, loading, error, warning, valid states, error messages and icons are included.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo>
  <MazInput v-model="inputValue" label="Label" name="firstname" />

  <template #code>

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
    import { MazInput } from 'maz-ui/components'

    const inputValue = ref()
  </script>
  ```

  </template>
</ComponentDemo>

## Top label

<ComponentDemo>
  <MazInput v-model="inputValue" top-label="Top label" placeholder="Placeholder" autocomplete="off" />

  <template #code>

  ```html
  <MazInput v-model="inputValue" top-label="Top label" placeholder="Placeholder" />
  ```

  </template>
</ComponentDemo>

## Assistive text

<ComponentDemo>
  <MazInput v-model="inputValue" top-label="Top label" assistive-text="Assistive text" placeholder="Placeholder" />
  <br />
  <br />
  <MazInput v-model="inputValue" error top-label="Top label" assistive-text="Assistive text" placeholder="Placeholder" />

  <template #code>

  ```html
  <MazInput v-model="inputValue" top-label="Top label" assistive-text="Assistive text" placeholder="Placeholder" />
  ```

  </template>
</ComponentDemo>

## Password

<ComponentDemo>
  <form>
    <MazInput v-model="passwordValue" label="Label" type="password" name="password" autocomplete="nope" />
  </form>

  <template #code>

  ```html
  <MazInput v-model="passwordValue" label="Label" type="password" />
  ```

  </template>
</ComponentDemo>

## Placeholder

<ComponentDemo>
  <MazInput v-model="inputValue" placeholder="placeholder" autocomplete="off" />

  <template #code>

  ```html
  <MazInput v-model="inputValue" placeholder="placeholder" />
  ```

  </template>
</ComponentDemo>

## Required

> Will make the input required and `*` charac to the label or the placeholder

<ComponentDemo>
  <MazInput v-model="inputValue" label="label required" required autocomplete="off" />

  <template #code>

  ```html
  <MazInput v-model="inputValue" label="label required" required />
  ```

  </template>
</ComponentDemo>

## Disabled

<ComponentDemo>
  <MazInput v-model="inputValue" label="label disabled" disabled autocomplete="off" />

  <template #code>

  ```html
  <MazInput
    v-model="inputValue"
    label="label disabled"
    disabled
  />
  ```

  </template>
</ComponentDemo>

## Hint

> Will replace the label, useful to display short message

<ComponentDemo>
  <MazInput model-value="any value" label="label hint" hint="An error occured" error autocomplete="off" />

  <template #code>

  ```html
  <MazInput
    model-value="any value"
    label="label hint"
    hint="An error occured"
    error
  />
  ```

  </template>
</ComponentDemo>

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
    :left-icon="MazBanknotes"
    :right-icon="MazUser"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { MazInput } from 'maz-ui/components'
  import MazBanknotes from '@maz-ui/svg/banknotes.svg'
  import MazUser from '@maz-ui/svg/user.svg'

  const inputValue = ref('value')
</script>
```

:::

## Auto focus

> Will focus automatically the component

<ComponentDemo>
  <MazInput
    v-model="inputValue"
    label="label auto-focus"
    autocomplete="off"
  />

  <template #code>

  ```html
  <MazInput
    v-model="inputValue"
    label="label auto-focus"
    auto-focus
  />
  ```

  </template>
</ComponentDemo>

## No radius

> Will remove the border radius

<ComponentDemo>
  <MazInput
    v-model="inputValue"
    label="label no-radius"
    no-radius
    autocomplete="off"
  />

  <template #code>

  ```html
  <MazInput
    v-model="inputValue"
    label="label no-radius"
    no-radius
  />
  ```

  </template>
</ComponentDemo>

## Debounce

> The value emit by the input will be delayed, usefull for searching
>
> The attribute `debounce` is in milliseconds
>
> If the debounce is true, the default debounce delay is 500ms

<ComponentDemo>
  <MazInput v-model="inputValue" label="label debounce" :debounce="1000" autocomplete="off" />

  <p class="maz-mt-2">
    modelValue: {{ inputValue ?? 'null' }}
  </p>

  <template #code>

  ```html
  <MazInput
    v-model="inputValue"
    label="label debounce"
    :debounce="1000"
  />
  ```

  </template>
</ComponentDemo>

## Sizes

> Use the attribute `size` with a value in {{ sizes.join(', ') }}

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
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

  <template #code>

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

  </template>
</ComponentDemo>

## Colors

::: tip
Click on each input to show colors
:::

::: info
Use the attribute `color` with a value in this [list](./../guide/colors.md), the component will use this color
:::

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
    <MazInput
      v-for="name in colors"
      :key="name"
      v-model="inputValue"
      :label="name"
      :color="name"
      autocomplete="off"
    />
  </div>

  <template #code>

  ```vue
  <template>
    <MazInput
      v-for="name in colors"
      :key="name"
      v-model="inputValue"
      :label="name"
      :color="name"
    />
  </template>

  <script setup>
    const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'destructive', 'accent', 'contrast']
  </script>
  ```

  </template>
</ComponentDemo>

## Rounded Size

Use the attribute `rounded-size` with a value in `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-2 maz-items-start">
    <MazInput rounded-size="none" placeholder="Rounded input" autocomplete="off" />
    <MazInput rounded-size="sm" placeholder="Rounded input" autocomplete="off" />
    <MazInput rounded-size="md" placeholder="Rounded input" autocomplete="off" />
    <MazInput rounded-size="lg" placeholder="Rounded input" autocomplete="off" />
    <MazInput rounded-size="xl" placeholder="Rounded input" autocomplete="off" />
    <MazInput rounded-size="full" placeholder="Rounded input" autocomplete="off" />
  </div>

  <template #code>

  ```html
    <MazInput rounded-size="none" placeholder="Rounded input" />
    <MazInput rounded-size="sm" placeholder="Rounded input" />
    <MazInput rounded-size="md" placeholder="Rounded input" />
    <MazInput rounded-size="lg" placeholder="Rounded input" />
    <MazInput rounded-size="xl" placeholder="Rounded input" />
    <MazInput rounded-size="full" placeholder="Rounded input" />
  ```

  </template>
</ComponentDemo>

## State

<ComponentDemo title="destructive">
  <MazInput v-model="inputValue" label="Label" error autocomplete="off" />

  <template #code>

  ```html
    <MazInput v-model="inputValue" label="Label" error />
  ```

  </template>
</ComponentDemo>

<br />
<br />

<ComponentDemo title="Warning">
  <MazInput v-model="inputValue" label="Label" warning autocomplete="off" />

  <template #code>

  ```html
    <MazInput v-model="inputValue" label="Label" warning />
  ```

  </template>
</ComponentDemo>

<br />
<br />

<ComponentDemo title="Success">
  <MazInput v-model="inputValue" label="Label" success autocomplete="off" />

  <template #code>

  ```html
    <MazInput v-model="inputValue" label="Label" success />
  ```

  </template>
</ComponentDemo>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  const inputValue = ref()
  const passwordValue = ref()

  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'destructive',
    'accent',
    'contrast',
  ]
</script>

<!--@include: ./../.vitepress/generated-docs/maz-input.doc.md-->