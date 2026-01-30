<script lang="ts" setup>
import type { IconComponent } from '@maz-ui/icons'
import type { CSSProperties } from 'vue'
import type { MazIconProps } from './MazIcon.vue'
import type { MazColor } from './types'
import { MazCheckCircle, MazExclamationCircle, MazInformationCircle, MazXCircle } from '@maz-ui/icons'
import { computed, defineAsyncComponent, useId, useSlots } from 'vue'

export type MazAlertColor = Exclude<MazColor, 'transparent'>
export type MazAlertRoundedSize = 'none' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
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
   * @values `'none' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'`
   * @default 'base'
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
  roundedSize = 'base',
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
    class="m-alert m-reset-css"
    role="alert"
    :aria-labelledby="hasTitle ? headingId : undefined"
    :aria-describedby="hasContent ? contentId : undefined"
    :style="colorStyles"
    :class="[
      `--rounded-${roundedSize}`,
      `--${variant}`,
      { '--bordered': bordered },
    ]"
  >
    <div v-if="currentIcon" class="m-alert-icon" aria-hidden="true">
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

    <div class="m-alert-body">
      <p v-if="hasTitle" :id="headingId" class="m-alert-title">
        <!-- @slot Title slot - overrides title prop -->
        <slot name="title">
          {{ title }}
        </slot>
      </p>
      <div v-if="hasContent" :id="contentId" class="m-alert-content">
        <!-- @slot Default slot for alert content - overrides content prop -->
        <slot>{{ content }}</slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.m-alert {
  @apply maz-flex maz-items-start maz-gap-3 maz-p-4;

  &.--soft {
    background-color: hsl(var(--m-alert-color) / 10%);

    @apply maz-text-[hsl(var(--m-alert-color))] dark:maz-text-[hsl(var(--m-alert-color-dark))];

    &.--bordered {
      @apply maz-border;

      border-color: hsl(var(--m-alert-color) / 30%);
    }
  }

  &.--solid {
    @apply maz-bg-[hsl(var(--m-alert-bg))] maz-text-[hsl(var(--m-alert-fg))];

    &.--bordered {
      @apply maz-border maz-border-[hsl(var(--m-alert-border))];
    }
  }

  &-icon {
    @apply maz-flex maz-shrink-0 maz-items-center maz-justify-center;
  }

  &-body {
    @apply maz-flex maz-flex-1 maz-flex-col maz-gap-1;
  }

  &-title {
    @apply maz-m-0 maz-font-semibold maz-leading-tight;
  }

  &-content {
    @apply maz-leading-relaxed;
  }

  &.--rounded-none {
    @apply maz-rounded-none;
  }

  &.--rounded-sm {
    @apply maz-rounded-sm;
  }

  &.--rounded-md {
    @apply maz-rounded-md;
  }

  &.--rounded-base {
    @apply maz-rounded;
  }

  &.--rounded-lg {
    @apply maz-rounded-lg;
  }

  &.--rounded-xl {
    @apply maz-rounded-xl;
  }

  &.--rounded-2xl {
    @apply maz-rounded-2xl;
  }

  &.--rounded-3xl {
    @apply maz-rounded-3xl;
  }
}
</style>
