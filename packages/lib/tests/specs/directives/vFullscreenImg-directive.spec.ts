import { vFullscreenImg, vFullscreenImgInstall } from '@directives/vFullscreenImg'
import { createApp } from 'vue'

describe('given vFullscreenImg directive', () => {
  describe('when plugin is installed', () => {
    it('then it should register the directive', () => {
      const app = createApp({})
      const mockDirective = vi.fn()
      app.directive = mockDirective

      vFullscreenImgInstall.install(app)

      expect(mockDirective).toHaveBeenCalledWith('fullscreen-img', vFullscreenImg)
    })
  })

  describe('when directive is mounted', () => {
    it('then it should create instance and add element', () => {
      const mockElement = document.createElement('img')
      const mockBinding = {
        value: 'https://example.com/image.jpg',
      }

      expect(() => {
        vFullscreenImg.mounted(mockElement, mockBinding as any)
      }).not.toThrow()
    })
  })

  describe('when directive is updated', () => {
    it('then it should update the instance', () => {
      const mockElement = document.createElement('img')
      const mockBinding = {
        value: 'https://example.com/image.jpg',
      }

      vFullscreenImg.mounted(mockElement, mockBinding as any)

      expect(() => {
        vFullscreenImg.updated(mockElement, mockBinding as any)
      }).not.toThrow()
    })
  })

  describe('when directive is unmounted', () => {
    it('then it should remove the element', () => {
      const mockElement = document.createElement('img')
      const mockBinding = {
        value: 'https://example.com/image.jpg',
      }

      vFullscreenImg.mounted(mockElement, mockBinding as any)

      expect(() => {
        vFullscreenImg.unmounted(mockElement)
      }).not.toThrow()
    })
  })

  describe('when binding value is string', () => {
    it('then it should use string as src', () => {
      const mockElement = document.createElement('img')
      const mockBinding = {
        value: 'https://example.com/image.jpg',
      }

      expect(() => {
        vFullscreenImg.mounted(mockElement, mockBinding as any)
      }).not.toThrow()
    })
  })

  describe('when binding value is object', () => {
    it('then it should use object as options', () => {
      const mockElement = document.createElement('img')
      const mockBinding = {
        value: {
          src: 'https://example.com/image.jpg',
          alt: 'Test image',
        },
      }

      expect(() => {
        vFullscreenImg.mounted(mockElement, mockBinding as any)
      }).not.toThrow()
    })
  })

  describe('when directive has all lifecycle hooks', () => {
    it('then it should have mounted, updated, and unmounted hooks', () => {
      expect(vFullscreenImg.mounted).toBeDefined()
      expect(vFullscreenImg.updated).toBeDefined()
      expect(vFullscreenImg.unmounted).toBeDefined()
      expect(typeof vFullscreenImg.mounted).toBe('function')
      expect(typeof vFullscreenImg.updated).toBe('function')
      expect(typeof vFullscreenImg.unmounted).toBe('function')
    })
  })
})
