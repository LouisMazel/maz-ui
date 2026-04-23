import type { VueWrapper } from '@vue/test-utils'
import MazReadMore from '@components/MazReadMore.vue'
import { mount, shallowMount } from '@vue/test-utils'

describe('given MazReadMore component', () => {
  describe('when rendered with default props', () => {
    it('then it renders with base classes', () => {
      const wrapper = shallowMount(MazReadMore)

      expect(wrapper.classes()).toContain('m-read-more')
      expect(wrapper.classes()).toContain('m-reset-css')
    })

    it('then it renders the content element', () => {
      const wrapper = shallowMount(MazReadMore)

      expect(wrapper.find('.m-read-more__content').exists()).toBe(true)
    })

    it('then it applies truncated class by default', () => {
      const wrapper = shallowMount(MazReadMore)

      expect(wrapper.find('.m-read-more__content').classes()).toContain('m-read-more__content--truncated')
    })

    it('then it has unique instance id', () => {
      const wrapper = shallowMount(MazReadMore)

      expect(wrapper.attributes('id')).toMatch(/^MazReadMore-/)
    })
  })

  describe('when rendered with custom id', () => {
    it('then it uses the provided id', () => {
      const wrapper = shallowMount(MazReadMore, {
        props: {
          id: 'custom-read-more',
        },
      })

      expect(wrapper.attributes('id')).toBe('custom-read-more')
    })
  })

  describe('when rendered with text prop', () => {
    it('then it displays the provided text', () => {
      const wrapper = shallowMount(MazReadMore, {
        props: {
          text: 'This is a test text',
        },
      })

      expect(wrapper.find('.m-read-more__content').text()).toBe('This is a test text')
    })
  })

  describe('when rendered with slot content', () => {
    it('then it displays the slot content', () => {
      const wrapper = shallowMount(MazReadMore, {
        slots: {
          default: '<span>Slot content here</span>',
        },
      })

      expect(wrapper.find('.m-read-more__content').html()).toContain('<span>Slot content here</span>')
    })
  })

  describe('when rendered with maxLines prop', () => {
    let wrapper: VueWrapper<InstanceType<typeof MazReadMore>>

    beforeEach(() => {
      wrapper = mount(MazReadMore, {
        props: {
          text: 'Test content',
          maxLines: 3,
        },
      })
    })

    it('then it applies the line clamp styles', () => {
      const content = wrapper.find('.m-read-more__content')
      const style = content.attributes('style')

      expect(style).toContain('display: -webkit-box')
      expect(style).toContain('-webkit-line-clamp: 3')
      expect(style).toContain('overflow: hidden')
    })
  })

  describe('when rendered with maxChars prop and text exceeds limit', () => {
    it('then it shows the expand button and truncates text', async () => {
      const longText = 'A'.repeat(200)
      const wrapper = mount(MazReadMore, {
        props: {
          text: longText,
          maxChars: 100,
        },
      })

      await vi.dynamicImportSettled()

      expect(wrapper.findComponent({ name: 'MazLink' }).exists()).toBe(true)
      expect(wrapper.find('.m-read-more__content').text().length).toBe(103)
    })

    it('then it truncates the text to maxChars with ellipsis', async () => {
      const longText = 'A'.repeat(200)
      const wrapper = mount(MazReadMore, {
        props: {
          text: longText,
          maxChars: 100,
        },
      })

      await vi.dynamicImportSettled()

      const content = wrapper.find('.m-read-more__content')
      expect(content.text()).toBe(`${'A'.repeat(100)}...`)
      expect(content.text().length).toBe(103)
    })

    it('then it shows full text when expanded', async () => {
      const longText = 'A'.repeat(200)
      const wrapper = mount(MazReadMore, {
        props: {
          text: longText,
          maxChars: 100,
        },
      })

      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-read-more__content').text().length).toBe(103)

      const link = wrapper.findComponent({ name: 'MazLink' })
      await link.trigger('click')

      const content = wrapper.find('.m-read-more__content')
      expect(content.text()).toBe(longText)
      expect(content.text().length).toBe(200)
    })
  })

  describe('when rendered with maxChars prop and text is within limit', () => {
    it('then it does not show the expand button', () => {
      const wrapper = shallowMount(MazReadMore, {
        props: {
          text: 'Short text',
          maxChars: 100,
        },
      })

      expect(wrapper.find('maz-link-stub').exists()).toBe(false)
    })
  })

  describe('when rendered with custom color prop', () => {
    it('then it passes the color to MazLink', async () => {
      const longText = 'A'.repeat(200)
      const wrapper = mount(MazReadMore, {
        props: {
          text: longText,
          maxChars: 100,
          color: 'secondary',
        },
      })

      await vi.dynamicImportSettled()

      const link = wrapper.findComponent({ name: 'MazLink' })
      expect(link.props('color')).toBe('secondary')
    })
  })

  describe('when rendered with custom collapseText and expandText props', () => {
    it('then it displays expandText on button when collapsed', async () => {
      const longText = 'A'.repeat(200)
      const wrapper = mount(MazReadMore, {
        props: {
          text: longText,
          maxChars: 100,
          collapseText: 'Show less',
          expandText: 'Show more',
        },
      })

      await vi.dynamicImportSettled()

      const link = wrapper.findComponent({ name: 'MazLink' })
      expect(link.text()).toBe('Show more')
      expect(wrapper.find('.m-read-more__content').text().length).toBe(103)
    })

    it('then it displays collapseText on button when expanded', async () => {
      const longText = 'A'.repeat(200)
      const wrapper = mount(MazReadMore, {
        props: {
          text: longText,
          maxChars: 100,
          collapseText: 'Show less',
          expandText: 'Show more',
        },
      })

      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-read-more__content').text().length).toBe(103)

      const link = wrapper.findComponent({ name: 'MazLink' })
      await link.trigger('click')

      expect(link.text()).toBe('Show less')
      expect(wrapper.find('.m-read-more__content').text().length).toBe(200)
    })
  })

  describe('when the expand button is clicked', () => {
    it('then it removes the truncated class and shows full text', async () => {
      const longText = 'A'.repeat(200)
      const wrapper = mount(MazReadMore, {
        props: {
          text: longText,
          maxChars: 100,
        },
      })

      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-read-more__content').text().length).toBe(103)

      const link = wrapper.findComponent({ name: 'MazLink' })
      await link.trigger('click')

      expect(wrapper.find('.m-read-more__content').classes()).not.toContain('m-read-more__content--truncated')
      expect(wrapper.find('.m-read-more__content').text().length).toBe(200)
    })
  })

  describe('when expanded', () => {
    it('then it removes truncate styles and shows full text', async () => {
      const wrapper = mount(MazReadMore, {
        props: {
          text: 'A'.repeat(200),
          maxChars: 100,
        },
      })

      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-read-more__content').text().length).toBe(103)

      const link = wrapper.findComponent({ name: 'MazLink' })
      await link.trigger('click')

      const content = wrapper.find('.m-read-more__content')
      const style = content.attributes('style')

      expect(style).toBeFalsy()
      expect(content.text().length).toBe(200)
    })
  })

  describe('when the link element is rendered', () => {
    it('then it has the sm size and text is truncated', async () => {
      const wrapper = mount(MazReadMore, {
        props: {
          text: 'A'.repeat(200),
          maxChars: 100,
        },
      })

      await vi.dynamicImportSettled()

      const link = wrapper.findComponent({ name: 'MazLink' })
      expect(link.attributes('size')).toBe('sm')
      expect(wrapper.find('.m-read-more__content').text().length).toBe(103)
    })
  })

  describe('when rendered with default color', () => {
    it('then it uses primary color for the link and text is truncated', async () => {
      const wrapper = mount(MazReadMore, {
        props: {
          text: 'A'.repeat(200),
          maxChars: 100,
        },
      })

      await vi.dynamicImportSettled()

      const link = wrapper.findComponent({ name: 'MazLink' })
      expect(link.props('color')).toBe('primary')
      expect(wrapper.find('.m-read-more__content').text().length).toBe(103)
    })
  })

  describe('when rendered without exceeding maxChars and without slot', () => {
    it('then initialShouldShowButton is false', () => {
      const wrapper = shallowMount(MazReadMore, {
        props: {
          text: 'Short',
          maxChars: 100,
        },
      })

      expect(wrapper.find('maz-link-stub').exists()).toBe(false)
    })
  })

  describe('when rendered with slot content and maxChars', () => {
    it('then it renders hidden element for slot measurement', () => {
      const wrapper = mount(MazReadMore, {
        props: {
          maxChars: 10,
        },
        slots: {
          default: 'A'.repeat(200),
        },
      })

      expect(wrapper.find('.m-read-more__hidden').exists()).toBe(true)
    })

    it('then it shows the expand button when slot text exceeds maxChars and truncates text', async () => {
      const wrapper = mount(MazReadMore, {
        props: {
          maxChars: 10,
        },
        slots: {
          default: 'A'.repeat(200),
        },
      })

      await vi.dynamicImportSettled()

      expect(wrapper.findComponent({ name: 'MazLink' }).exists()).toBe(true)
      expect(wrapper.find('.m-read-more__content').text().length).toBe(13)
    })

    it('then it truncates slot text content to maxChars with ellipsis', async () => {
      const wrapper = mount(MazReadMore, {
        props: {
          maxChars: 10,
        },
        slots: {
          default: 'A'.repeat(200),
        },
      })

      await vi.dynamicImportSettled()

      const content = wrapper.find('.m-read-more__content')
      expect(content.text()).toBe(`${'A'.repeat(10)}...`)
      expect(content.text().length).toBe(13)
    })

    it('then it shows full slot content when expanded', async () => {
      const slotContent = 'A'.repeat(200)
      const wrapper = mount(MazReadMore, {
        props: {
          maxChars: 10,
        },
        slots: {
          default: slotContent,
        },
      })

      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-read-more__content').text().length).toBe(13)

      const link = wrapper.findComponent({ name: 'MazLink' })
      await link.trigger('click')

      const content = wrapper.find('.m-read-more__content')
      expect(content.text()).toBe(slotContent)
      expect(content.text().length).toBe(200)
    })
  })

  describe('when checking accessibility attributes', () => {
    describe('when content region is rendered', () => {
      it('then it has role="region"', () => {
        const wrapper = shallowMount(MazReadMore, {
          props: {
            text: 'Test content',
          },
        })

        expect(wrapper.find('.m-read-more__content').attributes('role')).toBe('region')
      })

      it('then it has aria-label attribute', () => {
        const wrapper = shallowMount(MazReadMore, {
          props: {
            text: 'Test content',
          },
        })

        expect(wrapper.find('.m-read-more__content').attributes('aria-label')).toBeTruthy()
      })

      it('then it uses custom aria-label when provided', () => {
        const wrapper = shallowMount(MazReadMore, {
          props: {
            text: 'Test content',
            ariaLabel: 'Custom accessibility label',
          },
        })

        expect(wrapper.find('.m-read-more__content').attributes('aria-label')).toBe('Custom accessibility label')
      })

      it('then it has content id for aria-controls linking', () => {
        const wrapper = shallowMount(MazReadMore, {
          props: {
            text: 'Test content',
            id: 'test-read-more',
          },
        })

        expect(wrapper.find('.m-read-more__content').attributes('id')).toBe('test-read-more-content')
      })
    })

    describe('when button is rendered', () => {
      it('then it has role="button"', async () => {
        const wrapper = mount(MazReadMore, {
          props: {
            text: 'A'.repeat(200),
            maxChars: 100,
          },
        })

        await vi.dynamicImportSettled()

        const link = wrapper.findComponent({ name: 'MazLink' })
        expect(link.attributes('role')).toBe('button')
      })

      it('then it has aria-expanded attribute set to false when collapsed', async () => {
        const wrapper = mount(MazReadMore, {
          props: {
            text: 'A'.repeat(200),
            maxChars: 100,
          },
        })

        await vi.dynamicImportSettled()

        const link = wrapper.findComponent({ name: 'MazLink' })
        expect(link.attributes('aria-expanded')).toBe('false')
      })

      it('then aria-expanded toggles on click and text expands', async () => {
        const wrapper = mount(MazReadMore, {
          props: {
            text: 'A'.repeat(200),
            maxChars: 100,
          },
        })

        await vi.dynamicImportSettled()

        const link = wrapper.findComponent({ name: 'MazLink' })
        expect(link.attributes('aria-expanded')).toBe('false')
        expect(wrapper.find('.m-read-more__content').text().length).toBe(103)

        await link.trigger('click')

        expect(link.attributes('aria-expanded')).toBe('true')
        expect(wrapper.find('.m-read-more__content').text().length).toBe(200)
      })

      it('then it has aria-controls linking to content', async () => {
        const wrapper = mount(MazReadMore, {
          props: {
            text: 'A'.repeat(200),
            maxChars: 100,
            id: 'test-read-more',
          },
        })

        await vi.dynamicImportSettled()

        const link = wrapper.findComponent({ name: 'MazLink' })
        expect(link.attributes('aria-controls')).toBe('test-read-more-content')
      })

      it('then it has button id', async () => {
        const wrapper = mount(MazReadMore, {
          props: {
            text: 'A'.repeat(200),
            maxChars: 100,
            id: 'test-read-more',
          },
        })

        await vi.dynamicImportSettled()

        const link = wrapper.findComponent({ name: 'MazLink' })
        expect(link.attributes('id')).toBe('test-read-more-button')
      })
    })

    describe('when content aria-expanded state changes', () => {
      it('then content aria-expanded is false when collapsed and button is shown', async () => {
        const wrapper = mount(MazReadMore, {
          props: {
            text: 'A'.repeat(200),
            maxChars: 100,
          },
        })

        await vi.dynamicImportSettled()

        expect(wrapper.find('.m-read-more__content').attributes('aria-expanded')).toBe('false')
        expect(wrapper.find('.m-read-more__content').text().length).toBe(103)
      })

      it('then content aria-expanded changes to true after click and text expands', async () => {
        const wrapper = mount(MazReadMore, {
          props: {
            text: 'A'.repeat(200),
            maxChars: 100,
          },
        })

        await vi.dynamicImportSettled()

        expect(wrapper.find('.m-read-more__content').attributes('aria-expanded')).toBe('false')
        expect(wrapper.find('.m-read-more__content').text().length).toBe(103)

        const link = wrapper.findComponent({ name: 'MazLink' })
        await link.trigger('click')

        expect(wrapper.find('.m-read-more__content').attributes('aria-expanded')).toBe('true')
        expect(wrapper.find('.m-read-more__content').text().length).toBe(200)
      })
    })
  })
})
