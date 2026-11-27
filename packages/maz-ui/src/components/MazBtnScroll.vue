<script lang="ts" setup generic="_T">
import type { CSSProperties } from 'vue'
import type { MazIconLike } from '../composables/useMazIconProps.ts'
import type { ScrollTarget } from '../composables/useScroll.ts'
import type { MazColor, MazNeutralColor, MazRoundedSize, MazSize } from './types.ts'
import { MazArrowDown } from '@maz-ui/icons/raw/MazArrowDown'
import { MazArrowUp } from '@maz-ui/icons/raw/MazArrowUp'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { computed } from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useScroll } from '../composables/useScroll.ts'
import MazBtn from './MazBtn.vue'

export type MazBtnScrollPosition = 'bottom-end' | 'bottom-start' | 'bottom-center'
export type MazBtnScrollTo = 'top' | 'bottom'
export type MazBtnScrollProgressColor = Exclude<MazColor, 'transparent'>

export interface MazBtnScrollProps {
  /**
   * Where the button scrolls: `top` (back to top) or `bottom` (a chat, logs)
   * @values `'top' | 'bottom'`
   * @default top
   */
  to?: MazBtnScrollTo
  /**
   * Distance in pixels from the start (`to="top"`) or from the end (`to="bottom"`) after which the button appears
   * @default 400
   */
  threshold?: number
  /**
   * Shows or hides the button yourself, instead of the `threshold`
   */
  visible?: boolean
  /**
   * Scrollable element to watch and scroll back: the page by default.
   * With an element, the button is placed in its nearest positioned parent (`absolute`), not on the screen:
   * wrap the element in a `relative` container and put the button in it.
   */
  target?: ScrollTarget
  /**
   * Corner where the button is placed, of the screen or of the positioned parent with an element `target` (`end` is the right in LTR, the left in RTL)
   * @values `'bottom-end' | 'bottom-start' | 'bottom-center'`
   * @default bottom-end
   */
  position?: MazBtnScrollPosition
  /**
   * Distance between the button and the edges of the screen (any CSS length)
   * @default 1.5rem
   */
  offset?: string
  /**
   * Shows the scroll progress as a ring around the button
   * @default true
   */
  progress?: boolean
  /**
   * Color of the progress ring
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast'`
   * @default primary
   */
  progressColor?: MazBtnScrollProgressColor
  /**
   * Color of the button
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast' | 'transparent' | 'surface' | 'container'`
   * @default contrast
   */
  color?: MazColor | MazNeutralColor
  /**
   * Size of the button
   * @values `'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
   * @default md
   */
  size?: MazSize
  /**
   * Radius of the button
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   * @default full
   */
  roundedSize?: MazRoundedSize
  /**
   * Icon of the button: a name, a component or a raw SVG
   * @default MazArrowUp (`to="top"`), MazArrowDown (`to="bottom"`)
   */
  icon?: MazIconLike
  /**
   * Scroll behavior
   * @values `'smooth' | 'instant' | 'auto'`
   * @default smooth
   */
  behavior?: ScrollBehavior
  /** Accessible label of the button (translated "Back to top" or "Scroll to bottom" by default) */
  label?: string
  /**
   * Adds a border of the divider color to the button: on a background of the same color as the button
   * @default false
   */
  bordered?: boolean
}

const {
  to = 'top',
  threshold = 400,
  visible = undefined,
  target,
  position = 'bottom-end',
  offset = '1.5rem',
  progress = true,
  progressColor = 'primary',
  color = 'contrast',
  bordered = false,
  icon,
  behavior = 'smooth',
  label,
} = defineProps<MazBtnScrollProps>()

const emits = defineEmits<{
  /**
   * Emitted when the button is clicked, before the scroll: `event.preventDefault()` cancels the scroll, to scroll yourself
   * @property {MouseEvent} event the click event
   */
  click: [event: MouseEvent]
}>()

const { t } = useTranslations()

const { size, roundedSize } = useGlobalConfig<{ size: MazSize, roundedSize: MazRoundedSize }>('MazBtnScroll', { size: 'md', roundedSize: 'full' })

const { y, scrollToTop, scrollToBottom } = useScroll(() => target === undefined && isClient() ? globalThis.window : target)

/** The scrollable element of `target`, `undefined` for the page */
const targetElement = computed(() => {
  if (!target || 'scrollY' in target || target instanceof Document)
    return undefined

  return '$el' in target ? target.$el as HTMLElement : target
})

function scrollHeight() {
  if (!isClient())
    return 0

  if (targetElement.value)
    return targetElement.value.scrollHeight - targetElement.value.clientHeight

  return document.documentElement.scrollHeight - window.innerHeight
}

const isVisible = computed(() => {
  if (visible !== undefined)
    return visible

  return to === 'top'
    ? y.value > threshold
    : scrollHeight() - y.value > threshold
})

const percentage = computed(() => {
  if (!progress || !isVisible.value)
    return 0

  const max = scrollHeight()

  return max > 0 ? Math.min(100, Math.round(y.value / max * 100)) : 100
})

const resolvedIcon = computed(() => icon ?? (to === 'top' ? MazArrowUp : MazArrowDown))
const resolvedLabel = computed(() => label ?? t(to === 'top' ? 'btnScroll.top' : 'btnScroll.bottom'))

const POSITION_CLASS = {
  'bottom-end': 'maz:end-(--m-btn-scroll-offset)',
  'bottom-start': 'maz:start-(--m-btn-scroll-offset)',
  'bottom-center': 'maz:start-1/2 maz:-translate-x-1/2 maz:rtl:translate-x-1/2',
} as const satisfies Record<MazBtnScrollPosition, string>

const style = computed<CSSProperties>(() => ({
  '--m-btn-scroll-offset': offset,
  '--m-btn-scroll-progress': `${percentage.value}%`,
  '--m-btn-scroll-progress-color': `var(--maz-${progressColor})`,
}))

function onClick(event: MouseEvent) {
  emits('click', event)

  if (event.defaultPrevented)
    return

  if (to === 'top')
    scrollToTop(behavior)
  else
    scrollToBottom(behavior)
}
</script>

<template>
  <Transition name="m-btn-scroll">
    <div
      v-if="isVisible"
      class="m-btn-scroll m-reset-css maz:bottom-(--m-btn-scroll-offset) maz:inline-flex"
      :class="[POSITION_CLASS[position], targetElement ? 'maz:absolute maz:z-10' : 'maz:fixed maz:z-40', { '--progress': progress }]"
      :style
    >
      <span
        class="m-btn-scroll__ring maz:inline-flex"
        :class="roundedSize === 'full' ? 'maz:rounded-full' : 'maz:rounded-lg'"
      >
        <MazBtn
          fab
          :icon="resolvedIcon"
          :color
          :size
          :rounded-size
          :aria-label="resolvedLabel"
          class="maz:shadow-elevation"
          :class="{ 'maz:border-divider!': bordered }"
          @click="onClick"
        />
      </span>
    </div>
  </Transition>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-btn-scroll.--progress .m-btn-scroll__ring {
  padding: 3px;
  background: conic-gradient(var(--m-btn-scroll-progress-color) var(--m-btn-scroll-progress), var(--maz-divider) 0);
  transition: background 100ms linear;
}

.m-btn-scroll-enter-active,
.m-btn-scroll-leave-active {
  transition:
    opacity 250ms ease-in-out,
    transform 250ms ease-in-out;
}

.m-btn-scroll-enter-from,
.m-btn-scroll-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
