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
  errorPhoto?: string
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

export type vLazyImgBinding = string | vLazyImgBindingOptions

export type LazyImgBinding = DirectiveBinding<vLazyImgBinding>
export type LazyImgDirective = ObjectDirective<HTMLElement, vLazyImgBinding>
