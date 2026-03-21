<script lang="ts" setup>
import type { IconComponent } from '@maz-ui/icons'
import type { CSSProperties, HTMLAttributes } from 'vue'

import type { MazColor, MazSize } from './types'
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, useId, useSlots, watch } from 'vue'

export type MazTimelineColor = Exclude<MazColor, 'transparent'>
export type MazTimelineDirection = 'horizontal' | 'vertical' | 'auto'
export type MazTimelineRoundedSize = 'none' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
export type MazTimelineStepState = 'completed' | 'active' | 'error' | 'warning' | 'pending'

export interface MazTimelineItem {
  /**
   * Title displayed below (horizontal) or beside (vertical) the step indicator
   */
  title?: string
  /**
   * Subtitle displayed below the title
   */
  subtitle?: string
  /**
   * Icon for the step indicator - can be a component or icon name string
   * @type {IconComponent | string}
   */
  icon?: IconComponent | string
  /**
   * State of the step
   * @type {MazTimelineStepState}
   * @values `'completed' | 'active' | 'error' | 'warning' | 'pending'`
   * @default 'pending'
   */
  state?: MazTimelineStepState
  /**
   * Whether the step is disabled (not clickable, visually muted)
   * @default false
   */
  disabled?: boolean
}

export interface MazTimelineProps {
  /**
   * Index of the active step (v-model)
   */
  modelValue?: number
  /**
   * Array of timeline steps to display
   * @required
   */
  steps: MazTimelineItem[]
  /**
   * Layout direction of the timeline
   * - `'horizontal'`: always horizontal
   * - `'vertical'`: always vertical
   * - `'auto'`: horizontal above breakpoint, vertical below
   * @type {MazTimelineDirection}
   * @values `'horizontal' | 'vertical' | 'auto'`
   * @default 'auto'
   */
  direction?: MazTimelineDirection
  /**
   * CSS media breakpoint for auto direction (below this value → vertical)
   * @default '768px'
   */
  breakpoint?: string
  /**
   * Color theme for active and completed steps
   * @type {MazTimelineColor}
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast'`
   * @default 'primary'
   */
  color?: MazTimelineColor
  /**
   * Size of the step indicators and typography
   * @type {MazSize}
   * @values `'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
   * @default 'md'
   */
  size?: MazSize
  /**
   * Show step numbers inside the indicators
   * @default true
   */
  showStepNumbers?: boolean
  /**
   * Automatically show a checkmark icon for completed steps
   * @default true
   */
  autoValidateSteps?: boolean
  /**
   * Enable click interaction on steps
   * @default false
   */
  clickable?: boolean
  /**
   * Enable animations (pulse on active, state transitions, connector progress)
   * @default true
   */
  animated?: boolean
  /**
   * Border radius of step indicators
   * @type {MazTimelineRoundedSize}
   * @values `'none' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'`
   * @default 'full'
   */
  roundedSize?: MazTimelineRoundedSize
}

const {
  modelValue = undefined,
  direction = 'auto',
  breakpoint = '768px',
  color = 'primary',
  size = 'md',
  showStepNumbers = true,
  autoValidateSteps = true,
  clickable = false,
  animated = true,
  roundedSize = 'base',
  steps,
} = defineProps<MazTimelineProps>()

/**
 * @event update:modelValue - Emitted when the active step changes
 * @event click-step - Emitted when a step is clicked (only if `clickable` is true)
 */
const emit = defineEmits<{
  /**
   * Emitted when the active step changes
   * @param value - The new active step index
   */
  'update:modelValue': [value: number]
  /**
   * Emitted when a clickable step is clicked
   * @param payload - The step data and its index
   */
  'click-step': [payload: { step: MazTimelineItem, index: number }]
}>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))

const slots = useSlots()
const instanceId = useId()

// --- Responsive direction ---
const isVertical = ref(false)
let mediaQuery: MediaQueryList | undefined

function cleanupMediaQuery() {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', onMediaChange)
    mediaQuery = undefined
  }
}

function setupMediaQuery() {
  cleanupMediaQuery()

  if (direction === 'auto') {
    mediaQuery = globalThis.matchMedia(`(min-width: ${breakpoint})`)
    mediaQuery.addEventListener('change', onMediaChange)
    isVertical.value = !mediaQuery.matches
  }
  else {
    isVertical.value = direction === 'vertical'
  }
}

function onMediaChange(event: MediaQueryListEvent) {
  isVertical.value = !event.matches
}

onMounted(() => {
  setupMediaQuery()
})

onBeforeUnmount(() => {
  cleanupMediaQuery()
})

watch(
  () => [direction, breakpoint],
  () => setupMediaQuery(),
)

// --- Computed helpers ---
function getStepState(step: MazTimelineItem, index: number): MazTimelineStepState {
  if (step.state) {
    return step.state
  }
  if (modelValue === undefined) {
    return 'pending'
  }
  if (index < modelValue) {
    return 'completed'
  }
  if (index === modelValue) {
    return 'active'
  }
  return 'pending'
}

function isStepActive(step: MazTimelineItem, index: number): boolean {
  return getStepState(step, index) === 'active'
}

function isStepCompleted(step: MazTimelineItem, index: number): boolean {
  return getStepState(step, index) === 'completed'
}

function isConnectorCompleted(index: number): boolean {
  return isStepCompleted(steps[index]!, index)
}

function isConnectorActive(index: number): boolean {
  return isStepActive(steps[index]!, index)
}

const colorStyles = computed<CSSProperties>(() => ({
  '--m-timeline-color': `var(--maz-${color}-700)`,
  '--m-timeline-color-dark': `var(--maz-${color}-400)`,
  '--m-timeline-bg': `var(--maz-${color})`,
  '--m-timeline-fg': `var(--maz-${color}-foreground)`,
}))

const stateColorMap: Record<MazTimelineStepState, string> = {
  completed: 'success',
  active: '',
  error: 'destructive',
  warning: 'warning',
  pending: '',
}

function getStateStyle(state: MazTimelineStepState): CSSProperties | undefined {
  const mappedColor = stateColorMap[state]
  if (!mappedColor || state === 'active') {
    return undefined
  }
  return {
    '--m-timeline-state-color': `var(--maz-${mappedColor}-700)`,
    '--m-timeline-state-color-dark': `var(--maz-${mappedColor}-400)`,
    '--m-timeline-state-bg': `var(--maz-${mappedColor})`,
    '--m-timeline-state-fg': `var(--maz-${mappedColor}-foreground)`,
  }
}

function getStepAriaLabel(step: MazTimelineItem, index: number): string {
  const state = getStepState(step, index)
  const title = step.title ? `, ${step.title}` : ''
  return `Step ${index + 1}${title}: ${state}`
}

function getStepRole(step: MazTimelineItem): HTMLAttributes['role'] {
  return clickable && !step.disabled ? 'button' : undefined
}

function getStepTabindex(step: MazTimelineItem): number | undefined {
  return clickable && !step.disabled ? 0 : undefined
}

function onStepClick(step: MazTimelineItem, index: number) {
  if (!clickable || step.disabled) {
    return
  }
  emit('update:modelValue', index)
  emit('click-step', { step, index })
}

function onStepKeydown(event: KeyboardEvent, step: MazTimelineItem, index: number) {
  if (!clickable || step.disabled) {
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onStepClick(step, index)
    return
  }

  const isHorizontal = !isVertical.value
  const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'
  const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'

  let targetIndex: number | undefined

  if (event.key === nextKey) {
    targetIndex = findNextEnabledStep(index, 1)
  }
  else if (event.key === prevKey) {
    targetIndex = findNextEnabledStep(index, -1)
  }

  if (targetIndex !== undefined) {
    event.preventDefault()
    const stepElements = (event.currentTarget as HTMLElement)
      .closest('.m-timeline')
      ?.querySelectorAll<HTMLElement>('.m-timeline-step')
    stepElements?.[targetIndex]?.focus()
  }
}

function findNextEnabledStep(fromIndex: number, direction: 1 | -1): number | undefined {
  let index = fromIndex + direction
  while (index >= 0 && index < steps.length) {
    if (!steps[index]!.disabled) {
      return index
    }
    index += direction
  }
  return undefined
}

const hasCheckIcon = computed(() => autoValidateSteps)
</script>

<template>
  <div
    class="m-timeline m-reset-css"
    role="list"
    :aria-label="$attrs['aria-label'] as string ?? 'Timeline'"
    :style="colorStyles"
    :class="[
      `--${size}`,
      `--rounded-${roundedSize}`,
      {
        '--vertical': isVertical,
        '--horizontal': !isVertical,
        '--clickable': clickable,
        '--animated': animated,
      },
    ]"
  >
    <div
      v-for="(step, index) in steps"
      :key="`${instanceId}-step-${index}`"
      class="m-timeline-item"
      :class="{
        '--last': index === steps.length - 1,
      }"
    >
      <div
        class="m-timeline-step"
        :role="getStepRole(step) ?? 'listitem'"
        :aria-label="getStepAriaLabel(step, index)"
        :aria-current="isStepActive(step, index) ? 'step' : undefined"
        :aria-disabled="step.disabled || undefined"
        :tabindex="getStepTabindex(step)"
        :class="[
          `--${getStepState(step, index)}`,
          {
            '--disabled': step.disabled,
          },
        ]"
        :style="getStateStyle(getStepState(step, index))"
        v-on="clickable ? { click: () => onStepClick(step, index), keydown: (e: KeyboardEvent) => onStepKeydown(e, step, index) } : {}"
      >
        <div class="m-timeline-indicator" aria-hidden="true">
          <!--
            @slot indicator - Custom content for the step indicator circle
            @binding {MazTimelineItem} step - The step data
            @binding {number} index - The step index
            @binding {MazTimelineStepState} state - The resolved step state
            @binding {boolean} isActive - Whether the step is active
            @binding {boolean} isCompleted - Whether the step is completed
          -->
          <slot
            name="indicator"
            :step="step"
            :index="index"
            :state="getStepState(step, index)"
            :is-active="isStepActive(step, index)"
            :is-completed="isStepCompleted(step, index)"
          >
            <template v-if="hasCheckIcon && isStepCompleted(step, index)">
              <svg
                class="m-timeline-check-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </template>
            <template v-else-if="step.icon">
              <MazIcon
                v-if="typeof step.icon === 'string'"
                :name="step.icon"
                class="m-timeline-step-icon"
              />
              <MazIcon
                v-else
                :icon="step.icon"
                class="m-timeline-step-icon"
              />
            </template>
            <span v-else-if="showStepNumbers" class="m-timeline-step-number">
              {{ index + 1 }}
            </span>
          </slot>
        </div>

        <div v-if="step.title || step.subtitle || slots.title || slots.subtitle || slots.content" class="m-timeline-content">
          <!--
            @slot content - Full custom content area replacing title and subtitle
            @binding {MazTimelineItem} step - The step data
            @binding {number} index - The step index
            @binding {MazTimelineStepState} state - The resolved step state
            @binding {boolean} isActive - Whether the step is active
            @binding {boolean} isCompleted - Whether the step is completed
          -->
          <slot
            name="content"
            :step="step"
            :index="index"
            :state="getStepState(step, index)"
            :is-active="isStepActive(step, index)"
            :is-completed="isStepCompleted(step, index)"
          >
            <p v-if="step.title || slots.title" class="m-timeline-title">
              <!--
                @slot title - Custom title content
                @binding {MazTimelineItem} step - The step data
                @binding {number} index - The step index
                @binding {MazTimelineStepState} state - The resolved step state
              -->
              <slot name="title" :step="step" :index="index" :state="getStepState(step, index)">
                {{ step.title }}
              </slot>
            </p>
            <p v-if="step.subtitle || slots.subtitle" class="m-timeline-subtitle">
              <!--
                @slot subtitle - Custom subtitle content
                @binding {MazTimelineItem} step - The step data
                @binding {number} index - The step index
                @binding {MazTimelineStepState} state - The resolved step state
              -->
              <slot name="subtitle" :step="step" :index="index" :state="getStepState(step, index)">
                {{ step.subtitle }}
              </slot>
            </p>
          </slot>
        </div>
      </div>

      <div
        v-if="index < steps.length - 1"
        class="m-timeline-connector"
        :class="{
          '--completed': isConnectorCompleted(index),
          '--active': isConnectorActive(index),
        }"
        aria-hidden="true"
      >
        <!--
          @slot connector - Custom connector between steps
          @binding {number} index - The index of the step before this connector
          @binding {boolean} isCompleted - Whether the preceding step is completed
          @binding {boolean} isActive - Whether the preceding step is active
        -->
        <slot
          name="connector"
          :index="index"
          :is-completed="isConnectorCompleted(index)"
          :is-active="isConnectorActive(index)"
        >
          <div class="m-timeline-connector-track">
            <div class="m-timeline-connector-fill" />
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.m-timeline {
  @apply maz-flex maz-items-stretch;

  /* --- Horizontal layout --- */
  &.--horizontal {
    @apply maz-flex-row maz-items-start;

    .m-timeline-item {
      @apply maz-flex maz-flex-1 maz-items-start;

      &.--last {
        @apply maz-flex-none;
      }
    }

    .m-timeline-step {
      @apply maz-flex maz-flex-col maz-items-center maz-gap-2 maz-min-w-14;
    }

    .m-timeline-content {
      @apply maz-text-center;
    }

    .m-timeline-connector {
      @apply maz-flex maz-flex-1 maz-items-center maz-pt-[var(--m-timeline-indicator-half)];
    }

    .m-timeline-connector-track {
      @apply maz-h-0.5 maz-w-full;
    }

    .m-timeline-connector-fill {
      @apply maz-h-full maz-w-0;
    }

    .m-timeline-connector.--completed .m-timeline-connector-fill {
      @apply maz-w-full;
    }
  }

  /* --- Vertical layout --- */
  &.--vertical {
    @apply maz-flex-col;

    .m-timeline-item {
      @apply maz-flex maz-flex-col;
    }

    .m-timeline-step {
      @apply maz-flex maz-flex-row maz-items-center maz-gap-3;
    }

    .m-timeline-content {
      @apply maz-text-left;
    }

    .m-timeline-connector {
      @apply maz-flex maz-items-stretch maz-py-1 maz-pl-[var(--m-timeline-indicator-half)];
    }

    .m-timeline-connector-track {
      @apply maz-h-full maz-min-h-6 maz-w-0.5 maz-translate-x-px;
    }

    .m-timeline-connector-fill {
      @apply maz-h-0 maz-w-full;
    }

    .m-timeline-connector.--completed .m-timeline-connector-fill {
      @apply maz-h-full;
    }
  }

  /* --- Step indicator (base) --- */
  .m-timeline-indicator {
    @apply maz-flex maz-shrink-0 maz-items-center maz-justify-center;

    width: var(--m-timeline-indicator-size);
    height: var(--m-timeline-indicator-size);

    @apply maz-bg-[hsl(var(--maz-muted)/30%)] maz-text-[hsl(var(--maz-muted))];
  }

  /* --- Step states --- */
  .m-timeline-step {
    &.--active .m-timeline-indicator {
      @apply maz-bg-[hsl(var(--m-timeline-bg))] maz-text-[hsl(var(--m-timeline-fg))];
    }

    &.--completed .m-timeline-indicator {
      @apply maz-bg-[hsl(var(--m-timeline-state-bg,var(--m-timeline-bg)))] maz-text-[hsl(var(--m-timeline-state-fg,var(--m-timeline-fg)))];
    }

    &.--error .m-timeline-indicator {
      @apply maz-bg-[hsl(var(--m-timeline-state-bg))] maz-text-[hsl(var(--m-timeline-state-fg))];
    }

    &.--warning .m-timeline-indicator {
      @apply maz-bg-[hsl(var(--m-timeline-state-bg))] maz-text-[hsl(var(--m-timeline-state-fg))];
    }

    &.--disabled {
      @apply maz-opacity-40 maz-pointer-events-none;
    }
  }

  /* --- Connector --- */
  .m-timeline-connector-track {
    @apply maz-bg-[hsl(var(--maz-muted)/20%)];
  }

  .m-timeline-connector-fill {
    @apply maz-bg-[hsl(var(--m-timeline-bg))];
  }

  /* --- Content --- */
  .m-timeline-content {
    @apply maz-flex maz-flex-col maz-gap-0.5;
  }

  .m-timeline-title {
    @apply maz-m-0 maz-font-semibold maz-leading-tight maz-text-[hsl(var(--maz-foreground))];
  }

  .m-timeline-subtitle {
    @apply maz-m-0 maz-leading-snug maz-text-[hsl(var(--maz-muted))];
  }

  /* --- Step number --- */
  .m-timeline-step-number {
    @apply maz-font-bold maz-leading-none;

    font-size: var(--m-timeline-number-size);
  }

  /* --- Step icon --- */
  .m-timeline-step-icon {
    width: var(--m-timeline-icon-size);
    height: var(--m-timeline-icon-size);
  }

  /* --- Check icon --- */
  .m-timeline-check-icon {
    width: var(--m-timeline-icon-size);
    height: var(--m-timeline-icon-size);
  }

  /* --- Clickable --- */
  &.--clickable .m-timeline-step:not(.--disabled) {
    @apply maz-cursor-pointer;

    &:hover .m-timeline-indicator {
      @apply maz-ring-2 maz-ring-[hsl(var(--m-timeline-color)/30%)];
    }

    &:focus-visible .m-timeline-indicator {
      @apply maz-outline-none maz-ring-2 maz-ring-[hsl(var(--m-timeline-color))] maz-ring-offset-2;
    }
  }

  /* --- Animations --- */
  &.--animated {
    .m-timeline-indicator {
      @apply maz-transition-all maz-duration-300 maz-ease-in-out;
    }

    .m-timeline-connector-fill {
      @apply maz-transition-all maz-duration-500 maz-ease-in-out;
    }

    .m-timeline-step.--active .m-timeline-indicator {
      animation: m-timeline-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  }

  /* --- Sizes --- */
  &.--mini {
    --m-timeline-indicator-size: 1.25rem;
    --m-timeline-indicator-half: 0.625rem;
    --m-timeline-icon-size: 0.625rem;
    --m-timeline-font-size: 0.625rem;
    --m-timeline-number-size: 0.5rem;

    .m-timeline-title {
      @apply maz-text-[0.625rem];
    }

    .m-timeline-subtitle {
      @apply maz-text-[0.5rem];
    }
  }

  &.--xs {
    --m-timeline-indicator-size: 1.5rem;
    --m-timeline-indicator-half: 0.75rem;
    --m-timeline-icon-size: 0.75rem;
    --m-timeline-font-size: 0.75rem;
    --m-timeline-number-size: 0.625rem;

    .m-timeline-title {
      @apply maz-text-xs;
    }

    .m-timeline-subtitle {
      @apply maz-text-[0.625rem];
    }
  }

  &.--sm {
    --m-timeline-indicator-size: 1.75rem;
    --m-timeline-indicator-half: 0.875rem;
    --m-timeline-icon-size: 0.875rem;
    --m-timeline-font-size: 0.75rem;
    --m-timeline-number-size: 0.625rem;

    .m-timeline-title {
      @apply maz-text-xs;
    }

    .m-timeline-subtitle {
      @apply maz-text-[0.65rem];
    }
  }

  &.--md {
    --m-timeline-indicator-size: 2rem;
    --m-timeline-indicator-half: 1rem;
    --m-timeline-icon-size: 1rem;
    --m-timeline-font-size: 0.875rem;
    --m-timeline-number-size: 0.75rem;

    .m-timeline-title {
      @apply maz-text-sm;
    }

    .m-timeline-subtitle {
      @apply maz-text-xs;
    }
  }

  &.--lg {
    --m-timeline-indicator-size: 2.5rem;
    --m-timeline-indicator-half: 1.25rem;
    --m-timeline-icon-size: 1.25rem;
    --m-timeline-font-size: 1rem;
    --m-timeline-number-size: 0.875rem;

    .m-timeline-title {
      @apply maz-text-base;
    }

    .m-timeline-subtitle {
      @apply maz-text-sm;
    }
  }

  &.--xl {
    --m-timeline-indicator-size: 3rem;
    --m-timeline-indicator-half: 1.5rem;
    --m-timeline-icon-size: 1.5rem;
    --m-timeline-font-size: 1.125rem;
    --m-timeline-number-size: 1rem;

    .m-timeline-title {
      @apply maz-text-lg;
    }

    .m-timeline-subtitle {
      @apply maz-text-base;
    }
  }

  /* --- Rounded sizes --- */
  &.--rounded-none .m-timeline-indicator {
    @apply maz-rounded-none;
  }

  &.--rounded-sm .m-timeline-indicator {
    @apply maz-rounded-sm;
  }

  &.--rounded-md .m-timeline-indicator {
    @apply maz-rounded-md;
  }

  &.--rounded-base .m-timeline-indicator {
    @apply maz-rounded;
  }

  &.--rounded-lg .m-timeline-indicator {
    @apply maz-rounded-lg;
  }

  &.--rounded-xl .m-timeline-indicator {
    @apply maz-rounded-xl;
  }

  &.--rounded-2xl .m-timeline-indicator {
    @apply maz-rounded-2xl;
  }

  &.--rounded-3xl .m-timeline-indicator {
    @apply maz-rounded-3xl;
  }

  &.--rounded-full .m-timeline-indicator {
    @apply maz-rounded-full;
  }
}

/* --- Pulse animation --- */
@keyframes m-timeline-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 hsl(var(--m-timeline-bg) / 40%);
  }

  50% {
    box-shadow: 0 0 0 6px hsl(var(--m-timeline-bg) / 0%);
  }
}

/* --- Reduced motion --- */
@media (prefers-reduced-motion: reduce) {
  .m-timeline.--animated .m-timeline-indicator,
  .m-timeline.--animated .m-timeline-connector-fill {
    @apply !maz-transition-none;

    animation: none !important;
  }
}
</style>
