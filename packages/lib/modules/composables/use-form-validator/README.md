# Documentation: useFormValidator and useFormField

## Table of Contents

- [Documentation: useFormValidator and useFormField](#documentation-useformvalidator-and-useformfield)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [useFormValidator](#useformvalidator)
    - [Parameters](#parameters)
    - [Return](#return)
    - [Usage Example](#usage-example)
  - [useFormField](#useformfield)
    - [Parameters](#parameters-1)
    - [Return](#return-1)
    - [Usage Example](#usage-example-1)
  - [Types](#types)
  - [Options](#options)
  - [Validation Modes](#validation-modes)
  - [Best Practices](#best-practices)

## Introduction

`useFormValidator` and `useFormField` are two Vue 3 composables designed to simplify form validation using [Valibot](https://valibot.dev/guides/introduction/) as the validation library. These composables offer a flexible and typed approach to handle form validation in your Vue 3 applications.

## useFormValidator

`useFormValidator` is the main composable for initializing form validation.

### Parameters

`useFormValidator` accepts an object with the following properties:

- `schema`: `Ref<ObjectValidationSchema>` - A Valibot validation schema for the form.
- `model`: `Ref<Model>` (optional) - A reference to the form's data model.
- `options`: `Options` (optional) - Configuration options for the form validation behavior.
  - `mode`: `Options['mode']` (optional) - Form validation mode. (default: 'eager') - To use the `eager`, `onInput`, or `onBlur` validation modes, you must use the `useFormField` composable to add the necessary validation events.
  - `throttledFields`: `Partial<Record<ModelKey, number | true>>` (optional) - Fields to validate with throttling. It's an object where the key is the field name and the value is the throttle time in milliseconds or `true` for the default throttle time (1000ms).
  - `debouncedFields`: `Partial<Record<ModelKey, number | true>>` (optional) - Fields to validate with debouncing. It's an object where the key is the field name and the value is the debounce time in milliseconds or `true` for the default debounce time (300ms).
  - `scrollToErrorSelector`: `string` (optional) - CSS selector for scrolling to errors.

### Return

`useFormValidator` returns an object containing:

- `isDirty`: `ComputedRef<boolean>` - Indicates if the form has been modified.
- `isSubmitting`: `Ref<boolean>` - Indicates if the form is currently being submitted.
- `isSubmitted`: `Ref<boolean>` - Indicates if the form has been submitted.
- `isValid`: `ComputedRef<boolean>` - Indicates if the form is valid.
- `errors`: `ComputedRef<Record<ModelKey, ValidationIssues>>` - Validation errors for each field.
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

import { useFormValidator } from '@/composables/useFormValidator'

const schema = ref(
  object({
    name: pipe(string(), nonEmpty('Name is required')),
    age: pipe(string(), nonEmpty('Age is required')),
  }),
)

const { model, isValid, errors, handleSubmit, isSubmitting } = useFormValidator<{
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
    <span v-if="errors.name">{{ errors.name[0]?.message }}</span>

    <input v-model="model.age">
    <span v-if="errors.age">{{ errors.age[0]?.message }}</span>

    <button type="submit" :disabled="isSubmitting">
      Submit
    </button>
  </form>
</template>
```

## useFormField

> Before using `useFormField`, make sure you have initialized the form with `useFormValidator`.

`useFormField` is a composable for handling validation at the individual form field level.

### Parameters

- `name`: `ModelKey` - The name of the field in the validation schema.
- `options`: `FormFieldOptions<T>` (optional) - Field-specific options.
  - `defaultValue`: `FieldType` (optional) - The default value of the field.
  - `mode`: `Options['mode']` (optional) - The validation mode for the field.
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
import { useFormField } from '@/composables/useFormValidator'

const componentRef = ref<ComponentPublicInstance>()

const { value, errorMessage, isValid, validationEvents } = useFormField('name', {
  defaultValue: '',
  mode: 'eager',
  componentRef
})
</script>

<template>
  <AdsInput ref="componentRef" v-model="value" :error-message="errorMessage" />
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
