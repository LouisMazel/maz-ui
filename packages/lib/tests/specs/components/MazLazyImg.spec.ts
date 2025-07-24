import MazLazyImg from '@components/MazLazyImg.vue'
import { mount } from '@vue/test-utils'

describe('given MazLazyImg component', () => {
  describe('when rendered with default props', () => {
    it('then it should render with default configuration', () => {
      const wrapper = mount(MazLazyImg)

      expect(wrapper.find('picture').exists()).toBe(true)
      expect(wrapper.find('img').exists()).toBe(true)
      expect(wrapper.find('.m-lazy-img-component-loader').exists()).toBe(true)
      expect(wrapper.classes()).toContain('m-lazy-img-component')
    })
  })

  describe('when rendered with string src', () => {
    it('then it should create a source element with data-lazy-srcset', () => {
      const wrapper = mount(MazLazyImg, {
        props: { src: 'https://example.com/image.jpg' },
      })

      const source = wrapper.find('source')
      expect(source.exists()).toBe(true)
      expect(source.attributes('data-lazy-srcset')).toBe('https://example.com/image.jpg')
    })
  })

  describe('when rendered with object src with sources', () => {
    it('then it should create multiple source elements', () => {
      const wrapper = mount(MazLazyImg, {
        props: {
          src: {
            sources: [
              { srcset: 'image-small.jpg', media: '(max-width: 600px)' },
              { srcset: 'image-large.jpg', media: '(min-width: 601px)' },
            ],
          },
        },
      })

      const sources = wrapper.findAll('source')
      expect(sources).toHaveLength(2)
      expect(sources[0].attributes('data-lazy-srcset')).toBe('image-small.jpg')
      expect(sources[0].attributes('media')).toBe('(max-width: 600px)')
      expect(sources[1].attributes('data-lazy-srcset')).toBe('image-large.jpg')
      expect(sources[1].attributes('media')).toBe('(min-width: 601px)')
    })
  })

  describe('when rendered with alt text', () => {
    it('then it should set the alt attribute on the img', () => {
      const wrapper = mount(MazLazyImg, {
        props: { alt: 'Test image' },
      })

      const img = wrapper.find('img')
      expect(img.attributes('alt')).toBe('Test image')
    })
  })

  describe('when rendered with hideLoader prop', () => {
    it('then it should not render the loader', () => {
      const wrapper = mount(MazLazyImg, {
        props: { hideLoader: true },
      })

      expect(wrapper.find('.m-lazy-img-component-loader').exists()).toBe(false)
      expect(wrapper.classes()).not.toContain('--use-loader')
    })
  })

  describe('when rendered with imageHeightFull prop', () => {
    it('then it should apply height full class', () => {
      const wrapper = mount(MazLazyImg, {
        props: { imageHeightFull: true },
      })

      expect(wrapper.classes()).toContain('--height-full')
    })
  })

  describe('when rendered with block prop', () => {
    it('then it should apply block class', () => {
      const wrapper = mount(MazLazyImg, {
        props: { block: true },
      })

      expect(wrapper.classes()).toContain('--block')
    })
  })

  describe('when rendered with imgClass prop', () => {
    it('then it should apply the class to the img element', () => {
      const wrapper = mount(MazLazyImg, {
        props: { imgClass: 'custom-img-class' },
      })

      const img = wrapper.find('img')
      expect(img.classes()).toContain('custom-img-class')
    })
  })

  describe('when rendered with default slot', () => {
    it('then it should render the slot content', () => {
      const wrapper = mount(MazLazyImg, {
        slots: {
          default: '<div>Custom content</div>',
        },
      })

      expect(wrapper.html()).toContain('<div>Custom content</div>')
    })
  })

  describe('when rendered with custom class', () => {
    it('then it should apply the custom class', () => {
      const wrapper = mount(MazLazyImg, {
        props: { class: 'custom-class' },
      })

      expect(wrapper.classes()).toContain('custom-class')
    })
  })

  describe('when rendered with custom style', () => {
    it('then it should apply the custom style', () => {
      const wrapper = mount(MazLazyImg, {
        props: { style: { width: '200px' } },
      })

      expect(wrapper.attributes('style')).toContain('width: 200px')
    })
  })

  describe('when rendered with loader enabled', () => {
    it('then it should render the loader with spinner', () => {
      const wrapper = mount(MazLazyImg, {
        props: { hideLoader: false },
      })

      expect(wrapper.find('.m-lazy-img-component-loader').exists()).toBe(true)
      expect(wrapper.classes()).toContain('--use-loader')
    })
  })

  describe('when rendered with null src', () => {
    it('then it should not create any source elements', () => {
      const wrapper = mount(MazLazyImg, {
        props: { src: null },
      })

      const sources = wrapper.findAll('source')
      expect(sources).toHaveLength(0)
    })
  })

  describe('when rendered with observerOptions', () => {
    it('then it should pass observer options to the directive', () => {
      const wrapper = mount(MazLazyImg, {
        props: {
          observerOptions: { threshold: 0.5 },
        },
      })

      const picture = wrapper.find('picture')
      expect(picture.exists()).toBe(true)
    })
  })

  describe('when rendered with fallbackSrc', () => {
    it('then it should pass fallback src to the directive', () => {
      const wrapper = mount(MazLazyImg, {
        props: {
          fallbackSrc: 'https://example.com/fallback.jpg',
        },
      })

      const picture = wrapper.find('picture')
      expect(picture.exists()).toBe(true)
    })
  })

  describe('when rendered with observerOnce disabled', () => {
    it('then it should pass observerOnce to the directive', () => {
      const wrapper = mount(MazLazyImg, {
        props: {
          observerOnce: false,
        },
      })

      const picture = wrapper.find('picture')
      expect(picture.exists()).toBe(true)
    })
  })

  describe('when rendered with loadOnce enabled', () => {
    it('then it should pass loadOnce to the directive', () => {
      const wrapper = mount(MazLazyImg, {
        props: {
          loadOnce: true,
        },
      })

      const picture = wrapper.find('picture')
      expect(picture.exists()).toBe(true)
    })
  })

  describe('when img has loading attribute', () => {
    it('then it should have loading="lazy" attribute', () => {
      const wrapper = mount(MazLazyImg)

      const img = wrapper.find('img')
      expect(img.attributes('loading')).toBe('lazy')
    })
  })

  describe('when img has default base64 src', () => {
    it('then it should have the transparent pixel src', () => {
      const wrapper = mount(MazLazyImg)

      const img = wrapper.find('img')
      expect(img.attributes('src')).toBe('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
    })
  })
})
