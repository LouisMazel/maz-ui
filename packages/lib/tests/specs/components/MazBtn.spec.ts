import MazBtn from '@components/MazBtn.vue'
import MazIcon from '@components/MazIcon.vue'
import MazSpinner from '@components/MazSpinner.vue'
import { shallowMount } from '@vue/test-utils'

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

  it('renders with a left icon when leftIcon prop is provided', async () => {
    const wrapper = shallowMount(MazBtn, {
      props: { leftIcon: 'arrow-left' },
    })

    await vi.dynamicImportSettled()

    expect(wrapper.findComponent(MazIcon).exists()).toBe(true)
  })

  it('renders with a right icon when rightIcon prop is provided', async () => {
    const wrapper = shallowMount(MazBtn, {
      props: { rightIcon: 'arrow-right' },
    })

    await vi.dynamicImportSettled()

    expect(wrapper.findComponent(MazIcon).exists()).toBe(true)
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

  it('applies the correct cursor class when disabled', () => {
    const wrapper = shallowMount(MazBtn, {
      props: { disabled: true },
    })
    expect(wrapper.classes()).toContain('--cursor-default')
  })

  it('applies the correct cursor class when not disabled', () => {
    const wrapper = shallowMount(MazBtn, {
      props: { disabled: false },
    })
    expect(wrapper.classes()).toContain('--cursor-pointer')
  })

  it('renders default slot content', () => {
    const wrapper = shallowMount(MazBtn, {
      slots: {
        default: '<span>Click me</span>',
      },
    })
    expect(wrapper.html()).toContain('<span>Click me</span>')
  })

  it('renders left icon slot content', async () => {
    const wrapper = shallowMount(MazBtn, {
      slots: {
        'left-icon': '<svg name="arrow-left" />',
      },
    })

    await vi.dynamicImportSettled()

    expect(wrapper.html()).toContain('<svg name="arrow-left"></svg>')
  })

  it('renders right icon slot content', () => {
    const wrapper = shallowMount(MazBtn, {
      slots: {
        'right-icon': '<svg name="arrow-right" />',
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
