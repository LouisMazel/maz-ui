<script lang="ts" setup>
import type {
  FieldBlurEventPayload,
  FieldChangeEventPayload,
  FieldFocusEventPayload,
  FieldValidateEventPayload,
  FormResetEventPayload,
  FormSubmitErrorEventPayload,
  FormSubmitEventPayload,
} from '@maz-ui/forms'
import { defineFormSchema } from '@maz-ui/forms'
import * as v from 'valibot'

interface FormModel extends Record<string, unknown> {
  firstName: string
  lastName: string
  email: string
  password: string
  website: string
  phone: string
  birthDate: string
  gender: string
  country: string
  address: string
  city: string
  postalCode: string
  acceptTerms: boolean
  newsletter: boolean
  contactMethod: string
  priority: string
  satisfaction: number
  bio: string
  yearsExperience: number
  salary: number
  skills: string[]
  verificationCode: string
}

const formModel = ref<FormModel>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  website: '',
  phone: '',
  birthDate: '',
  gender: '',
  country: '',
  address: '',
  city: '',
  postalCode: '',
  acceptTerms: false,
  newsletter: false,
  contactMethod: '',
  priority: '',
  satisfaction: 50,
  bio: '',
  yearsExperience: 0,
  salary: 0,
  skills: [],
  verificationCode: '',
})

const schema = defineFormSchema<FormModel>({
  sections: [
    {
      id: 'identity',
      legend: 'Personal Information',
      container: true,
      fields: [
        {
          name: 'firstName',
          component: 'MazInput',
          props: {
            'top-label': 'First Name',
            'placeholder': 'John',
            'required': true,
          },
          attrs: {
            'autocomplete': 'given-name',
            'data-testid': 'first-name',
          },
          validation: {
            rule: v.pipe(v.string(), v.minLength(2, 'At least 2 characters'), v.maxLength(50, 'Max 50 characters')),
            mode: 'eager',
            useMultipleErrorMessages: true,
          },
        },
        {
          name: 'lastName',
          component: 'MazInput',
          props: {
            'top-label': 'Last Name',
            'placeholder': 'Doe',
            'required': true,
          },
          attrs: {
            autocomplete: 'family-name',
          },
          validation: {
            rule: v.pipe(v.string(), v.minLength(2, 'At least 2 characters')),
            mode: 'lazy',
          },
        },
        {
          name: 'email',
          component: 'MazInput',
          props: {
            'top-label': 'Email',
            'placeholder': 'john@example.com',
            'type': 'email',
            'required': true,
          },
          attrs: {
            autocomplete: 'email',
            inputmode: 'email',
          },
          validation: {
            rule: v.pipe(v.string(), v.nonEmpty('Email is required'), v.email('Invalid email format')),
            mode: 'progressive',
            debounced: 500,
          },
        },
        {
          name: 'password',
          component: 'MazInput',
          props: {
            'top-label': 'Password',
            'placeholder': '••••••••',
            'type': 'password',
            'required': true,
          },
          attrs: {
            autocomplete: 'new-password',
          },
          validation: {
            rule: v.pipe(
              v.string(),
              v.nonEmpty('Password is required'),
              v.minLength(8, 'At least 8 characters'),
              v.regex(/[A-Z]/, 'Must contain an uppercase letter'),
              v.regex(/\d/, 'Must contain a number'),
              v.regex(/\W/, 'Must contain a special character'),
            ),
            mode: 'aggressive',
            useMultipleErrorMessages: true,
          },
        },
        {
          name: 'website',
          component: 'MazInput',
          props: {
            'top-label': 'Website',
            'placeholder': 'https://example.com',
            'type': 'url',
          },
          attrs: {
            inputmode: 'url',
            autocomplete: 'url',
          },
          validation: {
            rule: v.pipe(v.string(), v.url('Invalid URL format')),
            mode: 'lazy',
            throttled: 1000,
          },
        },
        {
          name: 'phone',
          component: 'MazInputPhoneNumber',
          props: {
            'top-label': 'Phone Number',
            'preferredCountries': ['FR', 'US', 'GB', 'DE'],
            'defaultCountryCode': 'FR',
          },
          validation: {
            rule: v.pipe(v.string(), v.minLength(6, 'Invalid phone number')),
            mode: 'lazy',
          },
        },
        {
          name: 'birthDate',
          component: 'MazDatePicker',
          props: {
            'top-label': 'Date of Birth',
          },
          validation: {
            rule: v.pipe(v.string(), v.nonEmpty('Please select a date of birth')),
            mode: 'aggressive',
          },
        },
        {
          name: 'gender',
          component: 'MazSelect',
          props: {
            'top-label': 'Gender',
            'placeholder': 'Select gender',
            'options': [
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Non-binary', value: 'non-binary' },
              { label: 'Prefer not to say', value: 'other' },
            ],
          },
          validation: {
            rule: v.pipe(v.string(), v.nonEmpty('Please select a gender')),
            mode: 'lazy',
          },
        },
      ],
    },
    {
      id: 'address',
      legend: 'Address',
      container: {
        elevation: true,
        roundedSize: 'xl',
      },
      fields: [
        {
          name: 'country',
          component: 'MazSelectCountry',
          props: {
            'top-label': 'Country',
            'placeholder': 'Select country',
          },
          validation: {
            rule: v.pipe(v.string(), v.nonEmpty('Country is required')),
            mode: 'lazy',
          },
        },
        {
          name: 'address',
          component: 'MazInput',
          props: {
            'top-label': 'Street Address',
            'placeholder': '123 Main St',
          },
          attrs: {
            autocomplete: 'street-address',
          },
          condition: val => !!val,
          validation: {
            rule: v.pipe(v.string(), v.minLength(5, 'Address too short')),
            mode: 'lazy',
          },
        },
        {
          name: 'city',
          component: 'MazInput',
          props: {
            'top-label': 'City',
            'placeholder': 'Paris',
          },
          attrs: {
            autocomplete: 'address-level2',
          },
          validation: {
            rule: v.pipe(v.string(), v.minLength(2, 'City name too short')),
            mode: 'lazy',
          },
        },
        {
          name: 'postalCode',
          component: 'MazInputCode',
          props: {
            'top-label': 'Postal Code',
            'codeLength': 5,
          },
          validation: {
            rule: v.pipe(v.string(), v.length(5, 'Postal code must be 5 digits')),
            mode: 'lazy',
          },
        },
      ],
    },
    {
      id: 'preferences',
      legend: 'Preferences & Agreements',
      fields: [
        {
          name: 'acceptTerms',
          component: 'MazCheckbox',
          props: {
            label: 'I accept the terms and conditions',
            required: true,
            color: 'primary',
          },
          validation: {
            rule: v.pipe(v.boolean(), v.value(true, 'You must accept the terms')),
            mode: 'aggressive',
          },
        },
        {
          name: 'newsletter',
          component: 'MazSwitch',
          props: {
            label: 'Subscribe to newsletter',
            color: 'secondary',
          },
          validation: {
            rule: v.pipe(v.boolean(), v.value(true, 'You must accept the terms')),
            mode: 'aggressive',
          },
        },
        {
          name: 'contactMethod',
          component: 'MazRadio',
          props: {
            label: 'Preferred Contact: Email',
            value: 'email',
          },
          validation: {
            rule: v.pipe(v.string(), v.nonEmpty('Please select a contact method')),
            mode: 'lazy',
          },
        },
        {
          name: 'priority',
          component: 'MazRadioButtons',
          props: {
            options: [
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
              { label: 'Urgent', value: 'urgent' },
            ],
          },
          validation: {
            rule: v.pipe(v.string(), v.nonEmpty('Please select a priority')),
            mode: 'lazy',
          },
        },
        {
          name: 'satisfaction',
          component: 'MazSlider',
          props: {
            label: 'Satisfaction Level',
            min: 0,
            max: 100,
          },
          validation: {
            rule: v.pipe(v.number(), v.nonEmpty('Please select a priority')),
            mode: 'lazy',
          },
        },
      ],
    },
    {
      id: 'professional',
      legend: 'Professional Details',
      container: true,
      fields: [
        {
          name: 'bio',
          component: 'MazTextarea',
          props: {
            'top-label': 'Biography',
            'placeholder': 'Tell us about yourself...',
          },
          attrs: {
            spellcheck: 'true',
          },
          validation: {
            rule: v.pipe(v.string(), v.nonEmpty('Please enter a bio'), v.maxLength(500, 'Max 500 characters')),
            mode: 'progressive',
            debounced: 300,
          },
        },
        {
          name: 'yearsExperience',
          component: 'MazInputNumber',
          props: {
            'top-label': 'Years of Experience',
            'min': 0,
            'max': 50,
          },
          validation: {
            rule: v.pipe(v.number(), v.minValue(10, 'Cannot be negative'), v.maxValue(50, 'Max 50 years')),
            mode: 'lazy',
          },
        },
        {
          name: 'salary',
          component: 'MazInputPrice',
          props: {
            'top-label': 'Expected Salary',
            'currency': 'EUR',
            'locale': 'fr-FR',
          },
          validation: {
            rule: v.pipe(v.number(), v.minValue(1000, 'Cannot be negative')),
            mode: 'lazy',
            throttled: 500,
          },
        },
        {
          name: 'skills',
          component: 'MazInputTags',
          props: {
            'top-label': 'Skills',
            'placeholder': 'Add a skill...',
          },
          validation: {
            rule: v.pipe(v.array(v.string()), v.minLength(1, 'Add at least one skill')),
            mode: 'lazy',
          },
        },
        {
          name: 'verificationCode',
          component: 'MazInputCode',
          props: {
            'top-label': 'Verification Code',
            'codeLength': 6,
          },
          validation: {
            rule: v.pipe(v.string(), v.length(6, 'Code must be 6 characters')),
            mode: 'eager',
          },
        },
      ],
    },
  ],
})

const formElement = useTemplateRef('formRef')
const isReadonly = ref(false)
const isDisabled = ref(false)
const lastEvent = ref('')
const lastEventData = ref<unknown>(null)

function logEvent(name: string, data: unknown) {
  lastEvent.value = name
  lastEventData.value = data
  console.warn(`[FormEvent] ${name}:`, data)
}

function onSubmit(payload: FormSubmitEventPayload<FormModel>) {
  logEvent('submit', payload)
}

function onSubmitError(payload: FormSubmitErrorEventPayload<FormModel>) {
  logEvent('submit-error', payload)
}

function onFieldChange(payload: FieldChangeEventPayload<FormModel>) {
  logEvent('field-change', payload)
}

function onFieldFocus(payload: FieldFocusEventPayload<FormModel>) {
  logEvent('field-focus', payload)
}

function onFieldBlur(payload: FieldBlurEventPayload<FormModel>) {
  logEvent('field-blur', payload)
}

function onFieldValidate(payload: FieldValidateEventPayload<FormModel>) {
  logEvent('field-validate', payload)
}

function onReset(payload: FormResetEventPayload<FormModel>) {
  logEvent('reset', payload)
}

function handleReset() {
  formElement.value?.resetForm()
}

async function handleValidate() {
  const result = await formElement.value?.validateForm(true)

  logEvent('manual-validate', { isValid: result })
}
</script>

<template>
  <div class="generated-form">
    <h1>Form Builder - Exhaustive Test</h1>

    <div class="generated-form__controls">
      <MazSwitch v-model="isReadonly" label="Readonly" />
      <MazSwitch v-model="isDisabled" label="Disabled" />
      <MazBtn size="sm" color="warning" @click="handleReset">
        Reset Form
      </MazBtn>
      <MazBtn size="sm" color="info" @click="handleValidate">
        Validate All
      </MazBtn>
    </div>

    <MazFormBuilder
      ref="formRef"
      v-model="formModel"
      :schema="schema"
      :readonly="isReadonly"
      :disabled="isDisabled"
      :submit-button="{ text: 'Submit Form', color: 'primary', size: 'lg' }"
      validation-mode="progressive"
      :error-summary="{ position: 'top' }"
      scroll-to-error=".has-field-error"
      aria-label="Complete test form"
      @submit="onSubmit"
      @submit-error="onSubmitError"
      @field-change="onFieldChange"
      @field-focus="onFieldFocus"
      @field-blur="onFieldBlur"
      @field-validate="onFieldValidate"
      @reset="onReset"
    >
      <!-- <template #field-newsletter="{ field, value, updateValue }">
        <div class="custom-slot-field">
          <span>Custom slot: {{ field.name }}</span>
          <MazSwitch
            :model-value="value"
            label="Newsletter (custom slot)"
            color="success"
            @update:model-value="updateValue"
          />
        </div>
      </template> -->
      <template #append-section>
        <MazAlert color="info" variant="soft">
          This form tests all 15 field components, multiple validation modes (eager, lazy, progressive, aggressive),
          debounced/throttled validation, multiple error messages, conditional fields, container sections,
          custom field slots, error summary, and all events.
        </MazAlert>
      </template>
    </MazFormBuilder>

    <details class="generated-form__debug">
      <summary>Debug: Model State</summary>
      <pre>{{ JSON.stringify(formModel, null, 2) }}</pre>
    </details>

    <details v-if="lastEvent" class="generated-form__debug">
      <summary>Debug: Last Event ({{ lastEvent }})</summary>
      <pre>{{ JSON.stringify(lastEventData, null, 2) }}</pre>
    </details>
  </div>
</template>

<style scoped>
.generated-form {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.generated-form__controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1rem 0;
  border: 1px solid var(--maz-color-bg-lighter);
  border-radius: 0.5rem;
}

.generated-form__debug {
  padding: 1rem;
  border: 1px solid var(--maz-color-bg-lighter);
  border-radius: 0.5rem;
}

.generated-form__debug pre {
  max-height: 300px;
  overflow: auto;
  font-size: 0.75rem;
}

.custom-slot-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px dashed var(--maz-color-primary);
  border-radius: 0.5rem;
}
</style>
