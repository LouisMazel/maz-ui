import type { DirectiveBinding, ObjectDirective, Plugin } from 'vue'
import { injectStyles } from '../utils/effects.ts'
import { PRESS_CSS } from '../utils/effectsStyles.ts'

export interface VPressOptions {
  /**
   * Scale of the element while it is pressed (between 0 and 1)
   * @default 0.97
   */
  scale?: number
}

/** The options, `true` for the defaults, or `false` to turn the feedback off */
export type VPressBindingValue = VPressOptions | boolean | undefined

const DEFAULT_SCALE = 0.97
const PRESSED = 'data-maz-pressed'
const KEYS = new Set(['Enter', ' '])

interface State {
  cleanup: () => void
}

const states = new WeakMap<HTMLElement, State>()

function isDisabled(element: HTMLElement) {
  return (element as HTMLButtonElement).disabled === true || element.getAttribute('aria-disabled') === 'true'
}

function setup(element: HTMLElement, value: VPressBindingValue) {
  teardown(element)

  if (value === false)
    return

  injectStyles('press', PRESS_CSS)

  const scale = typeof value === 'object' ? value.scale ?? DEFAULT_SCALE : DEFAULT_SCALE

  element.setAttribute('data-maz-press', '')
  element.style.setProperty('--maz-press-scale', String(scale))

  const press = () => {
    if (!isDisabled(element))
      element.setAttribute(PRESSED, '')
  }
  const release = () => element.removeAttribute(PRESSED)
  const onKeyDown = (event: KeyboardEvent) => {
    if (KEYS.has(event.key) && !event.repeat)
      press()
  }
  const onKeyUp = (event: KeyboardEvent) => {
    if (KEYS.has(event.key))
      release()
  }

  element.addEventListener('pointerdown', press)
  element.addEventListener('keydown', onKeyDown)
  element.addEventListener('keyup', onKeyUp)
  element.addEventListener('blur', release)
  element.addEventListener('pointerup', release)
  element.addEventListener('pointerleave', release)
  element.addEventListener('pointercancel', release)

  states.set(element, {
    cleanup: () => {
      element.removeEventListener('pointerdown', press)
      element.removeEventListener('keydown', onKeyDown)
      element.removeEventListener('keyup', onKeyUp)
      element.removeEventListener('blur', release)
      element.removeEventListener('pointerup', release)
      element.removeEventListener('pointerleave', release)
      element.removeEventListener('pointercancel', release)
      element.removeAttribute('data-maz-press')
      element.removeAttribute(PRESSED)
      element.style.removeProperty('--maz-press-scale')
    },
  })
}

function teardown(element: HTMLElement) {
  states.get(element)?.cleanup()
  states.delete(element)
}

export type VPressDirective = ObjectDirective<HTMLElement, VPressBindingValue>

const directive: VPressDirective = {
  mounted: (el, binding: DirectiveBinding<VPressBindingValue>) => setup(el, binding.value),
  updated: (el, binding) => {
    if (JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue))
      setup(el, binding.value)
  },
  unmounted: teardown,
}

const plugin: Plugin = {
  install: (app) => {
    app.directive('press', directive)
  },
}

export {
  directive as vPress,
  plugin as vPressInstall,
}

declare module 'vue' {
  interface GlobalDirectives {
    vPress: VPressDirective
  }
}
