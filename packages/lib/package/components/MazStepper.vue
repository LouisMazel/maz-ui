<template>
  <div class="m-stepper">
    <template v-for="step in stepCount" :key="step">
      <button
        v-if="hasTitleForStep(step)"
        type="button"
        :disabled="isStepDisabled(step)"
        class="m-stepper__header"
        :class="{ '--is-current-step': step === currentStep }"
        @click="selectStep(step)"
      >
        <span
          class="m-stepper__count --primary"
          :class="{
            '--validated': isStepValidated(step),
          }"
        >
          <div class="m-stepper__count__circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width="1.2rem"
              height="1.2rem"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {{ step }}
        </span>

        <div class="m-stepper__header__content">
          <span class="m-stepper__title">
            <slot :name="`title-${step}`" />
          </span>
          <span v-if="hasSubtitleForStep(step)" class="m-stepper__subtitle">
            <slot :name="`subtitle-${step}`" />
          </span>
        </div>
      </button>

      <div
        class="m-stepper__content"
        :class="{
          '--no-border': isLastStep(step),
        }"
      >
        <MazTransitionExpand>
          <div v-if="currentStep === step">
            <div class="m-stepper__content__wrapper">
              <slot
                :name="`content-${step}`"
                :next-step="() => selectStep(step + 1)"
                :previous-step="() => selectStep(step - 1)"
              />
            </div>
          </div>
        </MazTransitionExpand>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  export type { Color } from './types'
</script>

<script lang="ts" setup>
  import { computed, useSlots, ref, type PropType } from 'vue'
  import MazTransitionExpand from './MazTransitionExpand.vue'
  import type { Color } from './types'

  export interface Step {
    disabled?: boolean
    validated?: boolean
  }
  export type Steps = Step[]

  const props = defineProps({
    modelValue: { type: Number, default: undefined },
    steps: { type: Array as PropType<Steps>, default: undefined },
    disabledNextSteps: { type: Boolean, default: false },
    disabledPreviousSteps: { type: Boolean, default: false },
    autoValidatedSteps: { type: Boolean, default: false },
    color: {
      type: String as PropType<Color>,
      default: 'primary',
      validator: (value: string) => {
        return [
          'primary',
          'secondary',
          'warning',
          'danger',
          'info',
          'success',
          'white',
          'gray',
          'black',
        ].includes(value)
      },
    },
  })

  const roundStepBgColor = computed(() => `var(--maz-color-${props.color})`)
  const roundStepTextColor = computed(
    () => `var(--maz-color-${props.color}-contrast)`,
  )

  const emits = defineEmits(['update:model-value'])

  const slots = useSlots()

  const stepCount = computed<number>(
    () =>
      Object.keys(slots).filter((slot) => slot.startsWith('content-')).length,
  )

  const localModelValue = ref(1)

  const currentStep = computed({
    get: () => props.modelValue ?? localModelValue.value,
    set: (value: number) => {
      localModelValue.value = value
      emits('update:model-value', value)
    },
  })

  const selectStep = (step: number) => {
    if (step < 1) {
      currentStep.value = 1
    } else if (step > stepCount.value) {
      currentStep.value = stepCount.value
    } else {
      currentStep.value = step
    }
  }

  const hasTitleForStep = (step: number): boolean => {
    return Object.keys(slots)
      .filter((slot) => slot.startsWith('title-'))
      .includes(`title-${step}`)
  }

  const hasSubtitleForStep = (step: number): boolean => {
    return Object.keys(slots)
      .filter((slot) => slot.startsWith('subtitle-'))
      .includes(`subtitle-${step}`)
  }

  const isStepValidated = (step: number): boolean => {
    const isValidated = !!props.steps?.[step - 1]?.validated
    const isAutoValidated = props.autoValidatedSteps && step < currentStep.value
    return isValidated || isAutoValidated
  }

  const isStepDisabled = (step: number): boolean => {
    const isDisabled = !!props.steps?.[step - 1]?.disabled
    const isCurrentStep = currentStep.value === step
    const isAutoDisabledNext =
      props.disabledNextSteps && step > currentStep.value
    const isAutoDisabledPrevious =
      props.disabledPreviousSteps && step < currentStep.value

    return (
      isDisabled ||
      isCurrentStep ||
      isAutoDisabledNext ||
      isAutoDisabledPrevious
    )
  }

  const isLastStep = (step: number): boolean => {
    return step === stepCount.value
  }
</script>

<style lang="postcss" scoped>
  .m-stepper {
    &__header {
      @apply maz-flex maz-w-full maz-cursor-pointer maz-items-center maz-space-x-4
        maz-rounded maz-px-4 maz-py-2 maz-outline-none maz-transition-colors maz-duration-200;

      &__content {
        @apply maz-flex maz-flex-col maz-items-start;
      }

      &:not(:disabled) {
        @apply hover:maz-bg-color-lighter focus:maz-bg-color-lighter;
      }

      &:disabled {
        @apply maz-cursor-not-allowed;
      }

      &.--is-current-step {
        @apply maz-cursor-default;
      }
    }

    &__title {
      @apply maz-text-normal;
    }

    &__subtitle {
      @apply maz-text-xs maz-text-muted;
    }

    &__count {
      @apply maz-relative maz-flex maz-h-8 maz-w-8 maz-flex-none
        maz-overflow-hidden maz-rounded-full maz-text-lg maz-flex-center;

      background-color: v-bind('roundStepBgColor');
      color: v-bind('roundStepTextColor');

      &__circle {
        @apply maz-absolute maz-inset-0 maz-flex maz-scale-0 maz-rounded-full
          maz-bg-success maz-transition-all maz-duration-300 maz-ease-in-out maz-flex-center;
      }

      svg {
        color: v-bind('roundStepTextColor');
      }

      &.--validated {
        & .m-stepper__count__circle {
          @apply maz-scale-100;
        }

        svg {
          @apply maz-text-success-contrast;
        }
      }
    }

    &__content {
      @apply maz-ml-[2rem] maz-border-l-2 maz-border-transparent maz-py-2 maz-pl-8;

      &__wrapper {
        @apply maz-py-2;
      }

      &:not(.--no-border) {
        @apply maz-border-color-lighter;
      }
    }
  }
</style>
