<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { Component } from 'vue'
import type { FormComponentName, FormField, FormFieldAttrs, FormFieldProps } from '../utils/schema-helpers'
import { computed, toRef } from 'vue'

export interface FormFieldComponentProps<T extends Record<string, unknown>> {
  field: FormField<T, keyof T, FormComponentName>
  modelValue: T[keyof T]
  model: T
  components: Partial<Record<FormComponentName, Component>>
  readonly?: boolean
  disabled?: boolean
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

function handleUpdate(value: T[keyof T]) {
  emit('update:modelValue', value)
}
</script>

<template>
  <component
    :is="componentToRender"
    v-if="isVisible && componentToRender"
    :model-value="modelValue"
    :readonly="readonly"
    :disabled="disabled"
    v-bind="{ ...fieldProps, ...fieldAttrs }"
    @update:model-value="handleUpdate"
  />
</template>
