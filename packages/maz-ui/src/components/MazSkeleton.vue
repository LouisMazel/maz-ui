<script setup lang="ts">
import type { MazRoundedSize, MazSizeUnit } from './types.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { readMotionDuration } from '../utils/motionTokens.ts'
import { ROUNDED_SIZE_CLASS } from './constants.ts'

export interface MazSkeletonProps {
  /**
   * Skeleton shape type
   * @values circle, rectangle, square
   * @type {'circle' | 'rectangle' | 'square'}
   * @default 'rectangle'
   */
  shape?: 'circle' | 'rectangle' | 'square'
  /**
   * Size with units (ex: '2rem', '40px', '3em')
   * @default '1rem'
   */
  size?: MazSizeUnit
  /**
   * Custom width
   */
  width?: MazSizeUnit
  /**
   * Custom height
   */
  height?: MazSizeUnit
  /**
   * Disable animation
   * @default true
   */
  animated?: boolean
  /**
   * Controls the border radius
   * @values none, sm, md, lg, xl, full
   * @type {'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'}
   * @default 'md'
   */
  roundedSize?: MazRoundedSize
  /**
   * Accessibility label
   * @default 'skeleton.ariaLabel' (translations)
   */
  ariaLabel?: string
  /**
   * Loading text for accessibility
   * @default 'skeleton.loadingText' (translations)
   */
  loadingText?: string
  /**
   * With a default slot: the content is hidden under the skeleton until `loaded` is `true`, then a soft edge sweeps and reveals it
   * @default false
   */
  loaded?: boolean
}

const {
  shape = 'rectangle',
  size = '1rem',
  animated = true,
  ariaLabel,
  loadingText,
  width,
  height,
  loaded = false,
} = defineProps<MazSkeletonProps>()

const SHIMMER_DURATION = 5000

const slots = useSlots()
const { shouldReduceMotion } = useReducedMotion()
const hasContent = computed(() => !!slots.default)

const shimmerDelay = ref<string>()
const revealed = ref(loaded)
const revealing = ref(false)
let revealTimer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  const now = typeof document.timeline?.currentTime === 'number' ? document.timeline.currentTime : performance.now()
  shimmerDelay.value = `-${Math.round(now % SHIMMER_DURATION)}ms`
})

watch(() => loaded, (value) => {
  clearTimeout(revealTimer)

  if (!value) {
    revealed.value = false
    revealing.value = false
    return
  }

  if (!animated || shouldReduceMotion.value) {
    revealed.value = true
    return
  }

  revealing.value = true
  revealTimer = setTimeout(() => {
    revealed.value = true
  }, readMotionDuration('--maz-motion-slower', 450))
})

onBeforeUnmount(() => clearTimeout(revealTimer))

const { roundedSize } = useGlobalConfig<{ roundedSize: MazRoundedSize }>('MazSkeleton', { roundedSize: 'md' })

const { t } = useTranslations()

const ROUNDED_CLASS = ROUNDED_SIZE_CLASS

const ariaLabelValue = computed(() => ariaLabel || t('skeleton.ariaLabel'))
const loadingTextValue = computed(() => loadingText || t('skeleton.loadingText'))

const customStyles = computed(() => {
  const styles: Record<string, string> = {}

  if (shape) {
    switch (shape) {
      case 'circle':
      case 'square':
        styles.width = size ?? width
        styles.height = size ?? height
        break

      case 'rectangle':
        styles.height = height ?? size
        styles.width = width ?? '100%'
        break
    }
  }

  return styles
})

const boneClass = computed(() => [
  shape && `m-skeleton--${shape}`,
  `m-skeleton--rounded-${roundedSize.value}`,
  shape === 'circle' ? 'maz:rounded-full' : ROUNDED_CLASS[roundedSize.value],
  { 'm-skeleton--animated': animated },
])

const boneStyle = computed(() => shimmerDelay.value && animated
  ? { ...customStyles.value, animationDelay: shimmerDelay.value }
  : customStyles.value)

const revealStyle = computed(() => ({
  width: customStyles.value.width,
  minHeight: customStyles.value.height,
}))
</script>

<template>
  <div
    v-if="hasContent"
    class="m-skeleton-reveal m-reset-css maz:relative"
    :style="revealStyle"
    :aria-busy="!loaded"
  >
    <div class="m-skeleton-reveal__content" :class="{ 'maz:invisible': !loaded }" :inert="!loaded">
      <!-- @slot Content revealed when `loaded` is `true` -->
      <slot />
    </div>
    <div
      v-if="!revealed"
      class="m-skeleton m-skeleton--cover maz:absolute maz:inset-0 maz:overflow-hidden maz:bg-linear-to-r maz:from-surface-800/40 maz:via-surface-700/30 maz:to-surface-800/40 maz:dark:from-foreground/12 maz:dark:via-foreground/6 maz:dark:to-foreground/12"
      :class="[boneClass, { 'm-skeleton--revealing': revealing }]"
      :style="shimmerDelay && animated ? { animationDelay: shimmerDelay } : undefined"
      :aria-label="ariaLabelValue"
      role="status"
      aria-live="polite"
    >
      <span class="maz:sr-only">{{ loadingTextValue }}</span>
    </div>
  </div>
  <div
    v-else
    class="m-skeleton m-reset-css maz:relative maz:overflow-hidden maz:bg-linear-to-r maz:from-surface-800/40 maz:via-surface-700/30 maz:to-surface-800/40 maz:dark:from-foreground/12 maz:dark:via-foreground/6 maz:dark:to-foreground/12"
    :class="boneClass"
    :style="boneStyle"
    :aria-label="ariaLabelValue"
    role="status"
    aria-live="polite"
  >
    <span class="maz:sr-only">{{ loadingTextValue }}</span>
  </div>
</template>

<style scoped>
.m-skeleton {
  background-size: 400% 100%;
}

.m-skeleton--animated {
  animation: m-skeleton-shimmer 5s linear infinite;
}

.m-skeleton--cover {
  --m-skeleton-dir: 1;

  mask-image: linear-gradient(to right, transparent, #000 2rem);
  transition: transform calc(var(--maz-motion-slower, 450ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-in-out, ease-in-out);
}

[dir='rtl'] .m-skeleton--cover {
  --m-skeleton-dir: -1;

  mask-image: linear-gradient(to left, transparent, #000 2rem);
}

.m-skeleton--cover.m-skeleton--revealing {
  transform: translateX(calc(var(--m-skeleton-dir) * 100%));
}

@keyframes m-skeleton-shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}
</style>
