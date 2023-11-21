<template>
  <div class="m-accordion">
    <template v-for="step in stepCount" :key="step">
      <MazCardSpotlight class="spotlight">
        <button class="header" @click="selectStep(step)">
          <slot :name="`title-${step}`" :is-open="isStepOpen(step)"> </slot>

          <Plus class="header-icon" :class="{ '--rotate': isStepOpen(step) }" />
        </button>

        <MazTransitionExpand animation-duration="300ms">
          <div v-show="isStepOpen(step)">
            <div class="maz-p-4">
              <slot name="content" :is-open="isStepOpen(step)"></slot>
              <slot :name="`content-${step}`" :is-open="isStepOpen(step)"> </slot>
            </div>
          </div>
        </MazTransitionExpand>
      </MazCardSpotlight>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, useSlots } from 'vue'
  import { MazTransitionExpand } from '.'
  import MazCardSpotlight from './MazCardSpotlight.vue'

  import Plus from './../icons/plus.svg'

  const props = withDefaults(
    defineProps<{
      modelValue?: number
    }>(),
    { modelValue: 0 },
  )

  const emits = defineEmits(['update:model-value'])

  const slots = useSlots()

  const stepCount = computed<number>(
    () => Object.keys(slots).filter((slot) => slot.startsWith('title-')).length,
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
    } else {
      localModelValue.value = index
      emits('update:model-value', index)
    }
  }
</script>

<style lang="postcss" scoped>
  .m-accordion {
    @apply maz-relative maz-inline-flex maz-flex-col maz-gap-4;

    .spotlight {
      @apply maz-w-full;
    }

    .header {
      @apply maz-flex maz-w-full maz-items-center maz-justify-between maz-gap-4 maz-px-4 maz-py-4 maz-transition-colors maz-duration-300 maz-ease-in-out;

      .header-icon {
        @apply maz-transition-transform maz-duration-300 maz-ease-in-out;

        &.--rotate {
          /* @apply maz-rotate-45; */

          transform: rotate(135deg);
        }
      }
    }
  }
</style>
