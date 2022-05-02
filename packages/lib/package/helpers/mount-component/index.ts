import { createVNode, render } from 'vue'
import type { App, Component } from 'vue'

export function mount(
  component: Component,
  {
    props,
    children,
    element,
    app,
  }: {
    props?: Record<string, unknown>
    children?: unknown
    app?: App
    element?: HTMLElement
  } = {
    props: undefined,
  },
) {
  let el = element

  const vNode = createVNode(component, props, children)

  if (app && app._context) vNode.appContext = app._context
  if (el) render(vNode, el)
  else if (typeof document !== 'undefined') {
    render(vNode, (el = document.createElement('div')))
  }

  const destroy = () => {
    if (el) render(null, el)
  }

  return { vNode, destroy, el }
}
