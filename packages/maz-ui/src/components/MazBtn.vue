<script lang="ts" setup generic="_T">
import type { CSSProperties } from 'vue'
import type { MazIconLike } from '../composables/useMazIconProps.ts'
import type { MazColor, MazFillVariant, MazNeutralColor, MazRoundedSize, MazSize } from './types.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, onBeforeUnmount, ref, useAttrs, useId } from 'vue'
import { useGlobalConfig, useInstanceFillVariant } from '../composables/useGlobalConfig.ts'
import { useMazIconProps } from '../composables/useMazIconProps.ts'
import { useExternalLinks } from '../utils/externalLinks.ts'
import { hasSlotContent } from '../utils/hasSlotContent.ts'
import { resolveLinkComponent } from '../utils/resolveLinkComponent.ts'
import { ROUNDED_SIZE_CLASS } from './constants.ts'
import { getColor } from './types.ts'

export interface MazBtnProps {
  /**
   * The text of the button, if not provided, the slot will be used
   * @default undefined
   */
  text?: string
  /**
   * Predifined sizes of the button
   * @values `'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'mini'`
   */
  size?: MazSize
  /**
   * The color of the button: `surface` and `container` are the neutral colors of the theme (`container` is white in the light mode of most presets), with the foreground text. `neutral` is the grey push button of the native presets (`colors.neutral` of the preset), the `container` background without it
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'transparent' | 'surface' | 'container' | 'neutral'`
   */
  color?: MazColor | MazNeutralColor
  /**
   * The text color of the button
   * @values `primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'neutral' | 'transparent' | 'muted'`
   */
  textColor?: MazColor | 'muted'
  /**
   * The type of the button
   * @values `'submit' | 'reset' | 'button'`
   */
  type?: 'submit' | 'reset' | 'button'
  /**
   * Size of the rounded
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   * @default 'md'
   */
  roundedSize?: MazRoundedSize
  /**
   * Fill style of the button: `solid` the full color, `soft` a tinted background, `outline` a border, `ghost` no background until hovered
   * @values `'solid' | 'soft' | 'outline' | 'ghost'`
   * @default 'solid'
   */
  variant?: MazFillVariant
  /**
   * If true, the button have the "border" style
   * @deprecated Use `variant="outline"` instead
   * @default false
   */
  outlined?: boolean
  /**
   * If true, the button will have a pastel color
   * @deprecated Use `variant="soft"` instead
   * @default false
   */
  pastel?: boolean
  /**
   * If true, the button will have a full width
   * @default false
   */
  block?: boolean
  /**
   * Enable the button loader
   * @default false
   */
  loading?: boolean
  /**
   * Where the loader is displayed: `overlay` covers the button (the label is hidden), `start` replaces the start icon and keeps the label
   * @values `'overlay' | 'start'`
   * @default 'overlay'
   */
  loadingPosition?: 'overlay' | 'start'
  /**
   * Disable the button
   * @default false
   */
  disabled?: boolean
  /**
   * If true, the button will have a fab style
   * @default false
   */
  fab?: boolean
  /**
   * The icon to display in the fab variant. Accepts a bare value (Vue
   * component, raw SVG string, URL or `data:` URI) for the common case,
   * or a full `MazIconProps` object for fine-grained control (size, title,
   * svgAttributes, fallback, flipIconForRtl, …).
   */
  icon?: MazIconLike
  /**
   * The icon to display on the inline-start edge (left in LTR, right in RTL).
   * Accepts a bare value or a full `MazIconProps` object.
   */
  startIcon?: MazIconLike
  /**
   * The icon to display on the inline-end edge (right in LTR, left in RTL).
   * Accepts a bare value or a full `MazIconProps` object.
   */
  endIcon?: MazIconLike
  /**
   * Apply the padding of the button, set it to `false` to remove it
   * @default true
   */
  padding?: boolean
  /**
   * Choose how the elements are aligned in the button
   */
  justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  /**
   * If true, the button will have an active state
   * @default false
   */
  active?: boolean
  /**
   * If true, the button will have an overflow-hidden style
   * @default false
   */
  overflowHidden?: boolean
  /**
   * Success state, after `loading`: a check draws itself (in the loader, or in place of the start loader) and, with `successText`, the label rolls to it
   * @default false
   */
  success?: boolean
  /**
   * Label displayed while `success` is true, the label rolls from `text` to it. The width of the button is the one of the longest label: it never jumps
   */
  successText?: string
  /**
   * Hold to confirm: the button fills while it is pressed (pointer, Space or Enter) and emits `hold-confirm` once the `holdDuration` is reached. Released earlier, the fill drains and nothing happens
   * @default false
   */
  hold?: boolean
  /**
   * Time to hold the button to confirm, in milliseconds (`hold` only)
   * @default 1000
   */
  holdDuration?: number
}

const {
  color = 'primary',
  type = 'button',
  fab,
  icon,
  startIcon,
  endIcon,
  justify = 'center',
  pastel,
  outlined,
  loading,
  loadingPosition = 'overlay',
  disabled,
  block,
  padding = true,
  active,
  overflowHidden = true,
  success,
  successText,
  hold,
  holdDuration = 1000,
  text,
} = defineProps<MazBtnProps>()

const emit = defineEmits<{
  /**
   * Emitted once the button has been held for `holdDuration` (`hold` only)
   */
  'hold-confirm': []
}>()

const { size, roundedSize, variant: configVariant } = useGlobalConfig<{ size: MazSize, roundedSize: MazRoundedSize, variant: MazFillVariant | undefined }>('MazBtn', {
  size: 'md',
  roundedSize: 'md',
  variant: undefined,
})
const variant = useInstanceFillVariant(configVariant)

// Removed in v6 (plans/ROADMAP.md): `outlined` and `pastel` are aliases of `variant`
const isOutlined = computed(() => variant.value ? variant.value === 'outline' : outlined)
const isPastel = computed(() => variant.value ? variant.value === 'soft' : pastel)
const isGhost = computed(() => variant.value === 'ghost')

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))
const MazDrawnIcon = defineAsyncComponent(() => import('./MazDrawnIcon.vue'))
const MazRollingText = defineAsyncComponent(() => import('./MazRollingText.vue'))

const attrs = useAttrs()
const { href, to } = attrs
const { onLinkClick } = useExternalLinks()

const component = computed(() => {
  if (href)
    return 'a'
  else if (to)
    return resolveLinkComponent()
  return 'button'
})

function onClick(event: MouseEvent) {
  if (hold) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }

  if (component.value === 'a')
    onLinkClick(event, href as string | undefined, attrs.target as string | undefined)
}

const isStartLoader = computed(() => !!loading && loadingPosition === 'start')
const isOverlayLoader = computed(() => !!loading && loadingPosition !== 'start')
const isStartSuccess = computed(() => !!success && !loading && loadingPosition === 'start')
const isOverlaySuccess = computed(() => !!success && !loading && loadingPosition !== 'start')
const hasStartStatus = computed(() => isStartLoader.value || isStartSuccess.value)
const isRollingLabel = computed(() => successText !== undefined && text !== undefined)

const { t } = useTranslations()
const holdId = useId()
const holding = ref(false)
let holdTimer: ReturnType<typeof setTimeout> | undefined

function startHold() {
  if (loading || disabled || holding.value)
    return

  holding.value = true
  holdTimer = setTimeout(() => {
    holdTimer = undefined
    holding.value = false
    emit('hold-confirm')
  }, holdDuration)
}

function cancelHold() {
  clearTimeout(holdTimer)
  holdTimer = undefined
  holding.value = false
}

function isActivationKey(event: KeyboardEvent) {
  return event.key === ' ' || event.key === 'Enter'
}

const holdListeners = {
  pointerdown: (event: PointerEvent) => {
    if (event.button === 0)
      startHold()
  },
  pointerup: cancelHold,
  pointerleave: cancelHold,
  pointercancel: cancelHold,
  blur: cancelHold,
  keydown: (event: KeyboardEvent) => {
    if (!isActivationKey(event))
      return

    event.preventDefault()

    if (!event.repeat)
      startHold()
  },
  keyup: (event: KeyboardEvent) => {
    if (isActivationKey(event)) {
      event.preventDefault()
      cancelHold()
    }
  },
}

onBeforeUnmount(cancelHold)

const resolvedColor = computed(() => getColor(color))

const isDisabled = computed(
  () => (loading || disabled) && component.value === 'button',
)
const btnType = computed(() => (component.value === 'button'
  ? type
  : undefined))

type IconSize = NonNullable<import('./MazIcon.vue').MazIconProps['size']>

const iconSize = computed<IconSize>(() => {
  const iconSizeMap: Record<NonNullable<MazBtnProps['size']>, IconSize> = {
    xl: 'lg',
    lg: 'md',
    md: 'md',
    sm: 'sm',
    xs: 'xs',
    mini: '1em',
  }

  return iconSizeMap[size.value] || 'lg'
})

const { iconProps: startIconProps } = useMazIconProps(() => startIcon, () => ({ size: iconSize.value }))
const { iconProps: endIconProps } = useMazIconProps(() => endIcon, () => ({ size: iconSize.value }))
const { iconProps: fabIconProps } = useMazIconProps(() => icon, () => ({ size: iconSize.value }))

const btnStyle = computed<CSSProperties>(() => {
  const c = resolvedColor.value
  const base: Record<string, string> = { '--m-btn-justify': justify }
  if (c === 'transparent' || c === 'surface' || c === 'container' || c === 'neutral')
    return base

  return {
    ...base,
    '--m-btn-bg': `var(--maz-${c})`,
    '--m-btn-fg': `var(--maz-${c}-foreground)`,
    ...(isPastel.value && c === 'contrast' && {
      '--m-btn-pastel-fg': `var(--maz-contrast)`,
    }),
  }
})

const TEXT_COLOR: Record<NonNullable<MazBtnProps['textColor']>, string> = {
  primary: 'maz:text-primary',
  secondary: 'maz:text-secondary',
  accent: 'maz:text-accent',
  info: 'maz:text-info',
  success: 'maz:text-success',
  warning: 'maz:text-warning',
  destructive: 'maz:text-destructive',
  contrast: 'maz:text-contrast',
  neutral: 'maz:text-neutral-foreground',
  transparent: 'maz:text-transparent',
  muted: 'maz:text-muted',
} as const

const SIZE_CLASS: Record<NonNullable<MazBtnProps['size']>, string> = {
  xl: 'maz:min-h-[var(--maz-control-height-xl,4rem)] maz:px-[var(--maz-control-padding-x-xl,2rem)] maz:text-xl',
  lg: 'maz:min-h-[var(--maz-control-height-lg,3.5rem)] maz:px-[var(--maz-control-padding-x-lg,1.5rem)]',
  md: 'maz:min-h-[var(--maz-control-height-md,3rem)] maz:px-[var(--maz-control-padding-x-md,1rem)]',
  sm: 'maz:min-h-[var(--maz-control-height-sm,2.5rem)] maz:px-[var(--maz-control-padding-x-sm,0.75rem)]',
  xs: 'maz:min-h-[var(--maz-control-height-xs,2rem)] maz:px-[var(--maz-control-padding-x-xs,0.5rem)] maz:text-sm',
  mini: 'maz:min-h-[var(--maz-control-height-mini,1.5rem)] maz:px-[var(--maz-control-padding-x-mini,0.25rem)] maz:text-xs',
} as const

const ROUNDED_CLASS: Record<NonNullable<MazBtnProps['roundedSize']>, string> = ROUNDED_SIZE_CLASS

const FAB_SIZE_CLASS: Record<NonNullable<MazBtnProps['size']>, string> = {
  xl: 'maz:size-[var(--maz-control-height-xl,4rem)]',
  lg: 'maz:size-[var(--maz-control-height-lg,3.5rem)]',
  md: 'maz:size-[var(--maz-control-height-md,3rem)]',
  sm: 'maz:size-[var(--maz-control-height-sm,2.5rem)]',
  xs: 'maz:size-[var(--maz-control-height-xs,2rem)]',
  mini: 'maz:size-[var(--maz-control-height-mini,1.5rem)]',
} as const

const ICON_PADDING_CLASS: Record<NonNullable<MazBtnProps['size']>, { start: string, end: string }> = {
  xl: { start: 'maz:ps-6', end: 'maz:pe-6' },
  lg: { start: 'maz:ps-4', end: 'maz:pe-4' },
  md: { start: 'maz:ps-2', end: 'maz:pe-2' },
  sm: { start: 'maz:ps-2', end: 'maz:pe-2' },
  xs: { start: '', end: '' },
  mini: { start: '', end: '' },
} as const
</script>

<template>
  <component
    :is="component"
    :disabled="isDisabled"
    class="m-btn m-reset-css maz:inline-flex maz:cursor-interactive maz:items-center maz:gap-2 maz:border maz:border-solid maz:py-0.5 maz:text-center maz:align-top maz:no-underline"
    :class="[
      `--${resolvedColor}`,
      `--${size}`,
      textColor && `${TEXT_COLOR[textColor]}`,
      !fab && roundedSize ? `--rounded-${roundedSize}` : '',
      !fab && SIZE_CLASS[size],
      fab ? 'maz:flex maz:flex-center maz:rounded-full maz:p-1' : ROUNDED_CLASS[roundedSize],
      fab ? FAB_SIZE_CLASS[size] : '',
      (hasStartStatus || !!startIcon || hasSlotContent($slots['start-icon'])) ? ICON_PADDING_CLASS[size].start : '',
      (!!endIcon || hasSlotContent($slots['end-icon'])) ? ICON_PADDING_CLASS[size].end : '',
      {
        'maz:relative': isOverlayLoader || isOverlaySuccess || hold,
        'maz:isolate': hold,
        'maz:overflow-hidden': overflowHidden,
        '--outlined': isOutlined,
        '--pastel': isPastel,
        '--ghost': isGhost,
        '--block': block && !fab,
        '--fab': fab,
        '--loading': loading,
        '--success': success,
        '--hold': hold,
        '--holding': holding,
        '--active': active,
        '--no-padding': !padding,
        '--has-start-icon': hasStartStatus || !!startIcon || hasSlotContent($slots['start-icon']),
        '--has-end-icon': !!endIcon || hasSlotContent($slots['end-icon']),
      },
    ]"
    :type="btnType"
    :aria-busy="loading ? true : undefined"
    :aria-describedby="hold ? holdId : undefined"
    :style="[btnStyle, hold ? { '--m-btn-hold-duration': `${holdDuration}ms` } : undefined]"
    v-on="hold ? holdListeners : {}"
    @click="onClick"
  >
    <span v-if="hold" class="m-btn__hold-fill" aria-hidden="true" />

    <!--
      @slot start-icon - The icon to display on the inline-start edge (left in LTR, right in RTL)
    -->
    <slot v-if="isStartLoader" name="loader">
      <MazSpinner size="1.25em" />
    </slot>
    <MazDrawnIcon v-else-if="isStartSuccess" name="check" size="1.25em" />
    <slot v-else name="start-icon">
      <MazIcon v-if="startIconProps" v-bind="startIconProps" />
    </slot>

    <!--
      @slot icon - The icon to display on the fab button
    -->
    <slot name="icon">
      <MazIcon v-if="fabIconProps" v-bind="fabIconProps" />
    </slot>

    <!--
      @slot default - The content of the button
    -->
    <slot>
      <span v-if="isRollingLabel" class="m-btn__label maz:inline-grid maz:justify-items-center" aria-live="polite">
        <span class="maz:invisible maz:col-start-1 maz:row-start-1" aria-hidden="true">{{ text }}</span>
        <span class="maz:invisible maz:col-start-1 maz:row-start-1" aria-hidden="true">{{ successText }}</span>
        <MazRollingText class="maz:col-start-1 maz:row-start-1" :value="success ? successText! : text!" />
      </span>
      <template v-else>
        {{ text }}
      </template>
    </slot>

    <!--
      @slot end-icon - The icon to display on the inline-end edge (right in LTR, left in RTL)
    -->
    <slot name="end-icon">
      <MazIcon v-if="endIconProps" v-bind="endIconProps" />
    </slot>

    <div v-if="isOverlayLoader || isOverlaySuccess" :key="isOverlaySuccess ? 'success' : 'loading'" class="m-btn-loader-container">
      <MazDrawnIcon v-if="isOverlaySuccess" name="check" size="1.5em" />
      <!--
        @slot loader - The loader to display in the button
      -->
      <slot v-else name="loader">
        <MazSpinner size="2em" />
      </slot>
    </div>

    <span v-if="hold" :id="holdId" class="maz:sr-only">{{ t('btn.holdDescription') }}</span>
  </component>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";
@layer theme, base, components, utilities;

@layer components {
  .m-btn {
    /* State variants derived from --m-btn-bg via OKLCh lightness offsets
     * (matches the SCALE_OFFSETS table: -600, -700, -400 steps). */
    --m-btn-bg-hover: oklch(from var(--m-btn-bg) clamp(0, calc(l - 0.05), 1) c h); /* ↔ scale -600 */
    --m-btn-bg-active: oklch(from var(--m-btn-bg) clamp(0, calc(l - 0.1), 1) c h); /* ↔ scale -700 */
    --m-btn-bd-light: oklch(from var(--m-btn-bg) clamp(0, calc(l + 0.06), 1) c h); /* ↔ scale -400 */
    --m-btn-bd-dark: oklch(from var(--m-btn-bg) clamp(0, calc(l - 0.1), 1) c h); /* ↔ scale -700 */
    --m-btn-pastel-bg: color-mix(in srgb, var(--m-btn-bg) 20%, transparent);
    --m-btn-pastel-fg: oklch(from var(--m-btn-bg) clamp(0, calc(l - 0.1), 1) c h); /* ↔ scale -700 */

    /* On a dark background the tint is dark too: the text goes lighter to stay readable (↔ scale -300, like MazBadge). */
    @variant dark {
      --m-btn-pastel-fg: oklch(from var(--m-btn-bg) clamp(0, calc(l + 0.15), 1) c h);
    }

    justify-content: var(--m-btn-justify, center);
    border-color: transparent;
    background-color: var(--m-btn-bg);
    color: var(--m-btn-fg);
    font-weight: var(--maz-btn-font-weight, 500);
    outline: var(--maz-focus-ring-width, 2px) solid transparent;
    outline-offset: var(--maz-focus-ring-offset, 2px);

    &:not(:disabled):hover {
      background-color: var(--m-btn-bg-hover);
    }

    &:not(:disabled):active,
    &.--active:not(:disabled) {
      background-color: var(--m-btn-bg-active);
    }

    &:focus-visible {
      outline-color: var(--maz-focus-ring-color, var(--m-btn-bg, var(--maz-primary)));
    }

    /* Outlined variant */
    &.--outlined {
      @apply maz:bg-transparent maz:border-(--m-btn-bd-light) maz:dark:border-(--m-btn-bd-dark);

      color: var(--m-btn-bg);

      &:not(:disabled):hover {
        background-color: color-mix(in srgb, var(--m-btn-bg) 10%, transparent);
      }

      &:not(:disabled):active,
      &.--active:not(:disabled) {
        background-color: color-mix(in srgb, var(--m-btn-bg) 20%, transparent);
      }
    }

    /* Pastel variant */
    &.--pastel {
      background-color: var(--m-btn-pastel-bg);
      color: var(--m-btn-pastel-fg);

      &:not(:disabled):hover {
        background-color: var(--m-btn-bg);
        color: var(--m-btn-fg);
      }

      &:not(:disabled):active,
      &.--active:not(:disabled) {
        background-color: var(--m-btn-bg-hover);
        color: var(--m-btn-fg);
      }
    }

    /* Ghost variant: the color as text, no background until hovered */
    &.--ghost {
      @apply maz:bg-transparent;

      color: var(--m-btn-bg);

      &:not(:disabled):hover {
        background-color: color-mix(in srgb, var(--m-btn-bg) 10%, transparent);
      }

      &:not(:disabled):active,
      &.--active:not(:disabled) {
        background-color: color-mix(in srgb, var(--m-btn-bg) 20%, transparent);
      }
    }

    /* Transparent: no theme color, a foreground tint on hover/active */
    &.--transparent {
      @apply maz:bg-transparent maz:text-foreground;

      --m-btn-bg-hover: color-mix(in oklab, var(--maz-foreground) 6%, transparent);
      --m-btn-bg-active: color-mix(in oklab, var(--maz-foreground) 12%, transparent);

      &:focus-visible {
        outline-color: var(--maz-focus-ring-color, var(--maz-primary));
      }

      &.--outlined {
        @apply maz:border-divider;
      }

      &:not(:disabled):hover {
        background-color: var(--m-btn-bg-hover);
        color: var(--maz-foreground);
      }

      &:not(:disabled):active,
      &.--active:not(:disabled) {
        background-color: var(--m-btn-bg-active);
        color: var(--maz-foreground);
      }

      .m-btn-loader-container {
        @apply maz:bg-surface maz:text-foreground;
      }
    }

    /* Neutral colors: color="surface" and color="container", a foreground tint on hover/active */
    &.--surface {
      --m-btn-bg: var(--maz-surface);
    }

    &.--container {
      --m-btn-bg: var(--maz-container-bg, var(--maz-surface));

      @apply maz:border-divider;
    }

    &.--neutral {
      --m-btn-bg: var(--maz-neutral);
      --m-btn-neutral-fg: var(--maz-neutral-foreground);

      @apply maz:border-divider;
    }

    &.--surface,
    &.--container,
    &.--neutral {
      --m-btn-fg: var(--m-btn-neutral-fg, var(--maz-foreground));
      --m-btn-bg-hover: color-mix(in oklab, var(--m-btn-bg), var(--maz-foreground) 6%);
      --m-btn-bg-active: color-mix(in oklab, var(--m-btn-bg), var(--maz-foreground) 12%);

      &:focus-visible {
        outline-color: var(--maz-focus-ring-color, var(--maz-primary));
      }

      /* A pastel neutral color has no meaning: the solid rendering */
      &.--pastel {
        background-color: var(--m-btn-bg);
        color: var(--m-btn-fg);

        &:not(:disabled):hover {
          background-color: var(--m-btn-bg-hover);
        }

        &:not(:disabled):active,
        &.--active:not(:disabled) {
          background-color: var(--m-btn-bg-active);
        }
      }

      &.--ghost {
        @apply maz:bg-transparent maz:border-transparent;

        color: var(--m-btn-fg);

        &:not(:disabled):hover {
          background-color: color-mix(in oklab, var(--maz-foreground) 6%, transparent);
        }

        &:not(:disabled):active,
        &.--active:not(:disabled) {
          background-color: color-mix(in oklab, var(--maz-foreground) 12%, transparent);
        }
      }

      &.--outlined {
        @apply maz:bg-transparent maz:border-divider;

        color: var(--m-btn-fg);

        &:not(:disabled):hover {
          background-color: color-mix(in oklab, var(--maz-foreground) 6%, transparent);
        }

        &:not(:disabled):active,
        &.--active:not(:disabled) {
          background-color: color-mix(in oklab, var(--maz-foreground) 12%, transparent);
        }
      }
    }
  }

  .m-btn-loader-container {
    @apply maz:absolute maz:inset-0 maz:flex maz:flex-center;

    background-color: var(--m-btn-bg);
    color: var(--m-btn-fg);
  }
}

/* Outside of the layer: these states keep winning over the utility classes of the button and of its parents */
.m-btn {
  transition:
    background-color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    border-color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    outline-color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    scale calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-bounce, ease-out);

  &:not(:disabled, [aria-disabled='true']):active {
    scale: 0.97;
    transition-duration: calc(var(--maz-motion-instant, 80ms) * var(--maz-motion-scale, 1));
  }

  &.--hold {
    touch-action: manipulation;
    user-select: none;
    -webkit-touch-callout: none;
  }

  &.--block {
    @apply maz:w-full;
  }

  &:disabled:not(.--loading) {
    @apply maz:disabled-cursor maz:bg-surface-600 maz:dark:bg-surface-400 maz:text-muted maz:border-surface-600 maz:dark:border-surface-400;
  }

  &.--loading {
    @apply maz:cursor-wait;
  }

  &.--no-padding {
    @apply maz:p-0;
  }
}

.m-btn__hold-fill {
  position: absolute;
  inset: 0;
  background-color: color-mix(in srgb, currentcolor 22%, transparent);
  pointer-events: none;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform calc(var(--maz-motion-fast, 150ms) * 0.7 * var(--maz-motion-scale, 1))
    var(--maz-easing-in, ease-in);
}

[dir='rtl'] .m-btn__hold-fill {
  transform-origin: right center;
}

.m-btn.--holding .m-btn__hold-fill {
  transform: scaleX(1);
  transition: transform var(--m-btn-hold-duration, 1000ms) linear;
}

@keyframes m-btn-status-in {
  from {
    opacity: 0;
  }
}

.m-btn-loader-container {
  animation: m-btn-status-in calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, ease-out);
}
</style>
