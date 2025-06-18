import type { ComponentPublicInstance, ComputedRef, WritableComputedRef } from 'vue'
import type {
  BaseFormPayload,
  ExtractModelKey,
  FormFieldOptions,
  FormSchema,
  ValidationIssues,
} from '../composables/useFormValidator/types'

import { checkAvailability } from '@maz-ui/utils/src/utils/checkAvailability.js'

import { isEqual } from '@maz-ui/utils/src/utils/isEqual.js'
import { computed, onMounted, onUnmounted } from 'vue'
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
} from '../composables/useFormValidator/utils'
import { useFreezeValue } from '../composables/useFreezeValue'

interface UseFormFieldReturn<FieldType> {
  /**
   * Indicates if the field has an error
   */
  hasError: ComputedRef<boolean>
  /**
   * Errors of the field
   */
  errors: ComputedRef<ValidationIssues>
  /**
   * Error message of the field
   * It's the first error of the field
   */
  errorMessage: ComputedRef<string | undefined>
  /**
   * Indicates if the field is valid
   */
  isValid: ComputedRef<boolean>
  /**
   * Indicates if the field has been modified
   */
  isDirty: ComputedRef<boolean>
  /**
   * Indicates if the field has been blurred
   */
  isBlurred: ComputedRef<boolean>
  /**
   * Indicates if the field has been validated
   */
  isValidated: ComputedRef<boolean>
  /**
   * Indicates if the field is validating
   */
  isValidating: ComputedRef<boolean>
  /**
   * Validation mode of the field
   */
  mode: ComputedRef<FormFieldOptions<FieldType>['mode']>
  /**
   * Value of the field
   */
  value: WritableComputedRef<FieldType>
  /**
   * Validation events of the field
   */
  validationEvents: ComputedRef<ReturnType<typeof getValidationEvents>>
  /**
   * Function to handle the blur event of the field
   */
  onBlur: () => void
}

export function useFormField<
  FieldType extends Model[ExtractModelKey<FormSchema<Model>>],
  Model extends BaseFormPayload = BaseFormPayload,
>(name: ExtractModelKey<FormSchema<Model>>, options?: FormFieldOptions<FieldType>): UseFormFieldReturn<FieldType> {
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
      ref: opts.ref,
      onBlur,
      fieldState: fieldState.value,
    }),
  )

  if (opts.ref && hasModeIncludes(['eager', 'blur', 'progressive'], fieldMode)) {
    let interactiveElements: HTMLElement[] = []

    const handleInteractiveElements = (element: HTMLElement) => {
      interactiveElements = findInteractiveElements(element)
      addEventToInteractiveElements({
        interactiveElements,
        onBlur,
        mode: fieldMode,
      })
    }

    onMounted(() => {
      const instance = getInstance<Model>(`useFormField of ${name as string}`)

      checkAvailability(() => instance.refs[opts.ref as string] as HTMLElement | ComponentPublicInstance | undefined, (element) => {
        const interactiveElement = element instanceof HTMLElement ? element : element?.$el as HTMLElement | undefined
        if (interactiveElement) {
          handleInteractiveElements(interactiveElement)
        }
      }, {
        errorMessage: `[maz-ui](useFormField) No element found for ref ${opts.ref} for field ${name as string}`,
      })
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
      set: value => (payload.value[name] = value),
    }),
    validationEvents,
    onBlur,
  }
}
