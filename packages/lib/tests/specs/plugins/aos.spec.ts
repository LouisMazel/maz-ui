import type { App } from 'vue'
import type { Router } from 'vue-router'
import { isClient } from '@helpers/isClient'
import { sleep } from '@helpers/sleep'
import { AosHandler, type AosOptions, getInstance, plugin } from '@plugins/aos'

// Mock dependencies
vi.mock('@helpers/sleep', () => ({
  sleep: vi.fn(),
}))
vi.mock('@helpers/isClient', () => ({
  isClient: vi.fn(() => true),
}))

class IntersectionObserverMock {
  callback: IntersectionObserverCallback
  options: IntersectionObserverInit

  constructor(callback: IntersectionObserverCallback, options: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
  }

  observe(target) {
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

describe('given AosHandler class', () => {
  const mockOptions: AosOptions = {
    delay: 100,
    observer: {
      root: undefined,
      rootMargin: '0px',
      threshold: 0.2,
    },
    animation: {
      once: true,
      duration: 300,
      delay: 0,
    },
  }

  describe('when initializing with default options', () => {
    it('then it should use the default options', () => {
      const aosHandler = new AosHandler()
      expect(aosHandler.options).toEqual(mockOptions)
    })
  })

  describe('when initializing with custom options', () => {
    it('then it should merge custom options with default options', () => {
      const customOptions = {
        delay: 200,
        animation: {
          duration: 500,
        },
      }
      const expectedOptions = {
        ...mockOptions,
        delay: 200,
        animation: {
          ...mockOptions.animation,
          duration: 500,
        },
      }
      const aosHandler = new AosHandler(customOptions)
      expect(aosHandler.options).toEqual(expectedOptions)
    })
  })
})

describe('given AosHandler handleIntersect method', () => {
  let aosHandler: AosHandler
  let entries: IntersectionObserverEntry[]
  let observer: IntersectionObserver

  beforeEach(() => {
    aosHandler = new AosHandler()
    entries = [
      {
        target: document.createElement('div'),
        isIntersecting: true,
        intersectionRatio: 1,
      } as unknown as IntersectionObserverEntry,
    ]

    observer = new IntersectionObserverMock(() => {}, {}) as unknown as IntersectionObserver
  })

  describe('when an entry is intersecting', () => {
    it('then it should add the animation class to the target', async () => {
      const target = entries[0].target
      target.setAttribute('data-maz-aos', 'fade')
      // @ts-expect-error - ignore
      aosHandler.handleIntersect(entries, observer)
      await sleep(100)
      expect(target.classList.contains('maz-aos-animate')).toBe(true)
    })
  })

  describe('when an entry is not intersecting', () => {
    it('then it should remove the animation class from the target', () => {
      const target = entries[0].target
      target.setAttribute('data-maz-aos', 'fade')
      target.classList.add('maz-aos-animate')
      // @ts-expect-error - ignore
      entries[0].isIntersecting = false
      // @ts-expect-error - ignore
      entries[0].intersectionRatio = 0
      // @ts-expect-error - ignore
      aosHandler.handleIntersect(entries, observer)
      expect(target.classList.contains('maz-aos-animate')).toBe(false)
    })
  })
})

describe('given AosHandler runAnimations method', () => {
  let aosHandler: AosHandler

  beforeEach(() => {
    aosHandler = new AosHandler()
  })

  describe('when called on the client side', () => {
    it('then it should call handleObserver', async () => {
      // @ts-expect-error - ignore
      const handleObserverSpy = vi.spyOn(aosHandler, 'handleObserver')
      await aosHandler.runAnimations()
      expect(handleObserverSpy).toHaveBeenCalled()
    })
  })

  describe('when called on the server side', () => {
    it('then it should log a warning and not call handleObserver', async () => {
      vi.mocked(isClient).mockReturnValue(false)

      const consoleWarnSpy = vi.spyOn(console, 'warn')
      // @ts-expect-error - ignore
      const handleObserverSpy = vi.spyOn(aosHandler, 'handleObserver')
      await aosHandler.runAnimations()
      expect(consoleWarnSpy).toHaveBeenCalledWith('[MazAos](runAnimations) should be executed on client side')
      expect(handleObserverSpy).not.toHaveBeenCalled()
      consoleWarnSpy.mockRestore()
    })
  })
})

describe('given plugin install function', () => {
  let app: App
  let router: Router

  beforeEach(() => {
    app = {
      provide: vi.fn(),
    } as unknown as App
    router = {
      afterEach: vi.fn(fun => fun()),
    } as unknown as Router
  })

  describe('when installing with options and router', () => {
    it('then it should provide aos instance and setup router hook', () => {
      vi.mocked(isClient).mockReturnValue(true)
      plugin.install(app, { router })

      expect(app.provide).toHaveBeenCalledWith('aos', expect.any(AosHandler))
      expect(router.afterEach).toHaveBeenCalled()
    })
  })

  describe('when installing on the server side', () => {
    it('then it should not call runAnimations', () => {
      vi.mocked(isClient).mockReturnValue(false)
      const instance = new AosHandler()
      const runAnimationsSpy = vi.spyOn(instance, 'runAnimations')

      plugin.install(app, {})

      expect(runAnimationsSpy).not.toHaveBeenCalled()
    })
  })
})

describe('given getInstance function', () => {
  it('then it should return the aos instance', () => {
    const instance = new AosHandler()

    const result = getInstance()

    expect(result).toStrictEqual(instance)
  })
})
