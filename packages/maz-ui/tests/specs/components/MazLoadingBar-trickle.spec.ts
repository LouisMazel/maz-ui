import MazLoadingBar from '@components/MazLoadingBar.vue'
import { mount } from '@vue/test-utils'

function progress(wrapper: ReturnType<typeof mount>) {
  return Number(/--m-loading-bar-progress: ([\d.]+)/.exec(wrapper.find('.m-loading-bar__bar').attributes('style') ?? '')?.[1])
}

describe('given MazLoadingBar with the loading prop', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when loading is not set', () => {
    it('then the bar slides endlessly as before', () => {
      const wrapper = mount(MazLoadingBar)

      expect(wrapper.find('.m-loading-bar__bar').exists()).toBe(false)
      expect(wrapper.attributes('role')).toBeUndefined()
    })
  })

  describe('when loading is true', () => {
    it('then the bar advances by steps that slow down and never reaches the end', async () => {
      const wrapper = mount(MazLoadingBar, { props: { loading: true } })
      await wrapper.vm.$nextTick()
      const values = [progress(wrapper)]

      for (let index = 0; index < 8; index++) {
        vi.advanceTimersByTime(250 + index * 150)
        await wrapper.vm.$nextTick()
        values.push(progress(wrapper))
      }

      const increments = values.slice(1).map((value, index) => value - values[index]!)

      expect(values[0]).toBeCloseTo(0.08)
      expect(increments.every(value => value > 0)).toBe(true)
      expect(increments.at(-1)!).toBeLessThan(increments[1]!)
      expect(values.at(-1)!).toBeLessThan(0.95)
    })

    it('then it is a busy progressbar', async () => {
      const wrapper = mount(MazLoadingBar, { props: { loading: true } })
      await wrapper.vm.$nextTick()

      expect(wrapper.attributes('role')).toBe('progressbar')
      expect(wrapper.attributes('aria-busy')).toBe('true')
      expect(wrapper.attributes('aria-hidden')).toBeUndefined()
    })
  })

  describe('when loading goes back to false', () => {
    it('then it runs to the end, slips out and goes idle', async () => {
      const wrapper = mount(MazLoadingBar, { props: { loading: true } })
      await wrapper.vm.$nextTick()

      await wrapper.setProps({ loading: false })

      expect(progress(wrapper)).toBe(1)
      expect(wrapper.find('.m-loading-bar__bar').classes()).toContain('--finishing')

      vi.advanceTimersByTime(250)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-loading-bar__bar').classes()).toContain('--leaving')

      vi.advanceTimersByTime(250)
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-loading-bar__bar').classes()).toContain('--idle')
      expect(progress(wrapper)).toBe(0)
      expect(wrapper.attributes('aria-hidden')).toBe('true')
    })

    it('then loading true again restarts from the beginning', async () => {
      const wrapper = mount(MazLoadingBar, { props: { loading: true } })

      await wrapper.setProps({ loading: false })
      await wrapper.setProps({ loading: true })

      expect(wrapper.find('.m-loading-bar__bar').classes()).toContain('--running')
      expect(progress(wrapper)).toBeCloseTo(0.08)
    })
  })

  describe('when loading is false from the start', () => {
    it('then the bar stays idle and hidden', () => {
      const wrapper = mount(MazLoadingBar, { props: { loading: false } })

      expect(wrapper.find('.m-loading-bar__bar').classes()).toContain('--idle')
      expect(wrapper.attributes('aria-hidden')).toBe('true')
    })
  })

  describe('when unmounted while running', () => {
    it('then the timers are cleared', () => {
      const wrapper = mount(MazLoadingBar, { props: { loading: true } })

      wrapper.unmount()

      expect(vi.getTimerCount()).toBe(0)
    })
  })
})
