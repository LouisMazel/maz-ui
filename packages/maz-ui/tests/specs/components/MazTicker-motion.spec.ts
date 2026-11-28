import MazTicker from '@components/MazTicker.vue'
import { mount } from '@vue/test-utils'

describe('given MazTicker ease to stop', () => {
  let frames: FrameRequestCallback[]
  let animations: { animationName: string, playbackRate: number }[]

  beforeEach(() => {
    frames = []
    animations = [
      { animationName: 'm-ticker-scroll-x-abc', playbackRate: 1 },
      { animationName: 'm-ticker-scroll-x-abc', playbackRate: 1 },
      { animationName: 'other', playbackRate: 1 },
    ]
    HTMLElement.prototype.getAnimations = vi.fn(() => animations) as never
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.spyOn(performance, 'now').mockReturnValue(0)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    delete (HTMLElement.prototype as unknown as Record<string, unknown>).getAnimations
  })

  async function mountTicker(props: Record<string, unknown> = {}) {
    const wrapper = mount(MazTicker, { props, slots: { default: '<span>Item</span>' }, attachTo: document.body })

    await wrapper.vm.$nextTick()

    return wrapper
  }

  describe('when the pointer enters a ticker that pauses on hover', () => {
    it('then it slows down until it stops, then speeds up on leave', async () => {
      const wrapper = await mountTicker({ pauseOnHover: true })
      const area = wrapper.find('.m-ticker-wrapper')

      expect(wrapper.classes()).toContain('--eased')

      await area.trigger('pointerenter', { pointerType: 'mouse' })
      frames.shift()!(225)

      expect(animations[0]!.playbackRate).toBeGreaterThan(0)
      expect(animations[0]!.playbackRate).toBeLessThan(1)
      expect(animations[2]!.playbackRate).toBe(1)

      frames.shift()!(10_000)

      expect(animations[0]!.playbackRate).toBe(0)
      expect(animations[1]!.playbackRate).toBe(0)

      await area.trigger('pointerleave', { pointerType: 'mouse' })
      frames.shift()!(20_000)

      expect(animations[0]!.playbackRate).toBe(1)
    })

    it('then a touch does not stop it', async () => {
      const wrapper = await mountTicker({ pauseOnHover: true })

      await wrapper.find('.m-ticker-wrapper').trigger('pointerenter', { pointerType: 'touch' })

      expect(frames).toHaveLength(0)
    })

    it('then nothing happens without pauseOnHover', async () => {
      const wrapper = await mountTicker()

      await wrapper.find('.m-ticker-wrapper').trigger('pointerenter', { pointerType: 'mouse' })
      await wrapper.find('.m-ticker-wrapper').trigger('pointerleave', { pointerType: 'mouse' })

      expect(frames).toHaveLength(0)
    })
  })

  describe('when the focus enters a ticker that pauses on focus', () => {
    it('then it slows down, and speeds up when the focus leaves it', async () => {
      const wrapper = await mountTicker({ pauseOnFocus: true })
      const area = wrapper.find('.m-ticker-wrapper')

      await area.trigger('focusin')
      frames.shift()!(10_000)

      expect(animations[0]!.playbackRate).toBe(0)

      await area.trigger('focusout', { relatedTarget: null })
      frames.shift()!(20_000)

      expect(animations[0]!.playbackRate).toBe(1)
    })

    it('then it keeps stopped when the focus moves inside', async () => {
      const wrapper = await mountTicker({ pauseOnFocus: true })
      const area = wrapper.find('.m-ticker-wrapper')

      await area.trigger('focusin')
      frames.shift()!(10_000)
      await area.trigger('focusout', { relatedTarget: wrapper.find('.m-ticker-content').element })

      expect(frames).toHaveLength(0)
      expect(animations[0]!.playbackRate).toBe(0)
    })
  })

  describe('when the browser cannot read animations', () => {
    it('then the CSS pause stays in charge', async () => {
      delete (HTMLElement.prototype as unknown as Record<string, unknown>).getAnimations

      const wrapper = await mountTicker({ pauseOnHover: true })

      expect(wrapper.classes()).not.toContain('--eased')
    })
  })
})
