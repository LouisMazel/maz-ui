<script lang="ts" setup>
import type { ClassValue } from 'vue'
import { computed, ref, useSlots } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import MazCardSpotlight from './MazCardSpotlight.vue'

import MazExpandAnimation from './MazExpandAnimation.vue'
import MazMorphIcon from './MazMorphIcon.vue'

export interface MazAccordionProps {
  id?: string
  modelValue?: number
  contentClass?: ClassValue
  /**
   * Render the content of each panel at its first opening only, then keep it mounted
   * @default false
   */
  lazy?: boolean
  /**
   * Wrap each item in a `MazCardSpotlight` (a halo follows the pointer). When `false`, the items are plain bordered cards
   * @default true
   */
  spotlight?: boolean
}

const {
  id = undefined,
  modelValue = 0,
  contentClass = undefined,
  lazy = false,
  spotlight = true,
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
      <component
        :is="spotlight ? MazCardSpotlight : 'div'"
        v-bind="spotlight ? { padding: false } : {}"
        class="m-accordion__spotlight maz:w-full"
        :class="{ 'maz:overflow-hidden maz:rounded-md maz:border maz:border-divider maz:bg-container': !spotlight }"
      >
        <button
          :id="`${instanceId}-header-${step}`"
          class="m-accordion__header maz:inline-flex maz:w-full maz:items-center maz:justify-between maz:gap-4 maz:p-4 maz:text-start maz:type-label maz:focus-ring"
          :aria-controls="`${instanceId}-panel-${step}`"
          :aria-expanded="isStepOpen(step)"
          @click="selectStep(step)"
        >
          <slot :name="`title-${step}`" :is-open="isStepOpen(step)" />

          <MazMorphIcon name="plus-minus" :active="isStepOpen(step)" class="header-icon" :class="{ '--rotate': isStepOpen(step) }" />
        </button>

        <MazExpandAnimation
          :id="`${instanceId}-panel-${step}`"
          :model-value="isStepOpen(step)"
          :lazy
          :aria-labelledby="`${instanceId}-header-${step}`"
        >
          <div class="m-accordion__content maz:p-4" :class="[contentClass, { '--open': isStepOpen(step) }]">
            <slot name="content" :is-open="isStepOpen(step)" />
            <slot :name="`content-${step}`" :is-open="isStepOpen(step)" />
          </div>
        </MazExpandAnimation>
      </component>
    </template>
  </div>
</template>

<style scoped>
.m-accordion__header {
  outline-offset: calc(var(--maz-focus-ring-width, 2px) * -1);
}

.m-accordion__content {
  opacity: 0;
  transform: translateY(0.5rem);
  transition:
    transform calc(var(--maz-motion-normal) * var(--maz-motion-scale) * 0.7) var(--maz-easing-in),
    opacity calc(var(--maz-motion-normal) * var(--maz-motion-scale) * 0.7) var(--maz-easing-in);

  &.--open {
    opacity: 1;
    transform: none;
    transition:
      transform calc(var(--maz-motion-slow) * var(--maz-motion-scale)) var(--maz-easing-out),
      opacity calc(var(--maz-motion-slow) * var(--maz-motion-scale)) var(--maz-easing-out);

    @starting-style {
      opacity: 0;
      transform: translateY(0.5rem);
    }
  }
}
</style>
