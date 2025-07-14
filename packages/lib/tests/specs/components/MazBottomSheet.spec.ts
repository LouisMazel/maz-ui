import MazBottomSheet from '@components/MazBottomSheet.vue'
import { mount } from '@vue/test-utils'

describe('mazBottomSheet', () => {
  it('renders the component', () => {
    const wrapper = mount(MazBottomSheet, {
      props: {
        noClose: false,
        noPadding: false,
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('emits open event when the backdrop is opened', async () => {
    const wrapper = mount(MazBottomSheet, {
      props: {
        noClose: false,
        noPadding: false,
      },
    })

    await wrapper.findComponent({ name: 'MazBackdrop' }).vm.$emit('open')

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('emits close event when the backdrop is closed', async () => {
    const wrapper = mount(MazBottomSheet, {
      props: {
        noClose: false,
        noPadding: false,
      },
    })

    await wrapper.findComponent({ name: 'MazBackdrop' }).vm.$emit('close')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not render the close button when noClose prop is true', () => {
    const wrapper = mount(MazBottomSheet, {
      props: {
        noClose: true,
        noPadding: false,
      },
    })

    expect(wrapper.findComponent({ name: 'MazBtn' }).exists()).toBe(false)
  })
})
