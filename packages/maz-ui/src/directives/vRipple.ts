import type { DirectiveBinding, ObjectDirective, Plugin } from 'vue'
import { canHover, ensurePositioned, injectStyles, isMotionReduced } from '../utils/effects.ts'
import { RIPPLE_CSS } from '../utils/effectsStyles.ts'

export interface VRippleOptions {
  /**
   * `hover`: a fill grows from the point where the pointer enters and empties toward the point where it leaves.
   * `click`: a wave starts from the point of the click
   * @default 'hover'
   */
  mode?: 'hover' | 'click'
  /**
   * Any CSS color
   * @default 'currentColor'
   */
  color?: string
  /**
   * Opacity of the fill, between 0 and 1
   * @default 0.12
   */
  opacity?: number
  /**
   * Duration in milliseconds
   * @default the `--maz-motion-slow` token
   */
  duration?: number
}

/** The mode, the options, or `false` to turn the effect off */
export type VRippleBindingValue = VRippleOptions['mode'] | VRippleOptions | false | undefined

const STATE = 'data-maz-ripple-state'
const VARIABLES = ['--maz-ripple-x', '--maz-ripple-y', '--maz-ripple-out-x', '--maz-ripple-out-y', '--maz-ripple-size', '--maz-ripple-color', '--maz-ripple-opacity', '--maz-ripple-duration']

interface State {
  cleanup: () => void
}

const states = new WeakMap<HTMLElement, State>()

function normalize(value: VRippleBindingValue): VRippleOptions {
  return typeof value === 'string' ? { mode: value } : value || {}
}

function setup(element: HTMLElement, value: VRippleBindingValue) {
  teardown(element)

  if (value === false)
    return

  injectStyles('ripple', RIPPLE_CSS)

  const options = normalize(value)
  const mode = options.mode ?? 'hover'
  const duration = options.duration ?? 300
  const restorePosition = ensurePositioned(element)
  let timer: ReturnType<typeof setTimeout> | undefined

  element.setAttribute('data-maz-ripple', mode)

  if (options.color)
    element.style.setProperty('--maz-ripple-color', options.color)
  if (options.opacity !== undefined)
    element.style.setProperty('--maz-ripple-opacity', String(options.opacity))
  if (options.duration !== undefined)
    element.style.setProperty('--maz-ripple-duration', `${options.duration}ms`)

  const point = (event: PointerEvent | MouseEvent) => {
    const rect = element.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  const reach = (x: number, y: number) => {
    const { width, height } = element.getBoundingClientRect()
    return Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
  }

  const clear = () => {
    clearTimeout(timer)
    element.removeAttribute(STATE)
  }

  const start = (x: number, y: number, state: 'in' | 'wave') => {
    clear()
    element.getBoundingClientRect()
    element.style.setProperty('--maz-ripple-x', `${x}px`)
    element.style.setProperty('--maz-ripple-y', `${y}px`)
    element.style.setProperty('--maz-ripple-size', `${reach(x, y)}px`)
    element.setAttribute(STATE, state)

    if (state === 'wave')
      timer = setTimeout(clear, duration + 50)
  }

  const onEnter = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || !canHover() || isMotionReduced())
      return

    const { x, y } = point(event)
    start(x, y, 'in')
  }

  const onLeave = (event: PointerEvent) => {
    if (element.getAttribute(STATE) !== 'in')
      return

    const { x, y } = point(event)
    element.style.setProperty('--maz-ripple-out-x', `${x}px`)
    element.style.setProperty('--maz-ripple-out-y', `${y}px`)
    element.setAttribute(STATE, 'out')
    clearTimeout(timer)
    timer = setTimeout(clear, duration + 50)
  }

  const onDown = (event: PointerEvent) => {
    if (isMotionReduced())
      return

    const { x, y } = point(event)
    start(x, y, 'wave')
  }

  const onClick = (event: MouseEvent) => {
    if (event.detail === 0 && !isMotionReduced()) {
      const { width, height } = element.getBoundingClientRect()
      start(width / 2, height / 2, 'wave')
    }
  }

  if (mode === 'hover') {
    element.addEventListener('pointerenter', onEnter)
    element.addEventListener('pointerleave', onLeave)
  }
  else {
    element.addEventListener('pointerdown', onDown)
    element.addEventListener('click', onClick)
  }

  states.set(element, {
    cleanup: () => {
      element.removeEventListener('pointerenter', onEnter)
      element.removeEventListener('pointerleave', onLeave)
      element.removeEventListener('pointerdown', onDown)
      element.removeEventListener('click', onClick)
      clear()
      element.removeAttribute('data-maz-ripple')

      for (const name of VARIABLES)
        element.style.removeProperty(name)

      restorePosition()
    },
  })
}

function teardown(element: HTMLElement) {
  states.get(element)?.cleanup()
  states.delete(element)
}

export type VRippleDirective = ObjectDirective<HTMLElement, VRippleBindingValue>

const directive: VRippleDirective = {
  mounted: (el, binding: DirectiveBinding<VRippleBindingValue>) => setup(el, binding.value),
  updated: (el, binding) => {
    if (JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue))
      setup(el, binding.value)
  },
  unmounted: teardown,
}

const plugin: Plugin = {
  install: (app) => {
    app.directive('ripple', directive)
  },
}

export {
  directive as vRipple,
  plugin as vRippleInstall,
}

declare module 'vue' {
  interface GlobalDirectives {
    vRipple: VRippleDirective
  }
}
