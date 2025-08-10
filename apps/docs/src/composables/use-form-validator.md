---
title: useFormValidator
description: useFormValidator and useFormField are two Vue 3 composables designed to simplify form validation using Valibot as the validation library. These composables offer a flexible and typed approach to handle form validation in your Vue 3 applications.
---

# {{ $frontmatter.title }}

`useFormValidator` and `useFormField` are two Vue 3 composables designed to simplify form validation using [Valibot](https://valibot.dev/guides/introduction/) as the validation library. These composables offer a flexible and typed approach to handle form validation in your Vue 3 applications.

## Introduction

::: details Best Practices

1. Use typed Valibot schemas to ensure type consistency.
2. Choose the appropriate validation mode based on your form's needs.
3. Use `useFormField` for fine-grained management of each form field.
4. Use the `handleSubmit` returned by `useFormValidator` to handle form submission securely.
5. Leverage computed values like `isValid`, `hasError`, `errorMessage`, and others to control your user interface state.

:::

::: details Validation modes details

- `lazy`: (default) Validates only on value changes
- `aggressive`: Validates all fields immediately and on every change
- `eager`: (recommended) Validates on initial blur (if not empty), then on every change **(requires `useFormField` to add validation events)**
- `blur`: Validates only on focus loss **(requires `useFormField` to add validation events)**
- `progressive`: Validates the field at each user interaction (value change or blur). The field becomes valid after the first successful validation and then validated on input value change. If the field is invalid, the error message on the first blur event **(requires `useFormField` to add validation events)**

:::

::: details How to get TypeScript type safety?

The model is typed automatically from the schema.

```ts{11,16}
import { pipe, string, nonEmpty, number, minValue, maxValue, minLength } from 'valibot'
import { useFormValidator, useFormField } from 'maz-ui/composables'

const schema = {
  name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
  age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
  country: pipe(string('Country is required'), nonEmpty('Country is required')),
}

// Automatic type inference from schema
const { model } = useFormValidator({
  schema,
})

// For useFormField, specify both schema and field name for precise typing
const { value: name } = useFormField<string>('name', { formIdentifier: 'form' })
```

:::

::: details How to bind validation events with useFormField for eager, blur, or progressive modes?

To use the `eager`, `blur`, or `progressive` validation modes, you must use the `useFormField` composable to add the necessary validation events.

2 ways to bind validation events:

#### 1. Use the `ref` attribute on the component to get the reference

You can use the `ref` attribute on the component and pass the reference to the `useFormField` composable.

This method will automatically detect interactive elements (input, select, textarea, button, elements with ARIA roles, etc.) within the component and add the necessary validation events.

```vue{3,10,17}
<template>
  <MazInput
    ref="inputRef"
    v-model="value"
    :hint="errorMessage"
    :error="hasError"
    :success="isValid"
  />
  <!-- Work with HTML input -->
  <input ref="inputRef" v-model="value" />
</template>

<script setup lang="ts">
import { useFormField } from 'maz-ui/composables'
import { useTemplateRef } from 'vue'

const { value, errorMessage, isValid, hasError } = useFormField<string>('name', {
  ref: useTemplateRef<HTMLInputElement>('inputRef'),
})
</script>
```

#### 2. Use the `v-bind` directive to bind the validation events

You can use the `v-bind` directive to bind the validation events to the component or HTML element.

If you use this method with a custom component, the component must emit the `blur` event to trigger the field validation. Otherwise, use the first method.

```vue{7,16}
<template>
  <MazInput
    v-model="value"
    :hint="errorMessage"
    :error="hasError"
    :success="isValid"
    v-bind="validationEvents"
  />
  <!-- or -->
  <input v-model="value" v-bind="validationEvents" />
</template>

<script setup lang="ts">
import { useFormField } from 'maz-ui/composables'

const { value, errorMessage, isValid, hasError, validationEvents } = useFormField<string>('name')
</script>
```

:::

## Basic Usage with lazy mode

In this example, we will create a simple form with four fields: `name`, `age`, `agree` and `country`. The form will be validated in `lazy` mode, which means that the fields will be validated on every change.

::: tip
Submit the form to show the validation errors
:::

<ComponentDemo>
  <b>Form State</b>

  <div class="maz-text-xs maz-p-2 maz-bg-surface-600/50 dark:maz-bg-surface-400 maz-rounded maz-mt-2">
    <pre>{{ { isValid, isSubmitting, isDirty, isSubmitted, errorMessages } }}</pre>
  </div>

  <br />

  <form novalidate class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmit">
    <MazInput
      v-model="model.name"
      label="Enter your name (min 3 characters)"
      :hint="errorMessages.name"
      :error="!!errorMessages.name"
      :success="fieldsStates.name.valid"
      :class="{ 'has-error': !!errorMessages.name }"
    />
    <MazInput
      v-model="model.age"
      type="number"
      label="Enter your age (18-100)"
      :hint="errorMessages.age"
      :error="!!errorMessages.age"
      :success="fieldsStates.age.valid"
      :class="{ 'has-error': !!errorMessages.age }"
    />
    <MazSelect
      v-model="model.country"
      :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
      label="Select your nationality (required)"
      :hint="errorMessages.country"
      :error="!!errorMessages.country"
      :success="fieldsStates.country.valid"
      :class="{ 'has-error': !!errorMessages.country }"
    />
    <MazCheckbox
      v-model="model.agree"
      :hint="errorMessages.agree"
      :error="fieldsStates.agree.error"
      :success="fieldsStates.agree.valid"
      :class="{ 'has-error': !!errorMessages.agree }"
    >
      I agree to the terms and conditions (required)
    </MazCheckbox>
    <MazBtn type="submit" :loading="isSubmitting">
      Submit
    </MazBtn>
  </form>
  <template #code>

```vue
<script lang="ts" setup>
import { sleep } from 'maz-ui'
import { useFormValidator, useToast } from 'maz-ui/composables'
import { boolean, literal, maxValue, minLength, minValue, nonEmpty, number, pipe, string } from 'valibot'

const toast = useToast()

const schema = {
  name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
  age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
  country: pipe(string('Country is required'), nonEmpty('Country is required')),
  agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
}

const { model, isSubmitting, handleSubmit, errorMessages, fieldsStates } = useFormValidator<typeof schema>({
  schema,
  defaultValues: { name: 'John Doe', age: 10 },
  options: { mode: 'lazy', scrollToError: '.has-error' },
})

const onSubmit = handleSubmit(async (formData) => {
  // Form submission logic
  console.log(formData)
  await sleep(2000)
  toast.success('Form submitted', { position: 'top' })
})
</script>

<template>
  <form @submit="onSubmit">
    <MazInput
      v-model="model.name"
      label="Enter your name"
      :hint="errorMessages.name"
      :error="!!errorMessages.name"
      :success="fieldsStates.name.valid"
      :class="{ 'has-error': !!errorMessages.name }"
    />
    <MazInput
      v-model="model.age"
      type="number"
      label="Enter your age"
      :hint="errorMessages.age"
      :error="!!errorMessages.age"
      :success="fieldsStates.age.valid"
      :class="{ 'has-error': !!errorMessages.age }"
    />
    <MazSelect
      v-model="model.country"
      :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
      label="Select your nationality"
      :hint="errorMessages.country"
      :error="!!errorMessages.country"
      :success="fieldsStates.country.valid"
      :class="{ 'has-error': !!errorMessages.country }"
    />
    <MazCheckbox
      v-model="model.agree"
      :hint="errorMessages.agree"
      :error="fieldsStates.agree.error"
      :success="fieldsStates.agree.valid"
      :class="{ 'has-error': !!errorMessages.agree }"
    >
      I agree to the terms and conditions
    </MazCheckbox>
    <MazBtn type="submit" :loading="isSubmitting">
      Submit
    </MazBtn>
  </form>
</template>
```

  </template>
</ComponentDemo>

## Usage with useFormField

In this example, we will use the `useFormField` composable to handle the validation of each field individually.

### Eager mode

With eager mode, each form field is validated on blur (if not empty) and then on every change. This mode is made for a better user experience, as the user will see the validation errors only after they have finished typing.

<ComponentDemo>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmitEager">
    <MazInput
      v-model="name"
      ref="nameRef"
      label="Enter your name"
      :hint="nameErrorMessage"
      :error="hasErrorName"
      :class="{ 'has-error-form2': hasErrorName }"
    />
    <MazInput
      v-model="age"
      ref="ageRef"
      type="number"
      label="Enter your age"
      :hint="ageErrorMessage"
      :error="hasErrorAge"
      :class="{ 'has-error-form2': hasErrorAge }"
    />
    <MazSelect
      v-model="country"
      ref="countryRef"
      :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
      label="Select your nationality"
      :hint="countryErrorMessage"
      :error="hasErrorCountry"
      :class="{ 'has-error-form2': hasErrorCountry }"
    />
    <MazCheckbox
      v-model="agree"
      ref="agreeRef"
      :hint="agreeErrorMessage"
      :error="hasErrorAgree"
      :class="{ 'has-error': hasErrorAgree }"
    >
      I agree to the terms and conditions
    </MazCheckbox>
    <MazBtn type="submit" :loading="isSubmittingEager">
      Submit
    </MazBtn>
  </form>

<template #code>

```vue
<script setup lang="ts">
import { sleep } from 'maz-ui'
import { useFormField, useFormValidator, useToast } from 'maz-ui/composables'
import { boolean, literal, maxValue, minLength, minValue, nonEmpty, number, pipe, string } from 'valibot'
import { useTemplateRef } from 'vue'

const schema = {
  name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
  age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
  country: pipe(string('Country is required'), nonEmpty('Country is required')),
  agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
}

const { isSubmitting, handleSubmit } = useFormValidator<typeof schema>({
  schema,
  options: { mode: 'eager', scrollToError: '.has-error-form2', identifier: 'form-eager' },
})

const { value: name, hasError: hasErrorName, errorMessage: nameErrorMessage } = useFormField<string>('name', {
  ref: useTemplateRef('nameRef'),
  formIdentifier: 'form-eager',
})
const { value: age, hasError: hasErrorAge, errorMessage: ageErrorMessage } = useFormField<number>('age', {
  ref: useTemplateRef('ageRef'),
  formIdentifier: 'form-eager',
})
const { value: agree, hasError: hasErrorAgree, errorMessage: agreeErrorMessage } = useFormField<boolean>('agree', {
  ref: useTemplateRef('agreeRef'),
  formIdentifier: 'form-eager'
})
const { value: country, hasError: hasErrorCountry, errorMessage: countryErrorMessage, validationEvents } = useFormField<string>('country', {
  mode: 'lazy',
  formIdentifier: 'form-eager'
})

const onSubmit = handleSubmit(async (formData) => {
  // Form submission logic
  console.log(formData)
  await sleep(2000)
  toast.success('Form submitted', { position: 'top' })
})
</script>

<template>
  <form @submit="onSubmit">
    <MazInput
      ref="nameRef"
      v-model="name"
      label="Enter your name"
      :hint="nameErrorMessage"
      :error="hasErrorName"
      :class="{ 'has-error-form2': hasErrorName }"
    />
    <MazInput
      ref="ageRef"
      v-model="age"
      type="number"
      label="Enter your age"
      :hint="ageErrorMessage"
      :error="hasErrorAge"
      :class="{ 'has-error-form2': hasErrorAge }"
    />
    <MazSelect
      ref="countryRef"
      v-model="country"
      :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
      label="Select your nationality"
      :hint="countryErrorMessage"
      :error="hasErrorCountry"
      :class="{ 'has-error-form2': hasErrorCountry }"
    />
    <MazCheckbox
      ref="agreeRef"
      v-model="agree"
      :hint="agreeErrorMessage"
      :error="hasErrorAgree"
      :class="{ 'has-error': hasErrorAgree }"
    >
      I agree to the terms and conditions
    </MazCheckbox>
    <MazBtn type="submit" :loading="isSubmitting">
      Submit
    </MazBtn>
  </form>
</template>
```

  </template>
</ComponentDemo>

### Progressive mode

With progressive mode, the field becomes valid after the first successful validation and then validated on input value change. If the field is invalid, the error message is shown on the first blur event.

<ComponentDemo>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmitProgressive">
    <MazInput
      v-model="nameProgressive"
      ref="nameProgressiveRef"
      label="Enter your name"
      :hint="nameMessageProgressive"
      :error="!!nameMessageProgressive"
      :success="nameValidProgressive"
      :class="{ 'has-error-progressive': !!nameMessageProgressive }"
    />
    <MazInput
      v-model="ageProgressive"
      ref="ageProgressiveRef"
      type="number"
      label="Enter your age"
      :hint="ageMessageProgressive"
      :error="!!ageMessageProgressive"
      :success="ageValidProgressive"
      :class="{ 'has-error-progressive': !!ageMessageProgressive }"
    />
    <MazSelect
      v-model="countryProgressive"
      ref="countryProgressiveRef"
      :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
      label="Select your nationality"
      :hint="countryMessageProgressive"
      :error="!!countryMessageProgressive"
      :success="countryValidProgressive"
      :class="{ 'has-error-progressive': !!countryErrorProgressive }"
    />
    <MazCheckbox
      v-model="agreeProgressive"
      ref="agreeProgressiveRef"
      :hint="agreeMessageProgressive"
      :error="!!agreeMessageProgressive"
      :class="{ 'has-error-progressive': !!agreeMessageProgressive }"
    >
      I agree to the terms and conditions
    </MazCheckbox>
    <MazBtn type="submit" :loading="isSubmittingProgressive">
      Submit
    </MazBtn>
  </form>

<template #code>

```vue
<script setup lang="ts">
import { sleep } from 'maz-ui'
import { useFormField, useFormValidator, useToast } from 'maz-ui/composables'
import { boolean, literal, maxValue, minLength, minValue, nonEmpty, number, pipe, string } from 'valibot'
import { useTemplateRef } from 'vue'

const schema = {
  name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
  age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
  country: pipe(string('Country is required'), nonEmpty('Country is required')),
  agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
}

const { isSubmitting, handleSubmit } = useFormValidator<typeof schema>({
  schema,
  options: { mode: 'progressive', scrollToError: '.has-error-progressive', identifier: 'form-progressive' },
})

const { value: name, hasError: nameHasError, errorMessage: nameErrorMessage } = useFormField<string>('name', {
  ref: useTemplateRef('nameRef'),
  formIdentifier: 'form-progressive',
})
const { value: age, hasError: ageHasError, errorMessage: ageErrorMessage } = useFormField<number>('age', {
  ref: useTemplateRef('ageRef'),
  formIdentifier: 'form-progressive',
})
const { value: country, hasError: countryHasError, errorMessage: countryErrorMessage, validationEvents } = useFormField<string>('country', {
  mode: 'lazy',
  formIdentifier: 'form-progressive',
})
const { value: agree, hasError: agreeHasError, errorMessage: agreeErrorMessage } = useFormField<boolean>('agree', {
  ref: useTemplateRef('agreeRef'),
  formIdentifier: 'form-progressive',
})

const onSubmit = handleSubmit(async (formData) => {
  // Form submission logic
  console.log(formData)
  await sleep(2000)
  toast.success('Form submitted', { position: 'top' })
})
</script>

<template>
  <form @submit="onSubmit">
    <MazInput
      ref="nameRef"
      v-model="name"
      label="Enter your name"
      :hint="nameErrorMessage"
      :error="nameHasError"
      :class="{ 'has-error-progressive': nameHasError }"
    />
    <MazInput
      ref="ageRef"
      v-model="age"
      type="number"
      label="Enter your age"
      :hint="ageErrorMessage"
      :error="ageHasError"
      :class="{ 'has-error-progressive': ageHasError }"
    />
    <MazSelect
      v-model="country"
      v-bind="validationEvents"
      :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
      label="Select your nationality"
      :hint="countryErrorMessage"
      :error="countryHasError"
      :class="{ 'has-error-progressive': countryHasError }"
    />
    <MazCheckbox
      ref="agreeRef"
      v-model="agree"
      :hint="agreeErrorMessage"
      :error="agreeHasError"
      :class="{ 'has-error-progressive': agreeHasError }"
    >
      I agree to the terms and conditions
    </MazCheckbox>
    <MazBtn type="submit" :loading="isSubmitting">
      Submit
    </MazBtn>
  </form>
</template>
```

  </template>
</ComponentDemo>

## Throlling and Debouncing

You can use the `throttledFields` and `debouncedFields` options to throttle or debounce the validation of specific fields.

The fields are validated with throttling or debouncing to avoid spamming the server or to wait for the user to finish typing before validating.

You can set the throttle or debounce time in milliseconds or use `true` for the default throttle time (1000ms) or debounce time (300ms).

<ComponentDemo>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmitDebounced">
    <MazInput
      v-model="modelDebounced.name"
      label="Enter your name"
      :hint="errorMessagesDebounced.name"
      :error="fieldsStatesDebounced.name.error"
      :success="fieldsStatesDebounced.name.valid"
      :class="{ 'has-error-debounced': fieldsStatesDebounced.name.error }"
    />
    <MazInput
      v-model="modelDebounced.age"
      type="number"
      label="Enter your age"
      :hint="errorMessagesDebounced.age"
      :error="fieldsStatesDebounced.age.error"
      :success="fieldsStatesDebounced.age.valid"
      :class="{ 'has-error-debounced': fieldsStatesDebounced.age.error }"
    />
    <MazBtn type="submit" :loading="isSubmittingDebounced">
      Submit
    </MazBtn>
  </form>

<template #code>

```vue{37,38}
<template>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmit">
    <MazInput
      v-model="model.name"
      label="Enter your name"
      :hint="errorMessages.name"
      :error="fieldsStates.name.error"
      :success="fieldsStates.name.valid"
      :class="{ 'has-error-debounced': fieldsStates.name.error }"
    />
    <MazInput
      v-model="model.age"
      type="number"
      label="Enter your age"
      :hint="errorMessages.age"
      :error="fieldsStates.age.error"
      :success="fieldsStates.age.valid"
      :class="{ 'has-error-debounced': fieldsStates.age.error }"
    />
    <MazBtn type="submit" :loading="isSubmitting">
      Submit
    </MazBtn>
  </form>
</template>

<script setup lang="ts">
  import { sleep } from 'maz-ui'
  import { useFormValidator, useToast, InferFormValidatorSchema } from 'maz-ui/composables'
  import { string, nonEmpty, pipe, number, minValue, minLength } from 'valibot'

  const { model, fieldsStates, isValid, isSubmitting, errorMessages, handleSubmit } = useFormValidator({
    schema: {
      name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
      age: pipe(number('Age is required'), nonEmpty('Age is required'), minValue(18, 'Age must be greater than 18')),
    },
    options: {
      debouncedFields: { name: 500 },
      throttledFields: { age: true },
      scrollToError: '.has-error-debounced',
    },
  })

  const onSubmit = handleSubmit(async (formData) => {
    // Form submission logic
    console.log(formData)
    await sleep(2000)
    toast.success('Form submitted', { position: 'top' })
  })
</script>
```

  </template>
</ComponentDemo>

## Validation with async function

You can use async functions in the validation schema.

<ComponentDemo>
  <form class="maz-flex maz-gap-4" @submit="onSubmitAsync">
    <MazInput
      v-model="modelAsync.name"
      label="Enter your name"
      ref="nameAsyncRef"
      v-bind="validationEventsAsync"
      :hint="errorMessagesAsync.name"
      :error="fieldsStatesAsync.name.error"
      :success="fieldsStatesAsync.name.valid"
      :loading="fieldsStatesAsync.name.validating"
      :class="{ 'has-error-async': fieldsStatesAsync.name.error }"
    />
    <MazBtn type="submit" :loading="isSubmittingAsync">
      Submit
    </MazBtn>
  </form>

<template #code>

```vue
<template>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmit">
    <MazInput
      v-model="model.name"
      label="Enter your name"
      ref="nameRef"
      v-bind="validationEvents"
      :hint="errorMessages.name"
      :error="fieldsStates.name.error"
      :success="fieldsStates.name.valid"
      :loading="fieldsStates.name.validating"
      :class="{ 'has-error-debounced': fieldsStates.name.error }"
    />
    <MazBtn type="submit" :loading="isSubmitting">
      Submit
    </MazBtn>
  </form>
</template>

<script setup lang="ts">
  import { sleep } from 'maz-ui'
  import { useFormValidator, useToast, InferFormValidatorSchema } from 'maz-ui/composables'
  import { string, nonEmpty, pipe, number, minValue, minLength, pipeAsync, checkAsync } from 'valibot'

  const {
    model,
    fieldsStates,
    isValid,
    isSubmitting,
    errorMessages,
    handleSubmit,
  } = useFormValidator({
    schema: {
      name: pipeAsync(
        string('Name is required'),
        nonEmpty('Name is required'),
        minLength(3, 'Name must be at least 3 characters'),
        checkAsync(
          async (name) => {
            console.log('name', name)
            await sleep(2000)
            return false
          },
          'Name is already taken',
        )),
    },
    options: { mode: 'eager', scrollToError: '.has-error-async', identifier: 'form-async' },
  })

  const onSubmit = handleSubmit((formData) => {
    // Form submission logic
    console.log(formData)
    toast.success('Form submitted', { position: 'top' })
  })
</script>
```

</template>

</ComponentDemo>

## useFormValidator

`useFormValidator` is the main composable for initializing form validation.

It accepts a validation schema, default values, and configuration options to handle form validation. You can also provide a model reference to bind the form data.

### Parameters

`useFormValidator<TSchema>` accepts an object with the following properties:

- `schema`: `TSchema` - The Valibot validation schema for the form.
- `model`: `Ref<Model>` (optional) - A reference to the form's data model.
- `defaultValues`: `DeepPartial<Model>` (optional) - Default values for the form fields.
- `options`: `FormValidatorOptions` (optional) - Configuration options for the form validation behavior.
  - `mode`: `'eager' | 'lazy' | 'aggressive' | 'blur' | 'progressive'` (optional) - Form validation mode. (default: 'lazy') - To use the `eager`, `blur`, or `progressive` validation modes, you must use the `useFormField` composable to add the necessary validation events. - [see validation modes](#introduction)
  - `throttledFields`: `Partial<Record<ModelKey, number | true>>` (optional) - Fields to validate with throttling. It's an object where the key is the field name and the value is the throttle time in milliseconds or `true` for the default throttle time (1000ms).
  - `debouncedFields`: `Partial<Record<ModelKey, number | true>>` (optional) - Fields to validate with debouncing. It's an object where the key is the field name and the value is the debounce time in milliseconds or `true` for the default debounce time (300ms).
  - `scrollToError`: `string | false` (optional) - Disable or provide a CSS selector for scrolling to errors (default '.has-field-error')
  - `identifier`: `string | symbol` (optional) - Identifier for the form (useful when you have multiple forms on the same component)

### Return

`useFormValidator` returns an object containing:

- `isDirty`: `ComputedRef<boolean>` - Indicates if the form has been modified.
- `isSubmitting`: `Ref<boolean>` - Indicates if the form is currently being submitted.
- `isSubmitted`: `Ref<boolean>` - Indicates if the form has been submitted.
- `isValid`: `ComputedRef<boolean>` - Indicates if the form is valid.
- `errors`: `ComputedRef<Record<ModelKey, ValidationIssues>>` - Validation errors for each field.
- `errorsMessages`: `ComputedRef<Record<string, string>>` - The first validation error message for each field.
- `model`: `Ref<Model>` - The form's data model.
- `fieldsStates`: `FieldsStates` - The validation state of each field.
- `validateForm`: `(setErrors?: boolean) => Promise<boolean>` - Function to validate the entire form.
- `scrollToError`: `(selector?: string, options?: { offset?: number }) => void` - Function to scroll to the first field with an error.
- `handleSubmit`: `successCallback: (model: Model) => Promise<unknown> | unknown, scrollToError?: false | string` - Form submission handler, the callback is called if the form is valid and passes the complete payload as an argument. The second argument is optional and can be used to disable or provide a CSS selector for scrolling to errors (default '.has-field-error').

## useFormField

::: warning
Before using `useFormField`, make sure you have initialized the form with `useFormValidator`.
:::

`useFormField` is a composable for handling validation at the individual form field level.

Useful for fine-grained control over form fields, `useFormField` provides computed properties for validation state, error messages, and more.
Can be very useful when you are using fields in child components of form.

To use the modes `eager`, `progressive` or `blur`, you must use this `useFormField` composable to add the [necessary validation events](#introduction).

### Parameters

`useFormField<T>` takes the following parameters:

- `name`: `string` - The name of the field in the validation schema (must be a key from the schema).
- `options`: `FormFieldOptions<T>` (optional) - Field-specific options.
  - `defaultValue`: `T` (optional) - The default value of the field.
  - `mode`: `'eager' | 'lazy' | 'aggressive' | 'blur' | 'progressive'` (optional) - The validation mode for the field - [see validation modes](#introduction)
  - `ref`: `Ref<HTMLElement | ComponentInstance>` (optional) - Vue ref to the component/element for automatic event binding - use `useTemplateRef()` for type safety
  - `formIdentifier`: `string | symbol` (optional) - Identifier for the form (must match the one used in `useFormValidator`)

### Return

`useFormField` returns an object containing:

- `errors`: `ComputedRef<ValidationIssues>` - Validation errors for this field.
- `errorMessage`: `ComputedRef<string>` - The first validation error message.
- `isValid`: `ComputedRef<boolean>` - Indicates if the field is valid.
- `isDirty`: `ComputedRef<boolean>` - Indicates if the field has been modified.
- `isBlurred`: `ComputedRef<boolean>` - Indicates if the field has lost focus.
- `hasError`: `ComputedRef<boolean>` - Indicates if the field has errors.
- `isValidated`: `ComputedRef<boolean>` - Indicates if the field has been validated.
- `isValidating`: `ComputedRef<boolean>` - Indicates if the field is currently being validated.
- `mode`: `ComputedRef<StrictOptions['mode']>` - The validation mode for the field.
- `value`: `WritableComputedRef<T>` - The reactive value of the field with proper TypeScript typing.
- `validationEvents`: `ComputedRef<{ onBlur?: () => void; }>` - Validation events to bind to the field. They are used to trigger field validation, to be used like this `v-bind="validationEvents"` (components must emit `blur` event to trigger field validation) - Not necessary for `lazy`, `aggressive` validation modes or if you use the component reference when initializing the composable.

## Recent Improvements (v4.0.0)

### 🚀 Enhanced Type Safety

- **Automatic schema inference**: Use `typeof schema` for precise TypeScript types
- **Field-level type safety**: `useFormField<T>` provides exact field types
- **Improved reactivity**: Optimized watchers with better performance and memory management

### 🎯 Better Interactive Element Detection

The `ref` option in `useFormField` now automatically detects and binds events to:
- Standard form elements: `input`, `select`, `textarea`, `button`
- Focusable elements: links with `href`, elements with `tabindex`
- ARIA interactive elements: `role="button"`, `role="textbox"`, etc.
- Custom interactive elements: `data-interactive`, `data-clickable`, `.interactive`

### 🔧 Improved Memory Management

- Automatic cleanup of event listeners to prevent memory leaks
- WeakMap-based tracking for better garbage collection
- Race condition protection in async validation

### 📝 Better Development Experience

- More informative warning messages
- Improved error handling and validation states
- Enhanced debugging capabilities

## Performance & Best Practices

### 🚀 Performance Tips

- **Use `throttledFields` or `debouncedFields`** for expensive validations or network requests
- **Prefer `eager` or `progressive` modes** for better UX instead of `aggressive`
- **Use `lazy` mode** for simple forms with minimal validation
- **Leverage TypeScript**: Always use `typeof schema` for automatic type inference

### 💡 Common Patterns

#### Multiple Forms on Same Page

```ts
const form1 = useFormValidator<typeof schema1>({
  schema: schema1,
  options: { identifier: 'form-1' }
})

const form2 = useFormValidator<typeof schema2>({
  schema: schema2,
  options: { identifier: 'form-2' }
})

// Use matching identifiers in useFormField
const { value } = useFormField<string>('name', {
  formIdentifier: 'form-1'
})
```

#### Custom Interactive Elements

```vue
<template>
  <!-- Add data-interactive for custom components -->
  <div data-interactive class="custom-input" tabindex="0">
    Custom Input
  </div>
</template>
```

### ⚠️ Common Pitfalls

- **Mismatched form identifiers**: Ensure `useFormField` uses the same `formIdentifier` as `useFormValidator`
- **Missing refs for interactive modes**: `eager`, `blur`, and `progressive` modes require either `ref` or `validationEvents`
- **Incorrect TypeScript generics**: Always specify both schema and field name: `useFormField<T>`

## Troubleshooting

### Type Errors

**Problem**: `WritableComputedRef<string | number | boolean | undefined>`

```ts
// ❌ Wrong - loses type precision
const { value } = useFormField('name')

// ✅ Correct - precise typing
const { value } = useFormField<string>('name')
```

### Using `useTemplateRef` with `useFormField` cause TypeScript errors

**Cause:** `useTemplateRef` can create TypeScript circular references when the destructured variable name resembles the template ref name.

If you encounter TypeScript errors when using `useFormField` with `useTemplateRef`, use classic `ref()` instead:

```typescript
// ❌ May cause TypeScript errors
const { value: email } = useFormField<string>('email', {
  ref: useTemplateRef('emailRef'),
})

// ✅ Correct - precise typing
const { value: email } = useFormField<string>('email', {
  ref: useTemplateRef<string>('emailRef'),
})

// ✅ Use classic `ref()` instead
const emailRef = ref<HTMLInputElement>()
const { value: email } = useFormField<string>('email', {
  ref: emailRef,
})
```

### Validation Not Triggering

**Problem**: Field validation doesn't work with `eager`/`blur`/`progressive` modes

```ts
// ❌ Missing ref or validation events
const { value } = useFormField<string>('name')

// ✅ Use ref for automatic detection
const { value } = useFormField<string>('name', {
  ref: useTemplateRef('inputRef')
})

// ✅ Or use validation events manually
const { value, validationEvents } = useFormField<string>('name')
// Then: v-bind="validationEvents" on your component
```

### Element Not Found Warning

**Problem**: `No element found for ref in field 'name'`

**Solutions**:
1. Ensure the ref is properly bound to an HTML element or Vue component
2. Make sure the component has a `$el` property if it's a Vue component
3. Use `data-interactive` attribute for custom interactive elements

## Types

### FormValidatorOptions

```ts
interface FormValidatorOptions {
  /**
   * Validation mode
   * - lazy: validate on input value change
   * - aggressive: validate all fields immediately on form creation and on input value change
   * - blur: validate on blur
   * - eager: validate on blur at first (only if the field is not empty) and then on input value change
   * - progressive: The field becomes valid after the first successful validation and then validated on input value change. If the field is invalid, the error message on the first blur event.
   * @default 'lazy'
   */
  mode?: 'eager' | 'lazy' | 'aggressive' | 'blur' | 'progressive'
  /**
   * Fields to validate with throttling
   * Useful for fields that require a network request to avoid spamming the server
   * @example { name: 1000 } or { name: true } for the default throttle time (1000ms)
   */
  throttledFields?: Partial<Record<ModelKey, number | true>>
  /**
   * Fields to validate with debouncing
   * Useful to wait for the user to finish typing before validating
   * Useful for fields that require a network request to avoid spamming the server
   * @example { name: 300 } or { name: true } for the default debounce time (300ms)
   */
  debouncedFields?: Partial<Record<ModelKey, number | true>>
  /**
   * Scroll to the first error found
   * @default '.has-field-error'
   */
  scrollToError?: string | false
  /**
   * Identifier to use for the form
   * Useful to have multiple forms on the same page
   * @default `main-form-validator`
   */
  identifier?: string | symbol
}
```

### FormFieldOptions

```ts
interface FormFieldOptions<T> {
  /**
   * Default value of the field
   * @default undefined
   */
  defaultValue?: T
  /**
   * Validation mode
   * To override the form validation mode
   */
  mode?: 'eager' | 'lazy' | 'aggressive' | 'blur' | 'progressive'
  /**
   * Vue ref to the component or HTML element for automatic event binding
   * Use useTemplateRef() for type safety
   * Automatically detects interactive elements (input, select, textarea, button, ARIA elements, etc.)
   * Necessary for 'eager', 'progressive' and 'blur' validation modes
   */
  ref?: Ref<HTMLElement | ComponentInstance>
  /**
   * Identifier for the form
   * Useful when you have multiple forms on the same component
   * Should be the same as the one used in `useFormValidator`
   */
  formIdentifier?: string | symbol
}
```

<script lang="ts" setup>
  import { ref, useTemplateRef } from 'vue'
  import { useFormValidator } from 'maz-ui/src/composables/useFormValidator'
  import { useFormField } from 'maz-ui/src/composables/useFormField'
  import { useToast } from 'maz-ui/src/composables/useToast'
  import { sleep } from 'maz-ui'
  import { string, nonEmpty, pipe, number, minValue, maxValue, boolean, literal, minLength, pipeAsync, checkAsync } from 'valibot'

  const toast = useToast()

  const schema = ref({
    name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
    age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
    country: pipe(string('Country is required'), nonEmpty('Country is required')),
    agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
  })

  const { model, isValid, isSubmitting, isDirty, isSubmitted, handleSubmit, errorMessages, fieldsStates } = useFormValidator<typeof schema>({
    schema,
    defaultValues: { name: 'John Doe', age: 10 },
    options: { mode: 'lazy', scrollToError: '.has-error' },
  })

  const onSubmit = handleSubmit(async (formData) => {
    // Form submission logic
    console.log(formData)
    await sleep(2000)
    toast.success('Form submitted', { position: 'top' })
  })

  const eagerSchema = {
    name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
    age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
    country: pipe(string('Country is required'), nonEmpty('Country is required')),
    agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
  }

  const { isValid: isValidEager, isSubmitting: isSubmittingEager, handleSubmit: handleSubmitEager } = useFormValidator<typeof eagerSchema>({
    schema: eagerSchema,
    options: { mode: 'eager', scrollToError: '.has-error-form2', identifier: 'form-eager' },
  })

  const { value: name, hasError: hasErrorName, errorMessage: nameErrorMessage } = useFormField<string>('name', { ref: useTemplateRef('nameRef'), formIdentifier: 'form-eager' })
  const { value: age, hasError: hasErrorAge, errorMessage: ageErrorMessage } = useFormField<number>('age', { ref: useTemplateRef('ageRef'), formIdentifier: 'form-eager'  })
  const { value: country, hasError: hasErrorCountry, errorMessage: countryErrorMessage, validationEvents } = useFormField<string>('country', { mode: 'lazy', formIdentifier: 'form-eager'  })
  const { value: agree, hasError: hasErrorAgree, errorMessage: agreeErrorMessage } = useFormField<boolean>('agree', { ref: useTemplateRef('agreeRef'), formIdentifier: 'form-eager'  })

  const onSubmitEager = handleSubmitEager(async (formData) => {
    // Form submission logic
    console.log(formData)
    await sleep(2000)
    toast.success('Form submitted', { position: 'top' })
  })

  const { isValid: isValidProgressive, isSubmitting: isSubmittingProgressive, handleSubmit: handleSubmitProgressive } = useFormValidator<Model>({
    schema: {
      name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
      age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
      country: pipe(string('Country is required'), nonEmpty('Country is required')),
      agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
    },
    options: { mode: 'progressive', scrollToError: '.has-error-progressive', identifier: 'form-progressive' },
  })

  const progressiveSchema = {
    name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
    age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
    country: pipe(string('Country is required'), nonEmpty('Country is required')),
    agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
  }

  const { value: nameProgressive, isValid: nameValidProgressive, hasError: nameErrorProgressive, errorMessage: nameMessageProgressive } = useFormField<string>('name', { ref: useTemplateRef('nameProgressiveRef'), formIdentifier: 'form-progressive' })
  const { value: ageProgressive, isValid: ageValidProgressive, hasError: ageErrorProgressive, errorMessage: ageMessageProgressive } = useFormField<number>('age', { ref: useTemplateRef('ageProgressiveRef'), formIdentifier: 'form-progressive'  })
  const { value: countryProgressive, isValid: countryValidProgressive, hasError: countryErrorProgressive, errorMessage: countryMessageProgressive, validationEventsProgressive } = useFormField<string>('country', { ref: useTemplateRef('countryProgressiveRef'), formIdentifier: 'form-progressive' })
  const { value: agreeProgressive, isValid: agreeValidProgressive, hasError: agreeErrorProgressive, errorMessage: agreeMessageProgressive } = useFormField<boolean>('agree', { ref: useTemplateRef('agreeProgressiveRef'), formIdentifier: 'form-progressive'  })

  const onSubmitProgressive = handleSubmitProgressive(async (formData) => {
    // Form submission logic
    console.log(formData)
    await sleep(2000)
    toast.success('Form submitted', { position: 'top' })
  })

  const { model: modelDebounced, fieldsStates: fieldsStatesDebounced, isValid: isValidDebounced, isSubmitting: isSubmittingDebounced, errorMessages: errorMessagesDebounced, handleSubmit: handleSubmitDebounced } = useFormValidator({
    schema: {
      name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
      age: pipe(number('Age is required'), nonEmpty('Age is required'), minValue(18, 'Age must be greater than 18')),
    },
    options: {
      debouncedFields: { name: 500 },
      throttledFields: { age: true },
      scrollToError: '.has-error-debounced',
    },
  })

  const onSubmitDebounced = handleSubmitDebounced(async (formData) => {
    // Form submission logic
    console.log(formData)
    await sleep(2000)
    toast.success(`Form submitted with ${JSON.stringify(formData)}`, { position: 'top' })
  })

  const { model: modelAsync, fieldsStates: fieldsStatesAsync, isValid: isValidAsync, isSubmitting: isSubmittingAsync, errorMessages: errorMessagesAsync, handleSubmit: handleSubmitAsync } = useFormValidator({
    schema: {
      name: pipeAsync(
        string('Name is required'),
        nonEmpty('Name is required'),
        minLength(3, 'Name must be at least 3 characters'),
        checkAsync(
          async (name) => {
            console.log('name', name)
            await sleep(2000)
            return false
          },
          'Name is already taken',
        )),
    },
    options: { mode: 'eager', scrollToError: '.has-error-async', identifier: 'form-async' },
  })

  const {
    value: nameAsync,
    hasError: hasErrorNameAsync,
    errorMessage: nameErrorMessageAsync,
    validationEvents: validationEventsAsync,
  } = useFormField<string>('name', {
    ref: useTemplateRef('nameAsyncRef'),
    formIdentifier: 'form-async',
  })

  const onSubmitAsync = handleSubmitAsync((formData) => {
    // Form submission logic
    console.log(formData)
    toast.success('Form submitted', { position: 'top' })
  })
</script>
