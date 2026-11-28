<script setup lang="ts">
import type { GenericInstanceType } from '@maz-ui/utils/ts-helpers/GenericInstanceType'
import type { MazDatePickerPartialRangeValue, MazInput, MazRadioButtons, MazTextarea } from 'maz-ui/components'
// import { useFormField, useFormValidator } from 'maz-ui/composables.js'
import { array, boolean, literal, maxValue, minLength, minValue, nonEmpty, number as numberAction, object, pipe, string } from 'valibot'

const schema = ref({
  name: pipe(string('Le nom est requis'), nonEmpty('Le nom est requis')),
  age: pipe(numberAction('L\'âge est requis'), minValue(18, 'L\'âge doit être supérieur à 18'), maxValue(100, 'L\'âge doit être inférieur à 100')),
  agree: pipe(boolean('Tu dois accepter les conditions générales'), literal(true, 'Tu dois accepter les conditions générales')),
  country: pipe(string('Le pays est requis'), nonEmpty('Le pays est requis')),
  code: pipe(string('Le code est requis'), nonEmpty('Le code est requis'), minLength(4, 'Le code doit faire 4 caractères')),
  number: pipe(numberAction('Le nombre est requis'), minValue(1, 'Nombre minimum : 1')),
  price: pipe(numberAction('Le prix est requis'), minValue(2, 'Prix minimum : 2')),
  tags: pipe(array(string(), 'Les tags sont requis'), nonEmpty('Les tags sont requis')),
  phone: pipe(string('Le téléphone est requis'), nonEmpty('Le téléphone est requis')),
  radio: pipe(string('Le radio est requis'), nonEmpty('Le radio est requis')),
  radioButtons: pipe(string('Le choix est requis'), nonEmpty('Le choix est requis')),
  switch: pipe(boolean('Le switch est requis'), literal(true, 'Le switch est requis')),
  textarea: pipe(string('Le message est requis'), nonEmpty('Le message est requis')),
  date: object({
    start: pipe(string('La date de début est requise'), nonEmpty('La date de début est requise')),
    end: pipe(string('La date de fin est requise'), nonEmpty('La date de fin est requise')),
  }),
})

const { isSubmitting, handleSubmit, model, fieldsStates } = useFormValidator({
  schema,
  defaultValues: {
    age: 33,
  },
  model: ref({}),
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
    class="maz:flex maz:flex-col maz:gap-4"
    @submit="onSubmit"
  >
    model: <pre class="maz:text-xs">{{ model }}</pre>

    <MazInput
      id="name"
      ref="nameRef"
      v-model="name"
      top-label="Saisis ton nom"
      :assistive-text="nameErrorMessage"
      label="Jean Dupont"
      :error="!!nameErrorMessage"
      :success="fieldsStates?.name.valid"
      :class="{ 'has-error-form': !!nameErrorMessage }"
    />
    <MazInput
      id="age"
      ref="ageRef"
      v-model="age"
      type="number"
      label="Saisis ton âge"
      :hint="ageErrorMessage"
      :error="!!ageErrorMessage"
      :success="isValidAge"
      :class="{ 'has-error-form': !!ageErrorMessage }"
    />
    <MazSelect
      id="country"
      ref="countryRef"
      v-model="country"
      :options="[{ label: 'France', value: 'FR' }, { label: 'États-Unis', value: 'US' }]"
      label="Choisis ta nationalité"
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
      label="Saisis un nombre"

      :error="!!numberError"
      :text-center="true"
      :hint="numberError"
      :success="isValidNumber"
    />
    <MazInputPrice
      id="price"
      ref="priceRef"
      v-model="price"
      label="Saisis un prix"
      :error="!!priceError"
      :hint="priceError"
      :success="isValidPrice"
    />
    <MazInputTags
      id="tags"
      ref="tagsRef"
      v-model="tags"
      :error="!!tagsError"
      label="Saisis des tags"
      :hint="tagsError"
      :success="isValidTags"
    />
    <MazInputPhoneNumber
      id="phone"
      ref="phoneRef"
      v-model="phone"
      :error="!!phoneError"
      placeholder="Saisis ton numéro de téléphone"
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
      label="Saisis ton message"
      :hint="textareaError"
      :error="!!textareaError"
      :success="isValidTextarea"
    />
    <MazCheckbox
      id="agree"
      ref="agreeRef"
      v-model="agree"
      :class="{ 'has-error-form': !!agreeErrorMessage }"
      label="J'accepte les conditions générales"
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
      label="Date"
      range
      double
      :error="!!dateError"
      :success="isValidDate"
      picker-position="top"
    />
    <MazBtn
      type="submit"
      :loading="isSubmitting"
    >
      Envoyer
    </MazBtn>
  </form>
</template>
