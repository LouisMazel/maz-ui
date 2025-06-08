import type { ObjectDirective } from 'vue'
import type { VFullscreenImgBindingValue } from './fullscreen-img.handler'
import { FullscreenImgHandler } from './fullscreen-img.handler'

let instance: FullscreenImgHandler

const directive = {
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
} satisfies ObjectDirective<HTMLElement, VFullscreenImgBindingValue>

export { directive as vFullscreenImg }
