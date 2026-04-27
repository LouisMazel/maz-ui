import MazBtn from '@components/MazBtn.vue'
import MazIcon from '@components/MazIcon.vue'
import MazSpinner from '@components/MazSpinner.vue'
import { mount, shallowMount } from '@vue/test-utils'

describe('mazBtn.vue', () => {
  it('renders correctly with default props', () => {
    const wrapper = shallowMount(MazBtn)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('m-btn')
  })

  it('renders with the correct size class', () => {
    const wrapper = shallowMount(MazBtn, {
      props: { size: 'lg' },
    })
    expect(wrapper.classes()).toContain('--lg')
  })

  it('renders with the correct color class', () => {
    const wrapper = shallowMount(MazBtn, {
      props: { color: 'success' },
    })
    expect(wrapper.classes()).toContain('--success')
  })

  it('renders with the correct type attribute', () => {
    const wrapper = shallowMount(MazBtn, {
      props: { type: 'submit' },
    })
    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('renders with an icon when icon prop is provided', async () => {
    const wrapper = shallowMount(MazBtn, {
      props: { icon: 'check' },
    })

    await vi.dynamicImportSettled()

    expect(wrapper.findComponent(MazIcon).exists()).toBe(true)
  })

  it('renders with a start icon when startIcon prop is provided', async () => {
    const wrapper = shallowMount(MazBtn, {
      props: { startIcon: 'arrow-left' },
    })

    await vi.dynamicImportSettled()

    expect(wrapper.findComponent(MazIcon).exists()).toBe(true)
  })

  it('renders with an end icon when endIcon prop is provided', async () => {
    const wrapper = shallowMount(MazBtn, {
      props: { endIcon: 'arrow-right' },
    })

    await vi.dynamicImportSettled()

    expect(wrapper.findComponent(MazIcon).exists()).toBe(true)
  })

  it('forwards a full MazIconProps object on startIcon', async () => {
    const wrapper = mount(MazBtn, {
      props: {
        startIcon: { icon: '/star.svg', size: 'xl', title: 'Star' },
      },
    })
    await vi.dynamicImportSettled()

    const icon = wrapper.findComponent(MazIcon)
    expect(icon.exists()).toBe(true)
    expect(icon.props('icon')).toBe('/star.svg')
    expect(icon.props('title')).toBe('Star')
    expect(icon.props('size')).toBe('xl')
  })

  it('lets the MazIconProps form override the button-derived size default', async () => {
    const wrapper = mount(MazBtn, {
      props: {
        size: 'sm',
        endIcon: { icon: '/x.svg', size: 'lg' },
      },
    })
    await vi.dynamicImportSettled()

    const icon = wrapper.findComponent(MazIcon)
    expect(icon.props('size')).toBe('lg')
  })

  it('renders with a loader when loading prop is true', () => {
    const wrapper = shallowMount(MazBtn, {
      props: { loading: true },
    })
    expect(wrapper.find('.m-btn-loader-container').exists()).toBe(true)
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = shallowMount(MazBtn, {
      props: { disabled: true },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('applies the loading class when loading prop is true', () => {
    const wrapper = shallowMount(MazBtn, {
      props: { loading: true },
    })
    expect(wrapper.classes()).toContain('--loading')
  })

  it('renders default slot content', () => {
    const wrapper = shallowMount(MazBtn, {
      slots: {
        default: '<span>Click me</span>',
      },
    })
    expect(wrapper.html()).toContain('<span>Click me</span>')
  })

  it('renders start icon slot content', async () => {
    const wrapper = shallowMount(MazBtn, {
      slots: {
        'start-icon': '<svg name="arrow-left" />',
      },
    })

    await vi.dynamicImportSettled()

    expect(wrapper.html()).toContain('<svg name="arrow-left"></svg>')
  })

  it('renders end icon slot content', () => {
    const wrapper = shallowMount(MazBtn, {
      slots: {
        'end-icon': '<svg name="arrow-right" />',
      },
    })

    expect(wrapper.html()).toContain('<svg name="arrow-right"></svg>')
  })

  it('renders icon slot content', () => {
    const wrapper = shallowMount(MazBtn, {
      slots: {
        icon: '<svg name="check" />',
      },
    })

    expect(wrapper.html()).toContain('<svg name="check"></svg>')
  })

  it('renders MazSpinner when loading', async () => {
    const wrapper = shallowMount(MazBtn, {
      props: { loading: true },
    })

    await vi.dynamicImportSettled()

    expect(wrapper.findComponent(MazSpinner).exists()).toBe(true)
  })

  it('renders loader slot content when loading', async () => {
    const wrapper = shallowMount(MazBtn, {
      props: { loading: true },
      slots: {
        loader: '<svg name="check" />',
      },
    })

    await vi.dynamicImportSettled()

    expect(wrapper.html()).toContain('<svg name="check"></svg>')
  })
})
