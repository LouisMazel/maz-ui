<script lang="ts" setup>
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import type { CSSProperties, HTMLAttributes } from 'vue'
import type { PullToRefreshTarget } from '../composables/usePullToRefresh'
import type { MazColor } from './types'
import { MazArrowDown } from '@maz-ui/icons/raw/MazArrowDown'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { isStandaloneMode } from '@maz-ui/utils/helpers/isStandaloneMode'
import { computed, defineAsyncComponent, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { usePullToRefresh } from '../composables/usePullToRefresh'
import MazIcon from './MazIcon.vue'

export interface MazPullToRefreshProps {
  /**
   * Function called when the user releases after pulling far enough. The spinner stays visible until the returned promise settles.
   * Without it, the component does nothing.
   */
  onRefresh?: () => unknown
  /**
   * Pull distance (in px, after resistance) required to trigger a refresh
   * @default 80
   */
  distance?: number
  /**
   * Maximum pull distance (in px), reached with a rubber band effect beyond `distance`
   * @default distance * 1.6
   */
  maxDistance?: number
  /**
   * Ratio between the finger movement and the pull distance, between 0 and 1. Lower is stiffer.
   * @default 0.5
   */
  resistance?: number
  /**
   * Minimum duration (in ms) of the refreshing state, so the feedback stays visible on fast refreshes
   * @default 400
   */
  minDuration?: number
  /**
   * CSS selector of the scroll container. By default, the closest scrollable ancestor of the component, or the window.
   * The pull only starts when this container is scrolled to the top.
   */
  containerSelector?: string
  /**
   * Class of the header that holds the indicator
   */
  headerClass?: HTMLAttributes['class']
  /**
   * Color of the progress ring and the spinner
   * @default 'primary'
   */
  spinnerColor?: MazColor
  /**
   * Disable the pull to refresh
   * @default false
   */
  disabled?: boolean
  /**
   * Only enable the pull to refresh when the app runs as an installed PWA (standalone display mode),
   * browsers already provide their own pull to refresh
   * @default false
   */
  standaloneMode?: boolean
  /**
   * Vibrate briefly when the pull reaches `distance` (devices supporting `navigator.vibrate`)
   * @default true
   */
  haptic?: boolean
  /**
   * Translations of the pull to refresh
   * @type {DeepPartial<MazUiTranslationsNestedSchema['pullToRefresh']>}
   * @default Translations from @maz-ui/translations
   */
  translations?: DeepPartial<MazUiTranslationsNestedSchema['pullToRefresh']>
  /**
   * @deprecated No effect since the scroll position of the container is used to know when the pull can start
   */
  offset?: number
}

const {
  onRefresh,
  distance: threshold = 80,
  maxDistance,
  resistance = 0.5,
  minDuration = 400,
  containerSelector,
  headerClass,
  spinnerColor = 'primary',
  disabled = false,
  standaloneMode = false,
  haptic = true,
  translations,
} = defineProps<MazPullToRefreshProps>()

const emits = defineEmits<{
  /** Emitted when the refresh starts */
  start: []
  /** Emitted when `onRefresh` resolved */
  loaded: []
  /** Emitted with the value resolved by `onRefresh` */
  response: [response: unknown]
  /** Emitted when `onRefresh` threw or rejected */
  error: [error: unknown]
  /** Emitted when the refresh ends, after `loaded` or `error` */
  finish: []
}>()

defineSlots<{
  /** Content shown while pulling, before the threshold */
  'pull-before'?: (props: { progress: number, distance: number }) => unknown
  /** Content shown once releasing triggers a refresh */
  'pull-ready'?: (props: { progress: number, distance: number }) => unknown
  /** Content shown while refreshing */
  'pull-loading'?: (props: { progress: number, distance: number }) => unknown
  /** Content of the page */
  'default'?: () => unknown
}>()

const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

const { t } = useTranslations()
const messages = computed<MazUiTranslationsNestedSchema['pullToRefresh']>(() => ({
  pull: translations?.pull ?? t('pullToRefresh.pull'),
  release: translations?.release ?? t('pullToRefresh.release'),
  refreshing: translations?.refreshing ?? t('pullToRefresh.refreshing'),
}))

const root = useTemplateRef<HTMLElement>('root')
const container = shallowRef<PullToRefreshTarget>()
const standalone = ref(false)

function isScrollable(element: HTMLElement) {
  return ['auto', 'scroll', 'overlay'].includes(getComputedStyle(element).overflowY)
}

function findContainer(): HTMLElement | Window {
  if (containerSelector) {
    const element = document.querySelector<HTMLElement>(containerSelector)
    if (element)
      return element
  }
  let element = root.value?.parentElement
  while (element && element !== document.body && element !== document.documentElement) {
    if (isScrollable(element))
      return element
    element = element.parentElement
  }
  return globalThis.window
}

onMounted(() => {
  standalone.value = standaloneMode && isStandaloneMode()
  container.value = findContainer()
})

watch(() => containerSelector, () => {
  if (root.value)
    container.value = findContainer()
})

const isDisabled = computed(() => disabled || onRefresh === undefined || (standaloneMode && !standalone.value))

async function runRefresh() {
  emits('start')
  try {
    const response = await onRefresh?.()
    emits('loaded')
    emits('response', response)
  }
  catch (error) {
    emits('error', error)
    throw error
  }
  finally {
    emits('finish')
  }
}

const { distance, progress, isPulling, isReady, isRefreshing, refresh } = usePullToRefresh({
  target: container,
  onRefresh: runRefresh,
  threshold: () => threshold,
  maxDistance: () => maxDistance,
  resistance: () => resistance,
  minDuration: () => minDuration,
  haptic: () => haptic,
  disabled: isDisabled,
})

const ringLength = 2 * Math.PI * 16
const indicatorClass = 'maz:relative maz:flex maz:size-9 maz:items-center maz:justify-center maz:rounded-full maz:bg-surface maz:text-base maz:text-foreground maz:shadow-elevation'
const accentStyle = computed<CSSProperties>(() => {
  const color = spinnerColor as string
  if (color === 'theme')
    return {}
  if (color === 'normal')
    return { color: 'var(--maz-foreground)' }
  return { color: `var(--maz-${color})` }
})

defineExpose({
  /** Run the refresh programmatically (a "refresh" button for keyboard and mouse users) */
  refresh,
  /** `onRefresh` is running */
  isRefreshing,
  /** Pull progress towards `distance`, from 0 to 1 */
  progress,
})
</script>

<template>
  <div
    ref="root"
    class="m-pull-to-refresh m-reset-css"
    :class="{ '--available': isReady, '--pulling': isPulling, '--refreshing': isRefreshing }"
    :aria-busy="isRefreshing || undefined"
  >
    <div
      v-if="!isDisabled"
      class="m-pull-to-refresh__header maz:relative maz:flex maz:w-full maz:items-end maz:justify-center maz:overflow-hidden maz:text-center maz:text-[0.8em] maz:text-muted"
      :class="[headerClass, { 'maz:transition-[height] maz:duration-200 maz:ease-out maz:motion-reduce:transition-none': !isPulling }]"
      :style="{ height: `${distance}px` }"
      aria-hidden="true"
    >
      <div
        v-if="distance > 0"
        class="maz:flex maz:flex-col maz:items-center maz:gap-1.5 maz:pb-2"
        :style="{ opacity: Math.min(1, progress * 1.5) }"
      >
        <slot v-if="isRefreshing" name="pull-loading" :progress="progress" :distance="distance">
          <MazSpinner :color="spinnerColor" size="2.25em" />
        </slot>
        <slot v-else-if="isReady" name="pull-ready" :progress="progress" :distance="distance">
          <span class="m-pull-to-refresh__indicator --ready" :class="indicatorClass" :style="accentStyle">
            <MazIcon :icon="MazArrowDown" class="maz:rotate-180 maz:transition-transform maz:duration-200 maz:motion-reduce:transition-none" />
          </span>
          <span>{{ messages.release }}</span>
        </slot>
        <slot v-else name="pull-before" :progress="progress" :distance="distance">
          <span class="m-pull-to-refresh__indicator" :class="indicatorClass">
            <svg class="maz:absolute maz:inset-0 maz:size-full maz:-rotate-90" viewBox="0 0 36 36" :style="accentStyle">
              <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" :stroke-dasharray="ringLength" :stroke-dashoffset="ringLength * (1 - progress)" />
            </svg>
            <MazIcon :icon="MazArrowDown" :style="{ transform: `rotate(${progress * 180}deg)` }" />
          </span>
          <span>{{ messages.pull }}</span>
        </slot>
      </div>
    </div>

    <span class="maz:sr-only" role="status" aria-live="polite">{{ isRefreshing ? messages.refreshing : '' }}</span>

    <slot />
  </div>
</template>
