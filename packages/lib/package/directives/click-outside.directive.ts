import { Directive, DirectiveBinding, Plugin } from 'vue'

const UNIQUE_ID = '__vue_click_away__'

const getEventType = () => {
  return document.ontouchstart !== null ? 'click' : 'touchstart'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onMounted = (el: any, binding: DirectiveBinding) => {
  onUnmounted(el)

  const vm = binding.instance
  const callback = binding.value

  let nextTick = false
  setTimeout(() => {
    nextTick = true
  }, 0)

  el[UNIQUE_ID] = (event: Event) => {
    if (
      (!el || !el.contains(event.target)) &&
      callback &&
      nextTick &&
      typeof callback === 'function'
    ) {
      return callback.call(vm, event)
    }
  }

  const eventType = getEventType()

  document.addEventListener(eventType, el[UNIQUE_ID], false)
}

const onUnmounted = (el: HTMLElement) => {
  const eventType = getEventType()
  document.removeEventListener(eventType, el[UNIQUE_ID], false)
  delete el[UNIQUE_ID]
}

const onUpdated = (el: HTMLElement, binding: DirectiveBinding) => {
  if (binding.value === binding.oldValue) {
    return
  }
  onMounted(el, binding)
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
  install: (app) => {
    app.directive('click-outside', directive)
  },
}

export {
  plugin as vClickOutsideInstall,
  directive as vClickOutside,
  mixin as vClickOutsideMixin,
}
