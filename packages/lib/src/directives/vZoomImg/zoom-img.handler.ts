import type { DirectiveBinding } from 'vue'
import { style } from './style'
import { svgs } from './svgs'

export interface vZoomImgOptions {
  disabled?: boolean
  scale?: boolean
  blur?: boolean
}

interface vZoomImgBindingOptions extends vZoomImgOptions {
  src: string
  alt?: string
}

export type vZoomImgBindingValue = string | vZoomImgBindingOptions

export type vZoomImgBinding = DirectiveBinding<vZoomImgBindingValue>

enum StateClass {
  OPEN = 'maz-is-open',
}

export class VueZoomImg {
  private options: vZoomImgBindingOptions
  private loader: HTMLDivElement
  private wrapper: HTMLDivElement
  private img: HTMLImageElement
  private keydownHandler: (e: KeyboardEvent) => void
  private onImgLoadedCallback: EventListener
  private buttonsAdded: boolean
  private defaultOptions: vZoomImgOptions = {
    scale: true,
    blur: true,
    disabled: false,
  }

  private mouseEnterListener: () => void
  private mouseLeaveListener: () => void
  private renderPreviewListener: () => void

  constructor(binding: vZoomImgBinding) {
    if (!binding.value) {
      throw new Error(
        '[MazUI](zoom-img) Image path must be defined. Ex: `v-zoom-img="<PATH_TO_IMAGE>"`',
      )
    }

    if (typeof binding.value === 'object' && !binding.value.src) {
      throw new Error('[maz-ui](zoom-img) src of image must be provided')
    }

    this.buttonsAdded = false

    this.options = this.buildOptions(binding)
    this.keydownHandler = this.keydownLister.bind(this)

    this.loader = this.getLoader()

    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('maz-zoom-img__wrapper')
    this.wrapper.prepend(this.loader)

    this.img = document.createElement('img')
    this.onImgLoadedCallback = this.onImgLoaded.bind(this)
    this.imgEventHandler(true)
  }

  private buildOptions(binding: vZoomImgBinding): vZoomImgBindingOptions {
    return {
      ...this.defaultOptions,
      ...(typeof binding.value === 'object' ? binding.value : { src: binding.value }),
    }
  }

  get allInstances(): HTMLElement[] {
    return [...document.querySelectorAll('.maz-zoom-img-instance')] as HTMLElement[]
  }

  public create(el: HTMLElement): void {
    /**
     * If is disabled
     */
    if (this.options.disabled)
      return

    /**
     * Set instance style
     */
    el.style.cursor = 'pointer'
    /**
     * Set class & data attribute to use it with previous & next functions
     */
    setTimeout(() => el.classList.add('maz-zoom-img-instance'))
    el.setAttribute('data-zoom-src', this.options.src)
    if (this.options.alt)
      el.setAttribute('data-zoom-alt', this.options.alt)
    /**
     * Add event listeners
     */
    el.style.transition = 'all 300ms ease-in-out'

    this.mouseEnterListener = () => this.mouseEnter(el)
    this.mouseLeaveListener = () => this.mouseLeave(el)
    this.renderPreviewListener = () => this.renderPreview(el, this.options)

    el.addEventListener('mouseenter', this.mouseEnterListener)
    el.addEventListener('mouseleave', this.mouseLeaveListener)
    el.addEventListener('click', this.renderPreviewListener)
  }

  public update(binding: vZoomImgBinding): void {
    this.options = this.buildOptions(binding)
  }

  public remove(el: HTMLElement): void {
    /**
     * Remove all
     */
    this.imgEventHandler(false)
    el.removeEventListener('mouseenter', this.mouseEnterListener)
    el.removeEventListener('mouseleave', this.mouseLeaveListener)
    el.removeEventListener('click', this.renderPreviewListener)
    el.classList.remove('maz-zoom-img-instance')
    el.removeAttribute('data-zoom-src')
    el.removeAttribute('data-zoom-alt')
    el.style.cursor = ''
  }

  private renderPreview(el: HTMLElement, options?: vZoomImgBindingOptions): void {
    el.classList.add(StateClass.OPEN)
    this.addStyle(style)

    const container: HTMLDivElement = document.createElement('div')
    container.classList.add('maz-zoom-img')
    container.setAttribute('id', 'MazImgPreviewFullsize')
    container.addEventListener('click', (e): void => {
      if (container.isEqualNode(e.target as Node)) {
        this.closePreview()
      }
    })

    if (typeof options === 'object') {
      this.img.setAttribute('src', options.src)
      if (options.alt)
        this.img.setAttribute('alt', options.alt)
      this.img.id = 'MazImgElement'
    }

    this.wrapper.append(this.img)

    container.append(this.wrapper)

    document.body.append(container)
    this.keyboardEventHandler(true)

    setTimeout(() => {
      if (container)
        container.classList.add('maz-animate')
    }, 100)
  }

  private onImgLoaded(): void {
    this.wrapper.style.width = `${this.img.width}px`
    this.wrapper.style.minWidth = `200px`
    this.loader.hidden = true

    const closeButton: HTMLButtonElement = this.getButton()
    const buttons: HTMLButtonElement[] = []

    const hasMultipleInstance = this.allInstances.length > 1

    if (!this.buttonsAdded) {
      this.buttonsAdded = true
      if (hasMultipleInstance) {
        const previousButton = this.getButton('previous')
        const nextButton = this.getButton('next')
        buttons.push(previousButton, nextButton)
      }

      this.wrapper.append(closeButton)
      if (hasMultipleInstance) {
        this.wrapper.prepend(buttons[0])
        this.wrapper.append(buttons[1])
      }
    }
  }

  private getLoader(): HTMLDivElement {
    const loader = document.createElement('div')
    loader.classList.add('maz-zoom-img__loader')
    loader.innerHTML = svgs.spinner
    return loader
  }

  private mouseLeave(el: HTMLElement): void {
    if (this.options.scale)
      el.style.transform = ''
    if (this.options.blur)
      el.style.filter = ''
    el.style.zIndex = ''
  }

  private mouseEnter(el: HTMLElement): void {
    el.style.zIndex = '1'
    if (this.options.scale)
      el.style.transform = 'scale(1.1)'
    if (this.options.blur)
      el.style.filter = 'blur(2px)'
  }

  private keydownLister(e: KeyboardEvent): void {
    e.preventDefault()
    if (e.key === 'Escape' || e.key === ' ') {
      this.closePreview()
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      this.nextPreviousImage(e.key === 'ArrowRight')
    }
  }

  private getButton(iconName = 'close'): HTMLButtonElement {
    const button = document.createElement('button')
    button.innerHTML = svgs[iconName]
    const getAction = () => {
      if (iconName === 'close')
        return this.closePreview()

      if (this.allInstances)
        return this.nextPreviousImage(iconName === 'next')

      return null
    }

    button.addEventListener('click', () => {
      getAction()
    })

    button.classList.add('maz-zoom-btn')
    button.classList.add(`maz-zoom-btn--${iconName}`)
    return button
  }

  private closePreview(): void {
    const container: HTMLElement | null = document.querySelector('#MazImgPreviewFullsize')
    const style: HTMLElement | null = document.querySelector('#MazPreviewStyle')
    const instance: HTMLElement | null = document.querySelector(
      '.maz-zoom-img-instance.maz-is-open',
    )

    if (instance)
      instance.classList.remove(StateClass.OPEN)

    if (container)
      container.classList.remove('maz-animate')

    this.keyboardEventHandler(false)

    setTimeout(() => {
      if (container)
        container.remove()
      if (style)
        style.remove()
    }, 300)
  }

  private getNewInstanceIndex(newInstanceIndex: number): number {
    let nextIndex = newInstanceIndex
    if (nextIndex < 0) {
      nextIndex = this.allInstances.length - 1
    }
    else if (nextIndex >= this.allInstances.length) {
      nextIndex = 0
    }
    return nextIndex
  }

  private nextPreviousImage(isNext: boolean): void {
    const selectNextInstance = isNext
    const currentInstance: HTMLElement | null = document.querySelector(
      '.maz-zoom-img-instance.maz-is-open',
    )

    if (currentInstance) {
      const currentInstanceIndex = this.allInstances.indexOf(currentInstance)
      const newInstanceIndex = selectNextInstance
        ? currentInstanceIndex + 1
        : currentInstanceIndex - 1

      const nextInstance = this.allInstances[this.getNewInstanceIndex(newInstanceIndex)]

      if (nextInstance) {
        this.useNextInstance(currentInstance, nextInstance)
      }
    }
  }

  private useNextInstance(currentInstance: HTMLElement, nextInstance: HTMLElement) {
    currentInstance.classList.remove(StateClass.OPEN)
    nextInstance.classList.add(StateClass.OPEN)

    const src: string | null = nextInstance.getAttribute('data-zoom-src')
    const alt: string | null = nextInstance.getAttribute('data-zoom-alt')

    this.wrapper.style.width = ''
    this.loader.hidden = false

    if (src)
      this.img.setAttribute('src', src)
    if (alt)
      this.img.setAttribute('alt', alt)
  }

  private addStyle(styleString: string): void {
    const style = document.createElement('style')
    style.id = 'MazPreviewStyle'
    style.textContent = styleString
    document.head.append(style)
  }

  private keyboardEventHandler(add: boolean): void {
    if (add)
      return document.addEventListener('keydown', this.keydownHandler)
    document.removeEventListener('keydown', this.keydownHandler)
  }

  private imgEventHandler(add: boolean): void {
    if (add)
      return this.img.addEventListener('load', this.onImgLoadedCallback)
    this.img.removeEventListener('load', this.onImgLoadedCallback)
  }
}
