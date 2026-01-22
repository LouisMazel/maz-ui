<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { MazBtnProps } from 'maz-ui/components/MazBtn'
import type { FormValidatorOptions } from 'maz-ui/composables'
import type { Component, ComputedRef, Ref, VNode } from 'vue'
import type { FormBuilderState } from '../composables/useFormBuilder'
import type {
  ExtractedValidationOptions,
  FieldBlurEventPayload,
  FieldChangeEventPayload,
  FieldFocusEventPayload,
  FieldValidateEventPayload,
  FormComponentName,
  FormField as FormFieldType,
  FormResetEventPayload,
  FormSchema,
  FormSection as FormSectionType,
  FormSubmitErrorEventPayload,
  FormSubmitEventPayload,
  ValidationIssues,
  ValidationMode,
} from '../utils/schema-helpers'
import type { ErrorSummaryOptions, ErrorSummarySlotProps } from './FormErrorSummary.vue'
import { useFormValidator } from 'maz-ui/composables/useFormValidator'
import { computed, defineAsyncComponent, nextTick, provide, ref, shallowRef, toRef, useId, watch } from 'vue'
import { createSchemaAsyncComponents } from '../utils/component-map'
import { FORM_BUILDER_STATE_KEY, FORM_BUILDER_VALIDATION_KEY } from '../utils/constants'
import { extractValidationFromSchema, hasValidationRules } from '../utils/schema-helpers'
import FormErrorSummary from './FormErrorSummary.vue'
import FormSection from './FormSection.vue'

export type ErrorMessageValue = string | string[] | undefined

export interface FieldValidationState {
  blurred: boolean
  dirty: boolean
  error: boolean
  errors: ValidationIssues
  valid: boolean
  validating: boolean
  validated: boolean
  mode?: ValidationMode
}

export type FieldsValidationStates<TModel extends Record<string, unknown>> = Partial<
  Record<keyof TModel, FieldValidationState>
>

export interface SubmitButtonProps extends Omit<MazBtnProps, 'type'> {
  text?: string
}

export interface SubmitButtonSlotProps {
  submit: () => Promise<void>
  isSubmitting: boolean
  isValid: boolean
  isLoading: boolean
}

export interface SectionSlotProps<T extends Record<string, unknown>> {
  section: FormSectionType<T>
  model: T
  readonly: boolean
  disabled: boolean
}

export interface FieldSlotProps<T extends Record<string, unknown>> {
  field: FormFieldType<T, keyof T, FormComponentName>
  modelValue: T[keyof T]
  model: T
  readonly: boolean
  disabled: boolean
  updateValue: (value: T[keyof T]) => void
}

export interface FormBuilderProps<T extends Record<string, unknown>> {
  schema: FormSchema<T>
  readonly?: boolean
  disabled?: boolean
  submitButton?: SubmitButtonProps | false
  validationMode?: ValidationMode
  scrollToError?: string | false
  errorSummary?: ErrorSummaryOptions | boolean
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  /**
   * Optional unique identifier for the form instance.
   * When not provided, a unique ID is automatically generated.
   * Useful when you need to reference a specific form instance.
   */
  formId?: string
}

export interface FormBuilderValidationContext<T extends Record<string, unknown>> {
  fieldsStates: Ref<FieldsValidationStates<T>>
  errorMessages: ComputedRef<Partial<Record<keyof T, ErrorMessageValue>>>
  handleFieldBlur: (name: keyof T) => void
  isValid: ComputedRef<boolean>
  customMessages: Partial<Record<keyof T, Record<string, string>>>
  useMultipleErrorMessages: Partial<Record<keyof T, boolean>>
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FormBuilderProps<T>>(), {
  readonly: false,
  disabled: false,
  submitButton: undefined,
  validationMode: 'lazy',
  scrollToError: '.has-field-error',
  errorSummary: undefined,
  ariaLabel: undefined,
  ariaLabelledBy: undefined,
  ariaDescribedBy: undefined,
  formId: undefined,
})

const emit = defineEmits<{
  'submit': [payload: FormSubmitEventPayload<T>]
  'submitError': [payload: FormSubmitErrorEventPayload<T>]
  'update:modelValue': [value: T]
  'reset': [payload: FormResetEventPayload<T>]
  'fieldChange': [payload: FieldChangeEventPayload<T>]
  'fieldFocus': [payload: FieldFocusEventPayload<T>]
  'fieldBlur': [payload: FieldBlurEventPayload<T>]
  'fieldValidate': [payload: FieldValidateEventPayload<T>]
}>()

defineSlots<{
  'default'?: () => VNode[]
  'submit-button'?: (props: SubmitButtonSlotProps) => VNode[]
  'error-summary'?: (props: ErrorSummarySlotProps) => VNode[]
  'append-section'?: () => VNode[]
  [key: `section-${string}`]: (props: SectionSlotProps<T>) => VNode[]
  [key: `field-${string}`]: (props: FieldSlotProps<T>) => VNode[]
}>()

const model = defineModel<T>({ required: true })

const schema = toRef(props, 'schema')

const generatedId = useId()
const formUniqueId = computed(() => props.formId ?? generatedId)
const formRef = ref<HTMLFormElement | null>(null)
const liveRegionRef = ref<HTMLElement | null>(null)

const MazBtn = defineAsyncComponent(() => import('maz-ui/components/MazBtn'))

const asyncComponents = computed(() => {
  return createSchemaAsyncComponents(schema.value)
})

const componentsWithGlobalState = computed<Partial<Record<FormComponentName, Component>>>(() => {
  return asyncComponents.value
})

const hasSubmitButton = computed(() => {
  return props.submitButton !== false
})

const submitButtonProps = computed<MazBtnProps>(() => {
  const baseProps: MazBtnProps = {
    type: 'submit',
    disabled: props.disabled,
  }

  if (props.submitButton && typeof props.submitButton === 'object') {
    const btnProps: MazBtnProps = { ...props.submitButton }
    delete (btnProps as { text?: string }).text
    return { ...baseProps, ...btnProps }
  }

  return baseProps
})

const submitButtonText = computed(() => {
  if (props.submitButton && typeof props.submitButton === 'object' && props.submitButton.text) {
    return props.submitButton.text
  }
  return 'Submit'
})

const errorSummaryPosition = computed<'top' | 'bottom' | null>(() => {
  if (!props.errorSummary) {
    return null
  }
  if (typeof props.errorSummary === 'boolean') {
    return 'top'
  }
  return props.errorSummary.position ?? 'top'
})

const errorSummarySelector = computed<string>(() => {
  if (typeof props.errorSummary === 'boolean' || !props.errorSummary?.selector) {
    return '.has-field-error'
  }
  return props.errorSummary.selector
})

const liveRegionId = computed(() => `${formUniqueId.value}-live-region`)

const formAccessibilityAttrs = computed(() => {
  const attrs: Record<string, string | undefined> = {}

  if (props.ariaLabel) {
    attrs['aria-label'] = props.ariaLabel
  }
  if (props.ariaLabelledBy) {
    attrs['aria-labelledby'] = props.ariaLabelledBy
  }
  if (props.ariaDescribedBy) {
    attrs['aria-describedby'] = props.ariaDescribedBy
  }

  return attrs
})

interface ValidatorInstance {
  isValid: Ref<boolean>
  isDirty: Ref<boolean>
  isSubmitting: Ref<boolean>
  isSubmitted: Ref<boolean>
  fieldsStates: Ref<Record<string, FieldValidationState>>
  validateForm: (setErrors?: boolean) => Promise<boolean>
  resetForm: () => void
  scrollToError: (selector?: string) => void
}

const validatorRef = shallowRef<ValidatorInstance | null>(null)
const validationLoaded = ref(false)
const extractedOptions = shallowRef<ExtractedValidationOptions<T> | null>(null)

function initializeValidator(): void {
  const currentSchema = schema.value
  if (!hasValidationRules(currentSchema)) {
    validatorRef.value = null
    extractedOptions.value = null
    return
  }

  const extracted = extractValidationFromSchema(currentSchema)
  extractedOptions.value = extracted

  const validationSchema = extracted.schema

  const validatorMode = props.validationMode === 'change' || props.validationMode === 'submit'
    ? 'lazy'
    : props.validationMode

  const validatorOptions: FormValidatorOptions = {
    mode: validatorMode,
    scrollToError: props.scrollToError,
    identifier: 'form-builder-validator',
    debouncedFields: extracted.debouncedFields as FormValidatorOptions['debouncedFields'],
    throttledFields: extracted.throttledFields as FormValidatorOptions['throttledFields'],
    resetOnSuccess: false,
  }

  const validator = useFormValidator({
    schema: ref(validationSchema) as any,
    model: model as any,
    options: validatorOptions,
  })

  validatorRef.value = validator as unknown as ValidatorInstance

  validationLoaded.value = true
}

watch(
  schema,
  () => {
    initializeValidator()
  },
  { immediate: true, deep: true },
)

const fieldsStates = computed<FieldsValidationStates<T>>(() => {
  const validator = validatorRef.value
  if (validator) {
    return validator.fieldsStates.value as unknown as FieldsValidationStates<T>
  }
  return {} as FieldsValidationStates<T>
})

const errorMessages = computed<Partial<Record<keyof T, ErrorMessageValue>>>(() => {
  const validator = validatorRef.value
  const extracted = extractedOptions.value
  if (!validator) {
    return {}
  }

  const messages: Partial<Record<keyof T, ErrorMessageValue>> = {}
  const states = validator.fieldsStates.value

  for (const key in states) {
    const fieldKey = key as keyof T
    const state = states[key]

    if (!state?.error || state.errors.length === 0) {
      messages[fieldKey] = undefined
      continue
    }

    const customMsgs = extracted?.customMessages[fieldKey]
    const useMultiple = extracted?.useMultipleErrorMessages[fieldKey] ?? false

    const resolvedMessages = state.errors.map((issue: { type?: string, message: string }) => {
      const issueType = issue.type ?? 'unknown'
      if (customMsgs?.[issueType]) {
        return customMsgs[issueType]
      }
      return issue.message
    })

    if (useMultiple) {
      messages[fieldKey] = resolvedMessages
    }
    else {
      messages[fieldKey] = resolvedMessages[0]
    }
  }

  return messages
})

const isFormValid = computed<boolean>(() => {
  const validator = validatorRef.value
  if (validator) {
    return validator.isValid.value
  }
  return true
})

const isDirty = computed<boolean>(() => {
  const validator = validatorRef.value
  if (validator) {
    return validator.isDirty.value
  }
  return false
})

const isSubmitting = computed<boolean>(() => {
  const validator = validatorRef.value
  if (validator) {
    return validator.isSubmitting.value
  }
  return false
})

const isSubmitted = computed<boolean>(() => {
  const validator = validatorRef.value
  if (validator) {
    return validator.isSubmitted.value
  }
  return false
})

const isValidating = computed<boolean>(() => {
  const states = fieldsStates.value
  for (const key in states) {
    const state = states[key as keyof T]
    if (state?.validating) {
      return true
    }
  }
  return false
})

const errors = computed<Partial<Record<keyof T, ValidationIssues>>>(() => {
  const states = fieldsStates.value
  const result: Partial<Record<keyof T, ValidationIssues>> = {}
  for (const key in states) {
    const fieldKey = key as keyof T
    const state = states[fieldKey]
    if (state?.errors && state.errors.length > 0) {
      result[fieldKey] = state.errors
    }
  }
  return result
})

const errorCount = computed(() => {
  return Object.keys(errors.value).length
})

function handleFieldBlur(name: keyof T): void {
  const validator = validatorRef.value
  if (!validator) {
    return
  }

  const fieldState = validator.fieldsStates.value[name as string]
  if (fieldState) {
    fieldState.blurred = true
  }
}

const validationContext = computed<FormBuilderValidationContext<T>>(() => ({
  fieldsStates: ref(fieldsStates.value) as Ref<FieldsValidationStates<T>>,
  errorMessages,
  handleFieldBlur,
  isValid: isFormValid,
  customMessages: extractedOptions.value?.customMessages ?? {},
  useMultipleErrorMessages: extractedOptions.value?.useMultipleErrorMessages ?? {},
}))

provide(FORM_BUILDER_VALIDATION_KEY, validationContext)

const fieldsStatesRef = ref(fieldsStates.value) as Ref<FieldsValidationStates<T>>

watch(fieldsStates, (newValue) => {
  fieldsStatesRef.value = newValue
}, { deep: true })

function emitFieldChange(payload: FieldChangeEventPayload<T>): void {
  emit('fieldChange', payload)
}

function emitFieldFocus(payload: FieldFocusEventPayload<T>): void {
  emit('fieldFocus', payload)
}

function emitFieldBlurEvent(payload: FieldBlurEventPayload<T>): void {
  emit('fieldBlur', payload)
}

function emitFieldValidate(payload: FieldValidateEventPayload<T>): void {
  emit('fieldValidate', payload)
}

const formBuilderState = computed<FormBuilderState<T>>(() => ({
  formId: formUniqueId,
  isValid: isFormValid,
  isSubmitting: ref(isSubmitting.value),
  isSubmitted: ref(isSubmitted.value),
  isDirty,
  errors,
  errorMessages,
  fieldsStates: fieldsStatesRef,
  handleFieldBlur: (name: keyof T) => handleFieldBlur(name),
  emitFieldChange,
  emitFieldFocus,
  emitFieldBlur: emitFieldBlurEvent,
  emitFieldValidate,
}))

provide(FORM_BUILDER_STATE_KEY, formBuilderState)

function focusFirstErrorField(): void {
  if (!formRef.value) {
    return
  }

  const firstErrorField = formRef.value.querySelector('.has-field-error')
  if (!firstErrorField) {
    return
  }

  const focusableElement = firstErrorField.querySelector(
    'input, textarea, select, [tabindex]:not([tabindex="-1"])',
  )

  if (focusableElement instanceof HTMLElement) {
    focusableElement.focus()
  }
}

function announceToScreenReader(message: string): void {
  if (liveRegionRef.value) {
    liveRegionRef.value.textContent = message
  }
}

async function handleSubmit(): Promise<void> {
  if (props.disabled || props.readonly) {
    return
  }

  const validator = validatorRef.value
  let isValid = true

  if (validator) {
    validator.isSubmitted.value = true
    await validator.validateForm(true)
    isValid = validator.isValid.value

    if (!isValid && props.scrollToError) {
      validator.scrollToError(
        typeof props.scrollToError === 'string' ? props.scrollToError : undefined,
      )
    }
  }

  const submitPayload: FormSubmitEventPayload<T> = {
    data: model.value,
    isValid,
  }

  emit('submit', submitPayload)

  if (!isValid) {
    const submitErrorPayload: FormSubmitErrorEventPayload<T> = {
      data: model.value,
      errors: errors.value,
    }
    emit('submitError', submitErrorPayload)

    await nextTick()
    const errCount = errorCount.value
    const errorText = errCount === 1 ? 'error' : 'errors'
    announceToScreenReader(`Form submission failed. ${errCount} ${errorText} found. Please correct the errors and try again.`)
    focusFirstErrorField()
  }
  else {
    announceToScreenReader('Form submitted successfully.')
  }
}

function resetForm(): void {
  const validator = validatorRef.value
  if (validator) {
    validator.resetForm()
  }

  const resetPayload: FormResetEventPayload<T> = {
    data: model.value,
  }
  emit('reset', resetPayload)
}

async function validateForm(): Promise<boolean> {
  const validator = validatorRef.value
  if (validator) {
    await validator.validateForm(true)
    return validator.isValid.value
  }
  return true
}

async function validateField(name: keyof T): Promise<boolean> {
  const validator = validatorRef.value
  if (validator) {
    await validator.validateForm(true)
    const fieldState = validator.fieldsStates.value[name as string]
    return fieldState?.valid ?? true
  }
  return true
}

function resetValidation(): void {
  const validator = validatorRef.value
  if (validator) {
    validator.resetForm()
  }
}

const submitButtonSlotProps = computed<SubmitButtonSlotProps>(() => ({
  submit: handleSubmit,
  isSubmitting: isSubmitting.value,
  isValid: isFormValid.value,
  isLoading: isSubmitting.value || isValidating.value,
}))

const errorSummarySlotProps = computed<ErrorSummarySlotProps>(() => ({
  errors: errors.value,
  errorMessages: errorMessages.value,
  errorCount: errorCount.value,
  isSubmitted: isSubmitted.value,
}))

function getSectionSlotProps(section: FormSectionType<T>): SectionSlotProps<T> {
  return {
    section,
    model: model.value,
    readonly: props.readonly,
    disabled: props.disabled,
  }
}

defineExpose({
  formId: formUniqueId,
  validateForm,
  validateField,
  resetValidation,
  resetForm,
  isValid: isFormValid,
  isSubmitting,
  isSubmitted,
  isDirty,
  isValidating,
  errors,
  errorMessages,
  fieldsStates,
})
</script>

<template>
  <form
    ref="formRef"
    v-bind="formAccessibilityAttrs"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <div
      :id="liveRegionId"
      ref="liveRegionRef"
      class="maz-sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    />

    <!-- Error Summary slot (top position) -->
    <template v-if="errorSummaryPosition === 'top'">
      <slot name="error-summary" v-bind="errorSummarySlotProps">
        <FormErrorSummary
          :error-summary="{ position: 'top', selector: errorSummarySelector }"
        />
      </slot>
    </template>

    <!-- Sections with individual section slots -->
    <template v-for="section in schema.sections" :key="section.id">
      <slot :name="`section-${section.id}`" v-bind="getSectionSlotProps(section)">
        <FormSection
          v-model="model"
          :section="section"
          :model="model"
          :components="componentsWithGlobalState"
          :readonly="readonly"
          :disabled="disabled"
        >
          <!-- Pass field slots to FormSection -->
          <template v-for="field in section.fields" :key="String(field.name)" #[`field-${String(field.name)}`]="slotProps">
            <slot :name="`field-${String(field.name)}`" v-bind="slotProps" />
          </template>
        </FormSection>
      </slot>
    </template>

    <!-- Append section slot -->
    <slot name="append-section" />

    <!-- Error Summary slot (bottom position) -->
    <template v-if="errorSummaryPosition === 'bottom'">
      <slot name="error-summary" v-bind="errorSummarySlotProps">
        <FormErrorSummary
          :error-summary="{ position: 'bottom', selector: errorSummarySelector }"
        />
      </slot>
    </template>

    <!-- Default slot for additional content -->
    <slot />

    <!-- Submit button slot -->
    <slot name="submit-button" v-bind="submitButtonSlotProps">
      <MazBtn
        v-if="hasSubmitButton"
        v-bind="submitButtonProps"
      >
        {{ submitButtonText }}
      </MazBtn>
    </slot>
  </form>
</template>

<style scoped>
.maz-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
