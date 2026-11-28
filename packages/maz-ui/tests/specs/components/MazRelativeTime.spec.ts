import MazRelativeTime from '@components/MazRelativeTime.vue'
import { mount } from '@vue/test-utils'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const NOW = new Date('2026-06-01T12:00:00Z').getTime()

describe('given a MazRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when it renders a past date', () => {
    it('then it is a time element with the ISO datetime and the relative text', () => {
      const date = NOW - 3 * 60_000
      const wrapper = mount(MazRelativeTime, { props: { date, locale: 'en' } })

      expect(wrapper.element.tagName).toBe('TIME')
      expect(wrapper.attributes('datetime')).toBe(new Date(date).toISOString())
      expect(wrapper.text()).toContain('3 minutes ago')
    })

    it('then it uses the locale', () => {
      const wrapper = mount(MazRelativeTime, { props: { date: NOW - 3 * 60_000, locale: 'fr' } })

      expect(wrapper.text()).toContain('il y a 3 minutes')
    })

    it('then it accepts a string and a Date', () => {
      expect(mount(MazRelativeTime, { props: { date: new Date(NOW - 3_600_000), locale: 'en' } }).text()).toContain('1 hour ago')
      expect(mount(MazRelativeTime, { props: { date: new Date(NOW - 7_200_000).toISOString(), locale: 'en' } }).text()).toContain('2 hours ago')
    })

    it('then it applies the style', () => {
      const wrapper = mount(MazRelativeTime, { props: { date: NOW - 3 * 60_000, locale: 'en', style: 'short' } })

      expect(wrapper.text()).toContain('3 min. ago')
    })

    it('then it shows the exact date in the title', () => {
      const wrapper = mount(MazRelativeTime, { props: { date: NOW - 3 * 60_000, locale: 'en' } })

      expect(wrapper.attributes('title')).toContain('2026')
    })

    it('then it removes the title with title false', () => {
      const wrapper = mount(MazRelativeTime, { props: { date: NOW - 3 * 60_000, locale: 'en', title: false } })

      expect(wrapper.attributes('title')).toBeUndefined()
    })

    it('then it has no datetime for an invalid date', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
      const wrapper = mount(MazRelativeTime, { props: { date: 'nope', locale: 'en' } })

      expect(wrapper.attributes('datetime')).toBeUndefined()
      expect(wrapper.attributes('title')).toBeUndefined()
    })
  })

  describe('when time passes', () => {
    it('then the text updates by itself with the adapted tick', async () => {
      const wrapper = mount(MazRelativeTime, { props: { date: NOW - 4000, locale: 'en' } })

      expect(wrapper.text()).toContain('now')

      await vi.advanceTimersByTimeAsync(2000)
      expect(wrapper.text()).toContain('6 seconds ago')

      await vi.advanceTimersByTimeAsync(60_000)
      expect(wrapper.text()).toContain('1 minute ago')
    })

    it('then the future reads in the future', () => {
      const wrapper = mount(MazRelativeTime, { props: { date: NOW + 5 * 60_000, locale: 'en' } })

      expect(wrapper.text()).toContain('in 5 minutes')
    })
  })

  describe('when it renders on the server', () => {
    it('then it renders the time element without error', async () => {
      const html = await renderToString(createSSRApp(MazRelativeTime, { date: NOW - 3 * 60_000, locale: 'en' }))

      expect(html).toContain('<time')
      expect(html).toContain('datetime=')
      expect(html).toContain('data-allow-mismatch')
    })
  })
})
