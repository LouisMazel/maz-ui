import MazCircularProgressBar from '@components/MazCircularProgressBar.vue'
import { mount } from '@vue/test-utils'

// eslint-disable-next-line prefer-arrow-callback
globalThis.IntersectionObserver = vi.fn(function () {
  return { observe: () => null, unobserve: () => null, disconnect: () => null }
}) as unknown as typeof IntersectionObserver

async function settle() {
  await vi.dynamicImportSettled()
  await new Promise(resolve => setTimeout(resolve, 0))
}

describe('given MazCircularProgressBar motion', () => {
  describe('when indeterminate', () => {
    it('then an arc turns and the root is a busy progressbar', async () => {
      const wrapper = mount(MazCircularProgressBar, { props: { percentage: 0, indeterminate: true } })
      await settle()

      expect(wrapper.attributes('role')).toBe('progressbar')
      expect(wrapper.attributes('aria-busy')).toBe('true')
      expect(wrapper.find('svg').classes()).toContain('m-circular-progress-bar__spin')
      expect(wrapper.find('circle').attributes('stroke-dashoffset')).toBe('218')
      expect(wrapper.findComponent({ name: 'MazAnimatedCounter' }).exists()).toBe(false)
    })
  })

  describe('when roll is set', () => {
    it('then the percentage is a rolling text with its prefix and suffix', async () => {
      const wrapper = mount(MazCircularProgressBar, { props: { percentage: 42, roll: true, suffix: '%' } })
      await settle()

      expect(wrapper.find('.m-rolling-text .maz\\:sr-only').text()).toBe('42')
      expect(wrapper.text()).toContain('%')
      expect(wrapper.findComponent({ name: 'MazAnimatedCounter' }).exists()).toBe(false)
    })
  })

  describe('when check is set', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('then the check replaces the number after the circle is drawn', async () => {
      const wrapper = mount(MazCircularProgressBar, { props: { percentage: 100, check: true, duration: 500, delay: 100 } })

      expect(wrapper.find('.m-drawn-icon').exists()).toBe(false)

      vi.advanceTimersByTime(600)
      await wrapper.vm.$nextTick()
      await vi.dynamicImportSettled()
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazDrawnIcon' }).exists()).toBe(true)
    })

    it('then it never shows while the circle is not full', async () => {
      const wrapper = mount(MazCircularProgressBar, { props: { percentage: 60, check: true, duration: 500, delay: 100 } })

      vi.advanceTimersByTime(2000)
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazDrawnIcon' }).exists()).toBe(false)
    })

    it('then the check goes away when the percentage drops', async () => {
      const wrapper = mount(MazCircularProgressBar, { props: { percentage: 100, check: true, duration: 500, delay: 100 } })

      vi.advanceTimersByTime(600)
      await wrapper.setProps({ percentage: 50 })
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazDrawnIcon' }).exists()).toBe(false)
    })
  })

  describe('when none of the new props is set', () => {
    it('then the root is not a progressbar and the counter is used', async () => {
      const wrapper = mount(MazCircularProgressBar, { props: { percentage: 50 } })
      await settle()

      expect(wrapper.attributes('role')).toBeUndefined()
      expect(wrapper.findComponent({ name: 'MazAnimatedCounter' }).exists()).toBe(true)
    })
  })
})
