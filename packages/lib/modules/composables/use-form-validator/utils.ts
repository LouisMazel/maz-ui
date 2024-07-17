import type { ComponentPublicInstance, InjectionKey } from 'vue'
import { getCurrentInstance, inject, nextTick } from 'vue'

import { debounceId } from '../../helpers/debounce-id'
import { freezeValue } from '../../helpers/freeze-value'
import { isEqual } from '../../helpers/is-equal'
import { throttleId } from '../../helpers/throttle-id'
import { CONFIG } from './config'
import type {
  BaseFormPayload,
  CustomInstance,
  ExtractModelKey,
  FieldState,
  FieldsStates,
  FormContext,
  FormFieldOptions,
  FormSchema,
  StrictOptions,
  ValidationIssues,
} from './index'

export function fieldHasValidation<Model extends BaseFormPayload>(field: string, schema: FormSchema<Model>) {
  return Object.keys(schema).includes(field)
}

export function scrollToError(selector = CONFIG.scrollToErrorSelector) {
  const element = document.querySelector(selector)

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

export function getErrorMessages<
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>(errors: Record<ModelKey, ValidationIssues>, fieldsStates: FieldsStates<Model>) {
  const errorMessages = {} as Record<ModelKey, string | undefined>

  for (const [name, value] of Object.entries(errors)) {
    const issues = value as ValidationIssues
    errorMessages[name as ModelKey] = fieldsStates[name as ModelKey].error ? issues[0].message : undefined
  }

  return errorMessages
}

export function isEmptyValue(value: unknown) {
  return value === undefined || value === null || value === ''
}

export function getValidateFunction<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  name,
  hasValidation,
  debouncedFields,
  throttledFields,
}: {
  name: ModelKey
  hasValidation: boolean
  debouncedFields?: StrictOptions<Model>['debouncedFields']
  throttledFields?: StrictOptions<Model>['throttledFields']
}) {
  if (!hasValidation) {
    return
  }

  if (debouncedFields?.[name] && throttledFields?.[name]) {
    throw new Error(`The field "${name}" cannot be both debounced and throttled`)
  }
  else if (debouncedFields?.[name]) {
    return debounceId(
      name,
      setFieldValidationState<Model>,
      typeof debouncedFields[name] === 'number' ? debouncedFields[name] : CONFIG.debounceTime,
    )
  }
  else if (throttledFields?.[name]) {
    return throttleId(
      name,
      setFieldValidationState<Model>,
      typeof throttledFields[name] === 'number' ? throttledFields[name] : CONFIG.throttleTime,
    )
  }
  else {
    return setFieldValidationState<Model>
  }
}

export function getFieldState<
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  name,
  schema,
  initialValue,
  fieldState,
  options,
}: {
  name: ModelKey
  schema?: FormSchema<Model>
  initialValue?: Model[ModelKey]
  fieldState: FieldState<Model>
  options?: Pick<StrictOptions<Model>, 'debouncedFields' | 'throttledFields' | 'mode'>
}): FieldState<Model> {
  const hasValidation = schema ? fieldHasValidation<Model>(name, schema) : false

  const validateFunction = getValidateFunction({
    name,
    hasValidation,
    debouncedFields: options?.debouncedFields,
    throttledFields: options?.throttledFields,
  })

  return {
    blurred: false,
    dirty: false,
    errors: [],
    error: false,
    valid: !hasValidation,
    validating: false,
    validated: false,
    initialValue: freezeValue(initialValue),
    validateFunction,
    mode: hasValidation ? options?.mode ?? fieldState?.mode ?? CONFIG.mode : 'none',
  }
}

export function getFieldsStates<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  schema,
  payload,
  options,
}: {
  schema: FormSchema<Model>
  payload?: Partial<Model>
  options?: StrictOptions<Model>
}): FieldsStates<Model> {
  const fieldsStates = {} as FieldsStates<Model>

  for (const name in schema) {
    const fieldName = name as ModelKey
    fieldsStates[fieldName] = getFieldState<Model>({
      name: fieldName,
      schema,
      options,
      fieldState: fieldsStates[fieldName],
      initialValue: payload?.[name],
    })
  }

  return fieldsStates
}

export function updateFieldState<
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
  options: FormFieldOptions<Model[ModelKey]> & StrictOptions<Model>
}): FieldState<Model> {
  const { initialValue, mode } = getFieldState<Model>({
    name,
    schema,
    initialValue: options.defaultValue ?? payload[name],
    fieldState: fieldsStates[name],
    options,
  })

  return {
    ...fieldsStates[name],
    initialValue,
    mode,
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

  return el.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    'input, select, textarea',
  ) as unknown as (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[]
}

export function addEventToInteractiveElements({
  interactiveElements,
  events,
  mode,
}: {
  interactiveElements: HTMLElement[]
  events: {
    onBlur: () => void
    onInput: () => void
  }
  mode: StrictOptions['mode']
}) {
  interactiveElements.forEach((element) => {
    if (['blur', 'eager', 'input'].includes(mode)) {
      element.addEventListener('blur', events.onBlur)
      element.addEventListener('input', events.onInput)
      if (element.getAttribute('type') === 'radio' || element.getAttribute('type') === 'checkbox') {
        element.addEventListener('change', events.onInput)
      }
    }
  })
}

export function removeEventFromInteractiveElements({
  interactiveElements,
  events,
}: {
  interactiveElements: HTMLElement[]
  events: {
    onBlur: () => void
    onInput: () => void
  }
}) {
  interactiveElements.forEach((element) => {
    element.removeEventListener('blur', events.onBlur)
    element.removeEventListener('input', events.onInput)
    element.removeEventListener('change', events.onInput)
  })
}

export async function getFieldValidationResult<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>(name: ModelKey, schema: FormSchema<Model>, value: Model[ModelKey]) {
  const fieldSchema = await getValidationSchema(schema)
  const safeParseAsync = await getValibotValidationMethod('safeParseAsync')
  const result = await safeParseAsync(fieldSchema.entries[name], value ?? '')

  return {
    result,
    isValid: result.success,
  }
}

export async function setFieldValidationState<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  name,
  fieldsStates,
  schema,
  payload,
  setError = true,
}: {
  name: ModelKey
  fieldsStates: FieldsStates<Model>
  schema: FormSchema<Model>
  payload: Model
  setError?: boolean
}) {
  await nextTick()

  const fieldState = fieldsStates[name]

  fieldState.validating = true

  if (!schema[name]) {
    // Validate if the field is not in the schema
    fieldState.valid = true
    fieldState.validating = false
    fieldState.validated = true
    fieldState.errors = []
    fieldState.error = false
    return
  }

  const { result, isValid } = await getFieldValidationResult(name, schema, payload[name])

  fieldState.valid = isValid

  if (setError) {
    fieldState.error = !isValid
  }

  fieldState.errors = result.issues ?? []

  fieldState.validating = false
  fieldState.validated = true
}

export function validateField<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  name,
  fieldsStates,
  payload,
  schema,
}: {
  name: ModelKey
  fieldsStates: FieldsStates<Model>
  payload: Model
  schema: FormSchema<Model>
}) {
  const validationParams: Parameters<typeof setFieldValidationState<Model>>[0] = {
    name,
    fieldsStates,
    payload,
    schema,
  }

  return fieldsStates[name].validateFunction?.(validationParams)
}

export function validateForm<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  fieldsStates,
  payload,
  setError = true,
  schema,
}: {
  fieldsStates: FieldsStates<Model>
  setError?: boolean
  payload: Model
  schema: FormSchema<Model>
}) {
  return Promise.all(
    Object.keys(fieldsStates).map(name =>
      setFieldValidationState({
        name: name as ModelKey,
        setError,
        fieldsStates,
        payload,
        schema,
      }),
    ),
  )
}

export function canExecuteValidation<Model extends BaseFormPayload>({
  eventName,
  fieldState,
  isSubmitted,
}: {
  eventName: 'blur' | 'input'
  fieldState: FieldState<Model>
  isSubmitted: boolean
}): boolean {
  const { dirty, blurred, mode, valid } = fieldState

  if (eventName === 'blur' && mode === 'input') {
    return false
  }

  if (eventName === 'input' && mode === 'blur') {
    return false
  }

  if (valid) {
    return false
  }

  return (
    isSubmitted
    || (mode === 'eager' && blurred)
    || (mode === 'input' && dirty)
    || (mode === 'blur' && blurred)
    || mode === 'aggressive'
    || mode === 'lazy'
  )
}

export function handleFieldBlur<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  name,
  force = false,
  payload,
  fieldsStates,
  schema,
  isSubmitted,
}: {
  name: ModelKey
  payload: Model
  fieldsStates: FieldsStates<Model>
  schema: FormSchema<Model>
  isSubmitted: boolean
  force?: boolean
}) {
  const fieldValue = payload[name]
  const fieldState = fieldsStates[name]
  const isDirty = !isEmptyValue(fieldValue) && !isEqual(fieldValue, fieldState.initialValue)

  fieldState.dirty = isDirty
  fieldState.blurred = fieldState.blurred || (fieldState.mode === 'eager' ? isDirty : true)

  const shouldValidate = force || canExecuteValidation<Model>({ eventName: 'blur', fieldState, isSubmitted })

  if (!shouldValidate) {
    return
  }

  return validateField<Model>({
    name,
    fieldsStates,
    schema,
    payload,
  })
}

export function handleFieldInput<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  name,
  payload,
  fieldsStates,
  schema,
  isSubmitted,
  force = false,
}: {
  name: ModelKey
  payload: Model
  fieldsStates: FieldsStates<Model>
  schema: FormSchema<Model>
  isSubmitted: boolean
  force?: boolean
}) {
  const fieldValue = payload[name]
  const fieldState = fieldsStates[name]

  fieldState.validated = false
  fieldState.valid = false

  const isDirty = !isEmptyValue(fieldValue) && !isEqual(fieldValue, fieldState.initialValue)

  fieldState.dirty = isDirty

  const shouldValidate = force || canExecuteValidation<Model>({ eventName: 'input', fieldState, isSubmitted })

  if (!shouldValidate) {
    return
  }

  return validateField<Model>({
    name,
    fieldsStates,
    schema,
    payload,
  })
}

export function getInstance<Model extends BaseFormPayload>(composableName: string) {
  const instance = getCurrentInstance() as CustomInstance<Model>
  if (!instance) {
    throw new Error(`${composableName} must be called within setup()`)
  }

  return instance
}

export function getContext<Model extends BaseFormPayload>(
  identifier: string | symbol | InjectionKey<FormContext<Model>>,
  composableName: string,
) {
  const instance = getInstance<Model>(composableName)
  const context = instance.formContexts?.get(identifier) ?? inject<FormContext<Model>>(identifier)

  if (!context) {
    throw new Error('useFormField must be used within a form (useFormValidator)')
  }

  return context
}

export function getValidationEvents<Model extends BaseFormPayload>({
  componentRef,
  fieldState,
  events,
}: {
  componentRef: ComponentPublicInstance | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | undefined
  fieldState: FieldState<Model>
  events: {
    onBlur: () => void
    onInput: () => void
  }
}) {
  if (componentRef || ['aggressive', 'lazy', 'none'].includes(fieldState.mode)) {
    return
  }

  return {
    'onBlur': events.onBlur,
    'onUpdate:modelValue': events.onInput,
  }
}

type Valibot = typeof import('valibot')
const storeValidbot: Record<keyof Valibot | string, any> = {}

export async function getValibotValidationMethod<MethodName extends keyof Valibot>(methodName: MethodName): Promise<Valibot[MethodName]> {
  if (storeValidbot[methodName]) {
    return storeValidbot[methodName]
  }

  const valibot = await import('valibot')

  storeValidbot[methodName] = valibot[methodName]

  return valibot[methodName]
}

export async function getValidationSchema<Model extends BaseFormPayload>(formSchema: FormSchema<Model>) {
  const objectAsync = await getValibotValidationMethod('objectAsync')
  return objectAsync(formSchema)
}
