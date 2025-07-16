import type { ObjectDirective } from 'vue'
import type { VLazyImgBindingValue } from './lazy-img.handler'
import { LazyImg } from './lazy-img.handler'

let instance: LazyImg

export type VLazyImgDirective = ObjectDirective<HTMLElement, VLazyImgBindingValue>

const directive: VLazyImgDirective = {
  created(el, binding) {
    const options = typeof binding.value === 'object' ? binding.value : {}
    instance = new LazyImg(options)
    instance.add(el, binding)
  },
  updated(el, binding): void {
    instance.update(el, binding)
  },
  unmounted(el, binding): void {
    instance.remove(el, binding)
  },
}

export { directive as vLazyImg }
