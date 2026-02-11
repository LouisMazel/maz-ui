<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { MazBtnProps } from 'maz-ui/components/MazBtn'
import type { FormValidatorOptions, InferOutputSchemaFormValidator } from 'maz-ui/composables'
import type { Component, ComputedRef, Ref, VNode } from 'vue'
import type { ErrorMessageValue, FieldsValidationStates } from '../composables/useFormBuilder'
import type { FormBuilderStateContext, ValidationContext } from '../utils/constants'
import type {
  FieldBlurEventPayload,
  FieldChangeEventPayload,
  FieldFocusEventPayload,
  FieldValidateEventPayload,
  FormComponentName,
  FormResetEventPayload,
  FormSchema,
  FormSection as FormSectionType,
  FormSubmitErrorEventPayload,
  FormSubmitEventPayload,
} from '../utils/schema-helpers'
import type { ErrorSummaryOptions, ErrorSummarySlotProps } from './FormErrorSummary.vue'
import type { FieldSlotProps } from './FormSection.vue'
import { useFormValidator } from 'maz-ui/composables/useFormValidator'
import { computed, defineAsyncComponent, provide, ref, useId } from 'vue'
import { createSchemaAsyncComponents } from '../utils/component-map'
import { FORM_BUILDER_STATE_KEY, FORM_BUILDER_VALIDATION_KEY } from '../utils/constants'
import { extractValidationFromSchema } from '../utils/schema-helpers'
import FormSection from './FormSection.vue'

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

export interface FormBuilderProps<T extends Record<string, unknown>> {
  schema: FormSchema<T>
  readonly?: boolean
  disabled?: boolean
  submitButton?: SubmitButtonProps | false
  validationMode?: FormValidatorOptions<T>['mode']
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

const {
  schema,
  readonly = false,
  disabled = false,
  submitButton = undefined,
  validationMode = 'progressive',
  scrollToError = '.has-field-error',
  errorSummary = undefined,
  ariaLabel = undefined,
  ariaLabelledBy = undefined,
  ariaDescribedBy = undefined,
  formId = undefined,
} = defineProps<FormBuilderProps<T>>()

const emit = defineEmits<{
  'submit': [payload: FormSubmitEventPayload<T>]
  'submit-error': [payload: FormSubmitErrorEventPayload<T>]
  'update:model-value': [value: T]
  'reset': [payload: FormResetEventPayload<T>]
  'field-change': [payload: FieldChangeEventPayload<T>]
  'field-focus': [payload: FieldFocusEventPayload<T>]
  'field-blur': [payload: FieldBlurEventPayload<T>]
  'field-validate': [payload: FieldValidateEventPayload<T>]
}>()

defineSlots<{
  'default'?: () => VNode[]
  'submit-button'?: (props: SubmitButtonSlotProps) => VNode[]
  'error-summary'?: (props: ErrorSummarySlotProps) => VNode[]
  'append-section'?: () => VNode[]
  [key: `section-${string}`]: (props: SectionSlotProps<T>) => VNode[]
  [key: `field-${string}`]: (props: FieldSlotProps<T>) => VNode[]
}>()

const FormErrorSummary = defineAsyncComponent(() => import('./FormErrorSummary.vue'))

const modelValue = defineModel<T>({
  default: {},
})

const generatedId = useId()
const formUniqueId = computed(() => formId ?? generatedId)
const liveRegionRef = ref<HTMLElement | null>(null)

const MazBtn = defineAsyncComponent(() => import('maz-ui/components/MazBtn'))

const asyncComponents = computed(() => {
  return createSchemaAsyncComponents(schema)
})

const componentsWithGlobalState = computed<Partial<Record<FormComponentName, Component>>>(() => {
  return asyncComponents.value
})

const hasSubmitButton = computed(() => {
  return submitButton !== false
})

const submitButtonProps = computed<MazBtnProps>(() => {
  const baseProps: MazBtnProps = {
    type: 'submit',
    disabled,
  }

  if (submitButton && typeof submitButton === 'object') {
    const btnProps: MazBtnProps = { ...submitButton }
    delete (btnProps as { text?: string }).text
    return { ...baseProps, ...btnProps }
  }

  return baseProps
})

const submitButtonText = computed(() => {
  if (submitButton && typeof submitButton === 'object' && submitButton.text) {
    return submitButton.text
  }
  return 'Submit'
})

const errorSummaryPosition = computed<'top' | 'bottom' | null>(() => {
  if (!errorSummary) {
    return null
  }
  if (typeof errorSummary === 'boolean') {
    return 'top'
  }
  return errorSummary.position ?? 'top'
})

const errorSummarySelector = computed<string>(() => {
  if (typeof errorSummary === 'boolean' || !errorSummary?.selector) {
    return '.has-field-error'
  }
  return errorSummary.selector
})

const liveRegionId = computed(() => `${formUniqueId.value}-live-region`)

const formAccessibilityAttrs = computed(() => {
  const attrs: Record<string, string | undefined> = {}

  if (ariaLabel) {
    attrs['aria-label'] = ariaLabel
  }
  if (ariaLabelledBy) {
    attrs['aria-labelledby'] = ariaLabelledBy
  }
  if (ariaDescribedBy) {
    attrs['aria-describedby'] = ariaDescribedBy
  }

  return attrs
})

const extracted = extractValidationFromSchema(schema)

const {
  handleSubmit,
  fieldsStates,
  isValid,
  errorMessages,
  isDirty,
  model,
  isSubmitted,
  isSubmitting,
  errors,
  resetForm,
  validateForm,
} = useFormValidator({
  schema: extracted.schema,
  model: modelValue,
  defaultValues: {},
  options: {
    mode: validationMode,
    scrollToError,
    identifier: 'form-builder-validator',
    debouncedFields: extracted.debouncedFields,
    throttledFields: extracted.throttledFields,
    resetOnSuccess: false,
  },
})

// const isValidating = computed<boolean>(() => false)

const errorCount = computed(() => {
  return Object.keys(errors.value).length
})

const validationContext = computed(() => ({
  fieldsStates: fieldsStates.value,
  errorMessages: errorMessages.value,
  handleFieldBlur,
  isValid: isValid.value,
  customMessages: extracted.customMessages,
  useMultipleErrorMessages: extracted.useMultipleErrorMessages,
} satisfies ValidationContext<T>))

provide(FORM_BUILDER_VALIDATION_KEY, validationContext)

function emitFieldChange(payload: FieldChangeEventPayload<T>): void {
  emit('field-change', payload)
}

function emitFieldFocus(payload: FieldFocusEventPayload<T>): void {
  emit('field-focus', payload)
}

function emitFieldBlur(payload: FieldBlurEventPayload<T>): void {
  emit('field-blur', payload)
}

function emitFieldValidate(payload: FieldValidateEventPayload<T>): void {
  emit('field-validate', payload)
}

function handleFieldBlur(name: keyof T): void {
  emit('field-blur', { name })
}

const formBuilderState = computed(() => ({
  formId: formUniqueId.value,
  isValid: isValid.value,
  isSubmitting: isSubmitting.value,
  isSubmitted: isSubmitted.value,
  isDirty: isDirty.value,
  errors: errors.value,
  errorMessages: errorMessages.value,
  fieldsStates: fieldsStates.value,
  handleFieldBlur: (name: keyof T) => handleFieldBlur(name),
  emitFieldChange,
  emitFieldFocus,
  emitFieldBlur,
  emitFieldValidate,
} satisfies FormBuilderStateContext<T>))

provide(FORM_BUILDER_STATE_KEY, formBuilderState)

function announceToScreenReader(message: string): void {
  if (liveRegionRef.value) {
    liveRegionRef.value.textContent = message
  }
}

const submitForm = handleSubmit((payload) => {
  emit('submit', {
    data: payload as unknown as T,
    isValid: isValid.value,
  } satisfies FormSubmitEventPayload<T>)
}, undefined, {
  onError: (payload) => {
    emit('submit-error', {
      data: payload as unknown as T,
      errors: errorMessages.value,
    } satisfies FormSubmitErrorEventPayload<T>)
  },
})

// const submitPayload: FormSubmitEventPayload<T> = {
//   data: model.value,
//   isValid: isValid.value,
// }

// const submitErrorPayload = {
//   data: model.value,
//   errors: errors.value,
// }
// emit('submitError', submitErrorPayload)
// emit('submit', submitPayload)
// if (!isValid) {

//   await nextTick()
//   const errCount = errorCount.value
//   const errorText = errCount === 1 ? 'error' : 'errors'
//   announceToScreenReader(`Form submission failed. ${errCount} ${errorText} found. Please correct the errors and try again.`)
// }
// else {
//   announceToScreenReader('Form submitted successfully.')
// }

const submitButtonSlotProps = computed<SubmitButtonSlotProps>(() => ({
  submit: submitForm,
  isSubmitting: isSubmitting.value,
  isValid: isValid.value,
  isLoading: isSubmitting.value,
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
    model: modelValue.value,
    readonly,
    disabled,
  }
}

defineExpose({
  formId: formUniqueId,
  validateForm,
  resetForm,
  isValid,
  isSubmitting,
  isSubmitted,
  isDirty,
  errors,
  errorMessages,
  fieldsStates,
})
</script>

<template>
  <form
    v-bind="formAccessibilityAttrs"
    novalidate
    class="form-builder"
    @submit.prevent="submitForm"
  >
    <div
      :id="liveRegionId"
      ref="liveRegionRef"
      class="maz-sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    />

    errorSummaryPosition: {{ errorSummaryPosition }}

    <!-- Error Summary slot (top position) -->
    <template v-if="errorSummaryPosition === 'top'">
      <slot name="error-summary" v-bind="errorSummarySlotProps">
        <FormErrorSummary
          :error-summary="{
            position: 'top',
            selector: errorSummarySelector,
          }"
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
.form-builder {
  display: inline-flex;
  flex-direction: column;
  gap: 1rem;
}

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
