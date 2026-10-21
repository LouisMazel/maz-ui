import type { ObjectDirective } from 'vue'
import type { VLazyImgBindingValue } from './lazy-img.handler'
import { LazyImg } from './lazy-img.handler'

let instance: LazyImg | undefined

function getInstance(): LazyImg {
  instance ??= new LazyImg()
  return instance
}

export type VLazyImgDirective = ObjectDirective<HTMLElement, VLazyImgBindingValue>

const directive: VLazyImgDirective = {
  created(el, binding) {
    getInstance().add(el, binding)
  },
  updated(el, binding): void {
    getInstance().update(el, binding)
  },
  unmounted(el, binding): void {
    getInstance().remove(el, binding)
  },
}

export { directive as vLazyImg }
