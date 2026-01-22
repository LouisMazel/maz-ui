import type { MazCardProps } from 'maz-ui/components/MazCard'
import type { MazCheckboxProps } from 'maz-ui/components/MazCheckbox'
import type { MazDatePickerProps } from 'maz-ui/components/MazDatePicker'
import type { MazInputProps, MazInputValue } from 'maz-ui/components/MazInput'
import type { MazInputCodeProps } from 'maz-ui/components/MazInputCode'
import type { MazInputNumberProps } from 'maz-ui/components/MazInputNumber'
import type { MazInputPhoneNumberProps } from 'maz-ui/components/MazInputPhoneNumber'
import type { MazInputPriceProps } from 'maz-ui/components/MazInputPrice'
import type { MazInputTagsProps } from 'maz-ui/components/MazInputTags'
import type { MazRadioProps } from 'maz-ui/components/MazRadio'
import type { MazRadioButtonsProps } from 'maz-ui/components/MazRadioButtons'
import type { MazSelectOption, MazSelectProps } from 'maz-ui/components/MazSelect'
import type { MazSelectCountryProps } from 'maz-ui/components/MazSelectCountry'
import type { MazSliderProps } from 'maz-ui/components/MazSlider'
import type { MazSwitchProps } from 'maz-ui/components/MazSwitch'
import type { MazTextareaProps } from 'maz-ui/components/MazTextarea'
import type { BaseIssue, BaseSchema, BaseSchemaAsync } from 'valibot'
import type { HTMLAttributes, InputHTMLAttributes } from 'vue'

export type FormFieldValidation = BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>

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
  'modelValue' | 'style' | 'class'
>

export type NativeInputAttributes = Omit<
  InputHTMLAttributes,
  'type' | 'value' | 'disabled' | 'readonly' | 'required' | 'placeholder' | 'name' | 'id'
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

export interface FormField<
  T,
  K extends keyof T = keyof T,
  C extends FormComponentName = FormComponentName,
> {
  name: K
  component: C
  props?: FormFieldProps<C>
  attrs?: FormFieldAttrs
  defaultValue?: T[K]
  validation?: FormFieldValidation
  condition?: (model: T) => boolean
}

export type FormSectionCardOption = boolean | Omit<MazCardProps, 'collapsible' | 'collapseOpen'>

export interface FormSection<T> {
  id: string
  legend?: string
  card?: FormSectionCardOption
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
