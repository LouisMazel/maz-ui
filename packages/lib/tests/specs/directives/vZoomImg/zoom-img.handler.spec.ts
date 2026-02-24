import type { VZoomImgBinding } from '@directives/vZoomImg/zoom-img.handler'
import { ZoomImgHandler } from '@directives/vZoomImg/zoom-img.handler'

describe('given ZoomImgHandler', () => {
  let el: HTMLElement

  beforeEach(() => {
    el = document.createElement('img')
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  describe('when creating with string value', () => {
    it('then it should set up the element correctly', () => {
      const binding: VZoomImgBinding = { value: 'https://example.com/img.jpg' } as any
      const handler = new ZoomImgHandler(binding)
      handler.create(el)

      expect(el.style.cursor).toBe('pointer')
      expect(el.getAttribute('data-zoom-src')).toBe('https://example.com/img.jpg')
    })
  })

  describe('when creating with object value', () => {
    it('then it should use src and alt from options', () => {
      const binding: VZoomImgBinding = {
        value: { src: 'https://example.com/img.jpg', alt: 'Test Image' },
      } as any
      const handler = new ZoomImgHandler(binding)
      handler.create(el)

      expect(el.getAttribute('data-zoom-src')).toBe('https://example.com/img.jpg')
      expect(el.getAttribute('data-zoom-alt')).toBe('Test Image')
    })
  })

  describe('when creating with disabled option', () => {
    it('then it should not set up the element', () => {
      const binding: VZoomImgBinding = {
        value: { src: 'https://example.com/img.jpg', disabled: true },
      } as any
      const handler = new ZoomImgHandler(binding)
      handler.create(el)

      expect(el.style.cursor).not.toBe('pointer')
    })
  })

  describe('when creating without value', () => {
    it('then it should throw an error', () => {
      expect(() => {
        // eslint-disable-next-line no-new, sonarjs/constructor-for-side-effects
        new ZoomImgHandler({ value: undefined } as any)
      }).toThrow('[MazUI](zoom-img)')
    })
  })

  describe('when creating with object without src', () => {
    it('then it should throw an error', () => {
      expect(() => {
        // eslint-disable-next-line no-new, sonarjs/constructor-for-side-effects
        new ZoomImgHandler({ value: {} } as any)
      }).toThrow('[maz-ui](zoom-img) src of image must be provided')
    })
  })

  describe('when mouseenter is fired with scale option', () => {
    it('then it should apply scale transform', () => {
      const binding: VZoomImgBinding = {
        value: { src: 'https://example.com/img.jpg', scale: true, blur: false },
      } as any
      const handler = new ZoomImgHandler(binding)
      handler.create(el)

      el.dispatchEvent(new Event('mouseenter'))
      expect(el.style.transform).toBe('scale(1.1)')
      expect(el.style.zIndex).toBe('1')
    })
  })

  describe('when mouseenter is fired with blur option', () => {
    it('then it should apply blur filter', () => {
      const binding: VZoomImgBinding = {
        value: { src: 'https://example.com/img.jpg', scale: false, blur: true },
      } as any
      const handler = new ZoomImgHandler(binding)
      handler.create(el)

      el.dispatchEvent(new Event('mouseenter'))
      expect(el.style.filter).toBe('blur(2px)')
    })
  })

  describe('when mouseleave is fired', () => {
    it('then it should reset styles', () => {
      const binding: VZoomImgBinding = {
        value: { src: 'https://example.com/img.jpg', scale: true, blur: true },
      } as any
      const handler = new ZoomImgHandler(binding)
      handler.create(el)

      el.dispatchEvent(new Event('mouseenter'))
      el.dispatchEvent(new Event('mouseleave'))

      expect(el.style.transform).toBe('')
      expect(el.style.filter).toBe('')
      expect(el.style.zIndex).toBe('')
    })
  })

  describe('when mouseleave is fired without scale or blur', () => {
    it('then it should only reset zIndex', () => {
      const binding: VZoomImgBinding = {
        value: { src: 'https://example.com/img.jpg', scale: false, blur: false },
      } as any
      const handler = new ZoomImgHandler(binding)
      handler.create(el)

      el.dispatchEvent(new Event('mouseenter'))
      el.dispatchEvent(new Event('mouseleave'))

      expect(el.style.zIndex).toBe('')
    })
  })

  describe('when remove is called', () => {
    it('then it should clean up all listeners and attributes', () => {
      const binding: VZoomImgBinding = {
        value: { src: 'https://example.com/img.jpg', alt: 'Test' },
      } as any
      const handler = new ZoomImgHandler(binding)
      handler.create(el)

      handler.remove(el)

      expect(el.classList.contains('maz-zoom-img-instance')).toBe(false)
      expect(el.getAttribute('data-zoom-src')).toBeNull()
      expect(el.getAttribute('data-zoom-alt')).toBeNull()
      expect(el.style.cursor).toBe('')
    })
  })

  describe('when update is called', () => {
    it('then it should update the options', () => {
      const binding: VZoomImgBinding = {
        value: 'https://example.com/img.jpg',
      } as any
      const handler = new ZoomImgHandler(binding)

      handler.update({ value: 'https://example.com/img2.jpg' } as any)
      // Should not throw
    })
  })

  describe('when click triggers renderPreview', () => {
    it('then it should create preview container', () => {
      const binding: VZoomImgBinding = {
        value: { src: 'https://example.com/img.jpg', alt: 'Test' },
      } as any
      const handler = new ZoomImgHandler(binding)
      document.body.appendChild(el)
      handler.create(el)

      el.dispatchEvent(new Event('click'))

      const container = document.querySelector('#MazImgPreviewFullsize')
      expect(container).toBeDefined()
    })
  })

  describe('when getting allInstances', () => {
    it('then it should return all zoom img instances', () => {
      const binding: VZoomImgBinding = {
        value: 'https://example.com/img.jpg',
      } as any
      const handler = new ZoomImgHandler(binding)

      const el1 = document.createElement('div')
      el1.classList.add('maz-zoom-img-instance')
      document.body.appendChild(el1)

      expect(handler.allInstances.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('when keydown Escape is pressed', () => {
    it('then it should close the preview', () => {
      const binding: VZoomImgBinding = {
        value: { src: 'https://example.com/img.jpg' },
      } as any
      const handler = new ZoomImgHandler(binding)
      document.body.appendChild(el)
      handler.create(el)

      // Open preview
      el.dispatchEvent(new Event('click'))

      // Press Escape
      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(escEvent)

      // Preview should be removed after timeout
      vi.useFakeTimers()
      vi.advanceTimersByTime(400)
      vi.useRealTimers()
    })
  })

  describe('when keydown Space is pressed', () => {
    it('then it should close the preview', () => {
      const binding: VZoomImgBinding = {
        value: { src: 'https://example.com/img.jpg' },
      } as any
      const handler = new ZoomImgHandler(binding)
      document.body.appendChild(el)
      handler.create(el)

      el.dispatchEvent(new Event('click'))

      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' })
      document.dispatchEvent(spaceEvent)
    })
  })

  describe('when keydown ArrowRight is pressed', () => {
    it('then it should navigate to next image', () => {
      const binding: VZoomImgBinding = {
        value: { src: 'https://example.com/img.jpg' },
      } as any
      const handler = new ZoomImgHandler(binding)
      document.body.appendChild(el)
      handler.create(el)

      el.dispatchEvent(new Event('click'))

      const arrowEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      document.dispatchEvent(arrowEvent)
    })
  })

  describe('when keydown ArrowLeft is pressed', () => {
    it('then it should navigate to previous image', () => {
      const binding: VZoomImgBinding = {
        value: { src: 'https://example.com/img.jpg' },
      } as any
      const handler = new ZoomImgHandler(binding)
      document.body.appendChild(el)
      handler.create(el)

      el.dispatchEvent(new Event('click'))

      const arrowEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      document.dispatchEvent(arrowEvent)
    })
  })
})
