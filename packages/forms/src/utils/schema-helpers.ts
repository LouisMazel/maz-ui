import type { MazCheckboxProps, MazContainerProps, MazDatePickerProps, MazInputCodeProps, MazInputNumberProps, MazInputPhoneNumberProps, MazInputPriceProps, MazInputProps, MazInputTagsProps, MazRadioButtonsProps, MazRadioProps, MazSelectCountryProps, MazSelectOption, MazSelectProps, MazSliderProps, MazSwitchProps, MazTextareaProps } from 'maz-ui/components'
import type { MazInputValue } from 'maz-ui/components/MazInput'
import type { FormValidatorOptions } from 'maz-ui/composables'
import type { FormSchema as FormSchemaType, Validation } from 'maz-ui/composables/useFormValidator/types'
import type { BaseIssue, BaseSchema, BaseSchemaAsync, InferIssue } from 'valibot'
import type { HTMLAttributes, InputHTMLAttributes } from 'vue'

// export type FormFieldValidation = BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>

export type ValidationIssues = InferIssue<Validation>[]

export interface FormSchema<T> {
  sections: FormSection<T>[]
}

export interface FormComponentPropsMap {
  MazInput: MazInputProps
  MazTextarea: MazTextareaProps<string | undefined | null>
  MazSelect: MazSelectProps<MazInputValue, MazSelectOption, boolean>
  MazSelectCountry: MazSelectCountryProps
  MazCheckbox: MazCheckboxProps
  MazSwitch: MazSwitchProps
  MazRadio: MazRadioProps
  MazRadioButtons: MazRadioButtonsProps
  MazInputNumber: MazInputNumberProps
  MazInputPrice: MazInputPriceProps
  MazInputCode: MazInputCodeProps
  MazInputTags: MazInputTagsProps
  MazInputPhoneNumber: MazInputPhoneNumberProps
  MazDatePicker: MazDatePickerProps
  MazSlider: MazSliderProps
}

export type FormComponentName = keyof FormComponentPropsMap

export type FormFieldProps<C extends FormComponentName> = Omit<
  FormComponentPropsMap[C],
  'modelValue'
>

export type NativeInputAttributes = Omit<
  InputHTMLAttributes,
  'type' | 'value' | 'disabled' | 'readonly' | 'required' | 'placeholder' | 'name'
>

export interface FormFieldAttrs extends NativeInputAttributes {
  'aria-describedby'?: HTMLAttributes['aria-describedby']
  'aria-label'?: HTMLAttributes['aria-label']
  'autocapitalize'?: InputHTMLAttributes['autocapitalize']
  'autocomplete'?: InputHTMLAttributes['autocomplete']
  'autofocus'?: InputHTMLAttributes['autofocus']
  'data-testid'?: string
  'enterkeyhint'?: InputHTMLAttributes['enterkeyhint']
  'inputmode'?: InputHTMLAttributes['inputmode']
  'pattern'?: InputHTMLAttributes['pattern']
  'spellcheck'?: InputHTMLAttributes['spellcheck']
  'tabindex'?: InputHTMLAttributes['tabindex']
  'title'?: HTMLAttributes['title']
}

export interface FormFieldValidation {
  /**
   * valibot rule
   */
  rule: Validation
  /**
   * @default 'eager'
   */
  mode?: FormValidatorOptions['mode']
  throttled?: boolean | number
  debounced?: boolean | number
  useMultipleErrorMessages?: boolean
}

export interface FormField<
  T,
  K extends keyof T = keyof T,
  C extends FormComponentName = FormComponentName,
> {
  name: K
  id?: string
  component: C
  props?: FormFieldProps<C>
  attrs?: FormFieldAttrs
  defaultValue?: T[K]
  validation?: FormFieldValidation
  condition?: (model?: T[K]) => boolean
}

export type FormSectionContainerOption = boolean | MazContainerProps

export interface FormSection<T> {
  id: string
  legend?: string
  container?: FormSectionContainerOption
  fields: FormField<T, keyof T, FormComponentName>[]
}

export interface FormSchema<T> {
  sections: FormSection<T>[]
}

export type InferFormModel<S> = S extends FormSchema<infer T> ? T : never

export function defineFormField<
  T,
  K extends keyof T,
  C extends FormComponentName,
>(field: FormField<T, K, C>): FormField<T, K, C> {
  return field
}

export function defineFormSection<T>(section: FormSection<T>): FormSection<T> {
  return section
}

export function defineFormSchema<T extends Record<string, unknown>>(
  schema: FormSchema<T>,
): FormSchema<T> {
  return schema
}

export type FlatValidationSchema<T extends Record<string, unknown>> = {
  [K in keyof T]?: FormFieldValidation
}

interface FieldExtractionContext<T extends Record<string, unknown>> {
  schema: FormSchemaType<T>
  debouncedFields: Partial<Record<keyof T, number | true>>
  throttledFields: Partial<Record<keyof T, number | true>>
  fieldModes: Partial<Record<keyof T, FormValidatorOptions['mode']>>
  customMessages: Partial<Record<keyof T, Record<string, string>>>
  useMultipleErrorMessages: Partial<Record<keyof T, boolean>>
  hasDebouncedFields: boolean
  hasThrottledFields: boolean
}

function processFieldValidation<T extends Record<string, unknown>>(
  field: FormField<T, keyof T, FormComponentName>,
  context: FieldExtractionContext<T>,
): void {
  const fieldName = field.name as keyof T
  const validation = field.validation

  if (!validation) {
    return
  }

  if (validation.rule) {
    context.schema[fieldName as keyof FormSchemaType<T>] = validation.rule
  }
  if (validation.mode) {
    context.fieldModes[fieldName] = validation.mode
  }
  if (validation.debounced) {
    context.debouncedFields[fieldName] = validation.debounced
    context.hasDebouncedFields = true
  }
  if (validation.throttled) {
    context.throttledFields[fieldName] = validation.throttled
    context.hasThrottledFields = true
  }
  // if (validation.messages) {
  //   context.customMessages[fieldName] = validation.messages
  // }
  if (validation.useMultipleErrorMessages !== undefined) {
    context.useMultipleErrorMessages[fieldName] = validation.useMultipleErrorMessages
  }
}
// export interface ExtractedValidationOptions<T extends Record<string, unknown>> {
//   schema: FlatValidationSchema<T>
//   debouncedFields: Partial<Record<keyof T, number | true>> | null
//   throttledFields: Partial<Record<keyof T, number | true>> | null
//   fieldModes: Partial<Record<keyof T, FormValidatorOptions['mode']>>
//   customMessages: Partial<Record<keyof T, Record<string, string>>>
//   useMultipleErrorMessages: Partial<Record<keyof T, boolean>>
// }

export function extractValidationFromSchema<T extends Record<string, unknown>>(
  formSchema: FormSchema<T>,
) {
  const context: FieldExtractionContext<T> = {
    schema: {} as FormSchemaType<T>,
    debouncedFields: {},
    throttledFields: {},
    fieldModes: {},
    customMessages: {},
    useMultipleErrorMessages: {},
    hasDebouncedFields: false,
    hasThrottledFields: false,
  }

  for (const section of formSchema.sections) {
    for (const field of section.fields) {
      processFieldValidation(field, context)
    }
  }

  return {
    schema: context.schema,
    debouncedFields: context.hasDebouncedFields ? context.debouncedFields : null,
    throttledFields: context.hasThrottledFields ? context.throttledFields : null,
    fieldModes: context.fieldModes,
    customMessages: context.customMessages,
    useMultipleErrorMessages: context.useMultipleErrorMessages,
  }
}

// export function hasValidationRules<T extends Record<string, unknown>>(
//   formSchema: FormSchema<T>,
// ): boolean {
//   for (const section of formSchema.sections) {
//     for (const field of section.fields) {
//       if (field.validation?.rule) {
//         return true
//       }
//     }
//   }
//   return false
// }

export interface FormSubmitEventPayload<T> {
  data: T
  isValid: boolean
}

export interface FormSubmitErrorEventPayload<T> {
  data: T
  errors: Partial<Record<keyof T, ValidationIssues>>
}

export interface FormResetEventPayload<T> {
  data: T
}

export interface FieldChangeEventPayload<T, K extends keyof T = keyof T> {
  name: K
  value?: T[K]
  previousValue?: T[K]
}

export interface FieldFocusEventPayload<T, K extends keyof T = keyof T> {
  name: K
  value?: T[K]
}

export interface FieldBlurEventPayload<T, K extends keyof T = keyof T> {
  name: K
  value?: T[K]
}

export interface FieldValidateEventPayload<T, K extends keyof T = keyof T> {
  name: K
  value?: T[K]
  isValid: boolean
  errors: ValidationIssues
}

export interface WizardStep<T> {
  id: string
  legend?: string
  index: number
  fields: FormField<T, keyof T, FormComponentName>[]
  completed: boolean
  hasError: boolean
}

export interface StepChangeEventPayload {
  previousStep: number
  currentStep: number
}

export interface StepValidateEventPayload {
  step: number
  isValid: boolean
  errors: Partial<Record<string, ValidationIssues>>
}

export interface StepErrorEventPayload {
  step: number
  errors: Partial<Record<string, ValidationIssues>>
}
