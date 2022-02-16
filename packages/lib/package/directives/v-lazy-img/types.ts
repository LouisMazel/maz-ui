import { DirectiveBinding } from 'vue'

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

export interface vLazyImgOptions {
  baseClass?: string
  loadingClass?: string
  loadedClass?: string
  errorClass?: string
  noPhotoClass?: string
  noPhoto?: boolean
  noUseErrorPhoto?: boolean
  observerOnce?: boolean
  loadOnce?: boolean
  observerOptions?: {
    root?: HTMLElement | null
    threshold?: number
    rootMargin?: string
  }
  errorPhoto?: string
  onLoading?: (el: Element) => unknown
  onLoaded?: (el: Element) => unknown
  onError?: (el: Element) => unknown
  onIntersecting?: (el: Element) => unknown
}

interface vLazyImgBindingOptions extends vLazyImgOptions {
  src?: string
}

export type vLazyImgBinding = string | vLazyImgBindingOptions

export interface BindingData extends DirectiveBinding {
  value: vLazyImgBinding
}
