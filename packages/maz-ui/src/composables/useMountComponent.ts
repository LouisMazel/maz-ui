import type { App, Component, VNodeProps } from 'vue'
import { createVNode, render } from 'vue'

export function useMountComponent<T extends Component | string, P = Record<string, unknown>>(
  component: T | string,
  options?: {
    props?: P & VNodeProps
    children?: Parameters<typeof createVNode>[2]
    app?: App
    element?: HTMLElement
    noRender?: boolean
  },
) {
  const el = options?.element ?? document.createElement('div')

  function destroy() {
    if (el) {
      render(null, el)
    }
  }

  const props = { ...options?.props, destroy }

  const vNode = createVNode(
    component,
    props,
    options?.children,
  )

  if (options?.app) {
    vNode.appContext = options.app._context
  }

  if (!options?.noRender) {
    render(vNode, el)
  }

  return { vNode, destroy, el }
}
