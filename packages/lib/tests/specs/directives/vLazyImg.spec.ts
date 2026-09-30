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

    // eslint-disable-next-line prefer-arrow-callback
    vi.spyOn(globalThis, 'IntersectionObserver').mockImplementation(function (callback: IntersectionObserverCallback) {
      return {
        // eslint-disable-next-line prefer-arrow-callback
        observe: vi.fn(function (target: Element) {
          callback([{ target, isIntersecting: true } as IntersectionObserverEntry], {

            observe: vi.fn(function (target: Element) { callback([{ target, isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver) }),
            unobserve: vi.fn(),
            disconnect: vi.fn(),
          } as unknown as IntersectionObserver)
        }),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      } as unknown as IntersectionObserver
    })
  })

  afterEach(async () => {
    await vi.runAllTimersAsync()
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

      expect(globalThis.IntersectionObserver).toHaveBeenCalled()
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

      expect(globalThis.IntersectionObserver).toHaveBeenCalledTimes(1)
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

      await vi.runAllTimersAsync()
      await Promise.resolve()

      expect(mockElement.classList.contains(DEFAULT_OPTIONS.errorClass)).toBe(true)
    })
  })
})

class ControllableObserver {
  static readonly instances: ControllableObserver[] = []
  observed = new Set<Element>()
  disconnected = false

  constructor(public callback: IntersectionObserverCallback, public options?: IntersectionObserverInit) {
    ControllableObserver.instances.push(this)
  }

  observe(target: Element) {
    this.observed.add(target)
  }

  unobserve(target: Element) {
    this.observed.delete(target)
  }

  disconnect() {
    this.disconnected = true
    this.observed.clear()
  }

  takeRecords() {
    return []
  }
}

describe('given LazyImg handler with pooled observers', () => {
  beforeEach(() => {
    ControllableObserver.instances.length = 0
    globalThis.IntersectionObserver = ControllableObserver as unknown as typeof IntersectionObserver
  })

  describe('when several elements share the same observer options', () => {
    it('then it reuses a single IntersectionObserver', () => {
      const lazyImg = new LazyImg()
      const first = document.createElement('img')
      const second = document.createElement('img')

      lazyImg.add(first, { value: 'https://example.com/a.jpg' } as any)
      lazyImg.add(second, { value: 'https://example.com/b.jpg' } as any)

      expect(ControllableObserver.instances).toHaveLength(1)
      expect(ControllableObserver.instances[0].observed.has(first)).toBe(true)
      expect(ControllableObserver.instances[0].observed.has(second)).toBe(true)
    })
  })

  describe('when removing one element among several', () => {
    it('then it keeps observing the others and disconnects once empty', () => {
      const lazyImg = new LazyImg()
      const first = document.createElement('img')
      const second = document.createElement('img')
      lazyImg.add(first, { value: 'https://example.com/a.jpg' } as any)
      lazyImg.add(second, { value: 'https://example.com/b.jpg' } as any)
      const [observer] = ControllableObserver.instances

      lazyImg.remove(first, { value: 'https://example.com/a.jpg' } as any)

      expect(observer.disconnected).toBe(false)
      expect(observer.observed.has(second)).toBe(true)

      lazyImg.remove(second, { value: 'https://example.com/b.jpg' } as any)

      expect(observer.disconnected).toBe(true)
    })
  })

  describe('when the disabled option is set', () => {
    it('then it loads the image immediately without an observer', () => {
      const lazyImg = new LazyImg()
      const element = document.createElement('img')

      lazyImg.add(element, { value: { disabled: true, src: 'https://example.com/a.jpg' } } as any)

      expect(ControllableObserver.instances).toHaveLength(0)
      expect(element.getAttribute('src')).toBe('https://example.com/a.jpg')
    })

    it('then it removes a disabled element without an observer', () => {
      const lazyImg = new LazyImg()
      const element = document.createElement('img')

      lazyImg.add(element, { value: { disabled: true, src: 'https://example.com/a.jpg' } } as any)

      expect(() => lazyImg.remove(element, { value: { disabled: true } } as any)).not.toThrow()
    })
  })

  describe('when using bg-image mode on a picture element', () => {
    it('then it throws', () => {
      const lazyImg = new LazyImg()
      const picture = document.createElement('picture')

      expect(() => lazyImg.add(picture, { value: 'x', arg: 'bg-image' } as any)).toThrow()
    })
  })

  describe('when update is called before add', () => {
    it('then it adds the element', () => {
      const lazyImg = new LazyImg()
      const element = document.createElement('img')

      lazyImg.update(element, { value: 'https://example.com/a.jpg', oldValue: undefined } as any)

      expect(ControllableObserver.instances).toHaveLength(1)
    })
  })

  describe('when an intersection entry is not intersecting', () => {
    it('then it does not load the image', () => {
      const lazyImg = new LazyImg()
      const element = document.createElement('img')
      lazyImg.add(element, { value: 'https://example.com/a.jpg' } as any)
      const [observer] = ControllableObserver.instances

      observer.callback([{ target: element, isIntersecting: false } as any], observer as any)

      expect(element.classList.contains('m-lazy-loading')).toBe(false)
    })
  })

  describe('when an intersection targets an unknown element', () => {
    it('then it is ignored', () => {
      const lazyImg = new LazyImg()
      const element = document.createElement('img')
      lazyImg.add(element, { value: 'https://example.com/a.jpg' } as any)
      const [observer] = ControllableObserver.instances
      const unknown = document.createElement('img')

      expect(() => observer.callback([{ target: unknown, isIntersecting: true } as any], observer as any)).not.toThrow()
    })
  })

  describe('when loadOnce is set and the image is already loaded', () => {
    it('then it does not reload on the next intersection', () => {
      const lazyImg = new LazyImg()
      const element = document.createElement('img')
      lazyImg.add(element, { value: { src: 'https://example.com/a.jpg', loadOnce: true, observerOnce: false } } as any)
      const [observer] = ControllableObserver.instances

      observer.callback([{ target: element, isIntersecting: true } as any], observer as any)
      element.dispatchEvent(new Event('load'))
      const srcAfterFirstLoad = element.src

      observer.callback([{ target: element, isIntersecting: true } as any], observer as any)

      expect(element.classList.contains('m-lazy-loaded')).toBe(true)
      expect(element.src).toBe(srcAfterFirstLoad)
    })
  })

  describe('when observer options define a root element', () => {
    it('then it pools observers per root', () => {
      const lazyImg = new LazyImg()
      const root = document.createElement('div')
      const first = document.createElement('img')
      const second = document.createElement('img')

      lazyImg.add(first, { value: { src: 'a', observerOptions: { root, threshold: 0.1 } } } as any)
      lazyImg.add(second, { value: { src: 'b', observerOptions: { root, threshold: 0.1 } } } as any)

      expect(ControllableObserver.instances).toHaveLength(1)
      expect(ControllableObserver.instances[0].options?.root).toBe(root)
    })
  })

  describe('when the element carries a data-lazy-src attribute', () => {
    it('then it uses it as the image url', () => {
      const lazyImg = new LazyImg()
      const element = document.createElement('img')
      element.setAttribute('data-lazy-src', 'https://example.com/data.jpg')
      lazyImg.add(element, { value: undefined } as any)
      const [observer] = ControllableObserver.instances

      observer.callback([{ target: element, isIntersecting: true } as any], observer as any)

      expect(element.src).toContain('https://example.com/data.jpg')
    })
  })

  describe('when a picture has no source', () => {
    it('then it errors', () => {
      const lazyImg = new LazyImg()
      const picture = document.createElement('picture')
      picture.appendChild(document.createElement('img'))
      lazyImg.add(picture, { value: { src: 'x', fallbackSrc: false } } as any)
      const [observer] = ControllableObserver.instances

      observer.callback([{ target: picture, isIntersecting: true } as any], observer as any)

      expect(picture.classList.contains('m-lazy-error')).toBe(true)
    })

    it('then it applies a string fallbackSrc to the img element', async () => {
      const lazyImg = new LazyImg()
      const picture = document.createElement('picture')
      const img = document.createElement('img')
      picture.appendChild(img)
      lazyImg.add(picture, { value: { fallbackSrc: 'https://example.com/fallback.jpg' } } as any)
      const [observer] = ControllableObserver.instances

      observer.callback([{ target: picture, isIntersecting: true } as any], observer as any)
      await Promise.resolve()

      expect(img.src).toBe('https://example.com/fallback.jpg')
      expect(picture.classList.contains('m-lazy-fallback')).toBe(true)
    })

    it('then it applies the default no-image photo to the img element', async () => {
      const lazyImg = new LazyImg()
      const picture = document.createElement('picture')
      const img = document.createElement('img')
      picture.appendChild(img)
      lazyImg.add(picture, { value: {} } as any)
      const [observer] = ControllableObserver.instances

      observer.callback([{ target: picture, isIntersecting: true } as any], observer as any)

      await vi.waitFor(() => {
        expect(img.getAttribute('src')).not.toBe('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
      })
      expect(picture.classList.contains('m-lazy-error')).toBe(true)
    })
  })

  describe('when a picture source lacks data-lazy-srcset', () => {
    it('then it errors', () => {
      const lazyImg = new LazyImg()
      const picture = document.createElement('picture')
      picture.appendChild(document.createElement('source'))
      picture.appendChild(document.createElement('img'))
      lazyImg.add(picture, { value: { src: 'x', fallbackSrc: false } } as any)
      const [observer] = ControllableObserver.instances

      observer.callback([{ target: picture, isIntersecting: true } as any], observer as any)

      expect(picture.classList.contains('m-lazy-error')).toBe(true)
    })
  })

  describe('when a picture has no img child', () => {
    it('then it still sets the source srcset', () => {
      const lazyImg = new LazyImg()
      const picture = document.createElement('picture')
      const source = document.createElement('source')
      source.setAttribute('data-lazy-srcset', 'https://example.com/a.jpg')
      picture.appendChild(source)
      lazyImg.add(picture, { value: 'x' } as any)
      const [observer] = ControllableObserver.instances

      observer.callback([{ target: picture, isIntersecting: true } as any], observer as any)

      expect(source.srcset).toBe('https://example.com/a.jpg')
    })
  })

  describe('when a string fallbackSrc is provided on error', () => {
    it('then it applies it to a plain img', async () => {
      const lazyImg = new LazyImg()
      const element = document.createElement('img')
      lazyImg.add(element, { value: { src: 'https://example.com/a.jpg', fallbackSrc: 'https://example.com/fallback.jpg' } } as any)
      const [observer] = ControllableObserver.instances

      observer.callback([{ target: element, isIntersecting: true } as any], observer as any)
      element.dispatchEvent(new Event('error'))
      await Promise.resolve()

      expect(element.src).toBe('https://example.com/fallback.jpg')
      expect(element.classList.contains('m-lazy-fallback')).toBe(true)
    })

    it('then it applies it to picture sources', async () => {
      const lazyImg = new LazyImg()
      const picture = document.createElement('picture')
      picture.appendChild(document.createElement('source'))
      picture.appendChild(document.createElement('img'))
      lazyImg.add(picture, { value: { src: 'x', fallbackSrc: 'https://example.com/fallback.jpg' } } as any)
      const [observer] = ControllableObserver.instances

      observer.callback([{ target: picture, isIntersecting: true } as any], observer as any)
      await Promise.resolve()

      expect(picture.classList.contains('m-lazy-fallback')).toBe(true)
      expect(picture.querySelector('source')?.srcset).toBe('https://example.com/fallback.jpg')
    })
  })

  describe('when the observer is already gone from the pool', () => {
    it('then unobserve is a no-op', () => {
      const lazyImg = new LazyImg()
      const element = document.createElement('img')
      lazyImg.add(element, { value: 'https://example.com/a.jpg' } as any)
      ;(lazyImg as any).pool.clear()

      expect(() => lazyImg.remove(element, { value: 'https://example.com/a.jpg' } as any)).not.toThrow()
    })
  })
})
