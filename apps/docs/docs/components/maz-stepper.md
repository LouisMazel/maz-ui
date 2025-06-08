---
title: MazStepper
description: MazStepper is a standalone UI component customizable, reactive for intuitive step-by-step navigation. Ideal for guiding users through forms, workflows, or checkout processes.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazStepper auto-validate-steps>
  <template #title-1>
      Sign-In
  </template>
  <template #subtitle-1>
    You should be sign-in to continue
  </template>
  <template #title-info-1>
    Required
  </template>
  <template #content-1="{ nextStep }">
    <form @submit.prevent="nextStep">
      <MazInput v-model="email" label="E-mail" type="email" autocomplete="new-email" name="new-email" />
      <br />
      <br />
      <MazInput v-model="password" label="password" type="password" autocomplete="new-password" name="new-password" />
      <br />
      <br />
      <MazBtn type="submit">
        Sign-In
      </MazBtn>
    </form>
  </template>

  <template #title-2>
    Delivery address
  </template>
  <template #subtitle-2>
    Where should we deliver your package?
  </template>
  <template #title-info-2>
    {{ address }}
  </template>
  <template #content-2="{ nextStep, previousStep }">
    <MazInput v-model="address" label="Delivery address" />
    <br />
    <br />
    <div class="maz-flex maz-gap-4">
      <MazBtn @click="previousStep" color="secondary">
        Previous
      </MazBtn>
      <MazBtn @click="nextStep">
        Validate
      </MazBtn>
    </div>
  </template>

  <template #title-3>
    Checkout
  </template>
  <template #subtitle-3>
    Provide credit card
  </template>
  <template #content-3="{ nextStep, previousStep }">
    <MazInput label="Credit card number" type="number" />
    <br />
    <br />
    <div class="maz-flex maz-gap-4">
      <MazBtn @click="previousStep" color="secondary">
        Previous
      </MazBtn>
      <MazBtn @click="nextStep">
        Payment
      </MazBtn>
    </div>
  </template>
</MazStepper>

::: details View code

```vue
<template>
  <MazStepper auto-validate-steps>
    <template #title-1>
        Sign-In
    </template>
    <template #subtitle-1>
      You should be signed in to continue
    </template>
    <template #title-info-1>
      Required
    </template>
    <template #content-1="{ nextStep }">
      <form @submit.prevent="nextStep">
        <MazInput v-model="email" label="E-mail" type="email" autocomplete="new-email" name="new-email" />
        <br />
        <MazInput v-model="password" label="password" type="password" autocomplete="new-password" name="new-password" />
        <br />
        <MazBtn type="submit">
          Sign-In
        </MazBtn>
      </form>
    </template>

    <template #title-2>
      Delivery address
    </template>
    <template #subtitle-2>
      Where should we deliver your package?
    </template>
    <template #title-info-2>
      {{ address }}
    </template>
    <template #content-2="{ nextStep, previousStep }">
      <MazInput v-model="address" label="Delivery address" />
      <br />
      <MazBtn @click="previousStep" color="secondary">
        Previous
      </MazBtn>
      <br />
      <br />
      <MazBtn @click="nextStep">
        Validate
      </MazBtn>
    </template>

    <template #title-3>
      Checkout
    </template>
    <template #subtitle-3>
      Provide credit card
    </template>
    <template #content-3="{ nextStep, previousStep }">
      <MazInput label="Credit card number" type="number" />
      <br />
      <MazBtn @click="previousStep" color="secondary">
        Previous
      </MazBtn>
      <br />
      <br />
      <MazBtn @click="nextStep">
        Payment
      </MazBtn>
    </template>
  </MazStepper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const email = ref()
  const password = ref()
  const address = ref('20 Cooper Square')
</script>
```

:::

## Use `step` property instead of slots

Displayed steps are generated with the slots `<template #content-1 />`, but you can provide its title, subtitle and title-info with the `steps` props

<MazStepper
  :steps="[
    { title: 'Title 1', subtitle: 'Subtitle 1', titleInfo: 'Info 1', },
    { title: 'Title 2', subtitle: 'Subtitle 2', titleInfo: 'Info 2' },
    { title: 'Title 3', subtitle: 'Subtitle 3', titleInfo: 'Info 3' },
    { title: 'Title 4', subtitle: 'Subtitle 4', titleInfo: 'Info 4' },
  ]"
>
  <template #content-1> Content 1 </template>
  <template #content-2> Content 2 </template>
  <template #content-3> Content 3 </template>
  <template #content-4> Content 4 </template>
</MazStepper>

```vue{3-8}
<template>
  <MazStepper
    :steps="[
      { title: 'Title 1', subtitle: 'Subtitle 1', titleInfo: 'Info 1' },
      { title: 'Title 2', subtitle: 'Subtitle 2', titleInfo: 'Info 2' },
      { title: 'Title 3', subtitle: 'Subtitle 3', titleInfo: 'Info 3' },
      { title: 'Title 4', subtitle: 'Subtitle 4', titleInfo: 'Info 4' },
    ]"
  >
    <template #content-1> Content 1 </template>
    <template #content-2> Content 2 </template>
    <template #content-3> Content 3 </template>
    <template #content-4> Content 4 </template>
  </MazStepper>
</template>
```

## Set step states programmatically

You can set differents state with its style to each step with the property `step`

States available: `'success' | 'warning' | 'error' | 'disabled'`

You should respect order of steps in the array:

<MazStepper
  v-model="currentStep"
  :steps="[
    { disabled: true },
    { success: true },
    { warning: true, disabled: true },
    { error: true },
  ]"
>

  <template #title-1> Title 1 </template>
  <template #title-info-1> Disabled </template>
  <template #content-1> Content 1 </template>

  <template #title-2> Title 2 </template>
  <template #title-info-2> Success </template>
  <template #content-2> Content 2 </template>

  <template #title-3> Title 3 </template>
  <template #title-info-3> Warning & Disabled </template>
  <template #content-3> Content 3 </template>

  <template #title-4> Title 4 </template>
  <template #title-info-4> Error </template>
  <template #content-4> Content 4 </template>
</MazStepper>

```vue{4-9}
<template>
  <MazStepper
    v-model="currentStep"
    :steps="[
      { disabled: true },
      { success: true },
      { warning: true, disabled: true },
      { error: true },
    ]"
  >
    <template #title-1> Title 1 </template>
    <template #title-info-1> Disabled </template>
    <template #content-1> Content 1 </template>

    <template #title-2> Title 2 </template>
    <template #title-info-2> Success </template>
    <template #content-2> Content 2 </template>

    <template #title-3> Title 3 </template>
    <template #title-info-3> Warning & Disabled </template>
    <template #content-3> Content 3 </template>

    <template #title-4> Title 4 </template>
    <template #title-info-4> Error </template>
    <template #content-4> Content 4 </template>
  </MazStepper>
</template>
```

## Auto validate steps

You can use the prop option:

- `auto-validate-steps`

Then all previous steps then the current and then the validated state

::: tip
Click on the first or third step to see the validated steps changes:
:::

<MazStepper v-model="currentStep" auto-validate-steps color="secondary">
  <template #title-1> Step 1 </template>
  <template #content-1> Content 1 </template>

  <template #title-2> Step 2 </template>
  <template #content-2> Content 2 </template>

  <template #title-3> Step 3 </template>
  <template #content-3> Content 3 </template>
</MazStepper>

```vue{4}
<template>
  <MazStepper
    v-model="currentStep"
    auto-validate-steps
    color="secondary"
  >
    <template #title-1> Step 1 </template>
    <template #content-1> Content 1 </template>

    <template #title-2> Step 2 </template>
    <template #content-2> Content 2 </template>

    <template #title-3> Step 3 </template>
    <template #content-3> Content 3 </template>
  </MazStepper>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  const currentStep = ref(2)
</script>
```

## Auto disabled next or/and previous steps

To not allow your users to go to the next steps, you can use the following prop options:

- `disabled-previous-steps`
- `disabled-next-steps`

::: tip
Try to click on first and third steps
:::

<MazStepper :model-value="2" disabled-previous-steps disabled-next-steps>
  <template #title-1> Step 1 </template>
  <template #content-1> Content 1 </template>

  <template #title-2> Step 2 </template>
  <template #content-2> Content 2 </template>

  <template #title-3> Step 3 </template>
  <template #content-3> Content 3 </template>
</MazStepper>

```vue{4,5}
<template>
  <MazStepper
    :model-value="2"
    disabled-previous-steps
    disabled-next-steps
  >
    <template #title-1> Step 1 </template>
    <template #content-1> Content 1 </template>

    <template #title-2> Step 2 </template>
    <template #content-2> Content 2 </template>

    <template #title-3> Step 3 </template>
    <template #content-3> Content 3 </template>
  </MazStepper>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  const currentStep = ref(2)
</script>
```

## All steps opened & success

To open and validate all steps, you can use the following prop options:

- `all-steps-validated`
- `all-steps-opened`

<MazStepper all-steps-validated all-steps-opened>
  <template #title-1> Step 1 </template>
  <template #content-1> Content 1 </template>

  <template #title-2> Step 2 </template>
  <template #content-2> Content 2 </template>

  <template #title-3> Step 3 </template>
  <template #content-3> Content 3 </template>
</MazStepper>

## Can close steps

Use the property `can-close-steps` to let the user be able to close each step on click

::: tip
Click on step titles to toggle content
:::

<MazStepper can-close-steps>
  <template #title-1> Step 1 </template>
  <template #content-1> Content 1 </template>

  <template #title-2> Step 2 </template>
  <template #content-2> Content 2 </template>

  <template #title-3> Step 3 </template>
  <template #content-3> Content 3 </template>
</MazStepper>

## Types

`step` property model

```ts
type Steps = Array<{
  title?: string
  subtitle?: string
  titleInfo?: string
  disabled?: boolean
  error?: boolean
  success?: boolean
  warning?: boolean
}>
```

<script setup lang="ts">
  import { ref } from 'vue'

  const currentStep = ref(2)
  const address = ref('20 Cooper Square')
  const email = ref()
  const password = ref()
</script>

<!--@include: ./../.vitepress/generated-docs/maz-stepper.doc.md-->
