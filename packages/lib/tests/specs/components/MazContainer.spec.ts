import MazContainer from '@components/MazContainer.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig'
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

function mountWithGlobalConfig(config: unknown, props: Record<string, unknown> = {}) {
  return mount(MazContainer, {
    props,
    global: { provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: config } },
  })
}

describe('given a MazUi global default for roundedSize', () => {
  describe('when no roundedSize prop is passed', () => {
    it('then it applies the global default rounded class', () => {
      const wrapper = mountWithGlobalConfig({ global: { roundedSize: 'full' } })
      expect(wrapper.classes()).toContain('maz:rounded-full')
    })
  })

  describe('when a roundedSize prop is passed', () => {
    it('then the instance prop wins over the global default', () => {
      const wrapper = mountWithGlobalConfig({ global: { roundedSize: 'full' } }, { roundedSize: 'none' })
      expect(wrapper.classes()).not.toContain('maz:rounded-full')
    })
  })
})

describe('given a component-scoped default for bordered', () => {
  describe('when no bordered prop is passed', () => {
    it('then the component default disables the border', () => {
      const wrapper = mountWithGlobalConfig({ MazContainer: { bordered: false } })
      expect(wrapper.classes()).not.toContain('maz:border')
    })
  })

  describe('when a bordered prop is passed', () => {
    it('then the instance prop wins over the component default', () => {
      const wrapper = mountWithGlobalConfig({ MazContainer: { bordered: false } }, { bordered: true })
      expect(wrapper.classes()).toContain('maz:border')
    })
  })
})
