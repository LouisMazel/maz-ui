import type { DirectiveBinding, ObjectDirective } from 'vue'

export interface ClassOptions {
  baseClass: string
  loadingClass: string
  loadedClass: string
  errorClass: string
  fallbackClass: string
  observerOnce: boolean
  loadOnce: boolean
  observerOptions: {
    root?: HTMLElement | null
    threshold: number
    rootMargin?: string
  }
  fallbackSrc?: string | false
  onLoading?: (el: Element) => unknown
  onLoaded?: (el: Element) => unknown
  onError?: (el: Element) => unknown
  onIntersecting?: (el: Element) => unknown
}

export type vLazyImgOptions = Partial<ClassOptions>

interface vLazyImgBindingOptions extends vLazyImgOptions {
  src?: string
  disabled?: boolean
}

export type vLazyImgBindingValue = string | vLazyImgBindingOptions

export type vLazyImgBinding = DirectiveBinding<vLazyImgBindingValue>
export type vLazyImgDirective = ObjectDirective<HTMLElement, vLazyImgBinding>
