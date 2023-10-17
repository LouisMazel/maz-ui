import { type App, type Component, createVNode, render } from 'vue'

export function mount(
  component: Component,
  options?: {
    props?: Record<string, unknown>
    children?: unknown
    app?: App
    element?: HTMLElement
    addDestroyInProps?: boolean
  },
) {
  let el = options?.element

  function destroy() {
    if (el) render(null, el)
  }

  const vNode = createVNode(
    component,
    { ...options?.props, ...(options?.addDestroyInProps ? { destroy } : {}) },
    options?.children,
  )

  if (options?.app) {
    vNode.appContext = options.app._context

    if (el) {
      render(vNode, el)
    } else if (typeof document !== 'undefined') {
      el = document.createElement('div')
      render(vNode, el)
    }
  } else {
    el = el ?? document.body
    render(vNode, el)
  }

  return { vNode, destroy, el }
}
