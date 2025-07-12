import type {
  BaseFormPayload,
  ExtractModelKey,
  FormFieldOptions,
  FormSchema,
  InferSchemaFormValidator,
  ValidationIssues,
} from './useFormValidator/types'

import { isEqual } from '@maz-ui/utils/src/helpers/isEqual.js'
import { computed, type ComputedRef, onMounted, onUnmounted, type WritableComputedRef } from 'vue'
import {
  addEventToInteractiveElements,
  findInteractiveElements,
  getValidationEvents,
  removeEventFromInteractiveElements,
} from './useFormValidator/dom-events'
import {
  fieldHasValidation,
  getContext,
  handleFieldBlur,
  hasModeIncludes,
  updateFieldState,
} from './useFormValidator/state-management'
import { setFieldValidationState } from './useFormValidator/validation'
import { useFreezeValue } from './useFreezeValue'

interface UseFormFieldReturn<FieldType> {
  hasError: ComputedRef<boolean>
  errors: ComputedRef<ValidationIssues>
  errorMessage: ComputedRef<string | undefined>
  isValid: ComputedRef<boolean>
  isDirty: ComputedRef<boolean>
  isBlurred: ComputedRef<boolean>
  isValidated: ComputedRef<boolean>
  isValidating: ComputedRef<boolean>
  mode: ComputedRef<FormFieldOptions<FieldType>['mode']>
  value: WritableComputedRef<FieldType>
  validationEvents: ComputedRef<ReturnType<typeof getValidationEvents>>
}

export function useFormField<
  TSchema extends FormSchema<BaseFormPayload>,
  TName extends ExtractModelKey<FormSchema<InferSchemaFormValidator<TSchema>>> = ExtractModelKey<FormSchema<InferSchemaFormValidator<TSchema>>>,
>(
  name: TName,
  options?: FormFieldOptions<InferSchemaFormValidator<TSchema>[TName]>,
): UseFormFieldReturn<InferSchemaFormValidator<TSchema>[TName]> {
  type Model = InferSchemaFormValidator<TSchema>

  const opts = {
    formIdentifier: 'main-form-validator',
    ...options,
  }

  const {
    fieldsStates,
    payload,
    options: formOptions,
    internalSchema,
    errorMessages,
    isSubmitted,
  } = getContext<Model>(opts.formIdentifier, 'useFormField') as any

  type FieldType = Model[TName]
  const finalOpts = opts satisfies FormFieldOptions<FieldType>

  const fieldMode = fieldHasValidation(name, internalSchema.value) ? options?.mode ?? formOptions.mode : undefined
  finalOpts.mode = fieldMode

  const fieldState = computed(() => fieldsStates.value[name])

  fieldsStates.value[name] = updateFieldState({
    name,
    fieldState: fieldState.value,
    payload: payload.value,
    schema: internalSchema.value,
    options: { ...formOptions, ...finalOpts },
  })

  if (finalOpts.defaultValue !== undefined && !isEqual(payload.value[name], finalOpts.defaultValue)) {
    const initialValue = finalOpts.defaultValue
    payload.value[name] = initialValue
    fieldsStates.value[name].initialValue = useFreezeValue(initialValue)
  }

  if (fieldMode) {
    setFieldValidationState<Model>({
      name,
      fieldState: fieldState.value,
      payload: payload.value,
      schema: internalSchema.value,
      setError: fieldMode === 'aggressive',
      setErrorIfInvalidAndNotEmpty: fieldMode === 'lazy',
    })
  }

  function onBlur() {
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
      hasRef: !!finalOpts.ref?.value,
      onBlur,
      fieldState: fieldState.value,
    }),
  )

  if (finalOpts.ref && fieldMode && hasModeIncludes(['eager', 'blur', 'progressive'], fieldMode)) {
    let interactiveElements: HTMLElement[] = []

    const handleInteractiveElements = (element: HTMLElement) => {
      // Clean up previous listeners
      if (interactiveElements.length > 0) {
        removeEventFromInteractiveElements({
          interactiveElements,
          onBlur,
        })
      }

      interactiveElements = findInteractiveElements(element)

      addEventToInteractiveElements({
        interactiveElements,
        onBlur,
        mode: fieldMode,
      })
    }

    onMounted(() => {
      const element = finalOpts.ref?.value
      const elementToBind = element instanceof HTMLElement ? element : element?.$el as unknown

      if (elementToBind instanceof HTMLElement) {
        handleInteractiveElements(elementToBind)
      }
      else {
        console.warn(`[maz-ui](useFormField) No element found for ref in field '${String(name)}'. Make sure the ref is properly bound to an HTMLElement or Vue component (form identifier: ${formOptions.identifier})`)
      }
    })

    onUnmounted(() => {
      removeEventFromInteractiveElements({
        interactiveElements,
        onBlur,
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
      set: (value: FieldType) => (payload.value[name] = value),
    }),
    validationEvents,
  }
}
