import { shallowMount } from '@vue/test-utils'
import MazIcon from '@components/MazIcon.vue'

describe('MazIcon', () => {
  it('renders correctly with custom name prop', async () => {
    const wrapper = shallowMount(MazIcon, {
      propsData: {
        name: 'test-icon',
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.element).toMatchSnapshot()
    expect(wrapper.vm.fullSrc).toBe('/test-icon.svg')
  })

  it('renders the icon with the specified name and size', () => {
    const wrapper = shallowMount(MazIcon, {
      propsData: {
        name: 'icon-name',
        size: '24px',
      },
    })
    expect(wrapper.find('svg').attributes().width).toBe('24px')
    expect(wrapper.find('svg').attributes().height).toBe('24px')
    expect(wrapper.find('svg').html()).toContain('icon-name')
  })

  it('renders the icon with the specified title', () => {
    const wrapper = shallowMount(MazIcon, {
      propsData: {
        name: 'icon-name',
        title: 'My icon',
      },
    })
    expect(wrapper.find('svg title').text()).toBe('My icon')
  })

  it('throws an error if no name or src prop is provided', () => {
    expect(() => {
      shallowMount(MazIcon)
    }).toThrowError(
      '[maz-ui](MazIcon) you should provide "name" or "src" as prop',
    )
  })

  it('renders the icon using the specified source URL', () => {
    const wrapper = shallowMount(MazIcon, {
      propsData: {
        src: 'http://example.com/icon.svg',
      },
    })
    expect(wrapper.find('svg').attributes().width).toBe('1em')
    expect(wrapper.find('svg').attributes().height).toBe('1em')
    expect(wrapper.find('svg').html()).toContain('http://example.com/icon.svg')
  })
})
