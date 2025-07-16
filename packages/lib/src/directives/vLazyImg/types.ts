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

export type VLazyImgOptions = Partial<ClassOptions>

interface VLazyImgBindingOptions extends VLazyImgOptions {
  src?: string
  disabled?: boolean
}

export type VLazyImgBindingValue = string | VLazyImgBindingOptions

export type VLazyImgBinding = DirectiveBinding<VLazyImgBindingValue>
export type VLazyImgDirective = ObjectDirective<HTMLElement, VLazyImgBinding>
