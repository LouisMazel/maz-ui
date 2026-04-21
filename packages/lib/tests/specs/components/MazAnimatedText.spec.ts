import MazAnimatedText from '@components/MazAnimatedText.vue'
import { mount } from '@vue/test-utils'

type ObserverCallback = (entries: Array<{ isIntersecting: boolean, target: Element }>) => void

let observerCallbacks: ObserverCallback[] = []

function triggerAllObservers(target: Element) {
  observerCallbacks.forEach(cb => cb([{ isIntersecting: true, target }]))
}

beforeEach(() => {
  observerCallbacks = []
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })

  class MockIntersectionObserver {
    constructor(cb: ObserverCallback) {
      observerCallbacks.push(cb)
    }

    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('component: MazAnimatedText', () => {
  it('renders the component', () => {
    const wrapper = mount(MazAnimatedText, {
      props: {
        text: 'Hello world',
      },
    })
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })

  it('splits text into words correctly', async () => {
    const wrapper = mount(MazAnimatedText, {
      props: {
        text: 'Hello beautiful world',
        tag: 'h1',
      },
    })

    expect(wrapper.find('h1').html()).toContain('Hello beautiful world')

    // @ts-expect-error - private property
    wrapper.vm.isClient = true
    await wrapper.vm.$nextTick()
    const words = wrapper.findAll('.m-animated-text__word')
    expect(words.length).toBe(3)
    wrapper.unmount()
  })

  it('should render last word correctly', async () => {
    const wrapper = mount(MazAnimatedText, {
      props: {
        text: 'Hello beautiful',
        lastWord: 'world',
      },
    })

    // @ts-expect-error - private property
    wrapper.vm.isClient = true
    await wrapper.vm.$nextTick()

    const lastWord = wrapper.find('.m-animated-text__last-word')
    expect(lastWord.exists()).toBe(true)
    expect(lastWord.text()).toBe('world')
    wrapper.unmount()
  })

  it('should apply correct animation classes and styles', async () => {
    const wrapper = mount(MazAnimatedText, {
      props: {
        text: 'Hello world',
        direction: 'down',
        delay: 0,
        wordDelay: 0,
        duration: 1000,
      },
    })

    // @ts-expect-error - private property
    wrapper.vm.isClient = true
    // @ts-expect-error - private property
    wrapper.vm.isVisible = true
    // @ts-expect-error - private property
    wrapper.vm.animatedWords = [true, true]
    await wrapper.vm.$nextTick()

    const word = wrapper.find('.m-animated-text__word-inner')
    expect(word.classes()).toContain('maz-animate-slide-down-blur')
    expect(word.attributes('style')).toContain('animation-duration: 1000ms')
    wrapper.unmount()
  })

  it('should apply correct gaps between words', async () => {
    const wrapper = mount(MazAnimatedText, {
      props: {
        text: 'Hello world',
        columnGap: 1,
        rowGap: 0.5,
      },
    })

    // @ts-expect-error - private property
    wrapper.vm.isClient = true
    await wrapper.vm.$nextTick()

    const root = wrapper.find('.m-animated-text__root')
    expect(root.attributes('style')).toContain('column-gap: 1rem')
    expect(root.attributes('style')).toContain('row-gap: 0.5rem')
    wrapper.unmount()
  })

  it('should render with custom tag', () => {
    const wrapper = mount(MazAnimatedText, {
      props: {
        text: 'Hello world',
        tag: 'p',
      },
    })

    expect(wrapper.find('p').exists()).toBe(true)
    wrapper.unmount()
  })

  describe('Given the element enters the viewport', () => {
    describe('When the IntersectionObserver reports intersection', () => {
      it('Then all words are animated sequentially after timers fire', async () => {
        const wrapper = mount(MazAnimatedText, {
          props: {
            text: 'one two three',
            delay: 10,
            wordDelay: 5,
          },
          attachTo: document.body,
        })

        // @ts-expect-error - private property
        wrapper.vm.isClient = true
        await wrapper.vm.$nextTick()

        triggerAllObservers(wrapper.element)
        await vi.runAllTimersAsync()
        await wrapper.vm.$nextTick()

        // @ts-expect-error - private property
        expect(wrapper.vm.animatedWords.every((v: boolean) => v === true)).toBe(true)
        wrapper.unmount()
      })
    })

    describe('When the once prop is true and the element becomes visible', () => {
      it('Then subsequent intersections are ignored', async () => {
        const wrapper = mount(MazAnimatedText, {
          props: { text: 'once', once: true },
          attachTo: document.body,
        })

        // @ts-expect-error - private property
        wrapper.vm.isClient = true
        await wrapper.vm.$nextTick()

        triggerAllObservers(wrapper.element)
        await vi.runAllTimersAsync()
        // @ts-expect-error - private property
        expect(wrapper.vm.isVisible).toBe(true)
        wrapper.unmount()
      })
    })
  })
})
