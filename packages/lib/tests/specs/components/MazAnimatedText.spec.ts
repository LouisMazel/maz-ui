import MazAnimatedText from '@components/MazAnimatedText.vue'
import { mount } from '@vue/test-utils'

const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})

globalThis.IntersectionObserver = mockIntersectionObserver

describe('component: MazAnimatedText', () => {
  it('renders the component', () => {
    const wrapper = mount(MazAnimatedText, {
      props: {
        text: 'Hello world',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('splits text into words correctly', async () => {
    const wrapper = mount(MazAnimatedText, {
      props: {
        text: 'Hello beautiful world',
        tag: 'h1',
      },
    })

    // Server side
    expect(wrapper.find('h1').html()).toContain('Hello beautiful world')

    // Client side
    // @ts-expect-error - private property
    wrapper.vm.isClient = true
    await wrapper.vm.$nextTick()
    const words = wrapper.findAll('.m-animated-text__word')
    expect(words.length).toBe(3)
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
  })

  it('should apply correct animation classes and styles', async () => {
    const wrapper = mount(MazAnimatedText, {
      props: {
        text: 'Hello world',
        direction: 'down',
        delay: 100,
        wordDelay: 50,
        duration: 1000,
      },
    })

    // @ts-expect-error - private property
    wrapper.vm.isClient = true
    // @ts-expect-error - private property
    wrapper.vm.isVisible = true
    await wrapper.vm.$nextTick()

    const word = wrapper.find('.m-animated-text__word-inner')
    expect(word.classes()).toContain('maz-animate-slide-down-blur')
    expect(word.attributes('style')).toContain('animation-delay: 100ms')
    expect(word.attributes('style')).toContain('animation-duration: 1000ms')
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
  })

  it('should render with custom tag', () => {
    const wrapper = mount(MazAnimatedText, {
      props: {
        text: 'Hello world',
        tag: 'p',
      },
    })

    expect(wrapper.find('p').exists()).toBe(true)
  })
})
