import MazStatCard from '@components/MazStatCard.vue'
import { mount } from '@vue/test-utils'

const data = [10, 20, 15, 30]

function mountCard(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazStatCard, { props: { label: 'Revenue', value: 1200, locale: 'en', data, ...props } })

  const chart = wrapper.find('.m-stat-card__chart')

  if (chart.exists()) {
    vi.spyOn(chart.element, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 300, height: 72, right: 300, bottom: 72, x: 0, y: 0, toJSON: () => ({}) })
  }

  return wrapper
}

describe('given a MazStatCard', () => {
  describe('when it renders', () => {
    it('then it shows the label and the formatted value', () => {
      const wrapper = mountCard({ format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } })

      expect(wrapper.find('.m-stat-card__label').text()).toBe('Revenue')
      expect(wrapper.find('.m-stat-card__value').text()).toContain('$1,200')
      expect(wrapper.attributes('role')).toBe('group')
      expect(wrapper.attributes('aria-label')).toBe('Revenue')
    })

    it('then the label slot replaces the label', () => {
      const wrapper = mount(MazStatCard, { props: { label: 'Revenue', value: 1 }, slots: { label: 'Custom', default: '<i class="extra" />' } })

      expect(wrapper.find('.m-stat-card__label').text()).toBe('Custom')
      expect(wrapper.find('.extra').exists()).toBe(true)
    })

    it('then it has no chart without data or with a single value', () => {
      expect(mount(MazStatCard, { props: { label: 'x', value: 1 } }).find('.m-stat-card__chart').exists()).toBe(false)
      expect(mount(MazStatCard, { props: { label: 'x', value: 1, data: [3] } }).find('.m-stat-card__chart').exists()).toBe(false)
    })
  })

  describe('when it shows the delta', () => {
    it('then a positive delta is good with an up arrow', () => {
      const wrapper = mountCard({ delta: 12, deltaLabel: 'vs last month' })

      expect(wrapper.find('.m-stat-card__trend').classes()).toContain('m-stat-card__trend--good')
      expect(wrapper.find('.m-stat-card__trend').text()).toContain('+12%')
      expect(wrapper.find('.m-stat-card__delta').text()).toContain('vs last month')
    })

    it('then a negative delta is bad', () => {
      const wrapper = mountCard({ delta: -3.5 })

      expect(wrapper.find('.m-stat-card__trend').classes()).toContain('m-stat-card__trend--bad')
      expect(wrapper.find('.m-stat-card__trend').text()).toContain('-3.5%')
    })

    it('then inverse flips the colors', () => {
      expect(mountCard({ delta: 5, inverse: true }).find('.m-stat-card__trend').classes()).toContain('m-stat-card__trend--bad')
      expect(mountCard({ delta: -5, inverse: true }).find('.m-stat-card__trend').classes()).toContain('m-stat-card__trend--good')
    })

    it('then a zero delta is neutral without arrow', () => {
      const wrapper = mountCard({ delta: 0 })

      expect(wrapper.find('.m-stat-card__trend').classes()).toContain('m-stat-card__trend--neutral')
      expect(wrapper.find('.m-stat-card__trend .m-icon').exists()).toBe(false)
    })

    it('then there is no delta line without delta', () => {
      expect(mountCard().find('.m-stat-card__delta').exists()).toBe(false)
    })
  })

  describe('when the pointer moves on the chart', () => {
    it('then the marker snaps to the nearest point and shows its value', async () => {
      const wrapper = mountCard({ labels: ['Mon', 'Tue', 'Wed', 'Thu'] })
      const chart = wrapper.find('.m-stat-card__chart')

      await chart.trigger('pointermove', { clientX: 290 })

      expect(wrapper.find('.m-stat-card__marker').classes()).toContain('m-stat-card__marker--visible')
      expect(wrapper.find('.m-stat-card__marker-bubble').text()).toBe('Thu: 30')
      expect(wrapper.find('.m-stat-card__marker-bubble').classes()).toContain('m-stat-card__marker-bubble--end')
      expect(chart.attributes('aria-valuenow')).toBe('3')

      await chart.trigger('pointermove', { clientX: 150 })
      expect(wrapper.find('.m-stat-card__marker-bubble').classes()).toContain('m-stat-card__marker-bubble--center')

      await chart.trigger('pointermove', { clientX: 0 })
      expect(wrapper.find('.m-stat-card__marker-bubble').classes()).toContain('m-stat-card__marker-bubble--start')
      expect(wrapper.find('.m-stat-card__marker-bubble').text()).toBe('Mon: 10')
    })

    it('then the marker hides when the pointer leaves', async () => {
      const wrapper = mountCard()
      const chart = wrapper.find('.m-stat-card__chart')

      await chart.trigger('pointerdown', { clientX: 100 })
      await chart.trigger('pointerleave')

      expect(wrapper.find('.m-stat-card__marker').classes()).not.toContain('m-stat-card__marker--visible')
    })
  })

  describe('when the chart has the keyboard focus', () => {
    it('then it is a slider on the last point first', async () => {
      const wrapper = mountCard({ labels: ['a', 'b', 'c', 'd'] })
      const chart = wrapper.find('.m-stat-card__chart')

      expect(chart.attributes('role')).toBe('slider')
      expect(chart.attributes('tabindex')).toBe('0')
      expect(chart.attributes('aria-valuetext')).toBe('d: 30')

      await chart.trigger('focus')
      expect(wrapper.find('.m-stat-card__marker').classes()).toContain('m-stat-card__marker--visible')
    })

    it('then the arrows, Home and End move the marker', async () => {
      const wrapper = mountCard()
      const chart = wrapper.find('.m-stat-card__chart')

      await chart.trigger('focus')
      await chart.trigger('keydown', { key: 'ArrowLeft' })
      expect(chart.attributes('aria-valuenow')).toBe('2')

      await chart.trigger('keydown', { key: 'Home' })
      expect(chart.attributes('aria-valuenow')).toBe('0')

      await chart.trigger('keydown', { key: 'ArrowLeft' })
      expect(chart.attributes('aria-valuenow')).toBe('0')

      await chart.trigger('keydown', { key: 'ArrowRight' })
      expect(chart.attributes('aria-valuenow')).toBe('1')

      await chart.trigger('keydown', { key: 'End' })
      await chart.trigger('keydown', { key: 'ArrowRight' })
      expect(chart.attributes('aria-valuenow')).toBe('3')
    })

    it('then Escape and blur hide the marker and other keys are ignored', async () => {
      const wrapper = mountCard()
      const chart = wrapper.find('.m-stat-card__chart')

      await chart.trigger('focus')
      await chart.trigger('keydown', { key: 'a' })
      expect(wrapper.find('.m-stat-card__marker').classes()).toContain('m-stat-card__marker--visible')

      await chart.trigger('keydown', { key: 'Escape' })
      expect(wrapper.find('.m-stat-card__marker').classes()).not.toContain('m-stat-card__marker--visible')

      await chart.trigger('focus')
      await chart.trigger('blur')
      expect(wrapper.find('.m-stat-card__marker').classes()).not.toContain('m-stat-card__marker--visible')
    })
  })
})
