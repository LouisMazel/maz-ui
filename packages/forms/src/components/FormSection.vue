<script lang="ts" setup generic="T extends Record<string, unknown>">
import type { Component, VNode } from 'vue'
import type { FormComponentName, FormField as FormFieldType, FormSection, FormSectionCardOption } from '../utils/schema-helpers'
import { computed, defineAsyncComponent, toRef, useId, useSlots } from 'vue'
import FormField from './FormField.vue'

export interface FieldSlotProps<T extends Record<string, unknown>> {
  field: FormFieldType<T, keyof T, FormComponentName>
  modelValue: T[keyof T]
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

const props = defineProps<FormSectionComponentProps<T>>()

defineSlots<{
  [key: `field-${string}`]: (props: FieldSlotProps<T>) => VNode[]
}>()

const slots = useSlots()

const model = defineModel<T>({ required: true })

const section = toRef(props, 'section')

const MazCard = defineAsyncComponent(() => import('maz-ui/components/MazCard'))

const hasCard = computed(() => {
  return section.value.card !== undefined && section.value.card !== false
})

const cardProps = computed(() => {
  const cardOption = section.value.card as FormSectionCardOption

  if (cardOption === true) {
    return {}
  }

  if (typeof cardOption === 'object') {
    return cardOption
  }

  return {}
})

const hasLegend = computed(() => {
  return section.value.legend !== undefined && section.value.legend !== ''
})

const sectionUniqueId = useId()
const legendId = computed(() => `${sectionUniqueId}-legend`)

function updateFieldValue(fieldName: keyof T, value: T[keyof T]) {
  model.value = {
    ...model.value,
    [fieldName]: value,
  }
}

function getFieldSlotProps(field: FormFieldType<T, keyof T, FormComponentName>): FieldSlotProps<T> {
  return {
    field,
    modelValue: model.value[field.name],
    model: model.value,
    readonly: props.readonly ?? false,
    disabled: props.disabled ?? false,
    updateValue: (value: T[keyof T]) => updateFieldValue(field.name, value),
  }
}

function hasFieldSlot(fieldName: keyof T): boolean {
  return !!slots[`field-${String(fieldName)}`]
}
</script>

<template>
  <MazCard
    v-if="hasCard"
    v-bind="cardProps"
    :title="hasLegend ? section.legend : undefined"
    block
    role="group"
    :aria-label="hasLegend ? section.legend : undefined"
  >
    <fieldset
      :aria-labelledby="hasLegend ? undefined : legendId"
    >
      <template v-for="field in section.fields" :key="String(field.name)">
        <slot
          v-if="hasFieldSlot(field.name)"
          :name="`field-${String(field.name)}`"
          v-bind="getFieldSlotProps(field)"
        />
        <FormField
          v-else
          :field="field"
          :model-value="model[field.name] as T[keyof T]"
          :model="model"
          :components="components"
          :readonly="readonly"
          :disabled="disabled"
          @update:model-value="updateFieldValue(field.name, $event)"
        />
      </template>
    </fieldset>
  </MazCard>

  <fieldset
    v-else
    :aria-labelledby="hasLegend ? legendId : undefined"
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
        :field="field"
        :model-value="model[field.name] as T[keyof T]"
        :model="model"
        :components="components"
        :readonly="readonly"
        :disabled="disabled"
        @update:model-value="updateFieldValue(field.name, $event)"
      />
    </template>
  </fieldset>
</template>
