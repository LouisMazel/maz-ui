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
  FieldType = Model[ModelKey],
>({
  name,
  schema,
  initialValue,
  fieldState,
  options,
}: {
  name: ModelKey
  schema?: FormSchema<Model>
  initialValue?: FieldType
  fieldState: FieldState<Model, ModelKey, FieldType>
  options?: Pick<StrictOptions<Model, ModelKey>, 'debouncedFields' | 'throttledFields' | 'mode'>
}): FieldState<Model, ModelKey, FieldType> {
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
    initialValue: useFreezeValue(initialValue) as Readonly<FieldType>,
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
  options: StrictOptions<Model, ModelKey>
}): FieldsStates<Model, ModelKey> {
  const fieldsStates = {} as FieldsStates<Model, ModelKey>

  for (const fieldName in schema) {
    const name = fieldName as ModelKey
    fieldsStates[name] = getFieldState<Model, ModelKey, Model[ModelKey]>({
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
  fieldsStates: FieldsStates<Model, ModelKey>
  payload: Model
  schema: FormSchema<Model>
  options: StrictOptions<Model, ModelKey>
  updateMode?: boolean
}) {
  for (const fieldName in schema) {
    const name = fieldName as ModelKey
    fieldsStates[name] = updateFieldState<Model, ModelKey, Model[ModelKey]>({
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
  FieldType = Model[ModelKey],
>({
  name,
  fieldState,
  payload,
  schema,
  options,
  updateMode = true,
}: {
  name: ModelKey
  fieldState: FieldState<Model, ModelKey, FieldType>
  payload: Model
  schema: FormSchema<Model>
  options: FormFieldOptions<Model, ModelKey, FieldType> & StrictOptions<Model, ModelKey>
  updateMode?: boolean
}) {
  const { initialValue, mode, ...rest } = getFieldState<Model, ModelKey, FieldType>({
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

export function canExecuteValidation<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
  FieldType = Model[ModelKey],
>({
  eventName,
  fieldState,
  isSubmitted,
}: {
  eventName: 'blur' | 'input'
  fieldState: FieldState<Model, ModelKey, FieldType>
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
  FieldType = Model[ModelKey],
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
  fieldState: FieldState<Model, ModelKey, FieldType>
  schema: FormSchema<Model>
  isSubmitted: boolean
  force?: boolean
}) {
  const fieldValue = payload[name]

  const isDirty = !isEqual(fieldValue, fieldState.initialValue)

  fieldState.dirty = isDirty
  fieldState.blurred = fieldState.blurred || (fieldState.mode === 'eager' ? isDirty : true)

  const shouldValidate = force || canExecuteValidation<Model, ModelKey, FieldType>({ eventName: 'blur', fieldState, isSubmitted })

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
  FieldType = Model[ModelKey],
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
  fieldState: FieldState<Model, ModelKey, FieldType>
  schema: FormSchema<Model>
  isSubmitted: boolean
  forceValidation?: boolean
}) {
  const fieldValue = payload[name]

  fieldState.validated = false

  const isDirty = !isEqual(fieldValue, fieldState.initialValue)

  fieldState.dirty = isDirty

  const shouldValidate = forceValidation || canExecuteValidation<Model, ModelKey, FieldType>({ eventName: 'input', fieldState, isSubmitted })

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

export function hasModeIncludes<Model extends BaseFormPayload, ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>>(modes: StrictOptions<Model, ModelKey>['mode'][], value?: StrictOptions<Model, ModelKey>['mode']): value is StrictOptions<Model, ModelKey>['mode'] {
  if (!value) {
    return false
  }

  return modes.includes(value)
}

export function getInstance<Model extends BaseFormPayload, ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>>(composableName: string) {
  const instance = getCurrentInstance() as CustomInstance<Model, ModelKey>
  if (!instance) {
    throw new Error(`${composableName} must be called within setup()`)
  }

  return instance
}

export function getContext<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
>(
  identifier: string | symbol | InjectionKey<FormContext<Model, ModelKey>>,
  composableName: string,
) {
  const instance = getInstance<Model, ModelKey>(composableName)
  const context = instance.formContexts?.get(identifier) ?? inject<FormContext<Model, ModelKey>>(identifier)

  if (!context) {
    throw new Error('useFormField must be used within a form (useFormValidator)')
  }

  return context
}
