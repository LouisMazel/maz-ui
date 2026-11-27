<script lang="ts" setup generic="_T">
import type { IconComponent } from '@maz-ui/icons'
import type { CSSProperties } from 'vue'
import type { MazIconProps, MazIconValue } from './MazIcon.vue'
import type { MazColor } from './types.ts'
import { MazCheckCircle } from '@maz-ui/icons/lazy/MazCheckCircle'
import { MazExclamationCircle } from '@maz-ui/icons/lazy/MazExclamationCircle'
import { MazInformationCircle } from '@maz-ui/icons/lazy/MazInformationCircle'
import { MazXCircle } from '@maz-ui/icons/lazy/MazXCircle'
import { computed, defineAsyncComponent, useId, useSlots } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { ROUNDED_SIZE_CLASS } from './constants.ts'

export type MazAlertColor = Exclude<MazColor, 'transparent'>
export type MazAlertRoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type MazAlertVariant = 'soft' | 'solid'

export interface MazAlertProps {
  /**
   * Title of the alert
   */
  title?: string
  /**
   * Content of the alert
   */
  content?: string
  /**
   * Icon of the alert, in the formats of MazIcon: a name (`'bell'`, `'app:logo'`), a component, a URL or a raw SVG.
   * By default, the icon of the color.
   */
  icon?: MazIconValue
  /**
   * Hide the icon
   * @default false
   */
  hideIcon?: boolean
  /**
   * Color of the alert
   * @type {MazAlertColor}
   * @values `'success' | 'warning' | 'destructive' | 'info' | 'primary' | 'secondary' | 'accent' | 'contrast' | 'neutral'`
   * @default 'info'
   */
  color?: MazAlertColor
  /**
   * Size of the icon
   * @type {MazIconProps['size']}
   * @default 'md'
   */
  iconSize?: MazIconProps['size']
  /**
   * Size of the rounded corners
   * @type {MazAlertRoundedSize}
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'`
   * @default 'md'
   */
  roundedSize?: MazAlertRoundedSize
  /**
   * Add border to the component
   * @default true
   */
  bordered?: boolean
  /**
   * Visual variant of the alert
   * @type {MazAlertVariant}
   * @values `'soft' | 'solid'`
   * @default 'soft'
   */
  variant?: MazAlertVariant
  /**
   * How a screen reader announces the alert when it appears: `alert` interrupts the user, `status` waits
   * for a pause. By default `alert` for the `destructive` and `warning` colors, `status` otherwise
   * @values `'alert' | 'status'`
   */
  role?: 'alert' | 'status'
}

const {
  title,
  content,
  icon = undefined,
  hideIcon = false,
  color = 'info',
  iconSize = 'md',
  bordered = true,
  variant = 'soft',
  role,
} = defineProps<MazAlertProps>()

const computedRole = computed(() => role ?? (color === 'destructive' || color === 'warning' ? 'alert' : 'status'))

const { roundedSize } = useGlobalConfig<{ roundedSize: MazAlertRoundedSize }>('MazAlert', { roundedSize: 'md' })

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))

const slots = useSlots()
const instanceId = useId()

const headingId = computed(() => `m-alert-heading-${instanceId}`)
const contentId = computed(() => `m-alert-content-${instanceId}`)

const hasTitle = computed(() => !!title || !!slots.title)
const hasContent = computed(() => !!content || !!slots.default)

const colorStyles = computed<CSSProperties>(() => ({
  '--m-alert-bg': `var(--maz-${color})`,
  '--m-alert-fg': `var(--maz-${color}-foreground)`,
  ...(color === 'neutral' && {
    '--m-alert-color': 'var(--maz-neutral-foreground)',
    '--m-alert-color-dark': 'var(--maz-neutral-foreground)',
    '--m-alert-border': 'var(--maz-divider)',
  }),
}))

const ROUNDED_CLASS = ROUNDED_SIZE_CLASS

const currentIcon = computed(() => {
  if (hideIcon) {
    return undefined
  }

  if (icon) {
    return icon
  }

  const iconMap: Record<MazAlertColor, IconComponent> = {
    success: MazCheckCircle,
    warning: MazExclamationCircle,
    destructive: MazXCircle,
    info: MazInformationCircle,
    primary: MazInformationCircle,
    secondary: MazInformationCircle,
    accent: MazInformationCircle,
    contrast: MazInformationCircle,
    neutral: MazInformationCircle,
  }

  return iconMap[color]
})
</script>

<template>
  <div
    class="m-alert m-reset-css maz:flex maz:items-start maz:gap-3 maz:p-4"
    :role="computedRole"
    :aria-labelledby="hasTitle ? headingId : undefined"
    :aria-describedby="hasContent ? contentId : undefined"
    :style="colorStyles"
    :class="[
      ROUNDED_CLASS[roundedSize],
      `--${variant}`,
      `--${color}`,
      `--rounded-${roundedSize}`,
      {
        '--bordered': bordered,
        'maz:text-(--m-alert-color) maz:dark:text-(--m-alert-color-dark)': variant === 'soft',
        'maz:bg-(--m-alert-bg) maz:text-(--m-alert-fg)': variant === 'solid',
        'maz:border': bordered,
        'maz:border-(--m-alert-border)': bordered && variant === 'solid',
      },
    ]"
  >
    <div v-if="currentIcon" class="m-alert-icon maz:flex maz:shrink-0 maz:flex-center" aria-hidden="true">
      <MazIcon
        :icon="currentIcon"
        :size="iconSize"
      />
    </div>

    <div class="m-alert-body maz:flex maz:flex-1 maz:flex-col maz:gap-1">
      <p v-if="hasTitle" :id="headingId" class="m-alert-title maz:m-0 maz:type-title-4">
        <!-- @slot Title slot - overrides title prop -->
        <slot name="title">
          {{ title }}
        </slot>
      </p>
      <div v-if="hasContent" :id="contentId" class="m-alert-content maz:type-body">
        <!-- @slot Default slot for alert content - overrides content prop -->
        <slot>{{ content }}</slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.m-alert {
  /* State variants derived from --m-alert-bg via OKLCh lightness offsets. */
  --m-alert-color: oklch(from var(--m-alert-bg) clamp(0, calc(l - 0.1), 1) c h); /* ↔ scale -700 */
  --m-alert-color-dark: oklch(from var(--m-alert-bg) clamp(0, calc(l + 0.06), 1) c h); /* ↔ scale -400 */
  --m-alert-border: oklch(from var(--m-alert-bg) clamp(0, calc(l - 0.05), 1) c h); /* ↔ scale -600 */

  &.--soft {
    background-color: color-mix(in srgb, var(--m-alert-color) 10%, transparent);

    &.--bordered {
      border-color: color-mix(in srgb, var(--m-alert-color) 30%, transparent);
    }
  }

  /* Neutral: the soft grey of the theme in both variants, with a divider border */
  &.--neutral {
    background-color: var(--m-alert-bg);
    color: var(--m-alert-fg);

    &.--bordered {
      border-color: var(--m-alert-border);
    }
  }
}
</style>
