import type { Ref } from 'vue'

import { freezeValue } from '../../helpers/freeze-value'
import type {
  BaseFormPayload,
  ExtractModelKey,
  FieldState,
  FieldsStates,
  FormFieldOptions,
  ObjectValidationSchema,
  StrictOptions,
  ValidationIssues,
} from './types'

let validbot: typeof import('valibot').safeParseAsync | undefined

export async function getValibotValidationMethod() {
  if (validbot) {
    return validbot
  }

  const { safeParseAsync } = await import('valibot')

  validbot = safeParseAsync

  return safeParseAsync
}

export function fieldHasValidation(field: string, schema: ObjectValidationSchema) {
  return Object.keys(schema.entries).includes(field)
}

export function scrollToError(selector = '.has-input-error') {
  const element = document.querySelector(selector)

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

export function isEmptyValue(value: unknown) {
  return value === undefined || value === null || value === ''
}

export function getFieldState<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  name,
  schema,
  initialValue,
  mode,
}: {
  name: ModelKey
  schema?: ObjectValidationSchema
  initialValue: Model[ModelKey]
  mode?: StrictOptions['mode'] | 'none'
}): FieldState<Model[ModelKey]> {
  const hasValidation = schema ? fieldHasValidation(name, schema) : false

  return {
    blurred: false,
    dirty: false,
    errors: [],
    error: false,
    valid: !hasValidation,
    validating: false,
    validated: false,
    mode: hasValidation ? mode ?? 'eager' : 'none',
    initialValue,
  }
}

export function getFieldsStates<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>(schema: ObjectValidationSchema, payload: Partial<Model>, mode: StrictOptions['mode']): FieldsStates<Model> {
  const fieldsStates = {} as FieldsStates<Model>

  for (const [name] of Object.entries(schema.entries)) {
    const fieldName = name as ModelKey
    fieldsStates[fieldName] = getFieldState<Model, ModelKey>({
      name: fieldName,
      schema,
      mode,
      initialValue: payload[name] as Model[ModelKey],
    })
  }

  return fieldsStates
}

export function mergeFieldState<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  name,
  fieldsStates,
  payload,
  schema,
  options,
}: {
  name: ModelKey
  fieldsStates: FieldsStates<Model>
  payload: Ref<Model>
  schema: Ref<ObjectValidationSchema>
  options: FormFieldOptions<Model[ModelKey]>
}) {
  const newFieldState = getFieldState({
    name,
    schema: schema.value,
    initialValue: freezeValue(options.defaultValue ?? payload.value[name]),
    mode: options.mode,
  })

  return {
    ...fieldsStates[name],
    ...newFieldState,
    errors: fieldsStates[name]?.errors ? [...fieldsStates[name].errors, ...newFieldState.errors] : newFieldState.errors,
  }
}

export function getFieldsErrors<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>(fieldsStates: FieldsStates<Model>) {
  const fieldsErrors = {} as Record<ModelKey, ValidationIssues>

  for (const [name, { errors }] of Object.entries(fieldsStates)) {
    fieldsErrors[name as ModelKey] = errors
  }

  return fieldsErrors
}

export function findInteractiveElements(el: HTMLElement) {
  return el.querySelectorAll<HTMLElement>('input, select, textarea') as unknown as HTMLElement[]
}

export function addEventToInteractiveElements({
  interactiveElements,
  onBlur,
  onInput,
  mode,
}: {
  interactiveElements: HTMLElement[]
  onBlur: () => void
  onInput: () => void
  mode: StrictOptions['mode'] | 'none'
}) {
  interactiveElements.forEach((element) => {
    if (['onBlur', 'eager'].includes(mode)) {
      element.addEventListener('blur', onBlur)
    }

    if (['onInput', 'eager'].includes(mode)) {
      element.addEventListener('change', onInput)

      if (element.getAttribute('type') === 'radio' || element.getAttribute('type') === 'checkbox') {
        element.addEventListener('change', onInput)
      }
      else {
        element.addEventListener('input', onInput)
      }
    }
  })
}

export function removeEventFromInteractiveElements({
  interactiveElements,
  onBlur,
  onInput,
}: {
  interactiveElements: HTMLElement[]
  onBlur: () => void
  onInput: () => void
}) {
  interactiveElements.forEach((element) => {
    element.removeEventListener('blur', onBlur)
    element.removeEventListener('input', onInput)
    element.removeEventListener('change', onInput)
  })
}
