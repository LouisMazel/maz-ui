import MazTableCell from '@components/MazTableCell.vue'
import { mount } from '@vue/test-utils'
import { mazTableKey } from '@/components/MazTable.vue'

describe('given MazTableCell component', () => {
  describe('when rendered with default props', () => {
    it('then it should render a td element', () => {
      const wrapper = mount(MazTableCell, {
        global: {
          provide: {
            [mazTableKey]: { size: 'md' },
          },
        },
      })

      expect(wrapper.find('td').exists()).toBe(true)
      expect(wrapper.classes()).toContain('m-table-cell')
      expect(wrapper.classes()).toContain('m-reset-css')
    })
  })

  describe('when rendered with injected size', () => {
    it('then it should apply xl size class', () => {
      const wrapper = mount(MazTableCell, {
        global: {
          provide: {
            [mazTableKey]: { size: 'xl' },
          },
        },
      })

      expect(wrapper.classes()).toContain('--xl')
    })

    it('then it should apply lg size class', () => {
      const wrapper = mount(MazTableCell, {
        global: {
          provide: {
            [mazTableKey]: { size: 'lg' },
          },
        },
      })

      expect(wrapper.classes()).toContain('--lg')
    })

    it('then it should apply md size class', () => {
      const wrapper = mount(MazTableCell, {
        global: {
          provide: {
            [mazTableKey]: { size: 'md' },
          },
        },
      })

      expect(wrapper.classes()).toContain('--md')
    })

    it('then it should apply sm size class', () => {
      const wrapper = mount(MazTableCell, {
        global: {
          provide: {
            [mazTableKey]: { size: 'sm' },
          },
        },
      })

      expect(wrapper.classes()).toContain('--sm')
    })

    it('then it should apply xs size class', () => {
      const wrapper = mount(MazTableCell, {
        global: {
          provide: {
            [mazTableKey]: { size: 'xs' },
          },
        },
      })

      expect(wrapper.classes()).toContain('--xs')
    })

    it('then it should apply mini size class', () => {
      const wrapper = mount(MazTableCell, {
        global: {
          provide: {
            [mazTableKey]: { size: 'mini' },
          },
        },
      })

      expect(wrapper.classes()).toContain('--mini')
    })
  })

  describe('when rendered with slot content', () => {
    it('then it should render the slot content', () => {
      const wrapper = mount(MazTableCell, {
        slots: {
          default: '<span>Cell content</span>',
        },
        global: {
          provide: {
            [mazTableKey]: { size: 'md' },
          },
        },
      })

      expect(wrapper.html()).toContain('<span>Cell content</span>')
    })
  })

  describe('when rendered with text content', () => {
    it('then it should render the text content', () => {
      const wrapper = mount(MazTableCell, {
        slots: {
          default: 'Simple text content',
        },
        global: {
          provide: {
            [mazTableKey]: { size: 'md' },
          },
        },
      })

      expect(wrapper.text()).toBe('Simple text content')
    })
  })

  describe('when no table context is provided', () => {
    it('then it should throw an error', () => {
      // Mock console.error to prevent error output in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        mount(MazTableCell)
      }).toThrow()

      consoleSpy.mockRestore()
    })
  })
})
