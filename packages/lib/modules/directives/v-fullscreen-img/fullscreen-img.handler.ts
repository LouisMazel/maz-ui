import type { DirectiveBinding } from 'vue'

import MazFullscreenImg from './MazFullscreenImg.vue'
import { mount } from './../../../modules'

export interface vFullscreenImgOptions {
  disabled?: boolean
  scaleOnHover?: boolean
  blurOnHover?: boolean
  zoom?: boolean
  animated?: boolean
  scaleAnimation?: boolean
}

interface vFullscreenImgBindingOptions extends vFullscreenImgOptions {
  src: string
  alt?: string | null
}

export type vFullscreenImgBinding = string | vFullscreenImgBindingOptions | undefined

export interface BindingData extends DirectiveBinding {
  value: vFullscreenImgBinding
}

const STATE_OPEN_CLASS = 'maz-fullscreen-is-open'

export class FullscreenImgHandler {
  private options: vFullscreenImgBindingOptions
  private defaultOptions: vFullscreenImgOptions = {
    scaleOnHover: false,
    blurOnHover: false,
    disabled: false,
    animated: true,
    zoom: true,
    scaleAnimation: false,
  }
  private mouseEnterListener: () => void
  private mouseLeaveListener: () => void
  private renderPreviewListener: () => void

  private buildOptions(el: HTMLElement, binding: BindingData): vFullscreenImgBindingOptions {
    const options =
      typeof binding.value === 'object' ? binding.value : { src: binding.value, alt: undefined }

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
    return [...document.querySelectorAll('.maz-fullscreen-img-instance')] as HTMLElement[]
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

  public create(el: HTMLElement, binding: BindingData) {
    this.options = this.buildOptions(el, binding)

    if (this.options.disabled) return

    el.style.cursor = 'move'

    if (this.options.scaleOnHover || this.options.blurOnHover) {
      el.style.transition = 'all 300ms ease-in-out'
    }

    /**
     * Set class & data attribute to use it with previous & next functions
     */
    el.classList.add('maz-fullscreen-img-instance')

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

  public update(el: HTMLElement, binding: BindingData): void {
    this.options = this.buildOptions(el, binding)
  }

  public remove(el: HTMLElement): void {
    el.removeEventListener('mouseenter', this.mouseEnterListener)
    el.removeEventListener('mouseleave', this.mouseLeaveListener)
    el.removeEventListener('click', this.renderPreviewListener)

    el.classList.remove('maz-fullscreen-img-instance')

    el.style.cursor = ''
  }

  private renderPreview(el: HTMLElement) {
    el.classList.add(STATE_OPEN_CLASS)

    return mount(MazFullscreenImg, {
      props: {
        ...this.options,
        openInstanceClass: STATE_OPEN_CLASS,
        clickedElement: el,
        clickedElementBounds: el.getBoundingClientRect(),
      } as unknown as Record<string, unknown>,
      addDestroyInProps: true,
    })
  }

  private mouseLeave(el: HTMLElement): void {
    if (this.options.scaleOnHover) el.style.transform = ''
    if (this.options.blurOnHover) el.style.filter = ''
    el.style.zIndex = ''
  }

  private mouseEnter(el: HTMLElement): void {
    el.style.zIndex = '1'
    if (this.options.scaleOnHover) el.style.transform = 'scale(1.05)'
    if (this.options.blurOnHover) el.style.filter = 'blur(3px)'
  }
}
