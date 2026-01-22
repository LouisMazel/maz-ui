<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { MazBtnProps } from 'maz-ui/components/MazBtn'
import type { Component } from 'vue'
import type { FormComponentName, FormSchema } from '../utils/schema-helpers'
import { computed, defineAsyncComponent, toRef } from 'vue'
import { createSchemaAsyncComponents } from '../utils/component-map'
import FormSection from './FormSection.vue'

export interface SubmitButtonProps extends Omit<MazBtnProps, 'type'> {
  text?: string
}

export interface FormBuilderProps<T extends Record<string, unknown>> {
  schema: FormSchema<T>
  readonly?: boolean
  disabled?: boolean
  submitButton?: SubmitButtonProps | false
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FormBuilderProps<T>>(), {
  readonly: false,
  disabled: false,
  submitButton: undefined,
})

const emit = defineEmits<{
  submit: [payload: T]
}>()

const model = defineModel<T>({ required: true })

const schema = toRef(props, 'schema')

const MazBtn = defineAsyncComponent(() => import('maz-ui/components/MazBtn'))

const asyncComponents = computed(() => {
  return createSchemaAsyncComponents(schema.value)
})

const componentsWithGlobalState = computed<Partial<Record<FormComponentName, Component>>>(() => {
  return asyncComponents.value
})

const hasSubmitButton = computed(() => {
  return props.submitButton !== false
})

const submitButtonProps = computed<MazBtnProps>(() => {
  const baseProps: MazBtnProps = {
    type: 'submit',
    disabled: props.disabled,
  }

  if (props.submitButton && typeof props.submitButton === 'object') {
    const btnProps: MazBtnProps = { ...props.submitButton }
    delete (btnProps as { text?: string }).text
    return { ...baseProps, ...btnProps }
  }

  return baseProps
})

const submitButtonText = computed(() => {
  if (props.submitButton && typeof props.submitButton === 'object' && props.submitButton.text) {
    return props.submitButton.text
  }
  return 'Submit'
})

function handleSubmit() {
  if (props.disabled || props.readonly) {
    return
  }
  emit('submit', model.value)
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
  >
    <FormSection
      v-for="section in schema.sections"
      :key="section.id"
      v-model="model"
      :section="section"
      :model="model"
      :components="componentsWithGlobalState"
      :readonly="readonly"
      :disabled="disabled"
    />

    <MazBtn
      v-if="hasSubmitButton"
      v-bind="submitButtonProps"
    >
      {{ submitButtonText }}
    </MazBtn>
  </form>
</template>
