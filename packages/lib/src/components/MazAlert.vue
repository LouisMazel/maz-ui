<script lang="ts" setup>
import type { IconComponent } from '@maz-ui/icons'
import type { CSSProperties } from 'vue'
import type { MazIconProps } from './MazIcon.vue'
import type { MazColor } from './types'
import { MazCheckCircle } from '@maz-ui/icons/lazy/MazCheckCircle'
import { MazExclamationCircle } from '@maz-ui/icons/lazy/MazExclamationCircle'
import { MazInformationCircle } from '@maz-ui/icons/lazy/MazInformationCircle'
import { MazXCircle } from '@maz-ui/icons/lazy/MazXCircle'
import { computed, defineAsyncComponent, useId, useSlots } from 'vue'

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
   * Icon of the alert - can be a component or icon name string
   * @type {IconComponent | string}
   */
  icon?: IconComponent | string
  /**
   * Hide the icon
   * @default false
   */
  hideIcon?: boolean
  /**
   * Color of the alert
   * @type {MazAlertColor}
   * @values `'success' | 'warning' | 'destructive' | 'info' | 'primary' | 'secondary' | 'accent' | 'contrast'`
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
}

const {
  title,
  content,
  icon = undefined,
  hideIcon = false,
  color = 'info',
  iconSize = 'md',
  roundedSize = 'md',
  bordered = true,
  variant = 'soft',
} = defineProps<MazAlertProps>()

const MazIcon = defineAsyncComponent(() => import('./MazIcon.vue'))

const slots = useSlots()
const instanceId = useId()

const headingId = computed(() => `m-alert-heading-${instanceId}`)
const contentId = computed(() => `m-alert-content-${instanceId}`)

const hasTitle = computed(() => !!title || !!slots.title)
const hasContent = computed(() => !!content || !!slots.default)

const colorStyles = computed<CSSProperties>(() => ({
  '--m-alert-color': `var(--maz-${color}-700)`,
  '--m-alert-color-dark': `var(--maz-${color}-400)`,
  '--m-alert-bg': `var(--maz-${color})`,
  '--m-alert-fg': `var(--maz-${color}-foreground)`,
  '--m-alert-border': `var(--maz-${color}-600)`,
}))

const ROUNDED_CLASS = {
  'none': '',
  'sm': 'maz:rounded-xs',
  'md': 'maz:rounded-md',
  'lg': 'maz:rounded-lg',
  'xl': 'maz:rounded-xl',
  '2xl': 'maz:rounded-2xl',
  '3xl': 'maz:rounded-3xl',
} as const

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
  }

  return iconMap[color]
})
</script>

<template>
  <div
    class="m-alert m-reset-css maz:flex maz:items-start maz:gap-3 maz:p-4"
    role="alert"
    :aria-labelledby="hasTitle ? headingId : undefined"
    :aria-describedby="hasContent ? contentId : undefined"
    :style="colorStyles"
    :class="[
      ROUNDED_CLASS[roundedSize],
      `--${variant}`,
      {
        '--bordered': bordered,
        'maz:text-(--m-alert-color) maz:dark:text-(--m-alert-color-dark)': variant === 'soft',
        'maz:bg-(--m-alert-bg) maz:text-(--m-alert-fg)': variant === 'solid',
        'maz:border': bordered,
        'maz:border-(--m-alert-border)': bordered && variant === 'solid',
      },
    ]"
  >
    <div v-if="currentIcon" class="m-alert-icon maz:flex maz:shrink-0 maz:items-center maz:justify-center" aria-hidden="true">
      <MazIcon
        v-if="typeof currentIcon === 'string'"
        :name="currentIcon"
        :size="iconSize"
      />
      <MazIcon
        v-else
        :icon="currentIcon"
        :size="iconSize"
      />
    </div>

    <div class="m-alert-body maz:flex maz:flex-1 maz:flex-col maz:gap-1">
      <p v-if="hasTitle" :id="headingId" class="m-alert-title maz:m-0 maz:font-semibold maz:leading-tight">
        <!-- @slot Title slot - overrides title prop -->
        <slot name="title">
          {{ title }}
        </slot>
      </p>
      <div v-if="hasContent" :id="contentId" class="m-alert-content maz:leading-relaxed">
        <!-- @slot Default slot for alert content - overrides content prop -->
        <slot>{{ content }}</slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-alert {
  &.--soft {
    background-color: color-mix(in srgb, var(--m-alert-color) 10%, transparent);

    &.--bordered {
      border-color: color-mix(in srgb, var(--m-alert-color) 30%, transparent);
    }
  }
}
</style>
