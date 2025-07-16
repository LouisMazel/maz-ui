import type { ObjectDirective } from 'vue'
import type { VFullscreenImgBindingValue } from './fullscreen-img.handler'
import { FullscreenImgHandler } from './fullscreen-img.handler'

let instance: FullscreenImgHandler

export type VFullscreenImgDirective = ObjectDirective<HTMLElement, VFullscreenImgBindingValue>

const directive: VFullscreenImgDirective = {
  mounted(el: HTMLElement, binding) {
    instance = new FullscreenImgHandler()
    return instance.create(el, binding)
  },
  updated(el: HTMLElement, binding) {
    return instance.update(el, binding)
  },
  unmounted(el: HTMLElement) {
    return instance.remove(el)
  },
}

export { directive as vFullscreenImg }
