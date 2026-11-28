---
title: MazRollingText
description: MazRollingText displays a text or a number and rolls only the characters that change, like an odometer. Only transform and opacity are animated, and screen readers get the final value.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Change the `value` prop. The characters that stay the same do not move.

<ComponentDemo expanded>
  <div class="maz:flex maz:items-center maz:gap-4">
    <MazBtn size="sm" @click="count--">-</MazBtn>
    <MazRollingText :value="count" class="maz:text-4xl maz:font-bold" />
    <MazBtn size="sm" @click="count++">+</MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazBtn from 'maz-ui/components/MazBtn'
import MazRollingText from 'maz-ui/components/MazRollingText'
import { ref } from 'vue'

const count = ref(42)
</script>

<template>
  <div class="flex items-center gap-4">
    <MazBtn size="sm" @click="count--">-</MazBtn>
    <MazRollingText :value="count" class="text-4xl font-bold" />
    <MazBtn size="sm" @click="count++">+</MazBtn>
  </div>
</template>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  const count = ref(42)
  const yearly = ref(false)
  const price = computed(() => yearly.value ? 190 : 19)
  const copied = ref(false)
  const direction = ref<'up' | 'down' | 'auto'>('auto')
  const word = ref('Maz')
  let timeout: ReturnType<typeof setTimeout> | undefined

  function copy() {
    copied.value = true
    clearTimeout(timeout)
    timeout = setTimeout(() => { copied.value = false }, 1500)
  }
</script>

## Format numbers

A number is formatted with `Intl.NumberFormat`. Use `format` for the options and `locale` to force a locale.

Without `locale`, the locale of `@maz-ui/translations` is used when it is installed, then the one of the browser.

Numbers use tabular figures and are aligned from the right, so the digits do not jump.

<ComponentDemo>
  <div class="maz:flex maz:items-center maz:gap-4">
    <MazSwitch v-model="yearly">Yearly</MazSwitch>
    <MazRollingText
      :value="price"
      locale="en-US"
      :format="{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }"
      class="maz:text-3xl maz:font-bold"
    />
    <span>/ {{ yearly ? 'year' : 'month' }}</span>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazRollingText from 'maz-ui/components/MazRollingText'
import MazSwitch from 'maz-ui/components/MazSwitch'
import { computed, ref } from 'vue'

const yearly = ref(false)
const price = computed(() => yearly.value ? 190 : 19)
</script>

<template>
  <MazSwitch v-model="yearly">Yearly</MazSwitch>

  <MazRollingText
    :value="price"
    locale="en-US"
    :format="{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }"
    class="text-3xl font-bold"
  />
</template>
```

  </template>
</ComponentDemo>

## Roll a text

A string works too. Each position rolls on its own, from the left.

<ComponentDemo>
  <MazBtn @click="copy">
    <MazRollingText :value="copied ? 'Copied' : 'Copy'" />
  </MazBtn>

<template #code>

```vue
<script lang="ts" setup>
import MazBtn from 'maz-ui/components/MazBtn'
import MazRollingText from 'maz-ui/components/MazRollingText'
import { ref } from 'vue'

const copied = ref(false)

function copy() {
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <MazBtn @click="copy">
    <MazRollingText :value="copied ? 'Copied' : 'Copy'" />
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## direction

`direction` sets where the new characters come from.

- `auto` (default): numbers roll up when they increase and down when they decrease, text rolls up.
- `up`: the new characters come from the bottom.
- `down`: the new characters come from the top.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazSegmented
      v-model="direction"
      :options="[
        { label: 'auto', value: 'auto' },
        { label: 'up', value: 'up' },
        { label: 'down', value: 'down' },
      ]"
    />
    <div class="maz:flex maz:items-center maz:gap-4">
      <MazBtn size="sm" @click="count--">-</MazBtn>
      <MazRollingText :value="count" :direction="direction" class="maz:text-4xl maz:font-bold" />
      <MazBtn size="sm" @click="count++">+</MazBtn>
    </div>
  </div>

<template #code>

```vue
<MazRollingText :value="count" direction="down" />
```

  </template>
</ComponentDemo>

## stagger

Changed characters start with a small delay (25 ms each, 150 ms at most). Set `:stagger="false"` to roll them all together.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-2">
    <MazBtn size="sm" @click="word = word === 'Maz' ? 'Rolling' : 'Maz'">Toggle</MazBtn>
    <MazRollingText :value="word" class="maz:text-3xl maz:font-bold" />
    <MazRollingText :value="word" :stagger="false" class="maz:text-3xl maz:font-bold" />
  </div>

<template #code>

```vue
<MazRollingText :value="word" />
<MazRollingText :value="word" :stagger="false" />
```

  </template>
</ComponentDemo>

## animated

Set `:animated="false"` to swap the value without animation.

```vue
<MazRollingText :value="count" :animated="false" />
```

## Accessibility and motion

- The rolling characters are `aria-hidden`. A screen reader reads a hidden copy that always holds the final value.
- Nothing animates on the first render, so the server and the client render the same markup.
- With reduced motion, the value changes instantly.
- A new value during an animation replaces the old one without stacking.
- Only `transform` and `opacity` are animated, with the motion tokens of the theme: the layout does not shift.

## Events

`animation-end` is emitted when the last rolling character has finished.

<!--@include: ./../../.vitepress/generated-docs/maz-rolling-text.doc.md-->
