import type { DirectiveBinding, ObjectDirective, Plugin } from 'vue'
import { injectStyles, isMotionReduced } from '../utils/effects.ts'
import { DRAW_CSS } from '../utils/effectsStyles.ts'
import { observeIntersection } from '../utils/reveal.ts'

export interface VDrawOptions {
  /**
   * `enter`: the strokes draw when the SVG enters the screen. `scroll`: the drawing follows the scroll
   * (browsers without `animation-timeline` fall back to `enter`)
   * @default 'enter'
   */
  mode?: 'enter' | 'scroll'
  /**
   * Duration of the drawing of each stroke in milliseconds
   * @default twice the `--maz-motion-slower` token
   */
  duration?: number
  /**
   * Delay in milliseconds between the start of each stroke
   * @default 120
   */
  stagger?: number
  /**
   * Delay before the first stroke, in milliseconds
   * @default 0
   */
  delay?: number
  /**
   * Draw once. When `false`, the SVG is erased when it leaves the screen
   * @default true
   */
  once?: boolean
}

/** The mode, the options, or `false` to turn the effect off */
export type VDrawBindingValue = VDrawOptions['mode'] | VDrawOptions | false | undefined

const SELECTOR = 'path, line, polyline, polygon, circle, ellipse, rect'
const STATE = 'data-maz-draw-state'
const MAX_RANK = 6

interface State {
  cleanup: () => void
}

const states = new WeakMap<HTMLElement, State>()

function normalize(value: VDrawBindingValue): VDrawOptions {
  return typeof value === 'string' ? { mode: value } : value || {}
}

function supportsScrollTimeline() {
  return typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: view()')
}

function getStrokes(element: Element) {
  const strokes: SVGGeometryElement[] = []

  for (const node of element.matches(SELECTOR) ? [element] : element.querySelectorAll(SELECTOR)) {
    const shape = node as SVGGeometryElement
    const stroke = getComputedStyle(shape).stroke

    if (typeof shape.getTotalLength === 'function' && stroke !== 'none')
      strokes.push(shape)
  }

  return strokes
}

function setup(element: HTMLElement, value: VDrawBindingValue) {
  teardown(element)

  if (value === false || isMotionReduced())
    return

  injectStyles('draw', DRAW_CSS)

  const options = normalize(value)
  const scroll = options.mode === 'scroll' && supportsScrollTimeline()
  const strokes = getStrokes(element)

  if (strokes.length === 0)
    return

  const stagger = options.stagger ?? 120

  for (const [index, stroke] of strokes.entries()) {
    stroke.setAttribute('data-maz-draw-stroke', '')
    stroke.style.setProperty('--maz-draw-length', String(Math.ceil(stroke.getTotalLength())))
    stroke.style.setProperty('--maz-i', String(index))
    stroke.style.setProperty('--maz-rank', String(Math.min(index, MAX_RANK)))
  }

  element.style.setProperty('--maz-draw-stagger', `${stagger}ms`)

  if (options.delay !== undefined)
    element.style.setProperty('--maz-draw-delay', `${options.delay}ms`)
  if (options.duration !== undefined)
    element.style.setProperty('--maz-draw-duration', `${options.duration}ms`)

  let stop: (() => void) | undefined

  if (scroll) {
    element.setAttribute('data-maz-draw-mode', 'scroll')
  }
  else {
    element.setAttribute(STATE, 'hidden')
    const once = options.once ?? true

    stop = observeIntersection(element, (entry) => {
      if (entry.isIntersecting) {
        element.setAttribute(STATE, 'in')

        if (once) {
          stop?.()
          stop = undefined
        }
      }
      else if (!once) {
        element.setAttribute(STATE, 'hidden')
      }
    })
  }

  states.set(element, {
    cleanup: () => {
      stop?.()
      element.removeAttribute(STATE)
      element.removeAttribute('data-maz-draw-mode')

      for (const name of ['--maz-draw-stagger', '--maz-draw-delay', '--maz-draw-duration'])
        element.style.removeProperty(name)

      for (const stroke of strokes) {
        stroke.removeAttribute('data-maz-draw-stroke')

        for (const name of ['--maz-draw-length', '--maz-i', '--maz-rank'])
          stroke.style.removeProperty(name)
      }
    },
  })
}

function teardown(element: HTMLElement) {
  states.get(element)?.cleanup()
  states.delete(element)
}

export type VDrawDirective = ObjectDirective<HTMLElement, VDrawBindingValue>

const directive: VDrawDirective = {
  mounted: (el, binding: DirectiveBinding<VDrawBindingValue>) => setup(el, binding.value),
  updated: (el, binding) => {
    if (JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue))
      setup(el, binding.value)
  },
  unmounted: teardown,
}

const plugin: Plugin = {
  install: (app) => {
    app.directive('draw', directive)
  },
}

export {
  directive as vDraw,
  plugin as vDrawInstall,
}

declare module 'vue' {
  interface GlobalDirectives {
    vDraw: VDrawDirective
  }
}
