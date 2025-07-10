import type { DirectiveBinding, ObjectDirective, Plugin } from 'vue'
import { isServer } from '@maz-ui/utils/src/index.js'
import { nextTick } from 'vue'

const eventHandlers = new WeakMap<HTMLElement, (event: Event) => void>()

function getEventType() {
  if (isServer())
    return 'click'

  return document.ontouchstart === null ? 'touchstart' : 'click'
}

interface VClickOutsideOptions {
  /**
   * The callback function to be called when the element is clicked outside.
   */
  callback: (...args: any[]) => any
  /**
   * The selectors to ignore.
   */
  ignore?: string[]
  /**
   * Whether to capture the event.
   */
  capture?: boolean
  /**
   * Whether to only trigger the callback once.
   */
  once?: boolean
  /**
   * Whether to stop event propagation.
   */
  stopPropagation?: boolean
}

/**
 * The value of the v-click-outside directive.
 */
type VClickOutsideBindingValue
  = | ((...args: any[]) => any)
    | VClickOutsideOptions

/**
 * The binding of the v-click-outside directive.
 */
type vClickOutsideDirectiveBinding = DirectiveBinding<VClickOutsideBindingValue>

function isOptionsObject(value: VClickOutsideBindingValue): value is VClickOutsideOptions {
  return typeof value === 'object' && value !== null && 'callback' in value
}

function getOptionsFromBinding(binding: vClickOutsideDirectiveBinding): VClickOutsideOptions {
  const value = binding.value

  if (isOptionsObject(value)) {
    return {
      ignore: [],
      capture: false,
      once: false,
      stopPropagation: false,
      ...value,
    }
  }

  return {
    callback: value,
    ignore: [],
    capture: false,
    once: false,
    stopPropagation: false,
  }
}

function shouldIgnoreElement(target: Element, ignoreSelectors: string[]): boolean {
  if (isServer())
    return false

  return ignoreSelectors.some((selector) => {
    try {
      // Check if target matches the selector directly
      if (target.matches && target.matches(selector)) {
        return true
      }

      // Check if target is contained within an element matching the selector
      if (target.closest && target.closest(selector) !== null) {
        return true
      }

      // Enhanced exclusion logic from vClosable: check by ID
      const excludedElement = document.querySelector(selector)
      if (excludedElement) {
        const elementId = excludedElement.getAttribute('id')
        if (elementId && target instanceof HTMLElement && target.getAttribute('id') === elementId) {
          return true
        }
        if (excludedElement.contains(target as HTMLElement)) {
          return true
        }
      }

      return false
    }
    catch {
      return false
    }
  })
}

async function onMounted(el: HTMLElement, binding: vClickOutsideDirectiveBinding) {
  if (isServer())
    return

  try {
    onUnmounted(el)

    const vm = binding.instance
    const options = getOptionsFromBinding(binding)
    const { callback, ignore = [], capture = false, once = false, stopPropagation = false } = options

    const isCallbackFunction = typeof callback === 'function'

    if (!isCallbackFunction) {
      throw new Error('[maz-ui](vClickOutside) the callback should be a function')
    }

    await nextTick()

    const eventHandler = (event: Event) => {
      if (stopPropagation) {
        event.stopPropagation()
      }

      const target = event.target as Element

      if (!target || !el) {
        return
      }

      const isOutside = !el.contains(target)
      const shouldIgnore = ignore.length > 0 && shouldIgnoreElement(target, ignore)

      if (isOutside && !shouldIgnore && callback && isCallbackFunction) {
        return callback.call(vm, event)
      }
    }

    eventHandlers.set(el, eventHandler)

    const eventType = getEventType()
    const eventOptions = {
      passive: true,
      capture,
      once,
    }

    document.addEventListener(eventType, eventHandler, eventOptions)
  }
  catch (error) {
    console.error('[maz-ui](vClickOutside)', error)
  }
}

function onUnmounted(el: HTMLElement) {
  if (isServer())
    return

  try {
    const eventHandler = eventHandlers.get(el)

    if (eventHandler) {
      const eventType = getEventType()
      document.removeEventListener(eventType, eventHandler, false)
      eventHandlers.delete(el)
    }
  }
  catch (error) {
    console.error('[maz-ui](vClickOutside)', error)
  }
}

function onUpdated(el: HTMLElement, binding: vClickOutsideDirectiveBinding) {
  try {
    if (binding.value === binding.oldValue) {
      return
    }
    onMounted(el, binding)
  }
  catch (error) {
    console.error('[maz-ui](vClickOutside)', error)
  }
}

export type VClickOutsideDirective = ObjectDirective<HTMLElement, VClickOutsideBindingValue>

const directive: VClickOutsideDirective = {
  mounted: onMounted,
  updated: onUpdated,
  unmounted: onUnmounted,
}

const plugin: Plugin = {
  install: (app) => {
    app.directive('click-outside', directive)
  },
}

export {
  directive as vClickOutside,
  type VClickOutsideBindingValue,
  plugin as vClickOutsideInstall,
  type VClickOutsideOptions,
}

declare module 'vue' {
  interface GlobalDirectives {
    vClickOutside: VClickOutsideDirective
  }
}
