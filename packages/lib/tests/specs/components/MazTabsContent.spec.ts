import MazTabsContent from '@components/MazTabsContent.vue'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

describe('given MazTabsContent component', () => {
  describe('when rendered with default props', () => {
    it('then it should render with correct classes', () => {
      const wrapper = mount(MazTabsContent, {
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(1),
            },
          },
        },
      })

      expect(wrapper.classes()).toContain('m-tabs-content')
      expect(wrapper.classes()).toContain('m-reset-css')
      expect(wrapper.classes()).toContain('maz-relative')
    })
  })

  describe('when currentTab changes', () => {
    it('then it should temporarily hide overflow', async () => {
      const currentTab = ref(1)
      const wrapper = mount(MazTabsContent, {
        global: {
          provide: {
            'maz-tabs': {
              currentTab,
            },
          },
        },
      })

      expect(wrapper.classes()).toContain('maz-overflow-hidden')

      // Change tab
      currentTab.value = 2
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('maz-overflow-hidden')
    })
  })

  describe('when overflow is hidden', () => {
    it('then it should apply overflow hidden class', () => {
      const wrapper = mount(MazTabsContent, {
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(1),
            },
          },
        },
      })

      expect(wrapper.classes()).toContain('maz-overflow-hidden')
    })
  })

  describe('when rendered with slot content', () => {
    it('then it should render the slot content', () => {
      const wrapper = mount(MazTabsContent, {
        slots: {
          default: '<div>Tab content</div>',
        },
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(1),
            },
          },
        },
      })

      expect(wrapper.html()).toContain('<div>Tab content</div>')
    })
  })

  describe('when rendered with multiple slots', () => {
    it('then it should render all slot content', () => {
      const wrapper = mount(MazTabsContent, {
        slots: {
          default: '<div>Content 1</div><div>Content 2</div><div>Content 3</div>',
        },
        global: {
          provide: {
            'maz-tabs': {
              currentTab: ref(1),
            },
          },
        },
      })

      expect(wrapper.text()).toContain('Content 1')
      expect(wrapper.text()).toContain('Content 2')
      expect(wrapper.text()).toContain('Content 3')
    })
  })

  describe('when no tabs context is provided', () => {
    it('then it should throw an error', () => {
      // Mock console.error to prevent error output in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        mount(MazTabsContent)
      }).toThrow()

      consoleSpy.mockRestore()
    })
  })
})
