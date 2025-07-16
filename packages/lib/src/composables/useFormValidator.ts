import type { DeepPartial } from '@maz-ui/utils/src/ts-helpers/DeepPartial.js'
import type { MaybeRefOrGetter, Ref, WatchStopHandle } from 'vue'

import type {
  BaseFormPayload,
  ExtractModelKey,
  FieldsStates,
  FieldState,
  FormContext,
  FormSchema,
  FormValidatorOptions,
  InferOutputSchemaFormValidator,
  InferSchemaFormValidator,
  StrictOptions,
} from './useFormValidator/types'
import { computed, nextTick, provide, ref, toValue, watch } from 'vue'
import { CONFIG } from './useFormValidator/config'
import { scrollToError } from './useFormValidator/dom-events'
import {
  getFieldsStates,
  getInstance,
  handleFieldInput,
  hasModeIncludes,
  updateFieldsStates,
} from './useFormValidator/state-management'
import {
  getErrorMessages,
  getFieldsErrors,
  validateForm,
} from './useFormValidator/validation'

function createValidationProcessor<
  Model extends BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>>,
  F extends FieldState<Model, ModelKey, Model[ModelKey]>,
>(
  fieldsToValidate: string[],
  fieldsStates: Ref<FieldsStates<Model, ModelKey>>,
  payload: Ref<Model>,
  internalSchema: Ref<FormSchema<Model>>,
  isSubmitted: Ref<boolean>,
) {
  return () => {
    fieldsToValidate.forEach((name) => {
      const fieldState = fieldsStates.value[name as ModelKey] as F
      handleFieldInput<Model, ModelKey>({
        name: name as ModelKey,
        fieldState,
        payload: payload.value,
        schema: internalSchema.value,
        isSubmitted: isSubmitted.value,
        forceValidation: true,
      })
    })
  }
}

export function useFormValidator<TSchema extends MaybeRefOrGetter<FormSchema<BaseFormPayload>>>(
  { schema, defaultValues, model, options }: {
    schema: TSchema
    defaultValues?: MaybeRefOrGetter<DeepPartial<InferSchemaFormValidator<TSchema>> | undefined | null>
    model?: Ref<DeepPartial<InferSchemaFormValidator<TSchema>> | undefined | null>
    options?: FormValidatorOptions<InferSchemaFormValidator<TSchema>>
  },
) {
  type Model = InferSchemaFormValidator<TSchema>
  const instance = getInstance<Model>('useFormValidator')

  const opts = {
    mode: CONFIG.mode,
    scrollToError: CONFIG.scrollToErrorSelector,
    debouncedFields: null,
    throttledFields: null,
    identifier: 'main-form-validator',
    ...options,
  } satisfies StrictOptions<Model, ExtractModelKey<FormSchema<Model>>>

  const internalDefaultValues = ref(toValue(defaultValues)) as Ref<DeepPartial<Model>>
  const payload = ref({ ...internalDefaultValues.value, ...model?.value }) as Ref<Model>
  const internalSchema = ref(toValue(schema)) as Ref<FormSchema<Model>>
  const fieldsStates = ref(
    getFieldsStates<Model, ExtractModelKey<FormSchema<Model>>>({
      schema: internalSchema.value,
      payload: payload.value,
      options: opts,
    }),
  ) as Ref<FieldsStates<Model, ExtractModelKey<FormSchema<Model>>>>

  const isSubmitting = ref(false)
  const isSubmitted = ref(false)

  const isValid = computed((): boolean => {
    for (const key in fieldsStates.value) {
      if (!fieldsStates.value[key as ExtractModelKey<FormSchema<Model>>].valid) {
        return false
      }
    }
    return true
  })
  const isDirty = computed((): boolean => {
    for (const key in fieldsStates.value) {
      if (fieldsStates.value[key as ExtractModelKey<FormSchema<Model>>].dirty) {
        return true
      }
    }
    return false
  })
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

  function internalValidateForm(setErrors = opts.mode === 'aggressive') {
    return validateForm<Model>({
      fieldsStates: fieldsStates.value,
      payload: payload.value,
      schema: internalSchema.value,
      setErrors,
    })
  }

  // Optimized single watcher instead of one per field
  let payloadWatchStop: WatchStopHandle | null = null

  function setupOptimizedWatch() {
    // Clear existing watcher
    if (payloadWatchStop) {
      payloadWatchStop()
    }

    // Create a computed that returns a copy of payload values for proper reactivity
    const payloadSnapshot = computed(() => {
      const snapshot: Record<string, unknown> = {}
      for (const key of Object.keys(internalSchema.value)) {
        snapshot[key] = payload.value[key]
      }
      return snapshot
    })

    // Single watcher for all payload changes using computed snapshot
    payloadWatchStop = watch(
      payloadSnapshot,
      (newSnapshot, oldSnapshot) => {
        // Batch validation updates for performance
        const fieldsToValidate = Object.keys(internalSchema.value).filter((name) => {
          const fieldState = fieldsStates.value[name as ExtractModelKey<FormSchema<Model>>]
          return fieldState
            && newSnapshot[name] !== oldSnapshot?.[name]
            && hasModeIncludes(['aggressive', 'lazy', 'progressive'], fieldState.mode)
        })

        // Process validations with requestIdleCallback for better performance
        if (fieldsToValidate.length > 0) {
          const processValidations = createValidationProcessor(
            fieldsToValidate,
            fieldsStates,
            payload,
            internalSchema,
            isSubmitted,
          )

          // Use requestIdleCallback if available, otherwise nextTick
          if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(processValidations, { timeout: 100 })
          }
          else {
            nextTick(processValidations)
          }
        }
      },
      { deep: true },
    )
  }

  function handleSubmit<Func extends (model: InferOutputSchemaFormValidator<TSchema>) => Promise<Awaited<ReturnType<Func>>> | ReturnType<Func>>(
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
          response = await successCallback(payload.value as InferOutputSchemaFormValidator<TSchema>)
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

  const context: FormContext<Model, ExtractModelKey<FormSchema<Model>>> = {
    fieldsStates: fieldsStates as Ref<FieldsStates<Model, ExtractModelKey<FormSchema<Model>>>>,
    payload,
    options: opts,
    internalSchema,
    errorMessages,
    isSubmitted,
  }

  instance.formContexts ??= new Map()
  instance.formContexts.set(opts.identifier, context)

  provide(opts.identifier, context)

  setupOptimizedWatch()

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
