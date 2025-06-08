import type { DirectiveBinding, ObjectDirective, Plugin } from 'vue'

type VClosableBindingValueHandler = (event: Event) => any
interface VClosableBindingValueObject {
  handler: VClosableBindingValueHandler
  exclude?: string[]
}

type VClosableBindingValue = VClosableBindingValueObject | VClosableBindingValueHandler

type VClosableBinding = DirectiveBinding<VClosableBindingValue>

const listenerMap = new WeakMap<HTMLElement, (event: TouchEvent | MouseEvent) => void>()

function handleOutsideClick(event: TouchEvent | MouseEvent, element: HTMLElement, binding: VClosableBinding) {
  event.stopPropagation()

  const handler = typeof binding.value === 'function' ? binding.value : binding.value.handler
  const exclude = typeof binding.value === 'object' ? binding.value.exclude : undefined

  let clickedOnExcludedElement = false

  if (exclude && exclude.length > 0) {
    for (const selector of exclude) {
      if (!clickedOnExcludedElement && event.target instanceof HTMLElement) {
        const elementId = document.querySelector(selector)?.getAttribute('id')
        clickedOnExcludedElement = (event.target.getAttribute('id') === elementId || document.querySelector(selector)?.contains(event.target as HTMLElement)) ?? false
      }
    }
  }

  if (!element.contains(event.target as HTMLElement) && !clickedOnExcludedElement) {
    handler?.(event)
  }
}

function getEventType() {
  return document.ontouchstart === null ? 'touchstart' : 'click'
}

function unbind(element: HTMLElement) {
  const eventType = getEventType()
  const listener = listenerMap.get(element)

  if (listener) {
    document.removeEventListener(eventType, listener)
    listenerMap.delete(element)
  }
}

function bind(element: HTMLElement, binding: VClosableBinding) {
  if (
    typeof binding.value !== 'function'
    && typeof binding.value === 'object'
    && typeof binding.value.handler !== 'function'
  ) {
    console.error('[maz-ui](vClosable) v-closable directive requires a handler function')
    return
  }

  const eventType = getEventType()
  const listener = (event: TouchEvent | MouseEvent) => handleOutsideClick(event, element, binding)

  listenerMap.set(element, listener)
  document.addEventListener(eventType, listener)
}

const directive = {
  mounted: bind,
  unmounted: unbind,
} satisfies ObjectDirective<HTMLElement, VClosableBindingValue>

const plugin = {
  install: (app) => {
    app.directive('closable', directive)
  },
} satisfies Plugin

export { directive as vClosable, type VClosableBindingValue, plugin as vClosableInstall }
