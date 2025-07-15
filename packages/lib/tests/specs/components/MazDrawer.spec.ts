import MazDrawer from '@components/MazDrawer.vue'
import { mount } from '@vue/test-utils'

describe('given MazDrawer component', () => {
  describe('when rendered with default props', () => {
    it('then it should render with default configuration', () => {
      const wrapper = mount(MazDrawer, {
        props: { modelValue: true },
      })

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'MazBackdrop' }).props('variant')).toBe('drawer')
      expect(wrapper.findComponent({ name: 'MazBackdrop' }).props('transitionName')).toBe('drawer-anim-right')
    })
  })

  describe('when rendered with different variants', () => {
    it('then it should apply the correct variant classes', () => {
      const variants = ['right', 'top', 'left', 'bottom']

      variants.forEach((variant) => {
        const wrapper = mount(MazDrawer, {
          props: { variant, modelValue: true },
        })
        expect(wrapper.find('.m-drawer-content-wrap').classes()).toContain(`--${variant}`)
      })
    })
  })

  describe('when rendered with custom size', () => {
    it('then it should apply the custom size', () => {
      const wrapper = mount(MazDrawer, {
        props: { size: '50vw', modelValue: true },
      })

      expect(wrapper.find('.m-drawer-content-wrap').attributes('style')).toContain('--maz-drawer-size: 50vw')
    })
  })

  describe('when rendered with title prop', () => {
    it('then it should display the title', () => {
      const wrapper = mount(MazDrawer, {
        props: { title: 'Test Title', modelValue: true },
      })

      expect(wrapper.find('.m-drawer-header__title').text()).toBe('Test Title')
      expect(wrapper.find('.m-drawer-header').classes()).toContain('--justify-between')
    })
  })

  describe('when rendered with title slot', () => {
    it('then it should render the title slot content', () => {
      const wrapper = mount(MazDrawer, {
        props: { modelValue: true },
        slots: {
          title: '<span>Custom Title</span>',
        },
      })

      expect(wrapper.find('.m-drawer-header__title').html()).toContain('<span>Custom Title</span>')
    })
  })

  describe('when rendered without title', () => {
    it('then it should apply justify-end class to header', () => {
      const wrapper = mount(MazDrawer, {
        props: { modelValue: true },
      })

      expect(wrapper.find('.m-drawer-header').classes()).toContain('--justify-end')
    })
  })

  describe('when rendered with hideCloseButton prop', () => {
    it('then it should not render the close button', () => {
      const wrapper = mount(MazDrawer, {
        props: { hideCloseButton: true, modelValue: true },
      })

      expect(wrapper.find('.m-drawer-header__close').exists()).toBe(false)
    })
  })

  describe('when rendered with default close button', () => {
    it('then it should render the close button', () => {
      const wrapper = mount(MazDrawer, {
        props: { modelValue: true },
      })

      expect(wrapper.find('.m-drawer-header__close').exists()).toBe(true)
    })
  })

  describe('when rendered with custom backdrop class', () => {
    it('then it should apply the custom backdrop class', () => {
      const wrapper = mount(MazDrawer, {
        props: { backdropClass: 'custom-backdrop', modelValue: true },
      })

      const backdrop = wrapper.findComponent({ name: 'MazBackdrop' })
      expect(backdrop.props('backdropClass')).toEqual(['m-drawer', 'custom-backdrop'])
    })
  })

  describe('when rendered with left variant', () => {
    it('then it should set justify to start', () => {
      const wrapper = mount(MazDrawer, {
        props: { variant: 'left', modelValue: true },
      })

      const backdrop = wrapper.findComponent({ name: 'MazBackdrop' })
      expect(backdrop.props('justify')).toBe('start')
    })
  })

  describe('when rendered with right variant', () => {
    it('then it should set justify to end', () => {
      const wrapper = mount(MazDrawer, {
        props: { variant: 'right', modelValue: true },
      })

      const backdrop = wrapper.findComponent({ name: 'MazBackdrop' })
      expect(backdrop.props('justify')).toBe('end')
    })
  })

  describe('when rendered with top variant', () => {
    it('then it should set align to start', () => {
      const wrapper = mount(MazDrawer, {
        props: { variant: 'top', modelValue: true },
      })

      const backdrop = wrapper.findComponent({ name: 'MazBackdrop' })
      expect(backdrop.props('align')).toBe('start')
    })
  })

  describe('when rendered with bottom variant', () => {
    it('then it should set align to end', () => {
      const wrapper = mount(MazDrawer, {
        props: { variant: 'bottom', modelValue: true },
      })

      const backdrop = wrapper.findComponent({ name: 'MazBackdrop' })
      expect(backdrop.props('align')).toBe('end')
    })
  })

  describe('when rendered with default content slot', () => {
    it('then it should render the slot content', () => {
      const wrapper = mount(MazDrawer, {
        props: { modelValue: true },
        slots: {
          default: '<div>Drawer content</div>',
        },
      })

      expect(wrapper.find('.m-drawer-body').html()).toContain('<div>Drawer content</div>')
    })
  })

  describe('when MazBackdrop emits events', () => {
    it('then it should emit the corresponding drawer events', async () => {
      const wrapper = mount(MazDrawer, {
        props: { modelValue: true },
      })
      const backdrop = wrapper.findComponent({ name: 'MazBackdrop' })

      await backdrop.vm.$emit('close')
      expect(wrapper.emitted('close')).toBeTruthy()

      await backdrop.vm.$emit('open')
      expect(wrapper.emitted('open')).toBeTruthy()

      await backdrop.vm.$emit('before-close')
      expect(wrapper.emitted('before-close')).toBeTruthy()

      await backdrop.vm.$emit('update:model-value', false)
      expect(wrapper.emitted('update:model-value')).toEqual([[false]])
    })
  })
})
