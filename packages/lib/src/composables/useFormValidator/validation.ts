import type {
  BaseFormPayload,
  ExtractModelKey,
  FieldsStates,
  FieldState,
  FormSchema,
  StrictOptions,
  ValidationIssues,
} from './types'

import { debounceId } from '@maz-ui/utils/src/helpers/debounceId.js'
import { throttleId } from '@maz-ui/utils/src/helpers/throttleId.js'
import { nextTick } from 'vue'
import { CONFIG } from './config'

export function isEmptyValue(value: unknown): value is null | undefined | '' {
  return value === undefined || value === null || value === ''
}

const storeValidbot: Record<string, any> = {}

export async function getValibotValidationMethod<MethodName extends keyof typeof import('valibot')>(
  methodName: MethodName,
): Promise<(typeof import('valibot'))[MethodName]> {
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

export async function getFieldValidationResult<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
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
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
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

  // Race condition protection
  if (fieldState.validating) {
    return Promise.resolve()
  }

  fieldState.validating = true

  try {
    if (!schema[name]) {
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
    fieldState.validated = true
  }
  finally {
    fieldState.validating = false
  }
}

export function validateField<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
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
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
>({
  fieldsStates,
  payload,
  setErrors = true,
  schema,
}: {
  fieldsStates: FieldsStates<Model>
  setErrors?: boolean
  payload: Model
  schema: FormSchema<Model>
}) {
  return Promise.all(
    Object.keys(fieldsStates).map(name =>
      setFieldValidationState<Model>({
        name: name as ModelKey,
        setError: setErrors,
        fieldState: fieldsStates[name],
        payload,
        schema,
        setErrorIfInvalidAndNotEmpty: fieldsStates[name].mode === 'lazy',
      }),
    ),
  )
}

export function getErrorMessages<
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
>(errors: Record<ModelKey, ValidationIssues>, fieldsStates: FieldsStates<Model>) {
  const errorMessages = {} as Record<ModelKey, string | undefined>

  for (const [name, value] of Object.entries(errors)) {
    const issues = value as ValidationIssues
    errorMessages[name as ModelKey] = fieldsStates[name as ModelKey].error && issues[0] ? issues[0].message : undefined
  }

  return errorMessages
}

export function getFieldsErrors<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
>(fieldsStates: FieldsStates<Model>) {
  const fieldsErrors = {} as Record<ModelKey, ValidationIssues>

  for (const [name, fieldState] of Object.entries(fieldsStates)) {
    fieldsErrors[name as ModelKey] = fieldState.errors
  }

  return fieldsErrors
}

export function getValidateFunction<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
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

  const fieldName = String(name) as ModelKey

  if (debouncedFields?.[fieldName] && throttledFields?.[fieldName]) {
    throw new Error(`The field "${String(fieldName)}" cannot be both debounced and throttled`)
  }
  else if (debouncedFields?.[fieldName]) {
    return debounceId(
      String(fieldName),
      setFieldValidationState<Model>,
      typeof debouncedFields[fieldName] === 'number' ? debouncedFields[fieldName] : CONFIG.debounceTime,
    )
  }
  else if (throttledFields?.[fieldName]) {
    return throttleId(
      String(fieldName),
      setFieldValidationState<Model>,
      typeof throttledFields[fieldName] === 'number' ? throttledFields[fieldName] : CONFIG.throttleTime,
    )
  }
  else {
    return setFieldValidationState<Model>
  }
}
