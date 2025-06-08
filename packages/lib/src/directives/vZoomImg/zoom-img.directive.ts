import type { ObjectDirective } from 'vue'
import type { VZoomImgBindingValue } from './zoom-img.handler'
import { ZoomImgHandler } from './zoom-img.handler'

let instance: ZoomImgHandler

export const vZoomImg = {
  created(el: HTMLElement, binding): void {
    instance = new ZoomImgHandler(binding)
    instance.create(el)
  },
  updated(_el: HTMLElement, binding): void {
    instance.update(binding)
  },
  unmounted(el: HTMLElement): void {
    instance.remove(el)
  },
} satisfies ObjectDirective<HTMLElement, VZoomImgBindingValue>
