import MazAnimatedText from '@components/MazAnimatedText.vue'
import { IntersectionObserverMock } from '@tests/vitest-global.setup'
import { mount } from '@vue/test-utils'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

function intersect(element: Element, isIntersecting: boolean) {
  const callback = vi.mocked(IntersectionObserver).mock.calls.at(-1)![0]

  callback(
    [
      { target: element, isIntersecting } as IntersectionObserverEntry,
    ],
    IntersectionObserverMock as unknown as IntersectionObserver,
  )
}

function mockRect(top: number, bottom: number) {
  return vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ top, bottom } as DOMRect)
}

describe('given a MazAnimatedText', () => {
  beforeEach(() => {
    vi.mocked(IntersectionObserver).mockClear()
    vi.mocked(IntersectionObserverMock.observe).mockClear()
    vi.mocked(IntersectionObserverMock.unobserve).mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when it is rendered on the server', () => {
    it('then the words are already split so the client render keeps the same layout', async () => {
      const html = await renderToString(createSSRApp({
        render: () => h(MazAnimatedText, { text: 'Hello beautiful world', tag: 'h1' }),
      }))

      expect(html).toContain('<h1')
      expect(html.match(/m-animated-text__word-inner/g)).toHaveLength(3)
      expect(html).not.toContain('maz:invisible')
    })
  })

  describe('when it is mounted with a last word', () => {
    it('then each word and the last word are rendered', () => {
      const wrapper = mount(MazAnimatedText, {
        props: { text: 'Hello beautiful', lastWord: 'world' },
      })

      expect(wrapper.findAll('.m-animated-text__word')).toHaveLength(2)
      expect(wrapper.find('.m-animated-text__last-word').text()).toBe('world')
    })
  })

  describe('when it is mounted with a direction and timings', () => {
    it('then each word gets the animation class and a staggered delay', () => {
      const wrapper = mount(MazAnimatedText, {
        props: {
          text: 'one two',
          lastWord: 'three',
          direction: 'down',
          delay: 100,
          wordDelay: 50,
          duration: 1000,
        },
      })

      const words = wrapper.findAll('.m-animated-text__word-inner')
      const lastWord = wrapper.find('.m-animated-text__last-word')

      expect(words[0].classes()).toContain('maz-animate-slide-down-blur')
      expect(words[0].attributes('style')).toContain('animation-duration: 1000ms')
      expect(words[0].attributes('style')).toContain('animation-delay: 100ms')
      expect(words[1].attributes('style')).toContain('animation-delay: 150ms')
      expect(lastWord.attributes('style')).toContain('animation-delay: 200ms')
    })
  })

  describe('when it is mounted with gaps and a custom tag', () => {
    it('then the gaps are applied on the tag', () => {
      const wrapper = mount(MazAnimatedText, {
        props: {
          text: 'Hello world',
          columnGap: 1,
          rowGap: 0.5,
          tag: 'p',
        },
      })

      const root = wrapper.find<HTMLElement>('p.m-animated-text__root')

      expect(root.element.style.columnGap).toBe('1rem')
      expect(root.element.style.rowGap).toBe('0.5rem')
    })
  })

  describe('when it is mounted inside the viewport', () => {
    it('then the animation plays without waiting for the observer', () => {
      mockRect(10, 100)
      const wrapper = mount(MazAnimatedText, {
        props: { text: 'Hello world' },
      })

      expect(wrapper.classes()).not.toContain('m-animated-text--pending')
    })
  })

  describe('when it is mounted below the viewport and enters it', () => {
    it('then the animation waits for the intersection and the text is no longer observed', async () => {
      mockRect(2000, 2100)
      const wrapper = mount(MazAnimatedText, {
        props: { text: 'Hello world' },
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('m-animated-text--pending')

      intersect(wrapper.find('.m-animated-text__root').element, true)
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).not.toContain('m-animated-text--pending')
      expect(IntersectionObserverMock.unobserve).toHaveBeenCalled()
    })
  })

  describe('when it leaves the viewport without once', () => {
    it('then the animation is reset to replay on the next intersection', async () => {
      mockRect(10, 100)
      const wrapper = mount(MazAnimatedText, {
        props: { text: 'Hello world', once: false },
      })
      const root = wrapper.find('.m-animated-text__root').element

      intersect(root, false)
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).toContain('m-animated-text--pending')
      expect(IntersectionObserverMock.unobserve).not.toHaveBeenCalled()
    })
  })

  describe('when it leaves the viewport with once', () => {
    it('then the animation is kept', async () => {
      mockRect(10, 100)
      const wrapper = mount(MazAnimatedText, {
        props: { text: 'Hello world', once: true },
      })

      intersect(wrapper.find('.m-animated-text__root').element, false)
      await wrapper.vm.$nextTick()

      expect(wrapper.classes()).not.toContain('m-animated-text--pending')
    })
  })

  describe('when the user prefers reduced motion', () => {
    it('then no observer is created', () => {
      Object.defineProperty(globalThis, 'matchMedia', {
        configurable: true,
        value: vi.fn().mockReturnValue({ matches: true }),
      })
      mount(MazAnimatedText, {
        props: { text: 'Hello world' },
      })

      expect(IntersectionObserver).not.toHaveBeenCalled()
      Reflect.deleteProperty(globalThis, 'matchMedia')
    })
  })
})
