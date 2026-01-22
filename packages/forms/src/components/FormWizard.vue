<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { MazBtnProps } from 'maz-ui/components/MazBtn'
import type { MazStepperProps, MazStepperStep } from 'maz-ui/components/MazStepper'
import type { FormValidatorOptions } from 'maz-ui/composables'
import type { Component, Ref, VNode } from 'vue'
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
  StepChangeEventPayload,
  StepErrorEventPayload,
  StepValidateEventPayload,
  ValidationIssues,
  ValidationMode,
  WizardStep,
} from '../utils/schema-helpers'
import type {
  ErrorMessageValue,
  FieldsValidationStates,
  FieldValidationState,
  FormBuilderValidationContext,
} from './FormBuilder.vue'
import type { ErrorSummaryOptions, ErrorSummarySlotProps } from './FormErrorSummary.vue'
import { useFormValidator } from 'maz-ui/composables/useFormValidator'
import { computed, defineAsyncComponent, nextTick, provide, ref, shallowRef, toRef, useId, watch } from 'vue'
import { createSchemaAsyncComponents } from '../utils/component-map'
import { FORM_BUILDER_STATE_KEY, FORM_BUILDER_VALIDATION_KEY } from '../utils/constants'
import { extractValidationFromSchema, hasValidationRules } from '../utils/schema-helpers'
import FormErrorSummary from './FormErrorSummary.vue'
import FormSection from './FormSection.vue'

export interface WizardNavigationProps {
  previousButton?: Omit<MazBtnProps, 'type' | 'onClick'> | false
  nextButton?: Omit<MazBtnProps, 'type' | 'onClick'> | false
  submitButton?: Omit<MazBtnProps, 'type'> | false
  previousText?: string
  nextText?: string
  submitText?: string
}

export interface StepperDisplayOptions {
  enabled?: boolean
  props?: Omit<MazStepperProps, 'modelValue' | 'steps'>
}

export interface FormWizardProps<T extends Record<string, unknown>> {
  schema: FormSchema<T>
  readonly?: boolean
  disabled?: boolean
  validationMode?: ValidationMode
  scrollToError?: string | false
  errorSummary?: ErrorSummaryOptions | boolean
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  formId?: string
  navigation?: WizardNavigationProps
  stepper?: StepperDisplayOptions | boolean
  validateOnStepChange?: boolean
  allowStepNavigation?: boolean
  initialStep?: number
}

export interface WizardNavigationSlotProps {
  currentStep: number
  totalSteps: number
  isFirstStep: boolean
  isLastStep: boolean
  canGoNext: boolean
  canGoPrevious: boolean
  goToStep: (step: number) => Promise<boolean>
  goNext: () => Promise<boolean>
  goPrevious: () => void
  submit: () => Promise<void>
  isSubmitting: boolean
  isValid: boolean
  isStepValid: boolean
}

export interface StepperSlotProps<TModel extends Record<string, unknown>> {
  currentStep: number
  totalSteps: number
  steps: WizardStep<TModel>[]
  goToStep: (step: number) => Promise<boolean>
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

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FormWizardProps<T>>(), {
  readonly: false,
  disabled: false,
  validationMode: 'lazy',
  scrollToError: '.has-field-error',
  errorSummary: undefined,
  ariaLabel: undefined,
  ariaLabelledBy: undefined,
  ariaDescribedBy: undefined,
  formId: undefined,
  navigation: undefined,
  stepper: true,
  validateOnStepChange: true,
  allowStepNavigation: false,
  initialStep: 1,
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
  'stepChange': [payload: StepChangeEventPayload]
  'stepValidate': [payload: StepValidateEventPayload]
  'stepError': [payload: StepErrorEventPayload]
}>()

defineSlots<{
  'default'?: () => VNode[]
  'navigation'?: (props: WizardNavigationSlotProps) => VNode[]
  'stepper'?: (props: StepperSlotProps<T>) => VNode[]
  'error-summary'?: (props: ErrorSummarySlotProps) => VNode[]
  'step-header'?: (props: { step: WizardStep<T>, index: number }) => VNode[]
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
const MazStepper = defineAsyncComponent(() => import('maz-ui/components/MazStepper'))

const asyncComponents = computed(() => {
  return createSchemaAsyncComponents(schema.value)
})

const componentsWithGlobalState = computed<Partial<Record<FormComponentName, Component>>>(() => {
  return asyncComponents.value
})

const currentStep = ref(props.initialStep)
const totalSteps = computed(() => schema.value.sections.length)
const isFirstStep = computed(() => currentStep.value === 1)
const isLastStep = computed(() => currentStep.value === totalSteps.value)

const wizardSteps = computed<WizardStep<T>[]>(() => {
  return schema.value.sections.map((section, index) => ({
    id: section.id,
    legend: section.legend,
    index: index + 1,
    fields: section.fields,
    completed: index + 1 < currentStep.value,
    hasError: hasStepErrors(index + 1),
  }))
})

const currentSection = computed(() => {
  return schema.value.sections[currentStep.value - 1]
})

const stepperSteps = computed<MazStepperStep[]>(() => {
  return wizardSteps.value.map(step => ({
    title: step.legend ?? `Step ${step.index}`,
    success: step.completed && !step.hasError,
    error: step.hasError,
  }))
})

const showStepper = computed(() => {
  if (typeof props.stepper === 'boolean') {
    return props.stepper
  }
  return props.stepper?.enabled !== false
})

const stepperProps = computed(() => {
  if (typeof props.stepper === 'object' && props.stepper.props) {
    return props.stepper.props
  }
  return {}
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
    identifier: 'form-wizard-validator',
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

function resolveFieldErrorMessages(
  state: FieldValidationState,
  customMsgs: Record<string, string> | undefined,
  useMultiple: boolean,
): ErrorMessageValue {
  const resolvedMessages = state.errors.map((issue: { type?: string, message: string }) => {
    const issueType = issue.type ?? 'unknown'
    return customMsgs?.[issueType] ?? issue.message
  })

  return useMultiple ? resolvedMessages : resolvedMessages[0]
}

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

    messages[fieldKey] = resolveFieldErrorMessages(state, customMsgs, useMultiple)
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

function getStepFieldNames(stepIndex: number): (keyof T)[] {
  const section = schema.value.sections[stepIndex - 1]
  if (!section) {
    return []
  }
  return section.fields.map(field => field.name)
}

function getStepErrors(stepIndex: number): Partial<Record<keyof T, ValidationIssues>> {
  const fieldNames = getStepFieldNames(stepIndex)
  const stepErrors: Partial<Record<keyof T, ValidationIssues>> = {}

  for (const name of fieldNames) {
    if (errors.value[name]) {
      stepErrors[name] = errors.value[name]
    }
  }

  return stepErrors
}

function hasStepErrors(stepIndex: number): boolean {
  return Object.keys(getStepErrors(stepIndex)).length > 0
}

const isCurrentStepValid = computed<boolean>(() => {
  return !hasStepErrors(currentStep.value)
})

async function validateStep(stepIndex: number): Promise<boolean> {
  const validator = validatorRef.value
  if (!validator) {
    emit('stepValidate', { step: stepIndex, isValid: true, errors: {} })
    return true
  }

  await validator.validateForm(true)

  const stepErrors = getStepErrors(stepIndex)
  const isValid = Object.keys(stepErrors).length === 0

  emit('stepValidate', { step: stepIndex, isValid, errors: stepErrors })

  if (!isValid) {
    emit('stepError', { step: stepIndex, errors: stepErrors })
  }

  return isValid
}

function scrollToFirstError(): void {
  if (!props.scrollToError) {
    return
  }

  const validator = validatorRef.value
  if (!validator) {
    return
  }

  const selector = typeof props.scrollToError === 'string' ? props.scrollToError : undefined
  validator.scrollToError(selector)
}

function isValidStepRange(step: number): boolean {
  return step >= 1 && step <= totalSteps.value
}

async function goToStep(step: number): Promise<boolean> {
  if (!isValidStepRange(step) || step === currentStep.value) {
    return step === currentStep.value
  }

  const previousStep = currentStep.value
  const isMovingForward = step > currentStep.value

  if (props.validateOnStepChange && isMovingForward) {
    const isValid = await validateStep(currentStep.value)
    if (!isValid) {
      scrollToFirstError()
      return false
    }
  }

  currentStep.value = step
  emit('stepChange', { previousStep, currentStep: step })

  await nextTick()
  const stepLabel = currentSection.value?.legend ?? `Step ${step}`
  announceToScreenReader(`Step ${step} of ${totalSteps.value}: ${stepLabel}`)

  return true
}

function goNext(): Promise<boolean> {
  if (isLastStep.value) {
    return Promise.resolve(false)
  }
  return goToStep(currentStep.value + 1)
}

function goPrevious(): void {
  if (isFirstStep.value) {
    return
  }
  goToStep(currentStep.value - 1)
}

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

  currentStep.value = props.initialStep

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

const navigationSlotProps = computed<WizardNavigationSlotProps>(() => ({
  currentStep: currentStep.value,
  totalSteps: totalSteps.value,
  isFirstStep: isFirstStep.value,
  isLastStep: isLastStep.value,
  canGoNext: !isLastStep.value,
  canGoPrevious: !isFirstStep.value,
  goToStep,
  goNext,
  goPrevious,
  submit: handleSubmit,
  isSubmitting: isSubmitting.value,
  isValid: isFormValid.value,
  isStepValid: isCurrentStepValid.value,
}))

const stepperSlotProps = computed<StepperSlotProps<T>>(() => ({
  currentStep: currentStep.value,
  totalSteps: totalSteps.value,
  steps: wizardSteps.value,
  goToStep,
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

const previousButtonProps = computed<MazBtnProps>(() => {
  const baseProps: MazBtnProps = {
    type: 'button',
    disabled: props.disabled || isFirstStep.value,
    outlined: true,
  }

  if (props.navigation?.previousButton && typeof props.navigation.previousButton === 'object') {
    return { ...baseProps, ...props.navigation.previousButton }
  }

  return baseProps
})

const nextButtonProps = computed<MazBtnProps>(() => {
  const baseProps: MazBtnProps = {
    type: 'button',
    disabled: props.disabled || isLastStep.value,
  }

  if (props.navigation?.nextButton && typeof props.navigation.nextButton === 'object') {
    return { ...baseProps, ...props.navigation.nextButton }
  }

  return baseProps
})

const submitButtonProps = computed<MazBtnProps>(() => {
  const baseProps: MazBtnProps = {
    type: 'submit',
    disabled: props.disabled,
  }

  if (props.navigation?.submitButton && typeof props.navigation.submitButton === 'object') {
    return { ...baseProps, ...props.navigation.submitButton }
  }

  return baseProps
})

const previousText = computed(() => props.navigation?.previousText ?? 'Previous')
const nextText = computed(() => props.navigation?.nextText ?? 'Next')
const submitText = computed(() => props.navigation?.submitText ?? 'Submit')

const showPreviousButton = computed(() => props.navigation?.previousButton !== false)
const showNextButton = computed(() => props.navigation?.nextButton !== false)
const showSubmitButton = computed(() => props.navigation?.submitButton !== false)

function handleStepperClick(step: number): void {
  if (props.allowStepNavigation) {
    goToStep(step)
  }
}

defineExpose({
  formId: formUniqueId,
  validateForm,
  validateField,
  validateStep,
  resetValidation,
  resetForm,
  goToStep,
  goNext,
  goPrevious,
  currentStep,
  totalSteps,
  isFirstStep,
  isLastStep,
  isCurrentStepValid,
  isValid: isFormValid,
  isSubmitting,
  isSubmitted,
  isDirty,
  isValidating,
  errors,
  errorMessages,
  fieldsStates,
  wizardSteps,
})
</script>

<template>
  <form
    ref="formRef"
    v-bind="formAccessibilityAttrs"
    class="maz-form-wizard"
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

    <!-- Stepper slot -->
    <slot name="stepper" v-bind="stepperSlotProps">
      <MazStepper
        v-if="showStepper"
        :model-value="currentStep"
        :steps="stepperSteps"
        :disabled-previous-steps="!allowStepNavigation"
        :disabled-next-steps="!allowStepNavigation"
        auto-validate-steps
        v-bind="stepperProps"
        class="maz-form-wizard__stepper"
        @update:model-value="handleStepperClick"
      />
    </slot>

    <!-- Error Summary slot (top position) -->
    <template v-if="errorSummaryPosition === 'top'">
      <slot name="error-summary" v-bind="errorSummarySlotProps">
        <FormErrorSummary
          :error-summary="{ position: 'top', selector: errorSummarySelector }"
        />
      </slot>
    </template>

    <!-- Current step section -->
    <div
      class="maz-form-wizard__step"
      role="tabpanel"
      :aria-label="`Step ${currentStep} of ${totalSteps}`"
    >
      <slot :name="`section-${currentSection?.id}`" v-bind="getSectionSlotProps(currentSection)">
        <FormSection
          v-if="currentSection"
          v-model="model"
          :section="currentSection"
          :model="model"
          :components="componentsWithGlobalState"
          :readonly="readonly"
          :disabled="disabled"
        >
          <!-- Pass field slots to FormSection -->
          <template v-for="field in currentSection.fields" :key="String(field.name)" #[`field-${String(field.name)}`]="slotProps">
            <slot :name="`field-${String(field.name)}`" v-bind="slotProps" />
          </template>
        </FormSection>
      </slot>
    </div>

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

    <!-- Navigation slot -->
    <slot name="navigation" v-bind="navigationSlotProps">
      <div class="maz-form-wizard__navigation">
        <MazBtn
          v-if="showPreviousButton"
          v-bind="previousButtonProps"
          @click="goPrevious"
        >
          {{ previousText }}
        </MazBtn>

        <MazBtn
          v-if="showNextButton && !isLastStep"
          v-bind="nextButtonProps"
          @click="goNext"
        >
          {{ nextText }}
        </MazBtn>

        <MazBtn
          v-if="showSubmitButton && isLastStep"
          v-bind="submitButtonProps"
        >
          {{ submitText }}
        </MazBtn>
      </div>
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

.maz-form-wizard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__stepper {
    margin-bottom: 1rem;
  }

  &__step {
    min-height: 100px;
  }

  &__navigation {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }
}
</style>
