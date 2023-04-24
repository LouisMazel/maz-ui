import type { App, Directive, DirectiveBinding, FunctionDirective, Plugin } from 'vue'

const handleOutsideClick = (
  event: TouchEvent | MouseEvent,
  element: HTMLElement,
  binding: DirectiveBinding,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vnode: any,
) => {
  event.stopPropagation()

  const { handler, exclude } = binding.value

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
    vnode.context[handler]()
  }
}

const getEventType = () => {
  return document.ontouchstart === null ? 'touchstart' : 'click'
}

const unbind: FunctionDirective = (element, binding, vnode) => {
  const eventType = getEventType()

  /* eslint-disable unicorn/no-invalid-remove-event-listener */
  document.removeEventListener(eventType, (event) =>
    handleOutsideClick(event, element, binding, vnode),
  )
  /* eslint-enable unicorn/no-invalid-remove-event-listener */
}

const bind: FunctionDirective = (element, binding, vnode) => {
  const eventType = getEventType()
  document.addEventListener(eventType, (event) =>
    handleOutsideClick(event, element, binding, vnode),
  )
}

const directive: Directive = {
  mounted: bind,
  unmounted: unbind,
}

const plugin: Plugin = {
  install: (app: App) => {
    app.directive('closable', directive)
  },
}

export { directive as vClosable, plugin as vClosableInstall }
