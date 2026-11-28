<script lang="ts" setup>
import type { Component } from 'vue'
import type { MazDrawnIconName } from './MazDrawnIcon.vue'
import type { MazIconValue } from './MazIcon.vue'
import type { MazColor, MazIconString } from './types.ts'
import { MazExclamationTriangle } from '@maz-ui/icons/lazy/MazExclamationTriangle'
import {
  computed,
  defineAsyncComponent,
  ref,
  useSlots,
  watch,
} from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import MazDrawnIcon from './MazDrawnIcon.vue'

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
  animated = true,
} = defineProps<MazStepperProps>()

const emits = defineEmits<{
  'update:model-value': [value: number]
}>()

export interface MazStepperStep {
  title?: string
  subtitle?: string
  titleInfo?: string
  content?: string
  disabled?: boolean
  error?: boolean
  success?: boolean
  warning?: boolean
  /** In the formats of MazIcon: a name (`'check'`, `'app:logo'`), a component, a URL or a raw SVG */
  icon?: MazIconValue
}

export interface MazStepperProps {
  /** The current step */
  modelValue?: number
  /** The steps */
  steps?: MazStepperStep[]
  /**
   * The color of the stepper
   * @default primary
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'neutral'`
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
  /**
   * The line fills, the checks draw themselves and the content arrives in the direction of the navigation
   * @default true
   */
  animated?: boolean
}

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazExpandAnimation = defineAsyncComponent(() => import('./MazExpandAnimation.vue'))

const roundStepBgColor = computed(() => `var(--maz-${color})`)
const roundStepBorderColor = computed(() => color === 'neutral' ? 'var(--maz-divider)' : 'transparent')
const roundStepTextColor = computed(() => `var(--maz-${color}-foreground)`)

const slots = useSlots()

const stepCount = computed<number>(
  (): number => Object.keys(slots).filter(slot => slot.startsWith('content-')).length || steps?.filter(step => step.content).length || 0,
)

const localModelValue = ref(1)

const currentStep = computed({
  get: () => modelValue ?? localModelValue.value,
  set: (value: number) => {
    localModelValue.value = value
    emits('update:model-value', value)
  },
})

const direction = ref<'forward' | 'backward'>('forward')

watch(currentStep, (step, previous) => {
  direction.value = step < previous
    ? 'backward'
    : 'forward'
})

const instanceId = useInstanceUniqId({ componentName: 'MazStepper' })

function getHeaderId(step: number) {
  return `${instanceId.value}-header-${step}`
}

function getContentId(step: number) {
  return `${instanceId.value}-content-${step}`
}

function isStepOpen(step: number) {
  return allStepsOpened || currentStep.value === step
}

function getStepStateData(step: number): { icon?: Component, drawn?: MazDrawnIconName, class: string } {
  if (isStepSuccess(step)) {
    return { drawn: 'check-circle', class: '--success' }
  }
  else if (isStepWarning(step)) {
    return { icon: MazExclamationTriangle, class: '--warning' }
  }
  else if (isStepError(step)) {
    return { drawn: 'exclamation-circle', class: '--error' }
  }

  return { class: '--normal' }
}

/** The line under a step fills when the stepper went through the step */
function isLineFilled(step: number) {
  return !isLastStep(step) && (step < currentStep.value || !!isStepSuccess(step))
}

/** Where the content of a closed step waits: it arrives moving in the direction of the navigation */
function getContentSide(step: number) {
  return step < currentStep.value
    ? 'before'
    : 'after'
}

function getStepIcon(step: number): MazIconValue | undefined {
  return steps?.[step - 1]?.icon
}

function getPropertyInStep(property: 'title' | 'titleInfo' | 'subtitle' | 'content', step: number) {
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
  const data = property === 'titleInfo'
    ? 'title-info'
    : property

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
  <div class="m-stepper m-reset-css" :class="{ '--animated': animated }" :style="[{ '--round-step-bg-color': roundStepBgColor, '--round-step-text-color': roundStepTextColor, '--round-step-border-color': roundStepBorderColor }]">
    <template v-for="step in stepCount" :key="step">
      <button
        v-if="hasDataForStep('title', step)"
        :id="getHeaderId(step)"
        type="button"
        :aria-current="step === currentStep ? 'step' : undefined"
        :aria-expanded="isStepOpen(step) ? 'true' : 'false'"
        :aria-controls="getContentId(step)"
        :disabled="isStepDisabled(step)"
        class="m-stepper__header maz:flex maz:w-full maz:cursor-interactive maz:items-center maz:justify-between maz:space-x-4 maz:rounded-md maz:px-4 maz:py-2 maz:text-start maz:focus-ring maz:transition-colors maz:duration-(--duration-fast) maz:select-text"
        :class="[
          {
            '--is-current-step maz:cursor-default': step === currentStep || allStepsOpened,
            '--disabled maz:disabled-opacity': step !== currentStep && !allStepsOpened && isStepDisabled(step),
            'maz:disabled-cursor': isStepDisabled(step),
            'maz:hover:bg-foreground/5': !isStepDisabled(step),
          },
          `${getStepStateData(step).class}`,
        ]"
        @click="selectStep(step)"
      >
        <div class="m-stepper__header__wrapper maz:flex maz:items-center maz:space-x-4">
          <div class="m-stepper__header__point__wrapper maz:flex maz:size-8 maz:flex-center">
            <slot name="point" :step>
              <span class="m-stepper__count --primary maz:relative maz:flex maz:size-8 maz:flex-none maz:flex-center maz:overflow-hidden maz:rounded-full maz:text-lg">
                <div class="m-stepper__count__circle maz:absolute maz:inset-0 maz:flex maz:scale-0 maz:flex-center maz:rounded-full">
                  <MazDrawnIcon
                    v-if="getStepStateData(step).drawn"
                    :name="getStepStateData(step).drawn!"
                    :stroke-width="1.5"
                    :duration="animated ? undefined : '0ms'"
                    :delay="animated ? 'calc(var(--maz-motion-fast) * var(--maz-motion-scale))' : '0ms'"
                    class="icon maz:text-xl"
                  />
                  <component
                    :is="getStepStateData(step).icon"
                    v-else-if="getStepStateData(step).icon"
                    class="icon maz:text-xl"
                  />
                </div>
                <!--
                @slot icon-${step} - Replace step number in the circle by an icon for the step
              -->
                <slot :name="`icon-${step}`">
                  <template v-if="getStepIcon(step)">
                    <MazIcon
                      v-if="typeof getStepIcon(step) === 'string'"
                      :icon="getStepIcon(step) as MazIconString"
                    />
                    <component :is="getStepIcon(step)" v-else-if="getStepIcon(step)" />
                  </template>
                  <template v-else>
                    {{ step }}
                  </template>
                </slot>
              </span>
            </slot>
          </div>

          <div class="m-stepper__header__content maz:flex maz:flex-none maz:flex-col maz:items-start">
            <span class="m-stepper__title">
              <!--
                @slot title-${step} - Title of the step
              -->
              <slot :name="`title-${step}`">
                <span v-if="getPropertyInStep('title', step)" v-html="getPropertyInStep('title', step)" />
              </slot>
            </span>
            <span v-if="hasDataForStep('subtitle', step)" class="m-stepper__subtitle maz:mt-1 maz:text-body-sm maz:text-muted">
              <!--
                @slot title-${step} - Subtitle of the step
              -->
              <slot :name="`subtitle-${step}`">
                <span v-if="getPropertyInStep('subtitle', step)" v-html="getPropertyInStep('subtitle', step)" />
              </slot>
            </span>
          </div>
        </div>

        <span v-if="hasDataForStep('titleInfo', step)" class="m-stepper__right maz:truncate maz:text-end maz:text-body-sm maz:text-primary">
          <!--
            @slot title-info-${step} - Info of the right of the step
          -->
          <slot :name="`title-info-${step}`">
            <span v-if="getPropertyInStep('titleInfo', step)" v-html="getPropertyInStep('titleInfo', step)" />
          </slot>
        </span>
      </button>

      <div
        :id="getContentId(step)"
        class="m-stepper__content maz:relative maz:ms-[1.95rem] maz:border-s maz:py-2 maz:ps-8"
        :class="[{
          'maz:border-transparent': isLastStep(step),
          'maz:border-divider': !isLastStep(step),
          '--filled': isLineFilled(step),
        }, getStepStateData(step).class]"
      >
        <MazExpandAnimation
          :model-value="isStepOpen(step)"
          :aria-labelledby="hasDataForStep('title', step) ? getHeaderId(step) : undefined"
        >
          <div
            class="m-stepper__content__wrapper maz:py-2"
            :class="[isStepOpen(step) ? '--open' : `--${getContentSide(step)}`, `--${direction}`]"
          >
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
            >
              <span v-if="getPropertyInStep('content', step)" v-html="getPropertyInStep('content', step)" />
            </slot>
          </div>
        </MazExpandAnimation>
      </div>
    </template>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

/* The line under a step fills toward the next one, and empties upward when going back */
.m-stepper__content::before {
  position: absolute;
  inset-block: 0;
  inset-inline-start: -1px;
  inline-size: 1px;
  background-color: var(--round-step-bg-color);
  content: '';
  pointer-events: none;
  transform: scaleY(0);
  transform-origin: top;
}

.m-stepper__content.--filled::before {
  transform: scaleY(1);
}

.m-stepper.--animated .m-stepper__content::before {
  transition: transform calc(var(--maz-motion-slow, 300ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-in-out, ease-in-out);
}

/* The content waits above (steps to come) or below (steps passed) and arrives moving in the direction of the navigation */
.m-stepper__content__wrapper {
  --m-stepper-shift: 0.5rem;

  &.--after {
    transform: translateY(calc(var(--m-stepper-shift) * -1));
  }

  &.--before {
    transform: translateY(var(--m-stepper-shift));
  }

  &.--after,
  &.--before {
    opacity: 0;
  }
}

.m-stepper.--animated .m-stepper__content__wrapper {
  transition:
    transform calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    opacity calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);

  &.--after,
  &.--before {
    transition-duration: calc(var(--maz-motion-normal, 200ms) * 0.7 * var(--maz-motion-scale, 1));
    transition-timing-function: var(--maz-easing-in, ease-in);
  }
}

.m-stepper__header,
.m-stepper__content {
  &.--success {
    --round-step-bg-color: var(--maz-success);
    --round-step-text-color: var(--maz-success-foreground);
    --round-step-border-color: transparent;
  }

  &.--warning {
    --round-step-bg-color: var(--maz-warning);
    --round-step-text-color: var(--maz-warning-foreground);
    --round-step-border-color: transparent;
  }

  &.--error {
    --round-step-bg-color: var(--maz-destructive);
    --round-step-text-color: var(--maz-destructive-foreground);
    --round-step-border-color: transparent;
  }
}

.m-stepper__count {
  background-color: var(--round-step-bg-color);
  color: var(--round-step-text-color);
  border: 1px solid var(--round-step-border-color);

  svg {
    @apply maz:text-success-foreground;
  }
}

.m-stepper__title {
  @apply maz:text-title-4;
}

.m-stepper.--animated .m-stepper__count__circle {
  transition: scale calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-spring, ease-out);
}

.m-stepper__header {
  &.--success {
    .m-stepper__count__circle {
      @apply maz:scale-100 maz:bg-success;
    }

    .m-stepper__right {
      @apply maz:text-success;
    }

    svg {
      @apply maz:text-success-foreground;
    }
  }

  &.--warning {
    .m-stepper__count__circle {
      @apply maz:scale-100 maz:bg-warning;
    }

    .m-stepper__right {
      @apply maz:text-warning;
    }

    svg {
      @apply maz:text-warning-foreground;
    }
  }

  &.--error {
    .m-stepper__count__circle {
      @apply maz:scale-100 maz:bg-destructive;
    }

    .m-stepper__right {
      @apply maz:text-destructive;
    }

    svg {
      @apply maz:text-destructive-foreground;
    }
  }
}
</style>
