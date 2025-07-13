<script setup lang="ts">
import type { GenericInstanceType } from '@maz-ui/utils/src/index.js'
import type { MazCheckbox, MazInput, MazSelect } from 'maz-ui/components'
import { sleep } from 'maz-ui/src/index.js'
import { boolean, literal, maxValue, minLength, minValue, nonEmpty, number, pipe, string } from 'valibot'
import { useTemplateRef } from 'vue'

const toast = useToast()

const schema = {
  name: pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters')),
  age: pipe(number('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
  country: pipe(string('Country is required'), nonEmpty('Country is required')),
  agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
}

const { model, isValid, isSubmitting, handleSubmit, errorMessages, isDirty, isSubmitted, identifier } = useFormValidator<typeof schema>({
  schema,
  options: { mode: 'progressive', scrollToError: '.has-error-', identifier: 'form' },
})

const {
  value: name,
  isValid: nameValid,
  hasError: nameError,
  errorMessage: nameMessage,
  validationEvents,
  isDirty: isDirtyName,
} = useFormField<typeof schema, 'name'>('name', { formIdentifier: 'form' })

const {
  value: age,
  isValid: ageValid,
  hasError: ageError,
  errorMessage: ageMessage,
} = useFormField<typeof schema, 'age'>('age', { ref: useTemplateRef<GenericInstanceType<typeof MazInput>>('ageRef'), formIdentifier: 'form' })
const {
  value: country,
  isValid: countryValid,
  hasError: countryError,
  errorMessage: countryMessage,
} = useFormField<typeof schema, 'country'>('country', { ref: useTemplateRef<GenericInstanceType<typeof MazSelect>>('countryRef'), formIdentifier: 'form' })
const {
  value: agree,
  isValid: agreeValid,
  hasError: agreeError,
  errorMessage: agreeMessage,
  isDirty: isDirtyAgree,
} = useFormField<typeof schema, 'agree'>('agree', { ref: useTemplateRef<GenericInstanceType<typeof MazCheckbox>>('agreeRef'), formIdentifier: 'form' })

const onSubmit = handleSubmit(async (formData) => {
  // eslint-disable-next-line no-console
  console.log(formData)
  await sleep(2000)
  toast.success('Form submitted', { position: 'top' })
})
</script>

<template>
  <div id="home" class="maz-flex maz-h-full maz-flex-col maz-items-center maz-justify-center maz-gap-8">
    <div class="maz-flex maz-w-96 maz-flex-col maz-gap-4">
      Form State:
      <pre class="maz-text-xs" style="word-wrap: break-word;">{{ { model, isValid, isSubmitting, errorMessages, isDirty, isSubmitted, identifier, nameError, ageError, countryError, agreeError } }}</pre>
    </div>

    <form class="maz-flex maz-w-96 maz-flex-col maz-gap-4" @submit="onSubmit">
      <fieldset class="maz-flex maz-flex-col maz-gap-4">
        <MazInput
          v-model="name"
          top-label="Enter your name"
          placeholder="e.g. John Doe"
          :hint="nameMessage"
          :error="nameError"
          :success="nameValid"
          v-bind="validationEvents"
          block
          :class="{ 'has-error-': nameError }"
        />

        {{ { isDirtyName } }}

        <MazInput
          ref="ageRef"
          v-model="age"
          type="number"
          top-label="Enter your age"
          placeholder="e.g. 25"
          :hint="ageMessage"
          :error="ageError"
          :success="ageValid"
          block
          :class="{ 'has-error-': ageError }"
        />

        <MazSelectCountry
          ref="countryRef"
          v-model="country"
          top-label="Select your nationality"
          placeholder="e.g. France"
          search
          list-position="left-end"
          :hint="countryMessage"
          :error="countryError"
          :success="countryValid"
          block
          :class="{ 'has-error-': countryError }"
        />
        <MazCheckbox
          ref="agreeRef"
          v-model="agree"
          :hint="agreeMessage"
          :error="agreeError"
          :success="agreeValid"
          block
          :class="{ 'has-error-': agreeError }"
        >
          I agree to the terms and conditions
        </MazCheckbox>

        {{ { isDirtyAgree } }}

        <MazBtn type="submit" block :loading="isSubmitting">
          Submit
        </MazBtn>
      </fieldset>
    </form>
  </div>
</template>
