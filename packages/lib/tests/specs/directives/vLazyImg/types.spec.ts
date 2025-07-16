import type {
  ClassOptions,
  VLazyImgBindingValue,
  VLazyImgOptions,
} from '@directives/vLazyImg/types'

describe('given vLazyImg types', () => {
  describe('when ClassOptions interface is defined', () => {
    it('then it should have required string properties', () => {
      const options: ClassOptions = {
        baseClass: 'test-base',
        loadingClass: 'test-loading',
        loadedClass: 'test-loaded',
        errorClass: 'test-error',
        fallbackClass: 'test-fallback',
        observerOnce: true,
        loadOnce: false,
        observerOptions: {
          threshold: 0.5,
        },
      }

      expect(options.baseClass).toBe('test-base')
      expect(options.loadingClass).toBe('test-loading')
      expect(options.loadedClass).toBe('test-loaded')
      expect(options.errorClass).toBe('test-error')
      expect(options.fallbackClass).toBe('test-fallback')
    })

    it('then it should have boolean properties', () => {
      const options: ClassOptions = {
        baseClass: 'test',
        loadingClass: 'test',
        loadedClass: 'test',
        errorClass: 'test',
        fallbackClass: 'test',
        observerOnce: true,
        loadOnce: false,
        observerOptions: {
          threshold: 0.5,
        },
      }

      expect(typeof options.observerOnce).toBe('boolean')
      expect(typeof options.loadOnce).toBe('boolean')
    })

    it('then it should have observer options', () => {
      const options: ClassOptions = {
        baseClass: 'test',
        loadingClass: 'test',
        loadedClass: 'test',
        errorClass: 'test',
        fallbackClass: 'test',
        observerOnce: true,
        loadOnce: false,
        observerOptions: {
          threshold: 0.5,
          root: null,
          rootMargin: '10px',
        },
      }

      expect(options.observerOptions.threshold).toBe(0.5)
      expect(options.observerOptions.root).toBeNull()
      expect(options.observerOptions.rootMargin).toBe('10px')
    })
  })

  describe('when VLazyImgOptions is used', () => {
    it('then it should accept partial ClassOptions', () => {
      const options: VLazyImgOptions = {
        baseClass: 'custom-base',
        observerOptions: {
          threshold: 0.8,
        },
      }

      expect(options.baseClass).toBe('custom-base')
      expect(options.observerOptions?.threshold).toBe(0.8)
    })

    it('then it should accept empty object', () => {
      const options: VLazyImgOptions = {}

      expect(typeof options).toBe('object')
    })
  })

  describe('when VLazyImgBindingValue is used', () => {
    it('then it should accept string value', () => {
      const value: VLazyImgBindingValue = 'https://example.com/image.jpg'

      expect(typeof value).toBe('string')
      expect(value).toBe('https://example.com/image.jpg')
    })

    it('then it should accept object value with src', () => {
      const value: VLazyImgBindingValue = {
        src: 'https://example.com/image.jpg',
        disabled: false,
      }

      expect(typeof value).toBe('object')
      expect(value.src).toBe('https://example.com/image.jpg')
      expect(value.disabled).toBe(false)
    })

    it('then it should accept object value with options', () => {
      const value: VLazyImgBindingValue = {
        baseClass: 'custom-lazy',
        observerOptions: {
          threshold: 0.3,
        },
      }

      expect(typeof value).toBe('object')
      expect(value.baseClass).toBe('custom-lazy')
      expect(value.observerOptions?.threshold).toBe(0.3)
    })
  })

  describe('when callback functions are defined', () => {
    it('then they should accept element parameter', () => {
      const mockElement = document.createElement('img')

      const options: VLazyImgOptions = {
        onLoading: (el: Element) => {
          expect(el).toBeDefined()
          expect(el instanceof Element).toBe(true)
        },
        onLoaded: (el: Element) => {
          expect(el).toBeDefined()
          expect(el instanceof Element).toBe(true)
        },
        onError: (el: Element) => {
          expect(el).toBeDefined()
          expect(el instanceof Element).toBe(true)
        },
        onIntersecting: (el: Element) => {
          expect(el).toBeDefined()
          expect(el instanceof Element).toBe(true)
        },
      }

      options.onLoading?.(mockElement)
      options.onLoaded?.(mockElement)
      options.onError?.(mockElement)
      options.onIntersecting?.(mockElement)
    })
  })

  describe('when fallbackSrc is used', () => {
    it('then it should accept string or false', () => {
      const optionsWithString: VLazyImgOptions = {
        fallbackSrc: 'https://example.com/fallback.jpg',
      }

      const optionsWithFalse: VLazyImgOptions = {
        fallbackSrc: false,
      }

      expect(optionsWithString.fallbackSrc).toBe('https://example.com/fallback.jpg')
      expect(optionsWithFalse.fallbackSrc).toBe(false)
    })
  })
})
