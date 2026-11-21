---
title: useMountComponent
description: Render a Vue component from JavaScript, outside of any template (a toast, a dialog or a popup opened by a function), with its props, its slots and the context of your app, and destroy it when you are done.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip
For notifications and confirmations, use [useToast](./use-toast) and [useDialog](./use-dialog): they are built on `useMountComponent`.
:::

## Usage

```ts
import { useMountComponent } from 'maz-ui/composables/useMountComponent'
import { getCurrentInstance } from 'vue'
import PromoPopup from './PromoPopup.vue'

const app = getCurrentInstance()?.appContext.app

function openPromo() {
  const { el, destroy } = useMountComponent(PromoPopup, {
    props: {
      title: 'Spring sale',
      onClose: () => {
        destroy()
        el.remove()
      },
    },
    app,
  })

  document.body.appendChild(el)
}
```

The component receives a `destroy` prop: it can unmount itself (`props.destroy()`), for example at the end of its leave animation.

## Where it is rendered

By default, the component is rendered in a new `div` that is **not** in the page: append `el` where you want it (`document.body.appendChild(el)`). Give `element` to render it into an existing element instead.

## App context

Pass the `app` option to give the component the context of your app: its plugins (router, i18n, maz-ui plugins), global components, directives and `provide`. Without it, `useRouter`, `useTranslations`... are not available in the mounted component.

## Options

| Option     | Type                                     | Default        | Description                                                    |
| ---------- | ---------------------------------------- | -------------- | -------------------------------------------------------------- |
| `props`    | `P & VNodeProps`                         | -              | Props of the component, listeners included (`onClose`)        |
| `children` | `Parameters<typeof createVNode>[2]`      | -              | Children of the vnode: slots of a component                   |
| `app`      | `App`                                    | -              | App whose context is given to the component                   |
| `element`  | `HTMLElement`                            | a new `div`    | Element in which the component is rendered                    |
| `noRender` | `boolean`                                | `false`        | Only create the vnode, render it yourself                     |

## Return

| Property  | Type          | Description                                               |
| --------- | ------------- | --------------------------------------------------------- |
| `vNode`   | `VNode`       | The vnode of the component (`vNode.component` once rendered) |
| `el`      | `HTMLElement` | The element in which the component is rendered            |
| `destroy` | `() => void`  | Unmount the component (the element itself stays in place) |

## Types

```ts
function useMountComponent<T extends Component | string, P = Record<string, unknown>>(
  component: T | string,
  options?: {
    props?: P & VNodeProps
    children?: Parameters<typeof createVNode>[2]
    app?: App
    element?: HTMLElement
    noRender?: boolean
  },
): { vNode: VNode, destroy: () => void, el: HTMLElement }
```
