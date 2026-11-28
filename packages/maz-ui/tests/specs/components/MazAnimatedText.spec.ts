import MazAnimatedText from '@components/MazAnimatedText.vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

enableAutoUnmount(afterEach)

describe('given a MazAnimatedText with a neutral gradient', () => {
  describe('when a gradient color is neutral', () => {
    it('then the gradient uses the neutral foreground', () => {
      const wrapper = mount(MazAnimatedText, {
        props: { text: 'Hello', lastWord: 'world', gradientFrom: 'neutral', gradientVia: 'primary', gradientTo: 'neutral' },
      })

      expect(wrapper.attributes('style')).toContain('linear-gradient(to right, var(--maz-neutral-foreground), var(--maz-primary), var(--maz-neutral-foreground))')
    })
  })
})

describe('given a MazAnimatedText', () => {
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
    it('then the root reveals the words in a cascade with the direction, the delay and the duration', () => {
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

      const root = wrapper.find('.m-animated-text__root')
      const items = wrapper.findAll<HTMLElement>('[data-maz-reveal-item]')

      expect(root.attributes('data-maz-reveal')).toBe('slide-down')
      expect(root.attributes('data-maz-reveal-blur')).toBeDefined()
      expect(root.attributes('style')).toContain('--maz-reveal-delay: 100ms')
      expect(root.attributes('style')).toContain('--maz-reveal-stagger: 50ms')
      expect(root.attributes('style')).toContain('--maz-reveal-duration: 1000ms')
      expect(items).toHaveLength(3)
      expect(items.map(item => item.element.style.getPropertyValue('--maz-i'))).toEqual(['0', '1', '2'])
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

  describe('when it is mounted', () => {
    it('then the words are hidden until the text is visible', () => {
      const wrapper = mount(MazAnimatedText, { props: { text: 'Hello world' } })

      expect(wrapper.find('.m-animated-text__root').attributes('data-maz-reveal-state')).toBe('hidden')
    })
  })
})
