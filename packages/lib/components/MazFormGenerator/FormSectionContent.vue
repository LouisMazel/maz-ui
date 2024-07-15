<script setup lang="ts">
import InputGenerator from './InputGenerator.vue'
import type { FormFieldCustom, FormFieldPredefined, FormSection } from './types'

defineProps<{
  section: FormSection
}>()

function hasComponent(
  field: NonNullable<FormSection['fields']>[number],
): field is FormFieldPredefined | FormFieldCustom {
  return 'componentName' in field || 'component' in field
}
</script>

<template>
  <Component v-bind="{ ...section.props, ...section.attrs }" :is="section.component" v-if="'component' in section" />
  <template v-else>
    <template v-for="field in section.fields" :key="field.name">
      <InputGenerator v-if="hasComponent(field)" :field />
    </template>
  </template>
</template>
