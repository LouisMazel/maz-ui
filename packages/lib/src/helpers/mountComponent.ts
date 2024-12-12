import { type App, type Component, createVNode, render, type VNodeProps } from 'vue'

export function mount<T extends Component, P = Record<string, unknown>>(
  component: T,
  options?: {
    props?: P & VNodeProps
    children?: Parameters<typeof createVNode>[2]
    app?: App
    element?: HTMLElement
    addDestroyInProps?: boolean
  },
) {
  let el = options?.element

  function destroy() {
    if (el)
      render(null, el)
  }

  const props = { ...options?.props, ...(options?.addDestroyInProps ? { destroy } : {}) }

  const vNode = createVNode(
    component,
    props,
    options?.children,
  )

  if (options?.app) {
    vNode.appContext = options.app._context

    if (el) {
      render(vNode, el)
    }
    else if (typeof document !== 'undefined') {
      el = document.createElement('div')
      render(vNode, el)
    }
  }
  else {
    el = el ?? document.body
    render(vNode, el)
  }

  return { vNode, destroy, el }
}
