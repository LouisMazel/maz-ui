import type { SafeParseResult } from 'valibot'
import type { ComputedRef, InjectionKey, MaybeRefOrGetter, ModelRef, Ref, WatchStopHandle } from 'vue'
import { computed, inject, onUnmounted, provide, ref, toValue, watch } from 'vue'

import { debounceAsync } from '../../helpers/debounce-async'
import { freezeValue } from '../../helpers/freeze-value'
import { isEqual } from '../../helpers/is-equal'
import { sleep } from '../../helpers/sleep'
import { throttleAsync } from '../../helpers/throttle-async'
import {
  addEventToInteractiveElements,
  fieldHasValidation,
  findInteractiveElements,
  getFieldsErrors,
  getFieldsStates,
  getValibotValidationMethod,
  getValidationSchema,
  isEmptyValue,
  mergeFieldState,
  removeEventFromInteractiveElements,
  scrollToError,
} from './utils'
import type {
  BaseFormPayload,
  ExtractModelKey,
  FieldsStates,
  FormContext,
  FormFieldOptions,
  FormSchema,
  ObjectValidationSchema,
  Options,
  StrictOptions,
} from './types'

const FormContextKey: InjectionKey<FormContext> = Symbol('FormContext')

let formContext: FormContext | null = null

export function useFormValidator<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
  SchemaType extends FormSchema<ModelKey> = FormSchema<ModelKey>,
  ValibotSchema extends ObjectValidationSchema<Model> = ObjectValidationSchema<Model>,
>({
  schema,
  model,
  defaultValues,
  options,
}: {
  schema: MaybeRefOrGetter<SchemaType>
  model?: Ref<Partial<Model>> | ModelRef<Model>
  defaultValues?: Partial<Model>
  options?: Options<Model>
}) {
  const opts = {
    mode: 'eager',
    scrollToErrorSelector: '.has-input-error',
    debouncedFields: null,
    throttledFields: null,
    ...options,
  } satisfies StrictOptions<Model>

  const payload = ref({
    ...defaultValues,
    ...model?.value,
  }) as Ref<Model>

  const internalSchema = computed(() => getValidationSchema<ModelKey>(toValue(schema))) as unknown as ComputedRef<ValibotSchema>
  const fieldsStates = ref(
    getFieldsStates(internalSchema.value, defaultValues ?? payload.value, opts.mode),
  ) as Ref<FieldsStates<Model>>

  watch(
    internalSchema,
    (newSchema) => {
      fieldsStates.value = getFieldsStates(newSchema, defaultValues ?? payload.value, opts.mode)
    },
    { deep: true },
  )

  const isSubmitting = ref(false)
  const isSubmitted = ref(false)
  const isValid = computed(() => Object.values(fieldsStates.value).every(({ valid }) => valid))
  const isDirty = computed(() => Object.values(fieldsStates.value).some(({ dirty }) => dirty))
  const errors = computed(() => getFieldsErrors(fieldsStates.value))
  const errorMessages = computed(() => {
    return Object.entries(errors.value).reduce((acc, [name, value]) => {
      acc[name] = fieldsStates.value[name].error ? value[0].message : undefined
      return acc
    }, {} as Record<ModelKey, string | undefined>)
  })

  async function getFieldValidationResult(name: ModelKey): Promise<{
    result: SafeParseResult<ValibotSchema['entries'][ModelKey]>
    isValid: boolean
  }> {
    const safeParseAsync = await getValibotValidationMethod('safeParseAsync')
    const result = await safeParseAsync(internalSchema.value.entries[name], payload.value[name] ?? '')

    return {
      result,
      isValid: result.success,
    }
  }

  async function setFieldValidationState(name: ModelKey, setError = true) {
    await sleep(0)

    const fieldState = fieldsStates.value[name]

    fieldState.validating = true

    if (!internalSchema.value.entries[name]) {
      // Validate if the field is not in the schema
      fieldState.valid = true
      fieldState.validating = false
      fieldState.validated = true
      fieldState.errors = []
      fieldState.error = false
      return
    }

    const { result, isValid } = await getFieldValidationResult(name)

    fieldState.valid = isValid

    if (setError) {
      fieldState.error = !isValid
    }

    fieldState.errors = result.issues ?? []

    fieldState.validating = false
    fieldState.validated = true
  }

  async function validateField(name: ModelKey) {
    if (typeof opts.throttledFields?.[name] === 'number' || opts.throttledFields?.[name]) {
      const delay = (typeof opts.throttledFields?.[name] === 'number' ? opts.throttledFields?.[name] : 1000) as number
      throttleAsync(setFieldValidationState, delay)(name, name)
    }
    else if (typeof opts.debouncedFields?.[name] === 'number' || opts.debouncedFields?.[name]) {
      const delay = (typeof opts.debouncedFields?.[name] === 'number' ? opts.debouncedFields?.[name] : 300) as number
      debounceAsync(setFieldValidationState, delay)(name, name)
    }
    else {
      setFieldValidationState(name)
    }
  }

  function addFieldValidationWatch(name: ModelKey) {
    watch(
      () => toValue(payload.value)[name],
      () => handleFieldInput(name, true),
      { deep: internalSchema.value.entries[name].type === 'object' },
    )
  }

  function addFieldsValidationWatch() {
    for (const name in internalSchema.value.entries) {
      addFieldValidationWatch(name as ModelKey)
    }
  }

  async function validateForm(setError = true) {
    await Promise.all(
      Object.keys(fieldsStates.value).map(name => setFieldValidationState(name as ModelKey, setError)),
    )

    return isValid.value
  }

  function canExecuteValidation(name: ModelKey) {
    const { dirty, blurred, mode } = fieldsStates.value[name]

    return (
      isSubmitted.value
      || (mode === 'eager' && blurred)
      || (mode === 'onInput' && dirty)
      || (mode === 'onBlur' && blurred)
      || mode === 'aggressive'
      || mode === 'lazy'
    )
  }

  function handleFieldBlur(name: ModelKey, force = false) {
    const fieldValue = payload.value[name]
    const fieldState = fieldsStates.value[name]
    const isDirty = !isEmptyValue(fieldValue) && !isEqual(fieldValue, fieldState.initialValue)

    fieldState.dirty = isDirty
    fieldState.blurred = fieldState.blurred || isDirty

    if (!force && !canExecuteValidation(name)) {
      return
    }

    validateField(name)
  }

  function handleFieldInput(name: ModelKey, force = false) {
    const fieldValue = payload.value[name]
    const fieldState = fieldsStates.value[name]

    fieldState.validated = false

    const isDirty = !isEmptyValue(fieldValue) && !isEqual(fieldValue, fieldState.initialValue)

    fieldState.dirty = isDirty

    if (!force && !canExecuteValidation(name)) {
      return
    }

    validateField(name)
  }

  function handleSubmit(
    successCallback: (model: Model) => Promise<unknown> | unknown,
    enableScrollOrSelector?: boolean | string,
  ) {
    return async (event: Event) => {
      isSubmitted.value = true
      isSubmitting.value = true

      event.preventDefault()

      const isValidForm = await validateForm()

      if (isValidForm) {
        await successCallback(payload.value)
      }
      else if (enableScrollOrSelector || opts.scrollToErrorSelector) {
        scrollToError(typeof enableScrollOrSelector === 'string' ? enableScrollOrSelector : opts.scrollToErrorSelector)
      }

      isSubmitting.value = false
    }
  }

  const context = {
    handleFieldInput,
    handleFieldBlur,
    fieldsStates,
    payload,
    addFieldValidationWatch,
    validateField,
    options: opts,
    internalSchema,
    setFieldValidationState,
    errorMessages,
  } satisfies FormContext<Model, ModelKey>

  formContext = context as unknown as FormContext

  provide(FormContextKey, context as unknown as FormContext)

  if (['aggressive', 'lazy'].includes(opts.mode)) {
    addFieldsValidationWatch()
  }

  watch(internalSchema, () => {
    validateForm(opts.mode === 'aggressive')
  }, { deep: true, immediate: true })

  watch(
    payload,
    (newModel) => {
      if (model) {
        model.value = newModel
      }
    },
    { immediate: true },
  )

  return {
    isDirty,
    isSubmitting,
    isSubmitted,
    isValid,
    errors,
    model: payload,
    context,
    fieldsStates,
    validateForm,
    scrollToError,
    handleSubmit,
    errorMessages,
  }
}

export function useFormField<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
  FieldType = Model[ModelKey] | undefined,
>(name: ModelKey, options?: FormFieldOptions<FieldType>) {
  const context = formContext ?? inject<FormContext>(FormContextKey)

  if (!context) {
    throw new Error('useFormField must be used within a form (useFormValidator)')
  }

  const {
    handleFieldInput,
    handleFieldBlur,
    fieldsStates,
    payload,
    options: formOptions,
    addFieldValidationWatch,
    internalSchema,
    setFieldValidationState,
    errorMessages,
  } = context

  const opts = {
    ...options,
    mode: fieldHasValidation(name, internalSchema.value) ? options?.mode ?? formOptions.mode : 'none',
  } satisfies FormFieldOptions<FieldType>

  fieldsStates.value[name] = mergeFieldState({ name, fieldsStates: fieldsStates.value, payload, schema: internalSchema, options: opts })

  const fieldState = computed(() => fieldsStates.value[name])

  if (opts.defaultValue !== undefined && !isEqual(payload.value[name], opts.defaultValue)) {
    const initialValue = opts.defaultValue
    payload.value[name] = initialValue
    fieldsStates.value[name].initialValue = freezeValue(initialValue)
  }

  if (['aggressive', 'lazy'].includes(fieldState.value.mode) && !['aggressive', 'lazy'].includes(formOptions.mode)) {
    addFieldValidationWatch(name)
  }

  if (fieldState.value.mode !== 'none') {
    setFieldValidationState(name, fieldState.value.mode === 'aggressive' || formOptions.mode === 'aggressive')
  }

  const blurEvents = {
    onBlur: () => handleFieldBlur(name),
  }
  const inputEvents = {
    'onUpdate:modelValue': () => handleFieldInput(name),
  }

  const validationEvents = computed(() => {
    if (opts.componentRef || ['aggressive', 'lazy', 'none'].includes(fieldState.value.mode)) {
      return
    }

    if (fieldState.value.mode === 'onInput' || (fieldState.value.blurred && fieldState.value.mode === 'eager')) {
      return inputEvents
    }

    return blurEvents
  })

  if (
    opts.componentRef
    && !['aggressive', 'lazy'].includes(formOptions.mode)
    && !['aggressive', 'lazy'].includes(fieldsStates.value[name].mode)
  ) {
    let interactiveElements: HTMLElement[] = []
    let unwatchHandle: WatchStopHandle | null = null

    const addEvents = () => {
      addEventToInteractiveElements({
        interactiveElements,
        onBlur: blurEvents.onBlur,
        onInput: inputEvents['onUpdate:modelValue'],
        mode: fieldState.value.mode,
      })
    }

    unwatchHandle = watch(
      opts.componentRef,
      (newRef) => {
        if (newRef && newRef instanceof HTMLElement) {
          unwatchHandle?.()
          interactiveElements = findInteractiveElements(newRef)
          addEvents()
        }
        else if (newRef?.$el) {
          unwatchHandle?.()
          interactiveElements = findInteractiveElements(newRef.$el)
          addEvents()
        }
      },
      { immediate: true },
    )

    onUnmounted(() => {
      removeEventFromInteractiveElements({
        interactiveElements,
        onBlur: blurEvents.onBlur,
        onInput: inputEvents['onUpdate:modelValue'],
      })
      unwatchHandle?.()
    })
  }

  return {
    hasError: computed(() => fieldState.value.error),
    errors: computed(() => fieldState.value.errors),
    errorMessage: computed(() => errorMessages.value[name]),
    isValid: computed(() => fieldState.value.valid),
    isDirty: computed(() => fieldState.value.dirty),
    isBlurred: computed(() => fieldState.value.blurred),
    isValidated: computed(() => fieldState.value.validated),
    isValidating: computed(() => fieldState.value.validating),
    mode: computed(() => fieldState.value.mode),
    value: computed<FieldType>({
      get: () => payload.value[name] as FieldType,
      set: value => (payload.value[name] = value),
    }),
    validationEvents,
  }
}

export * from './types'
