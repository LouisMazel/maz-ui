<script lang="ts" setup generic="_T">
import type { CSSProperties } from 'vue'
import type { MazDrawnIconName } from './MazDrawnIcon.vue'
import type { MazIconProps, MazIconValue } from './MazIcon.vue'
import type { MazColor } from './types.ts'
import { MazXMark } from '@maz-ui/icons/raw/MazXMark'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, ref, useId, useSlots, watch } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { readMotionDuration, readMotionEasing } from '../utils/motionTokens.ts'
import { ROUNDED_SIZE_CLASS } from './constants.ts'
import MazDrawnIcon from './MazDrawnIcon.vue'

export type MazAlertColor = Exclude<MazColor, 'transparent'>
export type MazAlertRoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type MazAlertVariant = 'soft' | 'solid' | 'outline'

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
   * @values `'soft' | 'solid' | 'outline'`
   * @default 'soft'
   */
  variant?: MazAlertVariant
  /**
   * How a screen reader announces the alert when it appears: `alert` interrupts the user, `status` waits
   * for a pause. By default `alert` for the `destructive` and `warning` colors, `status` otherwise
   * @values `'alert' | 'status'`
   */
  role?: 'alert' | 'status'
  /**
   * Adds a close button: the alert folds away and `open` becomes `false`
   * @default false
   */
  dismissible?: boolean
  /**
   * The icon draws itself and a dismissed alert folds away, instead of just appearing and disappearing
   * @default true
   */
  animated?: boolean
}

export interface MazAlertEmits {
  /**
   * Emitted when the close button is clicked (`dismissible` only)
   */
  (event: 'close'): void
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
  dismissible = false,
  animated = true,
} = defineProps<MazAlertProps>()

const emit = defineEmits<MazAlertEmits>()

/**
 * Shows the alert. `false` folds it away (the alert stays mounted)
 * @default true
 */
const open = defineModel<boolean>('open', { default: true })

const { t } = useTranslations()
const { shouldReduceMotion } = useReducedMotion()

const alertRef = ref<HTMLElement>()
const rendered = ref(open.value)
let foldAnimation: Animation | undefined

function finishFold() {
  foldAnimation = undefined
  rendered.value = open.value
  alertRef.value?.style.removeProperty('overflow')
}

function fold() {
  const element = alertRef.value

  if (!element || !animated || typeof element.animate !== 'function') {
    rendered.value = false
    return
  }

  const duration = shouldReduceMotion.value ? 0 : readMotionDuration('--maz-motion-normal', 220) * 0.7
  const easing = readMotionEasing('--maz-easing-in', 'ease-in')

  element.style.overflow = 'hidden'
  foldAnimation = element.animate(
    shouldReduceMotion.value
      ? [{ opacity: 1 }, { opacity: 0 }]
      : [
          { blockSize: `${element.offsetHeight}px`, opacity: 1 },
          { blockSize: '0px', opacity: 0, paddingBlock: '0px', marginBlock: '0px', borderBlockWidth: '0px' },
        ],
    { duration: Math.max(duration, 1), easing, fill: 'forwards' },
  )
  foldAnimation.finished.then(finishFold).catch(() => {})
}

watch(open, (value) => {
  foldAnimation?.cancel()
  foldAnimation = undefined
  alertRef.value?.style.removeProperty('overflow')

  if (value)
    rendered.value = true
  else
    fold()
})

function dismiss() {
  open.value = false
  emit('close')
}

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

const DRAWN_ICON: Record<MazAlertColor, MazDrawnIconName> = {
  success: 'check-circle',
  warning: 'exclamation-circle',
  destructive: 'x-circle',
  info: 'information-circle',
  primary: 'information-circle',
  secondary: 'information-circle',
  accent: 'information-circle',
  contrast: 'information-circle',
  neutral: 'information-circle',
}

const hasIcon = computed(() => !hideIcon)
const drawnIcon = computed(() => icon ? undefined : DRAWN_ICON[color])
</script>

<template>
  <div
    v-show="rendered"
    ref="alertRef"
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
        'maz:text-(--m-alert-color) maz:dark:text-(--m-alert-color-dark)': variant === 'soft' || variant === 'outline',
        'maz:bg-(--m-alert-bg) maz:text-(--m-alert-fg)': variant === 'solid',
        'maz:border': bordered,
        'maz:border-(--m-alert-border)': bordered && variant === 'solid',
      },
    ]"
  >
    <div v-if="hasIcon" class="m-alert-icon maz:flex maz:shrink-0 maz:flex-center" aria-hidden="true">
      <MazDrawnIcon
        v-if="drawnIcon"
        :name="drawnIcon"
        :size="iconSize"
        :duration="animated ? undefined : '0s'"
      />
      <MazIcon
        v-else-if="icon"
        :icon="icon"
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

    <button
      v-if="dismissible"
      type="button"
      class="m-alert-close maz:inline-flex maz:shrink-0 maz:cursor-pointer maz:rounded-sm maz:border-0 maz:bg-transparent maz:p-1 maz:text-inherit maz:opacity-70 maz:focus-ring maz:hover:opacity-100"
      :aria-label="t('aria.close')"
      @click="dismiss"
    >
      <MazIcon :icon="MazXMark" size="sm" aria-hidden="true" />
    </button>
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

  &.--outline {
    background-color: transparent;

    &.--bordered {
      border-color: color-mix(in srgb, var(--m-alert-color) 60%, transparent);
    }
  }

  /* Neutral: the soft grey of the theme in both variants, with a divider border */
  &.--neutral {
    background-color: var(--m-alert-bg);
    color: var(--m-alert-fg);

    &.--bordered {
      border-color: var(--m-alert-border);
    }

    &.--outline {
      background-color: transparent;
      color: var(--m-alert-color);
    }
  }
}
</style>
