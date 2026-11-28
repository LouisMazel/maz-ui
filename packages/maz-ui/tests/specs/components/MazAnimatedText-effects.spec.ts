import MazAnimatedText from '@components/MazAnimatedText.vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { FakeIntersectionObserver } from '../../helpers/intersection-observer.ts'
import { stubMedia } from '../../helpers/media.ts'

enableAutoUnmount(afterEach)

function render(props: Record<string, unknown>, slots?: Record<string, () => unknown>) {
  return mount(MazAnimatedText, { props: { text: 'Hello world', ...props } as never, slots: slots as never, attachTo: document.body })
}

const root = (wrapper: ReturnType<typeof render>) => wrapper.find('.m-animated-text__effect')
const enter = (visible = true) => FakeIntersectionObserver.last!.trigger(visible)

describe('given a MazAnimatedText with an effect', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    stubMedia()
    FakeIntersectionObserver.instances.length = 0
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  describe('when it is rendered on the server', () => {
    it.each(['scramble', 'typewriter', 'shimmer', 'highlight'])('then the %s text is plain and complete', async (effect) => {
      const html = await renderToString(createSSRApp({
        render: () => h(MazAnimatedText, { text: 'Hello world', effect: effect as never }),
      }))

      expect(html).toContain('Hello world')
      expect(html).not.toContain('m-animated-text__overlay')
    })
  })

  describe('given the scramble effect', () => {
    describe('when it is mounted', () => {
      it('then the real text stays visible and readable until the text enters the screen', () => {
        const wrapper = render({ effect: 'scramble' })

        expect(wrapper.find('.m-animated-text__sizer').text()).toBe('Hello world')
        expect(wrapper.find('.m-animated-text__overlay').exists()).toBe(false)
      })
    })

    describe('when the text enters the screen', () => {
      it('then the overlay is scrambled and hidden from screen readers, then the real text comes back', async () => {
        const wrapper = render({ effect: 'scramble', duration: 400 })

        enter()
        await nextTick()

        const overlay = wrapper.find('.m-animated-text__overlay')

        expect(overlay.attributes('aria-hidden')).toBe('true')
        expect(wrapper.find('.m-animated-text__sizer').text()).toBe('Hello world')

        vi.advanceTimersByTime(1000)
        await nextTick()

        expect(wrapper.find('.m-animated-text__overlay').exists()).toBe(false)
        expect(wrapper.text()).toBe('Hello world')
      })

      it('then the delay is waited before the decoding', async () => {
        const wrapper = render({ effect: 'scramble', delay: 500 })

        enter()
        await nextTick()

        expect(wrapper.find('.m-animated-text__overlay').text()).not.toMatch(/[a-z]/i)

        vi.advanceTimersByTime(600)
        await nextTick()

        expect(wrapper.find('.m-animated-text__overlay').text()).toMatch(/[a-z]/i)
      })
    })

    describe('when the text changes after the animation', () => {
      it('then it decodes again', async () => {
        const wrapper = render({ effect: 'scramble', duration: 200 })

        enter()
        vi.advanceTimersByTime(1000)
        await nextTick()
        await wrapper.setProps({ text: 'Another text' })
        vi.advanceTimersByTime(10)
        await nextTick()

        expect(wrapper.find('.m-animated-text__overlay').exists()).toBe(true)
      })
    })

    describe('when once is false', () => {
      it('then it plays again at each entry and shows the text when it leaves', async () => {
        const wrapper = render({ effect: 'scramble', once: false, duration: 200 })

        enter()
        vi.advanceTimersByTime(1000)
        await nextTick()
        enter(false)
        await nextTick()
        enter()
        await nextTick()

        expect(wrapper.find('.m-animated-text__overlay').exists()).toBe(true)

        enter(false)
        await nextTick()

        expect(wrapper.find('.m-animated-text__overlay').exists()).toBe(false)
      })
    })

    describe('when once is true and the text leaves the screen', () => {
      it('then nothing changes', async () => {
        const wrapper = render({ effect: 'scramble', duration: 200 })

        enter()
        vi.advanceTimersByTime(1000)
        enter(false)
        await nextTick()

        expect(wrapper.text()).toBe('Hello world')
      })
    })

    describe('when the motion is reduced', () => {
      it('then the text is shown at once', async () => {
        stubMedia({ reduced: true })
        const wrapper = render({ effect: 'scramble' })

        await nextTick()
        enter()
        await nextTick()

        expect(wrapper.find('.m-animated-text__overlay').exists()).toBe(false)
      })
    })
  })

  describe('given the typewriter effect', () => {
    describe('when the text enters the screen', () => {
      it('then it is typed with a caret, then the caret goes', async () => {
        const wrapper = render({ effect: 'typewriter' })

        enter()
        await nextTick()
        vi.advanceTimersByTime(300)
        await nextTick()

        const typed = wrapper.find('.m-animated-text__overlay').text()

        expect(typed.length).toBeGreaterThan(0)
        expect(typed.length).toBeLessThan('Hello world'.length)
        expect(wrapper.find('.m-animated-text__caret').exists()).toBe(true)
        expect(wrapper.find('.m-animated-text__sizer').text()).toBe('Hello world')

        vi.advanceTimersByTime(5000)
        await nextTick()

        expect(wrapper.find('.m-animated-text__overlay').exists()).toBe(false)
      })
    })

    describe('when a type speed of 1ms is given', () => {
      it('then the whole text is typed almost at once', async () => {
        const wrapper = render({ effect: 'typewriter', typeSpeed: 1 })

        enter()
        await nextTick()
        vi.advanceTimersByTime(200)
        await nextTick()

        expect(wrapper.find('.m-animated-text__overlay').exists()).toBe(false)
      })
    })

    describe('when a slow type speed is given', () => {
      it('then the text is still being typed after one second', async () => {
        const wrapper = render({ effect: 'typewriter', typeSpeed: 400 })

        enter()
        await nextTick()
        vi.advanceTimersByTime(1000)
        await nextTick()

        expect(wrapper.find('.m-animated-text__overlay').exists()).toBe(true)
      })
    })

    describe('when the component is unmounted while typing', () => {
      it('then the timers are cleared', async () => {
        const wrapper = render({ effect: 'typewriter' })

        enter()
        await nextTick()
        wrapper.unmount()

        expect(vi.getTimerCount()).toBe(0)
      })
    })
  })

  describe('given the rotate effect', () => {
    const words = ['fast', 'beautiful', 'accessible']

    describe('when it is mounted', () => {
      it('then the sentence is followed by the words, only the first one is exposed', () => {
        const wrapper = render({ effect: 'rotate', text: 'Build', words })
        const items = wrapper.findAll('.m-animated-text__rotator-word')

        expect(wrapper.text()).toContain('Build')
        expect(root(wrapper).attributes('aria-live')).toBe('off')
        expect(items.map(item => item.attributes('data-state'))).toEqual(['active', 'idle', 'idle'])
        expect(items.map(item => item.attributes('aria-hidden'))).toEqual([undefined, 'true', 'true'])
      })

      it('then {word} places the words inside the sentence', () => {
        const wrapper = render({ effect: 'rotate', text: 'Sites {word} for all', words })

        expect(wrapper.text().startsWith('Sites')).toBe(true)
        expect(wrapper.text().endsWith('for all')).toBe(true)
      })
    })

    describe('when it is visible', () => {
      it('then the words take turns and loop', async () => {
        const wrapper = render({ effect: 'rotate', text: 'Build', words, interval: 1000 })

        enter()
        await nextTick()
        vi.advanceTimersByTime(1000)
        await nextTick()

        expect(wrapper.findAll('.m-animated-text__rotator-word').map(item => item.attributes('data-state'))).toEqual(['out', 'active', 'idle'])

        vi.advanceTimersByTime(2000)
        await nextTick()

        expect(wrapper.findAll('.m-animated-text__rotator-word')[0]!.attributes('data-state')).toBe('active')
      })

      it('then hovering pauses and leaving resumes', async () => {
        const wrapper = render({ effect: 'rotate', text: 'Build', words, interval: 1000 })

        enter()
        await root(wrapper).trigger('pointerenter')
        vi.advanceTimersByTime(3000)
        await nextTick()

        expect(wrapper.findAll('.m-animated-text__rotator-word')[0]!.attributes('data-state')).toBe('active')

        await root(wrapper).trigger('pointerleave')
        vi.advanceTimersByTime(1000)
        await nextTick()

        expect(wrapper.findAll('.m-animated-text__rotator-word')[1]!.attributes('data-state')).toBe('active')
      })

      it('then focus pauses as well', async () => {
        const wrapper = render({ effect: 'rotate', text: 'Build', words, interval: 1000 })

        enter()
        await root(wrapper).trigger('focusin')
        vi.advanceTimersByTime(3000)
        await nextTick()

        expect(wrapper.findAll('.m-animated-text__rotator-word')[0]!.attributes('data-state')).toBe('active')

        await root(wrapper).trigger('focusout')
      })
    })

    describe('when it is off screen', () => {
      it('then it does not rotate', async () => {
        const wrapper = render({ effect: 'rotate', text: 'Build', words, interval: 1000 })

        vi.advanceTimersByTime(5000)
        await nextTick()

        expect(wrapper.findAll('.m-animated-text__rotator-word')[0]!.attributes('data-state')).toBe('active')

        enter()
        enter(false)
        vi.advanceTimersByTime(5000)
        await nextTick()

        expect(wrapper.findAll('.m-animated-text__rotator-word')[0]!.attributes('data-state')).toBe('active')
      })
    })

    describe('when there is a single word or the motion is reduced', () => {
      it('then nothing rotates', async () => {
        const single = render({ effect: 'rotate', words: ['one'], interval: 100 })

        enter()
        vi.advanceTimersByTime(1000)
        await nextTick()

        expect(single.findAll('.m-animated-text__rotator-word')[0]!.attributes('data-state')).toBe('active')

        stubMedia({ reduced: true })
        const reduced = render({ effect: 'rotate', words, interval: 100 })

        await nextTick()
        FakeIntersectionObserver.last!.trigger(true)
        vi.advanceTimersByTime(1000)
        await nextTick()

        expect(reduced.findAll('.m-animated-text__rotator-word')[0]!.attributes('data-state')).toBe('active')
      })
    })
  })

  describe('given the shimmer effect', () => {
    describe('when it is mounted', () => {
      it('then the text is wrapped for the light band and its cycle follows duration', () => {
        const wrapper = render({ effect: 'shimmer', duration: 1500 })

        expect(wrapper.find('.m-animated-text__shimmer').text()).toBe('Hello world')
        expect(root(wrapper).attributes('style')).toContain('--m-animated-text-duration: 1500ms')
      })

      it('then the animation pauses when the text is off screen', async () => {
        const wrapper = render({ effect: 'shimmer' })

        expect(root(wrapper).classes()).toContain('m-animated-text__effect--idle')

        enter()
        await nextTick()

        expect(root(wrapper).classes()).not.toContain('m-animated-text__effect--idle')
      })
    })
  })

  describe('given the highlight effect', () => {
    describe('when words are given', () => {
      it('then each match is a mark with a drawn stroke hidden from screen readers', async () => {
        const wrapper = render({ effect: 'highlight', text: 'Fast and accessible', highlight: ['accessible', 'fast'], highlightType: 'underline', color: 'secondary' })

        const marks = wrapper.findAll('mark')

        expect(marks.map(mark => mark.text())).toEqual(['Fast', 'accessible'])
        expect(marks[0]!.find('svg').attributes('aria-hidden')).toBe('true')
        expect(marks[0]!.find('svg').classes()).toContain('m-animated-text__stroke--underline')
        expect(marks[1]!.element.style.getPropertyValue('--m-i')).toBe('1')
        expect(root(wrapper).attributes('style')).toContain('var(--maz-secondary)')

        enter()
        await nextTick()

        expect(root(wrapper).classes()).toContain('m-animated-text__effect--played')
      })

      it('then the neutral color uses the neutral foreground', () => {
        const wrapper = render({ effect: 'highlight', highlight: 'world', color: 'neutral' })

        expect(root(wrapper).attributes('style')).toContain('var(--maz-neutral-foreground)')
      })

      it('then the strokes are drawn again when the text changes', async () => {
        const wrapper = render({ effect: 'highlight', text: 'Fast text', highlight: 'fast' })

        await wrapper.setProps({ text: 'Fast text again' })
        await nextTick()

        expect(wrapper.findAll('mark svg')).toHaveLength(1)
      })

      it('then the shape follows the highlight type', async () => {
        const wrapper = render({ effect: 'highlight', highlight: 'world', highlightType: 'circle' })

        expect(wrapper.find('mark svg').classes()).toContain('m-animated-text__stroke--circle')

        await wrapper.setProps({ highlightType: 'marker' })

        expect(wrapper.find('mark svg').classes()).toContain('m-animated-text__stroke--marker')
        expect(wrapper.findAll('mark svg')).toHaveLength(1)
      })
    })

    describe('when the slot holds mark elements', () => {
      it('then they are drawn instead of text', () => {
        const wrapper = render({ effect: 'highlight' }, {
          default: () => ['Build ', h('mark', 'fast'), ' sites'],
        })

        expect(wrapper.text()).toBe('Build fast sites')
        expect(wrapper.findAll('mark svg')).toHaveLength(1)
      })
    })

    describe('when once is false', () => {
      it('then the stroke is erased when the text leaves the screen', async () => {
        const wrapper = render({ effect: 'highlight', highlight: 'world', once: false })

        enter()
        await nextTick()

        expect(root(wrapper).classes()).toContain('m-animated-text__effect--played')

        enter(false)
        await nextTick()

        expect(root(wrapper).classes()).not.toContain('m-animated-text__effect--played')
      })
    })
  })

  describe('given no effect', () => {
    describe('when it is mounted', () => {
      it('then the words come in as before and nothing is observed twice', () => {
        const wrapper = render({})

        expect(wrapper.findAll('.m-animated-text__word')).toHaveLength(2)
        expect(wrapper.find('.m-animated-text__effect').exists()).toBe(false)
      })
    })
  })
})
