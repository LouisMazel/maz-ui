<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { Component, ComputedRef } from 'vue'
import type {
  FormBuilderState,
} from '../composables/useFormBuilder'
import type {
  FieldBlurEventPayload,
  FieldChangeEventPayload,
  FieldFocusEventPayload,
  FieldValidateEventPayload,
  FormComponentName,
  FormField,
  FormFieldAttrs,
  FormFieldProps,
} from '../utils/schema-helpers'
import { useInstanceUniqId } from 'maz-ui/composables'
import { computed, inject, watch } from 'vue'
import { FORM_BUILDER_STATE_KEY, FORM_BUILDER_VALIDATION_KEY } from '../utils/constants'

export interface FormFieldComponentProps<T extends Record<string, unknown>> {
  field: FormField<T, keyof T, FormComponentName>
  model: T
  components: Partial<Record<FormComponentName, Component>>
  readonly?: boolean
  disabled?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const { field, components, readonly, disabled } = defineProps<FormFieldComponentProps<T>>()

const emit = defineEmits<{
  'update:model-value': [value: T[keyof T]]
  'field-change': [payload: FieldChangeEventPayload<T>]
  'field-focus': [payload: FieldFocusEventPayload<T>]
  'field-blur': [payload: FieldBlurEventPayload<T>]
  'field-validate': [payload: FieldValidateEventPayload<T>]
}>()

const model = defineModel<T[keyof T]>()

const fieldUniqueId = useInstanceUniqId({
  componentName: 'FormField',
  providedId: field.id,
})
const errorMessageId = computed(() => `${fieldUniqueId.value}-error`)
const fieldId = computed(() => `${fieldUniqueId.value}-field`)

const validationContext = inject(FORM_BUILDER_VALIDATION_KEY)

const formBuilderState = inject<ComputedRef<FormBuilderState<T>> | null>(
  FORM_BUILDER_STATE_KEY,
  null,
)

let previousValue: T[keyof T] | undefined = model.value

const isVisible = computed(() => {
  if (!field.condition) {
    return true
  }
  return field.condition(model.value)
})

const componentToRender = computed(() => {
  const componentName = field.component as FormComponentName
  return components[componentName]
})

const fieldProps = computed(() => {
  return field.props as FormFieldProps<FormComponentName> | undefined
})

const fieldAttrs = computed(() => {
  return field.attrs as FormFieldAttrs | undefined
})

const fieldState = computed(() => {
  return validationContext?.value.fieldsStates[field.name as string]
})

const hasError = computed(() => {
  return fieldState.value?.error ?? false
})

const errorMessage = computed(() => {
  return validationContext?.value.errorMessages[field.name as string]
})

const hasValidation = computed(() => {
  return !!field.validation?.rule
})

const isRequired = computed(() => {
  return (field.props && 'required' in field.props && !!field.props?.required)
    || (field.attrs && 'required' in field.attrs && !!field.attrs?.required)
})

const accessibilityAttrs = computed(() => {
  const attrs: Record<string, string | boolean | undefined> = {
    'id': fieldId.value,
    'aria-invalid': hasError.value || undefined,
    'aria-describedby': hasError.value && errorMessage.value ? errorMessageId.value : undefined,
  }

  if (isRequired.value) {
    attrs['aria-required'] = true
  }

  return attrs
})

function handleUpdate(value: T[keyof T]): void {
  const changePayload: FieldChangeEventPayload<T> = {
    name: field.name,
    value,
    previousValue,
  }

  model.value = value
  emit('field-change', changePayload)

  if (formBuilderState?.value) {
    formBuilderState.value.emitFieldChange(changePayload)
  }

  previousValue = value
}

function handleFocus(): void {
  const focusPayload: FieldFocusEventPayload<T> = {
    name: field.name,
    value: model.value,
  }

  emit('field-focus', focusPayload)

  if (formBuilderState?.value) {
    formBuilderState.value.emitFieldFocus(focusPayload)
  }
}

function handleBlur(): void {
  const blurPayload: FieldBlurEventPayload<T> = {
    name: field.name,
    value: model.value,
  }

  emit('field-blur', blurPayload)

  if (formBuilderState?.value) {
    formBuilderState.value.emitFieldBlur(blurPayload)
  }

  if (validationContext?.value && hasValidation.value) {
    validationContext.value.handleFieldBlur(field.name as string)
  }
}

watch(
  () => fieldState.value,
  (newState, oldState) => {
    if (!newState || !hasValidation.value) {
      return
    }

    if (newState.validated && (!oldState || !oldState.validated || newState.valid !== oldState.valid)) {
      const validatePayload: FieldValidateEventPayload<T> = {
        name: field.name,
        value: model.value,
        isValid: newState.valid,
        errors: newState.errors,
      }

      emit('field-validate', validatePayload)

      if (formBuilderState?.value) {
        formBuilderState.value.emitFieldValidate(validatePayload)
      }
    }
  },
  { deep: true },
)
</script>

<template>
  <div
    v-if="isVisible && componentToRender"
    class="maz-form-field"
    :class="{
      'has-field-error': hasError,
      'maz-form-field--error': hasError,
    }"
    :data-field-name="field.name"
    :data-field-id="fieldId"
  >
    <component
      :is="componentToRender"
      :model-value="modelValue"
      :readonly="readonly"
      :disabled="disabled"
      :error="hasError"
      v-bind="{ ...fieldProps, ...fieldAttrs, ...accessibilityAttrs }"
      @update:model-value="handleUpdate"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <div
      v-if="hasError && errorMessage"
      :id="errorMessageId"
      class="maz-form-field__error"
      role="alert"
      aria-live="polite"
    >
      <template v-if="Array.isArray(errorMessage)">
        <p
          v-for="(msg, index) in errorMessage"
          :key="index"
          class="maz-form-field__error-message"
        >
          {{ msg }}
        </p>
      </template>
      <p
        v-else
        class="maz-form-field__error-message"
      >
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.maz-form-field {
  position: relative;
}

.maz-form-field__error {
  margin-top: 0.25rem;
}

.maz-form-field__error-message {
  color: var(--maz-color-danger, #dc2626);
  font-size: 0.875rem;
  line-height: 1.25;
  margin: 0;
}

.maz-form-field--error :deep(input),
.maz-form-field--error :deep(textarea),
.maz-form-field--error :deep(select) {
  border-color: var(--maz-color-danger, #dc2626);
}
</style>
