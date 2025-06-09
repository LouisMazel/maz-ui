<script lang="ts" setup>
import type { IconComponent } from '@maz-ui/icons'
import type { Component } from 'vue'
import type { MazColor } from './types'
import { MazCheckCircle, MazExclamationCircle, MazExclamationTriangle } from '@maz-ui/icons'
import {
  computed,
  ref,
  useSlots,
} from 'vue'

import MazExpandAnimation from './MazExpandAnimation.vue'
import MazIcon from './MazIcon.vue'

export interface MazStepperStep {
  title?: string
  subtitle?: string
  titleInfo?: string
  disabled?: boolean
  error?: boolean
  success?: boolean
  warning?: boolean
  icon?: string | IconComponent
}

const {
  modelValue,
  steps,
  color = 'primary',
  disabledNextSteps,
  disabledPreviousSteps,
  autoValidateSteps,
  allStepsOpened,
  allStepsValidated,
  canCloseSteps,
} = defineProps<MazStepperProps>()

const emits = defineEmits<{
  'update:model-value': [value: number]
}>()

export interface MazStepperProps {
  /** The current step */
  modelValue?: number
  /** The steps */
  steps?: MazStepperStep[]
  /**
   * The color of the stepper
   * @default primary
   */
  color?: MazColor
  /** Disable the next steps */
  disabledNextSteps?: boolean
  /** Disable the previous steps */
  disabledPreviousSteps?: boolean
  /** Auto validate the steps */
  autoValidateSteps?: boolean
  /** Open all steps */
  allStepsOpened?: boolean
  /** Validate all steps */
  allStepsValidated?: boolean
  /** Allow to close the steps */
  canCloseSteps?: boolean
}

const roundStepBgColor = computed(() => `hsl(var(--maz-${color}))`)
const roundStepTextColor = computed(() => `hsl(var(--maz-${color}-foreground))`)

const slots = useSlots()

const stepCount = computed<number>(
  () => Object.keys(slots).filter(slot => slot.startsWith('content-')).length,
)

const localModelValue = ref(1)

const currentStep = computed({
  get: () => modelValue ?? localModelValue.value,
  set: (value: number) => {
    localModelValue.value = value
    emits('update:model-value', value)
  },
})

function getStepStateData(step: number): { icon?: Component, class: string } {
  if (isStepSuccess(step)) {
    return { icon: MazCheckCircle, class: '--success' }
  }
  else if (isStepWarning(step)) {
    return { icon: MazExclamationTriangle, class: '--warning' }
  }
  else if (isStepError(step)) {
    return { icon: MazExclamationCircle, class: '--error' }
  }

  return { class: '--normal' }
}

function getStepIcon(step: number): IconComponent | string | undefined {
  return steps?.[step - 1]?.icon
}

function getPropertyInStep(property: 'title' | 'titleInfo' | 'subtitle', step: number) {
  return steps?.[step - 1]?.[property]
}

function selectStep(step: number) {
  if (currentStep.value === step && canCloseSteps) {
    currentStep.value = 0
  }
  else if (step < 1) {
    currentStep.value = 1
  }
  else if (step > stepCount.value) {
    currentStep.value = stepCount.value
  }
  else {
    currentStep.value = step
  }
}

function hasDataForStep(property: 'title' | 'titleInfo' | 'subtitle', step: number): boolean {
  const data = property === 'titleInfo' ? 'title-info' : property

  const hasSlot = Object.keys(slots)
    .filter(slot => slot.startsWith(`${data}-`))
    .includes(`${data}-${step}`)

  const hasData = !!steps?.[step - 1]?.[property]

  return hasSlot || hasData
}

function isStepSuccess(step: number): boolean {
  const isValidated = steps?.[step - 1]?.success
  const hasErrorOrWarningState = isStepError(step) || isStepWarning(step)

  const isAutoValidated
      = autoValidateSteps && step < currentStep.value && !hasErrorOrWarningState
  return isValidated ?? (isAutoValidated || allStepsValidated)
}

function isStepDisabled(step: number): boolean {
  const isDisabled = steps?.[step - 1]?.disabled
  const isCurrentStepDisabled = currentStep.value === step && !canCloseSteps
  const isAutoDisabledNext = disabledNextSteps && step > currentStep.value
  const isAutoDisabledPrevious = disabledPreviousSteps && step < currentStep.value

  return (
    isDisabled
    ?? (isCurrentStepDisabled
      || isAutoDisabledNext
      || isAutoDisabledPrevious
      || allStepsOpened)
  )
}

function isStepError(step: number) {
  return steps?.[step - 1]?.error
}

function isStepWarning(step: number) {
  return steps?.[step - 1]?.warning
}

function isLastStep(step: number): boolean {
  return step === stepCount.value
}
</script>

<template>
  <div class="m-stepper m-reset-css" :style="[{ '--round-step-bg-color': roundStepBgColor, '--round-step-text-color': roundStepTextColor }]">
    <template v-for="step in stepCount" :key="step">
      <button
        v-if="hasDataForStep('title', step)"
        :id="`header-step-${step}`"
        type="button"
        :disabled="isStepDisabled(step)"
        class="m-stepper__header"
        :class="[
          {
            '--is-current-step': step === currentStep || allStepsOpened,
            '--disabled': step !== currentStep && !allStepsOpened && isStepDisabled(step),
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
            <!--
              @slot icon-${step} - Replace step number in the circle by an icon for the step
            -->
            <slot :name="`icon-${step}`">
              <template v-if="getStepIcon(step)">
                <MazIcon
                  v-if="typeof getStepIcon(step) === 'string'"
                  :name="getStepIcon(step) as string"
                />
                <Component :is="getStepIcon(step)" v-else-if="getStepIcon(step)" />
              </template>
              <template v-else>
                {{ step }}
              </template>
            </slot>
          </span>

          <div class="m-stepper__header__content">
            <span class="m-stepper__title">
              <!--
                @slot title-${step} - Title of the step
              -->
              <slot :name="`title-${step}`">
                {{ getPropertyInStep('title', step) }}
              </slot>
            </span>
            <span v-if="hasDataForStep('subtitle', step)" class="m-stepper__subtitle">
              <!--
                @slot title-${step} - Subtitle of the step
              -->
              <slot :name="`subtitle-${step}`">
                {{ getPropertyInStep('subtitle', step) }}
              </slot>
            </span>
          </div>
        </div>

        <span v-if="hasDataForStep('titleInfo', step)" class="m-stepper__right">
          <!--
            @slot title-info-${step} - Info of the right of the step
          -->
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
        <MazExpandAnimation
          :model-value="allStepsOpened || currentStep === step"
          :aria-labelledby="`header-step-${step}`"
        >
          <div class="m-stepper__content__wrapper">
            <!-- @slot content-${step} - Content of the step
                @binding {boolean} validated - If the step is validated
                @binding {boolean} error - If the step has an error
                @binding {boolean} warning - If the step has a warning
                @binding {Function} previous-step - Function to go to the previous step
                @binding {Function} next-step - Function to go to the next step
              -->
            <slot
              :name="`content-${step}`"
              :validated="isStepSuccess(step)"
              :error="isStepError(step)"
              :warning="isStepWarning(step)"
              :next-step="() => selectStep(step + 1)"
              :previous-step="() => selectStep(step - 1)"
            />
          </div>
        </MazExpandAnimation>
      </div>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
  .m-stepper {
  &__right {
    @apply maz-truncate maz-text-end maz-text-sm maz-text-primary;
  }

  &__header {
    @apply maz-flex maz-w-full maz-cursor-pointer maz-select-text maz-items-center
        maz-justify-between maz-space-x-4 maz-rounded maz-px-4 maz-py-2 maz-text-start
        maz-transition-colors maz-duration-200;

    &__content {
      @apply maz-flex maz-flex-none maz-flex-col maz-items-start;
    }

    &:not(:disabled) {
      @apply hover:maz-bg-surface-300 hover:dark:maz-bg-surface-400;
    }

    &:disabled {
      @apply maz-cursor-not-allowed;
    }

    &.--disabled {
      @apply maz-text-gray-400 dark:maz-text-gray-500;
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
        @apply maz-text-success-foreground;
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
        @apply maz-text-warning-foreground;
      }
    }

    &.--error {
      .m-stepper__count__circle {
        @apply maz-scale-100 maz-bg-destructive;
      }

      .m-stepper__right {
        @apply maz-text-destructive;
      }

      svg {
        @apply maz-text-destructive-foreground;
      }
    }
  }

  &__title {
    @apply maz-text-lg;
  }

  &__subtitle {
    @apply maz-mt-1 maz-text-sm maz-text-muted;
  }

  &__count {
    @apply maz-relative maz-flex maz-h-8 maz-w-8 maz-flex-none
        maz-overflow-hidden maz-rounded-full maz-text-lg maz-flex-center;

    background-color: var(--round-step-bg-color);
    color: var(--round-step-text-color);

    &__circle {
      @apply maz-absolute maz-inset-0 maz-flex maz-scale-0 maz-rounded-full
          maz-transition-all maz-duration-300 maz-ease-in-out maz-flex-center;
    }

    svg {
      @apply maz-text-success-foreground;
    }
  }

  &__content {
    @apply maz-ml-[1.95rem] maz-border-l-2 maz-border-transparent maz-py-2 maz-pl-8;

    &__wrapper {
      @apply maz-py-2;
    }

    &:not(.--no-border) {
      @apply maz-border-divider;
    }
  }
}
</style>
