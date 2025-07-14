<script lang="ts" setup>
import { MazPlus } from '@maz-ui/icons'
import { computed, ref, useSlots } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'

import MazCardSpotlight from './MazCardSpotlight.vue'
import MazExpandAnimation from './MazExpandAnimation.vue'

export interface MazAccordionProps {
  id?: string
  modelValue?: number
  contentClass?: unknown
}

const props = withDefaults(defineProps<MazAccordionProps>(), {
  id: undefined,
  modelValue: 0,
  contentClass: undefined,
})

const emits = defineEmits(['update:model-value'])
const instanceId = useInstanceUniqId({
  componentName: 'MazAccordion',
  providedId: props.id,
})

const slots = useSlots()

const stepCount = computed<number>(
  (): number => Object.keys(slots).filter(slot => slot.startsWith('title-')).length,
)

const localModelValue = ref(props.modelValue)

const currentStep = computed({
  get: () => props.modelValue || localModelValue.value,
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
  <div class="m-accordion m-reset-css" role="presentation">
    <template v-for="step in stepCount" :key="step">
      <MazCardSpotlight class="m-accordion__spotlight" :padding="false">
        <button
          :id="`step-${step}-${instanceId}`"
          class="m-accordion__header"
          :aria-controls="`step-${step}-${instanceId}`"
          :aria-expanded="isStepOpen(step)"
          @click="selectStep(step)"
        >
          <slot :name="`title-${step}`" :is-open="isStepOpen(step)" />

          <MazPlus class="header-icon" :class="{ '--rotate': isStepOpen(step) }" />
        </button>

        <MazExpandAnimation
          animation-duration="300ms"
          :model-value="isStepOpen(step)"
          :aria-labelledby="`step-${step}-${instanceId}`"
        >
          <div class="m-accordion__content" :class="contentClass">
            <slot name="content" :is-open="isStepOpen(step)" />
            <slot :name="`content-${step}`" :is-open="isStepOpen(step)" />
          </div>
        </MazExpandAnimation>
      </MazCardSpotlight>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
  .m-accordion {
  @apply maz-relative maz-inline-flex maz-flex-col maz-gap-4 maz-align-top;

  &__spotlight {
    @apply maz-w-full;
  }

  &__header {
    @apply maz-inline-flex maz-w-full maz-items-center maz-justify-between maz-gap-4 maz-p-4 maz-text-start maz-transition-colors maz-duration-300 maz-ease-in-out;

    .header-icon {
      @apply maz-transition-transform maz-duration-300 maz-ease-in-out;

      &.--rotate {
        /* @apply maz-rotate-45; */

        transform: rotate(135deg);
      }
    }
  }

  &__content {
    @apply maz-p-4;
  }
}
</style>
