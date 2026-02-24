import MazFullscreenImg from '@directives/vFullscreenImg/MazFullscreenImg.vue'
import { shallowMount } from '@vue/test-utils'

// Mock Element.animate for jsdom (Web Animations API not available)
const mockAnimate = vi.fn(() => ({
  finished: Promise.resolve(),
  onfinish: null,
  cancel: vi.fn(),
}))
// @ts-expect-error - jsdom doesn't have animate
Element.prototype.animate = mockAnimate

const image = document.createElement('img')

const defaultProperties = {
  clickedElement: image,
  scaleAnimation: false,
}

describe('mazFullscreenImg', () => {
  afterEach(() => {
    document.documentElement.classList.remove('--m-fullscreen-open')
  })

  it('should render correctly when opened', async () => {
    const wrapper = shallowMount(MazFullscreenImg, {
      props: {
        src: 'https://via.placeholder.com/150',
        alt: 'placeholder image',
        openInstanceClass: 'zv-open',
        destroy: () => {},
        ...defaultProperties,
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.m-fullscreen-img-loader').isVisible()).toBe(true)
    expect(wrapper.find('.m-fullscreen-btn').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should render correctly with an alternative text', async () => {
    const alt = 'alternative text'

    const wrapper = shallowMount(MazFullscreenImg, {
      props: {
        src: 'https://via.placeholder.com/150',
        alt,
        openInstanceClass: 'zv-open',
        destroy: () => {},
        ...defaultProperties,
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('img').attributes('alt')).toBe(alt)
    wrapper.unmount()
  })

  it('should render without alt attribute when null', async () => {
    const wrapper = shallowMount(MazFullscreenImg, {
      props: {
        src: 'https://via.placeholder.com/150',
        alt: null,
        openInstanceClass: 'zv-open',
        destroy: () => {},
        ...defaultProperties,
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('img').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should render with zoom disabled', async () => {
    const wrapper = shallowMount(MazFullscreenImg, {
      props: {
        src: 'https://via.placeholder.com/150',
        openInstanceClass: 'zv-open',
        destroy: () => {},
        zoom: false,
        ...defaultProperties,
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('img').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should render with custom animation', async () => {
    const wrapper = shallowMount(MazFullscreenImg, {
      props: {
        src: 'https://via.placeholder.com/150',
        openInstanceClass: 'zv-open',
        destroy: () => {},
        animation: { duration: 500, easing: 'linear' },
        ...defaultProperties,
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.m-fullscreen-img').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should render with offset', async () => {
    const wrapper = shallowMount(MazFullscreenImg, {
      props: {
        src: 'https://via.placeholder.com/150',
        openInstanceClass: 'zv-open',
        destroy: () => {},
        offset: 100,
        ...defaultProperties,
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.m-fullscreen-img').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should handle close button click', async () => {
    const destroy = vi.fn()
    const wrapper = shallowMount(MazFullscreenImg, {
      props: {
        src: 'https://via.placeholder.com/150',
        openInstanceClass: 'zv-open',
        destroy,
        ...defaultProperties,
      },
    })

    await wrapper.vm.$nextTick()

    const closeBtn = wrapper.find('.m-fullscreen-btn.--close')
    expect(closeBtn.exists()).toBe(true)
    await closeBtn.trigger('click')

    expect(wrapper.emitted('before-close')).toBeTruthy()
    wrapper.unmount()
  })

  it('should handle Escape keydown', async () => {
    const wrapper = shallowMount(MazFullscreenImg, {
      props: {
        src: 'https://via.placeholder.com/150',
        openInstanceClass: 'zv-open',
        destroy: () => {},
        ...defaultProperties,
      },
    })

    await wrapper.vm.$nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(wrapper.emitted('before-close')).toBeTruthy()
    wrapper.unmount()
  })

  it('should add class to html on mount and remove on unmount', async () => {
    const wrapper = shallowMount(MazFullscreenImg, {
      props: {
        src: 'https://via.placeholder.com/150',
        openInstanceClass: 'zv-open',
        destroy: () => {},
        ...defaultProperties,
      },
    })

    await wrapper.vm.$nextTick()
    expect(document.documentElement.classList.contains('--m-fullscreen-open')).toBe(true)

    wrapper.unmount()
    expect(document.documentElement.classList.contains('--m-fullscreen-open')).toBe(false)
  })
})
