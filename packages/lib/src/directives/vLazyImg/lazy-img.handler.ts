import type { ClassOptions, VLazyImgBinding, VLazyImgBindingValue, VLazyImgOptions } from './types'

export * from './types'

const EMPTY_PHOTO = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export const DEFAULT_OPTIONS: ClassOptions = {
  baseClass: 'm-lazy-img',
  loadedClass: 'm-lazy-loaded',
  loadingClass: 'm-lazy-loading',
  errorClass: 'm-lazy-error',
  fallbackClass: 'm-lazy-fallback',
  observerOnce: true,
  loadOnce: false,
  observerOptions: {
    threshold: 0.1,
  },
}

type ElementOptions = ClassOptions & { disabled?: boolean }

interface ElementState {
  options: ElementOptions
  binding: VLazyImgBinding
  img: HTMLImageElement | null
  isPicture: boolean
  isBg: boolean
  loaded: boolean
  observerKey?: string
}

interface PooledObserver {
  observer: IntersectionObserver
  targets: Set<Element>
}

function mergeOptions(
  base: ClassOptions,
  override: (VLazyImgOptions & { disabled?: boolean, src?: string }) = {},
): ElementOptions {
  return {
    ...base,
    ...override,
    observerOptions: {
      ...base.observerOptions,
      ...override.observerOptions,
    },
  }
}

/**
 * Lazy image loader shared across every element bound to the directive.
 *
 * State is kept per element in a `WeakMap` and `IntersectionObserver`s are pooled
 * by their options signature, so a single instance can drive hundreds of images
 * with a handful of observers and no per-element leak on unmount.
 */
export class LazyImg {
  private options: ClassOptions
  private states = new WeakMap<Element, ElementState>()
  private pool = new Map<string, PooledObserver>()
  private rootIds = new WeakMap<Element, number>()
  private rootSeq = 0

  constructor(opts: VLazyImgOptions = {}) {
    this.options = mergeOptions(DEFAULT_OPTIONS, opts)
  }

  public add(el: HTMLElement, binding: VLazyImgBinding): void {
    const isBg = this.isBgMode(binding)
    const isPicture = el instanceof HTMLPictureElement

    if (isBg && isPicture) {
      throw new Error(`[MazLazyImg] You can't use the "bg-image" mode with "<picture />" element`)
    }

    const state: ElementState = {
      options: this.resolveOptions(binding),
      binding,
      img: this.resolveImg(el, isPicture),
      isPicture,
      isBg,
      loaded: false,
    }
    this.states.set(el, state)

    setTimeout(() => this.addClass(el, state.options.baseClass), 0)

    if (!isBg && !el.getAttribute('src')) {
      this.setImgSrc(el, EMPTY_PHOTO)
    }

    this.watch(el, state)
  }

  public update(el: HTMLElement, binding: VLazyImgBinding): void {
    if (binding.value === binding.oldValue)
      return

    const state = this.states.get(el)

    if (!state) {
      this.add(el, binding)
      return
    }

    state.options = this.resolveOptions(binding)
    state.binding = binding
    state.loaded = false

    this.removeAllStateClasses(el, state.options)
    this.unobserve(el, state)
    this.watch(el, state)
  }

  public remove(el: HTMLElement, binding: VLazyImgBinding): void {
    const state = this.states.get(el)

    if (state)
      this.unobserve(el, state)

    if (this.isBgMode(binding))
      el.style.backgroundImage = ''

    this.removeAllStateClasses(el, state?.options ?? this.options)
    this.states.delete(el)
  }

  public setImgSrc(el: HTMLElement, src: string): void {
    const img = this.states.get(el)?.img ?? this.resolveImg(el, el instanceof HTMLPictureElement)
    if (img)
      img.src = src
  }

  private resolveOptions(binding: VLazyImgBinding): ElementOptions {
    const value: VLazyImgBindingValue = binding.value
    return value && typeof value === 'object' ? mergeOptions(this.options, value) : { ...this.options }
  }

  private resolveImg(el: HTMLElement, isPicture: boolean): HTMLImageElement | null {
    return isPicture ? el.querySelector('img') : (el as HTMLImageElement)
  }

  private isBgMode(binding: VLazyImgBinding): boolean {
    return binding.arg === 'bg-image'
  }

  private watch(el: HTMLElement, state: ElementState): void {
    if (state.options.disabled || !globalThis.IntersectionObserver) {
      this.loadImage(el, state)
      return
    }

    const key = this.observerKey(state.options.observerOptions)
    state.observerKey = key

    let pooled = this.pool.get(key)
    if (!pooled) {
      const observer = new IntersectionObserver(entries => this.onIntersect(entries), state.options.observerOptions)
      pooled = { observer, targets: new Set() }
      this.pool.set(key, pooled)
    }

    pooled.targets.add(el)
    pooled.observer.observe(el)
  }

  private onIntersect(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (!entry.isIntersecting)
        continue

      const el = entry.target as HTMLElement
      const state = this.states.get(el)
      if (!state)
        continue

      state.options.onIntersecting?.(el)

      if (state.options.observerOnce)
        this.unobserve(el, state)

      if (state.options.loadOnce && state.loaded)
        continue

      this.loadImage(el, state)
    }
  }

  private unobserve(el: HTMLElement, state: ElementState): void {
    if (!state.observerKey)
      return

    const pooled = this.pool.get(state.observerKey)
    if (!pooled)
      return

    pooled.observer.unobserve(el)
    pooled.targets.delete(el)

    if (pooled.targets.size === 0) {
      pooled.observer.disconnect()
      this.pool.delete(state.observerKey)
    }

    state.observerKey = undefined
  }

  private observerKey(options: ClassOptions['observerOptions']): string {
    const root = options.root ? this.rootId(options.root) : 0
    const threshold = Array.isArray(options.threshold) ? options.threshold.join(',') : options.threshold
    return `${root}|${options.rootMargin ?? ''}|${threshold}`
  }

  private rootId(root: Element): number {
    let id = this.rootIds.get(root)
    if (id === undefined) {
      id = ++this.rootSeq
      this.rootIds.set(root, id)
    }
    return id
  }

  private loadImage(el: HTMLElement, state: ElementState): void {
    this.addClass(el, state.options.loadingClass)
    state.options.onLoading?.(el)

    if (state.isPicture) {
      this.attachListeners(el, state)
      this.setPictureSourceUrls(el, state)
      return
    }

    const url = this.getImageUrl(state)

    if (!url) {
      this.handleError(el, state)
      return
    }

    if (state.isBg) {
      el.style.backgroundImage = `url('${url}')`
      this.markLoaded(el, state)
      return
    }

    this.attachListeners(el, state)
    this.setImgSrc(el, url)
  }

  private getImageUrl(state: ElementState): string | null | undefined {
    const dataSrc = state.img?.getAttribute('data-lazy-src')
    if (dataSrc)
      return dataSrc

    const value = state.binding.value
    return typeof value === 'object' ? value.src : value
  }

  private setPictureSourceUrls(el: HTMLElement, state: ElementState): void {
    const sources = el.querySelectorAll('source')

    if (sources.length === 0) {
      this.handleError(el, state)
      return
    }

    for (const source of sources) {
      const srcset = source.getAttribute('data-lazy-srcset')
      if (!srcset) {
        this.handleError(el, state)
        return
      }
      source.srcset = srcset
    }
  }

  private attachListeners(el: HTMLElement, state: ElementState): void {
    const img = state.img
    if (!img)
      return

    img.addEventListener('load', () => this.markLoaded(el, state), { once: true })
    img.addEventListener('error', () => this.handleError(el, state), { once: true })
  }

  private markLoaded(el: HTMLElement, state: ElementState): void {
    state.loaded = true
    this.removeClass(el, state.options.loadingClass)
    this.addClass(el, state.options.loadedClass)
    state.options.onLoaded?.(el)
  }

  private handleError(el: HTMLElement, state: ElementState): void {
    this.removeClass(el, state.options.loadingClass)
    this.addClass(el, state.options.errorClass)
    state.options.onError?.(el)
    this.setDefaultPhoto(el, state).catch(() => {})
  }

  private async setDefaultPhoto(el: HTMLElement, state: ElementState): Promise<void> {
    const fallbackSrc = state.options.fallbackSrc

    if (fallbackSrc === false)
      return

    if (typeof fallbackSrc === 'string')
      this.addClass(el, state.options.fallbackClass)

    const errorPhoto = fallbackSrc ?? (await this.loadErrorPhoto())

    const sources = el.querySelectorAll('source')

    if (sources.length > 0) {
      for (const source of sources)
        source.srcset = errorPhoto
    }
    else {
      this.setImgSrc(el, errorPhoto)
    }
  }

  private async loadErrorPhoto(): Promise<string> {
    const { default: photo } = await import('@maz-ui/icons/svg/no-image.svg?url')
    return photo
  }

  private addClass(el: HTMLElement, className: string): void {
    el.classList.add(className)
  }

  private removeClass(el: HTMLElement, className: string): void {
    el.classList.remove(className)
  }

  private removeAllStateClasses(el: HTMLElement, options: ClassOptions): void {
    el.classList.remove(options.loadedClass, options.loadingClass, options.errorClass, options.fallbackClass)
  }
}
