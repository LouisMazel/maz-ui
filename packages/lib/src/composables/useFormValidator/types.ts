import type { BaseIssue, BaseSchema, BaseSchemaAsync, InferInput, InferIssue, InferOutput, objectAsync } from 'valibot'
import type {
  ComponentInternalInstance,
  ComponentPublicInstance,
  InjectionKey,
  Ref,
  TemplateRef,
} from 'vue'
import type { getValidateFunction } from './validation'

export type Validation = BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>

export type ValidationIssues = InferIssue<Validation>[]

export type ExtractModelKey<T> = Extract<keyof T, string>

export type FormSchema<Model = BaseFormPayload> = {
  [K in Extract<keyof Model, string> as Model[K] extends Required<Model>[K] ? K : never]: Validation
} & {
  [K in Extract<keyof Model, string> as Model[K] extends Required<Model>[K] ? never : K]?: Validation
}

export type CustomInstance<Model extends BaseFormPayload> = ComponentInternalInstance & {
  formContexts?: Map<string | symbol | InjectionKey<FormContext<Model>>, FormContext<Model>>
}

export interface FormValidatorOptions<
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
> {
  /**
   * Validation mode
   * - lazy: validate on input value change
   * - aggressive: validate all fields immediately on form creation and on input value change
   * - blur: validate on blur
   * - eager: validate on blur at first (only if the field is not empty) and then on input value change
   * - progressive: field becomes valid after the first validation and then validate on input value change. If invalid validate on blur.
   * @default 'lazy'
   */
  mode?: 'eager' | 'lazy' | 'aggressive' | 'blur' | 'progressive'
  /**
   * Fields to validate with throttling
   * Useful for fields that require a network request to avoid spamming the server
   * @example { name: 1000 } or { name: true } for the default throttle time (1000ms)
   */
  throttledFields?: Partial<Record<ModelKey, number | true>> | null
  /**
   * Fields to validate with debouncing
   * Useful to wait for the user to finish typing before validating
   * Useful for fields that require a network request to avoid spamming the server
   * @example { name: 300 } or { name: true } for the default debounce time (300ms)
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
   * @default `main-form-validator`
   */
  identifier?: string | symbol
}
export type StrictOptions<Model extends BaseFormPayload = BaseFormPayload> = Required<FormValidatorOptions<Model>>

export interface FormContext<
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
> {
  fieldsStates: Ref<FieldsStates<Model>>
  options: StrictOptions
  internalSchema: Ref<FormSchema<Model>>
  payload: Ref<Model>
  errorMessages: Ref<Record<ModelKey, string | undefined>>
  isSubmitted: Ref<boolean>
}

export interface FieldState<Model extends BaseFormPayload, FieldType = Model[ExtractModelKey<FormSchema<Model>>]> {
  blurred: boolean
  dirty: boolean
  error: boolean
  errors: ValidationIssues
  valid: boolean
  initialValue?: Readonly<FieldType>
  validating: boolean
  validated: boolean
  validateFunction: ReturnType<typeof getValidateFunction<Model>>
  mode?: StrictOptions['mode']
}

export type FieldsStates<Model extends BaseFormPayload = BaseFormPayload> = Record<
  ExtractModelKey<Model>,
  FieldState<Model>
>

export type BaseFormPayload = Record<string, any>

export interface FormFieldOptions<FieldType> {
  /**
   * Default value of the field
   * @default undefined
   */
  defaultValue?: FieldType
  /**
   * Validation mode
   * To override the form validation mode
   */
  mode?: StrictOptions['mode']
  /**
   * Reference to the component or HTML element to associate and trigger validation events
   * Necessary for 'eager', 'progressive' and 'blur' validation modes
   */
  ref?: Ref<HTMLElement | ComponentPublicInstance | undefined | null> | TemplateRef<HTMLElement | ComponentPublicInstance | undefined | null>
  /**
   * Identifier for the form
   * Useful when you have multiple forms on the same component
   * Should be the same as the one used in `useFormValidator`
   */
  formIdentifier?: string | symbol
}

export type InferSchemaFormValidator<T> = T extends Ref<infer U>
  ? U extends FormSchema<BaseFormPayload>
    ? Partial<InferInput<ReturnType<typeof objectAsync<U>>>>
    : never
  : T extends (...args: any[]) => FormSchema<BaseFormPayload>
    ? Partial<InferInput<ReturnType<typeof objectAsync<ReturnType<T>>>>>
    : T extends FormSchema<BaseFormPayload>
      ? Partial<InferInput<ReturnType<typeof objectAsync<T>>>>
      : never

export type InferOutputSchemaFormValidator<T> = T extends Ref<infer U>
  ? U extends FormSchema<BaseFormPayload>
    ? InferOutput<ReturnType<typeof objectAsync<U>>>
    : never
  : T extends (...args: any[]) => FormSchema<BaseFormPayload>
    ? InferOutput<ReturnType<typeof objectAsync<ReturnType<T>>>>
    : T extends FormSchema<BaseFormPayload>
      ? InferOutput<ReturnType<typeof objectAsync<T>>>
      : never
