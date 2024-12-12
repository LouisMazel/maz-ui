import type { VueWrapper } from '@vue/test-utils'
import MazFullscreenImg from '@directives/vFullscreenImg/MazFullscreenImg.vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

describe('given MazFullscreenImg component', () => {
  let wrapper: VueWrapper<any>
  const mockClickedElement = document.createElement('img')
  mockClickedElement.setAttribute('src', 'test-image.jpg')

  beforeEach(async () => {
    // Mock getBoundingClientRect
    // @ts-expect-error - mock
    mockClickedElement.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      right: 100,
      bottom: 100,
    }))

    // Mock window methods
    globalThis.innerWidth = 1024
    globalThis.innerHeight = 768

    Element.prototype.animate = vi.fn().mockReturnValue({
      onfinish: null,
      finished: Promise.resolve(),
    })

    await vi.dynamicImportSettled()
  })

  afterEach(() => {
    wrapper.unmount()
    vi.restoreAllMocks()
  })

  describe('when mounting the component', () => {
    it('then it should render correctly', () => {
      wrapper = mount(MazFullscreenImg, {
        props: {
          src: 'test-image.jpg',
          clickedElement: mockClickedElement,
        },
      })

      expect(wrapper.find('.m-fullscreen-img').exists()).toBe(true)
      expect(wrapper.find('img').attributes('src')).toBe('test-image.jpg')
    })

    it('then it should add class to document', () => {
      mount(MazFullscreenImg, {
        props: {
          src: 'test-image.jpg',
          clickedElement: mockClickedElement,
        },
      })

      expect(document.documentElement.classList.contains('--m-fullscreen-open')).toBe(true)
    })
  })

  describe('when image is loaded', () => {
    it('then it should hide loader and show navigation buttons', async () => {
      wrapper = mount(MazFullscreenImg, {
        props: {
          src: 'test-image.jpg',
          clickedElement: mockClickedElement,
        },
      })

      await wrapper.find('img').trigger('load')
      await nextTick()

      expect(wrapper.find('.m-fullscreen-btn.--next').exists()).toBe(false)
      expect(wrapper.find('.m-fullscreen-btn.--previous').exists()).toBe(false)
    })
  })

  describe('when clicking close button', () => {
    it('then it should emit close event', async () => {
      wrapper = mount(MazFullscreenImg, {
        props: {
          src: 'test-image.jpg',
          clickedElement: mockClickedElement,
        },
      })

      await wrapper.find('.m-fullscreen-btn.--close').trigger('click')
      await nextTick()

      expect(wrapper.emitted('before-close')).toBeTruthy()
    })
  })

  describe('when pressing Escape key', () => {
    it('then it should emit close event', () => {
      wrapper = mount(MazFullscreenImg, {
        props: {
          src: 'test-image.jpg',
          clickedElement: mockClickedElement,
        },
      })

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

      expect(wrapper.emitted('before-close')).toBeTruthy()
    })
  })

  describe('when toggling zoom', () => {
    it('then it should toggle zoom classes', async () => {
      wrapper = mount(MazFullscreenImg, {
        props: {
          src: 'test-image.jpg',
          clickedElement: mockClickedElement,
          zoom: true,
        },
      })

      await wrapper.find('img').trigger('load')
      await nextTick()

      await wrapper.find('img').trigger('click')
      await nextTick()

      expect(wrapper.find('img').classes()).toContain('--is-zoomed')
    })
  })

  describe('when navigating between images', () => {
    beforeEach(() => {
      // Mock multiple instances
      document.body.innerHTML = `
        <div class="m-fullscreen-img-instance" data-src="image1.jpg"></div>
        <div class="m-fullscreen-img-instance m-fullscreen-img-instance" data-src="image2.jpg"></div>
        <div class="m-fullscreen-img-instance" data-src="image3.jpg"></div>
      `
    })

    it('then it should emit next event when clicking next button', async () => {
      wrapper = mount(MazFullscreenImg, {
        props: {
          src: 'image2.jpg',
          clickedElement: mockClickedElement,
        },
      })

      await wrapper.find('img').trigger('load')
      await nextTick()

      await wrapper.find('.m-fullscreen-btn.--next').trigger('click')

      expect(wrapper.emitted('next')).toBeTruthy()
    })

    it('then it should emit previous event when clicking previous button', async () => {
      wrapper = mount(MazFullscreenImg, {
        props: {
          src: 'image2.jpg',
          clickedElement: mockClickedElement,
        },
      })

      await wrapper.find('img').trigger('load')
      await nextTick()

      await wrapper.find('.m-fullscreen-btn.--previous').trigger('click')

      expect(wrapper.emitted('previous')).toBeTruthy()
    })
  })

  describe('when resizing window', () => {
    it('then it should update styles', async () => {
      wrapper = mount(MazFullscreenImg, {
        props: {
          src: 'test-image.jpg',
          clickedElement: mockClickedElement,
        },
      })

      await wrapper.find('img').trigger('load')
      await nextTick()

      globalThis.innerWidth = 800
      globalThis.innerHeight = 600

      // Trigger window resize event
      window.dispatchEvent(new Event('resize'))
      await nextTick()

      const imgElement = wrapper.find('img').element as HTMLImageElement
      expect(imgElement.style.height).not.toBe('')
    })
  })
})
