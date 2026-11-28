---
title: MazRating
description: MazRating is a rating made of real radio buttons. The icons light up one by one under the pointer, a label can roll, a readonly rating can show a decimal like 4.3, and the scale variant gives a score of boxes like the NPS.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Bind a number with `v-model`. There are 5 stars by default.

<ComponentDemo expanded>
  <MazRating v-model="rating" />

<template #code>

```vue
<script lang="ts" setup>
import MazRating from 'maz-ui/components/MazRating'
import { ref } from 'vue'

const rating = ref(3)
</script>

<template>
  <MazRating v-model="rating" />
</template>
```

  </template>
</ComponentDemo>

## Labels

Give one text per value in `labels`. The text of the icon under the pointer rolls next to the icons.

<ComponentDemo>
  <MazRating v-model="rating" :labels="['Bad', 'Poor', 'Fair', 'Good', 'Perfect']" />

<template #code>

```vue
<MazRating v-model="rating" :labels="['Bad', 'Poor', 'Fair', 'Good', 'Perfect']" />
```

  </template>
</ComponentDemo>

## Icon, size and color

`icon` takes any icon of `@maz-ui/icons`. `max` sets the number of icons.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
    <MazRating v-model="heart" :icon="MazHeart" color="destructive" size="lg" :max="4" />
    <MazRating v-model="heart" color="primary" size="sm" />
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { MazHeart } from '@maz-ui/icons/static/MazHeart'
</script>

<template>
  <MazRating v-model="heart" :icon="MazHeart" color="destructive" size="lg" :max="4" />
  <MazRating v-model="heart" color="primary" size="sm" />
</template>
```

  </template>
</ComponentDemo>

## clearable

With `clearable`, a click on the current value clears it: the value becomes `null`.

<ComponentDemo>
  <MazRating v-model="clearable" clearable />

<template #code>

```vue
<MazRating v-model="rating" clearable />
```

  </template>
</ComponentDemo>

## readonly

`readonly` shows a rating. The fill can be a decimal.

<ComponentDemo>
  <MazRating :model-value="4.3" readonly />

<template #code>

```vue
<MazRating :model-value="4.3" readonly />
```

  </template>
</ComponentDemo>

## Scale

`variant="scale"` shows boxes from `min` to `max`, for a score out of 10 (NPS) or 5. The chosen box fills from the bottom. `min-label` and `max-label` name the ends.

<ComponentDemo>
  <MazRating
    v-model="nps"
    variant="scale"
    :min="0"
    :max="10"
    min-label="Not at all"
    max-label="Absolutely"
  />

<template #code>

```vue
<MazRating
  v-model="nps"
  variant="scale"
  :min="0"
  :max="10"
  min-label="Not at all"
  max-label="Absolutely"
/>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  import { ref } from 'vue'
  import { MazHeart } from '@maz-ui/icons/static/MazHeart'

  const rating = ref(3)
  const heart = ref(2)
  const clearable = ref(4)
  const nps = ref<number | null>(null)
</script>

## Accessibility and motion

- The rating is a `radiogroup` of real radio buttons: Tab enters the group, the arrows change the value (they follow the direction of the page), Space picks.
- Each radio is named "3 out of 5", with its label when `labels` is set. A `readonly` rating is an image named with its value.
- Give the group a name with `label` when the context does not say what is rated.
- The icons light up with `transform` and `opacity` only. With reduced motion, they fade in with no scale and no delay.
- The fill is clipped with logical properties: a decimal rating is mirrored in RTL.
- `color` uses the theme tokens, so the rating follows light and dark.

<!--@include: ./../../.vitepress/generated-docs/maz-rating.doc.md-->
