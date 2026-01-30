import type { FieldsStates, FormSchema, InferSchemaFormValidator } from 'maz-ui/composables'
import type { ExtractModelKey } from 'maz-ui/composables/useFormValidator/types'
import type { useFormValidator } from 'maz-ui/src/composables/useFormValidator.js'
import type { ComputedRef, InjectionKey } from 'vue'

export interface ValidationContext<T extends Record<string, unknown> = Record<string, unknown>> {
  fieldsStates: FieldsStates<InferSchemaFormValidator<FormSchema<T>>, ExtractModelKey<FormSchema<InferSchemaFormValidator<FormSchema<T>>>>>
  errorMessages: Record<ExtractModelKey<FormSchema<InferSchemaFormValidator<FormSchema<T>>>>, string | undefined>
  handleFieldBlur: (name: keyof T) => void
  isValid: boolean
  customMessages: Partial<T>
  useMultipleErrorMessages: Partial<T>
}
export const FORM_BUILDER_VALIDATION_KEY: InjectionKey<ComputedRef<ValidationContext>> = Symbol('formBuilderValidation')

type ValidatorReturn<T extends Record<string, unknown>> = ReturnType<typeof useFormValidator<FormSchema<T>>>

export interface FormBuilderStateContext<T extends Record<string, unknown> = Record<string, unknown>> {
  formId: string
  isValid: boolean
  isSubmitting: boolean
  isSubmitted: boolean
  isDirty: boolean
  errors: ValidatorReturn<T>['errors']['value']
  errorMessages: ValidatorReturn<T>['errorMessages']['value']
  fieldsStates: ValidatorReturn<T>['fieldsStates']['value']
}

export const FORM_BUILDER_STATE_KEY: InjectionKey<ComputedRef<FormBuilderStateContext>> = Symbol('formBuilderState')
