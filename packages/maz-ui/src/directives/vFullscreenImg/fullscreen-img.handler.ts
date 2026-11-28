import type { Component, ComponentInternalInstance, DirectiveBinding } from 'vue'
import { createVNode, defineComponent, h, nextTick, reactive, render } from 'vue'
import { getLightboxLabel } from '../../utils/lightboxLabels.ts'

export interface VFullscreenImgOptions {
  disabled?: boolean
  scaleOnHover?: boolean
  blurOnHover?: boolean
  zoom?: boolean
  offset?: number
  /**
   * Duration and easing of the grow from the thumbnail, the tokens of the theme by default
   */
  animation?: {
    duration?: number
    easing?: string
  }
  /**
   * Name of the group: the images with the same name are browsed together. Without it, the images of
   * the same container (the closest ancestor with `data-maz-lightbox-group`, else the parent element).
   */
  group?: string
  /**
   * Text under the image, `alt` by default
   */
  caption?: string
  /**
   * High-resolution image loaded when the lightbox is open (`src` is shown first)
   */
  fullSrc?: string
}

interface VFullscreenImgBindingOptions extends VFullscreenImgOptions {
  src: string
  alt?: string | null
}

export type VFullscreenImgBindingValue = string | VFullscreenImgBindingOptions | undefined

export type VFullscreenImgBinding = DirectiveBinding<VFullscreenImgBindingValue>

const INSTANCE_CLASS = 'm-fullscreen-img-instance'
const HIDDEN_CLASS = 'maz:invisible'
const GROUP_ATTRIBUTE = 'data-maz-lightbox-group'
const BASE_CLASSES = ['maz:cursor-zoom-in']
const HOVER_TIMING = 'calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, cubic-bezier(0.4, 0, 0.2, 1))'

function getHoverTransition(options: VFullscreenImgOptions | undefined) {
  const properties = [
    ...(options?.scaleOnHover ? ['scale', 'transform'] : []),
    ...(options?.blurOnHover ? ['filter'] : []),
  ]

  return properties.map(property => `${property} ${HOVER_TIMING}`).join(', ')
}

/**
 * Options of every element with the directive, to build the group of an open lightbox
 */
const registry = new WeakMap<HTMLElement, VFullscreenImgBindingOptions>()

let openLightbox: { destroy: () => void } | undefined

function getGroupKey(el: HTMLElement): string | Element | null {
  const group = registry.get(el)?.group

  return group ? `group:${group}` : (el.closest(`[${GROUP_ATTRIBUTE}]`) ?? el.parentElement)
}

function getGroupMembers(el: HTMLElement): HTMLElement[] {
  const key = getGroupKey(el)

  return [...document.querySelectorAll<HTMLElement>(`.${INSTANCE_CLASS}`)]
    .filter(member => member === el || (registry.has(member) && getGroupKey(member) === key))
}

function isNativelyFocusable(el: HTMLElement) {
  return el.matches('a[href], button, input, select, textarea, summary') || el.tabIndex >= 0
}

export class FullscreenImgHandler {
  private options: VFullscreenImgBindingOptions | undefined = undefined
  private defaultOptions: VFullscreenImgOptions = {
    scaleOnHover: false,
    blurOnHover: false,
    disabled: false,
    zoom: true,
    offset: 80,
  }

  private appContext: ComponentInternalInstance['appContext'] | undefined = undefined
  private appliedClasses: string[] = []
  private addedAttributes: string[] = []
  private active = false

  private clickListener: (() => void) | undefined = undefined
  private keydownListener: ((event: KeyboardEvent) => void) | undefined = undefined

  private buildOptions(
    el: HTMLElement,
    binding: VFullscreenImgBinding,
  ): VFullscreenImgBindingOptions {
    const options
      = typeof binding.value === 'object'
        ? binding.value
        : { src: binding.value, alt: undefined }

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
    return [
      ...document.querySelectorAll(`.${INSTANCE_CLASS}`),
    ] as HTMLElement[]
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
    this.appContext = binding.instance?.$.appContext

    if (this.options.disabled)
      return

    this.setup(el)
  }

  private setup(el: HTMLElement) {
    const options = this.options!

    registry.set(el, options)
    el.classList.add(INSTANCE_CLASS)
    this.applyClasses(el)

    el.setAttribute('data-src', this.getImgSrc(el))

    const alt = this.getImgAlt(el)
    if (alt) {
      el.setAttribute('data-alt', alt)
    }

    this.setAccessibility(el)

    if (!this.clickListener) {
      this.clickListener = () => this.open(el)
      this.keydownListener = (event: KeyboardEvent) => {
        if (event.target !== el || (event.key !== 'Enter' && event.key !== ' '))
          return

        event.preventDefault()
        this.open(el)
      }

      el.addEventListener('click', this.clickListener)
      el.addEventListener('keydown', this.keydownListener)
    }

    this.active = true
  }

  private applyClasses(el: HTMLElement) {
    el.classList.remove(...this.appliedClasses)

    const classes = [...BASE_CLASSES]
    if (this.options?.scaleOnHover)
      classes.push('maz:hover:scale-[1.04]')
    if (this.options?.blurOnHover)
      classes.push('maz:hover:blur-[0.1875rem]')

    this.appliedClasses = classes
    el.classList.add(...classes)

    const transition = getHoverTransition(this.options)
    if (transition)
      el.style.transition = transition
    else
      el.style.removeProperty('transition')
  }

  private setAccessibility(el: HTMLElement) {
    const setIfMissing = (name: string, value: string) => {
      if (el.hasAttribute(name))
        return

      el.setAttribute(name, value)
      this.addedAttributes.push(name)
    }

    if (!isNativelyFocusable(el))
      setIfMissing('tabindex', '0')

    if (!el.matches('a[href], button'))
      setIfMissing('role', 'button')

    setIfMissing('aria-haspopup', 'dialog')

    if (!this.getImgAlt(el))
      setIfMissing('aria-label', getLightboxLabel('lightbox.open'))
  }

  public update(el: HTMLElement, binding: VFullscreenImgBinding): void {
    this.options = this.buildOptions(el, binding)
    this.appContext = binding.instance?.$.appContext

    if (this.options.disabled) {
      if (this.active)
        this.teardown(el)
      return
    }

    if (this.active) {
      registry.set(el, this.options)
      this.applyClasses(el)
    }
    else {
      this.setup(el)
    }
  }

  public remove(el: HTMLElement): void {
    this.teardown(el)
  }

  private teardown(el: HTMLElement) {
    if (this.clickListener)
      el.removeEventListener('click', this.clickListener)
    if (this.keydownListener)
      el.removeEventListener('keydown', this.keydownListener)

    this.clickListener = undefined
    this.keydownListener = undefined

    el.classList.remove(INSTANCE_CLASS, HIDDEN_CLASS, ...this.appliedClasses)
    el.style.removeProperty('transition')
    for (const name of this.addedAttributes)
      el.removeAttribute(name)

    this.appliedClasses = []
    this.addedAttributes = []
    registry.delete(el)
    this.active = false
  }

  private async open(el: HTMLElement) {
    if (openLightbox || !this.options)
      return

    const members = getGroupMembers(el)
    const options = this.options
    const images = members.map((member) => {
      const memberOptions = registry.get(member)

      return {
        src: memberOptions?.src ?? '',
        alt: memberOptions?.alt ?? undefined,
        caption: memberOptions?.caption,
        fullSrc: memberOptions?.fullSrc,
      }
    })

    const placeholder = { destroy: () => {} }
    openLightbox = placeholder

    let MazLightbox: Component

    try {
      MazLightbox = (await import('../../components/MazLightbox.vue')).default
    }
    catch (error) {
      // A failed chunk (offline, new deploy) must not block the next clicks
      openLightbox = undefined
      throw error
    }

    const state = reactive({ open: true, index: Math.max(members.indexOf(el), 0) })
    const container = document.createElement('div')

    const setHidden = (hidden: boolean) => members[state.index]?.classList.toggle(HIDDEN_CLASS, hidden)

    const Wrapper = defineComponent({
      setup: () => () => h(MazLightbox as Component, {
        'modelValue': state.open,
        'onUpdate:modelValue': (value: boolean) => {
          state.open = value
        },
        'index': state.index,
        'onUpdate:index': (value: number) => {
          setHidden(false)
          state.index = value
          setHidden(true)
        },
        images,
        'origin': (index: number) => members[index],
        'zoom': options.zoom,
        'offset': options.offset,
        'animation': options.animation,
        'onEnter': () => setHidden(true),
        'onClose': () => {
          void nextTick(() => placeholder.destroy())
        },
      }),
    })

    const vnode = createVNode(Wrapper)
    if (this.appContext)
      vnode.appContext = this.appContext

    render(vnode, container)

    placeholder.destroy = () => {
      setHidden(false)
      for (const member of members)
        member.classList.remove(HIDDEN_CLASS)
      render(null, container)
      openLightbox = undefined
    }
  }
}
