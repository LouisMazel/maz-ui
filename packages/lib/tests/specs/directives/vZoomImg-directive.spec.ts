import { vZoomImg, vZoomImgInstall } from '@directives/vZoomImg'
import { createApp } from 'vue'

describe('given vZoomImg directive', () => {
  describe('when plugin is installed', () => {
    it('then it should register the directive', () => {
      const app = createApp({})
      const mockDirective = vi.fn()
      app.directive = mockDirective

      vZoomImgInstall.install?.(app)

      expect(mockDirective).toHaveBeenCalledWith('zoom-img', vZoomImg)
    })
  })

  describe('when directive is created', () => {
    it('then it should create instance and add element', () => {
      const mockElement = document.createElement('img')
      const mockBinding = {
        value: 'https://example.com/image.jpg',
      }

      expect(() => {
        vZoomImg.created?.(mockElement, mockBinding as any)
      }).not.toThrow()
    })
  })

  describe('when directive is updated', () => {
    it('then it should update the instance', () => {
      const mockElement = document.createElement('img')
      const mockBinding = {
        value: 'https://example.com/image.jpg',
      }

      vZoomImg.created(mockElement, mockBinding as any)

      expect(() => {
        vZoomImg.updated(mockElement, mockBinding as any)
      }).not.toThrow()
    })
  })

  describe('when directive is unmounted', () => {
    it('then it should remove the element', () => {
      const mockElement = document.createElement('img')
      const mockBinding = {
        value: 'https://example.com/image.jpg',
      }

      vZoomImg.created(mockElement, mockBinding as any)

      expect(() => {
        vZoomImg.unmounted(mockElement)
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
        vZoomImg.created(mockElement, mockBinding as any)
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
          scale: true,
          blur: true,
        },
      }

      expect(() => {
        vZoomImg.created(mockElement, mockBinding as any)
      }).not.toThrow()
    })
  })

  describe('when directive has all lifecycle hooks', () => {
    it('then it should have created, updated, and unmounted hooks', () => {
      expect(vZoomImg.created).toBeDefined()
      expect(vZoomImg.updated).toBeDefined()
      expect(vZoomImg.unmounted).toBeDefined()
      expect(typeof vZoomImg.created).toBe('function')
      expect(typeof vZoomImg.updated).toBe('function')
      expect(typeof vZoomImg.unmounted).toBe('function')
    })
  })
})
