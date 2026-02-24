import type { App } from 'vue'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { AosHandler, AosPlugin } from '@plugins/aos'
import { vi } from 'vitest'

vi.mock('@maz-ui/utils/helpers/sleep', () => ({
  sleep: vi.fn(),
}))
vi.mock('@maz-ui/utils/helpers/isClient', () => ({
  isClient: vi.fn(() => true),
}))

class IntersectionObserverMock {
  callback: IntersectionObserverCallback
  options: IntersectionObserverInit
  observedElements: Element[] = []

  constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
  }

  observe(target: Element) {
    this.observedElements.push(target)
    this.callback(
      [{ target, isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }

  unobserve(_target: Element) {
    this.observedElements = this.observedElements.filter(el => el !== _target)
  }

  disconnect() {
    this.observedElements = []
  }
}

globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver

describe('given AosHandler handleIntersect - extended', () => {
  let aosHandler: AosHandler
  let observer: IntersectionObserver

  beforeEach(() => {
    aosHandler = new AosHandler()
    observer = new IntersectionObserverMock(() => {}, {}) as unknown as IntersectionObserver
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when entry has data-maz-aos-children', () => {
    it('then it should animate child elements with matching anchors', () => {
      const parent = document.createElement('div')
      parent.id = 'parent-el'
      parent.setAttribute('data-maz-aos-children', 'true')
      document.body.appendChild(parent)

      const child = document.createElement('div')
      child.setAttribute('data-maz-aos-anchor', '#parent-el')
      child.setAttribute('data-maz-aos', 'fade')
      document.body.appendChild(child)

      const entries = [{
        target: parent,
        isIntersecting: true,
        intersectionRatio: 1,
      }] as unknown as IntersectionObserverEntry[]

      // @ts-expect-error - private method
      aosHandler.handleIntersect(entries, observer)

      expect(child.classList.contains('maz-aos-animate')).toBe(true)
    })
  })

  describe('when entry has custom data-maz-aos-duration and delay', () => {
    it('then it should not override element-level styles', () => {
      const el = document.createElement('div')
      el.setAttribute('data-maz-aos', 'fade')
      el.setAttribute('data-maz-aos-duration', '500')
      el.setAttribute('data-maz-aos-delay', '200')

      const entries = [{
        target: el,
        isIntersecting: true,
        intersectionRatio: 1,
      }] as unknown as IntersectionObserverEntry[]

      // @ts-expect-error - private method
      aosHandler.handleIntersect(entries, observer)

      expect(el.classList.contains('maz-aos-animate')).toBe(true)
      // Should not set transitionDuration/Delay since element has custom values
      expect(el.style.transitionDuration).toBe('')
      expect(el.style.transitionDelay).toBe('')
    })
  })

  describe('when entry has no custom duration/delay', () => {
    it('then it should set default transition styles', () => {
      const el = document.createElement('div')
      el.setAttribute('data-maz-aos', 'fade')

      const entries = [{
        target: el,
        isIntersecting: true,
        intersectionRatio: 1,
      }] as unknown as IntersectionObserverEntry[]

      // @ts-expect-error - private method
      aosHandler.handleIntersect(entries, observer)

      expect(el.style.transitionDuration).toBe('300ms')
      expect(el.style.transitionDelay).toBe('0ms')
    })
  })

  describe('when data-maz-aos-once is false on element', () => {
    it('then it should allow repeated animation', () => {
      const el = document.createElement('div')
      el.setAttribute('data-maz-aos', 'fade')
      el.setAttribute('data-maz-aos-once', 'false')
      el.classList.add('maz-aos-animate')

      const nonIntersectingEntry = [{
        target: el,
        isIntersecting: false,
        intersectionRatio: 0,
      }] as unknown as IntersectionObserverEntry[]

      // @ts-expect-error - private method
      aosHandler.handleIntersect(nonIntersectingEntry, observer)

      expect(el.classList.contains('maz-aos-animate')).toBe(false)
    })
  })

  describe('when data-maz-aos-once is true on element', () => {
    it('then it should unobserve after animation', () => {
      vi.useFakeTimers()
      const el = document.createElement('div')
      el.setAttribute('data-maz-aos', 'fade')
      el.setAttribute('data-maz-aos-once', 'true')

      const unobserveSpy = vi.spyOn(observer, 'unobserve')

      const entries = [{
        target: el,
        isIntersecting: true,
        intersectionRatio: 1,
      }] as unknown as IntersectionObserverEntry[]

      // @ts-expect-error - private method
      aosHandler.handleIntersect(entries, observer)

      vi.advanceTimersByTime(500)

      expect(unobserveSpy).toHaveBeenCalledWith(el)
      vi.useRealTimers()
    })
  })

  describe('when entry has anchor element with once', () => {
    it('then it should unobserve the anchor element', () => {
      vi.useFakeTimers()
      const parent = document.createElement('div')
      parent.id = 'anchor-parent'
      document.body.appendChild(parent)

      const child = document.createElement('div')
      child.setAttribute('data-maz-aos', 'fade')
      child.setAttribute('data-maz-aos-anchor', '#anchor-parent')
      document.body.appendChild(child)

      const unobserveSpy = vi.spyOn(observer, 'unobserve')

      const entries = [{
        target: child,
        isIntersecting: true,
        intersectionRatio: 1,
      }] as unknown as IntersectionObserverEntry[]

      // @ts-expect-error - private method
      aosHandler.handleIntersect(entries, observer)

      vi.advanceTimersByTime(500)

      expect(unobserveSpy).toHaveBeenCalledWith(parent)
      expect(unobserveSpy).toHaveBeenCalledWith(child)
      vi.useRealTimers()
    })
  })
})

describe('given AosHandler handleObserver - extended', () => {
  let aosHandler: AosHandler

  beforeEach(() => {
    aosHandler = new AosHandler()
    document.body.innerHTML = ''
    vi.mocked(isClient).mockReturnValue(true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when elements have anchor attributes', () => {
    it('then it should observe the anchor element', async () => {
      const anchor = document.createElement('div')
      anchor.id = 'my-anchor'
      document.body.appendChild(anchor)

      const el = document.createElement('div')
      el.setAttribute('data-maz-aos', 'fade')
      el.setAttribute('data-maz-aos-anchor', '#my-anchor')
      document.body.appendChild(el)

      await aosHandler.runAnimations()

      expect(anchor.getAttribute('data-maz-aos-children')).toBe('true')
    })
  })

  describe('when anchor element does not exist', () => {
    it('then it should log a warning', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const el = document.createElement('div')
      el.setAttribute('data-maz-aos', 'fade')
      el.setAttribute('data-maz-aos-anchor', '#nonexistent')
      document.body.appendChild(el)

      await aosHandler.runAnimations()

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('#nonexistent'),
      )
      warnSpy.mockRestore()
    })
  })

  describe('when element has no anchor', () => {
    it('then it should observe the element directly', async () => {
      const el = document.createElement('div')
      el.setAttribute('data-maz-aos', 'fade')
      document.body.appendChild(el)

      await aosHandler.runAnimations()

      expect(el.classList.contains('maz-aos-animate')).toBe(true)
    })
  })
})

describe('given AosPlugin install - extended', () => {
  let app: App

  beforeEach(() => {
    app = {
      provide: vi.fn(),
      config: {
        globalProperties: {} as any,
      },
    } as unknown as App
  })

  describe('when installing without router on client', () => {
    it('then it should call runAnimations directly', () => {
      vi.mocked(isClient).mockReturnValue(true)

      AosPlugin.install?.(app, {})

      expect(app.provide).toHaveBeenCalledWith('mazAos', expect.any(AosHandler))
      expect(app.config.globalProperties.$mazAos).toBeDefined()
    })
  })
})
