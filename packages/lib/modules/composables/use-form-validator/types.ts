import type { BaseIssue, BaseSchema, BaseSchemaAsync, InferIssue } from 'valibot'
import type {
  ComponentInternalInstance,
  ComponentPublicInstance,
  InjectionKey,
  MaybeRefOrGetter,
  ModelRef,
  Ref,
} from 'vue'

import type { getValidateFunction } from './utils'
import type { useFormField, useFormValidator } from './index'

export type ValidationSync = BaseSchema<unknown, unknown, BaseIssue<unknown>>
export type ValidationAsync = ValidationSync | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>
export type Validation = ValidationAsync

export type ValidationIssues = InferIssue<Validation>[]

export type FormSchema<Model extends BaseFormPayload> = Record<ExtractModelKey<Model>, Validation>

export type ExtractModelKey<T> = Extract<keyof T, string>

export type CustomInstance<Model extends BaseFormPayload> = ComponentInternalInstance & {
  formContexts?: Map<string | symbol | InjectionKey<FormContext<Model>>, FormContext<Model>>
}
export type FormContextInjectionKey<Model extends BaseFormPayload = BaseFormPayload> = InjectionKey<FormContext<Model>>

export interface FormValidatorOptions<
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
> {
  /**
   * Validation mode
   * - eager: validate on blur at first (only if the field is not empty) and then on input value change
   * - lazy: validate on input value change
   * - aggressive: validate all fields immediately on form creation and on input value change
   * - blur: validate on blur
   * - input: validate on input value change
   * @default 'lazy'
   */
  mode?: 'eager' | 'lazy' | 'aggressive' | 'blur' | 'input' | 'none'
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
   * @default '.has-field-error'
   */
  scrollToError?: string | false
  /**
   * Identifier to use for the form
   * Useful to have multiple forms on the same page
   */
  identifier?: string | symbol | InjectionKey<FormContext>
}
export type StrictOptions<Model extends BaseFormPayload = BaseFormPayload> = Required<FormValidatorOptions<Model>>

export interface FormContext<
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
> {
  addFieldValidationWatch: (name: ModelKey) => void
  fieldsStates: Ref<FieldsStates<Model>>
  options: StrictOptions
  internalSchema: Ref<FormSchema<Model>>
  payload: Ref<Model>
  errorMessages: Ref<Record<ModelKey, string | undefined>>
  isSubmitted: Ref<boolean>
}

export interface FieldState<Model extends BaseFormPayload, FieldType = Model[ExtractModelKey<Model>]> {
  blurred: boolean
  dirty: boolean
  error: boolean
  errors: ValidationIssues
  valid: boolean
  initialValue?: Readonly<FieldType>
  validating: boolean
  validated: boolean
  validateFunction: ReturnType<typeof getValidateFunction<Model>>
  mode: StrictOptions['mode']
}

export type FieldsStates<Model extends BaseFormPayload = BaseFormPayload> = Record<
  ExtractModelKey<Model>,
  FieldState<Model>
>

export type BaseFormPayload = Record<string, any>

export interface FormFieldOptions<FieldType = unknown> {
  mode?: StrictOptions['mode']
  /** Default value for the field */
  defaultValue?: FieldType
  /**
   * Identifier to use for the form
   * Useful to have multiple forms on the same page
   */
  formIdentifier?: string | symbol | InjectionKey<FormContext>
  /** Ref to the component instance or the input element */
  componentRef?: Ref<ComponentPublicInstance | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | undefined>
}

export type UseFormValidator<Model extends BaseFormPayload = BaseFormPayload> = typeof useFormValidator<Model>
export interface UseFormValidatorParams<Model extends BaseFormPayload> {
  schema: MaybeRefOrGetter<FormSchema<Model>>
  model?: Ref<Partial<Model>> | ModelRef<Partial<Model>>
  defaultValues?: Partial<Model>
  options?: FormValidatorOptions<Model>
}
export type UseFormField<
  FieldType extends Model[ExtractModelKey<Model>],
  Model extends BaseFormPayload = BaseFormPayload,
> = typeof useFormField<FieldType, Model>
