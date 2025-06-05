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

::: details How to get a typed model from schema?

To get a typed model from the Valibot schema, you can use the `InferFormValidatorSchema` helper.

```ts{14}
import { ref } from 'vue'
import { pipe, string, nonEmpty, number, minValue, maxValue, minLength } from 'valibot'
import { InferFormValidatorSchema } from 'maz-ui/composables'

const schema = ref({
  name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
  age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
  country: pipe(string('Country is required'), nonEmpty('Country is required')),
})

/**
 * { name: string, age: number, country: string }
 */
type Model = InferFormValidatorSchema<typeof schema>

const { model } = useFormValidator<Model>({
  schema,
})
```

:::

::: details How to bind validation events with useFormField for eager, blur, or progressive modes?

To use the `eager`, `blur`, or `progressive` validation modes, you must use the `useFormField` composable to add the necessary validation events.

3 ways to bind validation events:

##### 1. Use the `ref` attribute on the component to get the reference

You can use the `ref` attribute on the component and pass the reference to the `useFormField` composable.

This method will search HTML elements (input, select, and textarea) into the component and add the necessary validation events.

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

const { value, errorMessage, isValid, hasError } = useFormField('name', {
  ref: 'inputRef',
})
</script>
```

##### 2. Use the `v-bind` directive to bind the validation events

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

##### 3. Use the `onBlur` handler directly from `useFormField`

This method works if the component emits the `blur` event. Otherwise, use the first method.

```vue{7}
<template>
  <MazInput
    v-model="value"
    :hint="errorMessage"
    :error="hasError"
    :success="isValid"
    @blur="onBlur"
  />
</template>

<script setup lang="ts">
import { useFormField } from 'maz-ui/composables'

const { value, errorMessage, isValid, hasError, onBlur } = useFormField('name')
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

  <div class="maz-text-xs maz-p-2 maz-bg-color-light maz-rounded maz-mt-2">
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

  <script lang="ts" setup>
    import { ref } from 'vue'
    import { sleep } from 'maz-ui'
    import { useFormValidator, useToast, type InferFormValidatorSchema } from 'maz-ui/composables'
    import { string, nonEmpty, pipe, number, minValue, maxValue, boolean, literal, minLength } from 'valibot'

    const toast = useToast()

    const schema = ref({
      name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
      age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
      country: pipe(string('Country is required'), nonEmpty('Country is required')),
      agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
    })

    type Model = InferFormValidatorSchema<typeof schema>

    const { model, isSubmitting, handleSubmit, errorMessages, fieldsStates } = useFormValidator<Model>({
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
<template>
  <form @submit="onSubmit">
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
    <MazBtn type="submit" :loading="isSubmitting">
      Submit
    </MazBtn>
  </form>
</template>

<script setup lang="ts">
  import { sleep } from 'maz-ui'
  import { useFormValidator, useFormField, useToast, InferFormValidatorSchema } from 'maz-ui/composables'
  import { string, nonEmpty, pipe, number, minValue, maxValue, boolean, literal, minLength } from 'valibot'

  const schema = {
    name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
    age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
    country: pipe(string('Country is required'), nonEmpty('Country is required')),
    agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
  }

  type Model = InferFormValidatorSchema<typeof schema>

  const { isSubmitting, handleSubmit } = useFormValidator<Model>({
    schema,
    options: { mode: 'eager', scrollToError: '.has-error-form2', identifier: 'form-eager' },
  })

  const { value: name, hasError: hasErrorName, errorMessage: nameErrorMessage } = useFormField('name', { ref: 'nameRef', formIdentifier: 'form-eager' })
  const { value: age, hasError: hasErrorAge, errorMessage: ageErrorMessage } = useFormField('age', { ref: 'ageRef', formIdentifier: 'form-eager'  })
  const { value: agree, hasError: hasErrorAgree, errorMessage: agreeErrorMessage } = useFormField('agree', { ref: 'agreeRef', formIdentifier: 'form-eager'  })
  const { value: country, hasError: hasErrorCountry, errorMessage: countryErrorMessage, validationEvents } = useFormField('country', { mode: 'lazy', formIdentifier: 'form-eager'  })

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
      :class="{ 'has-error-progressive': !!countryErrorMessage }"
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
<template>
  <form @submit="onSubmit">
    <MazInput
      v-model="name"
      ref="nameRef"
      label="Enter your name"
      :hint="nameErrorMessage"
      :error="nameHasError"
      :class="{ 'has-error-progressive': nameHasError }"
    />
    <MazInput
      v-model="age"
      ref="ageRef"
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
      v-model="agree"
      ref="agreeRef"
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

<script setup lang="ts">
  import { sleep } from 'maz-ui'
  import { useFormValidator, useFormField, useToast, InferFormValidatorSchema } from 'maz-ui/composables'
  import { string, nonEmpty, pipe, number, minValue, maxValue, boolean, literal, minLength } from 'valibot'

  const schema =  {
    name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
    age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
    country: pipe(string('Country is required'), nonEmpty('Country is required')),
    agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
  }

  type Model = InferFormValidatorSchema<typeof schema>

  const { isSubmitting, handleSubmit } = useFormValidator<Model>({
    schema,
    options: { mode: 'progressive', scrollToError: '.has-error-progressive', identifier: 'form-progressive' },
  })

  const { value: name, hasError: nameHasError, errorMessage: nameErrorMessage } = useFormField('name', { ref: 'nameRef', formIdentifier: 'form-progressive' })
  const { value: age, hasError: ageHasError, errorMessage: ageErrorMessage } = useFormField('age', { ref: 'ageRef', formIdentifier: 'form-progressive'  })
  const { value: country, hasError: countryHasError, errorMessage: countryErrorMessage, validationEvents } = useFormField('country', { mode: 'lazy', formIdentifier: 'form-progressive'  })
  const { value: agree, hasError: agreeHasError, errorMessage: agreeErrorMessage } = useFormField('agree', { ref: 'agreeRef', formIdentifier: 'form-progressive'  })

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

```vue{36,37}
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

## useFormValidator

`useFormValidator` is the main composable for initializing form validation.

It accepts a validation schema, default values, and configuration options to handle form validation. You can also provide a model reference to bind the form data.

### Parameters ([FormValidatorOptions](#formvalidatoroptions))

`useFormValidator` accepts an object with the following properties:

- `schema`: `MaybeRef<FormSchema<Model>>` - The validation schema for the form.
- `model`: `Ref<Model>` (optional) - A reference to the form's data model.
- `defaultValues`: `Partial<Model>` (optional) - Default values for the form fields.
- `options`: `FormValidatorOptions` (optional) - Configuration options for the form validation behavior.
  - `mode`: `'eager' | 'lazy' | 'aggressive' | 'blur'`  (optional) - Form validation mode. (default: 'lazy') - To use the `eager` or `blur` validation modes, you must use the `useFormField` composable to add the necessary validation events. - [see validation modes](#introduction)
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
- `validateForm`: `(showErrors?: boolean) => Promise<boolean>` - Function to validate the entire form.
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

### Parameters ([FormFieldOptions](#formfieldoptions))

- `name`: `ModelKey` - The name of the field in the validation schema.
- `options`: `FormFieldOptions<T>` (optional) - Field-specific options.
  - `defaultValue`: `T` (optional) - The default value of the field.
  - `mode`: `'eager' | 'lazy' | 'aggressive' | 'blur' | 'progressive'` (optional) - The validation mode for the field - [see validation modes](#introduction)
  - `ref`: `string` (optional) - Reference to the component to associate and trigger validation events on HTML Form elements (input, select and textarea) - not necessary for `lazy`, `aggressive` validation modes
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
- `validationEvents`: `ComputedRef<{ onBlur?: () => void; }>` - Validation events to bind to the field. They are used to trigger field validation, to be used like this `v-bind="validationEvents"` (components must emit `blur` event to trigger field validation) - Not necessary for `lazy`, `aggressive` validation modes or if you use the component reference when initializing the composable.

## Types

### FormValidatorOptions

```ts
type FormValidatorOptions = {
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
type FormFieldOptions<T> = {
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
   * Reference to the component or HTML element to associate and trigger validation events
   * Necessary for 'eager', 'progressive' and 'blur' validation modes
   */
  ref?: string
  /**
   * Identifier for the form
   * Useful when you have multiple forms on the same component
   * Should be the same as the one used in `useFormValidator`
   */
  formIdentifier?: string | symbol
}
```

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useFormValidator } from 'maz-ui/src/composables/useFormValidator'
  import { useFormField } from 'maz-ui/src/composables/useFormField'
  import { useToast } from 'maz-ui/src/composables/useToast'
  import { sleep } from 'maz-ui'
  import { string, object, nonEmpty, pipe, number, minValue, maxValue, boolean, literal, minLength } from 'valibot'

  const toast = useToast()

  const schema = ref({
    name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
    age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
    country: pipe(string('Country is required'), nonEmpty('Country is required')),
    agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
  })

  const { model, isValid, isSubmitting, isDirty, isSubmitted, handleSubmit, errorMessages, fieldsStates } = useFormValidator<Model>({
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

  const { isValid: isValidEager, isSubmitting: isSubmittingEager, handleSubmit: handleSubmitEager } = useFormValidator<Model>({
    schema: {
      name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
      age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
      country: pipe(string('Country is required'), nonEmpty('Country is required')),
      agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
    },
    options: { mode: 'eager', scrollToError: '.has-error-form2', identifier: 'form-eager' },
  })

  const { value: name, hasError: hasErrorName, errorMessage: nameErrorMessage } = useFormField('name', { ref: 'nameRef', formIdentifier: 'form-eager' })
  const { value: age, hasError: hasErrorAge, errorMessage: ageErrorMessage } = useFormField('age', { ref: 'ageRef', formIdentifier: 'form-eager'  })
  const { value: country, hasError: hasErrorCountry, errorMessage: countryErrorMessage, validationEvents } = useFormField('country', { mode: 'lazy', formIdentifier: 'form-eager'  })
  const { value: agree, hasError: hasErrorAgree, errorMessage: agreeErrorMessage } = useFormField('agree', { ref: 'agreeRef', formIdentifier: 'form-eager'  })

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

  const { value: nameProgressive, isValid: nameValidProgressive, hasError: nameErrorProgressive, errorMessage: nameMessageProgressive } = useFormField('name', { ref: 'nameProgressiveRef', formIdentifier: 'form-progressive' })
  const { value: ageProgressive, isValid: ageValidProgressive, hasError: ageErrorProgressive, errorMessage: ageMessageProgressive } = useFormField('age', { ref: 'ageProgressiveRef', formIdentifier: 'form-progressive'  })
  const { value: countryProgressive, isValid: countryValidProgressive, hasError: countryErrorProgressive, errorMessage: countryMessageProgressive, validationEventsProgressive } = useFormField('country', { ref: 'countryProgressiveRef', formIdentifier: 'form-progressive' })
  const { value: agreeProgressive, isValid: agreeValidProgressive, hasError: agreeErrorProgressive, errorMessage: agreeMessageProgressive } = useFormField('agree', { ref: 'agreeProgressiveRef', formIdentifier: 'form-progressive'  })

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
</script>
