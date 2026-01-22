<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { Component, ComputedRef, Ref } from 'vue'
import type { ErrorMessageValue, FieldsValidationStates } from '../composables/useFormBuilderValidation'
import type { FormComponentName, FormField, FormFieldAttrs, FormFieldProps } from '../utils/schema-helpers'
import { computed, inject, toRef } from 'vue'
import { FORM_BUILDER_VALIDATION_KEY } from '../utils/constants'

export interface FormFieldComponentProps<T extends Record<string, unknown>> {
  field: FormField<T, keyof T, FormComponentName>
  modelValue: T[keyof T]
  model: T
  components: Partial<Record<FormComponentName, Component>>
  readonly?: boolean
  disabled?: boolean
}

interface ValidationContext<T extends Record<string, unknown>> {
  fieldsStates: Ref<FieldsValidationStates<T>>
  errorMessages: ComputedRef<Partial<Record<keyof T, ErrorMessageValue>>>
  handleFieldBlur: (name: keyof T) => Promise<void>
  isValid: ComputedRef<boolean>
}

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<FormFieldComponentProps<T>>()

const emit = defineEmits<{
  'update:modelValue': [value: T[keyof T]]
}>()

const field = toRef(props, 'field')
const model = toRef(props, 'model')

const validationContext = inject<ComputedRef<ValidationContext<T>> | null>(
  FORM_BUILDER_VALIDATION_KEY,
  null,
)

const isVisible = computed(() => {
  if (!field.value.condition) {
    return true
  }
  return field.value.condition(model.value)
})

const componentToRender = computed(() => {
  const componentName = field.value.component as FormComponentName
  return props.components[componentName]
})

const fieldProps = computed(() => {
  return field.value.props as FormFieldProps<FormComponentName> | undefined
})

const fieldAttrs = computed(() => {
  return field.value.attrs as FormFieldAttrs | undefined
})

const fieldState = computed(() => {
  if (!validationContext?.value) {
    return null
  }
  return validationContext.value.fieldsStates.value[field.value.name] ?? null
})

const hasError = computed(() => {
  return fieldState.value?.error ?? false
})

const errorMessage = computed(() => {
  if (!validationContext?.value) {
    return undefined
  }
  return validationContext.value.errorMessages.value[field.value.name]
})

const hasValidation = computed(() => {
  return !!field.value.validation?.rule
})

function handleUpdate(value: T[keyof T]): void {
  emit('update:modelValue', value)
}

async function handleBlur(): Promise<void> {
  if (validationContext?.value && hasValidation.value) {
    await validationContext.value.handleFieldBlur(field.value.name)
  }
}
</script>

<template>
  <div
    v-if="isVisible && componentToRender"
    class="maz-form-field"
    :class="{
      'has-field-error': hasError,
      'maz-form-field--error': hasError,
    }"
  >
    <component
      :is="componentToRender"
      :model-value="modelValue"
      :readonly="readonly"
      :disabled="disabled"
      :error="hasError"
      v-bind="{ ...fieldProps, ...fieldAttrs }"
      @update:model-value="handleUpdate"
      @blur="handleBlur"
    />
    <div
      v-if="hasError && errorMessage"
      class="maz-form-field__error"
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
  margin-bottom: 1rem;
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
