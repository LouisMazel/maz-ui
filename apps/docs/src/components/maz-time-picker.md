---
title: MazTimePicker
description: MazTimePicker chooses a time of day, with wheels that snap like on iOS or with the list of the available slots of a day. It opens from a field, or it is shown inline.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

The value is a `HH:mm` string (24 hours), whatever the display format.

<ComponentDemo expanded>
  <MazTimePicker v-model="time" label="Time" />

<template #code>

```vue
<script lang="ts" setup>
import MazTimePicker from 'maz-ui/components/MazTimePicker'
import { ref } from 'vue'

const time = ref('09:30')
</script>

<template>
  <MazTimePicker v-model="time" label="Time" />
</template>
```

  </template>
</ComponentDemo>

Scroll a wheel, click a value, or use the arrows. Page up and Page down move by 5, Home and End go to the first and the last value.

## format and step

`format` is `12h` or `24h`: by default it follows the locale. `step` is the number of minutes between two choices.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:gap-4">
    <MazTimePicker v-model="time" label="12 hours" format="12h" />
    <MazTimePicker v-model="time" label="24 hours, every 15 min" format="24h" :step="15" />
  </div>

<template #code>

```vue
<MazTimePicker v-model="time" label="12 hours" format="12h" />
<MazTimePicker v-model="time" label="24 hours, every 15 min" format="24h" :step="15" />
```

  </template>
</ComponentDemo>

## Slots

`variant="slots"` lists the times of a day as a grid. Set `min`, `max` and `step` (30 minutes by default), and `disabled-times` for the taken ones. A click chooses a slot and closes the popover.

<ComponentDemo>
  <MazTimePicker
    v-model="slot"
    label="Appointment"
    variant="slots"
    min="09:00"
    max="17:00"
    :disabled-times="['10:00', '12:30']"
    format="24h"
  />

<template #code>

```vue
<MazTimePicker
  v-model="slot"
  label="Appointment"
  variant="slots"
  min="09:00"
  max="17:00"
  :disabled-times="['10:00', '12:30']"
  format="24h"
/>
```

  </template>
</ComponentDemo>

For irregular times, give the exact list in `slots`: `:slots="['09:00', '09:45', '11:15']"`.

## inline

`inline` shows the picker in the page, without a field.

<ComponentDemo>
  <MazTimePicker v-model="time" inline format="24h" />

<template #code>

```vue
<MazTimePicker v-model="time" inline format="24h" />
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  import { ref } from 'vue'

  const time = ref('09:30')
  const slot = ref<string | null>(null)
</script>

## Accessibility and motion

- Each wheel is a `listbox` of `option`s (hours, minutes, AM/PM): the arrows, Page up, Page down, Home and End change the value, Enter confirms.
- The slots are real radio buttons in a `radiogroup`: the arrows move between them, the taken ones are disabled.
- The wheels use CSS scroll snap and move by `scroll`, not by animation. With reduced motion the jumps are instant.
- The field is a read-only `combobox` that opens a dialog, like `MazDatePicker`.
- The colors come from the theme tokens: light, dark and RTL are supported.

<!--@include: ./../../.vitepress/generated-docs/maz-time-picker.doc.md-->
