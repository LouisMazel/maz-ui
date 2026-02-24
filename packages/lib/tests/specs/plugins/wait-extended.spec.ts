import { WaitHandler, waitInstance, WaitPlugin } from '@plugins/wait'
import { createApp } from 'vue'

describe('given WaitHandler extended', () => {
  let handler: WaitHandler

  beforeEach(() => {
    handler = new WaitHandler()
  })

  describe('when using default loader', () => {
    it('then start should use default loader id', () => {
      handler.start()
      expect(handler.isLoading()).toBe(true)
    })

    it('then stop should use default loader id', () => {
      handler.start()
      handler.stop()
      expect(handler.isLoading()).toBe(false)
    })
  })

  describe('when using loaders getter', () => {
    it('then it should return computed array of active loaders', () => {
      handler.start('loader1')
      handler.start('loader2')
      expect(handler.loaders.value).toContain('loader1')
      expect(handler.loaders.value).toContain('loader2')
    })
  })

  describe('when starting the same loader twice', () => {
    it('then it should not duplicate the loader', () => {
      handler.start('loader1')
      handler.start('loader1')
      const loaders = handler.loaders.value
      const count = loaders.filter((l: any) => l === 'loader1').length
      expect(count).toBe(1)
    })
  })

  describe('when isLoading with default', () => {
    it('then it should check default loader', () => {
      expect(handler.isLoading()).toBe(false)
      handler.start()
      expect(handler.isLoading()).toBe(true)
    })
  })

  describe('when using symbol as loader id', () => {
    it('then it should work with symbols', () => {
      const id = Symbol('test-loader')
      handler.start(id)
      expect(handler.isLoading(id)).toBe(true)
      handler.stop(id)
      expect(handler.isLoading(id)).toBe(false)
    })
  })

  describe('when using number as loader id', () => {
    it('then it should work with numbers', () => {
      handler.start(42)
      expect(handler.isLoading(42)).toBe(true)
      handler.stop(42)
      expect(handler.isLoading(42)).toBe(false)
    })
  })

  describe('when chaining start and stop', () => {
    it('then it should return the handler for chaining', () => {
      const result = handler.start('a').start('b').stop('a')
      expect(result).toBe(handler)
      expect(handler.isLoading('a')).toBe(false)
      expect(handler.isLoading('b')).toBe(true)
    })
  })

  describe('when anyLoading is checked', () => {
    it('then it should return false when empty', () => {
      expect(handler.anyLoading.value).toBe(false)
    })

    it('then it should return true when any loader active', () => {
      handler.start('x')
      expect(handler.anyLoading.value).toBe(true)
    })
  })
})

describe('given waitInstance', () => {
  it('then it should be a WaitHandler', () => {
    expect(waitInstance).toBeInstanceOf(WaitHandler)
  })
})

describe('given WaitPlugin', () => {
  it('then it should provide and set global properties', () => {
    const app = createApp({ template: '<div />' })
    const provideSpy = vi.spyOn(app, 'provide')

    app.use(WaitPlugin)

    expect(provideSpy).toHaveBeenCalledWith('mazWait', expect.any(WaitHandler))
    expect(app.config.globalProperties.$mazWait).toBeDefined()
  })
})
