import MazContainer from '@components/MazContainer.vue'
import { shallowMount } from '@vue/test-utils'

describe('components/MazContainer.vue', () => {
  it('renders with default props', () => {
    const wrapper = shallowMount(MazContainer)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('m-container')
  })

  it('renders with header slot content', () => {
    const wrapper = shallowMount(MazContainer, {
      slots: {
        title: '<div>Card Header</div>',
      },
    })

    const header = wrapper.find('.m-container__header')
    expect(header.exists()).toBe(true)
    expect(header.text()).toContain('Card Header')
  })

  it('applies correct styles based on props', () => {
    const wrapper = shallowMount(MazContainer, {
      props: {
        rounded: true,
        bordered: true,
        elevation: true,
        padding: true,
        roundedSize: 'full',
      },
    })

    expect(wrapper.classes()).toContain('--elevation')
    expect(wrapper.classes()).toContain('--padding')
    expect(wrapper.classes()).toContain('--bordered')
    expect(wrapper.classes()).toContain('--rounded-full')
  })
})
