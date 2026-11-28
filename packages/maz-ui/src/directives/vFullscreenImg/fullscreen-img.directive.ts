import type { ObjectDirective } from 'vue'
import type { VFullscreenImgBindingValue } from './fullscreen-img.handler.ts'
import { FullscreenImgHandler } from './fullscreen-img.handler.ts'

/**
 * One handler per element: its options and its listeners stay its own
 */
const handlers = new WeakMap<HTMLElement, FullscreenImgHandler>()

export type VFullscreenImgDirective = ObjectDirective<HTMLElement, VFullscreenImgBindingValue>

const directive: VFullscreenImgDirective = {
  mounted(el: HTMLElement, binding) {
    const handler = new FullscreenImgHandler()
    handlers.set(el, handler)
    return handler.create(el, binding)
  },
  updated(el: HTMLElement, binding) {
    return handlers.get(el)?.update(el, binding)
  },
  unmounted(el: HTMLElement) {
    handlers.get(el)?.remove(el)
    handlers.delete(el)
  },
}

export { directive as vFullscreenImg }
