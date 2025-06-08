import type { DirectiveBinding } from 'vue'

import type { MazFullscreenImgProps } from './MazFullscreenImg.vue'
import { useMountComponent } from '../../composables/useMountComponent'
import MazFullscreenImg from './MazFullscreenImg.vue'

export interface VFullscreenImgOptions {
  disabled?: boolean
  scaleOnHover?: boolean
  blurOnHover?: boolean
  zoom?: boolean
  offset?: number
  animation?: {
    duration?: number
    easing?: string
  }
}

interface VFullscreenImgBindingOptions extends VFullscreenImgOptions {
  src: string
  alt?: string | null
}

export type VFullscreenImgBindingValue = string | VFullscreenImgBindingOptions | undefined

export type VFullscreenImgBinding = DirectiveBinding<VFullscreenImgBindingValue>

const STATE_OPEN_CLASS = 'm-fullscreen-is-open'

export class FullscreenImgHandler {
  private options: VFullscreenImgBindingOptions
  private defaultOptions: VFullscreenImgOptions = {
    scaleOnHover: false,
    blurOnHover: false,
    disabled: false,
    zoom: true,
    offset: 80,
    animation: {
      duration: 300,
      easing: 'ease-in-out',
    },
  }

  private mouseEnterListener: () => void
  private mouseLeaveListener: () => void
  private renderPreviewListener: () => void

  private buildOptions(
    el: HTMLElement,
    binding: VFullscreenImgBinding,
  ): VFullscreenImgBindingOptions {
    const options
      = typeof binding.value === 'object' ? binding.value : { src: binding.value, alt: undefined }

    const src = options?.src ?? this.getImgSrc(el)
    const alt = options?.alt ?? this.getImgAlt(el)

    return {
      ...this.defaultOptions,
      ...options,
      src,
      alt,
    }
  }

  get allInstances(): HTMLElement[] {
    return [...document.querySelectorAll('.m-fullscreen-img-instance')] as HTMLElement[]
  }

  private getImgSrc(el: HTMLElement) {
    const imgSrc = this.options?.src || el.getAttribute('src') || el.getAttribute('data-src')

    if (!imgSrc) {
      throw new Error(
        '[maz-ui](fullscreen-img) src of image must be provided by `v-fullscreen=""`, `v-fullscreen="{ src: "" }"`, `src=""` or `data-src=""` atributes',
      )
    }

    return imgSrc
  }

  private getImgAlt(el: HTMLElement) {
    return this.options?.alt || el.getAttribute('alt') || el.getAttribute('data-alt')
  }

  public create(el: HTMLElement, binding: VFullscreenImgBinding) {
    this.options = this.buildOptions(el, binding)

    if (this.options.disabled)
      return

    el.style.cursor = 'move'

    if (this.options.scaleOnHover || this.options.blurOnHover) {
      el.style.transition = 'all 200ms ease-in-out'
    }

    /**
     * Set class & data attribute to use it with previous & next functions
     */
    el.classList.add('m-fullscreen-img-instance')

    el.setAttribute('data-src', this.getImgSrc(el))

    const alt = this.getImgAlt(el)
    if (alt) {
      el.setAttribute('data-alt', alt)
    }

    this.mouseEnterListener = () => this.mouseEnter(el)
    this.mouseLeaveListener = () => this.mouseLeave(el)
    this.renderPreviewListener = () => this.renderPreview(el)

    el.addEventListener('mouseenter', this.mouseEnterListener)
    el.addEventListener('mouseleave', this.mouseLeaveListener)
    el.addEventListener('click', this.renderPreviewListener)
  }

  public update(el: HTMLElement, binding: VFullscreenImgBinding): void {
    this.options = this.buildOptions(el, binding)
  }

  public remove(el: HTMLElement): void {
    el.removeEventListener('mouseenter', this.mouseEnterListener)
    el.removeEventListener('mouseleave', this.mouseLeaveListener)
    el.removeEventListener('click', this.renderPreviewListener)

    el.classList.remove('m-fullscreen-img-instance')

    el.style.cursor = ''
  }

  private renderPreview(el: HTMLElement) {
    el.classList.add(STATE_OPEN_CLASS)

    return useMountComponent<typeof MazFullscreenImg, MazFullscreenImgProps>(MazFullscreenImg, {
      props: {
        ...this.options,
        openInstanceClass: STATE_OPEN_CLASS,
        clickedElement: el,
        clickedElementBounds: el.getBoundingClientRect(),
      },
      element: document.body,
    })
  }

  private mouseLeave(el: HTMLElement): void {
    if (this.options.scaleOnHover)
      el.style.transform = ''
    if (this.options.blurOnHover)
      el.style.filter = ''
    el.style.zIndex = ''
  }

  private mouseEnter(el: HTMLElement): void {
    el.style.zIndex = '1'
    if (this.options.scaleOnHover)
      el.style.transform = 'scale(1.04)'
    if (this.options.blurOnHover)
      el.style.filter = 'blur(3px)'
  }
}
