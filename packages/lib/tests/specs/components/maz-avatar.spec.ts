import MazAvatar from '@components/MazAvatar.vue'
import MazLazyImg from '@components/MazLazyImg.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('mazAvatar', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(MazAvatar)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('m-avatar')
  })

  it('renders with the correct size class', () => {
    const wrapper = mount(MazAvatar, {
      props: {
        size: '0.8em',
      },
    })
    expect(wrapper.attributes('style')).toContain('font-size: 0.8em;')
  })

  it('renders MazLazyImg component', async () => {
    const imageUrl = 'https://example.com/avatar.jpg'
    const wrapper = mount(MazAvatar, {
      props: {
        src: imageUrl,
      },
    })

    await vi.dynamicImportSettled()

    const img = wrapper.findComponent(MazLazyImg)
    expect(img.exists()).toBe(true)
    expect(img.props('src')).toBe('https://example.com/avatar.jpg')
  })

  it('renders with the correct image source', async () => {
    const imageUrl = 'https://example.com/avatar.jpg'
    const wrapper = mount(MazAvatar, {
      props: {
        src: imageUrl,
        loading: 'lazy',
      },
    })

    await vi.dynamicImportSettled()

    const img2 = wrapper.find('img')
    expect(img2.exists()).toBe(true)
    expect(img2.attributes('src')).toBe(imageUrl)
  })

  it('renders initials when no image source is provided', () => {
    const wrapper = mount(MazAvatar, {
      props: {
        caption: 'Louis Mazel',
        letterCount: 2,
      },
    })
    expect(wrapper.text()).toBe('LM')
  })

  it('applies the correct background color', () => {
    const bgColor = 'rgb(255, 0, 0)'
    const wrapper = mount(MazAvatar, {
      props: {
        style: {
          backgroundColor: bgColor,
        },
      },
    })
    expect(wrapper.attributes('style')).toContain(`background-color: ${bgColor}`)
  })
})
