import type { DirectiveBinding, ObjectDirective, Plugin } from 'vue'
import { canHover, createSmoother, ensurePositioned, injectStyles, isMotionReduced } from '../utils/effects.ts'
import { TILT_CSS } from '../utils/effectsStyles.ts'
import { observeIntersection } from '../utils/reveal.ts'

export interface VTiltOptions {
  /**
   * Maximum angle in degrees
   * @default 8
   */
  max?: number
  /**
   * Perspective in pixels
   * @default 800
   */
  perspective?: number
  /**
   * Add a light reflection that follows the pointer
   * @default false
   */
  glare?: boolean
  /**
   * Follow the pointer on the whole page instead of the element only
   * @default false
   */
  global?: boolean
  /**
   * Add a slight floating in depth, `true` or the distance in pixels
   * @default false
   */
  float?: boolean | number
  /**
   * Damping of the movement, between 0 (never moves) and 1 (no damping)
   * @default 0.1
   */
  damping?: number
}

/** The options, `true` for the defaults, or `false` to turn the effect off */
export type VTiltBindingValue = VTiltOptions | boolean | undefined

interface State {
  cleanup: () => void
}

const states = new WeakMap<HTMLElement, State>()
const VARIABLES = ['--maz-tilt-rx', '--maz-tilt-ry', '--maz-tilt-perspective', '--maz-tilt-gx', '--maz-tilt-gy', '--maz-tilt-float-distance']
const ATTRIBUTES = ['data-maz-tilt', 'data-maz-tilt-active', 'data-maz-tilt-float', 'data-maz-tilt-idle']

function setup(element: HTMLElement, value: VTiltBindingValue) {
  teardown(element)

  if (value === false)
    return

  injectStyles('tilt', TILT_CSS)

  const options = typeof value === 'object' ? value : {}
  const max = options.max ?? 8
  const damping = options.damping ?? 0.1
  const cleanups: Array<() => void> = []

  element.setAttribute('data-maz-tilt', '')
  element.style.setProperty('--maz-tilt-perspective', `${options.perspective ?? 800}px`)

  const smoother = createSmoother(([rx, ry, gx, gy]) => {
    element.style.setProperty('--maz-tilt-rx', `${rx!.toFixed(2)}deg`)
    element.style.setProperty('--maz-tilt-ry', `${ry!.toFixed(2)}deg`)
    element.style.setProperty('--maz-tilt-gx', `${gx!.toFixed(1)}%`)
    element.style.setProperty('--maz-tilt-gy', `${gy!.toFixed(1)}%`)
  }, { damping, epsilon: 0.02 })

  cleanups.push(() => smoother.reset())

  const aim = (x: number, y: number) => {
    smoother.set([-(y - 0.5) * 2 * max, (x - 0.5) * 2 * max, x * 100, y * 100])
  }

  const rest = () => {
    element.removeAttribute('data-maz-tilt-active')
    smoother.set([0, 0, 50, 50])
  }

  if (options.glare) {
    const restorePosition = ensurePositioned(element)
    const glare = document.createElement('span')

    glare.className = 'm-tilt-glare'
    glare.setAttribute('aria-hidden', 'true')
    element.append(glare)
    cleanups.push(() => {
      glare.remove()
      restorePosition()
    })
  }

  if (options.global) {
    let stopListening: (() => void) | undefined

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || isMotionReduced() || !canHover())
        return

      aim(event.clientX / globalThis.innerWidth, event.clientY / globalThis.innerHeight)
    }

    const stopObserving = observeIntersection(element, (entry) => {
      if (entry.isIntersecting && !stopListening) {
        globalThis.addEventListener('pointermove', onMove, { passive: true })
        document.documentElement.addEventListener('pointerleave', rest)
        stopListening = () => {
          globalThis.removeEventListener('pointermove', onMove)
          document.documentElement.removeEventListener('pointerleave', rest)
          stopListening = undefined
        }
      }
      else if (!entry.isIntersecting) {
        stopListening?.()
        smoother.reset()
      }
    }, { threshold: 0 })

    cleanups.push(stopObserving, () => stopListening?.())
  }
  else {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || isMotionReduced())
        return

      const rect = element.getBoundingClientRect()

      if (rect.width === 0 || rect.height === 0)
        return

      element.setAttribute('data-maz-tilt-active', '')
      aim((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height)
    }

    element.addEventListener('pointermove', onMove)
    element.addEventListener('pointerleave', rest)
    cleanups.push(() => {
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerleave', rest)
    })
  }

  if (options.float) {
    element.setAttribute('data-maz-tilt-float', '')

    if (typeof options.float === 'number')
      element.style.setProperty('--maz-tilt-float-distance', `${options.float}px`)

    const stopFloat = observeIntersection(element, (entry) => {
      if (entry.isIntersecting)
        element.removeAttribute('data-maz-tilt-idle')
      else
        element.setAttribute('data-maz-tilt-idle', '')
    }, { threshold: 0 })

    cleanups.push(stopFloat)
  }

  states.set(element, {
    cleanup: () => {
      for (const cleanup of cleanups)
        cleanup()

      for (const name of ATTRIBUTES)
        element.removeAttribute(name)
      for (const name of VARIABLES)
        element.style.removeProperty(name)
    },
  })
}

function teardown(element: HTMLElement) {
  states.get(element)?.cleanup()
  states.delete(element)
}

export type VTiltDirective = ObjectDirective<HTMLElement, VTiltBindingValue>

const directive: VTiltDirective = {
  mounted: (el, binding: DirectiveBinding<VTiltBindingValue>) => setup(el, binding.value),
  updated: (el, binding) => {
    if (JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue))
      setup(el, binding.value)
  },
  unmounted: teardown,
}

const plugin: Plugin = {
  install: (app) => {
    app.directive('tilt', directive)
  },
}

export {
  directive as vTilt,
  plugin as vTiltInstall,
}

declare module 'vue' {
  interface GlobalDirectives {
    vTilt: VTiltDirective
  }
}
