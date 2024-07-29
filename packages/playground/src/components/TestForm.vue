<template>
  <form
    class="maz-flex maz-flex-col maz-gap-4"
    @submit="onSubmit"
  >
    <MazInput
      ref="nameRef"
      v-model="name"
      label="Enter your name"
      :hint="nameErrorMessage"
      :error="!!nameErrorMessage"
      :class="{ 'has-error-form2': !!nameErrorMessage }"
    />
    <MazInput
      ref="ageRef"
      v-model="age"
      type="number"
      label="Enter your age"
      :hint="ageErrorMessage"
      :error="!!ageErrorMessage"
      :class="{ 'has-error-form2': !!ageErrorMessage }"
    />
    <MazSelect
      ref="countryRef"
      v-model="country"
      :options="[{ label: 'France', value: 'FR' }, { label: 'United States', value: 'US' }]"
      label="Select your nationality"
      :hint="countryErrorMessage"
      :error="!!countryErrorMessage"
      :class="{ 'has-error-form2': !!countryErrorMessage }"
    />
    <MazInputCode
      ref="codeRef"
      v-model="code"
      :error="!!codeError"
      :hint="codeError"
    />
    <MazInputNumber
      ref="numberRef"
      v-model="number"
      label="Enter a number"
      :error="!!numberError"
      :text-center="false"
      :hint="numberError"
    />
    <MazInputPrice
      ref="priceRef"
      v-model="price"
      label="Enter a price"
      :error="!!priceError"
      :hint="priceError"
    />
    <MazInputTags
      ref="tagsRef"
      v-model="tags"
      :error="!!tagsError"
      :hint="tagsError"
    />
    <MazPhoneNumberInput
      ref="phoneRef"
      v-model="phone"
      :error="!!phoneError"
      :hint="phoneError"
    />
    <MazRadio
      ref="radioRef"
      v-model="radio"
      :value="'radio1'"
      name="radio"
      :error="!!radioError"
      :hint="radioError"
    >
      Switch
    </MazRadio>
    <MazRadio
      ref="radioRef"
      v-model="radio"
      :value="'radio2'"
      name="radio"
      :warning="!!radioError"
      :hint="radioError"
      label="Switch"
    />
    <MazRadioButtons
      ref="radioButtonsRef"
      v-model="radioButtons"
      :options="[{ label: 'Option 1', value: 'radio1' }, { label: 'Option 2', value: 'radio2' }]"
      :error="!!radioButtonsError"
      :hint="radioButtonsError"
    />
    <MazSwitch
      ref="switchRef"
      v-model="switchValue"
      :warning="!!switchError"
      :hint="switchError"
      label="Switch"
    />
    <MazTextarea
      ref="textareaRef"
      v-model="textarea"
      :hint="textareaError"
      :error="!!textareaError"
    />
    <MazCheckbox
      ref="agreeRef"
      v-model="agree"
      :class="{ 'has-error-form2': !!agreeErrorMessage }"
      label="I agree to the terms and conditions"
      :hint="agreeErrorMessage"
      :error="!!agreeErrorMessage"
    />
    <MazBtn
      type="submit"
      :loading="isSubmitting"
    >
      Submit
    </MazBtn>
  </form>
</template>

<script setup lang="ts">
import { pipe, string, number as numberAction, nonEmpty, minValue, literal, boolean, maxValue, minLength, array } from 'valibot'

type Model = {
  name: string
  age: number
  agree: boolean
  country: string
  code: string
  number: number
  price: number
  tags: string[]
  phone: string
  radio: string
  radioButtons: string
  switch: boolean
  textarea: string
}

const { isSubmitting, handleSubmit } = useFormValidator<Model>({
  schema: {
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
  },
  options: { mode: 'blur', scrollToError: '.has-error-form2', identifier: 'form2' },
})

const { value: name, errorMessage: nameErrorMessage } = useFormField('name', { ref: 'nameRef', formIdentifier: 'form2' })
const { value: age, errorMessage: ageErrorMessage } = useFormField('age', { ref: 'ageRef', formIdentifier: 'form2' })
const { value: agree, errorMessage: agreeErrorMessage } = useFormField('agree', { ref: 'agreeRef', formIdentifier: 'form2' })
const { value: country, errorMessage: countryErrorMessage } = useFormField('country', { ref: 'countryRef', formIdentifier: 'form2' })
const { value: code, errorMessage: codeError } = useFormField('code', { ref: 'codeRef', formIdentifier: 'form2' })
const { value: number, errorMessage: numberError } = useFormField('number', { ref: 'numberRef', formIdentifier: 'form2' })
const { value: price, errorMessage: priceError } = useFormField('price', { ref: 'priceRef', formIdentifier: 'form2' })
const { value: tags, errorMessage: tagsError } = useFormField('tags', { ref: 'tagsRef', formIdentifier: 'form2' })
const { value: phone, errorMessage: phoneError } = useFormField('phone', { ref: 'phoneRef', formIdentifier: 'form2' })
const { value: radio, errorMessage: radioError } = useFormField('radio', { ref: 'radioRef', formIdentifier: 'form2' })
const { value: radioButtons, errorMessage: radioButtonsError } = useFormField('radioButtons', { ref: 'radioButtonsRef', formIdentifier: 'form2' })
const { value: switchValue, errorMessage: switchError } = useFormField('switch', { ref: 'switchRef', formIdentifier: 'form2' })
const { value: textarea, errorMessage: textareaError } = useFormField('textarea', { ref: 'textareaRef', formIdentifier: 'form2', mode: 'eager' })
const onSubmit = handleSubmit(async (formData) => {
  // Form submission logic
  console.log(formData)
})
</script>
