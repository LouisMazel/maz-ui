<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { MazColor, MazNeutralColor, MazSize } from './types'
import { MazXMark } from '@maz-ui/icons/raw/MazXMark'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig'
import MazIcon from './MazIcon.vue'
import { getColor } from './types'

export type MazBadgeColor = MazColor | MazNeutralColor
export type MazBadgeRoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type MazBadgeSize = MazSize

export interface MazBadgeProps {
  /**
   * Color of the badge: `surface` and `container` are the neutral colors of the theme, with the foreground text
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'transparent' | 'surface' | 'container'`
   * @default primary
   */
  color?: MazBadgeColor
  /**
   * Size of the badge — drives font-size; padding, line-height and dimensions
   * scale relative to it via `em` units.
   * @values `'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
   * @default md
   */
  size?: MazBadgeSize
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
  /**
   * Will add a remove button at the end of the badge, which emits `remove`
   * @default false
   */
  removable?: boolean
  /**
   * Accessible label of the remove button (translated "Remove" by default)
   */
  removeLabel?: string
}

const {
  color = 'primary',
  nowrap = true,
  outlined = false,
  pastel = false,
  removable = false,
  removeLabel,
} = defineProps<MazBadgeProps>()

const emits = defineEmits<{
  /**
   * Emitted when the remove button is clicked (`removable` only)
   * @property {MouseEvent} event the click event
   */
  remove: [event: MouseEvent]
}>()

const { t } = useTranslations()

const { size, roundedSize } = useGlobalConfig<{ size: MazBadgeSize, roundedSize: MazBadgeRoundedSize }>('MazBadge', { size: 'md', roundedSize: 'md' })

const resolvedColor = computed(() => getColor(color))

const ROUNDED_CLASS = {
  none: '',
  sm: 'maz:rounded-xs',
  md: 'maz:rounded-md',
  lg: 'maz:rounded-lg',
  xl: 'maz:rounded-xl',
  full: 'maz:rounded-full',
} as const

const SIZE_CLASS = {
  mini: 'maz:text-[0.625rem]',
  xs: 'maz:text-[0.6875rem]',
  sm: 'maz:text-xs',
  md: 'maz:text-sm',
  lg: 'maz:text-base',
  xl: 'maz:text-xl',
} as const satisfies Record<MazBadgeSize, string>

const badgeStyle = computed<CSSProperties | undefined>(() => {
  const c = resolvedColor.value
  if (c === 'surface' || c === 'container' || c === 'transparent')
    return undefined

  return {
    '--m-badge-bg': `var(--maz-${c})`,
    '--m-badge-fg': `var(--maz-${c}-foreground)`,
    ...(pastel && c === 'contrast' && {
      '--m-badge-pastel-fg': `var(--maz-contrast-foreground)`,
    }),
  }
})
</script>

<template>
  <span
    class="m-badge m-reset-css maz:inline-flex maz:flex-center maz:border maz:border-transparent maz:text-center maz:align-top maz:font-semibold"
    :class="[
      `--${resolvedColor}`,
      `--${size}`,
      `--rounded-${roundedSize}`,
      ROUNDED_CLASS[roundedSize],
      SIZE_CLASS[size],
      {
        '--outlined': outlined,
        '--pastel': pastel,
        'maz:text-nowrap': nowrap,
        'maz:whitespace-nowrap': nowrap,
      },
    ]"
    :style="badgeStyle"
  >
    <!-- @slot Badge content -->
    <slot />

    <button
      v-if="removable"
      type="button"
      class="m-badge__remove maz:inline-flex maz:cursor-pointer maz:flex-center"
      :aria-label="removeLabel ?? t('aria.remove')"
      @click="emits('remove', $event)"
    >
      <MazIcon :icon="MazXMark" aria-hidden="true" />
    </button>
  </span>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-badge {
  /* Pastel variant derived from --m-badge-bg (color-mix for tint,
   * OKLCh offset for foreground — mirrors SCALE_OFFSETS step -700). */
  --m-badge-pastel-bg: color-mix(in srgb, var(--m-badge-bg) 20%, transparent);
  --m-badge-pastel-fg: oklch(from var(--m-badge-bg) clamp(0, calc(l - 0.1), 1) c h); /* ↔ scale -700 */

  /* On a dark background the tint is dark too: the text goes lighter to stay readable (↔ scale -300). */
  @variant dark {
    --m-badge-pastel-fg: oklch(from var(--m-badge-bg) clamp(0, calc(l + 0.15), 1) c h);
  }

  padding-block: 0.25em;
  padding-inline: 0.5em;
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
    border-color: transparent;
  }

  /* Neutral colors: a pastel neutral color has no meaning, it keeps the solid rendering */
  &.--surface {
    --m-badge-bg: var(--maz-surface);
  }

  &.--container {
    --m-badge-bg: var(--maz-container-bg, var(--maz-surface));
  }

  &.--surface,
  &.--container {
    --m-badge-fg: var(--maz-foreground);

    &.--pastel {
      background-color: var(--m-badge-bg);
      color: var(--m-badge-fg);
      border-color: var(--m-badge-bg);
    }

    &.--outlined {
      @apply maz:bg-transparent maz:border-divider;

      color: var(--m-badge-fg);
    }
  }

  &.--container,
  &.--container.--pastel {
    @apply maz:border-divider;
  }

  &.--transparent {
    @apply maz:bg-transparent maz:border-transparent;
  }

  & .m-badge__remove {
    margin-inline: 0.25em -0.25em;
    padding: 0.125em;
    border-radius: 9999px;
    color: inherit;
    background-color: transparent;
    opacity: 0.75;
    transition:
      opacity 150ms ease-in-out,
      background-color 150ms ease-in-out;

    &:hover {
      opacity: 1;
      background-color: color-mix(in srgb, currentcolor 20%, transparent);
    }

    &:focus-visible {
      opacity: 1;
      outline: 2px solid currentcolor;
      outline-offset: 1px;
    }
  }
}
</style>
