<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { Component, Slot, VNode } from 'vue'
import type { FormComponentName, FormField as FormFieldType, FormSection, FormSectionContainerOption } from '../utils/schema-helpers'
import { computed, defineAsyncComponent, useId, useSlots } from 'vue'
import FormField from './FormField.vue'

export interface FieldSlotProps<T extends Record<string, unknown>> {
  field: FormFieldType<T, keyof T, FormComponentName>
  value: T[keyof T]
  model: T
  readonly: boolean
  disabled: boolean
  updateValue: (value: T[keyof T]) => void
}

export interface FormSectionComponentProps<T extends Record<string, unknown>> {
  section: FormSection<T>
  model: T
  components: Partial<Record<FormComponentName, Component>>
  readonly?: boolean
  disabled?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const {
  section,
  components,
  readonly,
  disabled,
} = defineProps<FormSectionComponentProps<T>>()

defineSlots<{
  [key: `field-${string}`]: (props: FieldSlotProps<T>) => VNode[]
}>()

const slots = useSlots()

const model = defineModel<T>({ required: true })

const MazContainer = defineAsyncComponent(() => import('maz-ui/components/MazContainer'))

const hasCard = computed(() => {
  return section.container !== undefined && section.container !== false
})

const containerProps = computed(() => {
  const containerOption = section.container as FormSectionContainerOption

  if (containerOption === true) {
    return {}
  }

  if (typeof containerOption === 'object') {
    return containerOption
  }

  return {}
})

const hasLegend = computed(() => {
  return section.legend !== undefined && section.legend !== ''
})

const sectionUniqueId = useId()
const legendId = computed(() => `${sectionUniqueId}-legend`)

function updateFieldValue(fieldName: keyof T, value?: T[keyof T]) {
  model.value = {
    ...model.value,
    [fieldName]: value,
  }
}

function getFieldSlotProps(field: FormFieldType<T, keyof T, FormComponentName>): FieldSlotProps<T> {
  return {
    field,
    value: model.value[field.name],
    model: model.value,
    readonly,
    disabled,
    updateValue: (value: T[keyof T]) => updateFieldValue(field.name, value),
  }
}

function isEmptySlot(el: Slot | undefined): boolean {
  const elements = el?.() ?? []
  return elements.map(el => el.children).flat().length === 0
}

function hasFieldSlot(fieldName: keyof T): boolean {
  return !isEmptySlot(slots[`field-${String(fieldName)}`])
}
</script>

<template>
  <MazContainer
    v-if="hasCard"
    v-bind="containerProps"
    :title="hasLegend ? containerProps.title : section.legend"
    role="group"
    :aria-label="hasLegend ? section.legend : undefined"
  >
    <fieldset
      :aria-labelledby="hasLegend ? undefined : legendId"
      :disabled
    >
      <template v-for="field in section.fields" :key="String(field.name)">
        <slot
          v-if="hasFieldSlot(field.name)"
          :name="`field-${String(field.name)}`"
          v-bind="getFieldSlotProps(field)"
        />
        <FormField
          v-else
          :field
          :model-value="model[field.name]"
          :model
          :components
          :readonly
          :disabled
          @update:model-value="updateFieldValue(field.name, $event)"
        />
      </template>
    </fieldset>
  </MazContainer>

  <fieldset
    v-else
    :aria-labelledby="hasLegend ? legendId : undefined"
    :disabled
  >
    <legend
      v-if="hasLegend"
      :id="legendId"
    >
      {{ section.legend }}
    </legend>
    <template v-for="field in section.fields" :key="String(field.name)">
      <slot
        v-if="hasFieldSlot(field.name)"
        :name="`field-${String(field.name)}`"
        v-bind="getFieldSlotProps(field)"
      />
      <FormField
        v-else
        :field
        :model-value="model[field.name] as T[keyof T]"
        :model
        :components
        :readonly
        :disabled
        @update:model-value="updateFieldValue(field.name, $event)"
      />
    </template>
  </fieldset>
</template>

<style scoped>
fieldset {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
