---
title: MazTimeline
description: MazTimeline is a step/progress timeline component for Vue 3 with support for horizontal, vertical, and responsive layouts, customizable colors, sizes, step states, and scoped slots
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo>
  <MazTimeline v-model="currentStep" :steps="steps" />

  <template #code>

```vue
<template>
  <MazTimeline v-model="currentStep" :steps="steps" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazTimeline from 'maz-ui/components/MazTimeline'

  const currentStep = ref(1)
  const steps = [
    { title: 'Account', subtitle: 'Create your account' },
    { title: 'Profile', subtitle: 'Set up your profile' },
    { title: 'Settings', subtitle: 'Configure preferences' },
    { title: 'Complete', subtitle: 'All done!' },
  ]
</script>
```

  </template>
</ComponentDemo>

## Directions

### Horizontal

<ComponentDemo>
  <MazTimeline v-model="currentStep" :steps="steps" direction="horizontal" />

  <template #code>

```vue
<template>
  <MazTimeline v-model="currentStep" :steps="steps" direction="horizontal" />
</template>
```

  </template>
</ComponentDemo>

### Vertical

<ComponentDemo>
  <MazTimeline v-model="currentStep" :steps="steps" direction="vertical" />

  <template #code>

```vue
<template>
  <MazTimeline v-model="currentStep" :steps="steps" direction="vertical" />
</template>
```

  </template>
</ComponentDemo>

### Auto (responsive)

The default direction is `'auto'`, which switches from horizontal to vertical based on the `breakpoint` prop (default: `'768px'`).

<ComponentDemo>
  <MazTimeline v-model="currentStep" :steps="steps" direction="auto" breakpoint="768px" />

  <template #code>

```vue
<template>
  <MazTimeline
    v-model="currentStep"
    :steps="steps"
    direction="auto"
    breakpoint="768px"
  />
</template>
```

  </template>
</ComponentDemo>

## Colors

Use the `color` prop to change the theme color.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-6">
    <MazTimeline v-for="color in colors" :key="color" :model-value="1" :steps="colorSteps" :color="color" direction="horizontal" />
  </div>

  <template #code>

```vue
<template>
  <MazTimeline :steps="steps" color="primary" />
  <MazTimeline :steps="steps" color="secondary" />
  <MazTimeline :steps="steps" color="info" />
  <MazTimeline :steps="steps" color="success" />
  <MazTimeline :steps="steps" color="warning" />
  <MazTimeline :steps="steps" color="destructive" />
</template>
```

  </template>
</ComponentDemo>

## Sizes

Use the `size` prop to change the indicator size.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-6">
    <MazTimeline v-for="size in sizes" :key="size" :model-value="1" :steps="colorSteps" :size="size" direction="horizontal" />
  </div>

  <template #code>

```vue
<template>
  <MazTimeline :steps="steps" size="mini" />
  <MazTimeline :steps="steps" size="xs" />
  <MazTimeline :steps="steps" size="sm" />
  <MazTimeline :steps="steps" size="md" />
  <MazTimeline :steps="steps" size="lg" />
  <MazTimeline :steps="steps" size="xl" />
</template>
```

  </template>
</ComponentDemo>

## Step states

Each step can have a manual `state` property: `'completed'`, `'active'`, `'error'`, `'warning'`, or `'pending'`.

<ComponentDemo>
  <MazTimeline :steps="stateSteps" direction="horizontal" />

  <template #code>

```vue
<template>
  <MazTimeline :steps="stateSteps" direction="horizontal" />
</template>

<script lang="ts" setup>
  const stateSteps = [
    { title: 'Completed', subtitle: 'Step finished', state: 'completed' },
    { title: 'Active', subtitle: 'In progress', state: 'active' },
    { title: 'Error', subtitle: 'Something went wrong', state: 'error' },
    { title: 'Warning', subtitle: 'Needs attention', state: 'warning' },
    { title: 'Pending', subtitle: 'Not started', state: 'pending' },
  ]
</script>
```

  </template>
</ComponentDemo>

## Clickable

Enable `clickable` to allow users to navigate between steps by clicking on them. The `click-step` event is emitted with the step index.

<ComponentDemo>
  <MazTimeline v-model="clickableStep" :steps="steps" clickable direction="horizontal" />

  <template #code>

```vue
<template>
  <MazTimeline v-model="clickableStep" :steps="steps" clickable />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const clickableStep = ref(0)
</script>
```

  </template>
</ComponentDemo>

## Disabled steps

Individual steps can be disabled by setting `disabled: true` on the step object.

<ComponentDemo>
  <MazTimeline v-model="currentStep" :steps="disabledSteps" clickable direction="horizontal" />

  <template #code>

```vue
<template>
  <MazTimeline v-model="currentStep" :steps="disabledSteps" clickable />
</template>

<script lang="ts" setup>
  const disabledSteps = [
    { title: 'Account', subtitle: 'Create your account' },
    { title: 'Profile', subtitle: 'Set up your profile' },
    { title: 'Settings', subtitle: 'Locked', disabled: true },
    { title: 'Complete', subtitle: 'All done!' },
  ]
</script>
```

  </template>
</ComponentDemo>

## Without step numbers

Hide the step numbers inside indicators with `:show-step-numbers="false"`.

<ComponentDemo>
  <MazTimeline v-model="currentStep" :steps="steps" :show-step-numbers="false" direction="horizontal" />

  <template #code>

```vue
<template>
  <MazTimeline
    v-model="currentStep"
    :steps="steps"
    :show-step-numbers="false"
  />
</template>
```

  </template>
</ComponentDemo>

## Without auto-validate

By default, completed steps show a checkmark. Disable this with `:auto-validate-steps="false"`.

<ComponentDemo>
  <MazTimeline :model-value="2" :steps="steps" :auto-validate-steps="false" direction="horizontal" />

  <template #code>

```vue
<template>
  <MazTimeline
    :model-value="2"
    :steps="steps"
    :auto-validate-steps="false"
  />
</template>
```

  </template>
</ComponentDemo>

## Rounded sizes

Customize the indicator border radius with the `rounded-size` prop.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-6">
    <MazTimeline v-for="rounded in roundedSizes" :key="rounded" :model-value="1" :steps="colorSteps" :rounded-size="rounded" direction="horizontal" />
  </div>

  <template #code>

```vue
<template>
  <MazTimeline :steps="steps" rounded-size="full" />
  <MazTimeline :steps="steps" rounded-size="lg" />
  <MazTimeline :steps="steps" rounded-size="md" />
  <MazTimeline :steps="steps" rounded-size="sm" />
  <MazTimeline :steps="steps" rounded-size="none" />
</template>
```

  </template>
</ComponentDemo>

## Custom slots

MazTimeline provides scoped slots for full customization.

### Indicator slot

<ComponentDemo>
  <MazTimeline v-model="currentStep" :steps="steps" direction="horizontal">
    <template #indicator="{ step, index, state }">
      <span style="font-size: 1.2em">{{ index + 1 }}.</span>
    </template>
  </MazTimeline>

  <template #code>

```vue
<template>
  <MazTimeline v-model="currentStep" :steps="steps">
    <template #indicator="{ step, index, state }">
      <span style="font-size: 1.2em">{{ index + 1 }}.</span>
    </template>
  </MazTimeline>
</template>
```

  </template>
</ComponentDemo>

### Content slot

<ComponentDemo>
  <MazTimeline v-model="currentStep" :steps="steps" direction="horizontal">
    <template #content="{ step, index, state }">
      <div class="maz-text-center">
        <strong>{{ step.title }}</strong>
        <p class="maz-text-muted maz-text-sm maz-m-0">Step {{ index + 1 }} - {{ state }}</p>
      </div>
    </template>
  </MazTimeline>

  <template #code>

```vue
<template>
  <MazTimeline v-model="currentStep" :steps="steps">
    <template #content="{ step, index, state }">
      <div class="maz-text-center">
        <strong>{{ step.title }}</strong>
        <p class="maz-text-muted maz-text-sm maz-m-0">
          Step {{ index + 1 }} - {{ state }}
        </p>
      </div>
    </template>
  </MazTimeline>
</template>
```

  </template>
</ComponentDemo>

### Connector slot

<ComponentDemo>
  <MazTimeline v-model="currentStep" :steps="steps" direction="horizontal">
    <template #connector="{ index, state }">
      <div class="maz-text-center maz-text-xs maz-text-muted">---</div>
    </template>
  </MazTimeline>

  <template #code>

```vue
<template>
  <MazTimeline v-model="currentStep" :steps="steps">
    <template #connector="{ index, state }">
      <div class="maz-text-center maz-text-xs maz-text-muted">---</div>
    </template>
  </MazTimeline>
</template>
```

  </template>
</ComponentDemo>

<script lang="ts" setup>
  import { ref } from 'vue'

  const currentStep = ref(1)
  const clickableStep = ref(0)

  const steps = [
    { title: 'Account', subtitle: 'Create your account' },
    { title: 'Profile', subtitle: 'Set up your profile' },
    { title: 'Settings', subtitle: 'Configure preferences' },
    { title: 'Complete', subtitle: 'All done!' },
  ]

  const colorSteps = [
    { title: 'Step 1' },
    { title: 'Step 2' },
    { title: 'Step 3' },
  ]

  const stateSteps = [
    { title: 'Completed', subtitle: 'Step finished', state: 'completed' },
    { title: 'Active', subtitle: 'In progress', state: 'active' },
    { title: 'Error', subtitle: 'Something went wrong', state: 'error' },
    { title: 'Warning', subtitle: 'Needs attention', state: 'warning' },
    { title: 'Pending', subtitle: 'Not started', state: 'pending' },
  ]

  const disabledSteps = [
    { title: 'Account', subtitle: 'Create your account' },
    { title: 'Profile', subtitle: 'Set up your profile' },
    { title: 'Settings', subtitle: 'Locked', disabled: true },
    { title: 'Complete', subtitle: 'All done!' },
  ]

  const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'destructive']
  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
  const roundedSizes = ['full', 'lg', 'md', 'sm', 'none']
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-timeline.doc.md-->
