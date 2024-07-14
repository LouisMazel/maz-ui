---
title: useFormValidator
description: useFormValidator and useFormField are two Vue 3 composables designed to simplify form validation using Valibot as the validation library. These composables offer a flexible and typed approach to handle form validation in your Vue 3 applications.
---

# {{ $frontmatter.title }}

`useFormValidator` and `useFormField` are two Vue 3 composables designed to simplify form validation using [Valibot](https://valibot.dev/guides/introduction/) as the validation library. These composables offer a flexible and typed approach to handle form validation in your Vue 3 applications.

## Prerequisites

To use this composable, you have to install the [`Valibot`](https://valibot.dev/) dependency

<NpmBadge package="valibot" />

```bash
npm install valibot
```

## Basic Usage

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <MazInput
      v-model="model.name"
      ref="nameInputRef"
      label="Enter your name"
      :hint="errorMessages.name"
      :error="!!errorMessages.name"
      :class="{ 'has-error': !!errorMessages.name }"
    />
    <MazInput
      v-model="model.age"
      ref="ageInputRef"
      type="number"
      label="Enter your age"
      :hint="errorMessages.age"
      :error="!!errorMessages.age"
      :class="{ 'has-error': !!errorMessages.age }"
    />
    <MazSelect
      v-model="model.country"
      ref="selectInputRef"
      :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
      label="Select your nationality"
      :hint="errorMessages.country"
      :error="!!errorMessages.country"
      :class="{ 'has-error': !!errorMessages.country }"
    />
    <MazCheckbox ref="agreeInputRef" v-model="model.agree" :class="{ 'has-error': !!errorMessages.agree }">
      <div>
        <p>I agree to the terms and conditions</p>
        <p v-if="errorMessages.agree" class="maz-text-danger-600 maz-text-sm">
          {{ errorMessages.agree }}
        </p>
      </div>
    </MazCheckbox>
    <MazBtn @click="onSubmit" :loading="isSubmitting">
      Submit
    </MazBtn>
  </div>
  <template #code>

  ```vue
  <template>
    <MazInput
      v-model="model.name"
      ref="nameInputRef"
      label="Enter your name"
      :hint="errorMessages.name"
      :error="!!errorMessages.name"
      :class="{ 'has-error': !!errorMessages.name }"
    />
    <MazInput
      v-model="model.age"
      ref="ageInputRef"
      type="number"
      label="Enter your age"
      :hint="errorMessages.age"
      :error="!!errorMessages.age"
      :class="{ 'has-error': !!errorMessages.age }"
    />
    <MazSelect
      v-model="model.country"
      ref="selectInputRef"
      :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
      label="Select your nationality"
      :hint="errorMessages.age"
      :error="!!errorMessages.age"
      :class="{ 'has-error': !!errorMessages.age }"
    />
    <MazCheckbox ref="agreeInputRef" v-model="model.agree" :class="{ 'has-error': !!errorMessages.agree }">
      <div>
        <p>I agree to the terms and conditions</p>
        <p v-if="errorMessages.agree" class="maz-text-danger-600 maz-text-sm">
          {{ errorMessages.agree }}
        </p>
      </div>
    </MazCheckbox>
    <MazBtn @click="onSubmit" :loading="isSubmitting">
      Submit
    </MazBtn>
  </template>

  <script lang="ts" setup>
    import { ref, type ComponentPublicInstance } from 'vue'
    import { useFormValidator, useFormField, sleep, useToast } from 'maz-ui'
    import { string, object, nonEmpty, pipe, number, minValue, maxValue, boolean, literal } from 'valibot'

    const toast = useToast()

    type Model = {
      name: string
      age: number
      agree: boolean
      country: string
    }

    const { model, isValid, isSubmitting, handleSubmit, errorMessages } = useFormValidator<Model>({
      schema: {
        name: pipe(string('Name is required'), nonEmpty('Name is required')),
        age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
        agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
        country: pipe(string('Country is required'), nonEmpty('Country is required')),
      },
      defaultValues: { name: 'John Doe' },
      options: { mode: 'lazy', scrollToErrorSelector: '.has-error' },
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

<script lang="ts" setup>
  import { ref, type ComponentPublicInstance } from 'vue'
  import { useFormValidator, useFormField, sleep, useToast } from 'maz-ui'
  import { string, object, nonEmpty, pipe, number, minValue, maxValue, boolean, literal } from 'valibot'

  const toast = useToast()

  type Model = {
    name: string
    age: number
    agree: boolean
    country: string
  }

  const { model, isValid, isSubmitting, handleSubmit, errorMessages, fieldsStates } = useFormValidator<Model>({
    schema: {
      name: pipe(string('Name is required'), nonEmpty('Name is required')),
      age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
      agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
      country: pipe(string('Country is required'), nonEmpty('Country is required')),
    },
    defaultValues: { name: 'John Doe' },
    options: { mode: 'lazy', scrollToErrorSelector: '.has-error' },
  })

  const onSubmit = handleSubmit(async (formData) => {
    // Form submission logic
    console.log(formData)
    await sleep(2000)
    toast.success('Form submitted', { position: 'top' })
  })
</script>

## useFormValidator

`useFormValidator` is the main composable for initializing form validation.

### Parameters

`useFormValidator` accepts an object with the following properties:

- `schema`: `Ref<ObjectValidationSchema>` - A Valibot validation schema for the form.
- `model`: `Ref<Model>` (optional) - A reference to the form's data model.
- `options`: `Options` (optional) - Configuration options for the form validation behavior.
  - `mode`: `Options['mode']`  (optional) - Form validation mode. (default: 'eager') - To use the `eager`, `onInput`, or `onBlur` validation modes, you must use the `useFormField` composable to add the necessary validation events. - [see validation modes](#validation-modes)
  - `throttledFields`: `Partial<Record<ModelKey, number | true>>` (optional) - Fields to validate with throttling. It's an object where the key is the field name and the value is the throttle time in milliseconds or `true` for the default throttle time (1000ms).
  - `debouncedFields`: `Partial<Record<ModelKey, number | true>>` (optional) - Fields to validate with debouncing. It's an object where the key is the field name and the value is the debounce time in milliseconds or `true` for the default debounce time (300ms).
  - `scrollToErrorSelector`: `string` (optional) - CSS selector for scrolling to errors (@default `has-input-error`)

### Return

`useFormValidator` returns an object containing:

- `isDirty`: `ComputedRef<boolean>` - Indicates if the form has been modified.
- `isSubmitting`: `Ref<boolean>` - Indicates if the form is currently being submitted.
- `isSubmitted`: `Ref<boolean>` - Indicates if the form has been submitted.
- `isValid`: `ComputedRef<boolean>` - Indicates if the form is valid.
- `errors`: `ComputedRef<Record<ModelKey, ValidationIssues>>` - Validation errors for each field.
- `errorsMessages`: `ComputedRef<Record<string, string>>` - The first validation error message for each field.
- `model`: `Ref<Model>` - The form's data model.
- `context`: `FormContext<Model, ModelKey>` - The form context for internal use.
- `fieldsStates`: `FieldsStates<ModelKey>` - The validation state of each field.
- `validateForm`: `(setError?: boolean) => Promise<boolean>` - Function to validate the entire form.
- `scrollToError`: `(selector?: string, options?: { offset?: number }) => void` - Function to scroll to the first field with an error.
- `handleSubmit`: `(successCallback: (model: Model) => Promise<unknown> | unknown, scrollToError?: boolean | string) => (event: Event) => Promise<void>` - Form submission handler, the callback is called if the form is valid and passes the complete payload as an argument. The second argument is a selector to scroll to the first field with an error.

### Usage Example

```vue
<script setup lang="ts">
import { nonEmpty, object, pipe, string } from 'valibot'
import { ref } from 'vue'

import { useFormValidator } from 'maz-ui'

const schema = ref(
  object({
    name: pipe(string(), nonEmpty('Name is required')),
    age: pipe(string(), nonEmpty('Age is required')),
  }),
)

const { model, isValid, errorMessages, handleSubmit, isSubmitting } = useFormValidator<{
  name: string
  age: number
}>({
  schema,
  options: { mode: 'lazy' },
})

const onSubmit = handleSubmit(async (formData) => {
  // Form submission logic
  console.log(formData)
})
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="model.name">
    <span v-if="errorMessages.name">{{ errorMessages.name }}</span>

    <input v-model="model.age">
    <span v-if="errorMessages.age">{{ errorMessages.age }}</span>

    <button type="submit" :disabled="isSubmitting">
      Submit
    </button>
  </form>
</template>
```

## useFormField

::: warning
Before using `useFormField`, make sure you have initialized the form with `useFormValidator`.
:::

`useFormField` is a composable for handling validation at the individual form field level.

Useful for fine-grained control over form fields, `useFormField` provides computed properties for validation state, error messages, and more.

To use the modes `eager`, `onInput`, or `onBlur`, you must use this `useFormField` composable to add the necessary validation events.

### Parameters

- `name`: `ModelKey` - The name of the field in the validation schema.
- `options`: `FormFieldOptions<T>` (optional) - Field-specific options.
  - `defaultValue`: `FieldType` (optional) - The default value of the field.
  - `mode`: `Options['mode']` (optional) - The validation mode for the field (default: 'eager') - [see validation modes](#validation-modes)
  - `componentRef`: `Ref<ComponentPublicInstance | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>` (optional) - Reference to the component to associate and trigger validation events (not necessary for `lazy`, `aggressive` validation modes)

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
- `mode`: `ComputedRef<StrictOptions['mode'] | 'none'>` - The validation mode for the field.
- `value`: `ComputedRef<T>` - The value of the field.
- `validationEvents`: `ComputedRef<{ onBlur?: () => void; 'onUpdate:modelValue'?: () => void; }>` - Validation events to bind to the field. They are used to trigger field validation, to be used like this `v-bind="{ ...validationEvents }"` (components must emit `blur` and `update:modelValue` events to trigger field validation) - Not necessary for `lazy`, `aggressive` validation modes or if you use the component reference when initializing the composable.

### Usage Example

> Before using `useFormField`, make sure you have initialized the form with `useFormValidator`.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useFormField } from 'maz-ui'
import MazInput from 'maz-ui/components/MazInput'

const componentRef = ref<ComponentPublicInstance>()

useFormValidator({
  schema: {
    name: pipe(string('Name is required'), nonEmpty('Name is required')),
  },
})

const { value, errorMessage, isValid } = useFormField('name', {
  defaultValue: '',
  mode: 'eager',
  componentRef, // Necessary for 'eager', 'onInput', 'onBlur' validation modes to add validation events
})
</script>

<template>
  <MazInput ref="componentRef" v-model="value" :error-message="errorMessage" />
</template>
```

## Types

The main types used in these composables are:

- `BaseFormPayload`: `Record<string, unknown | undefined>`
- `ObjectValidationSchema`: Valibot validation schema for an object
- `FieldState`: State of a form field
- `FieldsStates`: State of all form fields
- `FormContext`: Form context for internal management
- `ValidationIssues`: Array of Valibot validation errors

## Options

The configurable options for `useFormValidator` include:

- `mode`: [Validation mode](#validation-modes) ('eager', 'lazy', 'aggressive', 'onBlur', 'onInput')
- `throttledFields`: Fields to validate with throttling
- `debouncedFields`: Fields to validate with debouncing
- `scrollToErrorSelector`: CSS selector for scrolling to errors

## Validation Modes

- `lazy`: Validates only on value changes
- `aggressive`: Validates all fields immediately and on every change
- `eager`: Validates on initial blur (if not empty), then on every change
- `onBlur`: Validates only on focus loss
- `onInput`: Validates on every value change

## Best Practices

1. Use typed Valibot schemas to ensure type consistency.
2. Choose the appropriate validation mode based on your form's needs.
3. Use `useFormField` for fine-grained management of each form field.
4. Take advantage of the validation events returned by `useFormField` to properly bind fields.
5. Use the `handleSubmit` returned by `useFormValidator` to handle form submission securely.
6. Leverage computed values like `isValid`, `hasError`, `errorMessage`, etc to control your user interface state.
