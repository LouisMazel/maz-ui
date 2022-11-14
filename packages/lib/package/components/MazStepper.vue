<template>
  <div class="m-stepper">
    <template v-for="step in stepCount" :key="step">
      <button
        v-if="hasTitleForStep(step)"
        type="button"
        :disabled="isStepDisabled(step)"
        class="m-stepper__header"
        @click="selectStep(step)"
      >
        <span
          class="m-stepper__count --primary"
          :class="{
            '--validated': isStepValidated(step),
          }"
        >
          <svg
            v-if="isStepValidated(step)"
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

          <template v-else>
            {{ step }}
          </template>
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

<script lang="ts" setup>
  import { computed, useSlots, ref, type PropType } from 'vue'
  import MazTransitionExpand from './MazTransitionExpand.vue'

  export interface Step {
    disabled?: boolean
    validated?: boolean
  }

  const props = defineProps({
    modelValue: { type: Number, default: undefined },
    steps: { type: Array as PropType<Step[]>, default: undefined },
    disabledNextSteps: { type: Boolean, default: false },
    disabledPreviousSteps: { type: Boolean, default: false },
    autoValidatedSteps: { type: Boolean, default: false },
  })

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
        maz-rounded-lg maz-px-4 maz-py-2 maz-outline-none maz-transition-colors maz-duration-200;

      &__content {
        @apply maz-flex maz-flex-col maz-items-start;
      }

      &:not(:disabled) {
        @apply hover:maz-bg-color-lighter focus:maz-bg-color-lighter;
      }

      &:disabled {
        @apply maz-cursor-not-allowed;
      }
    }

    &__title {
      @apply maz-text-normal;
    }

    &__subtitle {
      @apply maz-text-xs maz-text-muted;
    }

    &__count {
      @apply maz-flex maz-h-8 maz-w-8 maz-flex-none maz-items-center maz-justify-center maz-rounded-full maz-text-lg;

      &.--primary {
        @apply maz-bg-primary maz-text-primary-contrast;
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
