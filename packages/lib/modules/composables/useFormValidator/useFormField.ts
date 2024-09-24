import type { ComponentPublicInstance } from 'vue'
import type {
  BaseFormPayload,
  ExtractModelKey,
  FormFieldOptions,
} from './types'

import { computed, onMounted, onUnmounted } from 'vue'
import { checkAvailability } from '../../helpers/check-availability'
import { freezeValue } from '../../helpers/freeze-value'
import { isEqual } from '../../helpers/is-equal'
import {
  addEventToInteractiveElements,
  fieldHasValidation,
  findInteractiveElements,
  getContext,
  getInstance,
  getValidationEvents,
  handleFieldBlur,
  hasModeIncludes,
  removeEventFromInteractiveElements,
  setFieldValidationState,
  updateFieldState,
} from './utils'

export function useFormField<
  FieldType extends Model[ExtractModelKey<Model>],
  Model extends BaseFormPayload = BaseFormPayload,
>(name: ExtractModelKey<Model>, options?: FormFieldOptions<FieldType>) {
  const opts = {
    formIdentifier: 'main-form-validator',
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

  const fieldMode = fieldHasValidation(name, internalSchema.value) ? options?.mode ?? formOptions.mode : undefined
  opts.mode = fieldMode

  const fieldState = computed(() => fieldsStates.value[name])

  fieldsStates.value[name] = updateFieldState<Model>({
    name,
    fieldState: fieldState.value,
    payload: payload.value,
    schema: internalSchema.value,
    options: { ...formOptions, ...opts },
  })

  if (opts.defaultValue !== undefined && !isEqual(payload.value[name], opts.defaultValue)) {
    const initialValue = opts.defaultValue
    payload.value[name] = initialValue
    fieldsStates.value[name].initialValue = freezeValue(initialValue)
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

  if (opts.ref && hasModeIncludes(['eager', 'blur', 'progressive'], fieldMode)) {
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
