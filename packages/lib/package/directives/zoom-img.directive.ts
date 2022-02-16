import { Directive, DirectiveBinding } from 'vue'

const style = `
.maz-zoom-img {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2.5rem;
  z-index: 1050;
  background-color: rgba(86, 87, 117, .7);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.maz-zoom-img,
.maz-zoom-img * {
  box-sizing: border-box;
}

.maz-zoom-img .maz-zoom-img__wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
  min-height: 0;
  max-width: 100%;
  max-height: 100%;
  transition: all 300ms ease-in-out;
  opacity: 0;
  transform: scale(0.5);
}

.maz-zoom-img.maz-animate .maz-zoom-img__wrapper {
  opacity: 1;
  transform: scale(1);
}

.maz-zoom-img.maz-animate .maz-zoom-img__loader {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(86, 87, 117, .7);
  border-radius: 1rem;
  z-index: 2;
  min-width: 60px;
  min-height: 60px;
}
.maz-zoom-img.maz-animate .maz-zoom-img__loader[hidden] {
  display: none;
}

@-webkit-keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.maz-zoom-img.maz-animate .maz-zoom-img__loader__svg {
  animation: spin .6s linear infinite;
}

.maz-zoom-img img {
  max-width: 100%;
  max-height: 100%;
  min-width: 0;
  border-radius: 1rem;
}

.maz-zoom-img .maz-zoom-btn {
  margin: 0 auto;
  border: none;
  background-color: rgba(17, 17, 17, 0.5);
  box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.2);
  height: 2.2rem;
  min-height: 2.2rem;
  width: 2.2rem;
  min-width: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2.2rem;
  cursor: pointer;
  flex: 0 0 auto;
  outline: none;
}

.maz-zoom-img .maz-zoom-btn svg {
  fill: white;
}

.maz-zoom-img .maz-zoom-btn.maz-zoom-btn--close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1;
}

.maz-zoom-img .maz-zoom-btn.maz-zoom-btn--previous {
  position: absolute;
  left: 0.5rem;
  z-index: 1;
}

.maz-zoom-img .maz-zoom-btn.maz-zoom-btn--next {
  position: absolute;
  right: 0.5rem;
  z-index: 1;
}

.maz-zoom-img .maz-zoom-btn:hover {
  background-color: black;
}`

export interface vZoomImgOptions {
  disabled?: boolean
  scale?: boolean
  blur?: boolean
}

interface vZoomImgBindingOptions extends vZoomImgOptions {
  src: string
  alt?: string
}

export type vZoomImgBinding = string | vZoomImgBindingOptions

export interface BindingData extends DirectiveBinding {
  value: vZoomImgBinding
}

const svgs = {
  close:
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
  next: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
  previous:
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>',
  spinner:
    '<svg width="40px" height="40px" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" x="0px" y="0px" viewBox="0 0 50 50" xml:space="preserve" class="maz-zoom-img__loader__svg" data-v-6d1cb50c=""><path d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"></path></svg>',
} as { [key: string]: string }

class VueZoomImg {
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

  constructor(binding: BindingData) {
    if (!binding.value) {
      throw new Error(
        '[MazUI](zoom-img) Image path must be defined. Ex: `v-zoom-img="<PATH_TO_IMAGE>"`',
      )
    }

    if (typeof binding.value === 'object' && !binding.value.src) {
      throw new Error('[MazUI](zoom-img) src of image must be provided')
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

  private buildOptions(binding: BindingData): vZoomImgBindingOptions {
    return {
      ...this.defaultOptions,
      ...(typeof binding.value === 'object'
        ? binding.value
        : { src: binding.value }),
    }
  }

  get allInstances(): HTMLElement[] {
    return Array.from(document.querySelectorAll('.maz-zoom-img-instance'))
  }

  public create(el: HTMLElement): void {
    /**
     * If is disabled
     */
    if (this.options.disabled) return

    /**
     * Set instance style
     */
    el.style.cursor = 'pointer'
    /**
     * Set class & data attribute to use it with previous & next functions
     */
    setTimeout(() => el.classList.add('maz-zoom-img-instance'))
    el.setAttribute('data-src', this.options.src)
    if (this.options.alt) el.setAttribute('data-alt', this.options.alt)
    /**
     * Add event listeners
     */
    el.style.transition = 'all 300ms ease-in-out'
    el.addEventListener('mouseenter', () => this.mouseEnter(el))
    el.addEventListener('mouseleave', () => this.mouseLeave(el))
    el.addEventListener('click', () => this.renderPreview(el, this.options))
  }

  public update(binding: BindingData): void {
    this.options = this.buildOptions(binding)
  }

  public remove(el: HTMLElement): void {
    /**
     * Remove all
     */
    this.imgEventHandler(false)
    el.removeEventListener('click', () => this.renderPreview(el))
    el.removeEventListener('mouseenter', () => this.mouseEnter(el))
    el.removeEventListener('mouseleave', () => this.mouseLeave(el))
    el.classList.remove('maz-zoom-img-instance')
    el.removeAttribute('data-src')
    el.removeAttribute('data-alt')
    el.style.cursor = ''
  }

  private renderPreview(
    el: HTMLElement,
    options?: vZoomImgBindingOptions,
  ): void {
    el.classList.add('maz-is-open')
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
      if (options.alt) this.img.setAttribute('alt', options.alt)
      this.img.id = 'MazImgElement'
    }

    this.wrapper.append(this.img)

    container.append(this.wrapper)

    document.body.appendChild(container)
    this.keyboardEventHandler(true)

    setTimeout(() => {
      if (container) container.classList.add('maz-animate')
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
    if (this.options.scale) el.style.transform = ''
    if (this.options.blur) el.style.filter = ''
    el.style.zIndex = ''
  }

  private mouseEnter(el: HTMLElement): void {
    el.style.zIndex = '1'
    if (this.options.scale) el.style.transform = 'scale(1.1)'
    if (this.options.blur) el.style.filter = 'blur(2px)'
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
    button.onclick = (): void => {
      iconName === 'close'
        ? this.closePreview()
        : this.allInstances
        ? this.nextPreviousImage(iconName === 'next')
        : null
    }
    button.classList.add('maz-zoom-btn')
    button.classList.add(`maz-zoom-btn--${iconName}`)
    return button
  }

  private closePreview(): void {
    const container: HTMLElement | null = document.querySelector(
      '#MazImgPreviewFullsize',
    )
    const style: HTMLElement | null = document.querySelector('#MazPreviewStyle')
    const instance: HTMLElement | null = document.querySelector(
      '.maz-zoom-img-instance.maz-is-open',
    )

    if (instance) instance.classList.remove('maz-is-open')

    if (container) container.classList.remove('maz-animate')

    this.keyboardEventHandler(false)

    setTimeout(() => {
      if (container) container.remove()
      if (style) style.remove()
    }, 300)
  }

  private nextPreviousImage(isNext: boolean): void {
    const selectNextInstance = isNext
    const currentInstance: HTMLElement | null = document.querySelector(
      '.maz-zoom-img-instance.maz-is-open',
    )

    const currentInstanceIndex = this.allInstances.findIndex(
      (i) => i === currentInstance,
    )
    const newInstanceIndex = selectNextInstance
      ? currentInstanceIndex + 1
      : currentInstanceIndex - 1

    const getNewInstanceIndex = (): number => {
      return newInstanceIndex < 0
        ? this.allInstances.length - 1
        : newInstanceIndex >= this.allInstances.length
        ? 0
        : newInstanceIndex
    }

    const nextInstance = this.allInstances[getNewInstanceIndex()]

    if (nextInstance && currentInstance) {
      currentInstance.classList.remove('maz-is-open')
      nextInstance.classList.add('maz-is-open')

      const src: string | null = nextInstance.getAttribute('data-src')
      const alt: string | null = nextInstance.getAttribute('data-alt')

      this.wrapper.style.width = ''
      this.loader.hidden = false

      if (src) this.img.setAttribute('src', src)
      if (alt) this.img.setAttribute('alt', alt)
    }
  }
  private addStyle(styleString: string): void {
    const style = document.createElement('style')
    style.id = 'MazPreviewStyle'
    style.textContent = styleString
    document.head.append(style)
  }

  private keyboardEventHandler(add: boolean): void {
    if (add) return document.addEventListener('keydown', this.keydownHandler)
    document.removeEventListener('keydown', this.keydownHandler)
  }

  private imgEventHandler(add: boolean): void {
    if (add) return this.img.addEventListener('load', this.onImgLoadedCallback)
    this.img.removeEventListener('load', this.onImgLoadedCallback)
  }
}

let instance: VueZoomImg

const directive: Directive = {
  created(el: HTMLElement, binding: BindingData): void {
    instance = new VueZoomImg(binding)
    instance.create(el)
  },
  updated(_el: HTMLElement, binding: BindingData): void {
    instance.update(binding)
  },
  unmounted(el: HTMLElement): void {
    instance.remove(el)
  },
}

const plugin = {
  install(app) {
    app.directive('zoom-img', directive)
  },
}

export { directive as vZoomImg, plugin as vZoomImgInstall }
