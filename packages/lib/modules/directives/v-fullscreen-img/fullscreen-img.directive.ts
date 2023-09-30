import type { ObjectDirective } from 'vue'
import { FullscreenImgHandler, type BindingData } from './fullscreen-img.handler'

let instance: FullscreenImgHandler

export const vFullscreenImg: ObjectDirective = {
  mounted(el: HTMLElement, binding: BindingData) {
    instance = new FullscreenImgHandler()
    return instance.create(el, binding)
  },
  updated(el: HTMLElement, binding: BindingData) {
    return instance.update(el, binding)
  },
  unmounted(el: HTMLElement) {
    return instance.remove(el)
  },
}
