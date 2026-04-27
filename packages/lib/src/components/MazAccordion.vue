<script lang="ts" setup>
import type { ClassValue } from 'vue'
import { MazPlus } from '@maz-ui/icons/raw/MazPlus'
import { computed, ref, useSlots } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import MazCardSpotlight from './MazCardSpotlight.vue'

import MazExpandAnimation from './MazExpandAnimation.vue'
import MazIcon from './MazIcon.vue'

export interface MazAccordionProps {
  id?: string
  modelValue?: number
  contentClass?: ClassValue
}

const {
  id = undefined,
  modelValue = 0,
  contentClass = undefined,
} = defineProps<MazAccordionProps>()

const emits = defineEmits(['update:model-value'])
const instanceId = useInstanceUniqId({
  componentName: 'MazAccordion',
  providedId: id,
})

const slots = useSlots()

const stepCount = computed<number>(
  (): number => Object.keys(slots).filter(slot => slot.startsWith('title-')).length,
)

const localModelValue = ref(modelValue)

const currentStep = computed({
  get: () => modelValue || localModelValue.value,
  set: (value: number) => {
    localModelValue.value = value
    emits('update:model-value', value)
  },
})

function isStepOpen(index: number) {
  return currentStep.value === index
}

function selectStep(index: number) {
  if (currentStep.value === index) {
    localModelValue.value = 0
    emits('update:model-value', 0)
  }
  else {
    localModelValue.value = index
    emits('update:model-value', index)
  }
}
</script>

<template>
  <div class="m-accordion m-reset-css maz:relative maz:inline-flex maz:flex-col maz:gap-4 maz:align-top" role="presentation">
    <template v-for="step in stepCount" :key="step">
      <MazCardSpotlight class="m-accordion__spotlight maz:w-full" :padding="false">
        <button
          :id="`step-${step}-${instanceId}`"
          class="m-accordion__header maz:inline-flex maz:w-full maz:items-center maz:justify-between maz:gap-4 maz:p-4 maz:text-start maz:transition-colors maz:duration-300 maz:ease-in-out"
          :aria-controls="`step-${step}-${instanceId}`"
          :aria-expanded="isStepOpen(step)"
          @click="selectStep(step)"
        >
          <slot :name="`title-${step}`" :is-open="isStepOpen(step)" />

          <MazIcon :icon="MazPlus" class="header-icon maz:transition-transform maz:duration-300 maz:ease-in-out" :class="{ '--rotate': isStepOpen(step) }" />
        </button>

        <MazExpandAnimation
          animation-duration="300ms"
          :model-value="isStepOpen(step)"
          :aria-labelledby="`step-${step}-${instanceId}`"
        >
          <div class="m-accordion__content maz:p-4" :class="contentClass">
            <slot name="content" :is-open="isStepOpen(step)" />
            <slot :name="`content-${step}`" :is-open="isStepOpen(step)" />
          </div>
        </MazExpandAnimation>
      </MazCardSpotlight>
    </template>
  </div>
</template>

<style scoped>
.m-accordion__header .header-icon.--rotate {
  transform: rotate(135deg);
}
</style>
