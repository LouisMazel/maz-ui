import type { VueWrapper } from '@vue/test-utils'
import MazCircularProgressBar from '@components/MazCircularProgressBar.vue'
import { mount } from '@vue/test-utils'

// eslint-disable-next-line prefer-arrow-callback
const mockIntersectionObserver = vi.fn(function () {
  return {
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  }
})

globalThis.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver

describe('mazCircularProgressBar', () => {
  let wrapper: VueWrapper<InstanceType<typeof MazCircularProgressBar>>

  beforeEach(async () => {
    wrapper = mount(MazCircularProgressBar, {
      props: {
        percentage: 50,
      },
    })

    await vi.dynamicImportSettled()
  })

  it('renders progress bar with default values', () => {
    expect(wrapper.text()).toContain('50')
  })

  it('updates percentage and triggers animation', async () => {
    await wrapper.setProps({ suffix: '%' })
    expect(wrapper.find('.maz\\:sr-only').text()).toContain('50%')

    await wrapper.setProps({ percentage: 75 })

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.text()).toContain('75%')
  })

  it('renders with auto color', async () => {
    await wrapper.setProps({
      percentage: 25,
      autoColor: true,
    })

    expect(wrapper.find('svg stop').attributes('stop-color')).toContain('maz-destructive')

    await wrapper.setProps({
      percentage: 50,
      autoColor: true,
    })

    expect(wrapper.find('svg stop').attributes('stop-color')).toContain('maz-warning')

    await wrapper.setProps({
      percentage: 100,
      autoColor: true,
    })

    expect(wrapper.find('svg stop').attributes('stop-color')).toContain('maz-success')
  })
})

describe('given MazCircularProgressBar with a free color', () => {
  describe('when the color is a hex', () => {
    it('then the gradient stops derive from it', () => {
      const wrapper = mount(MazCircularProgressBar, { props: { percentage: 50, color: '#e11d48' } })
      const stops = wrapper.findAll('svg stop')

      expect(stops[0]!.attributes('stop-color')).toBe('oklch(from #e11d48 clamp(0, calc(l + 0.06), 1) c h)')
      expect(stops[1]!.attributes('stop-color')).toBe('oklch(from #e11d48 clamp(0, calc(l - 0.1), 1) c h)')
    })
  })

  describe('when the color is a theme color', () => {
    it('then the gradient stops derive from its variable', () => {
      const wrapper = mount(MazCircularProgressBar, { props: { percentage: 50, color: 'info' } })

      expect(wrapper.find('svg stop').attributes('stop-color')).toContain('var(--maz-info)')
    })
  })
})
