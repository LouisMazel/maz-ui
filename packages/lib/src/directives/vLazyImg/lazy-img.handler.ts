import type { ClassOptions, vLazyImgBinding, vLazyImgOptions } from './types'

export * from './types'

const EMPTY_PHOTO = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export const DEFAULT_OPTIONS: ClassOptions = {
  baseClass: 'm-lazy-img',
  loadedClass: 'm-lazy-loaded',
  loadingClass: 'm-lazy-loading',
  errorClass: 'm-lazy-error',
  noPhotoClass: 'm-lazy-no-photo',
  noPhoto: false,
  observerOnce: true,
  loadOnce: false,
  noUseErrorPhoto: false,
  observerOptions: {
    threshold: 0.1,
  },
}

export class LazyImg {
  private observers: IntersectionObserver[] = []
  private readonly defaultOptions: ClassOptions = DEFAULT_OPTIONS
  private options: ClassOptions
  private onImgLoadedCallback: (el: HTMLElement) => void
  private onImgErrorCallback: (el: HTMLElement, err: ErrorEvent) => void
  private hasImgLoaded = false

  constructor(opts: vLazyImgOptions = {}) {
    this.options = this.buildOptions(opts)
    this.onImgLoadedCallback = this.imageIsLoaded.bind(this)
    this.onImgErrorCallback = this.imageHasError.bind(this)
  }

  private async loadErrorPhoto() {
    const { default: photo } = await import('../../../icons/no-photography.svg?url')
    return photo
  }

  private buildOptions(opts: vLazyImgOptions): ClassOptions {
    return {
      ...this.defaultOptions,
      ...opts,
      observerOptions: {
        ...this.defaultOptions.observerOptions,
        ...opts.observerOptions,
      },
    }
  }

  private removeClass(el: HTMLElement, className: string) {
    el.classList.remove(className)
  }

  private addClass(el: HTMLElement, className: string) {
    el.classList.add(className)
  }

  private removeAllStateClasses(el: HTMLElement) {
    this.removeClass(el, this.options.loadedClass)
    this.removeClass(el, this.options.loadingClass)
    this.removeClass(el, this.options.errorClass)
    this.removeClass(el, this.options.noPhotoClass)
  }

  private setBaseClass(el: HTMLElement) {
    this.addClass(el, this.options.baseClass)
  }

  private imageIsLoading(el: HTMLElement) {
    this.addClass(el, this.options.loadingClass)
    this.options.onLoading?.(el)
  }

  private imageHasNoPhoto(el: HTMLElement) {
    this.removeClass(el, this.options.loadingClass)
    this.addClass(el, this.options.noPhotoClass)

    this.setDefaultPhoto(el)
  }

  private imageIsLoaded(el: HTMLElement): void {
    this.hasImgLoaded = true
    this.removeClass(el, this.options.loadingClass)
    this.addClass(el, this.options.loadedClass)
    this.options.onLoaded?.(el)
  }

  private imageHasError(el: HTMLElement): void {
    this.removeClass(el, this.options.loadingClass)
    this.addClass(el, this.options.errorClass)

    this.options.onError?.(el)

    this.setDefaultPhoto(el)
  }

  private getSrc(binding: vLazyImgBinding) {
    return typeof binding.value === 'object' ? binding.value.src : binding.value
  }

  private getImageUrl(el: HTMLElement, binding: vLazyImgBinding): string | null | undefined {
    const dataSrc = this.getImgElement(el).getAttribute('data-lazy-src')
    if (dataSrc)
      return dataSrc

    return this.getSrc(binding)
  }

  private async setPictureSourceUrls(el: HTMLElement): Promise<void> {
    const sourceElements = el.querySelectorAll('source')

    if (sourceElements.length > 0) {
      for await (const source of sourceElements) {
        const srcSet = source.getAttribute('data-lazy-srcset')
        if (srcSet) {
          source.srcset = srcSet
        }
        else {
          return this.imageHasError(el)
        }
      }
    }
    else {
      this.imageHasError(el)
    }
  }

  private hasBgImgMode(binding: vLazyImgBinding): boolean {
    return binding.arg === 'bg-image'
  }

  private isPictureElement(el: HTMLElement): boolean {
    return el instanceof HTMLPictureElement
  }

  private getImgElement(el: HTMLElement): HTMLImageElement {
    const isPictureElement = this.isPictureElement(el)
    return (isPictureElement ? el.querySelector('img') : el) as HTMLImageElement
  }

  private async setDefaultPhoto(el: HTMLElement) {
    if (this.options.noUseErrorPhoto)
      return

    const fallbackSrc = this.options.fallbackSrc ?? this.options.errorPhoto

    if (typeof fallbackSrc === 'string') {
      this.addClass(el, this.options.noPhotoClass)
    }

    const errorPhoto = fallbackSrc ?? (await this.loadErrorPhoto())

    const sourceElements = el.querySelectorAll('source')
    if (sourceElements.length > 0) {
      for await (const source of sourceElements) {
        source.srcset = errorPhoto
      }
    }
    else {
      this.setImgSrc(el, errorPhoto)
    }
  }

  private addEventListenerToImg(el: HTMLElement) {
    const imgElement = this.getImgElement(el)
    imgElement.addEventListener('load', () => this.onImgLoadedCallback(el), {
      once: true,
    })
    imgElement.addEventListener('error', err => this.onImgErrorCallback(el, err), { once: true })
  }

  private async loadImage(el: HTMLElement, binding: vLazyImgBinding): Promise<void> {
    this.imageIsLoading(el)

    if (this.isPictureElement(el)) {
      this.addEventListenerToImg(el)

      await this.setPictureSourceUrls(el)
    }
    else {
      const imageUrl = this.getImageUrl(el, binding)

      if (!imageUrl)
        return this.imageHasError(el)

      if (this.hasBgImgMode(binding)) {
        el.style.backgroundImage = `url('${imageUrl}')`
        this.imageIsLoaded(el)
      }
      else {
        this.addEventListenerToImg(el)

        this.setImgSrc(el, imageUrl)
      }
    }
  }

  public setImgSrc(el: HTMLElement, src: string) {
    const imgElement = this.getImgElement(el)
    imgElement.src = src
  }

  private handleIntersectionObserver(
    el: HTMLElement,
    binding: vLazyImgBinding,
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
  ) {
    this.observers.push(observer)

    for (const entry of entries) {
      if (entry.isIntersecting) {
        this.options.onIntersecting?.(entry.target)

        if (this.options.observerOnce) {
          observer.unobserve(el)
        }

        if (this.options.loadOnce && this.hasImgLoaded)
          return
        this.loadImage(el, binding)
      }
    }
  }

  private createObserver(el: HTMLElement, binding: vLazyImgBinding) {
    const observerCallback = (
      entries: IntersectionObserverEntry[],
      intersectionObserver: IntersectionObserver,
    ) => {
      this.handleIntersectionObserver(el, binding, entries, intersectionObserver)
    }

    const observerOptions: ClassOptions['observerOptions'] = this.options.observerOptions
    const observer = new IntersectionObserver(observerCallback, observerOptions)

    observer.observe(el)
  }

  private async imageHandler(
    el: HTMLElement,
    binding: vLazyImgBinding,
    type: 'bind' | 'update',
  ): Promise<void> {
    if (type === 'update') {
      // Clean all previous observers
      for await (const observer of this.observers) observer.unobserve(el)
    }

    if (window.IntersectionObserver) {
      this.createObserver(el, binding)
    }
    else {
      this.loadImage(el, binding)
    }
  }

  private async bindUpdateHandler(
    el: HTMLElement,
    binding: vLazyImgBinding,
    type: 'bind' | 'update',
  ): Promise<void> {
    if (this.options.noPhoto)
      return this.imageHasNoPhoto(el)

    await this.imageHandler(el, binding, type)
  }

  public async add(el: HTMLElement, binding: vLazyImgBinding): Promise<void> {
    if (this.hasBgImgMode(binding) && this.isPictureElement(el)) {
      throw new Error(`[MazLazyImg] You can't use the "bg-image" mode with "<picture />" element`)
    }

    setTimeout(() => this.setBaseClass(el), 0)

    if (!el.getAttribute('src')) {
      this.setImgSrc(el, EMPTY_PHOTO)
    }

    await this.bindUpdateHandler(el, binding, 'bind')
  }

  public async update(el: HTMLElement, binding: vLazyImgBinding): Promise<void> {
    if (binding.value !== binding.oldValue) {
      this.hasImgLoaded = false
      this.removeAllStateClasses(el)

      await this.bindUpdateHandler(el, binding, 'update')
    }
  }

  public remove(el: HTMLElement, binding: vLazyImgBinding) {
    this.hasImgLoaded = false
    if (this.hasBgImgMode(binding)) {
      el.style.backgroundImage = ''
    }

    this.removeAllStateClasses(el)

    for (const observer of this.observers) {
      observer.unobserve(el)
    }

    this.observers = []
  }
}
