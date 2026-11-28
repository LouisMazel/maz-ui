import type { Mock } from 'vitest'
import MazCardSpotlight from '@components/MazCardSpotlight.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { MAZ_UI_CONTEXT_INJECTION_KEY } from '@/utils/mazUiContext.ts'

describe('given mazCardSpotlight component', () => {
  let intersectionObserverCallback: IntersectionObserverCallback
  let intersectionObserverInstance: { observe: Mock, disconnect: Mock, unobserve: Mock }

  beforeEach(() => {
    intersectionObserverInstance = {
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    }

    // eslint-disable-next-line prefer-arrow-callback
    globalThis.IntersectionObserver = vi.fn(function (callback: IntersectionObserverCallback) {
      intersectionObserverCallback = callback
      return intersectionObserverInstance
    }) as any

    globalThis.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      callback(0)
      return 0
    })

    globalThis.cancelAnimationFrame = vi.fn()

    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
      right: 300,
      bottom: 300,
      x: 100,
      y: 100,
      toJSON: () => {},
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when component renders', () => {
    it('renders with default props', async () => {
      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.classes()).toContain('m-card-spotlight')
      expect(wrapper.classes()).toContain('m-reset-css')
    })

    it('applies elevation classes when elevation prop is true', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          elevation: true,
        },
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('maz:shadow-elevation')
      expect(wrapper.classes()).toContain('maz:drop-shadow-md')
    })

    it('does not apply elevation classes when elevation prop is false', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          elevation: false,
        },
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).not.toContain('maz:shadow-elevation')
      expect(wrapper.classes()).not.toContain('maz:drop-shadow-md')
    })

    it('applies padding class to content when padding prop is true', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          padding: true,
        },
      })

      await wrapper.vm.$nextTick()

      const content = wrapper.find('.content')
      expect(content.classes()).toContain('maz:p-4')
    })

    it('does not apply padding class when padding prop is false', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          padding: false,
        },
      })

      await wrapper.vm.$nextTick()

      const content = wrapper.find('.content')
      expect(content.classes()).not.toContain('maz:p-4')
    })

    it('applies custom contentClass', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          contentClass: 'custom-class',
        },
      })

      await wrapper.vm.$nextTick()

      const content = wrapper.find('.content')
      expect(content.classes()).toContain('custom-class')
    })

    it('applies custom contentStyle', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          contentStyle: { backgroundColor: 'red' },
        },
      })

      await wrapper.vm.$nextTick()

      const content = wrapper.find('.content')
      expect(content.attributes('style')).toContain('background-color: red')
    })

    it('applies custom color', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          color: 'secondary',
        },
      })

      await wrapper.vm.$nextTick()

      const container = wrapper.find('.m-card-spotlight')
      expect(container.attributes('style')).toContain('--maz-secondary')
    })

    it('applies custom innerOpacity', async () => {
      const wrapper = mount(MazCardSpotlight, {
        props: {
          innerOpacity: 0.5,
        },
      })

      await wrapper.vm.$nextTick()

      const container = wrapper.find('.m-card-spotlight')
      expect(container.attributes('style')).toContain('--inner-opacity: 0.5')
    })

    it('renders slot content', async () => {
      const wrapper = mount(MazCardSpotlight, {
        slots: {
          default: '<div class="test-slot">Test Content</div>',
        },
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.find('.test-slot').exists()).toBe(true)
      expect(wrapper.find('.test-slot').text()).toBe('Test Content')
    })
  })

  describe('when component is mounted', () => {
    it('sets up IntersectionObserver', async () => {
      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      expect(globalThis.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { root: undefined, rootMargin: '0px', threshold: 0 },
      )
      expect(intersectionObserverInstance.observe).toHaveBeenCalled()
    })

    it.each(['mousemove', 'scroll', 'resize'])('adds no %s listener on the window', async (eventName) => {
      const addEventListenerSpy = vi.spyOn(globalThis, 'addEventListener')

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()

      expect(addEventListenerSpy).not.toHaveBeenCalledWith(eventName, expect.any(Function), expect.anything())
    })
  })

  describe('when blob animation is triggered', () => {
    const intersect = (isIntersecting: boolean) => intersectionObserverCallback(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )

    it('shows the blob when the pointer moves on the card and the card is intersecting', async () => {
      const wrapper = mount(MazCardSpotlight)

      await flushPromises()
      intersect(true)
      await wrapper.trigger('pointermove', { clientX: 150, clientY: 150 })
      await flushPromises()

      const blob = wrapper.find('.blob')

      expect(blob.attributes('style')).not.toContain('display: none')
      expect(blob.classes()).toContain('--active')
    })

    it('uses requestAnimationFrame for blob position updates', async () => {
      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()
      intersect(true)
      await wrapper.trigger('pointermove', { clientX: 150, clientY: 150 })

      expect(globalThis.requestAnimationFrame).toHaveBeenCalled()
    })

    it('updates blob transform using direct DOM manipulation', async () => {
      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()
      intersect(true)
      await wrapper.trigger('pointermove', { clientX: 150, clientY: 150 })

      expect((wrapper.find('.blob').element as HTMLElement).style.transform).toBe('translate(-54px, -54px)')
    })

    it('follows a touch that presses the card', async () => {
      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()
      intersect(true)
      await wrapper.trigger('pointerdown', { clientX: 150, clientY: 150, pointerType: 'touch' })

      expect((wrapper.find('.blob').element as HTMLElement).style.transform).toBe('translate(-54px, -54px)')
    })

    it('does not show the blob when the card is not intersecting', async () => {
      const wrapper = mount(MazCardSpotlight, { attachTo: document.body })

      await wrapper.vm.$nextTick()
      intersect(false)
      await wrapper.trigger('pointermove', { clientX: 150, clientY: 150 })

      expect(wrapper.find('.blob').isVisible()).toBe(false)

      wrapper.unmount()
    })

    it('hides the blob when the card leaves the viewport', async () => {
      const wrapper = mount(MazCardSpotlight)

      await flushPromises()
      intersect(true)
      await wrapper.trigger('pointermove', { clientX: 150, clientY: 150 })
      await flushPromises()

      const blob = wrapper.find('.blob')

      expect(blob.attributes('style')).not.toContain('display: none')

      intersect(false)
      await flushPromises()

      expect(blob.attributes('style')).toContain('display: none')
    })

    it('fades the blob when the pointer leaves the card, then hides it', async () => {
      const wrapper = mount(MazCardSpotlight)

      await flushPromises()
      intersect(true)
      await wrapper.trigger('pointermove', { clientX: 150, clientY: 150 })
      await wrapper.trigger('pointerleave')

      const blob = wrapper.find('.blob')

      expect(blob.classes()).not.toContain('--active')
      expect(blob.attributes('style')).not.toContain('display: none')

      await blob.trigger('transitionend')

      expect(blob.attributes('style')).toContain('display: none')
    })

    it('keeps the blob while a mouse button is released on the card', async () => {
      const wrapper = mount(MazCardSpotlight)

      await flushPromises()
      intersect(true)
      await wrapper.trigger('pointermove', { clientX: 150, clientY: 150 })
      await wrapper.trigger('pointerup', { pointerType: 'mouse' })

      expect(wrapper.find('.blob').classes()).toContain('--active')
    })

    it('fades the blob when a touch is released', async () => {
      const wrapper = mount(MazCardSpotlight)

      await flushPromises()
      intersect(true)
      await wrapper.trigger('pointerdown', { clientX: 150, clientY: 150, pointerType: 'touch' })
      await wrapper.trigger('pointerup', { pointerType: 'touch' })

      expect(wrapper.find('.blob').classes()).not.toContain('--active')
    })

    it('prevents multiple simultaneous requestAnimationFrame calls', async () => {
      const rafMock = globalThis.requestAnimationFrame as Mock

      rafMock.mockClear()
      rafMock.mockImplementation(() => 1)

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()
      intersect(true)
      await wrapper.trigger('pointermove', { clientX: 150, clientY: 150 })
      await wrapper.trigger('pointermove', { clientX: 151, clientY: 151 })
      await wrapper.trigger('pointermove', { clientX: 152, clientY: 152 })

      expect(rafMock).toHaveBeenCalledTimes(1)
    })

    it('does not follow the pointer under reduced motion', async () => {
      const wrapper = mount(MazCardSpotlight, {
        global: { provide: { [MAZ_UI_CONTEXT_INJECTION_KEY as symbol]: { motion: 'reduced' } } },
      })

      await wrapper.vm.$nextTick()
      intersect(true)
      await wrapper.trigger('pointermove', { clientX: 150, clientY: 150 })

      expect(wrapper.find('.blob').attributes('style')).toContain('display: none')
    })
  })

  describe('when the border draws itself', () => {
    it('sets the entry angle of the pointer and the utility class', async () => {
      const wrapper = mount(MazCardSpotlight, { props: { borderDraw: true } })

      await wrapper.trigger('pointerenter', { clientX: 300, clientY: 200 })

      expect(wrapper.classes()).toContain('maz:border-draw')
      expect((wrapper.element as HTMLElement).style.getPropertyValue('--maz-border-draw-from')).toBe('90deg')
    })

    it('does nothing without the option', async () => {
      const wrapper = mount(MazCardSpotlight)

      await wrapper.trigger('pointerenter', { clientX: 300, clientY: 200 })

      expect(wrapper.classes()).not.toContain('maz:border-draw')
      expect((wrapper.element as HTMLElement).style.getPropertyValue('--maz-border-draw-from')).toBe('')
    })
  })

  describe('when elevation is a level', () => {
    it.each([
      [1, 'maz:shadow-elevation-1'],
      [2, 'maz:shadow-elevation-2'],
      [3, 'maz:shadow-elevation-3'],
    ] as const)('applies the shadow of the level %s', (elevation, expected) => {
      const wrapper = mount(MazCardSpotlight, { props: { elevation } })

      expect(wrapper.classes()).toContain(expected)
      expect(wrapper.classes()).not.toContain('maz:drop-shadow-md')
    })
  })

  describe('when component is unmounted', () => {
    it('disconnects IntersectionObserver', async () => {
      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()
      wrapper.unmount()

      expect(intersectionObserverInstance.disconnect).toHaveBeenCalled()
    })

    it('cancels pending requestAnimationFrame', async () => {
      const rafMock = globalThis.requestAnimationFrame as Mock

      rafMock.mockClear()
      rafMock.mockImplementation(() => 123)

      const wrapper = mount(MazCardSpotlight)

      await wrapper.vm.$nextTick()
      intersectionObserverCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
      await wrapper.trigger('pointermove', { clientX: 150, clientY: 150 })
      wrapper.unmount()

      expect(globalThis.cancelAnimationFrame).toHaveBeenCalledWith(123)
    })
  })
})

describe('given MazCardSpotlight with the neutral color', () => {
  describe('when the color is neutral', () => {
    it('then the halo uses the neutral foreground', () => {
      const wrapper = mount(MazCardSpotlight, { props: { color: 'neutral' } })

      expect(wrapper.attributes('style')).toContain('color-mix(in srgb, var(--maz-neutral-foreground) 20%')
      expect(wrapper.find('.blob').attributes('style')).toContain('color-mix(in srgb, var(--maz-neutral-foreground) 60%')
    })
  })
})

describe('given MazCardSpotlight with a free color', () => {
  describe('when the color is a variable', () => {
    it('then the halo and the border tint derive from it', () => {
      const wrapper = mount(MazCardSpotlight, { props: { color: 'var(--brand)' } })

      expect(wrapper.attributes('style')).toContain('color-mix(in srgb, var(--brand) 20%')
      expect(wrapper.find('.blob').attributes('style')).toContain('color-mix(in srgb, var(--brand) 60%')
    })
  })
})
