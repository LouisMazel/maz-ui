import { AosHandler, type AosOptions, plugin } from '@modules/plugins/aos/index'
import type { Router } from 'vue-router'
import type { App } from 'vue'

describe('given AosHandler class', () => {
  let aosHandler: AosHandler

  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('when instantiated with default options', () => {
    it('then it should have the correct default options', () => {
      aosHandler = new AosHandler()
      expect(aosHandler.options).toEqual({
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
      })
    })
  })

  describe('when instantiated with custom options', () => {
    it('then it should merge custom options with default options', () => {
      const customOptions: AosOptions = {
        delay: 200,
        observer: {
          rootMargin: '10px',
        },
        animation: {
          duration: 500,
        },
      }
      aosHandler = new AosHandler(customOptions)
      expect(aosHandler.options).toEqual({
        delay: 200,
        observer: {
          root: undefined,
          rootMargin: '10px',
          threshold: 0.2,
        },
        animation: {
          once: true,
          duration: 500,
          delay: 0,
        },
      })
    })
  })

  describe('when plugin is installed', () => {
    it('then it should provide the AosHandler instance', () => {
      const app = {
        provide: vi.fn(),
      } as unknown as App

      plugin.install(app)

      expect(app.provide).toHaveBeenCalledWith('aos', expect.any(AosHandler))
    })

    it('then it should run animations when router is not provided', () => {
      const app = {
        provide: vi.fn(),
      } as unknown as App

      vi.spyOn(AosHandler.prototype, 'runAnimations').mockResolvedValue()

      plugin.install(app)

      expect(AosHandler.prototype.runAnimations).toHaveBeenCalledTimes(1)
    })

    it('then it should set up router hook when router is provided', () => {
      const app = {
        provide: vi.fn(),
      } as unknown as App

      const router = {
        afterEach: vi.fn(),
      } as unknown as Router

      vi.spyOn(AosHandler.prototype, 'runAnimations').mockResolvedValue()

      plugin.install(app, { router })

      expect(router.afterEach).toHaveBeenCalledTimes(1)
      const afterEachCallback = router.afterEach.mock.calls[0][0]
      afterEachCallback()
      expect(AosHandler.prototype.runAnimations).toHaveBeenCalledTimes(1)
    })
  })
})
