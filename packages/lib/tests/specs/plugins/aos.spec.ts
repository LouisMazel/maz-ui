import type { AosOptions } from '@plugins/aos'
import type { App } from 'vue'
import type { Router } from 'vue-router'
import { isClient } from '@maz-ui/utils/src/helpers/isClient.js'
import { sleep } from '@maz-ui/utils/src/helpers/sleep.js'
import { AosHandler, AosPlugin, getAosInstance } from '@plugins/aos'
import { vi } from 'vitest'

// Mock dependencies
vi.mock('@maz-ui/utils/src/helpers/sleep.js', () => ({
  sleep: vi.fn(),
}))
vi.mock('@maz-ui/utils/src/helpers/isClient.js', () => ({
  isClient: vi.fn(() => true),
}))

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

  describe('when an entry is not intersecting and once is false', () => {
    it('then it should remove the animation class from the target', () => {
      const customOptions = {
        delay: 100,
        animation: {
          once: false,
          duration: 300,
          delay: 0,
        },
      }
      const customAosHandler = new AosHandler(customOptions)

      const target = entries[0].target
      target.setAttribute('data-maz-aos', 'fade')
      target.classList.add('maz-aos-animate')

      // Create a new entry that is not intersecting
      const nonIntersectingEntry = {
        ...entries[0],
        isIntersecting: false,
        intersectionRatio: 0,
      } as IntersectionObserverEntry

      // @ts-expect-error - ignore
      customAosHandler.handleIntersect([nonIntersectingEntry], observer)
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

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
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
      config: {
        globalProperties: {},
      },
    } as unknown as App
    router = {
      afterEach: vi.fn((fun: () => void) => fun()),
    } as unknown as Router
  })

  describe('when installing with options and router', () => {
    it('then it should provide aos instance and setup router hook', () => {
      vi.mocked(isClient).mockReturnValue(true)
      AosPlugin.install?.(app, { router })

      expect(app.provide).toHaveBeenCalledWith('mazAos', expect.any(AosHandler))
      expect(router.afterEach).toHaveBeenCalled()
    })
  })

  describe('when installing on the server side', () => {
    it('then it should not call runAnimations', () => {
      vi.mocked(isClient).mockReturnValue(false)
      const instance = new AosHandler()
      const runAnimationsSpy = vi.spyOn(instance, 'runAnimations')

      AosPlugin.install?.(app, {})

      expect(runAnimationsSpy).not.toHaveBeenCalled()
    })
  })
})

describe('given getInstance function', () => {
  it('then it should return the aos instance', () => {
    const instance = new AosHandler()

    const result = getAosInstance()

    expect(result).toStrictEqual(instance)
  })
})
