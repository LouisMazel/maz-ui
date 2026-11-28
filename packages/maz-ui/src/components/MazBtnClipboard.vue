<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { MazColor, MazNeutralColor, MazRoundedSize, MazSize } from './types.ts'
import { MazExclamationCircle } from '@maz-ui/icons/raw/MazExclamationCircle'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, useSlots } from 'vue'
import { useClipboard } from '../composables/useClipboard.ts'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { ROUNDED_SIZE_CLASS } from './constants.ts'
import MazIcon from './MazIcon.vue'
import MazMorphIcon from './MazMorphIcon.vue'
import { getColor } from './types.ts'

export type MazBtnClipboardColor = Exclude<MazColor, 'transparent'> | MazNeutralColor
// Removed in v6 (plans/ROADMAP.md): `outlined` is an alias of `outline`
export type MazBtnClipboardVariant = 'soft' | 'solid' | 'outline' | 'outlined' | 'ghost'
export type MazBtnClipboardSize = MazSize
export type MazBtnClipboardRoundedSize = MazRoundedSize

export interface MazBtnClipboardProps {
  /** Text copied to the clipboard: an ID, a command, a token, a URL */
  value: string
  /**
   * Text displayed instead of the value: a shortened ID, a name (the `default` slot replaces it too)
   */
  label?: string
  /**
   * Prefix displayed before the text and not copied: `$` for a command, `#` for an ID
   */
  prompt?: string
  /**
   * Style of the button: `soft` a tinted background, `solid` the full color, `outline` a border, `ghost` no background until hovered
   * @values `'soft' | 'solid' | 'outline' | 'ghost'`
   * @default soft
   */
  variant?: MazBtnClipboardVariant
  /**
   * Color of the button: `container` and `surface` are the neutral colors of the theme
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'neutral' | 'surface' | 'container'`
   * @default container
   */
  color?: MazBtnClipboardColor
  /**
   * Size of the button: the padding and the icon follow the font size
   * @values `'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
   * @default md
   */
  size?: MazBtnClipboardSize
  /**
   * Radius of the button
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   * @default md
   */
  roundedSize?: MazBtnClipboardRoundedSize
  /**
   * Monospace font, for IDs and commands
   * @default true
   */
  mono?: boolean
  /**
   * Only the copy icon, without the text
   * @default false
   */
  iconOnly?: boolean
  /**
   * Cuts a long text with an ellipsis (set a `max-width` on the component)
   * @default false
   */
  truncate?: boolean
  /**
   * Takes the full width of its container, the icon at the end
   * @default false
   */
  block?: boolean
  /**
   * Time in milliseconds the copied state is displayed
   * @default 1500
   */
  copiedDuring?: number
  /**
   * Disables the button
   * @default false
   */
  disabled?: boolean
  /** Label of the button and its tooltip (translated "Copy" by default) */
  copyLabel?: string
  /** Label once copied (translated "Copied" by default) */
  copiedLabel?: string
  /**
   * Rolls the text to the copied label while copied. The width of the button is the one of the longest text: it never jumps
   * @default false
   */
  rollLabel?: boolean
}

const {
  value,
  label,
  prompt,
  variant = 'soft',
  color = 'container',
  mono = true,
  iconOnly = false,
  truncate = false,
  block = false,
  copiedDuring = 1500,
  disabled = false,
  copyLabel,
  copiedLabel,
  rollLabel = false,
} = defineProps<MazBtnClipboardProps>()

const emits = defineEmits<{
  /**
   * Emitted when the value is copied
   * @property {string} value the copied value
   */
  copy: [value: string]
  /**
   * Emitted when the copy fails (no Clipboard API, permission refused)
   * @property {unknown} error the error
   */
  error: [error: unknown]
}>()

defineSlots<{
  /** Text displayed instead of the value */
  default?: () => unknown
}>()

const { t } = useTranslations()

const MazRollingText = defineAsyncComponent(() => import('./MazRollingText.vue'))
const slots = useSlots()

const { size, roundedSize } = useGlobalConfig<{ size: MazBtnClipboardSize, roundedSize: MazBtnClipboardRoundedSize }>('MazBtnClipboard', { size: 'md', roundedSize: 'md' })

const { copy, copied, error } = useClipboard({ copiedDuring })

const resolvedColor = computed(() => getColor(color))
const resolvedCopyLabel = computed(() => copyLabel ?? t('btnClipboard.copy'))
const resolvedCopiedLabel = computed(() => copiedLabel ?? t('btnClipboard.copied'))
const state = computed(() => {
  if (copied.value)
    return 'copied'

  return error.value === undefined ? 'idle' : 'error'
})
const displayedText = computed(() => label ?? value)
const isRolling = computed(() => rollLabel && !slots.default)

const ROUNDED_CLASS = { ...ROUNDED_SIZE_CLASS, none: 'maz:rounded-none' }

const SIZE_CLASS = {
  mini: 'maz:text-[0.6875rem]',
  xs: 'maz:text-xs',
  sm: 'maz:text-[0.8125rem]',
  md: 'maz:text-sm',
  lg: 'maz:text-base',
  xl: 'maz:text-lg',
} as const satisfies Record<MazBtnClipboardSize, string>

const style = computed<CSSProperties | undefined>(() => {
  const current = resolvedColor.value

  if (current === 'surface' || current === 'container')
    return undefined

  return {
    '--m-btn-clipboard-color': `var(--maz-${current})`,
    '--m-btn-clipboard-color-fg': `var(--maz-${current}-foreground)`,
  }
})

async function onClick() {
  if (await copy(value))
    emits('copy', value)
  else
    emits('error', error.value)
}
</script>

<template>
  <button
    type="button"
    class="m-btn-clipboard m-reset-css maz:group maz:relative maz:inline-flex maz:max-w-full maz:cursor-pointer maz:items-center maz:border maz:align-middle maz:leading-tight maz:disabled:disabled-state"
    :class="[
      `--${variant === 'outline' ? 'outlined' : variant}`,
      `--${resolvedColor}`,
      `--${size}`,
      `--${state}`,
      ROUNDED_CLASS[roundedSize],
      SIZE_CLASS[size],
      {
        '--icon-only': iconOnly,
        '--block': block,
        'maz:font-mono': mono,
        'maz:flex maz:w-full': block,
      },
    ]"
    :style
    :disabled
    :title="copied ? resolvedCopiedLabel : resolvedCopyLabel"
    @click="onClick"
  >
    <span v-if="prompt && !iconOnly" class="m-btn-clipboard__prompt maz:shrink-0 maz:select-none" aria-hidden="true">{{ prompt }}</span>

    <span
      v-if="!iconOnly"
      class="m-btn-clipboard__text maz:min-w-0"
      :class="truncate ? 'maz:truncate' : 'maz:break-all'"
    >
      <!-- @slot Text displayed instead of the value -->
      <slot>
        <span v-if="isRolling" class="maz:inline-grid maz:justify-items-start">
          <span class="maz:invisible maz:col-start-1 maz:row-start-1" aria-hidden="true">{{ displayedText }}</span>
          <span class="maz:invisible maz:col-start-1 maz:row-start-1" aria-hidden="true">{{ resolvedCopiedLabel }}</span>
          <MazRollingText class="maz:col-start-1 maz:row-start-1" :value="copied ? resolvedCopiedLabel : displayedText" />
        </span>
        <template v-else>
          {{ displayedText }}
        </template>
      </slot>
    </span>

    <span class="m-btn-clipboard__icon maz:relative maz:inline-flex maz:shrink-0 maz:flex-center" aria-hidden="true">
      <MazIcon v-if="state === 'error'" :icon="MazExclamationCircle" />
      <MazMorphIcon v-else name="copy-check" :active="copied" />
    </span>

    <span class="maz:sr-only" role="status">{{ copied ? resolvedCopiedLabel : resolvedCopyLabel }}</span>
  </button>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-btn-clipboard {
  --m-btn-clipboard-color: var(--maz-contrast);
  --m-btn-clipboard-color-fg: var(--maz-contrast-foreground);
  --m-btn-clipboard-tint: color-mix(in srgb, var(--m-btn-clipboard-color) 12%, transparent);
  --m-btn-clipboard-tint-strong: color-mix(in srgb, var(--m-btn-clipboard-color) 20%, transparent);

  /* ↔ scale -700, at most 0.5 of lightness: the light colors (success, warning) stay readable on a light background */
  --m-btn-clipboard-tint-fg: oklch(from var(--m-btn-clipboard-color) clamp(0, min(calc(l - 0.1), 0.5), 1) c h);

  @variant dark {
    --m-btn-clipboard-tint-fg: oklch(
      from var(--m-btn-clipboard-color) clamp(0, calc(l + 0.15), 1) c h
    ); /* ↔ scale -300 */
  }

  gap: 0.5em;
  transition:
    background-color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    border-color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    scale calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-bounce, ease-out);
  padding-block: 0.4em;
  padding-inline: 0.7em;
  text-align: start;
  outline: var(--maz-focus-ring-width, 2px) solid transparent;
  outline-offset: var(--maz-focus-ring-offset, 2px);

  &:focus-visible {
    outline-color: var(--maz-focus-ring-color, var(--m-btn-clipboard-color));
  }

  &:not(:disabled):active {
    scale: 0.97;
    transition-duration: calc(var(--maz-motion-instant, 80ms) * var(--maz-motion-scale, 1));
  }

  &.--icon-only {
    padding: 0.45em;
  }

  &.--block {
    justify-content: space-between;
  }

  & .m-btn-clipboard__prompt {
    opacity: 0.55;
  }

  & .m-btn-clipboard__icon {
    font-size: 1.1em;
    opacity: 0.6;
    transition:
      opacity calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
      color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
  }

  &:not(:disabled):hover .m-btn-clipboard__icon,
  &:focus-visible .m-btn-clipboard__icon,
  &.--copied .m-btn-clipboard__icon,
  &.--error .m-btn-clipboard__icon {
    opacity: 1;
  }

  &.--icon-only .m-btn-clipboard__icon {
    opacity: 1;
  }

  &.--block .m-btn-clipboard__icon {
    margin-inline-start: auto;
  }

  &.--copied .m-btn-clipboard__icon {
    color: var(--maz-success);
  }

  &.--error .m-btn-clipboard__icon {
    color: var(--maz-destructive);
  }

  /* Soft: a tint of the color */
  &.--soft {
    background-color: var(--m-btn-clipboard-tint);
    border-color: transparent;
    color: var(--m-btn-clipboard-tint-fg);

    &:not(:disabled):hover {
      background-color: var(--m-btn-clipboard-tint-strong);
    }
  }

  /* Solid: the full color */
  &.--solid {
    background-color: var(--m-btn-clipboard-color);
    border-color: var(--m-btn-clipboard-color);
    color: var(--m-btn-clipboard-color-fg);

    &:not(:disabled):hover {
      background-color: oklch(from var(--m-btn-clipboard-color) clamp(0, calc(l - 0.05), 1) c h); /* ↔ scale -600 */
    }

    &.--copied .m-btn-clipboard__icon,
    &.--error .m-btn-clipboard__icon {
      color: inherit;
    }
  }

  /* Outlined: a border of the color */
  &.--outlined {
    background-color: transparent;
    border-color: color-mix(in srgb, var(--m-btn-clipboard-color) 45%, transparent);
    color: var(--m-btn-clipboard-tint-fg);

    &:not(:disabled):hover {
      background-color: var(--m-btn-clipboard-tint);
      border-color: var(--m-btn-clipboard-color);
    }
  }

  /* Ghost: no background until hovered */
  &.--ghost {
    background-color: transparent;
    border-color: transparent;
    color: var(--m-btn-clipboard-tint-fg);

    &:not(:disabled):hover {
      background-color: var(--m-btn-clipboard-tint);
    }
  }

  /* Neutral colors: the foreground text and a foreground tint on hover */
  &.--surface,
  &.--container {
    --m-btn-clipboard-tint: color-mix(in oklab, var(--maz-foreground) 6%, transparent);
    --m-btn-clipboard-tint-strong: color-mix(in oklab, var(--maz-foreground) 10%, transparent);

    color: var(--maz-foreground);

    &:focus-visible {
      outline-color: var(--maz-primary);
    }

    &.--soft {
      color: var(--maz-foreground);
    }

    /* Solid neutral: inverted, like a terminal */
    &.--solid {
      background-color: var(--maz-foreground);
      border-color: var(--maz-foreground);
      color: var(--m-btn-clipboard-bg);
    }

    &.--solid:not(:disabled):hover {
      background-color: color-mix(in oklab, var(--maz-foreground) 85%, var(--m-btn-clipboard-bg));
    }

    &.--outlined {
      @apply maz:border-divider;

      color: var(--maz-foreground);

      &:not(:disabled):hover {
        @apply maz:border-divider;

        background-color: var(--m-btn-clipboard-tint);
      }
    }

    &.--ghost {
      color: var(--maz-foreground);
    }

    &.--solid .m-btn-clipboard__icon {
      color: inherit;
    }

    &.--copied .m-btn-clipboard__icon {
      color: var(--maz-success);
    }

    &.--error .m-btn-clipboard__icon {
      color: var(--maz-destructive);
    }

    /* Inverted background: the check keeps the text color, a green one is unreadable on the light background of the dark mode */
    &.--solid.--copied .m-btn-clipboard__icon,
    &.--solid.--error .m-btn-clipboard__icon {
      color: inherit;
    }
  }

  /* Neutral: the soft grey of the theme, `soft` and `solid` share it, the foreground is the accent (a light grey would disappear) */
  &.--neutral {
    --m-btn-clipboard-tint: color-mix(in oklab, var(--maz-neutral-foreground) 8%, transparent);
    --m-btn-clipboard-tint-strong: color-mix(in oklab, var(--maz-neutral-foreground) 14%, transparent);
    --m-btn-clipboard-tint-fg: var(--maz-neutral-foreground);

    &:focus-visible {
      outline-color: var(--maz-neutral-foreground);
    }

    &.--soft,
    &.--solid {
      background-color: var(--maz-neutral);
      color: var(--maz-neutral-foreground);

      @apply maz:border-divider;

      &:not(:disabled):hover {
        background-color: color-mix(in oklab, var(--maz-neutral-foreground) 10%, var(--maz-neutral));
      }
    }

    &.--outlined {
      color: var(--maz-neutral-foreground);

      @apply maz:border-divider;

      &:not(:disabled):hover {
        @apply maz:border-divider;

        background-color: var(--m-btn-clipboard-tint);
      }
    }

    &.--ghost {
      color: var(--maz-neutral-foreground);
    }

    &.--copied .m-btn-clipboard__icon {
      color: var(--maz-success);
    }

    &.--error .m-btn-clipboard__icon {
      color: var(--maz-destructive);
    }
  }

  &.--surface {
    --m-btn-clipboard-bg: var(--maz-surface);
  }

  &.--container {
    --m-btn-clipboard-bg: var(--maz-container-bg, var(--maz-surface));
  }
}
</style>
