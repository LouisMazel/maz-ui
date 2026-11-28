import { IntersectionObserverMock } from '@tests/vitest-global.setup.ts'
import { isRevealed, observeIntersection, readRevealOptions, reveal, unreveal } from '@/utils/reveal.ts'
import { REVEAL_CSS } from '@/utils/revealStyles.ts'

const created: HTMLElement[] = []

function create(html = 'Hello', tag = 'div') {
  const element = document.createElement(tag)
  element.innerHTML = html
  document.body.append(element)
  created.push(element)

  return element
}

function fire(target: Element, entry: Partial<IntersectionObserverEntry> = {}, extra: Array<{ target: Element, entry?: Partial<IntersectionObserverEntry> }> = []) {
  const callback = vi.mocked(IntersectionObserver).mock.calls.at(-1)![0]

  callback(
    [{ target, entry }, ...extra].map(item => ({
      target: item.target,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: { bottom: 100 },
      ...('entry' in item ? item.entry : {}),
    }) as IntersectionObserverEntry),
    IntersectionObserverMock as unknown as IntersectionObserver,
  )
}

const state = (element: Element) => element.getAttribute('data-maz-reveal-state')

describe('given the reveal system', () => {
  beforeEach(() => {
    vi.mocked(IntersectionObserver).mockClear()
    vi.mocked(IntersectionObserverMock.observe).mockClear()
    vi.mocked(IntersectionObserverMock.unobserve).mockClear()
    vi.mocked(IntersectionObserverMock.disconnect).mockClear()
  })

  afterEach(() => {
    for (const element of created.splice(0)) {
      unreveal(element)
      element.remove()
    }
  })

  describe('when an element is revealed', () => {
    it('then the effect is applied, the element is hidden and the stylesheet is injected once', () => {
      const element = create()
      reveal(element, { effect: 'curtain-up', delay: 200, duration: 800, blur: true })

      expect(element.getAttribute('data-maz-reveal')).toBe('curtain-up')
      expect(element.hasAttribute('data-maz-reveal-blur')).toBe(true)
      expect(element.style.getPropertyValue('--maz-reveal-delay')).toBe('200ms')
      expect(element.style.getPropertyValue('--maz-reveal-duration')).toBe('800ms')
      expect(state(element)).toBe('hidden')
      expect(isRevealed(element)).toBe(true)
      expect(document.head.querySelectorAll('style[data-maz-reveal]').length + (document.adoptedStyleSheets?.length ?? 0)).toBe(1)
    })

    it('then nothing is applied without options but the default effect', () => {
      const element = create()
      reveal(element)

      expect(element.getAttribute('data-maz-reveal')).toBe('slide-up')
      expect(element.getAttribute('data-maz-reveal-mode')).toBe('enter')
      expect(element.style.getPropertyValue('--maz-reveal-delay')).toBe('')
    })
  })

  describe('when the element enters the screen', () => {
    it('then it is shown, observed no more and settled', async () => {
      const element = create()
      reveal(element, { effect: 'fade' })
      fire(element)

      expect(state(element)).toBe('in')
      expect(IntersectionObserverMock.unobserve).toHaveBeenCalledWith(element)

      await vi.waitFor(() => expect(state(element)).toBe('done'))
    })

    it('then a second entry does nothing', () => {
      const element = create()
      reveal(element, { once: false })
      fire(element)
      element.style.setProperty('--maz-reveal-cascade', '5ms')
      fire(element)

      expect(element.style.getPropertyValue('--maz-reveal-cascade')).toBe('5ms')
    })
  })

  describe('when several elements enter together', () => {
    it('then each one waits a little more than the previous one, capped', () => {
      const elements = Array.from({ length: 9 }, () => create())

      for (const element of elements)
        reveal(element, { effect: 'fade' })

      fire(elements[0]!, {}, elements.slice(1).map(target => ({ target })))

      expect(elements.map(element => element.style.getPropertyValue('--maz-reveal-cascade'))).toEqual([
        '0ms',
        '70ms',
        '140ms',
        '210ms',
        '280ms',
        '350ms',
        '420ms',
        '420ms',
        '420ms',
      ])
    })
  })

  describe('when a threshold is given', () => {
    it('then the element is shown only above the visible ratio', () => {
      const element = create()
      reveal(element, { threshold: 0.5 })

      fire(element, { intersectionRatio: 0.2 })

      expect(state(element)).toBe('hidden')

      fire(element, { intersectionRatio: 0.6 })

      expect(state(element)).toBe('in')
    })
  })

  describe('when once is false', () => {
    it('then the element hides again when it leaves the screen and shows again', () => {
      const element = create()
      reveal(element, { once: false })

      fire(element)

      expect(state(element)).toBe('in')

      fire(element, { isIntersecting: false })

      expect(state(element)).toBe('hidden')

      fire(element)

      expect(state(element)).toBe('in')
    })
  })

  describe('when the element is above the screen', () => {
    it('then it is shown without animation', () => {
      const element = create()
      reveal(element)
      fire(element, { isIntersecting: false, boundingClientRect: { bottom: -20 } as DOMRect })

      expect(state(element)).toBe('done')
    })

    it('then it stays hidden when it is below', () => {
      const element = create()
      reveal(element)
      fire(element, { isIntersecting: false })

      expect(state(element)).toBe('hidden')
    })
  })

  describe('when the options change after the reveal', () => {
    it('then a revealed element stays shown', () => {
      const element = create()
      reveal(element, { effect: 'fade' })
      fire(element)
      reveal(element, { effect: 'scale' })

      expect(element.getAttribute('data-maz-reveal')).toBe('scale')
      expect(state(element)).toBe('done')
    })

    it('then the same options do nothing', () => {
      const element = create()
      reveal(element, { effect: 'fade' })
      reveal(element, { effect: 'fade' })

      expect(IntersectionObserverMock.observe).toHaveBeenCalledTimes(1)
    })

    it('then a blur and a stagger can be removed', () => {
      const element = create('<span>a</span><span>b</span>')
      reveal(element, { blur: true, stagger: 50 })
      reveal(element, { blur: false })

      expect(element.hasAttribute('data-maz-reveal-blur')).toBe(false)
      expect(element.hasAttribute('data-maz-reveal-items')).toBe(false)
    })
  })

  describe('when a stagger is given', () => {
    it('then the children are the items with an index', () => {
      const element = create('<p>a</p><p>b</p><p>c</p>')
      reveal(element, { effect: 'slide-up', stagger: 80 })

      expect(element.hasAttribute('data-maz-reveal-items')).toBe(true)
      expect(element.style.getPropertyValue('--maz-reveal-stagger')).toBe('80ms')
      expect([...element.children].map(child => child.getAttribute('data-maz-reveal-item'))).toEqual(['', '', ''])
      expect((element.children[2] as HTMLElement).style.getPropertyValue('--maz-i')).toBe('2')
    })

    it('then the items given by the markup are kept', () => {
      const element = create('<p><span data-maz-reveal-item>a</span></p><p>b</p>')
      reveal(element, { effect: 'slide-up' })

      expect(element.querySelectorAll('[data-maz-reveal-item]')).toHaveLength(1)
    })
  })

  describe('when the effect is words', () => {
    it('then each word is an item and the text stays readable', async () => {
      const element = create('Hello <em>big</em> world', 'p')
      reveal(element, { effect: 'words' })

      expect(element.querySelectorAll('.m-reveal-word')).toHaveLength(3)
      expect(element.querySelector('.m-reveal-sr')?.textContent).toBe('Hello big world')
      expect(element.querySelector('[data-maz-reveal-split]')?.getAttribute('aria-hidden')).toBe('true')
      expect(element.style.getPropertyValue('--maz-reveal-stagger')).toBe('60ms')

      fire(element)
      await vi.waitFor(() => expect(state(element)).toBe('done'))

      expect(element.innerHTML).toBe('Hello <em>big</em> world')
    })
  })

  describe('when the effect is lines with line breaks', () => {
    it('then each part is a line', () => {
      const element = create('First <em>line</em><br>Second line', 'p')
      reveal(element, { effect: 'lines' })

      const lines = element.querySelectorAll('.m-reveal-line > [data-maz-reveal-item]')

      expect(lines).toHaveLength(2)
      expect(lines[0]?.innerHTML).toBe('First <em>line</em>')
      expect(element.style.getPropertyValue('--maz-reveal-stagger')).toBe('100ms')
    })
  })

  describe('when the effect is lines without line breaks', () => {
    it('then the lines are the ones rendered', () => {
      const element = create('one two three four', 'p')
      const tops = [0, 0, 20, 20]
      let index = 0
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({ top: tops[index++ % 4] } as DOMRect))
      reveal(element, { effect: 'lines' })

      const lines = [...element.querySelectorAll('.m-reveal-line > [data-maz-reveal-item]')].map(line => line.textContent)

      expect(lines).toEqual(['one two', 'three four'])
      vi.restoreAllMocks()
    })

    it('then it splits again when the markup of the element was replaced', () => {
      const element = create('<span>a</span><br><span>b</span>', 'p')
      reveal(element, { effect: 'lines' })
      element.innerHTML = '<span>a</span><br><span>b</span>'
      reveal(element, { effect: 'lines' })

      expect(element.querySelectorAll('.m-reveal-line')).toHaveLength(2)
    })

    it('then it splits again when the width changes and once is false', () => {
      const observe = vi.fn()
      let resize: () => void = () => {}
      class ResizeObserverStub {
        observe = observe
        disconnect = vi.fn()
        constructor(callback: () => void) {
          resize = callback
        }
      }
      vi.stubGlobal('ResizeObserver', ResizeObserverStub)
      const element = create('a<br>b', 'p')
      reveal(element, { effect: 'lines', once: false })
      const first = element.querySelector('.m-reveal-line')
      Object.defineProperty(element, 'clientWidth', { value: 300, configurable: true })
      resize()

      expect(observe).toHaveBeenCalledWith(element)
      expect(element.querySelector('.m-reveal-line')).not.toBe(first)
      Reflect.deleteProperty(globalThis, 'ResizeObserver')
    })
  })

  describe('when the mode is scroll', () => {
    it('then the scroll timeline is used when supported and nothing is observed', () => {
      const supports = vi.spyOn(CSS, 'supports').mockReturnValue(true)
      const element = create()
      reveal(element, { mode: 'scroll' })

      expect(element.getAttribute('data-maz-reveal-mode')).toBe('scroll')
      expect(state(element)).toBeNull()
      expect(IntersectionObserverMock.observe).not.toHaveBeenCalled()
      supports.mockRestore()
    })

    it('then it falls back to the enter mode when it is not supported', () => {
      const supports = vi.spyOn(CSS, 'supports').mockReturnValue(false)
      const element = create()
      reveal(element, { mode: 'scroll' })

      expect(element.getAttribute('data-maz-reveal-mode')).toBe('enter')
      expect(state(element)).toBe('hidden')
      supports.mockRestore()
    })
  })

  describe('when the reveal is removed', () => {
    it('then the attributes, the variables and the observer are removed', () => {
      const element = create('<p>a</p>')
      reveal(element, { delay: 10, stagger: 10, blur: true })
      unreveal(element)

      expect(element.getAttributeNames().filter(name => name.startsWith('data-maz-reveal'))).toEqual([])
      expect(element.style.getPropertyValue('--maz-reveal-delay')).toBe('')
      expect(isRevealed(element)).toBe(false)
      expect(IntersectionObserverMock.unobserve).toHaveBeenCalledWith(element)
    })

    it('then the original markup of a split text is restored on demand', () => {
      const element = create('Hello world', 'p')
      reveal(element, { effect: 'words' })
      unreveal(element, { restore: true })

      expect(element.innerHTML).toBe('Hello world')
    })

    it('then removing an element that is not revealed does nothing', () => {
      expect(() => unreveal(create())).not.toThrow()
    })
  })

  describe('when the options are read from the attributes', () => {
    it('then each attribute gives its option', () => {
      const element = create()
      element.setAttribute('data-maz-reveal', 'iris')
      element.setAttribute('data-maz-reveal-delay', '200')
      element.setAttribute('data-maz-reveal-duration', '900')
      element.setAttribute('data-maz-reveal-stagger', '40')
      element.setAttribute('data-maz-reveal-threshold', '0.3')
      element.setAttribute('data-maz-reveal-once', 'false')
      element.setAttribute('data-maz-reveal-blur', '')
      element.setAttribute('data-maz-reveal-mode', 'scroll')

      expect(readRevealOptions(element)).toEqual({
        effect: 'iris',
        delay: 200,
        duration: 900,
        stagger: 40,
        threshold: 0.3,
        once: false,
        blur: true,
        mode: 'scroll',
      })
    })

    it('then the missing attributes give nothing', () => {
      expect(readRevealOptions(create())).toEqual({
        effect: undefined,
        delay: undefined,
        duration: undefined,
        stagger: undefined,
        threshold: undefined,
        once: undefined,
        blur: undefined,
        mode: undefined,
      })
    })
  })

  describe('when the shared observer is used', () => {
    it('then one observer serves several elements and is disconnected with the last one', () => {
      const [first, second] = [create(), create()]
      const stopFirst = observeIntersection(first, vi.fn())
      const stopSecond = observeIntersection(second, vi.fn())

      expect(IntersectionObserver).toHaveBeenCalledTimes(1)

      stopFirst()
      stopFirst()

      expect(IntersectionObserverMock.disconnect).not.toHaveBeenCalled()

      stopSecond()

      expect(IntersectionObserverMock.disconnect).toHaveBeenCalledTimes(1)
    })

    it('then two handlers of the same element are both called and stopping one keeps the other', () => {
      const element = create()
      const [first, second] = [vi.fn(), vi.fn()]
      const stopFirst = observeIntersection(element, first)
      const stopSecond = observeIntersection(element, second)

      fire(element)

      expect(first).toHaveBeenCalledTimes(1)
      expect(second).toHaveBeenCalledTimes(1)

      stopFirst()
      fire(element)

      expect(first).toHaveBeenCalledTimes(1)
      expect(second).toHaveBeenCalledTimes(2)
      expect(IntersectionObserverMock.disconnect).not.toHaveBeenCalled()

      stopSecond()
    })

    it('then each threshold has its own observer', () => {
      const element = create()
      const stops = [observeIntersection(element, vi.fn()), observeIntersection(create(), vi.fn(), { threshold: 0.5 })]

      expect(IntersectionObserver).toHaveBeenCalledTimes(2)
      expect(vi.mocked(IntersectionObserver).mock.calls[1]![1]).toEqual({ threshold: [0, 0.5] })

      for (const stop of stops) stop()
    })
  })

  describe('when the stylesheet is read', () => {
    it('then nothing is hidden without the state attribute and the motion is reduced on demand', () => {
      expect(REVEAL_CSS).toContain('[data-maz-reveal-state="hidden"]')
      expect(REVEAL_CSS).toContain('prefers-reduced-motion:reduce')
      expect(REVEAL_CSS).toContain('html.m-motion-reduced')
      expect(REVEAL_CSS).not.toContain('maz:')
      expect(REVEAL_CSS).toContain('animation-range:var(--maz-reveal-range,entry 20% cover 30%)')
    })
  })
})
