<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { MazColor, MazColorOrFree, MazFillVariant, MazNeutralColor, MazSize } from './types.ts'
import { MazXMark } from '@maz-ui/icons/raw/MazXMark'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, Text, useSlots } from 'vue'
import { useGlobalConfig, useInstanceFillVariant } from '../composables/useGlobalConfig.ts'
import { isFreeColor, resolveColorForeground } from '../utils/freeColor.ts'
import { ROUNDED_SIZE_CLASS } from './constants.ts'
import MazIcon from './MazIcon.vue'
import MazRollingText from './MazRollingText.vue'
import { getColor } from './types.ts'

export type MazBadgeColor = MazColor | MazNeutralColor
export type MazBadgeRoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type MazBadgeSize = MazSize

export interface MazBadgeProps {
  /**
   * Color of the badge: a theme color, or a free CSS color (`#e11d48`, `oklch(...)`, `var(--brand)`) for a category or a
   * tag (text, border and `pastel` are derived from it). `surface` and `container` are the neutral colors of the theme,
   * with the foreground text
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'neutral' | 'transparent' | 'surface' | 'container'`
   * @default primary
   */
  color?: MazColorOrFree<MazBadgeColor>
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
   * Fill style of the badge: `solid` the full color, `soft` a tinted background, `outline` a border, `ghost` no background nor border
   * @values `'solid' | 'soft' | 'outline' | 'ghost'`
   * @default 'solid'
   */
  variant?: MazFillVariant
  /**
   * Will add a border to the badge
   * @deprecated Use `variant="outline"` instead
   * @default false
   */
  outlined?: boolean
  /**
   * Will add a pastel style to the badge
   * @deprecated Use `variant="soft"` instead
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
  /**
   * A number as the content rolls when it changes (the digits are then rendered by `MazRollingText`)
   * @default false
   */
  animated?: boolean
}

const {
  color = 'primary',
  nowrap = true,
  outlined = false,
  pastel = false,
  removable = false,
  removeLabel,
  animated = false,
} = defineProps<MazBadgeProps>()

const emits = defineEmits<{
  /**
   * Emitted when the remove button is clicked (`removable` only)
   * @property {MouseEvent} event the click event
   */
  remove: [event: MouseEvent]
}>()

const { t } = useTranslations()

const slots = useSlots()
const NUMBER_PATTERN = /^-?\d+(?:\.\d+)?$/

function getRollingValue() {
  if (!animated)
    return undefined

  const nodes = slots.default?.()
  const node = nodes?.length === 1 ? nodes[0] : undefined
  const content = node?.type === Text && typeof node.children === 'string' ? node.children.trim() : undefined

  return content !== undefined && NUMBER_PATTERN.test(content) ? Number(content) : undefined
}

const { size, roundedSize, variant: configVariant } = useGlobalConfig<{ size: MazBadgeSize, roundedSize: MazBadgeRoundedSize, variant: MazFillVariant | undefined }>('MazBadge', { size: 'md', roundedSize: 'md', variant: undefined })
const variant = useInstanceFillVariant(configVariant)

// Removed in v6 (plans/ROADMAP.md): `outlined` and `pastel` are aliases of `variant`
const isOutlined = computed(() => variant.value ? variant.value === 'outline' : outlined)
const isPastel = computed(() => variant.value ? variant.value === 'soft' : pastel)
const isGhost = computed(() => variant.value === 'ghost')

const freeColor = computed(() => isFreeColor(color))

const resolvedColor = computed(() => freeColor.value
  ? 'free'
  : getColor(color as MazBadgeColor))

const ROUNDED_CLASS = ROUNDED_SIZE_CLASS

const SIZE_CLASS = {
  mini: 'maz:text-[0.625rem]',
  xs: 'maz:text-[0.6875rem]',
  sm: 'maz:text-xs',
  md: 'maz:text-sm',
  lg: 'maz:text-base',
  xl: 'maz:text-xl',
} as const satisfies Record<MazBadgeSize, string>

const badgeStyle = computed<CSSProperties | undefined>(() => {
  if (freeColor.value) {
    return {
      '--m-badge-bg': color,
      '--m-badge-fg': resolveColorForeground(color),
    }
  }

  const c = resolvedColor.value
  if (c === 'surface' || c === 'container' || c === 'transparent')
    return undefined

  return {
    '--m-badge-bg': c === 'contrast'
      ? 'var(--m-badge-contrast-bg)'
      : `var(--maz-${c})`,
    '--m-badge-fg': `var(--maz-${c}-foreground)`,
    ...(isPastel.value && c === 'contrast' && {
      '--m-badge-pastel-fg': `var(--maz-contrast)`,
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
        '--outlined': isOutlined,
        '--pastel': isPastel,
        '--ghost': isGhost,
        'maz:text-nowrap': nowrap,
        'maz:whitespace-nowrap': nowrap,
      },
    ]"
    :style="badgeStyle"
  >
    <MazRollingText v-if="getRollingValue() !== undefined" :value="getRollingValue()!" />
    <!-- @slot Badge content -->
    <slot v-else />

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

  &.--ghost {
    @apply maz:bg-transparent;

    color: var(--m-badge-bg);
    border-color: transparent;
  }

  /* Neutral colors: a pastel neutral color has no meaning, it keeps the solid rendering */

  /* A foreground tint and a divider border keep them visible on a page or a container of the same color */
  &.--surface {
    --m-badge-bg: color-mix(in srgb, var(--maz-foreground) 6%, var(--maz-surface));
  }

  &.--container {
    --m-badge-bg: color-mix(in srgb, var(--maz-foreground) 6%, var(--maz-container-bg, var(--maz-surface)));
  }

  /* Solid contrast: a full white pill is harsh on a dark background */
  &.--contrast {
    --m-badge-contrast-bg: var(--maz-contrast);

    @variant dark {
      --m-badge-contrast-bg: color-mix(in oklch, var(--maz-contrast) 78%, var(--maz-surface));
    }
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

  &.--surface,
  &.--surface.--pastel,
  &.--container,
  &.--container.--pastel {
    @apply maz:border-divider;
  }

  /* Neutral: the soft grey of the theme (inline --m-badge-bg and --m-badge-fg), solid for `pastel` too, a divider border keeps it visible on a grey page */
  &.--neutral {
    @apply maz:border-divider;

    &.--pastel {
      background-color: var(--m-badge-bg);
      color: var(--m-badge-fg);
    }

    &.--outlined {
      @apply maz:bg-transparent;

      color: var(--m-badge-fg);
    }
  }

  &.--surface.--ghost,
  &.--container.--ghost,
  &.--neutral.--ghost {
    @apply maz:bg-transparent maz:border-transparent;

    color: var(--m-badge-fg);
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
      opacity calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
      background-color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);

    &:hover {
      opacity: 1;
      background-color: color-mix(in srgb, currentcolor 20%, transparent);
    }

    &:focus-visible {
      opacity: 1;
      outline: var(--maz-focus-ring-width, 2px) solid currentcolor;
      outline-offset: 1px;
    }
  }
}
</style>
