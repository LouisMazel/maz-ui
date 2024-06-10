import type { ObjectDirective } from 'vue'
import { LazyImg, type vLazyImgBindingValue } from './lazy-img.handler'

let instance: LazyImg

const directive = {
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
} satisfies ObjectDirective<HTMLElement, vLazyImgBindingValue>

export { directive as vLazyImg }
