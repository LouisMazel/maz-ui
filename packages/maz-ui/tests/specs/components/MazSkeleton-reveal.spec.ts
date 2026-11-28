import MazSkeleton from '@components/MazSkeleton.vue'
import { mount } from '@vue/test-utils'

describe('given MazSkeleton shared shine', () => {
  describe('when mounted with the animation', () => {
    it('then the shine starts at the phase shared by every skeleton', async () => {
      const first = mount(MazSkeleton)
      const second = mount(MazSkeleton)
      await first.vm.$nextTick()

      expect(first.attributes('style')).toMatch(/animation-delay: -\d+ms/)
      expect(Number.parseInt(/-(\d+)ms/.exec(first.attributes('style') ?? '')![1]!)).toBeLessThan(5000)
      expect(second.attributes('style')).toMatch(/animation-delay: -\d+ms/)
    })
  })

  describe('when not animated', () => {
    it('then no delay is set', async () => {
      const wrapper = mount(MazSkeleton, { props: { animated: false } })
      await wrapper.vm.$nextTick()

      expect(wrapper.attributes('style')).not.toContain('animation-delay')
    })
  })
})

describe('given MazSkeleton with a content', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when it is not loaded', () => {
    it('then the content is hidden and inert under the skeleton', () => {
      const wrapper = mount(MazSkeleton, { props: { height: '2rem' }, slots: { default: '<p>Hello</p>' } })

      expect(wrapper.attributes('aria-busy')).toBe('true')
      expect(wrapper.find('.m-skeleton-reveal__content').classes()).toContain('maz:invisible')
      expect(wrapper.find('.m-skeleton-reveal__content').attributes('inert')).toBeDefined()
      expect(wrapper.find('.m-skeleton--cover').attributes('role')).toBe('status')
      expect(wrapper.attributes('style')).toContain('min-height: 2rem')
    })
  })

  describe('when it becomes loaded', () => {
    it('then the cover sweeps away then is removed', async () => {
      const wrapper = mount(MazSkeleton, { slots: { default: '<p>Hello</p>' } })

      await wrapper.setProps({ loaded: true })

      expect(wrapper.attributes('aria-busy')).toBe('false')
      expect(wrapper.find('.m-skeleton-reveal__content').classes()).not.toContain('maz:invisible')
      expect(wrapper.find('.m-skeleton--cover').classes()).toContain('m-skeleton--revealing')

      vi.advanceTimersByTime(500)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-skeleton--cover').exists()).toBe(false)
      expect(wrapper.text()).toContain('Hello')
    })

    it('then animated false removes the cover at once', async () => {
      const wrapper = mount(MazSkeleton, { props: { animated: false }, slots: { default: '<p>Hello</p>' } })

      await wrapper.setProps({ loaded: true })

      expect(wrapper.find('.m-skeleton--cover').exists()).toBe(false)
    })
  })

  describe('when it is loaded from the start', () => {
    it('then there is no cover', () => {
      const wrapper = mount(MazSkeleton, { props: { loaded: true }, slots: { default: '<p>Hello</p>' } })

      expect(wrapper.find('.m-skeleton--cover').exists()).toBe(false)
    })
  })

  describe('when loaded goes back to false', () => {
    it('then the cover returns', async () => {
      const wrapper = mount(MazSkeleton, { props: { loaded: true }, slots: { default: '<p>Hello</p>' } })

      await wrapper.setProps({ loaded: false })

      expect(wrapper.find('.m-skeleton--cover').exists()).toBe(true)
      expect(wrapper.find('.m-skeleton--cover').classes()).not.toContain('m-skeleton--revealing')
    })
  })

  describe('when there is no slot', () => {
    it('then the skeleton is the root bone as before', () => {
      const wrapper = mount(MazSkeleton)

      expect(wrapper.classes()).toContain('m-skeleton')
      expect(wrapper.classes()).not.toContain('m-skeleton--cover')
    })
  })
})
