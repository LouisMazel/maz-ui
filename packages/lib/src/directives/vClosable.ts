import type { DirectiveBinding, ObjectDirective, Plugin } from 'vue'

type vClosableBindingValueHandler = (event: Event) => any
interface vClosableBindingValueObject {
  handler: vClosableBindingValueHandler
  exclude?: string[]
}

type vClosableBindingValue = vClosableBindingValueObject | vClosableBindingValueHandler

type vClosableBinding = DirectiveBinding<vClosableBindingValue>

function handleOutsideClick(event: TouchEvent | MouseEvent, element: HTMLElement, binding: vClosableBinding) {
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

function unbind(element: HTMLElement, binding: vClosableBinding) {
  const eventType = getEventType()

  document.removeEventListener(eventType, event => handleOutsideClick(event, element, binding))
}

function bind(element: HTMLElement, binding: vClosableBinding) {
  if (
    typeof binding.value !== 'function'
    && typeof binding.value === 'object'
    && typeof binding.value.handler !== 'function'
  ) {
    console.error('[maz-ui](vClosable) v-closable directive requires a handler function')
    return
  }

  const eventType = getEventType()
  document.addEventListener(eventType, event => handleOutsideClick(event, element, binding))
}

const directive = {
  mounted: bind,
  unmounted: unbind,
} satisfies ObjectDirective<HTMLElement, vClosableBindingValue>

const plugin = {
  install: (app) => {
    app.directive('closable', directive)
  },
} satisfies Plugin

export { directive as vClosable, type vClosableBindingValue, plugin as vClosableInstall }
