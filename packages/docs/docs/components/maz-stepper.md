---
description: MazStepper is a stand-alone UI component to
---

# MazStepper

> Before you have to import the global css files in your project, follow instructions in [Getting Started](./../guide/getting-started.md)

<MazStepper auto-validated-steps>
  <template #title-1>
      Sign-In
  </template>
  <template #subtitle-1>
    You should be sign-in to continue
  </template>
  <template #content-1="{ nextStep, previousStep }">
    <MazInput label="E-mail" type="email" />
    <br />
    <MazInput label="password" type="password" />
    <br />
    <MazBtn @click="nextStep">
      Sign-In
    </MazBtn>
  </template>

  <template #title-2>
    Delivery address
  </template>
  <template #subtitle-2>
    Where should we deliver your package?
  </template>
  <template #content-2="{ nextStep, previousStep }">
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
    <template #content-1="{ nextStep, previousStep }">
      <MazInput label="E-mail" type="email" />
      <br />
      <MazInput label="password" type="password" />
      <br />
      <MazBtn @click="nextStep">
        Sign-In
      </MazBtn>
    </template>

    <template #title-2>
      Delivery address
    </template>
    <template #subtitle-2>
      Where should we deliver your package?
    </template>
    <template #content-2="{ nextStep, previousStep }">
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
```

## Disable and validate steps programmatically

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
      { disabled: true, validated: true },
      { disabled: true, validated: false }
    ]"
  >
    <template #content-1>
      Step 1
    </template>
    <template #content-2>
      Step 2
    </template>
  </MazStepper>
</template>
```

Will be:

<MazStepper :steps="[{ disabled: false, validated: true }, { disabled: true, validated: false } ]">
  <template #title-1>
    Step 1
  </template>
  <template #content-1>
    Content 1
  </template>
  <template #title-2>
    Step 2
  </template>
  <template #content-2>
    Content 2
  </template>
  <template #title-3>
    Step 3
  </template>
  <template #content-3>
    Content 3
  </template>
</MazStepper>

## Props & Events emitted

<ComponentPropDoc component="MazStepper" />