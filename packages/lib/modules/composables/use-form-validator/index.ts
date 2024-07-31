import type { ComponentPublicInstance, Ref } from 'vue'
import { computed, onMounted, onUnmounted, provide, ref, toValue, watch } from 'vue'

import { freezeValue } from '../../helpers/freeze-value'
import { isEqual } from '../../helpers/is-equal'
import { checkAvailability } from '../../helpers/check-availability'
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
  hasModeIncludes,
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

  const fieldsStates = ref(
    getFieldsStates<Model>({
      schema: internalSchema.value,
      payload: defaultValues ?? payload.value,
      options: opts,
    }),
  ) as Ref<FieldsStates<Model>>

  watch(
    internalSchema,
    (schema) => {
      fieldsStates.value = getFieldsStates({
        schema,
        payload: defaultValues ?? payload.value,
        options: opts,
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
        const fieldState = fieldsStates.value[name]

        handleFieldInput<Model>({
          name,
          fieldState,
          payload: payload.value,
          schema: internalSchema.value,
          isSubmitted: isSubmitted.value,
          forceValidation: hasModeIncludes(fieldState.mode, ['aggressive', 'lazy', 'progressive']),
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
    options: opts,
    internalSchema,
    errorMessages,
    isSubmitted,
  } as FormContext<Model>

  instance.formContexts ??= new Map()
  instance.formContexts.set(opts.identifier, context)

  provide(FormContextKey as FormContextInjectionKey<Model>, context)

  addFieldsValidationWatch()

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

  if (fieldMode !== 'none') {
    setFieldValidationState<Model>({
      name,
      fieldState: fieldState.value,
      payload: payload.value,
      schema: internalSchema.value,
      setError: fieldMode === 'aggressive',
    })
  }

  function onBlurHandler() {
    handleFieldBlur<Model>({
      name,
      fieldState: fieldState.value,
      payload: payload.value,
      schema: internalSchema.value,
      isSubmitted: isSubmitted.value,
    })
  }

  const validationEvents = computed(() =>
    getValidationEvents({
      ref: opts.ref,
      onBlurHandler,
      fieldState: fieldState.value,
    }),
  )

  if (opts.ref && hasModeIncludes(fieldMode, ['eager', 'blur', 'progressive'])) {
    let interactiveElements: HTMLElement[] = []

    const handleInteractiveElements = (element: HTMLElement) => {
      interactiveElements = findInteractiveElements(element)
      addEventToInteractiveElements({
        interactiveElements,
        onBlurHandler,
        mode: fieldMode,
      })
    }

    onMounted(() => {
      const instance = getInstance<Model>(`useFormField of ${name}`)

      checkAvailability(() => instance.refs[opts.ref as string] as HTMLElement | ComponentPublicInstance | undefined, (element) => {
        const interactiveElement = element instanceof HTMLElement ? element : element?.$el as HTMLElement | undefined
        if (interactiveElement) {
          handleInteractiveElements(interactiveElement)
        }
      }, {
        errorMessage: `[maz-ui](useFormField) No element found for ref ${opts.ref} for field ${name}`,
      })
    })

    onUnmounted(() => {
      removeEventFromInteractiveElements({
        interactiveElements,
        onBlurHandler,
      })
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
