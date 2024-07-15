import type { Component, ComponentPublicInstance, FunctionalComponent, SVGAttributes, StyleValue } from 'vue'

import type { Props as MazInputProps, ModelValueSimple } from '../MazInput.vue'
import type { MazSelectOption, Props as MazSelectProps } from '../MazSelect.vue'
import type { Props as MazPhoneNumberInputProps } from '../MazPhoneNumberInput.vue'
import type { Props as MazCheckboxProps } from '../MazCheckbox.vue'
import type { Props as MazTextareaProps } from '../MazTextarea.vue'
import type { FormValidatorOptions, Validation } from './../../modules/composables/use-form-validator/types'

/**
 * Main types
 */
export type FormFieldValue = string | number | boolean | undefined
export type FormPayload = Record<string, FormFieldValue>
export type Icon = FunctionalComponent<SVGAttributes> | ComponentPublicInstance | Component

export interface FormFieldAttributes {
  id?: string
  name?: string
  autocomplete?: string
  style?: StyleValue
  class?: unknown
}

export interface FormFieldBase<T = FormFieldValue> {
  id: string
  name: string
  /**
   * @default ''
   */
  defaultValue?: T
  validation?: {
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
  }
  slots?: {
    name: string
    value: string
  }[]
  attrs?: FormFieldAttributes
}

export type FormFieldInput<T = FormFieldValue> = FormFieldBase<T> & {
  componentName: 'MazInput'
  props?: MazInputProps & { type?: HTMLInputElement['type'] }
}
export type FormFieldSelect<T extends ModelValueSimple = ModelValueSimple, Option extends MazSelectOption = MazSelectOption> = FormFieldBase<T> & {
  componentName: 'MazSelect'
  props: MazSelectProps<T, Option>
}
export type FormFieldPhoneNumber<T = MazPhoneNumberInputProps['modelValue']> = FormFieldBase<T> & {
  componentName: 'MazPhoneNumberInput'
  props: MazPhoneNumberInputProps
}
export type FormFieldCheckbox<T = MazCheckboxProps['modelValue']> = FormFieldBase<T> & {
  componentName: 'MazCheckbox'
  props: MazCheckboxProps
}
export type FormFieldTextarea<T = MazTextareaProps['modelValue']> = FormFieldBase<T> & {
  componentName: 'MazTextarea'
  props: MazTextareaProps
}

export type FormFieldPredefined =
  | FormFieldInput
  | FormFieldSelect
  | FormFieldCheckbox
  | FormFieldPhoneNumber
  | FormFieldTextarea

export type FormSectionBase =
  | {
    id: string
    wrapper: {
      icon?: string | Icon
      title: string
    }
  }
  | {
    id: string
    wrapper?: boolean
    legend: string
  }

export type FormFieldCustom<
  T extends FormFieldValue = FormFieldValue,
  P = Record<string, unknown>,
> = FormFieldBase<T> & {
  component: Component
  props?: P
}

export type FormSection =
  | (FormSectionBase & {
    fields: (FormFieldPredefined | FormFieldCustom)[]
  })
  | (FormSectionBase & {
    component: Component
    props?: Record<string, unknown>
    attrs?: Record<string, unknown>
    fields?: FormFieldBase<FormFieldValue>[]
  })
