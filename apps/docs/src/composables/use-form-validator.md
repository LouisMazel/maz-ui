---
title: useFormValidator
description: Vue composables for form validation with Valibot - useFormValidator and useFormField provide a flexible and typed approach to handle form validation in your Vue applications.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Introduction

`useFormValidator` and `useFormField` are two Vue composables that work together to provide powerful form validation using [Valibot](https://valibot.dev/guides/introduction/).

- **useFormValidator**: Initializes form validation for your entire form. Use it in your form's parent component.
- **useFormField**: Manages individual field validation states. Use it when you need fine-grained control over a field or when fields are in child components.

**When to use each:**

| Composable | Use When |
|------------|----------|
| `useFormValidator` only | Simple forms where all fields are in the same component |
| `useFormValidator` + `useFormField` | Fields in child components, or when using `eager`, `blur`, or `progressive` validation modes |

## Quick Start

Here's the simplest form you can create with `useFormValidator`:

<ComponentDemo>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmitQuickStart">
    <MazInput
      v-model="quickStartModel.email"
      label="Email"
      type="email"
      :hint="quickStartErrors.email"
      :error="!!quickStartErrors.email"
      :success="quickStartStates.email.valid"
    />
    <MazInput
      v-model="quickStartModel.password"
      label="Password"
      type="password"
      :hint="quickStartErrors.password"
      :error="!!quickStartErrors.password"
      :success="quickStartStates.password.valid"
    />
    <MazBtn type="submit" :loading="quickStartSubmitting">
      Login
    </MazBtn>
  </form>

  <template #code>

```vue
<script lang="ts" setup>
import { useFormValidator } from 'maz-ui/composables'
import { pipe, string, email, nonEmpty, minLength } from 'valibot'

// 1. Define your validation schema
const schema = {
  email: pipe(string(), nonEmpty('Email is required'), email('Invalid email')),
  password: pipe(string(), nonEmpty('Password is required'), minLength(8, 'Min 8 characters')),
}

// 2. Initialize the form validator
const {
  model,           // Form data (reactive)
  errorMessages,   // First error message for each field
  fieldsStates,    // Detailed state of each field
  isSubmitting,    // Is the form being submitted?
  handleSubmit,    // Submit handler wrapper
} = useFormValidator({ schema })

// 3. Handle form submission
const onSubmit = handleSubmit((data) => {
  // Called only if the form is valid
  console.log('Form submitted:', data)
})
</script>

<template>
  <form @submit="onSubmit">
    <MazInput
      v-model="model.email"
      label="Email"
      :hint="errorMessages.email"
      :error="!!errorMessages.email"
      :success="fieldsStates.email.valid"
    />
    <MazInput
      v-model="model.password"
      label="Password"
      type="password"
      :hint="errorMessages.password"
      :error="!!errorMessages.password"
      :success="fieldsStates.password.valid"
    />
    <MazBtn type="submit" :loading="isSubmitting">
      Login
    </MazBtn>
  </form>
</template>
```

  </template>
</ComponentDemo>

## Understanding Form State

`useFormValidator` returns several reactive values to help you manage your form:

| Property | Type | Description |
|----------|------|-------------|
| `model` | `Ref<Model>` | The form data object - bind this to your inputs with `v-model` |
| `isValid` | `ComputedRef<boolean>` | `true` when all fields pass validation |
| `isDirty` | `ComputedRef<boolean>` | `true` when any field has been modified from its initial value |
| `isSubmitting` | `Ref<boolean>` | `true` while the form is being submitted |
| `isSubmitted` | `Ref<boolean>` | `true` after the form has been submitted at least once |
| `errorMessages` | `ComputedRef<Record<string, string>>` | The first error message for each field (if any) |
| `errors` | `ComputedRef<Record<string, ValidationIssues>>` | All validation issues for each field |
| `fieldsStates` | `Ref<FieldsStates>` | Detailed state object for each field |
| `handleSubmit` | `Function` | Wrapper function for form submission |
| `validateForm` | `Function` | Manually trigger form validation |
| `resetForm` | `Function` | Reset the form to its initial state |
| `scrollToError` | `Function` | Scroll to the first field with an error |

### Field States

Each field in `fieldsStates` contains:

| Property | Type | Description |
|----------|------|-------------|
| `valid` | `boolean` | Field passes validation |
| `error` | `boolean` | Field has an error that should be displayed |
| `errors` | `ValidationIssues` | Array of all validation issues |
| `dirty` | `boolean` | Field value differs from initial value |
| `blurred` | `boolean` | Field has lost focus at least once |
| `validated` | `boolean` | Validation has run at least once |
| `validating` | `boolean` | Async validation is in progress |

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4">
    <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmitState">
      <MazInput
        v-model="stateModel.name"
        label="Name (min 3 characters)"
        :hint="stateErrors.name"
        :error="!!stateErrors.name"
        :success="stateFields.name.valid"
      />
      <MazInput
        v-model="stateModel.age"
        label="Age (18-100)"
        type="number"
        :hint="stateErrors.age"s
        :error="!!stateErrors.age"
        :success="stateFields.age.valid"
      />
      <MazBtn type="submit">Submit</MazBtn>
    </form>
    <div class="maz-rounded">
      <p class="maz-font-semibold maz-mb-2">Form State:</p>
      <pre class="maz-text-xs maz-bg-surface-600/70 dark:maz-bg-surface-600/60 maz-p-2 maz-rounded">{{ JSON.stringify({ isValid: stateValid, isDirty: stateDirty, isSubmitted: stateSubmitted, isSubmitting: stateSubmitting }, null, 2) }}</pre>
      <p class="maz-font-semibold maz-mb-2 maz-mt-4">Fields States:</p>
      <pre class="maz-text-xs maz-bg-surface-600/70 dark:maz-bg-surface-600/60 maz-p-2 maz-rounded">{{ JSON.stringify(stateFields, null, 2) }}</pre>
    </div>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { useFormValidator } from 'maz-ui/composables'
import { pipe, string, number, nonEmpty, minLength, minValue, maxValue } from 'valibot'

const schema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  age: pipe(number(), minValue(18, 'Min 18'), maxValue(100, 'Max 100')),
}

const {
  model,
  errorMessages,
  fieldsStates,
  isValid,
  isDirty,
  isSubmitted,
  handleSubmit,
} = useFormValidator({ schema })

const onSubmit = handleSubmit((data) => {
  console.log('Submitted:', data)
})
</script>

<template>
  <form @submit="onSubmit">
    <MazInput v-model="model.name" label="Name" />
    <MazInput v-model="model.age" label="Age" type="number" />
    <MazBtn type="submit">Submit</MazBtn>
  </form>

  <!-- Debug panel -->
  <pre>{{ { isValid, isDirty, isSubmitted } }}</pre>
  <pre>{{ fieldsStates }}</pre>
</template>
```

  </template>
</ComponentDemo>

## Validation Modes

Validation modes control **when** validation runs and **when** errors are displayed. Choose the mode that best fits your UX needs.

| Mode | Validates On | Shows Errors | Best For |
|------|--------------|--------------|----------|
| `lazy` (default) | Value change | After change (if not empty) | Simple forms |
| `aggressive` | Immediately + every change | Always | Real-time feedback |
| `eager` | Blur, then on change | After first blur | Better UX |
| `blur` | Only on blur | After blur | Minimal interruption |
| `progressive` | Silently, shows on blur if invalid | After blur or validation | Optimal UX |

::: tip
For `eager`, `blur`, and `progressive` modes, you must use `useFormField` with the `ref` option or `validationEvents` to capture blur events.
:::

### Lazy Mode (Default)

The default mode. Validates when field values change. Errors only appear if the field is not empty.

<ComponentDemo>
  <div class="maz-mb-4">
    <p class="maz-text-sm maz-text-muted">Type in the field and clear it - notice the error appears only when there's content.</p>
  </div>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmitLazy">
    <MazInput
      v-model="lazyModel.name"
      label="Name (min 3 characters)"
      :hint="lazyErrors.name"
      :error="!!lazyErrors.name"
      :success="lazyStates.name.valid"
      :class="{ 'has-error-lazy': !!lazyErrors.name }"
    />
    <MazInput
      v-model="lazyModel.email"
      label="Email"
      type="email"
      :hint="lazyErrors.email"
      :error="!!lazyErrors.email"
      :success="lazyStates.email.valid"
      :class="{ 'has-error-lazy': !!lazyErrors.email }"
    />
    <MazBtn type="submit" :loading="lazySubmitting">Submit</MazBtn>
  </form>

  <template #code>

```vue
<script lang="ts" setup>
import { useFormValidator } from 'maz-ui/composables'
import { pipe, string, email, nonEmpty, minLength } from 'valibot'

const schema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  email: pipe(string(), nonEmpty('Required'), email('Invalid email')),
}

const { model, errorMessages, fieldsStates, isSubmitting, handleSubmit } = useFormValidator({
  schema,
  options: {
    mode: 'lazy', // This is the default
    scrollToError: '.has-error-lazy',
  },
})

const onSubmit = handleSubmit((data) => {
  console.log('Submitted:', data)
})
</script>
```

  </template>
</ComponentDemo>

### Aggressive Mode

Validates all fields immediately when the form is created and on every change. Errors are always displayed.

<ComponentDemo>
  <div class="maz-mb-4">
    <p class="maz-text-sm maz-text-muted">Notice all fields show errors immediately, even before any interaction.</p>
  </div>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmitAggressive">
    <MazInput
      v-model="aggressiveModel.name"
      label="Name (min 3 characters)"
      :hint="aggressiveErrors.name"
      :error="!!aggressiveErrors.name"
      :success="aggressiveStates.name.valid"
    />
    <MazInput
      v-model="aggressiveModel.email"
      label="Email"
      type="email"
      :hint="aggressiveErrors.email"
      :error="!!aggressiveErrors.email"
      :success="aggressiveStates.email.valid"
    />
    <MazBtn type="submit" :loading="aggressiveSubmitting">Submit</MazBtn>
  </form>

  <template #code>

```vue
<script lang="ts" setup>
import { useFormValidator } from 'maz-ui/composables'
import { pipe, string, email, nonEmpty, minLength } from 'valibot'

const schema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  email: pipe(string(), nonEmpty('Required'), email('Invalid email')),
}

const { model, errorMessages, fieldsStates, isSubmitting, handleSubmit } = useFormValidator({
  schema,
  options: {
    mode: 'aggressive', // Validates immediately
  },
})
</script>
```

  </template>
</ComponentDemo>

### Eager Mode (Recommended)

Validates on blur first (if the field is not empty), then on every change. This provides a good balance between immediate feedback and not overwhelming the user.

::: warning
Requires `useFormField` with `ref` option or `validationEvents`.
:::

<ComponentDemo>
  <div class="maz-mb-4">
    <p class="maz-text-sm maz-text-muted">Type something, then click outside the field (blur) to see validation. After that, errors update as you type.</p>
  </div>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmitEager">
    <MazInput
      ref="eagerNameRef"
      v-model="eagerName"
      label="Name (min 3 characters)"
      :hint="eagerNameError"
      :error="eagerNameHasError"
      :success="eagerNameValid"
      :class="{ 'has-error-eager': eagerNameHasError }"
    />
    <MazInput
      ref="eagerEmailRef"
      v-model="eagerEmail"
      label="Email"
      type="email"
      :hint="eagerEmailError"
      :error="eagerEmailHasError"
      :success="eagerEmailValid"
      :class="{ 'has-error-eager': eagerEmailHasError }"
    />
    <MazBtn type="submit" :loading="eagerSubmitting">Submit</MazBtn>
  </form>

  <template #code>

```vue
<script lang="ts" setup>
import { useFormValidator, useFormField } from 'maz-ui/composables'
import { pipe, string, email, nonEmpty, minLength } from 'valibot'
import { useTemplateRef } from 'vue'

const schema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  email: pipe(string(), nonEmpty('Required'), email('Invalid email')),
}

const { isSubmitting, handleSubmit } = useFormValidator({
  schema,
  options: {
    mode: 'eager',
    scrollToError: '.has-error-eager',
    identifier: 'form-eager',
  },
})

// useFormField for each field with ref for blur detection
const {
  value: name,
  hasError: nameHasError,
  errorMessage: nameError,
  isValid: nameValid,
} = useFormField<string>('name', {
  ref: useTemplateRef('nameRef'),
  formIdentifier: 'form-eager',
})

const {
  value: email,
  hasError: emailHasError,
  errorMessage: emailError,
  isValid: emailValid,
} = useFormField<string>('email', {
  ref: useTemplateRef('emailRef'),
  formIdentifier: 'form-eager',
})
</script>

<template>
  <form @submit="handleSubmit(onSubmit)">
    <MazInput
      ref="nameRef"
      v-model="name"
      label="Name"
      :hint="nameError"
      :error="nameHasError"
      :success="nameValid"
    />
    <MazInput
      ref="emailRef"
      v-model="email"
      label="Email"
      :hint="emailError"
      :error="emailHasError"
      :success="emailValid"
    />
  </form>
</template>
```

  </template>
</ComponentDemo>

### Blur Mode

::: warning
Requires `useFormField` with `ref` option or `validationEvents`.
:::

Validates only when the field loses focus. Errors are only shown after blur.

<ComponentDemo>
  <div class="maz-mb-4">
    <p class="maz-text-sm maz-text-muted">Type in the field, then click outside. Errors only appear after blur, and don't update while typing.</p>
  </div>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmitBlur">
    <MazInput
      ref="blurNameRef"
      v-model="blurName"
      label="Name (min 3 characters)"
      :hint="blurNameError"
      :error="blurNameHasError"
      :success="blurNameValid"
      :class="{ 'has-error-blur': blurNameHasError }"
    />
    <MazInput
      ref="blurEmailRef"
      v-model="blurEmail"
      label="Email"
      type="email"
      :hint="blurEmailError"
      :error="blurEmailHasError"
      :success="blurEmailValid"
      :class="{ 'has-error-blur': blurEmailHasError }"
    />
    <MazBtn type="submit" :loading="blurSubmitting">Submit</MazBtn>
  </form>

  <template #code>

```vue
<script lang="ts" setup>
import { useFormValidator, useFormField } from 'maz-ui/composables'
import { pipe, string, email, nonEmpty, minLength } from 'valibot'
import { useTemplateRef } from 'vue'

const schema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  email: pipe(string(), nonEmpty('Required'), email('Invalid email')),
}

const { isSubmitting, handleSubmit } = useFormValidator({
  schema,
  options: {
    mode: 'blur',
    identifier: 'form-blur',
  },
})

const { value: name, hasError, errorMessage, isValid } = useFormField<string>('name', {
  ref: useTemplateRef('nameRef'),
  formIdentifier: 'form-blur',
})

const { value: email, hasError: emailHasError, errorMessage: emailError, isValid: emailValid } = useFormField<string>('email', {
  ref: useTemplateRef('emailRef'),
  formIdentifier: 'form-blur',
})
</script>
```

  </template>
</ComponentDemo>

### Progressive Mode

::: warning
Requires `useFormField` with `ref` option or `validationEvents`.
:::

The most user-friendly mode. Validates silently in the background. Shows errors only on blur if the field is invalid. Once valid, it stays valid until it becomes invalid again.

<ComponentDemo>
  <div class="maz-mb-4">
    <p class="maz-text-sm maz-text-muted">Start typing - the field becomes valid (green) as soon as validation passes. Errors only show after blur.</p>
  </div>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmitProgressive">
    <MazInput
      ref="progressiveNameRef"
      v-model="progressiveName"
      label="Name (min 3 characters)"
      :hint="progressiveNameError"
      :error="progressiveNameHasError"
      :success="progressiveNameValid"
      :class="{ 'has-error-progressive': progressiveNameHasError }"
    />
    <MazInput
      ref="progressiveEmailRef"
      v-model="progressiveEmail"
      label="Email"
      type="email"
      :hint="progressiveEmailError"
      :error="progressiveEmailHasError"
      :success="progressiveEmailValid"
      :class="{ 'has-error-progressive': progressiveEmailHasError }"
    />
    <MazCheckbox
      ref="progressiveAgreeRef"
      v-model="progressiveAgree"
      :hint="progressiveAgreeError"
      :error="progressiveAgreeHasError"
      :class="{ 'has-error-progressive': progressiveAgreeHasError }"
    >
      I agree to the terms and conditions
    </MazCheckbox>
    <MazBtn type="submit" :loading="progressiveSubmitting">Submit</MazBtn>
  </form>

  <template #code>

```vue
<script lang="ts" setup>
import { useFormValidator, useFormField } from 'maz-ui/composables'
import { pipe, string, email, nonEmpty, minLength, boolean, literal } from 'valibot'
import { useTemplateRef } from 'vue'

const schema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  email: pipe(string(), nonEmpty('Required'), email('Invalid email')),
  agree: pipe(boolean(), literal(true, 'You must agree')),
}

const { isSubmitting, handleSubmit } = useFormValidator({
  schema,
  options: {
    mode: 'progressive',
    identifier: 'form-progressive',
  },
})

const { value: name, hasError, errorMessage, isValid } = useFormField<string>('name', {
  ref: useTemplateRef('nameRef'),
  formIdentifier: 'form-progressive',
})
// ... same for other fields
</script>
```

  </template>
</ComponentDemo>

## useFormField for Child Components

`useFormField` is essential when:
1. Your form fields are in child components
2. You need the `eager`, `blur`, or `progressive` validation modes
3. You want fine-grained control over individual field states

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `value` | `WritableComputedRef<T>` | The field value (use with `v-model`) |
| `hasError` | `ComputedRef<boolean>` | Field has an error that should be displayed |
| `errors` | `ComputedRef<ValidationIssues>` | All validation issues |
| `errorMessage` | `ComputedRef<string>` | First error message |
| `isValid` | `ComputedRef<boolean>` | Field passes validation |
| `isDirty` | `ComputedRef<boolean>` | Field has been modified |
| `isBlurred` | `ComputedRef<boolean>` | Field has lost focus |
| `isValidated` | `ComputedRef<boolean>` | Validation has run |
| `isValidating` | `ComputedRef<boolean>` | Async validation in progress |
| `mode` | `ComputedRef<string>` | The validation mode |
| `validationEvents` | `ComputedRef<object>` | Blur event handler for `v-bind` |

### Two Ways to Bind Validation Events

#### Option 1: Using `ref` (Recommended)

Pass a template ref to `useFormField`. It will automatically detect interactive elements and attach blur listeners.

```vue
<script setup>
import { useFormField } from 'maz-ui/composables'
import { useTemplateRef } from 'vue'

const { value, errorMessage, hasError } = useFormField<string>('email', {
  ref: useTemplateRef('emailRef'),
  formIdentifier: 'my-form',
})
</script>

<template>
  <MazInput
    ref="emailRef"
    v-model="value"
    :hint="errorMessage"
    :error="hasError"
  />
</template>
```

#### Option 2: Using `validationEvents`

If your component emits a `blur` event, you can use `v-bind` with `validationEvents`.

```vue
<script setup>
import { useFormField } from 'maz-ui/composables'

const { value, errorMessage, hasError, validationEvents } = useFormField<string>('email', {
  formIdentifier: 'my-form',
})
</script>

<template>
  <MazInput
    v-model="value"
    v-bind="validationEvents"
    :hint="errorMessage"
    :error="hasError"
  />
</template>
```

## TypeScript Type Inference

The form model is automatically typed based on your schema:

```ts
const schema = {
  name: pipe(string(), nonEmpty()),
  age: pipe(number(), minValue(0)),
  email: pipe(string(), email()),
}

const { model } = useFormValidator({ schema })
// model.value is typed as: { name?: string, age?: number, email?: string }
```

For `useFormField`, specify the field type as a generic parameter:

```ts
// Specify the type for better type safety
const { value } = useFormField<string>('name', { formIdentifier: 'my-form' })
// value is typed as WritableComputedRef<string>
```

::: warning Common TypeScript Errors
If you get circular reference errors with `useTemplateRef`, use the classic `ref()` instead:

```ts
// May cause TypeScript errors
const { value: email } = useFormField<string>('email', {
  ref: useTemplateRef('emailRef'),
})

// Solution 1: Add generic to useTemplateRef
const { value: email } = useFormField<string>('email', {
  ref: useTemplateRef<HTMLInputElement>('emailRef'),
})

// Solution 2: Use classic ref
const emailRef = ref<HTMLInputElement>()
const { value: email } = useFormField<string>('email', {
  ref: emailRef,
})
```

:::

## Async Validation

Use Valibot's `pipeAsync` and `checkAsync` for async validations like checking username availability:

<ComponentDemo>
  <div class="maz-mb-4">
    <p class="maz-text-sm maz-text-muted">Try typing "taken" - the async validator will reject it after a 2-second delay.</p>
  </div>
  <form class="maz-flex maz-gap-4" @submit="onSubmitAsync">
    <MazInput
      ref="asyncUsernameRef"
      v-model="asyncUsername"
      label="Username"
      :hint="asyncUsernameError"
      :error="asyncUsernameHasError"
      :success="asyncUsernameValid"
      :loading="asyncUsernameValidating"
      class="maz-flex-1"
    />
    <MazBtn type="submit" :loading="asyncSubmitting">Submit</MazBtn>
  </form>

  <template #code>

```vue
<script lang="ts" setup>
import { useFormValidator, useFormField } from 'maz-ui/composables'
import { pipeAsync, string, nonEmpty, minLength, checkAsync } from 'valibot'
import { useTemplateRef } from 'vue'

const schema = {
  username: pipeAsync(
    string(),
    nonEmpty('Username is required'),
    minLength(3, 'Min 3 characters'),
    checkAsync(async (value) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      return value !== 'taken' // Return true if valid
    }, 'Username is already taken'),
  ),
}

const { isSubmitting, handleSubmit } = useFormValidator({
  schema,
  options: { mode: 'eager', identifier: 'form-async' },
})

const {
  value: username,
  hasError,
  errorMessage,
  isValid,
  isValidating, // Shows loading state during async validation
} = useFormField<string>('username', {
  ref: useTemplateRef('usernameRef'),
  formIdentifier: 'form-async',
})
</script>

<template>
  <MazInput
    ref="usernameRef"
    v-model="username"
    :hint="errorMessage"
    :error="hasError"
    :success="isValid"
    :loading="isValidating"
  />
</template>
```

  </template>
</ComponentDemo>

## Throttling and Debouncing

For expensive validations (like API calls), use throttling or debouncing to limit how often validation runs.

| Option | Behavior | Default Time | Use Case |
|--------|----------|--------------|----------|
| `debouncedFields` | Waits until user stops typing | 300ms | Search fields, API calls |
| `throttledFields` | Runs at most once per interval | 1000ms | Rate-limited APIs |

<ComponentDemo>
  <div class="maz-mb-4">
    <p class="maz-text-sm maz-text-muted">Name has 500ms debounce, Age has 1000ms throttle. Watch the console to see validation timing.</p>
  </div>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmitDebounced">
    <MazInput
      v-model="debouncedModel.name"
      label="Name (debounced 500ms)"
      :hint="debouncedErrors.name"
      :error="debouncedStates.name.error"
      :success="debouncedStates.name.valid"
    />
    <MazInput
      v-model="debouncedModel.age"
      label="Age (throttled 1000ms)"
      type="number"
      :hint="debouncedErrors.age"
      :error="debouncedStates.age.error"
      :success="debouncedStates.age.valid"
    />
    <MazBtn type="submit" :loading="debouncedSubmitting">Submit</MazBtn>
  </form>

  <template #code>

```vue
<script lang="ts" setup>
import { useFormValidator } from 'maz-ui/composables'
import { pipe, string, number, nonEmpty, minLength, minValue } from 'valibot'

const schema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  age: pipe(number('Must be a number'), minValue(18, 'Must be 18+')),
}

const { model, errorMessages, fieldsStates, isSubmitting, handleSubmit } = useFormValidator({
  schema,
  options: {
    debouncedFields: { name: 500 },   // Wait 500ms after typing stops
    throttledFields: { age: 1000 },   // Validate at most every 1000ms
    // Use `true` for default times: debouncedFields: { name: true } // 300ms
  },
})
</script>
```

  </template>
</ComponentDemo>

## Reset Form

Use `resetForm()` to reset the form to its initial state, or set `resetOnSuccess` to automatically reset after successful submission.

<ComponentDemo>
  <form class="maz-flex maz-flex-col maz-gap-4" @submit="onSubmitReset">
    <MazInput
      v-model="resetModel.name"
      label="Name"
      :hint="resetErrors.name"
      :error="resetStates.name.error"
      :success="resetStates.name.valid"
    />
    <MazInput
      v-model="resetModel.age"
      label="Age"
      type="number"
      :hint="resetErrors.age"
      :error="resetStates.age.error"
      :success="resetStates.age.valid"
    />
    <div class="maz-flex maz-gap-2">
      <MazBtn type="submit" :loading="resetSubmitting">Submit</MazBtn>
      <MazBtn type="button" color="danger" @click="resetFormFn">Reset</MazBtn>
    </div>
  </form>

  <template #code>

```vue
<script lang="ts" setup>
import { useFormValidator } from 'maz-ui/composables'
import { pipe, string, number, nonEmpty, minLength, minValue } from 'valibot'

const schema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  age: pipe(number(), minValue(18, 'Must be 18+')),
}

const { model, errorMessages, fieldsStates, isSubmitting, handleSubmit, resetForm } = useFormValidator({
  schema,
  defaultValues: { name: 'John', age: 25 },
  options: {
    resetOnSuccess: true, // Auto-reset after successful submission (default: true)
  },
})

const onSubmit = handleSubmit((data) => {
  console.log('Submitted:', data)
  // Form will auto-reset because resetOnSuccess: true
})

// Manual reset
function handleReset() {
  resetForm()
}
</script>
```

  </template>
</ComponentDemo>

## Multiple Forms on Same Page

Use the `identifier` option to have multiple independent forms on the same page. Make sure to match the identifier in both `useFormValidator` and `useFormField`.

```vue
<script lang="ts" setup>
import { useFormValidator, useFormField } from 'maz-ui/composables'

// Form 1
const form1 = useFormValidator({
  schema: schema1,
  options: { identifier: 'login-form' },
})

// Form 2
const form2 = useFormValidator({
  schema: schema2,
  options: { identifier: 'register-form' },
})

// useFormField must use matching identifier
const { value: loginEmail } = useFormField<string>('email', {
  formIdentifier: 'login-form',
})

const { value: registerEmail } = useFormField<string>('email', {
  formIdentifier: 'register-form',
})
</script>
```

## Error Handling and scrollToError

### scrollToError

Automatically scroll to the first field with an error when validation fails:

```ts
const { handleSubmit } = useFormValidator({
  schema,
  options: {
    scrollToError: '.has-error', // CSS selector for error elements
    // scrollToError: false,     // Disable scrolling
  },
})
```

Add the matching class to your fields:

```html
<MazInput
  :class="{ 'has-error': hasError }"
  :error="hasError"
/>
```

### onError Callback

Handle validation failures with the `onError` callback:

```ts
const onSubmit = handleSubmit(
  (data) => {
    // Success callback
    console.log('Valid:', data)
  },
  '.has-error', // scrollToError selector (optional)
  {
    onError: ({ model, errorMessages, errors }) => {
      // Called when validation fails
      console.log('Validation failed:', errorMessages)
    },
  }
)
```

## Performance & Best Practices

### Performance Tips

1. **Use throttling/debouncing** for expensive validations (API calls, complex logic)
2. **Prefer `eager` or `progressive` modes** over `aggressive` for better performance
3. **Use `lazy` mode** for simple forms with minimal validation
4. **Avoid `aggressive` mode on large forms** - it validates every field on every change

### Common Patterns

#### Multiple Forms with Identifiers

```ts
const { handleSubmit } = useFormValidator({
  schema,
  options: { identifier: 'my-unique-form' },
})

const { value } = useFormField<string>('email', {
  formIdentifier: 'my-unique-form', // Must match!
})
```

#### Custom Interactive Elements

If your custom component isn't detected for blur events, add `data-interactive`:

```vue
<div data-interactive class="custom-input" tabindex="0">
  Custom Input
</div>
```

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Mismatched `formIdentifier` | Ensure `useFormField`'s `formIdentifier` matches `useFormValidator`'s `identifier` |
| Validation not triggering in eager/blur/progressive modes | Use `ref` option or `v-bind="validationEvents"` |
| TypeScript errors with `useTemplateRef` | Add generic type or use classic `ref()` |
| Field not found warning | Make sure the field name exists in your schema |

## API Reference

### useFormValidator

#### Parameters

```ts
useFormValidator<TSchema>({
  schema: TSchema,                                    // Valibot validation schema (required)
  model?: Ref<Model>,                                 // External model ref (optional)
  defaultValues?: DeepPartial<Model>,                 // Initial values (optional)
  options?: {
    mode?: 'lazy' | 'aggressive' | 'eager' | 'blur' | 'progressive', // Default: 'lazy'
    throttledFields?: Record<string, number | true>,  // Fields to throttle
    debouncedFields?: Record<string, number | true>,  // Fields to debounce
    scrollToError?: string | false,                   // CSS selector, default: '.has-field-error'
    identifier?: string | symbol,                     // Form identifier, default: 'main-form-validator'
    resetOnSuccess?: boolean,                         // Reset after submit, default: true
  }
})
```

#### Return Values

```ts
{
  identifier: string | symbol
  model: Ref<Model>
  isValid: ComputedRef<boolean>
  isDirty: ComputedRef<boolean>
  isSubmitting: Ref<boolean>
  isSubmitted: Ref<boolean>
  errors: ComputedRef<Record<string, ValidationIssues>>
  errorMessages: ComputedRef<Record<string, string | undefined>>
  fieldsStates: Ref<FieldsStates<Model>>
  validateForm: (setErrors?: boolean) => Promise<void[]>
  scrollToError: (selector?: string) => void
  resetForm: () => void
  handleSubmit: <Func>(
    successCallback: Func,
    scrollToError?: string | false,
    options?: { onError?: Function, resetOnSuccess?: boolean }
  ) => (event?: Event) => Promise<ReturnType<Func>>
}
```

### useFormField

#### Parameters

```ts
useFormField<FieldType>(
  name: string,                                      // Field name in schema (required)
  options?: {
    defaultValue?: FieldType,                         // Default value for this field
    mode?: 'lazy' | 'aggressive' | 'eager' | 'blur' | 'progressive', // Override form mode
    ref?: Ref<HTMLElement | ComponentInstance>,       // Template ref for blur detection
    formIdentifier?: string | symbol,                 // Must match useFormValidator's identifier
  }
)
```

#### Return Values

```ts
{
  value: WritableComputedRef<FieldType>
  hasError: ComputedRef<boolean>
  errors: ComputedRef<ValidationIssues>
  errorMessage: ComputedRef<string | undefined>
  isValid: ComputedRef<boolean>
  isDirty: ComputedRef<boolean>
  isBlurred: ComputedRef<boolean>
  isValidated: ComputedRef<boolean>
  isValidating: ComputedRef<boolean>
  mode: ComputedRef<string | undefined>
  validationEvents: ComputedRef<{ onBlur?: () => void }>
}
```

### Types

```ts
interface FormValidatorOptions<Model> {
  mode?: 'eager' | 'lazy' | 'aggressive' | 'blur' | 'progressive'
  throttledFields?: Partial<Record<keyof Model, number | true>>
  debouncedFields?: Partial<Record<keyof Model, number | true>>
  scrollToError?: string | false
  identifier?: string | symbol
  resetOnSuccess?: boolean
}

interface FormFieldOptions<FieldType> {
  defaultValue?: FieldType
  mode?: 'eager' | 'lazy' | 'aggressive' | 'blur' | 'progressive'
  ref?: Ref<HTMLElement | ComponentInstance>
  formIdentifier?: string | symbol
}

interface FieldState<FieldType> {
  valid: boolean
  error: boolean
  errors: ValidationIssues
  dirty: boolean
  blurred: boolean
  validated: boolean
  validating: boolean
  initialValue?: Readonly<FieldType>
  mode?: string
}
```

## Troubleshooting

### Type Errors with useTemplateRef

**Problem**: TypeScript circular reference errors when using `useTemplateRef`

**Solutions**:

```ts
// Solution 1: Add generic type
const { value } = useFormField<string>('email', {
  ref: useTemplateRef<HTMLInputElement>('emailRef'),
})

// Solution 2: Use classic ref
const emailRef = ref<HTMLInputElement>()
const { value } = useFormField<string>('email', { ref: emailRef })
```

### Validation Not Triggering

**Problem**: `eager`, `blur`, or `progressive` mode not validating

**Solution**: These modes require blur event detection. Use either:

```ts
// Option 1: ref option
const { value } = useFormField<string>('name', {
  ref: useTemplateRef('inputRef'),
})

// Option 2: validationEvents
const { value, validationEvents } = useFormField<string>('name')
// Then: v-bind="validationEvents" on your input
```

### Element Not Found Warning

**Problem**: `No element found for ref in field 'name'`

**Solutions**:
1. Ensure the ref is bound to an HTML element or Vue component
2. Make sure the component has a `$el` property
3. For custom components, add `data-interactive` attribute

### Mismatched Form Identifiers

**Problem**: `useFormField` not finding the form context

**Solution**: Ensure identifiers match:

```ts
// In parent
const { handleSubmit } = useFormValidator({
  schema,
  options: { identifier: 'my-form' }, // This identifier...
})

// In child
const { value } = useFormField<string>('email', {
  formIdentifier: 'my-form', // ...must match this one
})
```

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue'
import { useFormValidator } from 'maz-ui/src/composables/useFormValidator'
import { useFormField } from 'maz-ui/src/composables/useFormField'
import { useToast } from 'maz-ui/src/composables/useToast'
import { sleep } from '@maz-ui/utils'
import {
  string,
  nonEmpty,
  pipe,
  number,
  minValue,
  maxValue,
  boolean,
  literal,
  minLength,
  email,
  pipeAsync,
  checkAsync,
} from 'valibot'

const toast = useToast()

// Quick Start Demo
const quickStartSchema = {
  email: pipe(string(), nonEmpty('Email is required'), email('Invalid email')),
  password: pipe(string(), nonEmpty('Password is required'), minLength(8, 'Min 8 characters')),
}

const {
  model: quickStartModel,
  errorMessages: quickStartErrors,
  fieldsStates: quickStartStates,
  isSubmitting: quickStartSubmitting,
  handleSubmit: handleQuickStart,
} = useFormValidator({ schema: quickStartSchema })

const onSubmitQuickStart = handleQuickStart(async () => {
  await sleep(1000)
  toast.success('Login successful!', { position: 'top' })
})

// Form State Demo
const stateSchema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  age: pipe(number('Must be a number'), minValue(18, 'Min 18'), maxValue(100, 'Max 100')),
}

const {
  model: stateModel,
  errorMessages: stateErrors,
  fieldsStates: stateFields,
  isValid: stateValid,
  isDirty: stateDirty,
  isSubmitted: stateSubmitted,
  isSubmitting: stateSubmitting,
  handleSubmit: handleState,
} = useFormValidator({ schema: stateSchema })

const onSubmitState = handleState(() => {
  toast.success('Submitted!', { position: 'top' })
})

// Lazy Mode Demo
const lazySchema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  email: pipe(string(), nonEmpty('Required'), email('Invalid email')),
}

const {
  model: lazyModel,
  errorMessages: lazyErrors,
  fieldsStates: lazyStates,
  isSubmitting: lazySubmitting,
  handleSubmit: handleLazy,
} = useFormValidator({
  schema: lazySchema,
  options: { mode: 'lazy', scrollToError: '.has-error-lazy' },
})

const onSubmitLazy = handleLazy(async () => {
  await sleep(1000)
  toast.success('Submitted!', { position: 'top' })
})

// Aggressive Mode Demo
const aggressiveSchema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  email: pipe(string(), nonEmpty('Required'), email('Invalid email')),
}

const {
  model: aggressiveModel,
  errorMessages: aggressiveErrors,
  fieldsStates: aggressiveStates,
  isSubmitting: aggressiveSubmitting,
  handleSubmit: handleAggressive,
} = useFormValidator({
  schema: aggressiveSchema,
  options: { mode: 'aggressive' },
})

const onSubmitAggressive = handleAggressive(async () => {
  await sleep(1000)
  toast.success('Submitted!', { position: 'top' })
})

// Eager Mode Demo
const eagerSchema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  email: pipe(string(), nonEmpty('Required'), email('Invalid email')),
}

const {
  isSubmitting: eagerSubmitting,
  handleSubmit: handleEager,
} = useFormValidator({
  schema: eagerSchema,
  options: { mode: 'eager', scrollToError: '.has-error-eager', identifier: 'form-eager' },
})

const {
  value: eagerName,
  hasError: eagerNameHasError,
  errorMessage: eagerNameError,
  isValid: eagerNameValid,
} = useFormField<string>('name', {
  ref: useTemplateRef<HTMLInputElement>('eagerNameRef'),
  formIdentifier: 'form-eager',
})

const {
  value: eagerEmail,
  hasError: eagerEmailHasError,
  errorMessage: eagerEmailError,
  isValid: eagerEmailValid,
} = useFormField<string>('email', {
  ref: useTemplateRef<HTMLInputElement>('eagerEmailRef'),
  formIdentifier: 'form-eager',
})

const onSubmitEager = handleEager(async () => {
  await sleep(1000)
  toast.success('Submitted!', { position: 'top' })
})

// Blur Mode Demo
const blurSchema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  email: pipe(string(), nonEmpty('Required'), email('Invalid email')),
}

const {
  isSubmitting: blurSubmitting,
  handleSubmit: handleBlur,
} = useFormValidator({
  schema: blurSchema,
  options: { mode: 'blur', scrollToError: '.has-error-blur', identifier: 'form-blur' },
})

const {
  value: blurName,
  hasError: blurNameHasError,
  errorMessage: blurNameError,
  isValid: blurNameValid,
} = useFormField<string>('name', {
  ref: useTemplateRef<HTMLInputElement>('blurNameRef'),
  formIdentifier: 'form-blur',
})

const {
  value: blurEmail,
  hasError: blurEmailHasError,
  errorMessage: blurEmailError,
  isValid: blurEmailValid,
} = useFormField<string>('email', {
  ref: useTemplateRef<HTMLInputElement>('blurEmailRef'),
  formIdentifier: 'form-blur',
})

const onSubmitBlur = handleBlur(async () => {
  await sleep(1000)
  toast.success('Submitted!', { position: 'top' })
})

// Progressive Mode Demo
const progressiveSchema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  email: pipe(string(), nonEmpty('Required'), email('Invalid email')),
  agree: pipe(boolean(), literal(true, 'You must agree')),
}

const {
  isSubmitting: progressiveSubmitting,
  handleSubmit: handleProgressive,
} = useFormValidator({
  schema: progressiveSchema,
  options: { mode: 'progressive', scrollToError: '.has-error-progressive', identifier: 'form-progressive' },
})

const {
  value: progressiveName,
  hasError: progressiveNameHasError,
  errorMessage: progressiveNameError,
  isValid: progressiveNameValid,
} = useFormField<string>('name', {
  ref: useTemplateRef<HTMLInputElement>('progressiveNameRef'),
  formIdentifier: 'form-progressive',
})

const {
  value: progressiveEmail,
  hasError: progressiveEmailHasError,
  errorMessage: progressiveEmailError,
  isValid: progressiveEmailValid,
} = useFormField<string>('email', {
  ref: useTemplateRef<HTMLInputElement>('progressiveEmailRef'),
  formIdentifier: 'form-progressive',
})

const {
  value: progressiveAgree,
  hasError: progressiveAgreeHasError,
  errorMessage: progressiveAgreeError,
} = useFormField<boolean>('agree', {
  ref: useTemplateRef<HTMLInputElement>('progressiveAgreeRef'),
  formIdentifier: 'form-progressive',
})

const onSubmitProgressive = handleProgressive(async () => {
  await sleep(1000)
  toast.success('Submitted!', { position: 'top' })
})

// Async Validation Demo
const asyncSchema = {
  username: pipeAsync(
    string(),
    nonEmpty('Username is required'),
    minLength(3, 'Min 3 characters'),
    checkAsync(async (value) => {
      await sleep(2000)
      return value !== 'taken'
    }, 'Username is already taken'),
  ),
}

const {
  isSubmitting: asyncSubmitting,
  handleSubmit: handleAsync,
} = useFormValidator({
  schema: asyncSchema,
  options: { mode: 'eager', identifier: 'form-async' },
})

const {
  value: asyncUsername,
  hasError: asyncUsernameHasError,
  errorMessage: asyncUsernameError,
  isValid: asyncUsernameValid,
  isValidating: asyncUsernameValidating,
} = useFormField<string>('username', {
  ref: useTemplateRef<HTMLInputElement>('asyncUsernameRef'),
  formIdentifier: 'form-async',
})

const onSubmitAsync = handleAsync(async () => {
  await sleep(1000)
  toast.success('Submitted!', { position: 'top' })
})

// Debounce/Throttle Demo
const debouncedSchema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  age: pipe(number('Must be a number'), minValue(18, 'Must be 18+')),
}

const {
  model: debouncedModel,
  errorMessages: debouncedErrors,
  fieldsStates: debouncedStates,
  isSubmitting: debouncedSubmitting,
  handleSubmit: handleDebounced,
} = useFormValidator({
  schema: debouncedSchema,
  options: {
    debouncedFields: { name: 500 },
    throttledFields: { age: 1000 },
  },
})

const onSubmitDebounced = handleDebounced(async () => {
  await sleep(1000)
  toast.success('Submitted!', { position: 'top' })
})

// Reset Form Demo
const resetSchema = {
  name: pipe(string(), nonEmpty('Required'), minLength(3, 'Min 3 characters')),
  age: pipe(number('Must be a number'), minValue(18, 'Must be 18+')),
}

const {
  model: resetModel,
  errorMessages: resetErrors,
  fieldsStates: resetStates,
  isSubmitting: resetSubmitting,
  handleSubmit: handleReset,
  resetForm: resetFormFn,
} = useFormValidator({
  schema: resetSchema,
  defaultValues: { name: 'John', age: 25 },
  options: { resetOnSuccess: false },
})

const onSubmitReset = handleReset(async () => {
  await sleep(1000)
  toast.success('Submitted!', { position: 'top' })
})
</script>
