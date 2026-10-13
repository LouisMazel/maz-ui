import MazContainer from '@components/MazContainer.vue'
import { mount } from '@vue/test-utils'

describe('MazContainer branch coverage', () => {
  describe('when mounted with default props', () => {
    it('should render', () => {
      const wrapper = mount(MazContainer)
      expect(wrapper.find('.m-container').exists()).toBe(true)
      wrapper.unmount()
    })

    it('should have default classes', () => {
      const wrapper = mount(MazContainer)
      const classes = wrapper.find('.m-container').classes()
      expect(classes).toContain('maz:border')
      expect(classes).toContain('maz:overflow-hidden')
      expect(classes).toContain('--rounded-md')
      expect(wrapper.find('.m-container__content').classes()).toContain('maz:px-4')
      wrapper.unmount()
    })
  })

  describe('when elevation is true', () => {
    it('should apply elevation class', () => {
      const wrapper = mount(MazContainer, {
        props: { elevation: true },
      })
      expect(wrapper.find('.m-container').classes()).toContain('maz:shadow-elevation')
      wrapper.unmount()
    })
  })

  describe('when elevation is false', () => {
    it('should not apply elevation class', () => {
      const wrapper = mount(MazContainer, {
        props: { elevation: false },
      })
      expect(wrapper.find('.m-container').classes()).not.toContain('maz:shadow-elevation')
      wrapper.unmount()
    })
  })

  describe('when padding is false', () => {
    it('should not apply padding class', () => {
      const wrapper = mount(MazContainer, {
        props: { padding: false },
      })
      expect(wrapper.find('.m-container__content').classes()).not.toContain('maz:px-4')
      wrapper.unmount()
    })
  })

  describe('when bordered is false', () => {
    it('should not apply bordered class', () => {
      const wrapper = mount(MazContainer, {
        props: { bordered: false },
      })
      expect(wrapper.find('.m-container').classes()).not.toContain('maz:border')
      wrapper.unmount()
    })
  })

  describe('when transparent is true', () => {
    it('should remove the background class', () => {
      const wrapper = mount(MazContainer, {
        props: { transparent: true },
      })
      expect(wrapper.find('.m-container').classes()).not.toContain('maz:bg-container')
      wrapper.unmount()
    })
  })

  describe('when overflowHidden is false', () => {
    it('should not apply overflow-hidden class', () => {
      const wrapper = mount(MazContainer, {
        props: { overflowHidden: false },
      })
      expect(wrapper.find('.m-container').classes()).not.toContain('maz:overflow-hidden')
      wrapper.unmount()
    })
  })

  describe('when block is true', () => {
    it('should apply the full-width class', () => {
      const wrapper = mount(MazContainer, {
        props: { block: true },
      })
      expect(wrapper.find('.m-container').classes()).toContain('maz:w-full')
      wrapper.unmount()
    })
  })

  describe('when roundedSize is set', () => {
    const sizes = ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const

    for (const size of sizes) {
      it(`should apply --rounded-${size} class`, () => {
        const wrapper = mount(MazContainer, {
          props: { roundedSize: size },
        })
        expect(wrapper.find('.m-container').classes()).toContain(`--rounded-${size}`)
        wrapper.unmount()
      })
    }
  })

  describe('when title is set', () => {
    it('should render header with title', () => {
      const wrapper = mount(MazContainer, {
        props: { title: 'My Title' },
      })
      expect(wrapper.find('.m-container__header').exists()).toBe(true)
      expect(wrapper.text()).toContain('My Title')
      wrapper.unmount()
    })
  })

  describe('when title is not set', () => {
    it('should not render header', () => {
      const wrapper = mount(MazContainer)
      expect(wrapper.find('.m-container__header').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when title slot is used', () => {
    it('should render header with slot content', () => {
      const wrapper = mount(MazContainer, {
        slots: {
          title: 'Slot Title',
        },
      })
      expect(wrapper.find('.m-container__header').exists()).toBe(true)
      expect(wrapper.text()).toContain('Slot Title')
      wrapper.unmount()
    })
  })

  describe('when startIcon is a string', () => {
    it('should render MazIcon with name', () => {
      const wrapper = mount(MazContainer, {
        props: { title: 'Test', startIcon: 'check' },
      })
      expect(wrapper.find('.m-container__header').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when endIcon is a string', () => {
    it('should render MazIcon with name', () => {
      const wrapper = mount(MazContainer, {
        props: { title: 'Test', endIcon: 'arrow-right' },
      })
      expect(wrapper.find('.m-container__header').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when iconSize is set', () => {
    it('should pass iconSize to MazIcon', () => {
      const wrapper = mount(MazContainer, {
        props: { title: 'Test', startIcon: 'check', iconSize: 'lg' },
      })
      wrapper.unmount()
    })
  })

  describe('when using default slot', () => {
    it('should render content', () => {
      const wrapper = mount(MazContainer, {
        slots: {
          default: '<p>Content</p>',
        },
      })
      expect(wrapper.find('.m-container__content').exists()).toBe(true)
      expect(wrapper.text()).toContain('Content')
      wrapper.unmount()
    })
  })

  describe('when header slot replaces default header', () => {
    it('should render custom header', () => {
      const wrapper = mount(MazContainer, {
        props: { title: 'Test' },
        slots: {
          header: '<div class="custom-header">Custom Header</div>',
        },
      })
      expect(wrapper.find('.custom-header').exists()).toBe(true)
      // Default header should NOT render
      expect(wrapper.find('.m-container__header').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when all boolean props are toggled', () => {
    it('should handle all false state', () => {
      const wrapper = mount(MazContainer, {
        props: {
          elevation: false,
          padding: false,
          bordered: false,
          transparent: false,
          overflowHidden: false,
          block: false,
        },
      })
      const classes = wrapper.find('.m-container').classes()
      expect(classes).not.toContain('maz:shadow-elevation')
      expect(classes).not.toContain('maz:border')
      expect(classes).not.toContain('maz:overflow-hidden')
      expect(classes).not.toContain('maz:w-full')
      expect(classes).toContain('maz:bg-container')
      expect(wrapper.find('.m-container__content').classes()).not.toContain('maz:px-4')
      wrapper.unmount()
    })

    it('should handle all true state', () => {
      const wrapper = mount(MazContainer, {
        props: {
          elevation: true,
          padding: true,
          bordered: true,
          transparent: true,
          overflowHidden: true,
          block: true,
        },
      })
      const classes = wrapper.find('.m-container').classes()
      expect(classes).toContain('maz:shadow-elevation')
      expect(classes).toContain('maz:border')
      expect(classes).toContain('maz:overflow-hidden')
      expect(classes).toContain('maz:w-full')
      expect(classes).not.toContain('maz:bg-container')
      expect(wrapper.find('.m-container__content').classes()).toContain('maz:px-4')
      wrapper.unmount()
    })
  })
})
