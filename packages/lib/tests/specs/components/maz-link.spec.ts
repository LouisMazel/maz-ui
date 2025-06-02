import type { VueWrapper } from '@vue/test-utils'
import MazLink from '@components/MazLink.vue'
import { shallowMount } from '@vue/test-utils'

describe('mazLink', () => {
  let wrapper: VueWrapper<InstanceType<typeof MazLink>>

  beforeEach(() => {
    wrapper = shallowMount(MazLink, {
      props: {
        id: 'link',
        ariaLabel: 'Link',
        target: '_blank',
        autoExternal: true,
        rightIcon: 'check',
        leftIcon: 'home',
        color: 'secondary',
        title: 'Title of the link',
        underline: true,
      },
      slots: {
        default: 'Link',
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
    expect(wrapper.find('external-icon-stub').exists()).toBe(true)
    expect(wrapper.find('maz-icon-stub').exists()).toBe(true)
    const icons = wrapper.findAll('maz-icon-stub')
    expect(icons.at(0)?.attributes('name')).toBe('home')
    expect(icons.at(1)?.attributes('name')).toBe('check')
  })

  it('is router-link if to prop is set', async () => {
    await wrapper.setProps({ to: 'https://www.google.com' })

    expect(wrapper.attributes('to')).toBe('https://www.google.com')
    expect(wrapper.find('router-link').exists()).toBe(true)
  })
})
