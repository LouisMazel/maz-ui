import MazToast from '@plugins/toaster/MazToast.vue'
import { config, mount } from '@vue/test-utils'

config.global.stubs = {
  transition: false,
}

describe('mazToast', () => {
  it('renders with default props', async () => {
    const wrapper = mount(MazToast, {
      props: {
        message: 'Test message',
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Test message')
    expect(wrapper.classes()).toContain('m-toast')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(MazToast, {
      props: {
        message: 'Test message',
      },
    })

    await wrapper.vm.$nextTick()

    const toastButton = wrapper.find('.m-toast')

    await toastButton.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('emits open event when animation enter is complete', async () => {
    const wrapper = mount(MazToast, {
      props: {
        message: 'Test message',
      },
    })

    await wrapper.vm.$nextTick()

    // @ts-expect-error - private method
    wrapper.vm.onAnimationEnter()

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('emits close event when animation leave is complete', async () => {
    const wrapper = mount(MazToast, {
      props: {
        message: 'Test message',
      },
    })

    await wrapper.vm.$nextTick()

    // @ts-expect-error - private method
    wrapper.vm.onAnimationLeave()

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('closes the toast when close button is clicked', async () => {
    const wrapper = mount(MazToast, {
      props: {
        message: 'Test message',
      },
    })

    await vi.dynamicImportSettled()

    await wrapper.vm.$nextTick()

    const closeButton = wrapper.find('.--close')

    await closeButton.trigger('click')

    // @ts-expect-error - private method
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('renders with different types', async () => {
    const wrapper = mount(MazToast, {
      props: {
        message: 'Test message',
        type: 'success',
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toContain('--success')
  })

  it('renders with an action button', async () => {
    const wrapper = mount(MazToast, {
      props: {
        message: 'Test message',
        button: {
          text: 'Undo',
          onClick: vi.fn(),
        },
      },
    })

    await vi.dynamicImportSettled()

    const actionButton = wrapper.find('[data-test="action-btn"]')

    expect(actionButton.exists()).toBe(true)
    expect(actionButton.text()).toContain('Undo')
  })

  it('calls action function when action button is clicked', async () => {
    const actionFunc = vi.fn()
    const wrapper = mount(MazToast, {
      props: {
        message: 'Test message',
        button: {
          text: 'Undo',
          onClick: actionFunc,
        },
      },
    })

    await vi.dynamicImportSettled()

    const actionButton = wrapper.find('[data-test="action-btn"]')

    await actionButton.trigger('click')

    expect(actionFunc).toHaveBeenCalled()
  })

  it('emits click event when action button is clicked', async () => {
    const wrapper = mount(MazToast, {
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

    const actionButton = wrapper.find('[data-test="action-btn"]')

    await actionButton.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('renders with a link button', async () => {
    const wrapper = mount(MazToast, {
      props: {
        message: 'Test message',
        button: {
          text: 'View Details',
          href: 'https://example.com',
        },
      },
    })

    await vi.dynamicImportSettled()

    const linkButton = wrapper.find('[data-test="link-btn"]')

    expect(linkButton.exists()).toBe(true)
    expect(linkButton.text()).toContain('View Details')
  })
})
