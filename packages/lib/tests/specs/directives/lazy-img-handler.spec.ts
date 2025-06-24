import { DEFAULT_OPTIONS, LazyImg } from '@directives/vLazyImg/lazy-img.handler'

class IntersectionObserverMock {
  callback: IntersectionObserverCallback
  options: IntersectionObserverInit

  constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
  }

  observe(target: Element) {
    this.callback([{ target, isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  }

  unobserve() {
    //
  }

  disconnect() {
    //
  }
}

globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver

describe('given LazyImg handler', () => {
  let lazyImg: LazyImg
  let mockElement: HTMLElement
  let mockBinding: any

  beforeEach(() => {
    vi.useFakeTimers()
    lazyImg = new LazyImg()
    mockElement = document.createElement('img')
    mockBinding = {
      value: 'https://example.com/image.jpg',
    }

    vi.spyOn(window, 'IntersectionObserver').mockImplementation(callback => ({
      observe: vi.fn(target => callback([{ target, isIntersecting: true } as IntersectionObserverEntry], {
        observe: vi.fn(target => callback([{ target, isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver)),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      } as unknown as IntersectionObserver)),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    } as unknown as IntersectionObserver))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('when initializing with default options', () => {
    it('then it should use the default options', () => {
      // @ts-expect-error - Testing private method
      expect(lazyImg.options).toEqual(DEFAULT_OPTIONS)
    })
  })

  describe('when adding an element', () => {
    it('then it should set the base class and empty photo', async () => {
      await lazyImg.add(mockElement, {
        ...mockBinding,
        value: undefined,
      })

      vi.advanceTimersByTime(1000)

      expect(mockElement.classList.contains(DEFAULT_OPTIONS.baseClass)).toBe(true)
      expect(mockElement.getAttribute('src')).toBe('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
    })

    it('then it set the provided image url', async () => {
      await lazyImg.add(mockElement, {
        ...mockBinding,
      })

      vi.advanceTimersByTime(1000)

      expect(mockElement.classList.contains(DEFAULT_OPTIONS.baseClass)).toBe(true)
      expect(mockElement.getAttribute('src')).toBe('https://example.com/image.jpg')
    })

    it('then it should create an IntersectionObserver', async () => {
      await lazyImg.add(mockElement, mockBinding)

      expect(window.IntersectionObserver).toHaveBeenCalled()
    })
  })

  describe('when updating an element', () => {
    it('then it should remove all state classes and reload the image if the value has changed', async () => {
      await lazyImg.add(mockElement, mockBinding)
      mockBinding.oldValue = mockBinding.value
      mockBinding.value = 'https://example.com/new-image.jpg'

      await lazyImg.update(mockElement, mockBinding)

      vi.advanceTimersByTime(10000)

      expect(mockElement.classList.contains(DEFAULT_OPTIONS.loadedClass)).toBe(false)
      expect(mockElement.classList.contains(DEFAULT_OPTIONS.errorClass)).toBe(false)
    })

    it('then it should not reload the image if the value has not changed', async () => {
      await lazyImg.add(mockElement, mockBinding)
      mockBinding.oldValue = mockBinding.value

      await lazyImg.update(mockElement, mockBinding)

      expect(window.IntersectionObserver).toHaveBeenCalledTimes(1)
    })
  })

  describe('when removing an element', () => {
    it('then it should remove all state classes and background image', async () => {
      await lazyImg.add(mockElement, { ...mockBinding, arg: 'bg-image' })

      lazyImg.remove(mockElement, mockBinding)

      expect(mockElement.classList.contains(DEFAULT_OPTIONS.loadedClass)).toBe(false)
      expect(mockElement.classList.contains(DEFAULT_OPTIONS.loadingClass)).toBe(false)
      expect(mockElement.classList.contains(DEFAULT_OPTIONS.errorClass)).toBe(false)
      expect(mockElement.style.backgroundImage).toBe('url("https://example.com/image.jpg")')
    })
  })

  describe('when handling a background image', () => {
    it('then it should set the background image style', async () => {
      const bgImageBinding = { ...mockBinding, arg: 'bg-image' }
      await lazyImg.add(mockElement, bgImageBinding)

      expect(mockElement.style.backgroundImage).toBe(`url("${mockBinding.value}")`)
    })
  })

  describe('when handling a picture element', () => {
    let pictureElement: HTMLPictureElement
    let imgElement: HTMLImageElement
    let sourceElement: HTMLSourceElement

    beforeEach(() => {
      pictureElement = document.createElement('picture')
      imgElement = document.createElement('img')
      sourceElement = document.createElement('source')
      sourceElement.setAttribute('data-lazy-srcset', 'image1.jpg 1x, image2.jpg 2x')
      pictureElement.appendChild(sourceElement)
      pictureElement.appendChild(imgElement)
    })

    it('then it should set the srcset for source elements', async () => {
      await lazyImg.add(pictureElement, mockBinding)

      expect(sourceElement.srcset).toBe('image1.jpg 1x, image2.jpg 2x')
    })
  })

  describe('when an image fails to load', () => {
    it('then it should add the error class and try to set a default photo', async () => {
      await lazyImg.add(mockElement, mockBinding)

      mockElement.dispatchEvent(new ErrorEvent('error'))

      expect(mockElement.classList.contains(DEFAULT_OPTIONS.errorClass)).toBe(true)
    })
  })
})
