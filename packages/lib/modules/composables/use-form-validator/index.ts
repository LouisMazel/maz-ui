import type { Ref, WatchStopHandle } from 'vue'
import { computed, onUnmounted, provide, ref, toValue, watch } from 'vue'

import { freezeValue } from '../../helpers/freeze-value'
import { isEqual } from '../../helpers/is-equal'
import type {
  BaseFormPayload,
  ExtractModelKey,
  FieldsStates,
  FormContext,
  FormContextInjectionKey,
  FormFieldOptions,
  FormSchema,
  FormValidatorOptions,
  StrictOptions,
  UseFormValidatorParams,
} from './types'
import {
  addEventToInteractiveElements,
  fieldHasValidation,
  findInteractiveElements,
  getContext,
  getErrorMessages,
  getFieldsErrors,
  getFieldsStates,
  getInstance,
  getValidationEvents,
  handleFieldBlur,
  handleFieldInput,
  removeEventFromInteractiveElements,
  scrollToError,
  setFieldValidationState,
  updateFieldState,
  validateForm,
} from './utils'
import { CONFIG } from './config'

const FormContextKey: FormContextInjectionKey = Symbol('main')

export function useFormValidator<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<Model> = ExtractModelKey<Model>,
>({ schema, model, defaultValues, options }: UseFormValidatorParams<Model>) {
  const instance = getInstance<Model>('useFormValidator')

  const opts = {
    mode: CONFIG.mode,
    scrollToError: CONFIG.scrollToErrorSelector,
    debouncedFields: null,
    throttledFields: null,
    identifier: 'main',
    ...options,
  } satisfies StrictOptions<Model>

  const payload = ref({
    ...defaultValues,
    ...model?.value,
  }) as Ref<Model>

  const internalSchema = computed<FormSchema<Model>>(() => toValue(schema))
  const defaultPayload = defaultValues ?? payload.value
  const fieldsStates = ref(
    getFieldsStates({
      schema: internalSchema.value,
      payload: defaultPayload,
      options: opts,
    }),
  ) as Ref<FieldsStates<Model>>

  watch(
    internalSchema,
    (schema) => {
      fieldsStates.value = getFieldsStates({
        schema,
      })
    },
    { deep: true },
  )

  const isSubmitting = ref(false)
  const isSubmitted = ref(false)
  const isValid = computed(() => Object.values(fieldsStates.value).every(({ valid }) => valid))
  const isDirty = computed(() => Object.values(fieldsStates.value).some(({ dirty }) => dirty))
  const errors = computed(() => getFieldsErrors(fieldsStates.value))
  const errorMessages = computed(() => getErrorMessages(errors.value, fieldsStates.value))

  function addFieldValidationWatch(name: ModelKey) {
    watch(
      () => toValue(payload.value)[name],
      () => {
        handleFieldInput<Model>({
          name,
          fieldsStates: fieldsStates.value,
          payload: payload.value,
          schema: internalSchema.value,
          isSubmitted: isSubmitted.value,
          force: true,
        })
      },
      { deep: typeof internalSchema.value[name] === 'object' },
    )
  }

  function addFieldsValidationWatch() {
    for (const name of Object.keys(internalSchema.value)) {
      addFieldValidationWatch(name as ModelKey)
    }
  }

  function handleSubmit<Func extends (model: Model) => Promise<Awaited<ReturnType<Func>>> | ReturnType<Func>>(
    successCallback: Func,
    enableScrollOrSelector?: FormValidatorOptions['scrollToError'],
  ) {
    return async (event?: Event) => {
      isSubmitted.value = true
      isSubmitting.value = true

      event?.preventDefault()

      await validateForm<Model>({
        fieldsStates: fieldsStates.value,
        payload: payload.value,
        schema: internalSchema.value,
      })

      const scrollToErrorParam
        = typeof enableScrollOrSelector === 'string' ? enableScrollOrSelector : opts.scrollToError

      let response: Awaited<ReturnType<Func>> | ReturnType<Func> | undefined

      if (isValid.value) {
        response = await successCallback(payload.value)
      }
      else if (typeof scrollToErrorParam !== 'boolean') {
        scrollToError(scrollToErrorParam)
      }

      isSubmitting.value = false

      return response
    }
  }

  const context = {
    fieldsStates,
    payload,
    addFieldValidationWatch,
    options: opts,
    internalSchema,
    errorMessages,
    isSubmitted,
  } as unknown as FormContext<Model>

  instance.formContexts ??= new Map()
  instance.formContexts.set(opts.identifier, context)

  provide(FormContextKey as FormContextInjectionKey<Model>, context)

  const shouldAddFieldsWatches = ['aggressive', 'lazy'].includes(opts.mode)
  if (shouldAddFieldsWatches) {
    addFieldsValidationWatch()
  }

  watch(
    internalSchema,
    () => {
      validateForm<Model>({
        fieldsStates: fieldsStates.value,
        payload: payload.value,
        schema: internalSchema.value,
        setError: opts.mode === 'aggressive',
      })
    },
    { deep: true, immediate: true },
  )

  if (model) {
    watch(
      payload,
      (newModel) => {
        model.value = newModel
      },
      { immediate: true },
    )
  }

  return {
    identifier: opts.identifier,
    isDirty,
    isSubmitting,
    isSubmitted,
    isValid,
    errors,
    model: payload,
    fieldsStates,
    validateForm,
    scrollToError,
    handleSubmit,
    errorMessages,
  }
}

export function useFormField<
  FieldType extends Model[ExtractModelKey<Model>],
  Model extends BaseFormPayload = BaseFormPayload,
>(name: ExtractModelKey<Model>, options?: FormFieldOptions<FieldType>) {
  const opts = {
    formIdentifier: FormContextKey,
    ...options,
  } satisfies FormFieldOptions<FieldType>

  const {
    fieldsStates,
    payload,
    options: formOptions,
    addFieldValidationWatch,
    internalSchema,
    errorMessages,
    isSubmitted,
  } = getContext<Model>(opts.formIdentifier, 'useFormField')

  const fieldMode = fieldHasValidation(name, internalSchema.value) ? options?.mode ?? formOptions.mode : 'none'
  opts.mode = fieldMode

  fieldsStates.value[name] = updateFieldState<Model>({
    name,
    fieldsStates: fieldsStates.value,
    payload: payload.value,
    schema: internalSchema.value,
    options: { ...formOptions, ...opts },
  })

  const fieldState = computed(() => fieldsStates.value[name])

  if (opts.defaultValue !== undefined && !isEqual(payload.value[name], opts.defaultValue)) {
    const initialValue = opts.defaultValue
    payload.value[name] = initialValue
    fieldsStates.value[name].initialValue = freezeValue(initialValue)
  }

  const shouldAddWatchToField
    = ['aggressive', 'lazy'].includes(fieldState.value.mode) && !['aggressive', 'lazy'].includes(formOptions.mode)
  if (shouldAddWatchToField) {
    addFieldValidationWatch(name)
  }

  if (fieldState.value.mode !== 'none') {
    setFieldValidationState({
      name,
      fieldsStates: fieldsStates.value,
      payload: payload.value,
      schema: internalSchema.value,
      setError: fieldState.value.mode === 'aggressive' || formOptions.mode === 'aggressive',
    })
  }

  const events = {
    onBlur: () => {
      handleFieldBlur<Model>({
        name,
        fieldsStates: fieldsStates.value,
        payload: payload.value,
        schema: internalSchema.value,
        isSubmitted: isSubmitted.value,
      })
    },
    onInput: () =>
      handleFieldInput<Model>({
        name,
        fieldsStates: fieldsStates.value,
        payload: payload.value,
        schema: internalSchema.value,
        isSubmitted: isSubmitted.value,
      }),
  } as const

  const validationEvents = computed(() =>
    getValidationEvents({
      componentRef: opts.componentRef?.value,
      events,
      fieldState: fieldState.value,
    }),
  )

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
        events,
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
        events,
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
    value: computed({
      get: () => payload.value[name] as FieldType,
      set: value => (payload.value[name] = value),
    }),
    validationEvents,
  }
}

export * from './types'
