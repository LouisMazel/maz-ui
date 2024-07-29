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

## Basic Usage (lazy mode)

In this example, we will create a simple form with three fields: `name`, `age`, and `country`. The form will be validated in `lazy` mode, which means that the fields will be validated on every change.

<ComponentDemo>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmit">
    <MazInput
      v-model="model.name"
      label="Enter your name"
      :hint="errorMessages.name"
      :error="!!errorMessages.name"
      :class="{ 'has-error': !!errorMessages.name }"
    />
    <MazInput
      v-model="model.age"
      type="number"
      label="Enter your age"
      :hint="errorMessages.age"
      :error="!!errorMessages.age"
      :class="{ 'has-error': !!errorMessages.age }"
    />
    <MazSelect
      v-model="model.country"
      :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
      label="Select your nationality"
      :hint="errorMessages.country"
      :error="!!errorMessages.country"
      :class="{ 'has-error': !!errorMessages.country }"
    />
    <MazCheckbox v-model="model.agree" :class="{ 'has-error': !!errorMessages.agree }">
      <div>
        <p>I agree to the terms and conditions</p>
        <p v-if="errorMessages.agree" class="maz-text-danger-600 maz-text-sm">
          {{ errorMessages.agree }}
        </p>
      </div>
    </MazCheckbox>
    <MazBtn type="submit" :loading="isSubmitting">
      Submit
    </MazBtn>
  </form>
  <template #code>

  ```vue
  <template>
    <form @submit="onSubmit">
      <MazInput
        v-model="model.name"
        label="Enter your name"
        :hint="errorMessages.name"
        :error="!!errorMessages.name"
        :class="{ 'has-error': !!errorMessages.name }"
      />
      <MazInput
        v-model="model.age"
        type="number"
        label="Enter your age"
        :hint="errorMessages.age"
        :error="!!errorMessages.age"
        :class="{ 'has-error': !!errorMessages.age }"
      />
      <MazSelect
        v-model="model.country"
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
      <MazBtn type="submit" :loading="isSubmitting">
        Submit
      </MazBtn>
    </form>
  </template>

  <script lang="ts" setup>
    import { ref, type ComponentPublicInstance } from 'vue'
    import { useFormValidator, sleep, useToast } from 'maz-ui'
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
      options: { mode: 'lazy', scrollToError: '.has-error' },
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

## Usage with useFormField (eager mode)

With eager mode, each form field is validated on blur (if not empty) and then on every change.

<ComponentDemo>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmit2">
    <MazInput
      v-model="name"
      ref="nameRef"
      label="Enter your name"
      :hint="nameErrorMessage"
      :error="!!nameErrorMessage"
      :class="{ 'has-error-form2': !!nameErrorMessage }"
    />
    <MazInput
      v-model="age"
      ref="ageRef"
      type="number"
      label="Enter your age"
      :hint="ageErrorMessage"
      :error="!!ageErrorMessage"
      :class="{ 'has-error-form2': !!ageErrorMessage }"
    />
    <MazSelect
      v-model="country"
      ref="countryRef"
      :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
      label="Select your nationality"
      :hint="countryErrorMessage"
      :error="!!countryErrorMessage"
      :class="{ 'has-error-form2': !!countryErrorMessage }"
    />
    <MazCheckbox ref="agreeRef" v-model="agree" :class="{ 'has-error-form2': !!agreeErrorMessage }">
      <div>
        <p>I agree to the terms and conditions</p>
        <p v-if="agreeErrorMessage" class="maz-text-danger-600 maz-text-sm">
          {{ agreeErrorMessage }}
        </p>
      </div>
    </MazCheckbox>
    <MazBtn type="submit" :loading="isSubmitting2">
      Submit
    </MazBtn>
  </form>

  <template #code>

```vue
<template>
  <form @submit="onSubmit">
    <MazInput
      v-model="name"
      ref="nameRef"
      label="Enter your name"
      :hint="nameErrorMessage"
      :error="!!nameErrorMessage"
      :class="{ 'has-error-form2': !!nameErrorMessage }"
    />
    <MazInput
      v-model="age"
      ref="ageRef"
      type="number"
      label="Enter your age"
      :hint="ageErrorMessage"
      :error="!!ageErrorMessage"
      :class="{ 'has-error-form2': !!ageErrorMessage }"
    />
    <MazSelect
      v-model="country"
      v-bind="{ ...validationEvents }"
      :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
      label="Select your nationality"
      :hint="countryErrorMessage"
      :error="!!countryErrorMessage"
      :class="{ 'has-error-form2': !!countryErrorMessage }"
    />
    <MazCheckbox ref="agreeRef" v-model="agree" :class="{ 'has-error-form2': !!agreeErrorMessage }">
      <div>
        <p>I agree to the terms and conditions</p>
        <p v-if="agreeErrorMessage" class="maz-text-danger-600 maz-text-sm">
          {{ agreeErrorMessage }}
        </p>
      </div>
    </MazCheckbox>
    <MazBtn type="submit" :loading="isSubmitting">
      Submit
    </MazBtn>
  </form>
</template>

<script setup lang="ts">
  const { isValid, isSubmitting, handleSubmit } = useFormValidator<Model>({
    schema: {
      name: pipe(string('Name is required'), nonEmpty('Name is required')),
      age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
      agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
      country: pipe(string('Country is required'), nonEmpty('Country is required')),
    },
    options: { mode: 'eager', scrollToError: '.has-error-form2', identifier: 'form2' },
  })

  const { value: name, errorMessage: nameErrorMessage } = useFormField('name', { ref: 'nameRef', formIdentifier: 'form2' })
  const { value: age, errorMessage: ageErrorMessage } = useFormField('age', { ref: 'ageRef', formIdentifier: 'form2'  })
  const { value: agree, errorMessage: agreeErrorMessage } = useFormField('agree', { ref: 'agreeRef', formIdentifier: 'form2'  })
  const { value: country, errorMessage: countryErrorMessage, validationEvents } = useFormField('country', { mode: 'lazy', formIdentifier: 'form2'  })

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

  const { model, isValid, isSubmitting, handleSubmit, errorMessages } = useFormValidator<Model>({
    schema: {
      name: pipe(string('Name is required'), nonEmpty('Name is required')),
      age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
      agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
      country: pipe(string('Country is required'), nonEmpty('Country is required')),
    },
    defaultValues: { name: 'John Doe' },
    options: { mode: 'lazy', scrollToError: '.has-error' },
  })

  const onSubmit = handleSubmit(async (formData) => {
    // Form submission logic
    console.log(formData)
    await sleep(2000)
    toast.success('Form submitted', { position: 'top' })
  })

  const { isValid: isValid2, isSubmitting: isSubmitting2, handleSubmit: handleSubmit2 } = useFormValidator<Model>({
    schema: {
      name: pipe(string('Name is required'), nonEmpty('Name is required')),
      age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
      agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
      country: pipe(string('Country is required'), nonEmpty('Country is required')),
    },
    options: { mode: 'eager', scrollToError: '.has-error-form2', identifier: 'form2' },
  })

  const { value: name, errorMessage: nameErrorMessage } = useFormField('name', { ref: 'nameRef', formIdentifier: 'form2' })
  const { value: age, errorMessage: ageErrorMessage } = useFormField('age', { ref: 'ageRef', formIdentifier: 'form2'  })
  const { value: agree, errorMessage: agreeErrorMessage } = useFormField('agree', { ref: 'agreeRef', formIdentifier: 'form2'  })
  const { value: country, errorMessage: countryErrorMessage, validationEvents } = useFormField('country', { ref: 'countryRef', formIdentifier: 'form2' })

  const onSubmit2 = handleSubmit2(async (formData) => {
    // Form submission logic
    console.log(formData)
    await sleep(2000)
    toast.success('Form submitted', { position: 'top' })
  })
</script>

## useFormValidator

`useFormValidator` is the main composable for initializing form validation.

It accepts a validation schema, default values, and configuration options to handle form validation.

### Parameters

`useFormValidator` accepts an object with the following properties:

- `schema`: `MaybeRefOrGetter<FormSchema<Model>>` - The validation schema for the form.
- `model`: `Ref<Model>` (optional) - A reference to the form's data model.
- `defaultValues`: `Partial<Model>` (optional) - Default values for the form fields.
- `options`: `FormValidatorOptions` (optional) - Configuration options for the form validation behavior.
  - `mode`: `'eager' | 'lazy' | 'aggressive' | 'blur' | 'input'`  (optional) - Form validation mode. (default: 'lazy') - To use the `eager` or `blur` validation modes, you must use the `useFormField` composable to add the necessary validation events. - [see validation modes](#validation-modes)
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
- `validateForm`: `(setError?: boolean) => Promise<boolean>` - Function to validate the entire form.
- `scrollToError`: `(selector?: string, options?: { offset?: number }) => void` - Function to scroll to the first field with an error.
- `handleSubmit`: `successCallback: (model: Model) => Promise<unknown> | unknown, scrollToError?: false | string` - Form submission handler, the callback is called if the form is valid and passes the complete payload as an argument. The second argument is optional and can be used to disable or provide a CSS selector for scrolling to errors (default '.has-field-error').

### Usage Example

```vue
<script setup lang="ts">
import { nonEmpty, object, pipe, string, number } from 'valibot'
import { ref } from 'vue'

import { useFormValidator, useFormField } from 'maz-ui'

const { model, isValid, errorMessages, handleSubmit, isSubmitting } = useFormValidator<{
  name: string
  age: number
}>({
  schema: {
    name: pipe(string(), nonEmpty('Name is required')),
    age: pipe(number(), nonEmpty('Age is required')),
  },
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

To use the modes `eager` or `blur`, you must use this `useFormField` composable to add the necessary validation events.

### Parameters

- `name`: `ModelKey` - The name of the field in the validation schema.
- `options`: `FormFieldOptions<T>` (optional) - Field-specific options.
  - `defaultValue`: `T` (optional) - The default value of the field.
  - `mode`: `'eager' | 'lazy' | 'aggressive' | 'blur' | 'input'` (optional) - The validation mode for the field - [see validation modes](#validation-modes)
  - `ref`: `string` (optional) - Reference to the component to associate and trigger validation events (not necessary for `lazy`, `aggressive` validation modes)
  - `formIdentifier`: `string | symbol` (optional) - Identifier for the form (useful when you have multiple forms on the same component)

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
- `value`: `ComputedRef<T>` - The value of the field.
- `validationEvents`: `ComputedRef<{ onBlur?: () => void; 'onUpdate:modelValue'?: () => void; }>` - Validation events to bind to the field. They are used to trigger field validation, to be used like this `v-bind="{ ...validationEvents }"` (components must emit `blur` and `update:modelValue` events to trigger field validation) - Not necessary for `lazy`, `aggressive` validation modes or if you use the component reference when initializing the composable.

### Usage Example

> Before using `useFormField`, make sure you have initialized the form with `useFormValidator`.

`useFormField` is a composable for handling validation at the individual form field level.

```vue{14,20}
<script setup lang="ts">
import { ref } from 'vue'
import { useFormField } from 'maz-ui'
import MazInput from 'maz-ui/components/MazInput'

useFormValidator({
  schema: {
    name: pipe(string('Name is required'), nonEmpty('Name is required')),
  },
  mode: 'eager',
})

const { value, errorMessage, isValid, hasError } = useFormField('name', {
  ref: 'inputRef', // Necessary for 'eager', 'blur' and 'input' validation modes to add validation events
})
</script>

<template>
  <MazInput
    ref="inputRef"
    v-model="value"
    :hint="errorMessage"
    :error="hasError"
  />
</template>
```

## Types

### FormValidatorOptions

The configurable options for `useFormValidator` include:

- `mode`: [Validation mode](#validation-modes) ('eager', 'lazy', 'aggressive', 'blur' or 'input')
- `throttledFields`: Fields to validate with throttling (e.g `{ name: 1000 }` or `{ name: true }` for the default throttle time (1000ms))
- `debouncedFields`: Fields to validate with debouncing (e.g `{ name: 300 }` or `{ name: true }` for the default debounce time (300ms))
- `scrollToError`: Disable or provide a CSS selector for scrolling to errors (default '.has-field-error')

### FormFieldOptions

The configurable options for `useFormField` include:

- `defaultValue`: The default value of the field
- `mode`: [Validation mode](#validation-modes) ('eager', 'lazy', 'aggressive', 'blur' or 'input') - To override the form validation mode
- `ref`: Reference to the component or HTML element to associate and trigger validation events

## Validation Modes

- `lazy`: (default) Validates only on value changes - can't be overridden by `useFormField`
- `aggressive`: Validates all fields immediately and on every change - can't be overridden by `useFormField`
- `eager`: (recommended) Validates on initial blur (if not empty), then on every change (requires `useFormField`)
- `blur`: Validates only on focus loss (requires `useFormField`)
- `input`: Validates on every change - similar to `lazy` but can be overridden by `useFormField` to use `eager` or `blur` mode on a specific field (requires `useFormField`)

## Best Practices

1. Use typed Valibot schemas to ensure type consistency.
2. Choose the appropriate validation mode based on your form's needs.
3. Use `useFormField` for fine-grained management of each form field.
4. Take advantage of the validation events returned by `useFormField` to properly bind fields.
5. Use the `handleSubmit` returned by `useFormValidator` to handle form submission securely.
6. Leverage computed values like `isValid`, `hasError`, `errorMessage`, etc to control your user interface state.
