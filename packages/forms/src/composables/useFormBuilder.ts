import type { FormValidatorOptions } from 'maz-ui/composables'
import type { ComputedRef, Ref } from 'vue'
import type {
  FieldBlurEventPayload,
  FieldChangeEventPayload,
  FieldFocusEventPayload,
  FieldValidateEventPayload,
  ValidationIssues,
} from '../utils/schema-helpers'
import { inject } from 'vue'
import { FORM_BUILDER_STATE_KEY } from '../utils/constants'

export type ErrorMessageValue = string | string[] | undefined

export interface FieldValidationState<T extends Record<string, unknown>> {
  blurred: boolean
  dirty: boolean
  error: boolean
  errors: ValidationIssues
  valid: boolean
  validating: boolean
  validated: boolean
  mode?: FormValidatorOptions<T>['mode']
}

export type FieldsValidationStates<T extends Record<string, unknown>> = Partial<
  Record<keyof T, FieldValidationState<T>>
>

export interface FormBuilderState<T extends Record<string, unknown>> {
  formId: ComputedRef<string>
  isValid: ComputedRef<boolean>
  isSubmitting: Ref<boolean>
  isSubmitted: Ref<boolean>
  isDirty: ComputedRef<boolean>
  errors: ComputedRef<Partial<Record<keyof T, ValidationIssues>>>
  errorMessages: ComputedRef<Partial<Record<keyof T, ErrorMessageValue>>>
  fieldsStates: Ref<FieldsValidationStates<T>>
  handleFieldBlur: (name: keyof T) => void
  emitFieldChange: (payload: FieldChangeEventPayload<T>) => void
  emitFieldFocus: (payload: FieldFocusEventPayload<T>) => void
  emitFieldBlur: (payload: FieldBlurEventPayload<T>) => void
  emitFieldValidate: (payload: FieldValidateEventPayload<T>) => void
}

export function useFormBuilder<T extends Record<string, unknown>>(): FormBuilderState<T> | undefined {
  return inject<ComputedRef<FormBuilderState<T>> | undefined>(FORM_BUILDER_STATE_KEY, undefined)?.value
}
