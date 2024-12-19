import type { Ref, WatchStopHandle } from 'vue'
import type {
  BaseFormPayload,
  ExtractModelKey,
  FieldsStates,
  FormContext,
  FormSchema,
  FormValidatorOptions,
  StrictOptions,
  UseFormValidatorParams,
} from '../composables/useFormValidator/types'

import { computed, nextTick, provide, ref, watch } from 'vue'
import { CONFIG } from '../composables/useFormValidator/config'
import {
  getErrorMessages,
  getFieldsErrors,
  getFieldsStates,
  getInstance,
  handleFieldInput,
  hasModeIncludes,
  scrollToError,
  updateFieldsStates,
  validateForm,
} from '../composables/useFormValidator/utils'

export function useFormValidator<
  Model extends BaseFormPayload,
>({ schema, defaultValues, model, options }: UseFormValidatorParams<Model>) {
  const instance = getInstance<Model>('useFormValidator')

  const opts = {
    mode: CONFIG.mode,
    scrollToError: CONFIG.scrollToErrorSelector,
    debouncedFields: null,
    throttledFields: null,
    identifier: 'main-form-validator',
    ...options,
  } satisfies StrictOptions<Model>

  const internalDefaultValues = ref(defaultValues) as Ref<Partial<Model>>
  const payload = ref({ ...internalDefaultValues.value, ...model?.value }) as Ref<Model>
  const internalSchema = ref(schema) as Ref<FormSchema<Model>>
  const fieldsStates = ref(
    getFieldsStates<Model>({
      schema: internalSchema.value,
      payload: payload.value,
      options: opts,
    }),
  ) as Ref<FieldsStates<Model>>

  const isSubmitting = ref(false)
  const isSubmitted = ref(false)

  const isValid = computed(() => Object.values(fieldsStates.value).every(({ valid }) => valid))
  const isDirty = computed(() => Object.values(fieldsStates.value).some(({ dirty }) => dirty))
  const errors = computed(() => getFieldsErrors(fieldsStates.value))
  const errorMessages = computed(() => getErrorMessages(errors.value, fieldsStates.value))

  if (model) {
    watch(
      payload,
      (newModel) => {
        model.value = { ...internalDefaultValues.value, ...newModel }
      },
      { deep: true },
    )
  }

  watch(
    internalDefaultValues,
    (newDefaultValues) => {
      payload.value = { ...newDefaultValues, ...payload.value }
    },
    { deep: true },
  )

  watch(
    internalSchema,
    (schema) => {
      updateFieldsStates({
        schema,
        fieldsStates: fieldsStates.value,
        payload: payload.value,
        options: opts,
      })
      internalValidateForm()
    },
    { deep: true },
  )

  internalValidateForm()

  function internalValidateForm(showErrors = opts.mode === 'aggressive') {
    return validateForm<Model>({
      fieldsStates: fieldsStates.value,
      payload: payload.value,
      schema: internalSchema.value,
      showErrors,
    })
  }

  const watchedPayloadStopFunctions: WatchStopHandle[] = []

  async function addFieldValidationWatch(name: ExtractModelKey<FormSchema<Model>>) {
    await nextTick()

    const watchStopFunc = watch(
      () => payload.value[name],
      () => {
        const fieldState = fieldsStates.value[name]

        handleFieldInput<Model>({
          name,
          fieldState,
          payload: payload.value,
          schema: internalSchema.value,
          isSubmitted: isSubmitted.value,
          forceValidation: hasModeIncludes(['aggressive', 'lazy', 'progressive'], fieldState.mode),
        })
      },
      { deep: typeof internalSchema.value[name] === 'object' },
    )

    watchedPayloadStopFunctions.push(watchStopFunc)
  }

  function addFieldsValidationWatch() {
    for (const watchStopFunc of watchedPayloadStopFunctions) {
      watchStopFunc()
    }

    for (const name of Object.keys(internalSchema.value)) {
      addFieldValidationWatch(name as ExtractModelKey<FormSchema<Model>>)
    }
  }

  function handleSubmit<Func extends (model: Model) => Promise<Awaited<ReturnType<Func>>> | ReturnType<Func>>(
    successCallback: Func,
    enableScrollOrSelector?: FormValidatorOptions['scrollToError'],
  ) {
    return async (event?: Event) => {
      event?.preventDefault()

      if (isSubmitting.value)
        return

      isSubmitted.value = true
      isSubmitting.value = true

      try {
        await internalValidateForm(true)

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
      finally {
        isSubmitting.value = false
      }
    }
  }

  const context = {
    fieldsStates,
    payload,
    options: opts,
    internalSchema,
    errorMessages,
    isSubmitted,
  } satisfies FormContext<Model>

  instance.formContexts ??= new Map()
  instance.formContexts.set(opts.identifier, context)

  provide(opts.identifier, context)

  addFieldsValidationWatch()

  return {
    identifier: opts.identifier,
    isDirty,
    isSubmitting,
    isSubmitted,
    isValid,
    errors,
    model: payload,
    fieldsStates,
    validateForm: internalValidateForm,
    scrollToError,
    handleSubmit,
    errorMessages,
  }
}
