<script lang="ts">
export * from './MazFormGenerator/types'
</script>

<script lang="ts" setup generic="T extends FormPayload">
/* eslint-disable import/first */
import type { StyleValue } from 'vue'
import { computed, provide } from 'vue'
import type { Props as MazBtnProps } from './MazBtn.vue'

import type { FormValidatorOptions } from './../modules/composables/use-form-validator'
import { useFormValidator } from './../modules/composables/use-form-validator'
import type { InjectedFormData } from './MazFormGenerator/composables/useFormGenerator'
import { formDataInjectKey } from './MazFormGenerator/composables/useFormGenerator'
import type { FormPayload, FormSection as TFormSection } from './MazFormGenerator/types'
import FormSection from './MazFormGenerator/FormSection.vue'
import { getDefaultValues, getFormValidationSchema } from './MazFormGenerator/utils'
import MazBtn from './MazBtn.vue'
/* eslint-enable import/first */

const props = withDefaults(
  defineProps<{
    sections: TFormSection[]
    submitButton?: MazBtnProps & { text: string }
    contentClass?: unknown
    contentStyle?: StyleValue
    validationOptions?: FormValidatorOptions<T>
  }>(),
  {
    contentClass: undefined,
    contentStyle: undefined,
    submitButton: () => ({
      text: 'Submit',
      variation: 'primary',
    }),
  },
)

const emits = defineEmits<{
  /** To type the event value send by `@update:model-value` */
  'update:model-value': [payload: T]
  'submit': [payload: T]
}>()

const payload = defineModel<T>({
  default: {},
})

const { model, isValid, isSubmitting, handleSubmit } = useFormValidator<T>({
  schema: computed(() => getFormValidationSchema(props.sections)),
  model: payload,
  defaultValues: getDefaultValues<T>(props.sections),
  options: props.validationOptions,
})

provide<InjectedFormData<T>>(formDataInjectKey, {
  model,
  isValid,
})

const submitForm = handleSubmit(async (payload) => {
  emits('submit', payload)
}, true)

function getFieldsetLegend(section: TFormSection) {
  return 'legend' in section ? section.legend : section.wrapper.title
}
</script>

<template>
  <form novalidate class="form-generator" @submit.prevent="submitForm">
    <fieldset v-for="section in sections" :key="section.id" class="content" :class="contentClass" :style="contentStyle">
      <legend class="maz-sr-only">
        {{ getFieldsetLegend(section) }}
      </legend>
      <FormSection :section="section" />
    </fieldset>

    <slot name="append-section" />
    <slot name="submit-button" :submit-form="submitForm" :is-submitting="isSubmitting" :is-valid="isValid">
      <div class="form-generator__cta">
        <MazBtn
          data-testid="submitButton"
          type="submit"
          :loading="isSubmitting"
          v-bind="submitButton"
        >
          <slot name="submit-button-text">
            {{ submitButton.text }}
          </slot>
        </MazBtn>
      </div>
    </slot>
  </form>
</template>

<style lang="postcss" scoped>
.form-generator {
  @apply maz-flex maz-flex-col maz-gap-4;
}
</style>
