<script setup lang="ts">
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed } from 'vue'

type SizeUnit = `${number}rem` | `${number}px` | `${number}em` | `${number}vh` | `${number}vw` | `${number}%`

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
  size?: SizeUnit
  /**
   * Custom width
   */
  width?: SizeUnit
  /**
   * Custom height
   */
  height?: SizeUnit
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
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
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
}

const {
  shape = 'rectangle',
  size = '1rem',
  animated = true,
  roundedSize = 'md',
  ariaLabel,
  loadingText,
  width,
  height,
} = defineProps<MazSkeletonProps>()

const { t } = useTranslations()

const ROUNDED_CLASS = {
  none: '',
  sm: 'maz:rounded-xs',
  md: 'maz:rounded-md',
  lg: 'maz:rounded-lg',
  xl: 'maz:rounded-xl',
  full: 'maz:rounded-full',
} as const

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
</script>

<template>
  <div
    class="m-skeleton m-reset-css maz:relative maz:overflow-hidden maz:bg-linear-to-r maz:from-surface-800/40 maz:via-surface-700/30 maz:to-surface-800/40 maz:dark:from-surface-700/30 maz:dark:via-surface-600/20 maz:dark:to-surface-700/30"
    :class="[
      shape && `m-skeleton--${shape}`,
      `m-skeleton--rounded-${roundedSize}`,
      shape === 'circle' ? 'maz:rounded-full' : ROUNDED_CLASS[roundedSize],
      { 'm-skeleton--animated': animated },
    ]"
    :style="customStyles"
    :aria-label="ariaLabelValue"
    role="status"
    aria-live="polite"
  >
    <span class="maz:sr-only">{{ loadingTextValue }}</span>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-skeleton {
  background-size: 400% 100%;

  &--animated {
    animation: m-skeleton-shimmer 5s linear infinite;
  }
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
