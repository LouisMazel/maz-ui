import MazTicker from '@components/MazTicker.vue'
import { mount } from '@vue/test-utils'

describe('given MazTicker component', () => {
  describe('when rendered with default props', () => {
    it('then it renders with horizontal orientation and reset css', () => {
      const wrapper = mount(MazTicker, {
        slots: { default: '<span>Item</span>' },
      })

      expect(wrapper.classes()).toContain('m-reset-css')
      expect(wrapper.classes()).toContain('--horizontal')
      expect(wrapper.attributes('role')).toBe('region')
      expect(wrapper.attributes('aria-roledescription')).toBe('ticker')
    })

    it('then it renders default slot content', () => {
      const wrapper = mount(MazTicker, {
        slots: { default: '<span class="test-item">Ticker Item</span>' },
      })

      expect(wrapper.find('.test-item').exists()).toBe(true)
      expect(wrapper.find('.test-item').text()).toBe('Ticker Item')
    })

    it('then it repeats content 4 times by default', () => {
      const wrapper = mount(MazTicker, {
        slots: { default: '<span>Item</span>' },
      })

      expect(wrapper.findAll('.m-ticker-content')).toHaveLength(4)
    })

    it('then it marks duplicate content blocks as aria-hidden', () => {
      const wrapper = mount(MazTicker, {
        slots: { default: '<span>Item</span>' },
      })

      const blocks = wrapper.findAll('.m-ticker-content')
      expect(blocks[0].attributes('aria-hidden')).toBeUndefined()
      expect(blocks[1].attributes('aria-hidden')).toBe('true')
      expect(blocks[2].attributes('aria-hidden')).toBe('true')
      expect(blocks[3].attributes('aria-hidden')).toBe('true')
    })

    it('then it shows overlay by default', () => {
      const wrapper = mount(MazTicker, {
        slots: { default: '<span>Item</span>' },
      })

      expect(wrapper.findAll('.m-ticker-overlay')).toHaveLength(2)
      expect(wrapper.find('.m-ticker-overlay.--start').exists()).toBe(true)
      expect(wrapper.find('.m-ticker-overlay.--end').exists()).toBe(true)
    })

    it('then it applies default CSS variables', () => {
      const wrapper = mount(MazTicker, {
        slots: { default: '<span>Item</span>' },
      })

      const style = wrapper.attributes('style')
      expect(style).toContain('--m-ticker-duration: 20s')
      expect(style).toContain('--m-ticker-gap: 1rem')
      expect(style).toContain('--m-ticker-overlay-size: 33%')
      expect(style).toContain('--m-ticker-timing: linear')
    })
  })

  describe('when rendered with vertical orientation', () => {
    it('then it applies the vertical class', () => {
      const wrapper = mount(MazTicker, {
        props: { orientation: 'vertical' },
        slots: { default: '<span>Item</span>' },
      })

      expect(wrapper.classes()).toContain('--vertical')
      expect(wrapper.classes()).not.toContain('--horizontal')
    })
  })

  describe('when rendered with reverse prop', () => {
    it('then it applies the reverse class', () => {
      const wrapper = mount(MazTicker, {
        props: { reverse: true },
        slots: { default: '<span>Item</span>' },
      })

      expect(wrapper.classes()).toContain('--reverse')
    })
  })

  describe('when rendered with custom repeat count', () => {
    it('then it duplicates content the specified number of times', () => {
      const wrapper = mount(MazTicker, {
        props: { repeat: 2 },
        slots: { default: '<span>Item</span>' },
      })

      expect(wrapper.findAll('.m-ticker-content')).toHaveLength(2)
    })
  })

  describe('when rendered with custom CSS props', () => {
    it('then it applies custom CSS variables', () => {
      const wrapper = mount(MazTicker, {
        props: {
          duration: 10,
          gap: '2rem',
          overlaySize: '50%',
          animationTimingFunction: 'ease-in-out',
        },
        slots: { default: '<span>Item</span>' },
      })

      const style = wrapper.attributes('style')
      expect(style).toContain('--m-ticker-duration: 10s')
      expect(style).toContain('--m-ticker-gap: 2rem')
      expect(style).toContain('--m-ticker-overlay-size: 50%')
      expect(style).toContain('--m-ticker-timing: ease-in-out')
    })
  })

  describe('when rendered with overlay set to false', () => {
    it('then it does not render overlay elements', () => {
      const wrapper = mount(MazTicker, {
        props: { overlay: false },
        slots: { default: '<span>Item</span>' },
      })

      expect(wrapper.find('.m-ticker-overlay').exists()).toBe(false)
    })
  })

  describe('when rendered with paused prop', () => {
    it('then it applies the paused class', () => {
      const wrapper = mount(MazTicker, {
        props: { paused: true },
        slots: { default: '<span>Item</span>' },
      })

      expect(wrapper.classes()).toContain('--paused')
    })
  })

  describe('when rendered with pauseOnHover prop', () => {
    it('then it applies the pause-on-hover class', () => {
      const wrapper = mount(MazTicker, {
        props: { pauseOnHover: true },
        slots: { default: '<span>Item</span>' },
      })

      expect(wrapper.classes()).toContain('--pause-on-hover')
    })
  })

  describe('when rendered with pauseOnFocus prop', () => {
    it('then it applies the pause-on-focus class', () => {
      const wrapper = mount(MazTicker, {
        props: { pauseOnFocus: true },
        slots: { default: '<span>Item</span>' },
      })

      expect(wrapper.classes()).toContain('--pause-on-focus')
    })
  })

  describe('when rendered with before slot', () => {
    it('then it renders the before slot content', () => {
      const wrapper = mount(MazTicker, {
        slots: {
          default: '<span>Item</span>',
          before: '<div class="custom-before">Before</div>',
        },
      })

      expect(wrapper.find('.custom-before').exists()).toBe(true)
      expect(wrapper.find('.custom-before').text()).toBe('Before')
    })
  })

  describe('when rendered with after slot', () => {
    it('then it renders the after slot content', () => {
      const wrapper = mount(MazTicker, {
        slots: {
          default: '<span>Item</span>',
          after: '<div class="custom-after">After</div>',
        },
      })

      expect(wrapper.find('.custom-after').exists()).toBe(true)
      expect(wrapper.find('.custom-after').text()).toBe('After')
    })
  })

  describe('when rendered with custom overlay slots', () => {
    it('then it renders custom overlay-start content', () => {
      const wrapper = mount(MazTicker, {
        props: { overlay: false },
        slots: {
          'default': '<span>Item</span>',
          'overlay-start': '<div class="custom-overlay">Custom</div>',
        },
      })

      expect(wrapper.find('.m-ticker-overlay.--start').exists()).toBe(true)
      expect(wrapper.find('.custom-overlay').exists()).toBe(true)
    })

    it('then it renders custom overlay-end content', () => {
      const wrapper = mount(MazTicker, {
        props: { overlay: false },
        slots: {
          'default': '<span>Item</span>',
          'overlay-end': '<div class="custom-overlay-end">Custom</div>',
        },
      })

      expect(wrapper.find('.m-ticker-overlay.--end').exists()).toBe(true)
      expect(wrapper.find('.custom-overlay-end').exists()).toBe(true)
    })
  })
})
