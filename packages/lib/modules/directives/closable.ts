import type {
  DirectiveHook,
  DirectiveBinding,
  FunctionDirective,
  ObjectDirective,
  Plugin,
} from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type vClosableBindingValueHandler = (...args: any[]) => any
type vClosableBindingValueObject = {
  handler: vClosableBindingValueHandler
  exclude?: string[]
}

type vClosableBindingValue = vClosableBindingValueObject | vClosableBindingValueHandler

type vClosableBinding = DirectiveBinding<vClosableBindingValue>

const handleOutsideClick = (
  event: TouchEvent | MouseEvent,
  element: HTMLElement,
  binding: vClosableBinding,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vnode: any,
) => {
  event.stopPropagation()

  const handler = typeof binding.value === 'function' ? binding.value : binding.value.handler

  const exclude = typeof binding.value === 'object' ? binding.value.exclude : undefined

  let clickedOnExcludedElement = false
  if (exclude && exclude.length > 0) {
    for (const referenceName of exclude) {
      if (!clickedOnExcludedElement) {
        const excludedElement = vnode.context.$refs[referenceName]
        clickedOnExcludedElement = excludedElement.contains(event.target)
      }
    }
  }

  if (!element.contains(event.target as HTMLElement) && !clickedOnExcludedElement) {
    handler?.()
  }
}

function getEventType() {
  return document.ontouchstart === null ? 'touchstart' : 'click'
}

const unbind = ((element: HTMLElement, binding: vClosableBinding, vnode) => {
  const eventType = getEventType()

  /* eslint-disable unicorn/no-invalid-remove-event-listener */
  document.removeEventListener(eventType, (event) =>
    handleOutsideClick(event, element, binding, vnode),
  )
  /* eslint-enable unicorn/no-invalid-remove-event-listener */
}) satisfies FunctionDirective

const bind = ((element: HTMLElement, binding: vClosableBinding, vnode) => {
  if (
    typeof binding.value !== 'function' &&
    typeof binding.value === 'object' &&
    typeof binding.value.handler !== 'function'
  ) {
    console.error('[maz-ui](vClosable) v-closable directive requires a handler function')
    return
  }

  const eventType = getEventType()
  document.addEventListener(eventType, (event) =>
    handleOutsideClick(event, element, binding, vnode),
  )
}) satisfies DirectiveHook

const directive = {
  mounted: bind,
  unmounted: unbind,
} satisfies ObjectDirective<HTMLElement, vClosableBindingValue>

const plugin = {
  install: (app) => {
    app.directive('closable', directive)
  },
} satisfies Plugin

export { directive as vClosable, plugin as vClosableInstall, vClosableBindingValue }
