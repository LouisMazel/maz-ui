import type { DirectiveBinding, ObjectDirective, Plugin } from 'vue'
import type { Smoother } from '../utils/effects.ts'
import { canHover, createSmoother, isMotionReduced } from '../utils/effects.ts'
import { observeIntersection } from '../utils/reveal.ts'

export interface VMagneticOptions {
  /**
   * How far the element follows the pointer, as a ratio of the distance between the pointer and its center (0 to 1)
   * @default 0.3
   */
  strength?: number
  /**
   * Distance in pixels around the element where the pointer attracts it
   * @default 80
   */
  radius?: number
}

/** The options, `true` for the defaults, or `false` to turn the effect off */
export type VMagneticBindingValue = VMagneticOptions | boolean | undefined

interface State {
  cleanup: () => void
}

const states = new WeakMap<HTMLElement, State>()

function setup(element: HTMLElement, value: VMagneticBindingValue) {
  teardown(element)

  if (value === false || !canHover())
    return

  const options = typeof value === 'object' ? value : {}
  const strength = options.strength ?? 0.3
  const radius = options.radius ?? 80
  let offset = [0, 0]

  const smoother: Smoother = createSmoother((values) => {
    offset = values
    element.style.translate = values[0] === 0 && values[1] === 0 ? '' : `${values[0]!.toFixed(2)}px ${values[1]!.toFixed(2)}px`
  }, { damping: 0.18, epsilon: 0.05 })

  const reset = () => smoother.set([0, 0])

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || isMotionReduced())
      return reset()

    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2 - offset[0]!
    const centerY = rect.top + rect.height / 2 - offset[1]!
    const dx = event.clientX - centerX
    const dy = event.clientY - centerY
    const outsideX = Math.max(Math.abs(dx) - rect.width / 2, 0)
    const outsideY = Math.max(Math.abs(dy) - rect.height / 2, 0)

    if (Math.hypot(outsideX, outsideY) > radius)
      return reset()

    smoother.set([dx * strength, dy * strength])
  }

  let stopListening: (() => void) | undefined

  const listen = () => {
    globalThis.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    stopListening = () => {
      globalThis.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', reset)
      stopListening = undefined
    }
  }

  const stopObserving = observeIntersection(element, (entry) => {
    if (entry.isIntersecting) {
      if (!stopListening)
        listen()
    }
    else {
      stopListening?.()
      smoother.reset()
      offset = [0, 0]
      element.style.translate = ''
    }
  }, { threshold: 0 })

  states.set(element, {
    cleanup: () => {
      stopObserving()
      stopListening?.()
      smoother.stop()
      element.style.translate = ''
    },
  })
}

function teardown(element: HTMLElement) {
  states.get(element)?.cleanup()
  states.delete(element)
}

export type VMagneticDirective = ObjectDirective<HTMLElement, VMagneticBindingValue>

const directive: VMagneticDirective = {
  mounted: (el, binding: DirectiveBinding<VMagneticBindingValue>) => setup(el, binding.value),
  updated: (el, binding) => {
    if (JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue))
      setup(el, binding.value)
  },
  unmounted: teardown,
}

const plugin: Plugin = {
  install: (app) => {
    app.directive('magnetic', directive)
  },
}

export {
  directive as vMagnetic,
  plugin as vMagneticInstall,
}

declare module 'vue' {
  interface GlobalDirectives {
    vMagnetic: VMagneticDirective
  }
}
