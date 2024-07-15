<script lang="ts" setup generic="T extends FormFieldValue">
import type { ComponentPublicInstance } from 'vue'
import { computed, defineAsyncComponent, ref } from 'vue'
import type {
  FormFieldCustom,
  FormFieldPredefined,
  FormFieldValue,
} from './types'
import { useFormField } from './../../modules/composables/use-form-validator'

const props = defineProps<{
  field: FormFieldPredefined | FormFieldCustom
}>()

const componentRef = ref<ComponentPublicInstance>()

const { value, errorMessage, hasError } = useFormField(props.field.name, {
  mode: props.field.validation?.mode,
  defaultValue: props.field.defaultValue,
  componentRef,
})

const componentName = computed(() => (isCustomComponent(props.field) ? undefined : props.field.componentName))

function getMazComponent(componentName?: FormFieldPredefined['componentName']) {
  if (!componentName) {
    return
  }

  return defineAsyncComponent(async () => {
    return (await import('maz-ui/components'))[componentName]
  })
}

function isCustomComponent(field: FormFieldPredefined | FormFieldCustom): field is FormFieldCustom {
  return 'component' in field
}

const Component = computed(() => {
  return isCustomComponent(props.field) ? props.field.component : getMazComponent(componentName.value)
})

const name = computed(() => props.field.attrs?.name ?? props.field.name)
</script>

<template>
  <Component
    v-bind="{ ...field.props, ...field.attrs, ...$attrs }"
    :is="Component"
    :id="field.id"
    ref="componentRef"
    v-model="value"
    :name
    :error="hasError"
    :hint="errorMessage"
    :class="{ 'has-input-error': hasError }"
  >
    <template v-for="slot in field.slots" #[slot.name]>
      {{ slot.value }}
    </template>
  </Component>
</template>
