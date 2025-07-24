import MazTableRow from '@components/MazTableRow.vue'
import { mount } from '@vue/test-utils'
import { mazTableKey } from '@/components/MazTable.vue'

describe('given MazTableRow component', () => {
  describe('when rendered with default props', () => {
    it('then it should render a tr element', () => {
      const wrapper = mount(MazTableRow, {
        global: {
          provide: {
            [mazTableKey]: {
              backgroundEven: false,
              backgroundOdd: false,
              hoverable: true,
            },
          },
        },
      })

      expect(wrapper.find('tr').exists()).toBe(true)
      expect(wrapper.classes()).toContain('m-table-row')
      expect(wrapper.classes()).toContain('m-reset-css')
    })
  })

  describe('when rendered with injected hoverable true', () => {
    it('then it should apply hoverable class', () => {
      const wrapper = mount(MazTableRow, {
        global: {
          provide: {
            [mazTableKey]: {
              backgroundEven: false,
              backgroundOdd: false,
              hoverable: true,
            },
          },
        },
      })

      expect(wrapper.classes()).toContain('--hoverable')
    })
  })

  describe('when rendered with injected hoverable false', () => {
    it('then it should not apply hoverable class', () => {
      const wrapper = mount(MazTableRow, {
        global: {
          provide: {
            [mazTableKey]: {
              backgroundEven: false,
              backgroundOdd: false,
              hoverable: false,
            },
          },
        },
      })

      expect(wrapper.classes()).not.toContain('--hoverable')
    })
  })

  describe('when rendered with hoverable prop false', () => {
    it('then it should not apply hoverable class even if injected is true', () => {
      const wrapper = mount(MazTableRow, {
        props: { hoverable: false },
        global: {
          provide: {
            [mazTableKey]: {
              backgroundEven: false,
              backgroundOdd: false,
              hoverable: true,
            },
          },
        },
      })

      expect(wrapper.classes()).not.toContain('--hoverable')
    })
  })

  describe('when rendered with backgroundOdd true', () => {
    it('then it should apply background odd class', () => {
      const wrapper = mount(MazTableRow, {
        global: {
          provide: {
            [mazTableKey]: {
              backgroundEven: false,
              backgroundOdd: true,
              hoverable: true,
            },
          },
        },
      })

      expect(wrapper.classes()).toContain('--background-odd')
    })
  })

  describe('when rendered with backgroundEven true', () => {
    it('then it should apply background even class', () => {
      const wrapper = mount(MazTableRow, {
        global: {
          provide: {
            [mazTableKey]: {
              backgroundEven: true,
              backgroundOdd: false,
              hoverable: true,
            },
          },
        },
      })

      expect(wrapper.classes()).toContain('--background-even')
    })
  })

  describe('when rendered with both background options true', () => {
    it('then it should apply both background classes', () => {
      const wrapper = mount(MazTableRow, {
        global: {
          provide: {
            [mazTableKey]: {
              backgroundEven: true,
              backgroundOdd: true,
              hoverable: true,
            },
          },
        },
      })

      expect(wrapper.classes()).toContain('--background-even')
      expect(wrapper.classes()).toContain('--background-odd')
    })
  })

  describe('when rendered with all options enabled', () => {
    it('then it should apply all modifier classes', () => {
      const wrapper = mount(MazTableRow, {
        global: {
          provide: {
            [mazTableKey]: {
              backgroundEven: true,
              backgroundOdd: true,
              hoverable: true,
            },
          },
        },
      })

      expect(wrapper.classes()).toContain('--hoverable')
      expect(wrapper.classes()).toContain('--background-even')
      expect(wrapper.classes()).toContain('--background-odd')
    })
  })

  describe('when rendered with slot content', () => {
    it('then it should render the slot content', () => {
      const wrapper = mount(MazTableRow, {
        slots: {
          default: '<td>Cell content</td>',
        },
        global: {
          provide: {
            [mazTableKey]: {
              backgroundEven: false,
              backgroundOdd: false,
              hoverable: true,
            },
          },
        },
      })

      expect(wrapper.html()).toContain('<td>Cell content</td>')
    })
  })

  describe('when rendered with multiple cells', () => {
    it('then it should render all cell content', () => {
      const wrapper = mount(MazTableRow, {
        slots: {
          default: '<td>Cell 1</td><td>Cell 2</td><td>Cell 3</td>',
        },
        global: {
          provide: {
            [mazTableKey]: {
              backgroundEven: false,
              backgroundOdd: false,
              hoverable: true,
            },
          },
        },
      })

      expect(wrapper.text()).toContain('Cell 1')
      expect(wrapper.text()).toContain('Cell 2')
      expect(wrapper.text()).toContain('Cell 3')
    })
  })

  describe('when no table context is provided', () => {
    it('then it should throw an error', () => {
      // Mock console.error to prevent error output in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        mount(MazTableRow)
      }).toThrow()

      consoleSpy.mockRestore()
    })
  })
})
