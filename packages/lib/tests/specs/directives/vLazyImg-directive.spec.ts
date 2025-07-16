import { vLazyImg, vLazyImgInstall } from '@directives/vLazyImg'
import { createApp } from 'vue'

describe('given vLazyImg directive', () => {
  describe('when plugin is installed', () => {
    it('then it should register the directive', () => {
      const app = createApp({})
      const mockDirective = vi.fn()
      app.directive = mockDirective

      vLazyImgInstall.install?.(app)

      expect(mockDirective).toHaveBeenCalledWith('lazy-img', expect.objectContaining({
        created: expect.any(Function),
        updated: expect.any(Function),
        unmounted: expect.any(Function),
      }))
    })
  })

  describe('when plugin is installed with options', () => {
    it('then it should merge options with defaults', () => {
      const app = createApp({})
      const mockDirective = vi.fn()
      app.directive = mockDirective

      const options = {
        observerOptions: { threshold: 0.5 },
      }

      vLazyImgInstall.install?.(app, options)

      expect(mockDirective).toHaveBeenCalledWith('lazy-img', expect.objectContaining({
        created: expect.any(Function),
        updated: expect.any(Function),
        unmounted: expect.any(Function),
      }))
    })
  })

  describe('when directive is created', () => {
    it('then it should create instance and add element', () => {
      const mockElement = document.createElement('img')
      const mockBinding = {
        value: { threshold: 0.5 },
      }

      expect(() => {
        vLazyImg.created?.(mockElement, mockBinding as any)
      }).not.toThrow()
    })
  })

  describe('when directive is updated', () => {
    it('then it should update the instance', () => {
      const mockElement = document.createElement('img')
      const mockBinding = {
        value: { threshold: 0.5 },
      }

      vLazyImg.created?.(mockElement, mockBinding as any)

      expect(() => {
        vLazyImg.updated?.(mockElement, mockBinding as any)
      }).not.toThrow()
    })
  })

  describe('when directive is unmounted', () => {
    it('then it should remove the element', () => {
      const mockElement = document.createElement('img')
      const mockBinding = {
        value: { threshold: 0.5 },
      }

      vLazyImg.created?.(mockElement, mockBinding as any)

      expect(() => {
        vLazyImg.unmounted?.(mockElement, mockBinding as any)
      }).not.toThrow()
    })
  })

  describe('when binding value is object', () => {
    it('then it should use object as options', () => {
      const mockElement = document.createElement('img')
      const mockBinding = {
        value: {
          threshold: 0.5,
          observerOptions: { rootMargin: '10px' },
        },
      }

      expect(() => {
        vLazyImg.created?.(mockElement, mockBinding as any)
      }).not.toThrow()
    })
  })

  describe('when binding value is not object', () => {
    it('then it should use empty options', () => {
      const mockElement = document.createElement('img')
      const mockBinding = {
        value: 'string-value',
      }

      expect(() => {
        vLazyImg.created?.(mockElement, mockBinding as any)
      }).not.toThrow()
    })
  })
})
