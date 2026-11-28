import MazReveal from '@components/MazReveal.vue'
import { IntersectionObserverMock } from '@tests/vitest-global.setup.ts'
import { enableAutoUnmount, mount } from '@vue/test-utils'

enableAutoUnmount(afterEach)

describe('given a MazReveal', () => {
  describe('when it wraps content', () => {
    it('then the slot is rendered in a div revealed with the default effect', () => {
      const wrapper = mount(MazReveal, { slots: { default: '<span>Content</span>' } })

      expect(wrapper.element.tagName).toBe('DIV')
      expect(wrapper.text()).toBe('Content')
      expect(wrapper.attributes('data-maz-reveal')).toBe('slide-up')
      expect(wrapper.attributes('data-maz-reveal-state')).toBe('hidden')
    })

    it('then it reveals once by default', () => {
      const wrapper = mount(MazReveal)
      const callback = vi.mocked(IntersectionObserver).mock.calls.at(-1)![0]

      callback([{ target: wrapper.element, isIntersecting: true, intersectionRatio: 1 } as unknown as IntersectionObserverEntry], IntersectionObserverMock as unknown as IntersectionObserver)

      expect(IntersectionObserverMock.unobserve).toHaveBeenCalledWith(wrapper.element)
    })
  })

  describe('when it gets a tag and options', () => {
    it('then the root uses the tag and the options', () => {
      const wrapper = mount(MazReveal, {
        props: { tag: 'section', effect: 'iris', delay: 100, duration: 900, blur: true, stagger: 40, threshold: 0.2, once: false },
      })

      expect(wrapper.element.tagName).toBe('SECTION')
      expect(wrapper.attributes('data-maz-reveal')).toBe('iris')
      expect(wrapper.attributes('style')).toContain('--maz-reveal-delay: 100ms')
      expect(wrapper.attributes('style')).toContain('--maz-reveal-duration: 900ms')
      expect(wrapper.attributes('data-maz-reveal-blur')).toBeDefined()
    })
  })
})
