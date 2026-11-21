import type { DirectiveBinding, EffectScope, ObjectDirective, Plugin } from 'vue'
import type { UseIntersectionObserverOptions } from '../composables/useIntersectionObserver.ts'
import { effectScope } from 'vue'
import { useIntersectionObserver } from '../composables/useIntersectionObserver.ts'

/** Called each time the element enters or leaves the viewport */
export type VIntersectHandler = (isIntersecting: boolean, entry: IntersectionObserverEntry) => void

export interface VIntersectOptions extends Omit<UseIntersectionObserverOptions, 'root' | 'immediate'> {
  handler: VIntersectHandler
  /**
   * Element whose box is the viewport of the observation (a scrollable list): the browser viewport by default
   */
  root?: Element | Document | null
}

export type VIntersectBindingValue = VIntersectHandler | VIntersectOptions

type VIntersectBinding = DirectiveBinding<VIntersectBindingValue, 'once'>

interface ObservedElement {
  scope: EffectScope
  /** The handler of the last render: an inline function changes at each render, the observer stays */
  handler: VIntersectHandler
  root?: Element | Document | null
  /** Options that need a new observer when they change */
  key: string
}

const observed = new WeakMap<HTMLElement, ObservedElement>()

function toOptions(binding: VIntersectBinding): VIntersectOptions {
  const options = typeof binding.value === 'function'
    ? { handler: binding.value }
    : binding.value

  if (typeof options?.handler !== 'function')
    throw new TypeError('[maz-ui](vIntersect) the value must be a function or an object with a `handler` function')

  return { ...options, once: options.once ?? !!binding.modifiers.once }
}

function unobserve(el: HTMLElement) {
  observed.get(el)?.scope.stop()
  observed.delete(el)
}

function observe(el: HTMLElement, binding: VIntersectBinding) {
  const { handler, root, ...options } = toOptions(binding)
  const key = JSON.stringify(options)
  const current = observed.get(el)

  if (current && current.key === key && current.root === root) {
    current.handler = handler
    return
  }

  unobserve(el)

  const state: ObservedElement = { scope: effectScope(true), handler, root, key }

  state.scope.run(() => useIntersectionObserver(el, (entries) => {
    const entry = entries.at(-1)

    if (entry)
      state.handler(entry.isIntersecting, entry)
  }, { ...options, root }))

  observed.set(el, state)
}

export type VIntersectDirective = ObjectDirective<HTMLElement, VIntersectBindingValue, 'once'>

const directive: VIntersectDirective = {
  mounted: observe,
  updated: observe,
  unmounted: unobserve,
}

const plugin: Plugin = {
  install: (app) => {
    app.directive('intersect', directive)
  },
}

export {
  directive as vIntersect,
  plugin as vIntersectInstall,
}

declare module 'vue' {
  interface GlobalDirectives {
    vIntersect: VIntersectDirective
  }
}
