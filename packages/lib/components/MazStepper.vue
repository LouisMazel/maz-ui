<template>
  <div class="m-stepper">
    <template v-for="step in stepCount" :key="step">
      <button
        v-if="hasDataForStep('title', step)"
        type="button"
        :disabled="isStepDisabled(step)"
        class="m-stepper__header"
        :class="[
          {
            '--is-current-step': step === currentStep || allStepsOpened,
          },
          `${getStepStateData(step).class}`,
        ]"
        @click="selectStep(step)"
      >
        <div class="m-stepper__header__wrapper">
          <span class="m-stepper__count --primary">
            <div class="m-stepper__count__circle">
              <Component
                :is="getStepStateData(step).icon"
                v-if="getStepStateData(step).icon"
                class="icon maz-text-xl"
              />
            </div>

            {{ step }}
          </span>

          <div class="m-stepper__header__content">
            <span class="m-stepper__title">
              <slot :name="`title-${step}`">
                {{ getPropertyInStep('title', step) }}
              </slot>
            </span>
            <span v-if="hasDataForStep('subtitle', step)" class="m-stepper__subtitle">
              <slot :name="`subtitle-${step}`">
                {{ getPropertyInStep('subtitle', step) }}
              </slot>
            </span>
          </div>
        </div>

        <span v-if="hasDataForStep('titleInfo', step)" class="m-stepper__right">
          <slot :name="`title-info-${step}`">
            {{ getPropertyInStep('titleInfo', step) }}
          </slot>
        </span>
      </button>

      <div
        class="m-stepper__content"
        :class="{
          '--no-border': isLastStep(step),
        }"
      >
        <MazTransitionExpand>
          <div v-show="allStepsOpened || currentStep === step">
            <div class="m-stepper__content__wrapper">
              <slot
                :name="`content-${step}`"
                :validated="isStepSuccess(step)"
                :error="isStepError(step)"
                :warning="isStepWarning(step)"
                :next-step="() => selectStep(step + 1)"
                :previous-step="() => selectStep(step - 1)"
              ></slot>
            </div>
          </div>
        </MazTransitionExpand>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { computed, useSlots, ref, type PropType, defineAsyncComponent, type Component } from 'vue'
  import type { Color } from './types'

  export type { Color }

  export interface Step {
    title?: string
    subtitle?: string
    titleInfo?: string
    disabled?: boolean
    error?: boolean
    success?: boolean
    warning?: boolean
  }
  export type Steps = Step[]

  const MazTransitionExpand = defineAsyncComponent(() => import('./MazTransitionExpand.vue'))
  const CheckCircleIcon = defineAsyncComponent(() => import('./../icons/check-circle.svg'))
  const ExclamationCircleIcon = defineAsyncComponent(
    () => import('./../icons/exclamation-circle.svg'),
  )
  const ExclamationIcon = defineAsyncComponent(() => import('./../icons/exclamation-triangle.svg'))

  const props = defineProps({
    modelValue: { type: Number, default: undefined },
    steps: { type: Array as PropType<Steps>, default: undefined },
    disabledNextSteps: { type: Boolean, default: false },
    disabledPreviousSteps: { type: Boolean, default: false },
    autoValidateSteps: { type: Boolean, default: false },
    allStepsOpened: { type: Boolean, default: false },
    allStepsValidated: { type: Boolean, default: false },
    color: {
      type: String as PropType<Color>,
      default: 'primary',
    },
    canCloseSteps: { type: Boolean, default: false },
  })

  const roundStepBgColor = computed(() => `var(--maz-color-${props.color})`)
  const roundStepTextColor = computed(() => `var(--maz-color-${props.color}-contrast)`)

  const emits = defineEmits(['update:model-value'])

  const slots = useSlots()

  const stepCount = computed<number>(
    () => Object.keys(slots).filter((slot) => slot.startsWith('content-')).length,
  )

  const localModelValue = ref(1)

  const currentStep = computed({
    get: () => props.modelValue ?? localModelValue.value,
    set: (value: number) => {
      localModelValue.value = value
      emits('update:model-value', value)
    },
  })

  const getStepStateData = (step: number): { icon?: Component; class: string } => {
    if (isStepSuccess(step)) {
      return { icon: CheckCircleIcon, class: '--success' }
    } else if (isStepWarning(step)) {
      return { icon: ExclamationIcon, class: '--warning' }
    } else if (isStepError(step)) {
      return { icon: ExclamationCircleIcon, class: '--error' }
    }

    return { class: '--normal' }
  }

  const getPropertyInStep = (property: 'title' | 'titleInfo' | 'subtitle', step: number) => {
    return props.steps?.[step - 1]?.[property]
  }

  const selectStep = (step: number) => {
    if (currentStep.value === step && props.canCloseSteps) {
      currentStep.value = 0
    } else if (step < 1) {
      currentStep.value = 1
    } else if (step > stepCount.value) {
      currentStep.value = stepCount.value
    } else {
      currentStep.value = step
    }
  }

  const hasDataForStep = (property: 'title' | 'titleInfo' | 'subtitle', step: number): boolean => {
    const data = property === 'titleInfo' ? 'title-info' : property

    const hasSlot = Object.keys(slots)
      .filter((slot) => slot.startsWith(`${data}-`))
      .includes(`${data}-${step}`)

    const hasData = !!props.steps?.[step - 1]?.[property]

    return hasSlot || hasData
  }

  const isStepSuccess = (step: number): boolean => {
    const isValidated = props.steps?.[step - 1]?.success
    const hasErrorOrWarningState = isStepError(step) || isStepWarning(step)

    const isAutoValidated =
      props.autoValidateSteps && step < currentStep.value && !hasErrorOrWarningState
    return isValidated ?? (isAutoValidated || props.allStepsValidated)
  }

  const isStepDisabled = (step: number): boolean => {
    const isDisabled = props.steps?.[step - 1]?.disabled
    const isCurrentStepDisabled = currentStep.value === step && !props.canCloseSteps
    const isAutoDisabledNext = props.disabledNextSteps && step > currentStep.value
    const isAutoDisabledPrevious = props.disabledPreviousSteps && step < currentStep.value

    return (
      isDisabled ??
      (isCurrentStepDisabled ||
        isAutoDisabledNext ||
        isAutoDisabledPrevious ||
        props.allStepsOpened)
    )
  }

  const isStepError = (step: number) => {
    return props.steps?.[step - 1]?.error
  }

  const isStepWarning = (step: number) => {
    return props.steps?.[step - 1]?.warning
  }

  const isLastStep = (step: number): boolean => {
    return step === stepCount.value
  }
</script>

<style lang="postcss" scoped>
  .m-stepper {
    &__header {
      @apply maz-flex maz-w-full maz-cursor-pointer maz-select-text maz-items-center
        maz-justify-between maz-space-x-4 maz-rounded maz-px-4 maz-py-2 maz-outline-none
        maz-transition-colors maz-duration-200;

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

      &__wrapper {
        @apply maz-flex maz-items-center maz-space-x-4;
      }

      &.--success {
        .m-stepper__count__circle {
          @apply maz-scale-100 maz-bg-success;
        }

        .m-stepper__right {
          @apply maz-text-success;
        }

        svg {
          @apply maz-text-success-contrast;
        }
      }

      &.--warning {
        .m-stepper__count__circle {
          @apply maz-scale-100 maz-bg-warning;
        }

        .m-stepper__right {
          @apply maz-text-warning;
        }

        svg {
          @apply maz-text-warning-contrast;
        }
      }

      &.--error {
        .m-stepper__count__circle {
          @apply maz-scale-100 maz-bg-danger;
        }

        .m-stepper__right {
          @apply maz-text-danger;
        }

        svg {
          @apply maz-text-danger-contrast;
        }
      }
    }

    &__title {
      @apply maz-text-normal;
    }

    &__subtitle {
      @apply maz-mt-1 maz-text-xs maz-text-muted;
    }

    &__right {
      @apply maz-text-right maz-text-sm maz-text-primary;
    }

    &__count {
      @apply maz-relative maz-flex maz-h-8 maz-w-8 maz-flex-none
        maz-overflow-hidden maz-rounded-full maz-text-lg maz-flex-center;

      background-color: v-bind('roundStepBgColor');
      color: v-bind('roundStepTextColor');

      &__circle {
        @apply maz-absolute maz-inset-0 maz-flex maz-scale-0 maz-rounded-full
          maz-transition-all maz-duration-300 maz-ease-in-out maz-flex-center;
      }

      svg {
        @apply maz-text-success-contrast;
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
