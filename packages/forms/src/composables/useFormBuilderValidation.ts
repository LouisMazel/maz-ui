import type { ComputedRef, Ref, WatchStopHandle } from 'vue'
import type {
  FormField,
  FormFieldValidation,
  FormFieldValidationOptions,
  FormSchema,
  ValidationIssues,
  ValidationMode,
} from '../utils/schema-helpers'
import { debounceId } from '@maz-ui/utils/helpers/debounceId'
import { throttleId } from '@maz-ui/utils/helpers/throttleId'
import { computed, nextTick, ref, toValue, watch } from 'vue'

export interface FieldValidationState {
  blurred: boolean
  dirty: boolean
  error: boolean
  errors: ValidationIssues
  valid: boolean
  validating: boolean
  validated: boolean
  mode: ValidationMode
}

export type FieldsValidationStates<T> = Partial<Record<keyof T, FieldValidationState>>

export interface FormBuilderValidationOptions {
  mode?: ValidationMode
  scrollToError?: string | false
  identifier?: string | symbol
}

export type ErrorMessageValue = string | string[] | undefined

export interface FormBuilderValidationReturn<T extends Record<string, unknown>> {
  isValid: ComputedRef<boolean>
  isDirty: ComputedRef<boolean>
  isValidating: ComputedRef<boolean>
  fieldsStates: Ref<FieldsValidationStates<T>>
  errorMessages: ComputedRef<Partial<Record<keyof T, ErrorMessageValue>>>
  validateForm: () => Promise<boolean>
  validateField: (name: keyof T) => Promise<boolean>
  resetValidation: () => void
  scrollToFirstError: (selector?: string) => void
  handleFieldBlur: (name: keyof T) => Promise<void>
}

const DEFAULT_CONFIG = {
  mode: 'lazy' as ValidationMode,
  scrollToErrorSelector: '.has-field-error',
  debounceTime: 300,
  throttleTime: 1000,
}

const valibotCache: Record<string, unknown> = {}

async function getValibotMethod<MethodName extends keyof typeof import('valibot')>(
  methodName: MethodName,
): Promise<(typeof import('valibot'))[MethodName]> {
  if (valibotCache[methodName]) {
    return valibotCache[methodName] as (typeof import('valibot'))[MethodName]
  }

  const valibot = await import('valibot')
  valibotCache[methodName] = valibot[methodName]

  return valibot[methodName]
}

function isEmptyValue(value: unknown): value is null | undefined | '' {
  return value === undefined || value === null || value === ''
}

function createInitialFieldState(mode: ValidationMode): FieldValidationState {
  return {
    blurred: false,
    dirty: false,
    error: false,
    errors: [],
    valid: true,
    validating: false,
    validated: false,
    mode,
  }
}

function getFieldsWithValidation<T extends Record<string, unknown>>(
  schema: FormSchema<T>,
): FormField<T, keyof T>[] {
  const fields: FormField<T, keyof T>[] = []
  for (const section of schema.sections) {
    for (const field of section.fields) {
      if (field.validation?.rule) {
        fields.push(field as FormField<T, keyof T>)
      }
    }
  }
  return fields
}

function extractValidationSchema<T extends Record<string, unknown>>(
  schema: FormSchema<T>,
): Record<keyof T, FormFieldValidation> {
  const validationSchema = {} as Record<keyof T, FormFieldValidation>
  for (const section of schema.sections) {
    for (const field of section.fields) {
      if (field.validation?.rule) {
        validationSchema[field.name as keyof T] = field.validation.rule
      }
    }
  }
  return validationSchema
}

function getFieldValidationOptions<T extends Record<string, unknown>>(
  schema: FormSchema<T>,
  fieldName: keyof T,
): FormFieldValidationOptions | undefined {
  for (const section of schema.sections) {
    for (const field of section.fields) {
      if (field.name === fieldName) {
        return field.validation
      }
    }
  }
  return undefined
}

export function useFormBuilderValidation<T extends Record<string, unknown>>(
  schema: Ref<FormSchema<T>> | ComputedRef<FormSchema<T>>,
  model: Ref<T>,
  options: FormBuilderValidationOptions = {},
): FormBuilderValidationReturn<T> {
  const opts = {
    mode: options.mode ?? DEFAULT_CONFIG.mode,
    scrollToError: options.scrollToError ?? DEFAULT_CONFIG.scrollToErrorSelector,
    identifier: options.identifier ?? 'form-builder-validator',
  }

  const fieldsStates = ref<FieldsValidationStates<T>>({}) as Ref<FieldsValidationStates<T>>
  let payloadWatchStop: WatchStopHandle | null = null

  function initializeFieldsStates(): void {
    const currentSchema = toValue(schema)
    const fieldsWithValidation = getFieldsWithValidation(currentSchema)
    const newStates: FieldsValidationStates<T> = {}

    for (const field of fieldsWithValidation) {
      const fieldMode = field.validation?.mode ?? opts.mode
      newStates[field.name] = createInitialFieldState(fieldMode)
    }

    fieldsStates.value = newStates
  }

  async function validateSingleField(
    name: keyof T,
    value: T[keyof T],
    setError = true,
  ): Promise<boolean> {
    const currentSchema = toValue(schema)
    const validationSchema = extractValidationSchema(currentSchema)
    const fieldValidation = validationSchema[name]

    if (!fieldValidation) {
      return true
    }

    const fieldState = fieldsStates.value[name]
    if (!fieldState) {
      return true
    }

    if (fieldState.validating) {
      return fieldState.valid
    }

    fieldState.validating = true

    try {
      const safeParseAsync = await getValibotMethod('safeParseAsync')
      const result = await safeParseAsync(fieldValidation, value ?? '')

      fieldState.valid = result.success
      fieldState.errors = result.issues ?? []
      fieldState.validated = true

      if (setError) {
        fieldState.error = !result.success
      }

      return result.success
    }
    finally {
      fieldState.validating = false
    }
  }

  function shouldValidateOnChange(mode: ValidationMode, fieldState: FieldValidationState): boolean {
    switch (mode) {
      case 'aggressive':
      case 'lazy':
      case 'change':
      case 'progressive':
        return true
      case 'eager':
        return fieldState.blurred
      case 'blur':
      case 'submit':
        return false
      default:
        return true
    }
  }

  async function handleFieldChange(
    name: keyof T,
    value: T[keyof T],
  ): Promise<void> {
    const fieldState = fieldsStates.value[name]
    if (!fieldState) {
      return
    }

    fieldState.dirty = true
    const currentSchema = toValue(schema)
    const fieldOptions = getFieldValidationOptions(currentSchema, name)
    const fieldMode = fieldOptions?.mode ?? opts.mode

    const shouldValidate = shouldValidateOnChange(fieldMode, fieldState)

    if (shouldValidate) {
      const setError = fieldMode !== 'submit' && (
        fieldMode === 'aggressive'
        || fieldMode === 'change'
        || (fieldMode === 'lazy' && !isEmptyValue(value))
        || (fieldMode === 'progressive' && fieldState.validated)
        || (fieldMode === 'eager' && fieldState.blurred)
      )
      await validateSingleField(name, value, setError)
    }
  }

  async function handleFieldBlur(name: keyof T): Promise<void> {
    const fieldState = fieldsStates.value[name]
    if (!fieldState) {
      return
    }

    fieldState.blurred = true
    const currentSchema = toValue(schema)
    const fieldOptions = getFieldValidationOptions(currentSchema, name)
    const fieldMode = fieldOptions?.mode ?? opts.mode

    if (fieldMode === 'blur' || fieldMode === 'eager' || fieldMode === 'progressive') {
      await validateSingleField(name, model.value[name], true)
    }
  }

  async function validateForm(): Promise<boolean> {
    const currentSchema = toValue(schema)
    const fieldsWithValidation = getFieldsWithValidation(currentSchema)

    const results = await Promise.all(
      fieldsWithValidation.map(field =>
        validateSingleField(field.name, model.value[field.name], true),
      ),
    )

    return results.every(Boolean)
  }

  function validateField(name: keyof T): Promise<boolean> {
    return validateSingleField(name, model.value[name], true)
  }

  function resetValidation(): void {
    initializeFieldsStates()
  }

  function scrollToFirstError(selector?: string): void {
    const errorSelector = selector ?? opts.scrollToError
    if (typeof errorSelector === 'string') {
      nextTick(() => {
        const element = document.querySelector(errorSelector)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })
    }
  }

  const isValid = computed((): boolean => {
    const states = fieldsStates.value
    for (const key in states) {
      if (!states[key as keyof T]?.valid) {
        return false
      }
    }
    return true
  })

  const isDirty = computed((): boolean => {
    const states = fieldsStates.value
    for (const key in states) {
      if (states[key as keyof T]?.dirty) {
        return true
      }
    }
    return false
  })

  const isValidating = computed((): boolean => {
    const states = fieldsStates.value
    for (const key in states) {
      if (states[key as keyof T]?.validating) {
        return true
      }
    }
    return false
  })

  const errorMessages = computed((): Partial<Record<keyof T, string | string[] | undefined>> => {
    const messages: Partial<Record<keyof T, string | string[] | undefined>> = {}
    const currentSchema = toValue(schema)

    for (const key in fieldsStates.value) {
      const fieldKey = key as keyof T
      const state = fieldsStates.value[fieldKey]

      if (!state?.error || state.errors.length === 0) {
        messages[fieldKey] = undefined
        continue
      }

      const fieldOptions = getFieldValidationOptions(currentSchema, fieldKey)
      const customMessages = fieldOptions?.messages
      const useMultiple = fieldOptions?.useMultipleErrorMessages ?? false

      const resolvedMessages = state.errors.map((issue) => {
        const issueType = issue.type ?? 'unknown'
        if (customMessages?.[issueType]) {
          return customMessages[issueType]
        }
        return issue.message
      })

      if (useMultiple) {
        messages[fieldKey] = resolvedMessages
      }
      else {
        messages[fieldKey] = resolvedMessages[0]
      }
    }

    return messages
  })

  async function processFieldChange(
    field: FormField<T, keyof T>,
    hasChanged: boolean,
  ): Promise<void> {
    if (!hasChanged) {
      return
    }

    const name = field.name
    const nameStr = name as string
    const fieldOptions = field.validation

    if (fieldOptions?.debounced && fieldOptions.throttled) {
      throw new Error(`Field "${String(name)}" cannot be both debounced and throttled`)
    }

    if (fieldOptions?.debounced) {
      const delay = typeof fieldOptions.debounced === 'number'
        ? fieldOptions.debounced
        : DEFAULT_CONFIG.debounceTime
      debounceId(nameStr, () => handleFieldChange(name, model.value[name]), delay)()
    }
    else if (fieldOptions?.throttled) {
      const delay = typeof fieldOptions.throttled === 'number'
        ? fieldOptions.throttled
        : DEFAULT_CONFIG.throttleTime
      throttleId(nameStr, () => handleFieldChange(name, model.value[name]), delay)()
    }
    else {
      await handleFieldChange(name, model.value[name])
    }
  }

  function setupWatcher(): void {
    if (payloadWatchStop) {
      payloadWatchStop()
    }

    const payloadSnapshot = computed(() => {
      const currentSchema = toValue(schema)
      const fieldsWithValidation = getFieldsWithValidation(currentSchema)
      const snapshot: Record<string, unknown> = {}
      for (const field of fieldsWithValidation) {
        snapshot[field.name as string] = model.value[field.name]
      }
      return snapshot
    })

    payloadWatchStop = watch(
      payloadSnapshot,
      async (newSnapshot, oldSnapshot) => {
        const currentSchema = toValue(schema)
        const fieldsWithValidation = getFieldsWithValidation(currentSchema)

        for (const field of fieldsWithValidation) {
          const nameStr = field.name as string
          const hasChanged = newSnapshot[nameStr] !== oldSnapshot?.[nameStr]
          await processFieldChange(field, hasChanged)
        }
      },
      { deep: true },
    )
  }

  watch(schema, () => {
    initializeFieldsStates()
    setupWatcher()
  }, { immediate: true, deep: true })

  return {
    isValid,
    isDirty,
    isValidating,
    fieldsStates,
    errorMessages,
    validateForm,
    validateField,
    resetValidation,
    scrollToFirstError,
    handleFieldBlur,
  }
}
