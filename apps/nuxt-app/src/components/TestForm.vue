<script setup lang="ts">
import type { MazDatePicker, MazSwitch, MazTextarea } from '#components'
import type { DeepPartial } from '@maz-ui/utils/src/ts-helpers/DeepPartial.js'
import type { GenericInstanceType } from 'maz-ui'
import type { MazDatePickerPartialRangeValue, MazDatePickerValue, MazInput, MazRadioButtons } from 'maz-ui/components'
import type { InferSchemaFormValidator } from 'maz-ui/src/composables/index.js'
import { useFormField, useFormValidator } from 'maz-ui/src/composables/index.js'
import { array, boolean, literal, maxValue, minLength, minValue, nonEmpty, number as numberAction, object, pipe, string } from 'valibot'

const schema = ref({
  name: pipe(string('Name is required'), nonEmpty('Name is required')),
  age: pipe(numberAction('Age is required'), minValue(18, 'Age must be greater than 18'), maxValue(100, 'Age must be less than 100')),
  agree: pipe(boolean('You must agree to the terms and conditions'), literal(true, 'You must agree to the terms and conditions')),
  country: pipe(string('Country is required'), nonEmpty('Country is required')),
  code: pipe(string('Code is required'), nonEmpty('Code is required'), minLength(4, 'Code must be 4 characters')),
  number: pipe(numberAction('Number is required'), minValue(1, 'Number min 1')),
  price: pipe(numberAction('Price is required'), minValue(2, 'Price min 2')),
  tags: pipe(array(string(), 'Tags is required'), nonEmpty('Tags is required')),
  phone: pipe(string('Phone is required'), nonEmpty('Phone is required')),
  radio: pipe(string('Radio is required'), nonEmpty('Radio is required')),
  radioButtons: pipe(string('RadioButtons is required'), nonEmpty('RadioButtons is required')),
  switch: pipe(boolean('Switch is required'), literal(true, 'Switch is required')),
  textarea: pipe(string('Textarea is required'), nonEmpty('Textarea is required')),
  date: object({
    start: pipe(string('Start date is required'), nonEmpty('Start date is required')),
    end: pipe(string('End date is required'), nonEmpty('End date is required')),
  }),
})

const defaultValues = ref({
  name: 'Mazel',
  date: {
    start: undefined,
    end: undefined,
  },
})

const { isSubmitting, handleSubmit, model, fieldsStates } = useFormValidator({
  schema,
  defaultValues: {
    age: 33,
    date: undefined,
  },
  options: {
    mode: 'progressive',
    scrollToError: '.has-error-form',
    debouncedFields: {
      age: 3000,
    },
  },
})

type MazTextareaInstance = typeof MazTextarea<string>

const nameRef = useTemplateRef<any>('nameRef')
const ageRef = useTemplateRef<GenericInstanceType<typeof MazInput>>('ageRef')
const agreeRef = useTemplateRef<GenericInstanceType<typeof MazInput>>('agreeRef')
const countryRef = useTemplateRef<GenericInstanceType<typeof MazInput>>('countryRef')
const codeRef = useTemplateRef<GenericInstanceType<typeof MazInput>>('codeRef')
const numberRef = useTemplateRef<GenericInstanceType<typeof MazInput>>('numberRef')
const priceRef = useTemplateRef<GenericInstanceType<typeof MazInput>>('priceRef')
const tagsRef = useTemplateRef<GenericInstanceType<typeof MazInput>>('tagsRef')
const phoneRef = useTemplateRef<GenericInstanceType<typeof MazInput>>('phoneRef')
const radioRef = useTemplateRef<GenericInstanceType<typeof MazInput>>('radioRef')
const radioButtonsRef = useTemplateRef<GenericInstanceType<typeof MazRadioButtons>>('radioButtonsRef')
const switchRef = useTemplateRef<any>('switchRef')
const textareaRef = useTemplateRef<GenericInstanceType<MazTextareaInstance>>('textareaRef')
const dateRef = useTemplateRef<any>('dateRef')

const { value: name, errorMessage: nameErrorMessage } = useFormField<string>('name', {
  ref: nameRef,
  defaultValue: 'Mazel',
})
const { value: age, errorMessage: ageErrorMessage, isValid: isValidAge } = useFormField<number>('age', { ref: ageRef })
const { value: agree, errorMessage: agreeErrorMessage, isValid: isValidAgree } = useFormField<boolean>('agree', { ref: agreeRef })
const { value: country, errorMessage: countryErrorMessage, isValid: isValidCountry } = useFormField<string>('country', { ref: countryRef })
const { value: code, errorMessage: codeError, isValid: isValidCode } = useFormField<string>('code', { ref: codeRef })
const { value: number, errorMessage: numberError, isValid: isValidNumber } = useFormField<number>('number', { ref: numberRef })
const { value: price, errorMessage: priceError, isValid: isValidPrice } = useFormField<number>('price', { ref: priceRef })
const { value: tags, errorMessage: tagsError, isValid: isValidTags } = useFormField<string[]>('tags', { ref: tagsRef })
const { value: phone, errorMessage: phoneError, isValid: isValidPhone } = useFormField<string>('phone', { ref: phoneRef })
const { value: radio, errorMessage: radioError, isValid: isValidRadio } = useFormField<string>('radio', { ref: radioRef })
const { errorMessage: radioButtonsError, isValid: isValidButtons } = useFormField<string>('radioButtons', { ref: radioButtonsRef })
const { value: switchValue, errorMessage: switchError, isValid: isValidSwitch } = useFormField<boolean>('switch', { ref: switchRef })
const { value: textarea, errorMessage: textareaError, isValid: isValidTextarea } = useFormField<string>('textarea', { ref: textareaRef })
const { value: date, errorMessage: dateError, isValid: isValidDate } = useFormField<MazDatePickerPartialRangeValue>('date', { ref: dateRef })

const onSubmit = handleSubmit((formData) => {
  // eslint-disable-next-line no-console
  console.log(formData)
})
</script>

<template>
  <form
    class="maz-flex maz-flex-col maz-gap-4"
    @submit="onSubmit"
  >
    model: <pre class="maz-text-xs">{{ model }}</pre>

    <MazInput
      id="name"
      ref="nameRef"
      v-model="name"
      top-label="Enter your name"
      :assistive-text="nameErrorMessage"
      placeholder="John Doe"
      :error="!!nameErrorMessage"
      :success="fieldsStates?.name.valid"
      :class="{ 'has-error-form': !!nameErrorMessage }"
    />
    <MazInput
      id="age"
      ref="ageRef"
      v-model="age"
      type="number"
      label="Enter your age"
      :hint="ageErrorMessage"
      :error="!!ageErrorMessage"
      :success="isValidAge"
      :class="{ 'has-error-form': !!ageErrorMessage }"
    />
    <MazSelect
      id="country"
      ref="countryRef"
      v-model="country"
      :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
      label="Select your nationality"
      :hint="countryErrorMessage"
      :error="!!countryErrorMessage"
      :success="isValidCountry"
      :class="{ 'has-error-form': !!countryErrorMessage }"
    />
    <MazInputCode
      id="code"
      ref="codeRef"
      v-model="code"
      :error="!!codeError"
      :hint="codeError"
      :success="isValidCode"
    />
    <MazInputNumber
      id="number"
      ref="numberRef"
      v-model="number"
      label="Enter a number"
      :error="!!numberError"
      :text-center="false"
      :hint="numberError"
      :success="isValidNumber"
    />
    <MazInputPrice
      id="price"
      ref="priceRef"
      v-model="price"
      label="Enter a price"
      :error="!!priceError"
      :hint="priceError"
      :success="isValidPrice"
    />
    <MazInputTags
      id="tags"
      ref="tagsRef"
      v-model="tags"
      :error="!!tagsError"
      label="Enter tags"
      :hint="tagsError"
      :success="isValidTags"
    />
    <MazInputPhoneNumber
      id="phone"
      ref="phoneRef"
      v-model="phone"
      :error="!!phoneError"
      placeholder="Enter your phone number"
      :hint="phoneError"
      :success="isValidPhone"
    />
    <MazRadio
      id="radio"
      ref="radioRef"
      v-model="radio"
      value="radio1"
      name="radio"
      :error="!!radioError"
      :hint="radioError"
      :success="isValidRadio"
    >
      Radio 1
    </MazRadio>
    <MazRadio
      id="radio2"
      ref="radioRef"
      v-model="radio"
      value="radio2"
      name="radio"
      :warning="!!radioError"
      :hint="radioError"
      label="Radio 2"
      :success="isValidRadio"
    />
    <MazRadioButtons
      id="radioButtons"
      ref="radioButtonsRef"
      v-model="model.radioButtons"
      :options="[{ label: 'Option 1', value: 'radio1' }, { label: 'Option 2', value: 'radio2' }]"
      :error="!!radioButtonsError"
      :hint="radioButtonsError"
      :success="isValidButtons"
    />
    <MazSwitch
      id="switch"
      ref="switchRef"
      v-model="switchValue"
      :error="!!switchError"
      :hint="switchError"
      label="Switch"
      :success="isValidSwitch"
    />
    <MazTextarea
      id="textarea"
      ref="textareaRef"
      v-model="textarea"
      label="Enter your message"
      :hint="textareaError"
      :error="!!textareaError"
      :success="isValidTextarea"
    />
    <MazCheckbox
      id="agree"
      ref="agreeRef"
      v-model="agree"
      :class="{ 'has-error-form': !!agreeErrorMessage }"
      label="I agree to the terms and conditions"
      :hint="agreeErrorMessage"
      :error="!!agreeErrorMessage"
      :success="isValidAgree"
    />
    <MazDatePicker
      id="date"
      ref="dateRef"
      v-model="date"
      :hint="dateError"
      color="contrast"
      :error="!!dateError"
      :success="isValidDate"
      picker-position="top"
    />
    <MazBtn
      type="submit"
      :loading="isSubmitting"
    >
      Submit
    </MazBtn>
  </form>
</template>
