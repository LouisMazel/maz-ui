import type { BaseIssue, BaseSchema, BaseSchemaAsync } from 'valibot'
import type { HTMLAttributes, InputHTMLAttributes } from 'vue'
import type { MazCardProps } from '../components/MazCard.vue'
import type { MazCheckboxProps } from '../components/MazCheckbox.vue'
import type { MazDatePickerProps } from '../components/MazDatePicker.vue'
import type { MazInputProps } from '../components/MazInput.vue'
import type { MazInputCodeProps } from '../components/MazInputCode.vue'
import type { MazInputNumberProps } from '../components/MazInputNumber.vue'
import type { MazInputPhoneNumberProps } from '../components/MazInputPhoneNumber.vue'
import type { MazInputPriceProps } from '../components/MazInputPrice.vue'
import type { MazInputTagsProps } from '../components/MazInputTags.vue'
import type { MazRadioProps } from '../components/MazRadio.vue'
import type { MazRadioButtonsProps } from '../components/MazRadioButtons.vue'
import type { MazSelectProps } from '../components/MazSelect.vue'
import type { MazSelectCountryProps } from '../components/MazSelectCountry.vue'
import type { MazSliderProps } from '../components/MazSlider.vue'
import type { MazSwitchProps } from '../components/MazSwitch.vue'
import type { MazTextareaProps } from '../components/MazTextarea.vue'

export type FormFieldValidation = BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>

export interface FormComponentPropsMap {
  MazInput: MazInputProps
  MazTextarea: MazTextareaProps<string | undefined | null>
  MazSelect: MazSelectProps<any, any, boolean>
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

export function defineFormSchema<T>(schema: FormSchema<T>): FormSchema<T> {
  return schema
}
