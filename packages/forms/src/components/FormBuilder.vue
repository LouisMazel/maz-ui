<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { MazBtnProps } from 'maz-ui/components/MazBtn'
import type { Component, ComputedRef, Ref } from 'vue'
import type { FormBuilderState } from '../composables/useFormBuilder'
import type {
  ErrorMessageValue,
  FieldsValidationStates,
  FormBuilderValidationOptions,
  FormBuilderValidationReturn,
} from '../composables/useFormBuilderValidation'
import type { FormComponentName, FormSchema, ValidationIssues, ValidationMode } from '../utils/schema-helpers'
import { computed, defineAsyncComponent, provide, ref, shallowRef, toRef, watch } from 'vue'
import { createSchemaAsyncComponents } from '../utils/component-map'
import { FORM_BUILDER_STATE_KEY, FORM_BUILDER_VALIDATION_KEY } from '../utils/constants'
import FormSection from './FormSection.vue'

export interface SubmitButtonProps extends Omit<MazBtnProps, 'type'> {
  text?: string
}

export interface FormBuilderProps<T extends Record<string, unknown>> {
  schema: FormSchema<T>
  readonly?: boolean
  disabled?: boolean
  submitButton?: SubmitButtonProps | false
  validationMode?: ValidationMode
  scrollToError?: string | false
}

export interface FormBuilderValidationContext<T extends Record<string, unknown>> {
  fieldsStates: Ref<FieldsValidationStates<T>>
  errorMessages: ComputedRef<Partial<Record<keyof T, ErrorMessageValue>>>
  handleFieldBlur: (name: keyof T) => Promise<void>
  isValid: ComputedRef<boolean>
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FormBuilderProps<T>>(), {
  readonly: false,
  disabled: false,
  submitButton: undefined,
  validationMode: 'lazy',
  scrollToError: '.has-field-error',
})

const emit = defineEmits<{
  submit: [payload: T, isValid: boolean]
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

function hasValidationRules(formSchema: FormSchema<T>): boolean {
  for (const section of formSchema.sections) {
    for (const field of section.fields) {
      if (field.validation?.rule) {
        return true
      }
    }
  }
  return false
}

const validationInstance = shallowRef<FormBuilderValidationReturn<T> | null>(null)
const validationLoaded = ref(false)
const isSubmitting = ref(false)
const isSubmitted = ref(false)

const fieldsStates = computed<FieldsValidationStates<T>>(() => {
  const instance = validationInstance.value
  if (instance) {
    return instance.fieldsStates.value
  }
  return {} as FieldsValidationStates<T>
})

const errorMessages = computed<Partial<Record<keyof T, ErrorMessageValue>>>(() => {
  const instance = validationInstance.value
  if (instance) {
    return instance.errorMessages.value
  }
  return {}
})

const isFormValid = computed<boolean>(() => {
  const instance = validationInstance.value
  if (instance) {
    return instance.isValid.value
  }
  return true
})

const isDirty = computed<boolean>(() => {
  const instance = validationInstance.value
  if (instance) {
    return instance.isDirty.value
  }
  return false
})

const isValidating = computed<boolean>(() => {
  const instance = validationInstance.value
  if (instance) {
    return instance.isValidating.value
  }
  return false
})

const errors = computed<Partial<Record<keyof T, ValidationIssues>>>(() => {
  const states = fieldsStates.value
  const result: Partial<Record<keyof T, ValidationIssues>> = {}
  for (const key in states) {
    const fieldKey = key as keyof T
    const state = states[fieldKey]
    if (state?.errors && state.errors.length > 0) {
      result[fieldKey] = state.errors
    }
  }
  return result
})

async function loadValidationComposable(): Promise<void> {
  if (validationLoaded.value) {
    return
  }

  const { useFormBuilderValidation } = await import('../composables/useFormBuilderValidation')

  const validationOptions: FormBuilderValidationOptions = {
    mode: props.validationMode,
    scrollToError: props.scrollToError,
  }

  validationInstance.value = useFormBuilderValidation<T>(
    schema as Ref<FormSchema<T>>,
    model as Ref<T>,
    validationOptions,
  )

  validationLoaded.value = true
}

async function handleFieldBlur(name: keyof T): Promise<void> {
  if (validationInstance.value) {
    await validationInstance.value.handleFieldBlur(name)
  }
}

watch(
  schema,
  async (newSchema) => {
    if (hasValidationRules(newSchema) && !validationLoaded.value) {
      await loadValidationComposable()
    }
  },
  { immediate: true, deep: true },
)

const validationContext = computed<FormBuilderValidationContext<T>>(() => ({
  fieldsStates: ref(fieldsStates.value) as Ref<FieldsValidationStates<T>>,
  errorMessages,
  handleFieldBlur,
  isValid: isFormValid,
}))

provide(FORM_BUILDER_VALIDATION_KEY, validationContext)

const fieldsStatesRef = ref(fieldsStates.value) as Ref<FieldsValidationStates<T>>

watch(fieldsStates, (newValue) => {
  fieldsStatesRef.value = newValue
}, { deep: true })

const formBuilderState = computed<FormBuilderState<T>>(() => ({
  isValid: isFormValid,
  isSubmitting,
  isSubmitted,
  isDirty,
  errors,
  errorMessages,
  fieldsStates: fieldsStatesRef,
  handleFieldBlur,
}))

provide(FORM_BUILDER_STATE_KEY, formBuilderState)

async function handleSubmit(): Promise<void> {
  if (props.disabled || props.readonly) {
    return
  }

  isSubmitting.value = true
  let isValid = true

  try {
    if (validationInstance.value) {
      isValid = await validationInstance.value.validateForm()

      if (!isValid && props.scrollToError) {
        validationInstance.value.scrollToFirstError(
          typeof props.scrollToError === 'string' ? props.scrollToError : undefined,
        )
      }
    }

    emit('submit', model.value, isValid)
  }
  finally {
    isSubmitting.value = false
    isSubmitted.value = true
  }
}

defineExpose({
  validateForm: () => validationInstance.value?.validateForm(),
  validateField: (name: keyof T) => validationInstance.value?.validateField(name),
  resetValidation: () => validationInstance.value?.resetValidation(),
  isValid: isFormValid,
  isSubmitting,
  isSubmitted,
  isDirty,
  isValidating,
  errors,
  errorMessages,
  fieldsStates,
})
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
