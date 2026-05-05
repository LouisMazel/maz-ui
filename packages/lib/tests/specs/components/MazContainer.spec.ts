import MazContainer from '@components/MazContainer.vue'
import { mount, shallowMount } from '@vue/test-utils'

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

  it('forwards a full MazIconProps object on startIcon and endIcon', async () => {
    const wrapper = mount(MazContainer, {
      props: {
        title: 'Header',
        startIcon: { icon: '/start.svg', size: 'lg' },
        endIcon: { icon: '/end.svg', size: 'lg', title: 'End' },
      },
    })

    await vi.dynamicImportSettled()

    const icons = wrapper.findAllComponents({ name: 'MazIcon' })
    expect(icons).toHaveLength(2)
    expect(icons[0].props('icon')).toBe('/start.svg')
    expect(icons[1].props('icon')).toBe('/end.svg')
    expect(icons[1].props('title')).toBe('End')
  })
})
