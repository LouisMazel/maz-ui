---
title: MazInputNumber
description: MazInputNumber is a number input component with increment and decrement buttons for user-friendly input. Customizable size, disabled state, and limit values.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo>
  <MazInputNumber
    v-model="numberValue"
    placeholder="Enter number"
    :min="5"
    :step="5"
    :max="10000"
    color="secondary"
    style="min-width: 200px"
  />

  <br />
  <br />

`numberValue: {{ numberValue }}`

<template #code>

```vue
<script lang="ts" setup>
import MazInputNumber from 'maz-ui/components/MazInputNumber'
import { ref } from 'vue'
const numberValue = ref(2)
</script>

<template>
  <MazInputNumber
    v-model="numberValue"
    placeholder="Enter number"
    :min="5"
    :step="5"
    :max="10000"
    color="secondary"
    style="min-width: 200px"
  />
</template>
```

  </template>
</ComponentDemo>

## No buttons

You can remove the buttons with the props `hide-buttons`

<ComponentDemo>
  <MazInputNumber
    v-model="numberValue"
    placeholder="Enter number"
    hide-buttons
  />

<template #code>

```html
<MazInputNumber v-model="numberValue" placeholder="Enter number" hide-buttons />
```

  </template>
</ComponentDemo>

## Prefix and suffix

`prefix` and `suffix` display a unit before or after the number, inside the field. Use the `prefix` and `suffix` slots for rich content (an icon, a badge).

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:gap-4">
    <MazInputNumber v-model="price" prefix="$" :min="0" :step="5" />
    <MazInputNumber v-model="duration" suffix="min" :min="0" />
  </div>

<template #code>

```html
<MazInputNumber v-model="price" prefix="$" :min="0" :step="5" />
<MazInputNumber v-model="duration" suffix="min" :min="0" />
```

  </template>
</ComponentDemo>

## Motion

- A click on <kbd>+</kbd> or <kbd>-</kbd> slides the value a little in the direction of the change. Typing and the arrow keys never animate.
- Hold a button: after a short delay the value repeats and the repeat speeds up. It stops at `min` and `max`.
- At a limit the button fades out.

Set `:animated="false"` to turn the slide and the hold to repeat off. Reduced motion is respected.

<ComponentDemo>
  <MazInputNumber v-model="holdValue" :min="0" :max="200" />

<template #code>

```html
<MazInputNumber v-model="value" :min="0" :max="200" />
```

  </template>
</ComponentDemo>

<!--@include: ./../../.vitepress/mixins/maz-input-props.md-->
<!--@include: ./../../.vitepress/generated-docs/maz-input-number.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'
  const numberValue = ref()
  const price = ref(20)
  const duration = ref(30)
  const holdValue = ref(10)
</script>
