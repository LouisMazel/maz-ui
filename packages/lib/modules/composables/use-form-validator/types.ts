import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  InferIssue,
  ObjectSchema,
  ObjectSchemaAsync,
} from 'valibot'
import type { ComponentPublicInstance, Ref } from 'vue'

import type { useFormField, useFormValidator } from './index'

export type ValidationSync = BaseSchema<unknown, unknown, BaseIssue<unknown>>
export type ValidationAsync = ValidationSync | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
export type Validation = ValidationAsync

export type ObjectValidationSchema<
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
> =
  | ObjectSchemaAsync<Record<ModelKey, ValidationAsync>, ErrorMessage<BaseIssue<unknown>> | undefined>
  | ObjectSchema<Record<string, ValidationSync>, ErrorMessage<BaseIssue<unknown>> | undefined>

export type ValidationIssues = InferIssue<Validation>[]

export type ExtractModelKey<T> = Extract<keyof T, string>

export interface Options<
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
> {
  /**
   * Validation mode
   * - eager: validate on blur at first (only if the field is not empty) and then on input value change
   * - lazy: validate on input value change
   * - aggressive: validate all fields immediately on form creation and on input value change
   * - onBlur: validate on blur
   * - onInput: validate on input value change
   * @default 'eager'
   */
  mode?: 'eager' | 'lazy' | 'aggressive' | 'onBlur' | 'onInput'
  /**
   * Fields that should be throttled
   * Useful for fields that require a network request to avoid spamming the server
   * It's an object with the field name as key and the throttle time in milliseconds as value or true to use the default throttle time
   */
  throttledFields?: Partial<Record<ModelKey, number | true>> | null
  /**
   * Fields that should be debounced
   * Useful to wait for the user to finish typing before validating the field
   * It's an object with the field name as key and the debounce time in milliseconds as value or true to use the default debounce time
   */
  debouncedFields?: Partial<Record<ModelKey, number | true>> | null
  /**
   * Scroll to the first error found
   * @default '.has-input-error'
   */
  scrollToErrorSelector?: string
}
export type StrictOptions<Model extends BaseFormPayload = BaseFormPayload> = Required<Options<Model>>

export interface FormContext<
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
> {
  handleFieldInput: (name: ModelKey, force?: boolean) => void
  handleFieldBlur: (name: ModelKey, force?: boolean) => void
  addFieldValidationWatch: (name: ModelKey) => void
  setFieldValidationState: (name: ModelKey, setError?: boolean) => void
  validateField: (name: ModelKey) => void
  fieldsStates: FieldsStates<Model>
  options: StrictOptions
  schema: Ref<ObjectValidationSchema<Model>>
  payload: Ref<Model>
}

export interface FieldState<Model extends BaseFormPayload, FieldType = Model[ExtractModelKey<Model>]> {
  blurred: boolean
  dirty: boolean
  error: boolean
  errors: ValidationIssues
  valid: boolean
  initialValue?: FieldType | Readonly<FieldType>
  validating: boolean
  validated: boolean
  mode: StrictOptions['mode'] | 'none'
}

export type FieldsStates<
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
> = Record<ModelKey, FieldState<Model>>

export type BaseFormPayload = Record<string, any>

export interface FormFieldOptions<T> {
  mode?: StrictOptions['mode'] | 'none'
  defaultValue?: T
  componentRef?: Ref<ComponentPublicInstance | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | undefined>
}

export type UseFormValidator<T extends BaseFormPayload = BaseFormPayload> = typeof useFormValidator<T>
export type UseFormField<T extends BaseFormPayload = BaseFormPayload> = typeof useFormField<T>
