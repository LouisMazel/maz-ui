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

  describe('given an image that has loaded', () => {
    let animateCallbacks: { onfinish: (() => void) | null }

    beforeEach(() => {
      animateCallbacks = { onfinish: null }
      mockAnimate.mockImplementation(() => {
        const anim = {
          finished: Promise.resolve(),
          onfinish: null as (() => void) | null,
          cancel: vi.fn(),
        }
        animateCallbacks = anim
        return anim
      })
    })

    function createWrapper(extraProps: Record<string, unknown> = {}) {
      return shallowMount(MazFullscreenImg, {
        props: {
          src: 'https://via.placeholder.com/150',
          alt: 'test image',
          openInstanceClass: 'zv-open',
          destroy: vi.fn(),
          ...defaultProperties,
          ...extraProps,
        },
      })
    }

    async function triggerImageLoad(wrapper: ReturnType<typeof createWrapper>) {
      const img = wrapper.find('img')
      await img.trigger('load')
      await wrapper.vm.$nextTick()
      if (animateCallbacks.onfinish) {
        animateCallbacks.onfinish()
      }
      await wrapper.vm.$nextTick()
    }

    describe('when the image load event fires', () => {
      it('hides the loader after loading', async () => {
        const wrapper = createWrapper()
        await wrapper.vm.$nextTick()

        const img = wrapper.find('img')
        await img.trigger('load')
        await wrapper.vm.$nextTick()

        expect(wrapper.find('.m-fullscreen-img-loader').isVisible()).toBe(false)
        wrapper.unmount()
      })

      it('calls openFullscreen and runs animation', async () => {
        const wrapper = createWrapper()
        await wrapper.vm.$nextTick()

        await triggerImageLoad(wrapper)

        expect(mockAnimate).toHaveBeenCalled()
        wrapper.unmount()
      })
    })

    describe('when the close button is clicked after image loaded', () => {
      it('emits before-close and close events', async () => {
        const destroy = vi.fn()
        const wrapper = createWrapper({ destroy })
        await wrapper.vm.$nextTick()
        await triggerImageLoad(wrapper)

        const closeBtn = wrapper.find('.m-fullscreen-btn.--close')
        await closeBtn.trigger('click')
        await wrapper.vm.$nextTick()

        if (animateCallbacks.onfinish) {
          animateCallbacks.onfinish()
        }
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('before-close')).toBeTruthy()
        expect(wrapper.emitted('close')).toBeTruthy()
        expect(destroy).toHaveBeenCalled()
        wrapper.unmount()
      })
    })

    describe('when the Escape key is pressed', () => {
      it('emits before-close event', async () => {
        const wrapper = createWrapper()
        await wrapper.vm.$nextTick()
        await triggerImageLoad(wrapper)

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('before-close')).toBeTruthy()
        wrapper.unmount()
      })
    })

    describe('when the ArrowRight key is pressed', () => {
      it('emits next event when multiple instances exist', async () => {
        const el1 = document.createElement('img')
        el1.classList.add('m-fullscreen-img-instance', 'zv-open')
        el1.setAttribute('data-src', 'https://example.com/1.jpg')
        el1.setAttribute('data-alt', 'image 1')

        const el2 = document.createElement('img')
        el2.classList.add('m-fullscreen-img-instance')
        el2.setAttribute('data-src', 'https://example.com/2.jpg')
        el2.setAttribute('data-alt', 'image 2')

        document.body.appendChild(el1)
        document.body.appendChild(el2)

        const wrapper = createWrapper()
        await wrapper.vm.$nextTick()
        await triggerImageLoad(wrapper)

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('next')).toBeTruthy()

        document.body.removeChild(el1)
        document.body.removeChild(el2)
        wrapper.unmount()
      })
    })

    describe('when the ArrowLeft key is pressed', () => {
      it('emits previous event when multiple instances exist', async () => {
        const el1 = document.createElement('img')
        el1.classList.add('m-fullscreen-img-instance', 'zv-open')
        el1.setAttribute('data-src', 'https://example.com/1.jpg')
        el1.setAttribute('data-alt', 'image 1')

        const el2 = document.createElement('img')
        el2.classList.add('m-fullscreen-img-instance')
        el2.setAttribute('data-src', 'https://example.com/2.jpg')
        el2.setAttribute('data-alt', 'image 2')

        document.body.appendChild(el1)
        document.body.appendChild(el2)

        const wrapper = createWrapper()
        await wrapper.vm.$nextTick()
        await triggerImageLoad(wrapper)

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('previous')).toBeTruthy()

        document.body.removeChild(el1)
        document.body.removeChild(el2)
        wrapper.unmount()
      })
    })

    describe('when the image is clicked with zoom enabled', () => {
      it('toggles zoom state', async () => {
        const wrapper = createWrapper({ zoom: true })
        await wrapper.vm.$nextTick()
        await triggerImageLoad(wrapper)

        const img = wrapper.find('img')
        await img.trigger('click')
        await wrapper.vm.$nextTick()

        expect(img.classes()).toContain('--is-zoomed')

        await img.trigger('click')
        await wrapper.vm.$nextTick()

        expect(img.classes()).not.toContain('--is-zoomed')
        wrapper.unmount()
      })
    })

    describe('when zoom is disabled', () => {
      it('does not toggle zoom on image click', async () => {
        const wrapper = createWrapper({ zoom: false })
        await wrapper.vm.$nextTick()
        await triggerImageLoad(wrapper)

        const img = wrapper.find('img')
        await img.trigger('click')
        await wrapper.vm.$nextTick()

        expect(img.classes()).not.toContain('--is-zoomed')
        wrapper.unmount()
      })
    })

    describe('when the window is resized', () => {
      it('recalculates styles when not zoomed', async () => {
        const wrapper = createWrapper()
        await wrapper.vm.$nextTick()
        await triggerImageLoad(wrapper)

        globalThis.dispatchEvent(new Event('resize'))
        await wrapper.vm.$nextTick()

        expect(wrapper.find('.m-fullscreen-img').exists()).toBe(true)
        wrapper.unmount()
      })
    })

    describe('when the overlay background is clicked', () => {
      it('emits before-close event', async () => {
        const wrapper = createWrapper()
        await wrapper.vm.$nextTick()
        await triggerImageLoad(wrapper)

        await wrapper.find('.m-fullscreen-img').trigger('click')
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('before-close')).toBeTruthy()
        wrapper.unmount()
      })
    })

    describe('when animation returns undefined', () => {
      it('handles missing animation gracefully on open', async () => {
        mockAnimate.mockReturnValueOnce(undefined)
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const wrapper = createWrapper()
        await wrapper.vm.$nextTick()

        const img = wrapper.find('img')
        await img.trigger('load')
        await wrapper.vm.$nextTick()

        expect(consoleErrorSpy).toHaveBeenCalled()
        consoleErrorSpy.mockRestore()
        wrapper.unmount()
      })

      it('handles missing animation gracefully on close', async () => {
        const destroy = vi.fn()
        const wrapper = createWrapper({ destroy })
        await wrapper.vm.$nextTick()
        await triggerImageLoad(wrapper)

        mockAnimate.mockReturnValueOnce(undefined)
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        const closeBtn = wrapper.find('.m-fullscreen-btn.--close')
        await closeBtn.trigger('click')
        await wrapper.vm.$nextTick()

        expect(consoleErrorSpy).toHaveBeenCalled()
        expect(destroy).toHaveBeenCalled()
        consoleErrorSpy.mockRestore()
        wrapper.unmount()
      })
    })

    describe('when navigating wraps around the instance list', () => {
      it('wraps from last to first instance', async () => {
        const el1 = document.createElement('img')
        el1.classList.add('m-fullscreen-img-instance')
        el1.setAttribute('data-src', 'https://example.com/1.jpg')

        const el2 = document.createElement('img')
        el2.classList.add('m-fullscreen-img-instance', 'zv-open')
        el2.setAttribute('data-src', 'https://example.com/2.jpg')

        document.body.appendChild(el1)
        document.body.appendChild(el2)

        const wrapper = createWrapper()
        await wrapper.vm.$nextTick()
        await triggerImageLoad(wrapper)

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('next')).toBeTruthy()

        document.body.removeChild(el1)
        document.body.removeChild(el2)
        wrapper.unmount()
      })

      it('wraps from first to last instance', async () => {
        const el1 = document.createElement('img')
        el1.classList.add('m-fullscreen-img-instance', 'zv-open')
        el1.setAttribute('data-src', 'https://example.com/1.jpg')

        const el2 = document.createElement('img')
        el2.classList.add('m-fullscreen-img-instance')
        el2.setAttribute('data-src', 'https://example.com/2.jpg')

        document.body.appendChild(el1)
        document.body.appendChild(el2)

        const wrapper = createWrapper()
        await wrapper.vm.$nextTick()
        await triggerImageLoad(wrapper)

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('previous')).toBeTruthy()

        document.body.removeChild(el1)
        document.body.removeChild(el2)
        wrapper.unmount()
      })
    })

    describe('when navigating with no current open instance', () => {
      it('does not emit navigation events', async () => {
        const wrapper = createWrapper({ openInstanceClass: 'nonexistent-class' })
        await wrapper.vm.$nextTick()
        await triggerImageLoad(wrapper)

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('next')).toBeFalsy()
        wrapper.unmount()
      })
    })
  })
})
