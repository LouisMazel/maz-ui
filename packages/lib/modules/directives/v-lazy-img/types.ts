import type { DirectiveBinding, ObjectDirective } from 'vue'

export interface ClassOptions {
  baseClass: string
  loadingClass: string
  loadedClass: string
  errorClass: string
  noPhotoClass: string
  noPhoto: boolean
  noUseErrorPhoto: boolean
  observerOnce: boolean
  loadOnce: boolean
  observerOptions: {
    root?: HTMLElement | null
    threshold: number
    rootMargin?: string
  }
  /**
   * @deprecated use `fallbackSrc` instead
   */
  errorPhoto?: string
  fallbackSrc?: string
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
