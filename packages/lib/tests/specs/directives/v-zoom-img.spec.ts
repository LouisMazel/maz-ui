import type { vZoomImgBinding } from '@directives/vZoomImg/zoom-img.handler'
import { VueZoomImg } from '@directives/vZoomImg/zoom-img.handler'
import { sleep } from '@utils/sleep'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('given VueZoomImg class', () => {
  let vueZoomImg: VueZoomImg
  let mockElement: HTMLElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    document.body.appendChild(mockElement)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  describe('when instantiating with a string binding value', () => {
    it('then it should create an instance with default options', () => {
      const binding: vZoomImgBinding = {
        value: 'path/to/image.jpg',
        modifiers: {},
        oldValue: null,
        arg: undefined,
        instance: null,
        // @ts-expect-error - ignore
        dir: null,
      }

      vueZoomImg = new VueZoomImg(binding)

      // @ts-expect-error - Testing private properties
      expect(vueZoomImg.options).toEqual(expect.objectContaining({
        src: 'path/to/image.jpg',
        scale: true,
        blur: true,
        disabled: false,
      }))
    })
  })

  describe('when instantiating with an object binding value', () => {
    it('then it should create an instance with custom options', () => {
      const binding: vZoomImgBinding = {
        value: {
          src: 'path/to/image.jpg',
          alt: 'Test Image',
          scale: false,
          blur: false,
        },
        modifiers: {},
        oldValue: null,
        arg: undefined,
        instance: null,
        // @ts-expect-error - ignore
        dir: undefined,
      }

      vueZoomImg = new VueZoomImg(binding)

      // @ts-expect-error - Testing private properties
      expect(vueZoomImg.options).toEqual(expect.objectContaining({
        src: 'path/to/image.jpg',
        alt: 'Test Image',
        scale: false,
        blur: false,
        disabled: false,
      }))
    })
  })

  describe('when creating zoom functionality on an element', () => {
    beforeEach(() => {
      const binding: vZoomImgBinding = {
        value: 'path/to/image.jpg',
        modifiers: {},
        oldValue: null,
        arg: undefined,
        instance: null,
        // @ts-expect-error - ignore
        dir: null,
      }
      vueZoomImg = new VueZoomImg(binding)
    })

    it('then it should add appropriate attributes and event listeners', async () => {
      vueZoomImg.create(mockElement)

      expect(mockElement.style.cursor).toBe('pointer')
      await sleep(0)
      expect(mockElement.classList.contains('maz-zoom-img-instance')).toBe(true)
      expect(mockElement.getAttribute('data-zoom-src')).toBe('path/to/image.jpg')
      expect(mockElement.style.transition).toBe('all 300ms ease-in-out')
    })

    it('then it should not add functionality if disabled option is true', () => {
      // @ts-expect-error - Testing private properties
      vueZoomImg.options.disabled = true
      vueZoomImg.create(mockElement)

      expect(mockElement.style.cursor).not.toBe('pointer')
      expect(mockElement.classList.contains('maz-zoom-img-instance')).toBe(false)
    })
  })

  describe('when updating options', () => {
    it('then it should update the options object', () => {
      const initialBinding: vZoomImgBinding = {
        value: 'path/to/image.jpg',
        modifiers: {},
        oldValue: null,
        arg: undefined,
        instance: null,
        // @ts-expect-error - ignore
        dir: null,
      }
      vueZoomImg = new VueZoomImg(initialBinding)

      const updatedBinding: vZoomImgBinding = {
        value: {
          src: 'path/to/new-image.jpg',
          scale: false,
        },
        modifiers: {},
        oldValue: null,
        arg: undefined,
        instance: null,
        // @ts-expect-error - ignore
        dir: null,
      }

      vueZoomImg.update(updatedBinding)

      // @ts-expect-error - Testing private properties
      expect(vueZoomImg.options).toEqual(expect.objectContaining({
        src: 'path/to/new-image.jpg',
        scale: false,
        blur: true,
        disabled: false,
      }))
    })
  })

  describe('when removing zoom functionality', () => {
    beforeEach(() => {
      const binding: vZoomImgBinding = {
        value: 'path/to/image.jpg',
        modifiers: {},
        oldValue: null,
        arg: undefined,
        instance: null,
        // @ts-expect-error - ignore
        dir: null,
      }
      vueZoomImg = new VueZoomImg(binding)
      vueZoomImg.create(mockElement)
    })

    it('then it should remove attributes and event listeners', () => {
      vueZoomImg.remove(mockElement)

      expect(mockElement.classList.contains('maz-zoom-img-instance')).toBe(false)
      expect(mockElement.getAttribute('data-zoom-src')).toBe(null)
      expect(mockElement.style.cursor).toBe('')
    })
  })

  describe('when rendering preview', () => {
    beforeEach(() => {
      const binding: vZoomImgBinding = {
        value: 'path/to/image.jpg',
        modifiers: {},
        oldValue: null,
        arg: undefined,
        instance: null,
        // @ts-expect-error - ignore
        dir: null,
      }
      vueZoomImg = new VueZoomImg(binding)
      vueZoomImg.create(mockElement)
    })

    it('then it should create preview elements and add them to the DOM', () => {
      // @ts-expect-error - Testing private properties
      vueZoomImg.renderPreview(mockElement, { src: 'path/to/image.jpg', alt: 'Test Image' })

      const container = document.querySelector('#MazImgPreviewFullsize')
      expect(container).not.toBeNull()
      expect(container?.classList.contains('maz-zoom-img')).toBe(true)

      const img = document.querySelector('#MazImgElement') as HTMLImageElement
      expect(img).not.toBeNull()
      expect(img?.src).toContain('path/to/image.jpg')
      expect(img?.alt).toBe('Test Image')
    })
  })

  describe('when handling mouse events', () => {
    beforeEach(() => {
      const binding: vZoomImgBinding = {
        value: 'path/to/image.jpg',
        modifiers: {},
        oldValue: null,
        arg: undefined,
        instance: null,
        // @ts-expect-error - ignore
        dir: null,
      }
      vueZoomImg = new VueZoomImg(binding)
      vueZoomImg.create(mockElement)
    })

    describe('when mouse enters the element', () => {
      it('then it should apply scale and blur effects', () => {
        // @ts-expect-error - Testing private properties
        vueZoomImg.mouseEnter(mockElement)

        expect(mockElement.style.zIndex).toBe('1')
        expect(mockElement.style.transform).toBe('scale(1.1)')
        expect(mockElement.style.filter).toBe('blur(2px)')
      })

      it('then it should not apply effects if options are disabled', () => {
        // @ts-expect-error - Testing private properties
        vueZoomImg.options.scale = false
        // @ts-expect-error - Testing private properties
        vueZoomImg.options.blur = false
        // @ts-expect-error - Testing private properties
        vueZoomImg.mouseEnter(mockElement)

        expect(mockElement.style.transform).toBe('')
        expect(mockElement.style.filter).toBe('')
      })
    })

    describe('when mouse leaves the element', () => {
      it('then it should remove scale and blur effects', () => {
        // @ts-expect-error - Testing private properties
        vueZoomImg.mouseLeave(mockElement)

        expect(mockElement.style.transform).toBe('')
        expect(mockElement.style.filter).toBe('')
        expect(mockElement.style.zIndex).toBe('')
      })
    })
  })

  describe('when handling keyboard events', () => {
    beforeEach(() => {
      const binding: vZoomImgBinding = {
        value: 'path/to/image.jpg',
        modifiers: {},
        oldValue: null,
        arg: undefined,
        instance: null,
        // @ts-expect-error - ignore
        dir: null,
      }
      vueZoomImg = new VueZoomImg(binding)
      vi.spyOn(vueZoomImg as any, 'closePreview')
      vi.spyOn(vueZoomImg as any, 'nextPreviousImage')
    })

    it('then it should close preview on Escape key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      // @ts-expect-error - Testing private properties
      vueZoomImg.keydownLister(event)
      // @ts-expect-error - Testing private properties
      expect(vueZoomImg.closePreview).toHaveBeenCalled()
    })

    it('then it should close preview on Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' })
      // @ts-expect-error - Testing private properties
      vueZoomImg.keydownLister(event)
      // @ts-expect-error - Testing private properties
      expect(vueZoomImg.closePreview).toHaveBeenCalled()
    })

    it('then it should navigate to next image on ArrowRight key', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      // @ts-expect-error - Testing private properties
      vueZoomImg.keydownLister(event)
      // @ts-expect-error - Testing private properties
      expect(vueZoomImg.nextPreviousImage).toHaveBeenCalledWith(true)
    })

    it('then it should navigate to previous image on ArrowLeft key', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      // @ts-expect-error - Testing private properties
      vueZoomImg.keydownLister(event)
      // @ts-expect-error - Testing private properties
      expect(vueZoomImg.nextPreviousImage).toHaveBeenCalledWith(false)
    })
  })

  describe('when navigating between images', () => {
    beforeEach(() => {
      const binding: vZoomImgBinding = {
        value: 'path/to/image.jpg',
        modifiers: {},
        oldValue: null,
        arg: undefined,
        instance: null,
        // @ts-expect-error - ignore
        dir: null,
      }
      vueZoomImg = new VueZoomImg(binding)

      // Create multiple instances
      for (let i = 0; i < 3; i++) {
        const el = document.createElement('div')
        el.classList.add('maz-zoom-img-instance')
        el.setAttribute('data-zoom-src', `path/to/image${i}.jpg`)
        document.body.appendChild(el)
      }

      document.querySelector('.maz-zoom-img-instance')?.classList.add('maz-is-open')
    })

    it('then it should navigate to the next image', () => {
      // @ts-expect-error - Testing private properties
      vueZoomImg.nextPreviousImage(true)

      const openInstance = document.querySelector('.maz-zoom-img-instance.maz-is-open')
      expect(openInstance?.getAttribute('data-zoom-src')).toBe('path/to/image1.jpg')
    })

    it('then it should navigate to the previous image', () => {
      // @ts-expect-error - Testing private properties
      vueZoomImg.nextPreviousImage(false)

      const openInstance = document.querySelector('.maz-zoom-img-instance.maz-is-open')
      expect(openInstance?.getAttribute('data-zoom-src')).toBe('path/to/image2.jpg')
    })

    it('then it should loop to the first image when reaching the end', () => {
      // @ts-expect-error - Testing private properties
      vueZoomImg.nextPreviousImage(true)
      // @ts-expect-error - Testing private properties
      vueZoomImg.nextPreviousImage(true)
      // @ts-expect-error - Testing private properties
      vueZoomImg.nextPreviousImage(true)

      const openInstance = document.querySelector('.maz-zoom-img-instance.maz-is-open')
      expect(openInstance?.getAttribute('data-zoom-src')).toBe('path/to/image0.jpg')
    })
  })

  describe('when closing the preview', () => {
    beforeEach(() => {
      const binding: vZoomImgBinding = {
        value: 'path/to/image.jpg',
        modifiers: {},
        oldValue: null,
        arg: undefined,
        instance: null,
        // @ts-expect-error - ignore
        dir: null,
      }
      vueZoomImg = new VueZoomImg(binding)

      // Setup DOM for closing preview
      const container = document.createElement('div')
      container.id = 'MazImgPreviewFullsize'
      document.body.appendChild(container)

      const style = document.createElement('style')
      style.id = 'MazPreviewStyle'
      document.head.appendChild(style)

      const instance = document.createElement('div')
      instance.classList.add('maz-zoom-img-instance', 'maz-is-open')
      document.body.appendChild(instance)

      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('then it should remove preview elements and classes', () => {
      // @ts-expect-error - Testing private properties
      vueZoomImg.closePreview()

      vi.runAllTimers()

      expect(document.querySelector('#MazImgPreviewFullsize')).toBeNull()
      expect(document.querySelector('.maz-zoom-img-instance.maz-is-open')).toBeNull()
    })
  })
})
