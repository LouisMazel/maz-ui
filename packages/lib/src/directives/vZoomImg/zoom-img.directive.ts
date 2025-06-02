import type { ObjectDirective } from 'vue'
import type { vZoomImgBindingValue } from './zoom-img.handler'
import { VueZoomImg } from './zoom-img.handler'

let instance: VueZoomImg

export const vZoomImg = {
  created(el: HTMLElement, binding): void {
    instance = new VueZoomImg(binding)
    instance.create(el)
  },
  updated(_el: HTMLElement, binding): void {
    instance.update(binding)
  },
  unmounted(el: HTMLElement): void {
    instance.remove(el)
  },
} satisfies ObjectDirective<HTMLElement, vZoomImgBindingValue>
