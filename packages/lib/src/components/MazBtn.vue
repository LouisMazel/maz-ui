<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { MazIconLike } from '../composables/useMazIconProps'
import type { MazColor, MazSize } from './types'
import { computed, defineAsyncComponent, useAttrs } from 'vue'
import { useMazIconProps } from '../composables/useMazIconProps'
import { hasSlotContent } from '../utils/hasSlotContent'
import { resolveLinkComponent } from '../utils/resolveLinkComponent'
import { getColor } from './types'

const {
  size = 'md',
  color = 'primary',
  type = 'button',
  fab,
  icon,
  startIcon,
  endIcon,
  roundedSize = 'md',
  justify = 'center',
  pastel,
  outlined,
  loading,
  disabled,
  block,
  padding = true,
  active,
} = defineProps<MazBtnProps>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))
const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

const { href, to } = useAttrs()

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
   * The color of the button
   * @values `'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'destructive' | 'transparent' | 'contrast' | 'accent' | 'background'`
   */
  color?: MazColor | 'background'
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
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /**
   * If true, the button have the "border" style
   * @default false
   */
  outlined?: boolean
  /**
   * If true, the button will have a pastel color
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
   * If true, the button will have no padding
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
}

const component = computed(() => {
  if (href)
    return 'a'
  else if (to)
    return resolveLinkComponent()
  return 'button'
})

const resolvedColor = computed(() => getColor(color))

const isDisabled = computed(
  () => (loading || disabled) && component.value === 'button',
)
const btnType = computed(() => (component.value === 'button' ? type : undefined))

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

  return iconSizeMap[size] || 'lg'
})

const { iconProps: startIconProps } = useMazIconProps(() => startIcon, () => ({ size: iconSize.value }))
const { iconProps: endIconProps } = useMazIconProps(() => endIcon, () => ({ size: iconSize.value }))
const { iconProps: fabIconProps } = useMazIconProps(() => icon, () => ({ size: iconSize.value }))

const btnStyle = computed<CSSProperties>(() => {
  const c = resolvedColor.value
  const base: Record<string, string> = { '--m-btn-justify': justify }
  if (c === 'transparent' || c === 'surface')
    return base

  const pastelFg = c === 'contrast' ? 'contrast-foreground' : `${c}-700`

  return {
    ...base,
    '--m-btn-bg': `var(--maz-${c})`,
    '--m-btn-fg': `var(--maz-${c}-foreground)`,
    '--m-btn-bg-hover': `var(--maz-${c}-600)`,
    '--m-btn-bg-active': `var(--maz-${c}-700)`,
    '--m-btn-bd-light': `var(--maz-${c}-200)`,
    '--m-btn-bd-dark': `var(--maz-${c}-700)`,
    ...(pastel && {
      '--m-btn-pastel-bg': `var(--maz-${c}-50)`,
      '--m-btn-pastel-fg': `var(--maz-${pastelFg})`,
    }),
  }
})

const SIZE_CLASS = {
  xl: 'maz:min-h-16 maz:px-8 maz:text-xl',
  lg: 'maz:min-h-14 maz:px-6',
  md: 'maz:min-h-12 maz:px-4',
  sm: 'maz:min-h-10 maz:px-3',
  xs: 'maz:min-h-8 maz:px-2 maz:text-sm',
  mini: 'maz:min-h-6 maz:px-1 maz:text-xs',
} as const

const ROUNDED_CLASS = {
  none: '',
  sm: 'maz:rounded-xs',
  md: 'maz:rounded-md',
  lg: 'maz:rounded-lg',
  xl: 'maz:rounded-xl',
  full: 'maz:rounded-full',
} as const

const FAB_SIZE_CLASS = {
  xl: 'maz:w-16',
  lg: 'maz:w-14',
  md: 'maz:w-12',
  sm: 'maz:w-10',
  xs: 'maz:w-8',
  mini: 'maz:w-6',
} as const

const ICON_PADDING_CLASS = {
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
    class="m-btn m-reset-css maz:relative maz:cursor-pointer maz:items-center maz:gap-2 maz:border maz:border-solid maz:border-transparent maz:bg-transparent maz:py-0.5 maz:text-center maz:align-top maz:text-foreground maz:no-underline maz:transition-all maz:duration-200 maz:ease-in-out maz:inline-flex maz:overflow-hidden"
    :class="[
      `--${resolvedColor}`,
      `--${size}`,
      !fab && roundedSize ? `--rounded-${roundedSize}` : '',
      SIZE_CLASS[size],
      fab ? 'maz:rounded-full maz:flex maz:items-center maz:justify-center maz:p-1' : ROUNDED_CLASS[roundedSize],
      fab ? FAB_SIZE_CLASS[size] : '',
      (!!startIcon || hasSlotContent($slots['start-icon'])) ? ICON_PADDING_CLASS[size].start : '',
      (!!endIcon || hasSlotContent($slots['end-icon'])) ? ICON_PADDING_CLASS[size].end : '',
      {
        '--outlined': outlined,
        '--pastel': pastel,
        '--block': block && !fab,
        '--fab': fab,
        '--loading': loading,
        '--active': active,
        '--no-padding': !padding,
        '--has-start-icon': !!startIcon || hasSlotContent($slots['start-icon']),
        '--has-end-icon': !!endIcon || hasSlotContent($slots['end-icon']),
      },
    ]"
    :style="btnStyle"
    :type="btnType"
  >
    <!--
      @slot start-icon - The icon to display on the inline-start edge (left in LTR, right in RTL)
    -->
    <slot name="start-icon">
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
      {{ text }}
    </slot>

    <!--
      @slot end-icon - The icon to display on the inline-end edge (right in LTR, left in RTL)
    -->
    <slot name="end-icon">
      <MazIcon v-if="endIconProps" v-bind="endIconProps" />
    </slot>

    <div v-if="loading" class="m-btn-loader-container">
      <!--
        @slot loader - The loader to display in the button
      -->
      <slot name="loader">
        <MazSpinner size="2em" />
      </slot>
    </div>
  </component>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-btn {
  justify-content: var(--m-btn-justify, center);
  background-color: var(--m-btn-bg);
  color: var(--m-btn-fg);

  & span {
    @apply maz:leading-none;
  }

  &:not(:disabled):hover {
    background-color: var(--m-btn-bg-hover);
  }

  &:not(:disabled):active,
  &.--active {
    background-color: var(--m-btn-bg-active);
  }

  &-loader-container {
    @apply maz:absolute maz:inset-0 maz:flex maz:flex-center;

    background-color: var(--m-btn-bg);
    color: var(--m-btn-fg);
  }

  /* Outlined variant */
  &.--outlined {
    @apply maz:bg-transparent maz:border-(--m-btn-bd-light) maz:dark:border-(--m-btn-bd-dark);

    color: var(--m-btn-bg);

    &:not(:disabled):hover {
      background-color: color-mix(in srgb, var(--m-btn-bg) 10%, transparent);
    }

    &:not(:disabled):active,
    &.--active {
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
    &.--active {
      background-color: var(--m-btn-bg-hover);
      color: var(--m-btn-fg);
    }
  }

  /* Transparent: no theme color, uses surface for hover/active */
  &.--transparent {
    @apply maz:bg-transparent maz:text-foreground;

    &:not(:disabled):hover {
      @apply maz:bg-surface-600/50 maz:dark:bg-surface-400;
    }

    &.--outlined {
      @apply maz:border-divider;

      &:not(:disabled):hover {
        @apply maz:bg-surface-600/50;
      }

      &:not(:disabled):active,
      &.--active {
        @apply maz:bg-surface-600;
      }
    }

    &.--pastel {
      &:not(:disabled):hover {
        @apply maz:bg-surface-600;
      }

      &:not(:disabled):active,
      &.--active {
        @apply maz:bg-surface-700;
      }
    }

    .m-btn-loader-container {
      @apply maz:bg-surface maz:text-foreground;
    }
  }

  /* Surface (aka color="background") */
  &.--surface {
    @apply maz:bg-surface maz:text-foreground;

    &:not(:disabled):hover {
      @apply maz:bg-surface-600 maz:dark:bg-surface-400;
    }

    &:not(:disabled):active,
    &.--active {
      @apply maz:bg-surface-700 maz:dark:bg-surface-300;
    }

    &.--outlined {
      @apply maz:bg-transparent maz:border-divider;

      &:not(:disabled):hover {
        @apply maz:bg-surface-600/50;
      }

      &:not(:disabled):active,
      &.--active {
        @apply maz:bg-surface-600;
      }
    }

    &.--pastel {
      @apply maz:bg-surface-600;

      &:not(:disabled):hover {
        @apply maz:bg-surface-700;
      }

      &:not(:disabled):active,
      &.--active {
        @apply maz:bg-surface-800;
      }
    }

    .m-btn-loader-container {
      @apply maz:text-foreground maz:bg-surface-600 maz:dark:bg-surface-400;
    }
  }

  &.--block {
    @apply maz:w-full;
  }

  &:disabled:not(.--loading) {
    @apply maz:cursor-not-allowed maz:bg-surface-600 maz:dark:bg-surface-400 maz:text-muted maz:border-surface-600 maz:dark:border-surface-400;
  }

  &.--loading {
    @apply maz:cursor-wait;
  }

  &.--no-padding {
    @apply maz:p-0;
  }
}
</style>
