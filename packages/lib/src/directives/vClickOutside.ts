import type { DirectiveBinding, ObjectDirective, Plugin } from 'vue'
import { nextTick } from 'vue'

const UNIQUE_ID = '__maz-click-outside__' as const

function getEventType() {
  return document.ontouchstart === null ? 'touchstart' : 'click'
}

type vClickOutsideBindingValue = (...args: any[]) => any

type vClickOutsideDirectiveBinding = DirectiveBinding<vClickOutsideBindingValue>

async function onMounted(el: HTMLElement, binding: vClickOutsideDirectiveBinding) {
  try {
    onUnmounted(el)

    const vm = binding.instance
    const callback = binding.value

    const isCallbackFunction = typeof callback === 'function'

    if (!isCallbackFunction) {
      throw new Error('[maz-ui](vClickOutside) the callback should be a function')
    }

    await nextTick()

    el[UNIQUE_ID] = (event: Event) => {
      if (
        (!el || (event.target && !el.contains(event.target as Node)))
        && callback
        && isCallbackFunction
      ) {
        return callback.call(vm, event)
      }
    }

    const eventType = getEventType()

    document.addEventListener(eventType, el[UNIQUE_ID], { passive: true })
  }
  catch (error) {
    console.error('[maz-ui](vClickOutside)', error)
  }
}

function onUnmounted(el: HTMLElement) {
  try {
    const eventType = getEventType()
    document.removeEventListener(eventType, el[UNIQUE_ID], false)
    delete el[UNIQUE_ID]
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

export { directive as vClickOutside, type vClickOutsideBindingValue, plugin as vClickOutsideInstall }
