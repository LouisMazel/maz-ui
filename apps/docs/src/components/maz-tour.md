---
title: MazTour
description: MazTour is a guided tour. The page darkens around a hole of light that glides from one element to the next, and a card explains each step.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Give a list of `steps` and open the tour with `v-model:open`. A step has a `target` (a CSS selector, an element or a function that returns one), a `title` and a `description`.

A step without `target` shows the card in the middle of the page: use it to welcome the user.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <div class="maz:flex maz:items-center maz:gap-3">
      <MazBtn id="tour-demo-projects" size="sm" color="secondary">Projects</MazBtn>
      <MazBtn id="tour-demo-search" size="sm" variant="outline">Search</MazBtn>
    </div>
    <MazBtn class="maz:self-start" @click="open = true">Start the tour</MazBtn>
    <MazTour v-model:open="open" v-model:step="step" :steps="steps" />
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazBtn from 'maz-ui/components/MazBtn'
import MazTour from 'maz-ui/components/MazTour'
import { ref } from 'vue'

const open = ref(false)
const step = ref(0)

const steps = [
  { title: 'Welcome', description: 'A quick look around.' },
  { target: '#projects', title: 'Your projects', description: 'They are all here.' },
  { target: '#search', title: 'Search', description: 'Find anything.', placement: 'bottom' },
]
</script>

<template>
  <MazBtn id="projects">Projects</MazBtn>
  <MazBtn id="search">Search</MazBtn>
  <MazBtn @click="open = true">Start the tour</MazBtn>
  <MazTour v-model:open="open" v-model:step="step" :steps="steps" />
</template>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  import { ref } from 'vue'

  const open = ref(false)
  const step = ref(0)
  const steps = [
    { title: 'Welcome', description: 'A quick look around the interface.' },
    { target: '#tour-demo-projects', title: 'Your projects', description: 'They are all here, sorted by activity.', placement: 'bottom' as const },
    { target: '#tour-demo-search', title: 'Search', description: 'Find a project, a page or an action.', placement: 'bottom' as const },
  ]
</script>

## The hole

The hole follows the target with a `padding` (8 px by default) and a `radius` (12 px). It glides and changes shape from one target to the next, and the card follows it.

The card goes under the target by default, or on the side where there is room. Set `placement` on a step to choose: `top`, `bottom`, `start` or `end`. `start` and `end` follow the reading direction. The card flips to the opposite side when it does not fit.

```vue
<MazTour :steps="steps" :padding="12" :radius="20" />
```

When a target is out of the screen, the page scrolls to it. Set `:scroll-into-view="false"` to keep the scroll as it is.

## Steps and events

Use `v-model:step` to know or set the current step (0 is the first). The events:

- `change` with the new index
- `finish` when the user presses Done on the last step
- `skip` when the user presses Skip or Escape

Both `finish` and `skip` close the tour and put the step back to 0.

```vue
<MazTour
  v-model:open="open"
  :steps="steps"
  @finish="saveOnboardingDone()"
  @skip="saveOnboardingDone()"
/>
```

Call `next()`, `previous()`, `goTo(index)`, `skip()` or `finish()` on a template ref to drive the tour from your code.

## Customize the card

The slots `title` and `description` replace the texts of a step. They receive the step, its `index` and the `total`.

```vue
<MazTour v-model:open="open" :steps="steps">
  <template #description="{ step, index }">
    <p>{{ step.description }}</p>
    <MazLink v-if="index === 1" href="/docs">Read the docs</MazLink>
  </template>
</MazTour>
```

The labels (Next, Previous, Skip, Done, Step 2 of 5) come from `@maz-ui/translations`.

## Accessibility

- The card is a dialog (`role="dialog"`, `aria-modal`) named by the title of the step, with the description as its description.
- The focus goes to the Next button when the tour opens, stays inside the card (Tab and Shift + Tab loop) and goes back to the previous element when the tour closes.
- Arrow keys go to the next or previous step (swapped in RTL). Escape skips the tour.
- A hidden live region reads "Step 2 of 5" on every step. The counter is also shown with a rolling number.
- The page behind the veil cannot be clicked while the tour is open.

## Motion

- The hole and the card move with `transform`, `width` and `height` and the motion tokens of the theme (`--maz-motion-slow`, `--maz-easing-in-out`).
- With reduced motion, the hole jumps from one target to the next and the layer only fades.
- The tour listens to scroll and resize only while it is open, and measures once per frame at most.

<!--@include: ./../../.vitepress/generated-docs/maz-tour.doc.md-->
