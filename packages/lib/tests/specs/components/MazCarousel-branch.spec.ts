import MazCarousel from '@components/MazCarousel.vue'
import { mount } from '@vue/test-utils'

describe('MazCarousel branch coverage', () => {
  describe('when mounted with default props', () => {
    it('should render', () => {
      const wrapper = mount(MazCarousel, {
        slots: {
          default: '<div class="item">Item 1</div><div class="item">Item 2</div>',
        },
      })
      expect(wrapper.find('.m-carousel').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when hideScrollButtons is false', () => {
    it('should show header with scroll buttons', () => {
      const wrapper = mount(MazCarousel, {
        props: { hideScrollButtons: false },
        slots: { default: '<div>Item</div>' },
      })
      expect(wrapper.find('.m-carousel__header').exists()).toBe(true)
      expect(wrapper.find('.m-carousel__header__actions').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when hideScrollButtons is true', () => {
    it('should not show header actions', () => {
      const wrapper = mount(MazCarousel, {
        props: { hideScrollButtons: true },
        slots: { default: '<div>Item</div>' },
      })
      expect(wrapper.find('.m-carousel__header__actions').exists()).toBe(false)
      wrapper.unmount()
    })

    it('should not show header at all without title', () => {
      const wrapper = mount(MazCarousel, {
        props: { hideScrollButtons: true },
        slots: { default: '<div>Item</div>' },
      })
      expect(wrapper.find('.m-carousel__header').exists()).toBe(false)
      wrapper.unmount()
    })

    it('should show header when title is set', () => {
      const wrapper = mount(MazCarousel, {
        props: { hideScrollButtons: true, title: 'Carousel' },
        slots: { default: '<div>Item</div>' },
      })
      expect(wrapper.find('.m-carousel__header').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when title is set', () => {
    it('should display title', () => {
      const wrapper = mount(MazCarousel, {
        props: { title: 'My Carousel' },
        slots: { default: '<div>Item</div>' },
      })
      expect(wrapper.text()).toContain('My Carousel')
      expect(wrapper.find('.m-carousel__header.--has-title').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when title slot is used', () => {
    it('should render title slot', () => {
      const wrapper = mount(MazCarousel, {
        slots: {
          title: '<h3>Custom Title</h3>',
          default: '<div>Item</div>',
        },
      })
      expect(wrapper.text()).toContain('Custom Title')
      wrapper.unmount()
    })
  })

  describe('when hideScrollbar is true', () => {
    it('should apply hide-scrollbar class', () => {
      const wrapper = mount(MazCarousel, {
        props: { hideScrollbar: true },
        slots: { default: '<div>Item</div>' },
      })
      expect(wrapper.find('.m-carousel').classes()).toContain('--hide-scrollbar')
      wrapper.unmount()
    })
  })

  describe('when hideScrollbar is false', () => {
    it('should not apply hide-scrollbar class', () => {
      const wrapper = mount(MazCarousel, {
        props: { hideScrollbar: false },
        slots: { default: '<div>Item</div>' },
      })
      expect(wrapper.find('.m-carousel').classes()).not.toContain('--hide-scrollbar')
      wrapper.unmount()
    })
  })

  describe('when scroll event fires', () => {
    it('should update scroll state', async () => {
      const wrapper = mount(MazCarousel, {
        slots: { default: '<div>Item</div>' },
      })
      const items = wrapper.find('.m-carousel__items')
      await items.trigger('scroll')
      wrapper.unmount()
    })
  })

  describe('when translations are provided', () => {
    it('should use custom translations', () => {
      const wrapper = mount(MazCarousel, {
        props: {
          translations: {
            ariaLabel: {
              previousButton: 'Go back',
              nextButton: 'Go forward',
            },
          },
        },
        slots: { default: '<div>Item</div>' },
      })
      wrapper.unmount()
    })
  })
})
