import MazTableTitle from '@components/MazTableTitle.vue'
import { mount } from '@vue/test-utils'

describe('given MazTableTitle component', () => {
  describe('when rendered with default props', () => {
    it('then it should render a th element', () => {
      const wrapper = mount(MazTableTitle, {
        global: {
          provide: {
            mazTableKey: { size: 'md' },
          },
        },
      })

      expect(wrapper.find('th').exists()).toBe(true)
      expect(wrapper.classes()).toContain('m-table-title')
      expect(wrapper.classes()).toContain('m-reset-css')
    })
  })

  describe('when rendered with injected size', () => {
    it('then it should apply xl size class', () => {
      const wrapper = mount(MazTableTitle, {
        global: {
          provide: {
            mazTableKey: { size: 'xl' },
          },
        },
      })

      expect(wrapper.classes()).toContain('--xl')
    })

    it('then it should apply lg size class', () => {
      const wrapper = mount(MazTableTitle, {
        global: {
          provide: {
            mazTableKey: { size: 'lg' },
          },
        },
      })

      expect(wrapper.classes()).toContain('--lg')
    })

    it('then it should apply md size class', () => {
      const wrapper = mount(MazTableTitle, {
        global: {
          provide: {
            mazTableKey: { size: 'md' },
          },
        },
      })

      expect(wrapper.classes()).toContain('--md')
    })

    it('then it should apply sm size class', () => {
      const wrapper = mount(MazTableTitle, {
        global: {
          provide: {
            mazTableKey: { size: 'sm' },
          },
        },
      })

      expect(wrapper.classes()).toContain('--sm')
    })

    it('then it should apply xs size class', () => {
      const wrapper = mount(MazTableTitle, {
        global: {
          provide: {
            mazTableKey: { size: 'xs' },
          },
        },
      })

      expect(wrapper.classes()).toContain('--xs')
    })

    it('then it should apply mini size class', () => {
      const wrapper = mount(MazTableTitle, {
        global: {
          provide: {
            mazTableKey: { size: 'mini' },
          },
        },
      })

      expect(wrapper.classes()).toContain('--mini')
    })
  })

  describe('when rendered with slot content', () => {
    it('then it should render the slot content', () => {
      const wrapper = mount(MazTableTitle, {
        slots: {
          default: '<span>Title content</span>',
        },
        global: {
          provide: {
            mazTableKey: { size: 'md' },
          },
        },
      })

      expect(wrapper.html()).toContain('<span>Title content</span>')
    })
  })

  describe('when rendered with text content', () => {
    it('then it should render the text content', () => {
      const wrapper = mount(MazTableTitle, {
        slots: {
          default: 'Column Title',
        },
        global: {
          provide: {
            mazTableKey: { size: 'md' },
          },
        },
      })

      expect(wrapper.text()).toBe('Column Title')
    })
  })

  describe('when no table context is provided', () => {
    it('then it should throw an error', () => {
      // Mock console.error to prevent error output in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        mount(MazTableTitle)
      }).toThrow()

      consoleSpy.mockRestore()
    })
  })
})
