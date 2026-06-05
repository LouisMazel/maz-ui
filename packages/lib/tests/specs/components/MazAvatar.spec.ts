import MazAvatar from '@components/MazAvatar.vue'
import MazLazyImg from '@components/MazLazyImg.vue'
import { GLOBAL_CONFIG_INJECTION_KEY } from '@composables/useGlobalConfig'
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

function mountAvatarWithGlobalConfig(config: unknown, props: Record<string, unknown> = {}) {
  return mount(MazAvatar, {
    props,
    global: { provide: { [GLOBAL_CONFIG_INJECTION_KEY as symbol]: config } },
  })
}

describe('given a MazUi global default for roundedSize', () => {
  describe('when no roundedSize prop is passed', () => {
    it('then it applies the global default rounded class on the wrapper', () => {
      const wrapper = mountAvatarWithGlobalConfig({ global: { roundedSize: 'full' } })

      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('maz:rounded-full')
    })
  })

  describe('when a roundedSize prop is passed', () => {
    it('then the instance prop wins over the global default', () => {
      const wrapper = mountAvatarWithGlobalConfig({ global: { roundedSize: 'full' } }, { roundedSize: 'sm' })

      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('maz:rounded-xs')
      expect(wrapper.find('.m-avatar__wrapper').classes()).not.toContain('maz:rounded-full')
    })
  })

  describe('when a component-scoped default differs from the global default', () => {
    it('then the component-scoped default wins over the global default', () => {
      const wrapper = mountAvatarWithGlobalConfig({ global: { roundedSize: 'full' }, MazAvatar: { roundedSize: 'sm' } })

      expect(wrapper.find('.m-avatar__wrapper').classes()).toContain('maz:rounded-xs')
      expect(wrapper.find('.m-avatar__wrapper').classes()).not.toContain('maz:rounded-full')
    })
  })
})
