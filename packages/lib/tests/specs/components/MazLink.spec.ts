import type { VueWrapper } from '@vue/test-utils'
import MazLink from '@components/MazLink.vue'
import { mount, shallowMount } from '@vue/test-utils'

describe('MazLink component', () => {
  let wrapper: VueWrapper<InstanceType<typeof MazLink>>

  beforeEach(() => {
    wrapper = shallowMount(MazLink, {
      props: {
        id: 'link',
        ariaLabel: 'Link',
        target: '_blank',
        autoExternal: true,
        endIcon: 'check',
        startIcon: 'home',
        color: 'secondary',
        title: 'Title of the link',
        underline: true,
      },
      slots: {
        default: 'Link',
      },
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })
  })

  it('it renders the component correctly', async () => {
    await wrapper.setProps({ href: 'https://www.google.com' })

    expect(wrapper.classes('m-link')).toBe(true)
    expect(wrapper.classes('--secondary')).toBe(true)
    expect(wrapper.classes('--underline')).toBe(true)

    expect(wrapper.attributes('title')).toBe('Title of the link')
    expect(wrapper.attributes('aria-label')).toBe('Link')
    expect(wrapper.attributes('href')).toBe('https://www.google.com')
    expect(wrapper.attributes('id')).toBe('link')
    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.text()).toBe('Link')
    expect(wrapper.find('async-component-wrapper-stub').exists()).toBe(true)
    expect(wrapper.find('maz-icon-stub').exists()).toBe(true)
    const icons = wrapper.findAll('maz-icon-stub')
    expect(icons.at(0)?.attributes('icon')).toBe('home')
    expect(icons.at(1)?.attributes('icon')).toBe('check')
  })

  it('is router-link if to prop is set', async () => {
    await wrapper.setProps({ to: 'https://www.google.com' })

    expect(wrapper.attributes('to')).toBe('https://www.google.com')
    expect(wrapper.find('router-link-stub').exists()).toBe(true)
  })

  it('does not apply a color class when color is inherit', () => {
    const inheritWrapper = shallowMount(MazLink, {
      props: { color: 'inherit' },
      slots: { default: 'Link' },
      global: { stubs: { RouterLink: true } },
    })

    expect(inheritWrapper.classes('--inherit')).toBe(true)
    expect(inheritWrapper.classes()).not.toContain('maz:not-disabled:text-primary')
  })

  it('applies underline-hover modifier when underline is false', () => {
    const hoverWrapper = shallowMount(MazLink, {
      props: { underline: false, underlineHover: true },
      slots: { default: 'Link' },
      global: { stubs: { RouterLink: true } },
    })

    expect(hoverWrapper.classes('--underline-hover')).toBe(true)
    expect(hoverWrapper.classes('--underline')).toBe(false)
  })

  it('accepts a full MazIconProps object on startIcon', async () => {
    const wrapper = mount(MazLink, {
      props: {
        startIcon: { icon: '/star.svg', size: 'lg', title: 'Star' },
      },
      slots: { default: 'Link' },
      global: { stubs: { RouterLink: true } },
    })

    await vi.dynamicImportSettled()

    const icon = wrapper.findComponent({ name: 'MazIcon' })
    expect(icon.exists()).toBe(true)
    expect(icon.props('icon')).toBe('/star.svg')
    expect(icon.props('size')).toBe('lg')
    expect(icon.props('title')).toBe('Star')
  })
})
