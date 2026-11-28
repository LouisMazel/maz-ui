<script lang="ts" setup>
import type { SVGAttributes } from 'vue'
import type { MazColorOrFree, MazSizeUnit } from './types.ts'
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { useIntersectionObserver } from '../composables/useIntersectionObserver.ts'
import { shiftColorLightness } from '../utils/freeColor.ts'

export interface MazCircularProgressBarProps {
  /**
   * The percentage value of the progress bar
   * @required
   */
  percentage: number
  /**
   * The size of the progress bar
   * @default '10em' (equal 80px for a font-size of 16px)
   */
  size?: MazSizeUnit
  /**
   * Duration of the animation in milliseconds
   * @default 1000
   */
  duration?: number
  /**
   * Delay before the animation starts in milliseconds
   * @default 100
   */
  delay?: number
  /**
   * The color of the progress bar: a theme color or a free CSS color (`#e11d48`, `oklch(...)`, `var(--brand)`)
   * @type Color
   * @default undefined
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'neutral'`
   */
  color?: MazColorOrFree
  /**
   * Auto color based on the count (destructive, warning, success)
   * @default false
   */
  autoColor?: boolean
  /**
   * Suffix to display next to the number
   */
  prefix?: string
  /**
   * Suffix to display next to the number
   */
  suffix?: string
  /**
   * The stroke-linecap style
   * @default 'round'
   * @values 'butt', 'round', 'square', 'inherit'
   */
  strokeLinecap?: SVGAttributes['stroke-linecap']
  /**
   * The stroke width
   * @default 6
   */
  strokeWidth?: SVGAttributes['width']
  /**
   * The stroke color
   * Use this prop to override the gradient color
   * You can use a color name or a color code
   */
  stroke?: SVGAttributes['stroke']
  /**
   * The percentage value of the success level
   * @description The progress circle will be filled with the success color when the percentage is greater than or equal to this value
   * @default 100
   */
  successPercentage?: number
  /**
   * The percentage value of the warning level
   * @description The progress circle will be filled with the warning color when the percentage is greater than or equal to this value
   * @default 50
   */
  warningPercentage?: number
  /**
   * The percentage value of the danger level
   * @description The progress circle will be filled with the danger color when the percentage is greater than or equal to this value
   * @default 25
   */
  dangerPercentage?: number
  /**
   * Play the animation only once
   * @default true
   */
  once?: boolean
  /**
   * The progress is unknown: an arc turns around the circle
   * @default false
   */
  indeterminate?: boolean
  /**
   * Draws a check in place of the number once the circle is full
   * @default false
   */
  check?: boolean
  /**
   * The digits roll when `percentage` changes, instead of counting up from zero
   * @default false
   */
  roll?: boolean
}

const {
  percentage,
  size = '10em',
  duration = 1000,
  delay = 100,
  color,
  autoColor = false,
  prefix,
  suffix,
  strokeLinecap = 'round',
  strokeWidth = 6,
  stroke,
  successPercentage = 100,
  warningPercentage = 75,
  dangerPercentage = 50,
  once = true,
  indeterminate = false,
  check = false,
  roll = false,
} = defineProps<MazCircularProgressBarProps>()

const MazAnimatedCounter = defineAsyncComponent(() => import('./MazAnimatedCounter.vue'))
const MazRollingText = defineAsyncComponent(() => import('./MazRollingText.vue'))
const MazDrawnIcon = defineAsyncComponent(() => import('./MazDrawnIcon.vue'))

const slots = useSlots()

const hasPrefix = computed(() => !!prefix || !!slots.prefix)
const hasSuffix = computed(() => !!suffix || !!slots.suffix)

const id = useInstanceUniqId({
  componentName: 'MazCircularProgressBar',
})
const adjustedPercentage = computed<number>(() => {
  if (percentage > 100)
    return 100
  if (percentage <= 0)
    return 0.5
  return percentage
})

const currentColor = computed<string | undefined>(() => {
  const resolved: MazColorOrFree | undefined = autoColor
    ? getStatusColor(adjustedPercentage.value)
    : color
  return resolved === 'neutral' ? 'neutral-foreground' : resolved
})

/* Gradient stops derived via OKLCh offsets (mirrors SCALE_OFFSETS: -400, -700). */
const gradientStart = computed(() =>
  currentColor.value
    ? shiftColorLightness(currentColor.value, 0.06)
    : `var(--maz-primary)`,
)
const gradientEnd = computed(() =>
  currentColor.value
    ? shiftColorLightness(currentColor.value, -0.1)
    : `var(--maz-secondary)`,
)
function getStatusColor(percent: number) {
  if (percent < dangerPercentage || percent > 100)
    return 'destructive'
  if (percent < warningPercentage)
    return 'warning'
  if (percent >= successPercentage)
    return 'success'

  return 'primary'
}

const isFull = computed(() => !indeterminate && percentage >= 100)
const completed = ref(false)
let completedTimer: ReturnType<typeof setTimeout> | undefined

function updateCompleted() {
  clearTimeout(completedTimer)

  if (!check || !isFull.value) {
    completed.value = false
    return
  }

  completedTimer = setTimeout(() => {
    completed.value = true
  }, delay + duration)
}

onMounted(updateCompleted)
watch([isFull, () => check], () => {
  if (completedTimer !== undefined || completed.value || isFull.value)
    updateCompleted()
})
onBeforeUnmount(() => clearTimeout(completedTimer))

const animationDuration = computed<string>(() => `${duration}ms`)
const dashoffset = computed<number>(() => {
  if (indeterminate)
    return 218

  return Math.round(290 - 290 * (adjustedPercentage.value / 100))
})

const isVisible = ref(false)
const circleRef = ref<HTMLElement | null>(null)
const hasBeenAnimated = ref(false)

useIntersectionObserver(circleRef, (entries) => {
  const isIntersecting = !!entries.at(-1)?.isIntersecting

  if (!isVisible.value || !once) {
    isVisible.value = isIntersecting
  }

  if (once && isIntersecting) {
    circleRef.value?.addEventListener('animationend', () => {
      hasBeenAnimated.value = true
    }, { once: true })
  }
}, { once })
</script>

<template>
  <div
    class="m-circular-progress-bar m-reset-css maz:relative maz:inline-flex maz:size-[1em] maz:flex-center"
    :role="indeterminate ? 'progressbar' : undefined"
    :aria-busy="indeterminate ? true : undefined"
    :style="[
      {
        '--animation-duration': animationDuration,
        '--dashoffset': dashoffset,
        '--delay': `${delay}ms`,
      },
      {
        fontSize: size,
      },
    ]"
  >
    <div class="outer maz:flex maz:size-full maz:flex-center maz:rounded-full">
      <div class="inner maz:flex maz:size-[0.85em] maz:flex-center maz:rounded-full">
        <MazDrawnIcon v-if="completed && !slots.default" name="check" size="1.4em" class="maz:text-success" />
        <span v-else-if="slots.default">
          <!-- @slot Default slot - Replace the percaentage value -->
          <slot />
        </span>
        <span v-else-if="roll">
          <slot name="prefix">{{ prefix }}</slot><MazRollingText :value="percentage" /><slot name="suffix">{{ suffix }}</slot>
        </span>
        <MazAnimatedCounter
          v-else-if="!indeterminate"
          :count="percentage"
          :duration
          :delay
          :once
        >
          <template v-if="hasPrefix" #prefix>
            <!-- @slot Prefix slot - Add a prefix next to the number (e.g: "$") -->
            <slot name="prefix">
              {{ prefix }}
            </slot>
          </template>
          <template v-if="hasSuffix" #suffix>
            <!-- @slot Suffix slot - Add a suffix next to the number (e.g: "%") -->
            <slot name="suffix">
              {{ suffix }}
            </slot>
          </template>
        </MazAnimatedCounter>
      </div>
    </div>
    <svg
      ref="circleRef"
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      width="1em"
      class="maz:absolute maz:-rotate-90"
      :class="{
        'animate': isVisible && !indeterminate,
        'm-circular-progress-bar__spin': indeterminate,
      }"
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient :id="`${id}-gradient`" x1="0" x2="0" y1="1" y2="0">
          <stop
            offset="0%"
            :stop-color="gradientStart"
          />
          <stop
            offset="100%"
            :stop-color="gradientEnd"
          />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="46"
        :stroke-width="strokeWidth"
        stroke-dasharray="290"
        :stroke-dashoffset="hasBeenAnimated || indeterminate ? dashoffset : 290"
        :stroke="stroke ? stroke : `url(#${id}-gradient)`"
        fill="none"
        :stroke-linecap="strokeLinecap"
      />
    </svg>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-circular-progress-bar {
  .inner :deep(> *) {
    @apply maz:text-[0.25em];
  }

  svg circle {
    will-change: stroke-dashoffset;
    animation: animate linear forwards var(--animation-duration);
    animation-delay: var(--delay);
  }
}

@keyframes animate {
  to {
    stroke-dashoffset: var(--dashoffset);
  }
}

.m-circular-progress-bar__spin {
  animation: m-circular-progress-bar-spin calc(var(--maz-motion-slower, 450ms) * 3 * var(--maz-motion-scale, 1)) linear
    infinite;
}

@keyframes m-circular-progress-bar-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
