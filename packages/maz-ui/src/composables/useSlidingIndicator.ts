import type { ComponentPublicInstance, CSSProperties, MaybeRefOrGetter } from 'vue'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { computed, getCurrentInstance, nextTick, onMounted, onScopeDispose, ref, toValue, watch } from 'vue'
import { useMutationObserver } from './useMutationObserver.ts'
import { useReducedMotion } from './useReducedMotion.ts'
import { useResizeObserver } from './useResizeObserver.ts'

export type SlidingIndicatorOrientation = 'horizontal' | 'vertical'

type IndicatorTarget = HTMLElement | ComponentPublicInstance | null | undefined

export interface UseSlidingIndicatorOptions {
  /**
   * Element that contains the items and the indicator (it should be positioned)
   */
  container: MaybeRefOrGetter<IndicatorTarget>
  /**
   * Active element the indicator follows: a ref, a getter or an element
   */
  active: MaybeRefOrGetter<IndicatorTarget>
  /**
   * Direction of the items
   * @values `'horizontal' | 'vertical'`
   * @default 'horizontal'
   */
  orientation?: SlidingIndicatorOrientation
  /**
   * The indicator stretches toward the target, then shrinks, like a drop of ink
   * @default false
   */
  stretch?: MaybeRefOrGetter<boolean>
  /**
   * Animates the moves of the indicator (never the first placement)
   * @default true
   */
  animated?: MaybeRefOrGetter<boolean | undefined>
}

const STRETCH_DELAY = 120

interface IndicatorBox {
  x: number
  y: number
  width: number
  height: number
}

function toElement(value: IndicatorTarget): HTMLElement | undefined {
  if (!value)
    return undefined

  return ('$el' in value
    ? value.$el
    : value) as HTMLElement
}

function measure(container: HTMLElement, element: HTMLElement): IndicatorBox {
  const containerRect = container.getBoundingClientRect()
  const rect = element.getBoundingClientRect()
  const isRtl = globalThis.getComputedStyle(container).direction === 'rtl'

  const y = rect.top - containerRect.top - container.clientTop + container.scrollTop

  if (isRtl) {
    const borderEnd = container.offsetWidth - container.clientWidth - container.clientLeft
    const fromEnd = containerRect.right - borderEnd - rect.right - container.scrollLeft

    return { x: -fromEnd, y, width: rect.width, height: rect.height }
  }

  return {
    x: rect.left - containerRect.left - container.clientLeft + container.scrollLeft,
    y,
    width: rect.width,
    height: rect.height,
  }
}

/**
 * Style of an indicator (a pill or a line) that follows the active element inside a container: tabs, segmented
 * controls, pagination, menus. The indicator is absolutely positioned at the start of the container
 * (`top: 0` and `inset-inline-start: 0`), the composable gives its `transform`, `width` and `height`.
 * It works in RTL, follows the size of the container and does not animate the first placement nor under reduced motion.
 *
 * @example
 * const container = useTemplateRef('container')
 * const activeTab = computed(() => tabs.value[activeIndex.value])
 * const { style } = useSlidingIndicator({ container, active: activeTab, stretch: true })
 * // <div ref="container" class="relative"><span class="absolute top-0 start-0" :style="style" /></div>
 */
export function useSlidingIndicator(options: UseSlidingIndicatorOptions) {
  const { orientation = 'horizontal', stretch = false, animated = true } = options
  const { shouldReduceMotion } = useReducedMotion()

  const box = ref<IndicatorBox>()
  const isReady = ref(false)
  const hasTransition = ref(false)
  const shouldAnimate = computed(() => toValue(animated) !== false && !shouldReduceMotion.value && hasTransition.value)

  let stretchTimer: ReturnType<typeof setTimeout> | undefined

  function resolveBox(target: IndicatorBox, previous: IndicatorBox | undefined): IndicatorBox {
    if (!toValue(stretch) || !previous || !shouldAnimate.value)
      return target

    const horizontal = orientation === 'horizontal'
    const start = horizontal
      ? 'x'
      : 'y'
    const size = horizontal
      ? 'width'
      : 'height'
    const from = Math.min(previous[start], target[start])
    const to = Math.max(previous[start] + previous[size], target[start] + target[size])

    return { ...target, [start]: from, [size]: to - from }
  }

  function place(withStretch: boolean) {
    clearTimeout(stretchTimer)
    if (!isClient())
      return

    const container = toElement(toValue(options.container))
    const active = toElement(toValue(options.active))

    if (!container || !active) {
      box.value = undefined
      return
    }

    const target = measure(container, active)
    const next = withStretch
      ? resolveBox(target, box.value)
      : target
    const stretched = next !== target

    box.value = next
    isReady.value = true

    if (stretched) {
      stretchTimer = setTimeout(() => {
        box.value = target
      }, STRETCH_DELAY)
    }
  }

  /**
   * Measures the active element again and places the indicator
   */
  function update() {
    place(false)
  }

  watch(() => toElement(toValue(options.active)), async () => {
    await nextTick()
    place(true)
  }, { flush: 'post' })

  useResizeObserver(
    () => toElement(toValue(options.container)),
    () => place(false),
  )
  useResizeObserver(
    () => toElement(toValue(options.active)),
    () => place(false),
  )

  // A change of direction moves the active element without resizing anything
  useMutationObserver(
    () => (isClient() ? document.documentElement : undefined),
    () => place(false),
    { attributes: true, attributeFilter: ['dir'] },
  )

  function enableTransition() {
    if (typeof requestAnimationFrame === 'function')
      requestAnimationFrame(() => (hasTransition.value = true))
    else
      hasTransition.value = true
  }

  async function initialize() {
    await nextTick()
    place(false)
    enableTransition()
  }

  if (getCurrentInstance())
    onMounted(initialize)
  else
    initialize()

  onScopeDispose(() => clearTimeout(stretchTimer))

  const style = computed<CSSProperties>(() => {
    if (!isReady.value || !box.value)
      return { opacity: 0 }

    const { x, y, width, height } = box.value

    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: orientation === 'vertical'
        ? `translate(${x}px, ${y}px)`
        : `translateX(${x}px)`,
      ...(shouldAnimate.value && {
        transitionProperty: 'transform, width, height',
        transitionDuration: 'calc(var(--maz-motion-normal) * var(--maz-motion-scale))',
        transitionTimingFunction: 'var(--maz-easing-spring)',
      }),
    }
  })

  return { style, isReady, shouldAnimate, update }
}
