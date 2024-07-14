import { freezeValue } from '../../helpers/freeze-value'
import type {
  BaseFormPayload,
  ExtractModelKey,
  FieldState,
  FieldsStates,
  FormFieldOptions,
  FormSchema,
  StrictOptions,
  ValidationIssues,
} from './types'

const storeValidbot: Record<keyof typeof import('valibot') | string, any> = {}

export async function getValibotValidationMethod(methodName: keyof typeof import('valibot')) {
  if (storeValidbot[methodName]) {
    return storeValidbot[methodName]
  }

  const valibot = await import('valibot')

  storeValidbot[methodName] = valibot[methodName]

  return valibot[methodName]
}

export function fieldHasValidation<Model extends BaseFormPayload>(
  field: string,
  schema: FormSchema<Model>,
) {
  return Object.keys(schema).includes(field)
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
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  name,
  schema,
  initialValue,
  mode,
}: {
  name: ModelKey
  schema?: FormSchema<Model>
  initialValue?: Model[ModelKey] | Readonly<Model[ModelKey]>
  mode?: StrictOptions['mode'] | 'none'
}): FieldState<Model> {
  const hasValidation = schema ? fieldHasValidation<Model>(name, schema) : false

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
>(schema: FormSchema<Model>, payload: Partial<Model>, mode: StrictOptions['mode']): FieldsStates<Model> {
  const fieldsStates = {} as FieldsStates<Model>

  for (const [name] of Object.entries(schema)) {
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
  payload: Model
  schema: FormSchema<Model>
  options: FormFieldOptions<Model[ModelKey]>
}) {
  const newFieldState = getFieldState<Model>({
    name,
    schema,
    initialValue: freezeValue(options.defaultValue ?? payload[name]),
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
  if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
    return [el]
  }

  return [...el.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')]
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

export async function getValidationSchema<Model extends BaseFormPayload>(formSchema: FormSchema<Model>) {
  const objectAsync = await getValibotValidationMethod('objectAsync')
  return objectAsync(formSchema)
}
