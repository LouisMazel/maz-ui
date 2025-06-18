import type { DirectiveBinding, ObjectDirective, Plugin } from 'vue'
import { nextTick } from 'vue'

const eventHandlers = new WeakMap<HTMLElement, (event: Event) => void>()

function getEventType() {
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
}

/**
 * The value of the v-click-outside directive.
 */
type vClickOutsideBindingValue
  = | ((...args: any[]) => any)
    | VClickOutsideOptions

/**
 * The binding of the v-click-outside directive.
 */
type vClickOutsideDirectiveBinding = DirectiveBinding<vClickOutsideBindingValue>

function isOptionsObject(value: vClickOutsideBindingValue): value is VClickOutsideOptions {
  return typeof value === 'object' && value !== null && 'callback' in value
}

function getOptionsFromBinding(binding: vClickOutsideDirectiveBinding): VClickOutsideOptions {
  const value = binding.value

  if (isOptionsObject(value)) {
    return {
      ignore: [],
      capture: false,
      once: false,
      ...value,
    }
  }

  return {
    callback: value,
    ignore: [],
    capture: false,
    once: false,
  }
}

function shouldIgnoreElement(target: Element, ignoreSelectors: string[]): boolean {
  return ignoreSelectors.some((selector) => {
    try {
      return target.closest(selector) !== null
    }
    catch {
      return false
    }
  })
}

async function onMounted(el: HTMLElement, binding: vClickOutsideDirectiveBinding) {
  try {
    onUnmounted(el)

    const vm = binding.instance
    const options = getOptionsFromBinding(binding)
    const { callback, ignore = [], capture = false, once = false } = options

    const isCallbackFunction = typeof callback === 'function'

    if (!isCallbackFunction) {
      throw new Error('[maz-ui](vClickOutside) the callback should be a function')
    }

    await nextTick()

    const eventHandler = (event: Event) => {
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

const directive = {
  mounted: onMounted,
  updated: onUpdated,
  unmounted: onUnmounted,
} satisfies ObjectDirective<HTMLElement, vClickOutsideBindingValue>

const plugin = {
  install: (app) => {
    app.directive('click-outside', directive)
  },
} satisfies Plugin

export {
  directive as vClickOutside,
  type vClickOutsideBindingValue,
  plugin as vClickOutsideInstall,
  type VClickOutsideOptions,
}
