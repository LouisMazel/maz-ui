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
} from './types'

import { isEqual } from '@maz-ui/utils/src/helpers/isEqual.js'
import { getCurrentInstance, inject } from 'vue'
import { useFreezeValue } from '../useFreezeValue'
import { CONFIG } from './config'
import { getValidateFunction } from './validation'

export function getFieldState<
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
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
  const hasValidation = schema ? fieldHasValidation<Model, ModelKey>(name, schema) : false

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
    initialValue: useFreezeValue(initialValue),
    validateFunction,
    mode: hasValidation ? options?.mode ?? fieldState?.mode ?? CONFIG.mode : undefined,
  }
}

export function fieldHasValidation<Model extends BaseFormPayload, ModelKey extends ExtractModelKey<FormSchema<Model>>>(
  field: ModelKey,
  schema: FormSchema<Model>,
) {
  return Object.keys(schema).includes(field as string)
}

export function getFieldsStates<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
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
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
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
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
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
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
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

  const isDirty = !isEqual(fieldValue, fieldState.initialValue)

  fieldState.dirty = isDirty
  fieldState.blurred = fieldState.blurred || (fieldState.mode === 'eager' ? isDirty : true)

  const shouldValidate = force || canExecuteValidation<Model>({ eventName: 'blur', fieldState, isSubmitted })

  if (!shouldValidate) {
    return
  }

  return fieldState.validateFunction?.({
    name,
    fieldState,
    schema,
    payload,
    setError: fieldState.mode === 'progressive' ? fieldState.validated || fieldState.blurred : true,
  })
}

export function handleFieldInput<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
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

  const isDirty = !isEqual(fieldValue, fieldState.initialValue)

  fieldState.dirty = isDirty

  const shouldValidate = forceValidation || canExecuteValidation<Model>({ eventName: 'input', fieldState, isSubmitted })

  if (!shouldValidate) {
    return
  }

  return fieldState.validateFunction?.({
    name,
    fieldState,
    schema,
    payload,
    setError: fieldState.mode === 'progressive' ? fieldState.validated || fieldState.blurred : true,
  })
}

export function hasModeIncludes(modes: StrictOptions['mode'][], value?: StrictOptions['mode']): value is StrictOptions['mode'] {
  if (!value) {
    return false
  }

  return modes.includes(value)
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
