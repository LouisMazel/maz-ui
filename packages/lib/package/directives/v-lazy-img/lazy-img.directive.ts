import type { Directive } from 'vue'
import { LazyImg } from './lazy-img-handler'
import type { BindingData } from './lazy-img-handler'

let instance: LazyImg

export const vLazyImg: Directive = {
  created(el: HTMLElement, binding: BindingData) {
    const options = typeof binding.value === 'object' ? binding.value : {}
    instance = new LazyImg(options)
    instance.add(el, binding)
  },
  updated(el: HTMLElement, binding: BindingData): void {
    instance.update(el, binding)
  },
  unmounted(el: HTMLElement, binding: BindingData): void {
    instance.remove(el, binding)
  },
}
