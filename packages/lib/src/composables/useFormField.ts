import type {
  BaseFormPayload,
  ExtractModelKey,
  FieldState,
  FormFieldOptions,
  FormSchema,
} from './useFormValidator/types'

import { isEqual } from '@maz-ui/utils/src/helpers/isEqual.js'
import { computed, onMounted, onUnmounted } from 'vue'
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

export function useFormField<
  FieldType,
  Model extends BaseFormPayload = BaseFormPayload,
  ModelKey extends ExtractModelKey<FormSchema<Model>> = ExtractModelKey<FormSchema<Model>>,
>(
  name: ModelKey,
  options?: FormFieldOptions<Model, ModelKey, FieldType>,
) {
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
  } = getContext<Model, ModelKey>(opts.formIdentifier, 'useFormField')

  const finalOpts = opts as FormFieldOptions<Model, ModelKey, Model[ModelKey]>

  const fieldMode = fieldHasValidation<Model, ModelKey>(name, internalSchema.value) ? options?.mode ?? formOptions.mode : undefined
  finalOpts.mode = fieldMode

  const fieldState = computed(() => fieldsStates.value[name])

  fieldsStates.value[name] = updateFieldState<Model, ModelKey, Model[ModelKey]>({
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
    setFieldValidationState<Model, ModelKey>({
      name,
      fieldState: fieldState.value,
      payload: payload.value,
      schema: internalSchema.value,
      setError: fieldMode === 'aggressive',
      setErrorIfInvalidAndNotEmpty: fieldMode === 'lazy',
    })
  }

  function onBlur() {
    handleFieldBlur<Model, ModelKey, FieldType>({
      name,
      fieldState: fieldState.value,
      payload: payload.value,
      schema: internalSchema.value,
      isSubmitted: isSubmitted.value,
    })
  }

  const validationEvents = computed(() =>
    getValidationEvents<Model, ModelKey, FieldState<Model, ModelKey, Model[ModelKey]>>({
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
        console.warn(`[maz-ui](useFormField) No element found for ref in field '${String(name)}'. Make sure the ref is properly bound to an HTMLElement or Vue component (form identifier: ${String(formOptions.identifier)})`)
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
      get: (): FieldType => payload.value[name] as FieldType,
      set: (value: FieldType) => (payload.value[name] = value as Model[ModelKey]),
    }),
    validationEvents,
  }
}
