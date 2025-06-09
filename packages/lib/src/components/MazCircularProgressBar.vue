<script lang="ts" setup>
import type { SVGAttributes } from 'vue'
import type { MazColor } from './types'
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'

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
  size?: string
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
   * The color of the progress bar
   * @type Color
   * @default undefined
   */
  color?: MazColor
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
} = defineProps<MazCircularProgressBarProps>()

const MazAnimatedCounter = defineAsyncComponent(() => import('./MazAnimatedCounter.vue'))

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

const currentColor = computed<MazColor | undefined>(() =>
  autoColor ? getStatusColor(adjustedPercentage.value) : color,
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

const animationDuration = computed<string>(() => `${duration}ms`)
const dashoffset = computed<number>(() => {
  return Math.round(290 - 290 * (adjustedPercentage.value / 100))
})

const isVisible = ref(false)
const circleRef = ref<HTMLElement | null>(null)
const hasBeenAnimated = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (!isVisible.value || !once) {
      isVisible.value = entry.isIntersecting
    }

    if (once && circleRef.value) {
      observer?.unobserve(circleRef.value)

      circleRef.value?.addEventListener('animationend', () => {
        hasBeenAnimated.value = true
      })
    }
  })

  if (circleRef.value) {
    observer.observe(circleRef.value)
  }
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    class="m-circular-progress-bar m-reset-css"
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
    <div class="outer">
      <div class="inner">
        <span v-if="slots.default">
          <!-- @slot Default slot - Replace the percaentage value -->
          <slot />
        </span>
        <MazAnimatedCounter
          v-else
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
      :class="{
        animate: isVisible,
      }"
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient :id="`${id}-gradient`" x1="0" x2="0" y1="1" y2="0">
          <stop
            offset="0%"
            :stop-color="
              currentColor ? `hsl(var(--maz-${currentColor}-400))` : `hsl(var(--maz-primary))`
            "
          />
          <stop
            offset="100%"
            :stop-color="
              currentColor ? `hsl(var(--maz-${currentColor}-700))` : `hsl(var(--maz-secondary))`
            "
          />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="46"
        :stroke-width="strokeWidth"
        stroke-dasharray="290"
        :stroke-dashoffset="hasBeenAnimated ? dashoffset : 290"
        :stroke="stroke ? stroke : `url(#${id}-gradient)`"
        fill="none"
        :stroke-linecap="strokeLinecap"
      />
    </svg>
  </div>
</template>

<style lang="postcss" scoped>
.m-circular-progress-bar {
  @apply maz-relative maz-inline-flex maz-h-[1em] maz-w-[1em] maz-flex-center;

  .outer {
    @apply maz-flex maz-h-full maz-w-full maz-rounded-full maz-flex-center;
  }

  .inner {
    @apply maz-flex maz-h-[0.85em] maz-w-[0.85em] maz-rounded-full maz-flex-center;

    :deep(> *) {
      @apply maz-text-[0.25em];
    }
  }

  svg {
    @apply maz-absolute -maz-rotate-90;

    circle {
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
}
</style>
