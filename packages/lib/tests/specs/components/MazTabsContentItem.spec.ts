import MazTabsContentItem from '@components/MazTabsContentItem.vue'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

describe('given MazTabsContentItem component', () => {
  describe('when rendered with tab prop', () => {
    it('then it should render with correct classes', () => {
      const wrapper = mount(MazTabsContentItem, {
        props: { tab: 1 },
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(1),
            },
          },
        },
      })

      expect(wrapper.find('.m-tabs-content-item').exists()).toBe(true)
      expect(wrapper.classes()).toContain('m-tabs-content-item')
      expect(wrapper.classes()).toContain('m-reset-css')
    })
  })

  describe('when tab is current tab', () => {
    it('then it should be visible', () => {
      const wrapper = mount(MazTabsContentItem, {
        props: { tab: 1 },
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(1),
            },
          },
        },
      })

      expect(wrapper.find('.m-tabs-content-item').isVisible()).toBe(true)
    })
  })

  describe('when tab is not current tab', () => {
    it('then it should be hidden', () => {
      const wrapper = mount(MazTabsContentItem, {
        props: { tab: 2 },
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(1),
            },
          },
        },
      })

      expect(wrapper.find('.m-tabs-content-item').isVisible()).toBe(false)
    })
  })

  describe('when currentTab changes to match tab', () => {
    it('then it should become visible', async () => {
      const currentTab = ref(1)
      const wrapper = mount(MazTabsContentItem, {
        props: { tab: 2 },
        global: {
          provide: {
            'maz-tabs': {
              currentTab,
            },
          },
        },
      })

      expect(wrapper.find('.m-tabs-content-item').isVisible()).toBe(false)

      currentTab.value = 2
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-tabs-content-item').isVisible()).toBe(true)
    })
  })

  describe('when currentTab changes away from tab', () => {
    it('then it should become hidden', async () => {
      const currentTab = ref(1)
      const wrapper = mount(MazTabsContentItem, {
        props: { tab: 1 },
        global: {
          provide: {
            'maz-tabs': {
              currentTab,
            },
          },
        },
      })

      expect(wrapper.find('.m-tabs-content-item').isVisible()).toBe(true)

      currentTab.value = 2
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-tabs-content-item').isVisible()).toBe(false)
    })
  })

  describe('when currentTab changes forward', () => {
    it('then it should use forward transition', async () => {
      const currentTab = ref(1)
      const wrapper = mount(MazTabsContentItem, {
        props: { tab: 1 },
        global: {
          provide: {
            'maz-tabs': {
              currentTab,
            },
          },
        },
      })

      const transition = wrapper.findComponent({ name: 'Transition' })
      expect(transition.props('name')).toBe('maz-tab-transition')

      currentTab.value = 2
      await wrapper.vm.$nextTick()

      expect(transition.props('name')).toBe('maz-tab-transition')
    })
  })

  describe('when currentTab changes backward', () => {
    it('then it should use reverse transition', async () => {
      const currentTab = ref(2)
      const wrapper = mount(MazTabsContentItem, {
        props: { tab: 1 },
        global: {
          provide: {
            'maz-tabs': {
              currentTab,
            },
          },
        },
      })

      const transition = wrapper.findComponent({ name: 'Transition' })
      expect(transition.props('name')).toBe('maz-tab-transition')

      currentTab.value = 1
      await wrapper.vm.$nextTick()

      expect(transition.props('name')).toBe('maz-tab-reverse-transition')
    })
  })

  describe('when rendered with slot content', () => {
    it('then it should render the slot content', () => {
      const wrapper = mount(MazTabsContentItem, {
        props: { tab: 1 },
        slots: {
          default: '<div>Tab item content</div>',
        },
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(1),
            },
          },
        },
      })

      expect(wrapper.html()).toContain('<div>Tab item content</div>')
    })
  })

  describe('when rendered with text content', () => {
    it('then it should render the text content', () => {
      const wrapper = mount(MazTabsContentItem, {
        props: { tab: 1 },
        slots: {
          default: 'Simple tab content',
        },
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(1),
            },
          },
        },
      })

      expect(wrapper.text()).toBe('Simple tab content')
    })
  })

  describe('when rendered with different tab numbers', () => {
    it('then it should handle tab number 3', () => {
      const wrapper = mount(MazTabsContentItem, {
        props: { tab: 3 },
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(3),
            },
          },
        },
      })

      expect(wrapper.find('.m-tabs-content-item').isVisible()).toBe(true)
    })

    it('then it should handle tab number 0', () => {
      const wrapper = mount(MazTabsContentItem, {
        props: { tab: 0 },
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(0),
            },
          },
        },
      })

      expect(wrapper.find('.m-tabs-content-item').isVisible()).toBe(true)
    })
  })

  describe('when no tabs context is provided', () => {
    it('then it should throw an error', () => {
      // Mock console.error to prevent error output in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        mount(MazTabsContentItem, {
          props: { tab: 1 },
        })
      }).toThrow()

      consoleSpy.mockRestore()
    })
  })
})
