<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

import type { FormSection } from './types'
import FormSectionContent from './FormSectionContent.vue'

defineProps<{ section: FormSection }>()

const FormSectionContainer = defineAsyncComponent(
  () => import('./FormSectionContainer.vue'),
)

type WrapperObject = Exclude<NonNullable<FormSection['wrapper']>, boolean>

function isWrapperObject(wrapper: FormSection['wrapper']): wrapper is WrapperObject {
  return !!wrapper && typeof wrapper === 'object'
}
</script>

<template>
  <FormSectionContainer
    v-if="section.wrapper"
    :title="isWrapperObject(section.wrapper) && 'title' in section.wrapper ? section.wrapper.title : undefined"
    :icon="isWrapperObject(section.wrapper) ? section.wrapper.icon : undefined"
  >
    <FormSectionContent :section />
  </FormSectionContainer>

  <template v-else>
    <FormSectionContent :section />
  </template>
</template>
