---
description: MazStepper is a standalone UI component to
---

# MazStepper

> Before you have to import the global css files in your project, follow instructions in [Getting Started](./../guide/getting-started.md)

## Basic usage

<br />

<MazStepper auto-validated-steps>
  <template #title-1>
      Sign-In
  </template>
  <template #subtitle-1>
    You should be sign-in to continue
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
  <template #content-2="{ nextStep }">
    <MazInput label="Delivery address" />
    <br />
    <MazBtn @click="nextStep">
      Validate
    </MazBtn>
  </template>

  <template #title-3>
    Payment
  </template>
  <template #content-3="{ nextStep, previousStep }">
    <MazBtn @click="previousStep">
      Previous
    </MazBtn>
    <br />
    <br />
    <MazBtn @click="nextStep" color="secondary">
      Payment
    </MazBtn>
  </template>
</MazStepper>

```vue
<template>
  <MazStepper auto-validated-steps>
    <template #title-1>
        Sign-In
    </template>
    <template #subtitle-1>
      You should be sign-in to continue
    </template>
    <template #content-1="{ nextStep }">
      <form @submit.prevent="nextStep">
        <MazInput label="E-mail" type="email" autocomplete="new-email" name="new-email" />
        <br />
        <MazInput label="password" type="password" autocomplete="new-password" name="new-password" />
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
    <template #content-2="{ nextStep }">
      <MazInput label="Delivery address" />
      <br />
      <MazBtn @click="nextStep">
        Validate
      </MazBtn>
    </template>

    <template #title-3>
      Payment
    </template>
    <template #content-3="{ nextStep, previousStep }">
      <MazBtn @click="previousStep">
        Previous
      </MazBtn>
      <br />
      <br />
      <MazBtn @click="nextStep" color="secondary">
        Payment
      </MazBtn>
    </template>
  </MazStepper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const email = ref()
  const password = ref()
</script>
```

## Documentation

### Disable and validate steps programmatically

You can validate or disable each step with the property `step`

This property has the following model:

```ts
type Steps = Array<{ disabled?: boolean validated?: boolean }>
```

You should respect order of steps in the array:

```vue
<template>
  <MazStepper
    :steps="[
      { disabled: false, validated: true },
      { disabled: true, validated: false }
    ]"
    color="info"
  >
    <template #title-1> Step 1 </template>
    <template #content-1> Content 1 </template>

    <template #title-2> Step 2 </template>
    <template #content-2> Content 2 </template>

    <template #title-3> Step 3 </template>
    <template #content-3> Content 3 </template>
  </MazStepper>
</template>
```

Will be:

<MazStepper :steps="[ { disabled: false, validated: true }, { disabled: true, validated: false } ]" color="info">
  <template #title-1> Step 1 </template>
  <template #content-1> Content 1 </template>

  <template #title-2> Step 2 </template>
  <template #content-2> Content 2 </template>

  <template #title-3> Step 3 </template>
  <template #content-3> Content 3 </template>
</MazStepper>

### Auto validate steps

You can use the prop option:

- `auto-validated-steps`

Then, all previous steps has the check icon:

```vue
<template>
  <MazStepper
    v-model="currentStep"
    auto-validated-steps
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

Click on "step 3" to show the step 2 validated:

<MazStepper v-model="currentStep" auto-validated-steps color="secondary">
  <template #title-1> Step 1 </template>
  <template #content-1> Content 1 </template>

  <template #title-2> Step 2 </template>
  <template #content-2> Content 2 </template>

  <template #title-3> Step 3 </template>
  <template #content-3> Content 3 </template>
</MazStepper>

### Auto disabled next or/and previous steps

To not allow your users to show other steps, you can use the prop options:

- `disabled-previous-steps`
- `disabled-next-steps`

```vue
<template>
  <MazStepper v-model="currentStep" disabled-previous-steps disabled-next-steps >
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

Will be:

<MazStepper v-model="currentStep" disabled-previous-steps disabled-next-steps>
  <template #title-1> Step 1 </template>
  <template #content-1> Content 1 </template>

  <template #title-2> Step 2 </template>
  <template #content-2> Content 2 </template>

  <template #title-3> Step 3 </template>
  <template #content-3> Content 3 </template>
</MazStepper>

<script setup lang="ts">
  import { ref } from 'vue'
  const currentStep = ref(2)

  const email = ref()
  const password = ref()
</script>

## Props & Events emitted

<ComponentPropDoc component="MazStepper" />
