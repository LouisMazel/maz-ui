import type { Directive } from 'vue'
import { type BindingData, VueZoomImg } from './zoom-img.handler'

let instance: VueZoomImg

export const vZoomImg: Directive = {
  created(el: HTMLElement, binding: BindingData): void {
    instance = new VueZoomImg(binding)
    instance.create(el)
  },
  updated(_el: HTMLElement, binding: BindingData): void {
    instance.update(binding)
  },
  unmounted(el: HTMLElement): void {
    instance.remove(el)
  },
}
