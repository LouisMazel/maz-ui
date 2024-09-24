import type { InjectionKey } from 'vue'
import type {
  BaseFormPayload,
  CustomInstance,
  ExtractModelKey,
  FieldsStates,
  FieldState,
  FormContext,
  FormFieldOptions,
  FormSchema,
  StrictOptions,
  ValidationIssues,
} from './index'

import { getCurrentInstance, inject, nextTick } from 'vue'
import { debounceId } from '../../helpers/debounce-id'
import { freezeValue } from '../../helpers/freeze-value'
import { isEqual } from '../../helpers/is-equal'
import { throttleId } from '../../helpers/throttle-id'
import { CONFIG } from './config'

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
    errorMessages[name as ModelKey] = fieldsStates[name as ModelKey].error && issues[0] ? issues[0].message : undefined
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
    mode: hasValidation ? options?.mode ?? fieldState?.mode ?? CONFIG.mode : undefined,
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
  payload: Partial<Model>
  options: StrictOptions<Model>
}): FieldsStates<Model> {
  const fieldsStates = {} as FieldsStates<Model>

  for (const fieldName in schema) {
    const name = fieldName as ModelKey
    fieldsStates[name] = getFieldState<Model>({
      name,
      schema,
      options,
      fieldState: fieldsStates[name],
      initialValue: payload?.[name],
    })
  }

  return fieldsStates
}

export function updateFieldsStates<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  fieldsStates,
  payload,
  schema,
  options,
  updateMode = false,
}: {
  fieldsStates: FieldsStates<Model>
  payload: Model
  schema: FormSchema<Model>
  options: StrictOptions<Model>
  updateMode?: boolean
}) {
  for (const fieldName in schema) {
    const name = fieldName as ModelKey
    fieldsStates[name] = updateFieldState<Model>({
      name,
      fieldState: fieldsStates[name],
      payload,
      schema,
      options,
      updateMode,
    })
  }
}

export function updateFieldState<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  name,
  fieldState,
  payload,
  schema,
  options,
  updateMode = true,
}: {
  name: ModelKey
  fieldState: FieldState<Model>
  payload: Model
  schema: FormSchema<Model>
  options: FormFieldOptions<Model[ModelKey]> & StrictOptions<Model>
  updateMode?: boolean
}): FieldState<Model> {
  const { initialValue, mode, ...rest } = getFieldState<Model>({
    name,
    schema,
    initialValue: options.defaultValue ?? payload[name],
    fieldState,
    options,
  })

  const newMode = updateMode ? mode ?? fieldState.mode ?? CONFIG.mode : fieldState.mode

  return {
    ...fieldState,
    initialValue,
    mode: newMode,
    ...(fieldState?.mode && newMode !== fieldState.mode ? rest : {}),
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
  onBlurHandler,
  mode,
}: {
  interactiveElements: HTMLElement[]
  onBlurHandler: () => void
  mode: StrictOptions['mode']
}) {
  interactiveElements.forEach((element) => {
    if (hasModeIncludes(['eager', 'blur', 'progressive'], mode)) {
      element.addEventListener('blur', onBlurHandler)
    }
  })
}

export function removeEventFromInteractiveElements({
  interactiveElements,
  onBlurHandler,
}: {
  interactiveElements: HTMLElement[]
  onBlurHandler: () => void
}) {
  interactiveElements.forEach((element) => {
    element.removeEventListener('blur', onBlurHandler)
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
  fieldState,
  schema,
  payload,
  setError = true,
  setErrorIfInvalidAndNotEmpty = false,
}: {
  name: ModelKey
  fieldState: FieldState<Model>
  schema: FormSchema<Model>
  payload: Model
  setError?: boolean
  setErrorIfInvalidAndNotEmpty?: boolean
}) {
  await nextTick()

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

  if (setError || (setErrorIfInvalidAndNotEmpty && !isValid && !isEmptyValue(payload[name]))) {
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
  fieldState,
  payload,
  schema,
}: {
  name: ModelKey
  fieldState: FieldState<Model>
  payload: Model
  schema: FormSchema<Model>
}) {
  const validationParams: Parameters<typeof setFieldValidationState<Model>>[number] = {
    name,
    fieldState,
    payload,
    schema,
    setError: fieldState.mode === 'progressive' ? fieldState.valid || fieldState.blurred : true,
  }

  return fieldState.validateFunction?.(validationParams)
}

export function validateForm<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  fieldsStates,
  payload,
  showErrors = true,
  schema,
}: {
  fieldsStates: FieldsStates<Model>
  showErrors?: boolean
  payload: Model
  schema: FormSchema<Model>
}) {
  return Promise.all(
    Object.keys(fieldsStates).map(name =>
      setFieldValidationState<Model>({
        name: name as ModelKey,
        setError: showErrors,
        fieldState: fieldsStates[name],
        payload,
        schema,
        setErrorIfInvalidAndNotEmpty: fieldsStates[name].mode === 'lazy',
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

  const shouldNotValidate
    = (eventName === 'blur' && (hasModeIncludes(['lazy', 'aggressive'], mode) || valid))
    || (eventName === 'input' && mode === 'blur')
    || !mode

  if (shouldNotValidate) {
    return false
  }

  return (
    isSubmitted
    || (mode === 'eager' && blurred)
    || (mode === 'blur' && blurred)
    || (mode === 'aggressive' && dirty)
    || (mode === 'lazy' && dirty)
    || mode === 'progressive'
  )
}

export function handleFieldBlur<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({
  name,
  force = false,
  payload,
  fieldState,
  schema,
  isSubmitted,
}: {
  name: ModelKey
  payload: Model
  fieldState: FieldState<Model>
  schema: FormSchema<Model>
  isSubmitted: boolean
  force?: boolean
}) {
  const fieldValue = payload[name]

  const isDirty = !isEmptyValue(fieldValue) && !isEqual(fieldValue, fieldState.initialValue)

  fieldState.dirty = isDirty
  fieldState.blurred = fieldState.blurred || (fieldState.mode === 'eager' ? isDirty : true)

  const shouldValidate = force || canExecuteValidation<Model>({ eventName: 'blur', fieldState, isSubmitted })

  if (!shouldValidate) {
    return
  }

  return validateField<Model>({
    name,
    fieldState,
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
  fieldState,
  schema,
  isSubmitted,
  forceValidation = false,
}: {
  name: ModelKey
  payload: Model
  fieldState: FieldState<Model>
  schema: FormSchema<Model>
  isSubmitted: boolean
  forceValidation?: boolean
}) {
  const fieldValue = payload[name]

  fieldState.validated = false

  const isDirty = !isEmptyValue(fieldValue) && !isEqual(fieldValue, fieldState.initialValue)

  fieldState.dirty = isDirty

  const shouldValidate = forceValidation || canExecuteValidation<Model>({ eventName: 'input', fieldState, isSubmitted })

  if (!shouldValidate) {
    return
  }

  return validateField<Model>({
    name,
    fieldState,
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
  ref,
  fieldState,
  onBlurHandler,
}: {
  ref?: string
  fieldState: FieldState<Model>
  onBlurHandler: () => void
}) {
  if (ref || hasModeIncludes(['aggressive', 'lazy'], fieldState.mode)) {
    return
  }

  return {
    onBlur: onBlurHandler,
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

export function hasModeIncludes(modes: StrictOptions['mode'][], value?: StrictOptions['mode']): value is StrictOptions['mode'] {
  if (!value) {
    return false
  }

  return modes.includes(value)
}
