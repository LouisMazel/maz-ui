import MazToast from '@plugins/toast/MazToast.vue'
import { config, mount } from '@vue/test-utils'

config.global.stubs = {
  transition: false,
}

describe('given MazToast component', () => {
  let wrapper: ReturnType<typeof mount>

  afterEach(() => {
    wrapper?.unmount()
  })

  describe('when rendering with default props', () => {
    it('then it should render the toast with message', async () => {
      wrapper = mount(MazToast, {
        props: {
          message: 'Test message',
        },
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Test message')
      expect(wrapper.classes()).toContain('m-toast')
    })
  })

  describe('when toast button is clicked', () => {
    it('then it should emit click event', async () => {
      wrapper = mount(MazToast, {
        props: {
          message: 'Test message',
        },
      })

      await wrapper.vm.$nextTick()

      const toastButton = wrapper.find('.m-toast__button')
      await toastButton.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('when animation enter is complete', () => {
    it('then it should emit open event', async () => {
      wrapper = mount(MazToast, {
        props: {
          message: 'Test message',
        },
      })

      await wrapper.vm.$nextTick()

      // @ts-expect-error - private method
      wrapper.vm.onAnimationEnter()

      expect(wrapper.emitted('open')).toBeTruthy()
    })
  })

  describe('when animation leave is complete', () => {
    it('then it should emit close event', async () => {
      wrapper = mount(MazToast, {
        props: {
          message: 'Test message',
        },
      })

      await wrapper.vm.$nextTick()

      // @ts-expect-error - private method
      wrapper.vm.onAnimationLeave()

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('when close button is clicked', () => {
    it('then it should close the toast', async () => {
      wrapper = mount(MazToast, {
        props: {
          message: 'Test message',
        },
      })

      await vi.dynamicImportSettled()
      await wrapper.vm.$nextTick()

      const closeButton = wrapper.find('.m-toast__close')
      await closeButton.trigger('click')

      // @ts-expect-error - private method
      expect(wrapper.vm.isActive).toBe(false)
    })
  })

  describe('when rendering with different types', () => {
    it('then it should apply the correct type class', async () => {
      wrapper = mount(MazToast, {
        props: {
          message: 'Test message',
          type: 'success',
        },
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('--success')
    })
  })

  describe('when rendering with an action button', () => {
    it('then it should render the action button', async () => {
      wrapper = mount(MazToast, {
        props: {
          message: 'Test message',
          button: {
            text: 'Undo',
            onClick: vi.fn(),
          },
        },
      })

      await vi.dynamicImportSettled()

      const actionButton = wrapper.findComponent({ name: 'MazBtn' })

      expect(actionButton.exists()).toBe(true)
      expect(actionButton.text()).toContain('Undo')
    })
  })

  describe('when action button is clicked', () => {
    it('then it should call the action function', async () => {
      const actionFunc = vi.fn()
      wrapper = mount(MazToast, {
        props: {
          message: 'Test message',
          button: {
            text: 'Undo',
            onClick: actionFunc,
          },
        },
      })

      await vi.dynamicImportSettled()

      const actionButton = wrapper.findComponent({ name: 'MazBtn' })
      await actionButton.trigger('click')

      expect(actionFunc).toHaveBeenCalled()
    })
  })

  describe('when action button with closeToast is clicked', () => {
    it('then it should emit click event', async () => {
      wrapper = mount(MazToast, {
        props: {
          message: 'Test message',
          button: {
            text: 'Undo',
            onClick: vi.fn(),
            closeToast: true,
          },
        },
      })

      await vi.dynamicImportSettled()

      const actionButton = wrapper.findComponent({ name: 'MazBtn' })
      await actionButton.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('when rendering with a link button', () => {
    it('then it should render the link button', async () => {
      wrapper = mount(MazToast, {
        props: {
          message: 'Test message',
          button: {
            text: 'View Details',
            href: 'https://example.com',
          },
        },
      })

      await vi.dynamicImportSettled()

      const linkButton = wrapper.findComponent({ name: 'MazBtn' })

      expect(linkButton.exists()).toBe(true)
      expect(linkButton.text()).toContain('View Details')
    })
  })
})
