import type {
  ComponentInternalInstance,
  InjectionKey,
  Ref,
  TemplateRef,
} from 'vue'
import type { getValidateFunction } from './validation'

/**
 * Standard Schema interface (https://standardschema.dev)
 * Implemented by Valibot, Zod, ArkType, Effect Schema and many others
 */
export interface StandardSchemaV1<Input = unknown, Output = Input> {
  readonly '~standard': StandardSchemaV1Props<Input, Output>
}

export interface StandardSchemaV1Props<Input = unknown, Output = Input> {
  readonly version: 1
  readonly vendor: string
  readonly validate: (value: unknown) => StandardSchemaV1Result<Output> | Promise<StandardSchemaV1Result<Output>>
  // eslint-disable-next-line sonarjs/no-redundant-optional
  readonly types?: StandardSchemaV1Types<Input, Output> | undefined
}

export type StandardSchemaV1Result<Output> = StandardSchemaV1SuccessResult<Output> | StandardSchemaV1FailureResult

export interface StandardSchemaV1SuccessResult<Output> {
  readonly value: Output
  readonly issues?: undefined
}

export interface StandardSchemaV1FailureResult {
  readonly issues: ReadonlyArray<StandardSchemaV1Issue>
}

export interface StandardSchemaV1Issue {
  readonly message: string
  // eslint-disable-next-line sonarjs/no-redundant-optional
  readonly path?: ReadonlyArray<PropertyKey | StandardSchemaV1PathSegment> | undefined
}

export interface StandardSchemaV1PathSegment {
  readonly key: PropertyKey
}

export interface StandardSchemaV1Types<Input = unknown, Output = Input> {
  readonly input: Input
  readonly output: Output
}

export type Validation = StandardSchemaV1

export type ValidationIssue = StandardSchemaV1Issue

export type ValidationIssues = ValidationIssue[]

export type InferValidationInput<T> = T extends StandardSchemaV1 ? NonNullable<T['~standard']['types']>['input'] : never

export type InferValidationOutput<T> = T extends StandardSchemaV1 ? NonNullable<T['~standard']['types']>['output'] : never

export type ExtractModelKey<T> = Extract<keyof T, string>

export type FormSchema<Model extends BaseFormPayload> = {
  [K in Extract<keyof Model, string> as Model[K] extends Required<Model>[K] ? K : never]: Validation
} & {
  [K in Extract<keyof Model, string> as Model[K] extends Required<Model>[K] ? never : K]?: Validation
}

export type CustomInstance<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>>,
> = ComponentInternalInstance & {
  formContexts?: Map<string | symbol | InjectionKey<FormContext<Model, ModelKey>>, FormContext<Model, ModelKey>>
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
  /**
   * Reset the form on submit success - you must use handleSubmit to handle the form submission
   * @default true
   */
  resetOnSuccess?: boolean
}
export type StrictOptions<Model extends BaseFormPayload, ModelKey extends ExtractModelKey<FormSchema<Model>>> = Required<FormValidatorOptions<Model, ModelKey>>

export interface FormContext<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>>,
> {
  fieldsStates: Ref<FieldsStates<Model, ModelKey>>
  options: StrictOptions<Model, ModelKey>
  internalSchema: Ref<FormSchema<Model>>
  payload: Ref<Model>
  errorMessages: Ref<Record<ModelKey, string | undefined>>
  isSubmitted: Ref<boolean>
}

export interface FieldState<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>>,
  FieldType = Model[ModelKey],
> {
  blurred: boolean
  dirty: boolean
  error: boolean
  errors: ValidationIssues
  valid: boolean
  initialValue?: Readonly<FieldType>
  validating: boolean
  validated: boolean
  validateFunction: ReturnType<typeof getValidateFunction<Model, ModelKey>>
  mode?: StrictOptions<Model, ModelKey>['mode']
}

export type FieldsStates<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>>,
> = Record<
  ModelKey,
  FieldState<Model, ModelKey, Model[ModelKey]>
>

export type BaseFormPayload = Record<string, any>

export type FormFieldRef = Ref | TemplateRef | HTMLElement

export interface FormFieldOptions<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>>,
  FieldType,
> {
  /**
   * Default value of the field
   * @default undefined
   */
  defaultValue?: FieldType
  /**
   * Validation mode
   * To override the form validation mode
   */
  mode?: StrictOptions<Model, ModelKey>['mode']
  /**
   * Reference to the component or HTML element to associate and trigger validation events
   * Necessary for 'eager', 'progressive' and 'blur' validation modes
   * Accepts a reactive `Ref`/`TemplateRef` (recommended, supports conditional rendering with `v-if`)
   * or a raw `HTMLElement`
   */
  ref?: FormFieldRef
  /**
   * Identifier for the form
   * Useful when you have multiple forms on the same component
   * Should be the same as the one used in `useFormValidator`
   */
  formIdentifier?: string | symbol
}

type Simplify<T> = { [K in keyof T]: T[K] } & {}

type IsOptionalOutputKey<TSchema> = TSchema extends { readonly kind: 'schema', readonly type: string }
  ? TSchema extends { readonly type: 'optional' | 'exact_optional' | 'nullish', readonly default: infer TDefault }
    ? undefined extends TDefault ? true : false
    : false
  : unknown extends InferValidationOutput<TSchema>
    ? false
    : undefined extends InferValidationOutput<TSchema> ? true : false

type IsReadonlyOutputKey<TSchema> = TSchema extends { readonly pipe: readonly (infer TItem)[] }
  ? [Extract<TItem, { readonly kind: 'transformation', readonly type: 'readonly' }>] extends [never] ? false : true
  : false

type OptionalOutputKeys<TSchema> = {
  [K in keyof TSchema]: IsOptionalOutputKey<TSchema[K]> extends true ? K : never
}[keyof TSchema]

type ReadonlyOutputKeys<TSchema> = {
  [K in keyof TSchema]: IsReadonlyOutputKey<TSchema[K]> extends true ? K : never
}[keyof TSchema]

export type InferFormSchemaInput<TSchema> = Simplify<{
  -readonly [K in keyof TSchema]?: InferValidationInput<TSchema[K]>
}>

export type InferFormSchemaOutput<TSchema> = Simplify<{
  -readonly [K in Exclude<keyof TSchema, OptionalOutputKeys<TSchema> | ReadonlyOutputKeys<TSchema>>]: InferValidationOutput<TSchema[K]>
} & {
  -readonly [K in Exclude<OptionalOutputKeys<TSchema>, ReadonlyOutputKeys<TSchema>>]?: InferValidationOutput<TSchema[K]>
} & {
  readonly [K in Exclude<ReadonlyOutputKeys<TSchema>, OptionalOutputKeys<TSchema>>]: InferValidationOutput<TSchema[K]>
} & {
  readonly [K in Extract<ReadonlyOutputKeys<TSchema>, OptionalOutputKeys<TSchema>>]?: InferValidationOutput<TSchema[K]>
}>

export type InferSchemaFormValidator<T> = T extends Ref<infer U>
  ? U extends FormSchema<BaseFormPayload>
    ? InferFormSchemaInput<U>
    : never
  : T extends (...args: any[]) => FormSchema<BaseFormPayload>
    ? InferFormSchemaInput<ReturnType<T>>
    : T extends FormSchema<BaseFormPayload>
      ? InferFormSchemaInput<T>
      : never

export type InferOutputSchemaFormValidator<T> = T extends Ref<infer U>
  ? U extends FormSchema<BaseFormPayload>
    ? InferFormSchemaOutput<U>
    : never
  : T extends (...args: any[]) => FormSchema<BaseFormPayload>
    ? InferFormSchemaOutput<ReturnType<T>>
    : T extends FormSchema<BaseFormPayload>
      ? InferFormSchemaOutput<T>
      : never
