<template>
  <form
    class="maz-flex maz-flex-col maz-gap-4"
    @submit="onSubmit"
  >
    model: <pre>{{ model }}</pre>
    <br>
    defaultValues: <pre>{{ defaultValues }}</pre>
    <MazInput
      ref="nameRef"
      v-model="name"
      label="Enter your name"
      :hint="nameErrorMessage"
      :error="!!nameErrorMessage"
      :success="fieldsStates?.name.valid"
      :class="{ 'has-error-form': !!nameErrorMessage }"
    />
    <MazInput
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
      ref="codeRef"
      v-model="code"
      :error="!!codeError"
      :hint="codeError"
      :success="isValidCode"
    />
    <MazInputNumber
      ref="numberRef"
      v-model="number"
      label="Enter a number"
      :error="!!numberError"
      :text-center="false"
      :hint="numberError"
      :success="isValidNumber"
    />
    <MazInputPrice
      ref="priceRef"
      v-model="price"
      label="Enter a price"
      :error="!!priceError"
      :hint="priceError"
      :success="isValidPrice"
    />
    <MazInputTags
      ref="tagsRef"
      v-model="tags"
      :error="!!tagsError"
      :hint="tagsError"
      :success="isValidTags"
    />
    <MazPhoneNumberInput
      ref="phoneRef"
      v-model="phone"
      :error="!!phoneError"
      :hint="phoneError"
      :success="isValidPhone"
    />
    <MazRadio
      ref="radioRef"
      v-model="radio"
      :value="'radio1'"
      name="radio"
      :error="!!radioError"
      :hint="radioError"
      :success="isValidRadio"
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
      :success="isValidRadio"
    />
    <MazRadioButtons
      ref="radioButtonsRef"
      v-model="model.radioButtons"
      :options="[{ label: 'Option 1', value: 'radio1' }, { label: 'Option 2', value: 'radio2' }]"
      :error="!!radioButtonsError"
      :hint="radioButtonsError"
      :success="isValidButtons"
    />
    <MazSwitch
      ref="switchRef"
      v-model="switchValue"
      :warning="!!switchError"
      :hint="switchError"
      label="Switch"
      :success="isValidSwitch"
    />
    <MazTextarea
      ref="textareaRef"
      v-model="textarea"
      label="Enter your message"
      :hint="textareaError"
      :error="!!textareaError"
      :success="isValidTextarea"
    />
    <MazCheckbox
      ref="agreeRef"
      v-model="agree"
      :class="{ 'has-error-form': !!agreeErrorMessage }"
      label="I agree to the terms and conditions"
      :hint="agreeErrorMessage"
      :error="!!agreeErrorMessage"
      :success="isValidAgree"
    />
    <MazPicker
      v-model="date"
      :hint="dateError"
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

<script setup lang="ts">
import type { FormSchema } from 'maz-ui'
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
  date: string
}

const defaultValues = ref<Partial<Model>>({
  name: 'Mazel',
})

const schema = ref<FormSchema<Model>>({
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
  date: pipe(string('Date is required'), nonEmpty('Date is required')),
})

setTimeout(() => {
  defaultValues.value.age = 33
}, 1000)

// setTimeout(() => {
//   schema.value.name = pipe(string('Name is required'), nonEmpty('Name is required'), minLength(3, 'Name must be at least 3 characters'))
// }, 2000)

const { isSubmitting, handleSubmit, model, fieldsStates } = useFormValidator<Model>({
  schema,
  defaultValues,
  options: { mode: 'blur', scrollToError: '.has-error-form' },
})

const { value: name, errorMessage: nameErrorMessage } = useFormField('name', { ref: 'nameRef' })
const { value: age, errorMessage: ageErrorMessage, isValid: isValidAge } = useFormField('age', { ref: 'ageRef' })
const { value: agree, errorMessage: agreeErrorMessage, isValid: isValidAgree } = useFormField('agree', { ref: 'agreeRef' })
const { value: country, errorMessage: countryErrorMessage, isValid: isValidCountry } = useFormField('country', { ref: 'countryRef' })
const { value: code, errorMessage: codeError, isValid: isValidCode } = useFormField('code', { ref: 'codeRef' })
const { value: number, errorMessage: numberError, isValid: isValidNumber } = useFormField('number', { ref: 'numberRef' })
const { value: price, errorMessage: priceError, isValid: isValidPrice } = useFormField('price', { ref: 'priceRef' })
const { value: tags, errorMessage: tagsError, isValid: isValidTags } = useFormField('tags', { ref: 'tagsRef' })
const { value: phone, errorMessage: phoneError, isValid: isValidPhone } = useFormField('phone', { ref: 'phoneRef' })
const { value: radio, errorMessage: radioError, isValid: isValidRadio } = useFormField('radio', { ref: 'radioRef' })
const { errorMessage: radioButtonsError, isValid: isValidButtons } = useFormField('radioButtons', { ref: 'radioButtonsRef' })
const { value: switchValue, errorMessage: switchError, isValid: isValidSwitch } = useFormField('switch', { ref: 'switchRef' })
const { value: textarea, errorMessage: textareaError, isValid: isValidTextarea } = useFormField('textarea', { ref: 'textareaRef' })
const { value: date, errorMessage: dateError, isValid: isValidDate } = useFormField('date', { ref: 'dateRef' })

const onSubmit = handleSubmit(async (formData) => {
  // Form submission logic
  console.log(formData)
})
</script>
