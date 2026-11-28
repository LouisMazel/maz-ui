import MazAnimatedElement from '@components/MazAnimatedElement.vue'
import { enableAutoUnmount, shallowMount } from '@vue/test-utils'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

enableAutoUnmount(afterEach)

describe('given a MazAnimatedElement', () => {
  describe('when it is rendered on the server', () => {
    it('then the content is visible without any reveal attribute', async () => {
      const html = await renderToString(createSSRApp({
        render: () => h(MazAnimatedElement, null, () => 'Hello'),
      }))

      expect(html).not.toContain('data-maz-reveal')
      expect(html).toContain('Hello')
    })
  })

  describe('when it is mounted with the default props', () => {
    it('then it slides up with a blur, in 2000ms, and is hidden until it is visible', () => {
      const wrapper = shallowMount(MazAnimatedElement, { slots: { default: 'Hello' } })

      expect(wrapper.attributes('data-maz-reveal')).toBe('slide-up')
      expect(wrapper.attributes('data-maz-reveal-blur')).toBeDefined()
      expect(wrapper.attributes('data-maz-reveal-state')).toBe('hidden')
      expect(wrapper.attributes('style')).toContain('--maz-reveal-duration: 2000ms')
      expect(wrapper.text()).toBe('Hello')
    })
  })

  describe.each([
    ['up', 'slide-up'],
    ['down', 'slide-down'],
    ['left', 'slide-left'],
    ['right', 'slide-right'],
  ] as const)('when the direction is %s', (direction, effect) => {
    it(`then the effect is ${effect}`, () => {
      const wrapper = shallowMount(MazAnimatedElement, { props: { direction } })

      expect(wrapper.attributes('data-maz-reveal')).toBe(effect)
    })
  })

  describe('when it gets a delay and a duration', () => {
    it('then they are the delay and the duration of the reveal', () => {
      const wrapper = shallowMount(MazAnimatedElement, { props: { delay: 500, duration: 1000 } })

      expect(wrapper.attributes('style')).toContain('--maz-reveal-delay: 500ms')
      expect(wrapper.attributes('style')).toContain('--maz-reveal-duration: 1000ms')
    })
  })

  describe('when it is not played once', () => {
    it('then the observer keeps watching the element', () => {
      const wrapper = shallowMount(MazAnimatedElement, { props: { once: false } })

      expect(wrapper.attributes('data-maz-reveal-state')).toBe('hidden')
    })
  })
})
