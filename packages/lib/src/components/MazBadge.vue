<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { MazColor } from './types'
import { computed } from 'vue'
import { getColor } from './types'

export type MazBadgeColor = MazColor | 'background'
export type MazBadgeRoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface MazBadgeProps {
  /**
   * Color of the badge
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'background'`
   * @default primary
   */
  color?: MazBadgeColor
  /**
   * Size of the badge
   * @default 0.8em
   */
  size?: string
  /**
   * Will not wrap the text
   * @default false
   */
  nowrap?: boolean
  /**
   * Will add a border to the badge
   * @default false
   */
  outlined?: boolean
  /**
   * Will add a pastel style to the badge
   * @default false
   */
  pastel?: boolean
  /**
   * Size radius of the component's border
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   * @default md
   */
  roundedSize?: MazBadgeRoundedSize
}

const {
  color = 'primary',
  size = '0.8em',
  nowrap = false,
  outlined = false,
  pastel = false,
  roundedSize = 'md',
} = defineProps<MazBadgeProps>()

const resolvedColor = computed(() => getColor(color))

const ROUNDED_CLASS = {
  none: '',
  sm: 'maz:rounded-xs',
  md: 'maz:rounded-md',
  lg: 'maz:rounded',
  xl: 'maz:rounded-xl',
  full: 'maz:rounded-full',
} as const

const badgeStyle = computed<CSSProperties>(() => {
  const c = resolvedColor.value
  const base: Record<string, string> = { fontSize: size }
  if (c === 'surface' || c === 'transparent')
    return base

  const pastelFg = c === 'contrast' ? 'contrast-foreground' : `${c}-700`
  const pastelShade = c === 'destructive' ? '200' : '50'

  return {
    ...base,
    '--m-badge-bg': `var(--maz-${c})`,
    '--m-badge-fg': `var(--maz-${c}-foreground)`,
    ...(pastel && {
      '--m-badge-pastel-bg': `var(--maz-${c}-${pastelShade})`,
      '--m-badge-pastel-fg': `var(--maz-${pastelFg})`,
    }),
  }
})
</script>

<template>
  <span
    class="m-badge m-reset-css maz:inline-flex maz:items-center maz:justify-center maz:border maz:border-transparent maz:align-top maz:font-semibold"
    :class="[
      `--${resolvedColor}`,
      `--rounded-${roundedSize}`,
      ROUNDED_CLASS[roundedSize],
      {
        '--outlined': outlined,
        '--pastel': pastel,
        '--nowrap': nowrap,
        'maz:whitespace-nowrap': nowrap,
      },
    ]"
    :style="badgeStyle"
  >
    <!-- @slot Badge content -->
    <slot />
  </span>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-badge {
  padding: 0.25em 0.5em;
  line-height: 1.4em;
  background-color: var(--m-badge-bg);
  color: var(--m-badge-fg);
  border-color: var(--m-badge-bg);

  &.--outlined {
    @apply maz:bg-transparent;

    color: var(--m-badge-bg);
    border-color: var(--m-badge-bg);
  }

  &.--pastel {
    background-color: var(--m-badge-pastel-bg);
    color: var(--m-badge-pastel-fg);
    border-color: var(--m-badge-pastel-bg);
  }

  &.--surface {
    @apply maz:bg-surface maz:text-foreground;

    border-color: var(--maz-surface);

    &.--outlined {
      @apply maz:bg-transparent maz:border-divider;
    }

    &.--pastel {
      @apply maz:bg-surface-600 maz:border-surface-600;
    }
  }

  &.--transparent {
    @apply maz:bg-transparent maz:border-transparent;
  }
}
</style>
