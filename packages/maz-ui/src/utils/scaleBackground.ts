import type { MaybeRefOrGetter } from 'vue'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { onScopeDispose, toValue, watch } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion.ts'

export const SCALE_BACKGROUND_CLASS = 'm-scale-background'

const IGNORED_TAGS = new Set(['SCRIPT', 'STYLE', 'LINK', 'TEMPLATE', 'NOSCRIPT', 'META'])

const SAVED_PROPERTIES = ['transform', 'transformOrigin', 'transition', 'borderRadius', 'overflow', 'willChange'] as const

type SavedProperty = typeof SAVED_PROPERTIES[number]

interface ScaleState {
  count: number
  saved: Record<SavedProperty, string>
  timer?: ReturnType<typeof setTimeout>
}

const states = new WeakMap<HTMLElement, ScaleState>()

function isOverlayRoot(element: Element) {
  return element.classList.contains('m-backdrop')
    || !!element.querySelector(':scope > .m-backdrop')
    || element.hasAttribute('aria-live')
    || element.hasAttribute('popover')
}

/**
 * The element that scales: the one of the `selector`, else the root of the app (`#__nuxt`, `#app`),
 * else the first element of the body that is not a script nor an overlay.
 */
export function resolveScaleBackgroundTarget(selector?: string): HTMLElement | undefined {
  if (!isClient())
    return undefined

  if (selector)
    return document.querySelector<HTMLElement>(selector) ?? undefined

  const root = document.querySelector<HTMLElement>('#__nuxt, #app')

  if (root)
    return root

  return [...document.body.children].find(
    (child): child is HTMLElement => child instanceof HTMLElement && !IGNORED_TAGS.has(child.tagName) && !isOverlayRoot(child),
  )
}

/** Scale of the page when the sheet is fully open: about 16px smaller on each axis on a phone */
export function getScaleBackgroundRatio(viewportWidth: number) {
  return viewportWidth > 0 ? Math.max(0.9, (viewportWidth - 16) / viewportWidth) : 0.96
}

const ENTER_TRANSITION = 'transform calc(var(--maz-motion-slow, 300ms) * var(--maz-motion-scale, 1)) var(--maz-easing-spring, ease-out)'
const EXIT_TRANSITION = 'transform calc(var(--maz-motion-slow, 300ms) * 0.7 * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in)'

export interface UseScaleBackgroundOptions {
  /** Whether the page is scaled (the sheet is open and the option is on) */
  active: MaybeRefOrGetter<boolean>
  /** CSS selector of the element to scale, defaults to the root of the app */
  target?: MaybeRefOrGetter<string | undefined>
  /** How much the page is scaled, from `0` (not at all) to `1` (fully), follows the drag of the sheet */
  progress?: MaybeRefOrGetter<number>
  /** The sheet is dragged: the page follows without transition */
  dragging?: MaybeRefOrGetter<boolean>
}

/**
 * The page behind a sheet scales down slightly with rounded corners (internal, like iOS and Vaul).
 * The styles are inline on the element and restored when the sheet closes. Nothing happens
 * under reduced motion, on the server, or when no element matches.
 */
export function useScaleBackground(options: UseScaleBackgroundOptions) {
  const { shouldReduceMotion } = useReducedMotion()

  let element: HTMLElement | undefined

  function render() {
    if (!element)
      return

    const progress = Math.min(1, Math.max(0, toValue(options.progress) ?? 1))
    const ratio = getScaleBackgroundRatio(window.innerWidth)
    const scale = 1 - (1 - ratio) * progress

    element.style.transition = toValue(options.dragging) ? 'none' : ENTER_TRANSITION
    element.style.transform = `translateY(${(progress * 0.5).toFixed(3)}rem) scale(${scale.toFixed(4)})`
  }

  function restore(target: HTMLElement) {
    const state = states.get(target)

    if (!state)
      return

    state.count -= 1

    if (state.count > 0)
      return

    states.delete(target)

    for (const property of SAVED_PROPERTIES)
      target.style[property] = state.saved[property]

    target.classList.remove(SCALE_BACKGROUND_CLASS)
  }

  function acquire(target: HTMLElement) {
    let state = states.get(target)

    if (state) {
      if (state.timer) {
        clearTimeout(state.timer)
        state.timer = undefined
      }
      else {
        state.count += 1
      }

      return
    }

    state = {
      count: 1,
      saved: Object.fromEntries(SAVED_PROPERTIES.map(property => [property, target.style[property]])) as Record<SavedProperty, string>,
    }

    states.set(target, state)

    target.classList.add(SCALE_BACKGROUND_CLASS)
    target.style.transformOrigin = '50% 0'
    target.style.borderRadius = '0.75rem'
    target.style.overflow = 'hidden'
    target.style.willChange = 'transform'
  }

  function release() {
    const target = element

    if (!target)
      return

    element = undefined

    const state = states.get(target)

    if (!state)
      return

    if (state.count > 1 || shouldReduceMotion.value) {
      restore(target)
      return
    }

    target.style.transition = EXIT_TRANSITION
    target.style.transform = ''

    const duration = Number.parseFloat(getComputedStyle(target).transitionDuration) || 0
    const milliseconds = getComputedStyle(target).transitionDuration.endsWith('ms') ? duration : duration * 1000

    state.timer = setTimeout(() => {
      state.timer = undefined
      restore(target)
    }, milliseconds + 50)
  }

  watch(() => toValue(options.active), (active) => {
    release()

    if (!active || shouldReduceMotion.value)
      return

    const target = resolveScaleBackgroundTarget(toValue(options.target))

    if (!target)
      return

    element = target
    acquire(target)
    target.style.transition = ENTER_TRANSITION
    void target.getBoundingClientRect()
    render()
  }, { flush: 'post', immediate: true })

  watch(() => [toValue(options.progress), toValue(options.dragging)], render, { flush: 'post' })

  onScopeDispose(() => {
    const target = element

    element = undefined

    if (target)
      restore(target)
  })
}
