import MazSparkline from '@components/MazSparkline.vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { createSSRApp, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'

const reduced = ref(false)

enableAutoUnmount(afterEach)

vi.mock('@composables/useReducedMotion', () => ({
  useReducedMotion: () => ({ shouldReduceMotion: reduced }),
}))

describe('given a MazSparkline', () => {
  let callback: IntersectionObserverCallback
  let unobserve: ReturnType<typeof vi.fn>

  beforeEach(() => {
    reduced.value = false
    unobserve = vi.fn()

    // eslint-disable-next-line prefer-arrow-callback
    vi.stubGlobal('IntersectionObserver', vi.fn(function (cb: IntersectionObserverCallback) {
      callback = cb

      return { observe: vi.fn(), unobserve, disconnect: vi.fn() }
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('when it renders', () => {
    it('then it draws the line and the last point', () => {
      const wrapper = mount(MazSparkline, { props: { data: [1, 4, 2, 6] } })

      expect(wrapper.find('.m-sparkline__line').attributes('d')).toMatch(/^M/)
      expect(wrapper.find('.m-sparkline__dot').exists()).toBe(true)
      expect(wrapper.find('.m-sparkline__area').exists()).toBe(false)
    })

    it('then it uses the width and the height of the props', () => {
      const wrapper = mount(MazSparkline, { props: { data: [1, 2], width: 100, height: 30 } })

      expect(wrapper.attributes('viewBox')).toBe('0 0 100 30')
      expect(wrapper.attributes('width')).toBe('100')
    })

    it('then it draws the area with fill', () => {
      const wrapper = mount(MazSparkline, { props: { data: [1, 4, 2], fill: true } })

      expect(wrapper.find('.m-sparkline__area').exists()).toBe(true)
    })

    it('then it uses straight segments without smooth', () => {
      const wrapper = mount(MazSparkline, { props: { data: [1, 4, 2], smooth: false } })

      expect(wrapper.find('.m-sparkline__line').attributes('d')).not.toContain('C')
    })

    it('then it applies a theme color, a free color and currentColor', () => {
      expect(mount(MazSparkline, { props: { data: [1, 2], color: 'success' } }).attributes('style')).toContain('var(--maz-success)')
      expect(mount(MazSparkline, { props: { data: [1, 2], color: '#ff0000' } }).attributes('style')).toContain('rgb(255, 0, 0)')
      expect(mount(MazSparkline, { props: { data: [1, 2], color: 'currentColor' } }).attributes('style')).toContain('currentcolor')
      expect(mount(MazSparkline, { props: { data: [1, 2], color: 'neutral' } }).attributes('style')).toContain('neutral-foreground')
    })

    it('then it renders the same markup on the server', async () => {
      const html = await renderToString(createSSRApp(MazSparkline, { data: [1, 2, 3] }))

      expect(html).toContain('m-sparkline')
      expect(html).not.toContain('m-sparkline--armed')
    })
  })

  describe('when it is read by a screen reader', () => {
    it('then it is an image with a summary', () => {
      const wrapper = mount(MazSparkline, { props: { data: [1, 4, 2] } })

      expect(wrapper.attributes('role')).toBe('img')
      expect(wrapper.attributes('aria-label')).toBeTruthy()
    })

    it('then the label prop replaces the summary', () => {
      const wrapper = mount(MazSparkline, { props: { data: [1, 4, 2], label: 'Sales' } })

      expect(wrapper.attributes('aria-label')).toBe('Sales')
    })

    it('then it is hidden without data', () => {
      const wrapper = mount(MazSparkline, { props: { data: [] } })

      expect(wrapper.attributes('aria-hidden')).toBe('true')
      expect(wrapper.attributes('role')).toBeUndefined()
      expect(wrapper.find('.m-sparkline__dot').exists()).toBe(false)
    })
  })

  describe('when it enters the screen', () => {
    it('then it is armed first and drawn once visible', async () => {
      const wrapper = mount(MazSparkline, { props: { data: [1, 4, 2] } })
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('m-sparkline--armed')
      expect(wrapper.classes()).not.toContain('m-sparkline--drawn')

      callback([{ target: wrapper.element, isIntersecting: false } as unknown as IntersectionObserverEntry], {} as IntersectionObserver)
      await wrapper.vm.$nextTick()
      expect(wrapper.classes()).not.toContain('m-sparkline--drawn')

      callback([{ target: wrapper.element, isIntersecting: true } as unknown as IntersectionObserverEntry], {} as IntersectionObserver)
      await wrapper.vm.$nextTick()
      expect(wrapper.classes()).toContain('m-sparkline--drawn')
      expect(unobserve).toHaveBeenCalled()
    })

    it('then it is not armed when animated is false', () => {
      const wrapper = mount(MazSparkline, { props: { data: [1, 4, 2], animated: false } })

      expect(wrapper.classes()).not.toContain('m-sparkline--armed')
    })

    it('then it is not armed with the reduced motion', () => {
      reduced.value = true
      const wrapper = mount(MazSparkline, { props: { data: [1, 4, 2] } })

      expect(wrapper.classes()).not.toContain('m-sparkline--armed')
    })

    it('then it stops observing when unmounted', () => {
      const wrapper = mount(MazSparkline, { props: { data: [1, 4, 2] } })

      wrapper.unmount()

      expect(unobserve).toHaveBeenCalled()
    })
  })
})
