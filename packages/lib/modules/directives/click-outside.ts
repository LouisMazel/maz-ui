import { type Directive, type DirectiveBinding, type Plugin, type App, nextTick } from 'vue'

const UNIQUE_ID = '__maz-click-outside__'

const getEventType = () => {
  return document.ontouchstart === null ? 'touchstart' : 'click'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onMounted(el: HTMLElement, binding: DirectiveBinding) {
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
        (!el || (event.target && !el.contains(event.target as Node))) &&
        callback &&
        isCallbackFunction
      ) {
        return callback.call(vm, event)
      }
    }

    const eventType = getEventType()

    document.addEventListener(eventType, el[UNIQUE_ID], { passive: true })
  } catch (error) {
    console.error('[maz-ui](vClickOutside)', error)
  }
}

function onUnmounted(el: HTMLElement) {
  try {
    const eventType = getEventType()
    document.removeEventListener(eventType, el[UNIQUE_ID], false)
    delete el[UNIQUE_ID]
  } catch (error) {
    console.error('[maz-ui](vClickOutside)', error)
  }
}

function onUpdated(el: HTMLElement, binding: DirectiveBinding) {
  try {
    if (binding.value === binding.oldValue) {
      return
    }
    onMounted(el, binding)
  } catch (error) {
    console.error('[maz-ui](vClickOutside)', error)
  }
}

const directive: Directive = {
  mounted: onMounted,
  updated: onUpdated,
  unmounted: onUnmounted,
}

const mixin = {
  directives: { ClickAway: directive },
}

export { directive, mixin }

const plugin: Plugin = {
  install: (app: App) => {
    app.directive('click-outside', directive)
  },
}

export { plugin as vClickOutsideInstall, directive as vClickOutside, mixin as vClickOutsideMixin }
