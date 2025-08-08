import MazBackdrop from '@components/MazBackdrop.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('mazBackdrop', () => {
  it('opens and closes correctly', async () => {
    const wrapper = mount(MazBackdrop, {
      props: {
        modelValue: true,
      },
    })
    expect(wrapper.vm.present).toBe(true)
    wrapper.vm.close()
    await nextTick()
    expect(wrapper.vm.present).toBe(false)
  })

  it('emits events correctly', async () => {
    const wrapper = mount(MazBackdrop)
    await wrapper.vm.toggleModal(true)
    expect(wrapper.vm.present).toBeTruthy()
    await wrapper.vm.toggleModal(false)
    expect(wrapper.emitted()['before-close']).toBeTruthy()
    expect(wrapper.vm.present).toBeFalsy()
  })

  it('calls beforeClose function correctly', () => {
    const spyBeforeClose = vi.fn()
    const wrapper = mount(MazBackdrop, {
      props: { beforeClose: spyBeforeClose },
    })
    wrapper.vm.toggleModal(false)
    expect(spyBeforeClose).toHaveBeenCalled()
  })

  it('adds and removes class from document correctly', () => {
    document.documentElement.classList.remove('--backdrop-present')
    expect(document.documentElement.classList.contains('--backdrop-present')).toBe(false)
    const wrapper = mount(MazBackdrop, {
      props: {
        modelValue: true,
      },
    })
    expect(document.documentElement.classList.contains('--backdrop-present')).toBe(true)
    wrapper.vm.close()
    wrapper.vm.onBackdropAnimationLeave()
    expect(document.documentElement.classList.contains('--backdrop-present')).toBe(false)
  })

  it('closes on esc key press correctly', async () => {
    const wrapper = mount(MazBackdrop, {
      props: {
        modelValue: true,
        closeOnEscape: true,
      },
    })

    wrapper.vm.onKeyPress({ key: 'Escape' } as KeyboardEvent)
    await nextTick()
    expect(wrapper.vm.present).toBe(false)
  })

  it('does not close on esc key press when persistent is true', async () => {
    const wrapper = mount(MazBackdrop, {
      props: {
        modelValue: true,
        closeOnEscape: true,
        persistent: true,
      },
    })

    wrapper.vm.onKeyPress({ key: 'Escape' } as KeyboardEvent)
    await nextTick()
    expect(wrapper.vm.present).toBe(true)
  })
})
