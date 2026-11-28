import MazTour from '@components/MazTour.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { ref } from 'vue'

const reduced = ref(false)

vi.mock('@maz-ui/translations/composables/useTranslations', async () => ({
  useTranslations: (await import('../../helpers/translations.ts')).useEnglishTranslations,
}))

vi.mock('@composables/useReducedMotion', () => ({
  useReducedMotion: () => ({ shouldReduceMotion: reduced }),
}))

function box(element: HTMLElement, rect: Partial<DOMRect>) {
  element.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON: () => ({}), ...rect }) as DOMRect
}

function card() {
  return document.body.querySelector<HTMLElement>('.m-tour__card')
}

function hole() {
  return document.body.querySelector<HTMLElement>('.m-tour__hole')
}

function buttons() {
  return [...card()!.querySelectorAll('button')].map(button => button.textContent!.trim())
}

function press(key: string, target: EventTarget = globalThis) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })

  target.dispatchEvent(event)

  return event
}

const steps = [
  { title: 'Welcome', description: 'Start here' },
  { target: '#one', title: 'First', description: 'The first target', placement: 'bottom' as const },
  { target: () => document.querySelector<HTMLElement>('#two'), title: 'Second' },
]

describe('given a MazTour', () => {
  let one: HTMLElement
  let two: HTMLElement

  beforeEach(() => {
    reduced.value = false
    Element.prototype.scrollIntoView = vi.fn()
    document.body.innerHTML = ''
    one = document.createElement('button')
    one.id = 'one'
    two = document.createElement('button')
    two.id = 'two'
    box(one, { left: 100, top: 100, right: 200, bottom: 140, width: 100, height: 40 })
    box(two, { left: 300, top: 400, right: 400, bottom: 440, width: 100, height: 40 })
    document.body.append(one, two)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  async function mountTour(props: Record<string, unknown> = {}) {
    const wrapper = mount(MazTour, { props: { steps, open: true, ...props }, attachTo: document.body })

    await flushPromises()

    return wrapper
  }

  describe('when it is closed', () => {
    it('then it renders nothing', async () => {
      const wrapper = await mountTour({ open: false })

      expect(card()).toBeNull()

      wrapper.unmount()
    })
  })

  describe('when it opens on the first step', () => {
    it('then the card is a labelled dialog with the title, the text and the counter', async () => {
      const wrapper = await mountTour()

      expect(card()!.getAttribute('role')).toBe('dialog')
      expect(card()!.getAttribute('aria-modal')).toBe('true')
      expect(card()!.textContent).toContain('Welcome')
      expect(card()!.textContent).toContain('Start here')
      expect(card()!.querySelector('[aria-live="polite"]')!.textContent).toBe('Step 1 of 3')
      expect(buttons()).toEqual(['Skip', 'Next'])

      wrapper.unmount()
    })

    it('then a step without target collapses the hole', async () => {
      const wrapper = await mountTour()

      expect(hole()!.style.width).toBe('0px')

      wrapper.unmount()
    })

    it('then the primary button has the focus', async () => {
      const wrapper = await mountTour()

      expect(card()!.contains(document.activeElement)).toBe(true)

      wrapper.unmount()
    })
  })

  describe('when a step has a target', () => {
    it('then the hole surrounds it with the padding and the radius', async () => {
      const wrapper = await mountTour({ step: 1, padding: 10, radius: 20 })

      expect(hole()!.style.width).toBe('120px')
      expect(hole()!.style.height).toBe('60px')
      expect(hole()!.style.transform).toBe('translate(90px, 90px)')
      expect(hole()!.style.borderRadius).toBe('20px')

      wrapper.unmount()
    })

    it('then the target is scrolled into view when it is out of the viewport', async () => {
      box(one, { left: 100, top: -500, right: 200, bottom: -460, width: 100, height: 40 })
      const wrapper = await mountTour({ step: 1 })

      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ block: 'center', inline: 'center', behavior: 'auto' })

      wrapper.unmount()
    })

    it('then it does not scroll with scroll-into-view disabled', async () => {
      box(one, { left: 100, top: -500, right: 200, bottom: -460, width: 100, height: 40 })
      const wrapper = await mountTour({ step: 1, scrollIntoView: false })

      expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled()

      wrapper.unmount()
    })

    it('then a target that does not exist gives a centered card', async () => {
      const wrapper = await mountTour({ steps: [{ target: '#missing', title: 'Lost' }] })

      expect(hole()!.style.width).toBe('0px')
      expect(card()!.textContent).toContain('Lost')

      wrapper.unmount()
    })

    it('then an element target is accepted', async () => {
      const wrapper = await mountTour({ steps: [{ target: two, title: 'Element' }] })

      expect(hole()!.style.width).toBe('116px')

      wrapper.unmount()
    })
  })

  describe('when the user goes through the steps', () => {
    it('then Next goes forward, emits change and updates the model', async () => {
      const wrapper = await mountTour()

      await card()!.querySelectorAll('button')[1]!.click()
      await flushPromises()

      expect(wrapper.emitted('update:step')![0]).toEqual([1])
      expect(wrapper.emitted('change')![0]).toEqual([1])

      wrapper.unmount()
    })

    it('then the hole glides between two targets', async () => {
      const wrapper = await mountTour({ step: 1 })

      await wrapper.setProps({ step: 2 })
      await flushPromises()

      expect(document.body.querySelector('.m-tour')!.classList.contains('--glide')).toBe(true)
      expect(hole()!.style.transform).toBe('translate(292px, 392px)')

      wrapper.unmount()
    })

    it('then the hole does not glide with reduced motion', async () => {
      reduced.value = true
      const wrapper = await mountTour({ step: 1 })

      await wrapper.setProps({ step: 2 })
      await flushPromises()

      expect(document.body.querySelector('.m-tour')!.classList.contains('--glide')).toBe(false)

      wrapper.unmount()
    })

    it('then the middle steps have Previous and the last one has Done', async () => {
      const wrapper = await mountTour({ step: 1 })

      expect(buttons()).toEqual(['Skip', 'Previous', 'Next'])

      await wrapper.setProps({ step: 2 })
      await flushPromises()

      expect(buttons()).toEqual(['Previous', 'Done'])

      wrapper.unmount()
    })

    it('then Previous goes back', async () => {
      const wrapper = await mountTour({ step: 1 })

      await card()!.querySelectorAll('button')[1]!.click()

      expect(wrapper.emitted('update:step')![0]).toEqual([0])

      wrapper.unmount()
    })

    it('then Done finishes the tour and closes it', async () => {
      const wrapper = await mountTour({ step: 2 })

      await card()!.querySelectorAll('button')[1]!.click()

      expect(wrapper.emitted('finish')).toHaveLength(1)
      expect(wrapper.emitted('update:open')![0]).toEqual([false])

      wrapper.unmount()
    })

    it('then Skip skips the tour and closes it', async () => {
      const wrapper = await mountTour()

      await card()!.querySelectorAll('button')[0]!.click()

      expect(wrapper.emitted('skip')).toHaveLength(1)
      expect(wrapper.emitted('update:open')![0]).toEqual([false])

      wrapper.unmount()
    })

    it('then the focus goes back to the card when the focused button disappears', async () => {
      const wrapper = await mountTour({ step: 1 })

      ;(card()!.querySelectorAll('button')[1] as HTMLElement).focus()
      await wrapper.setProps({ step: 0 })
      await flushPromises()

      expect(card()!.contains(document.activeElement)).toBe(true)

      wrapper.unmount()
    })
  })

  describe('when the user uses the keyboard', () => {
    it('then ArrowRight goes forward and ArrowLeft goes back', async () => {
      const wrapper = await mountTour({ step: 1 })

      press('ArrowRight')
      press('ArrowLeft')

      expect(wrapper.emitted('update:step')).toEqual([[2], [1]])

      wrapper.unmount()
    })

    it('then the arrows are swapped in RTL', async () => {
      document.documentElement.dir = 'rtl'
      const wrapper = await mountTour({ step: 1 })

      press('ArrowLeft')

      expect(wrapper.emitted('update:step')![0]).toEqual([2])

      document.documentElement.dir = ''
      wrapper.unmount()
    })

    it('then Escape skips the tour', async () => {
      const wrapper = await mountTour()

      const event = press('Escape')

      expect(event.defaultPrevented).toBe(true)
      expect(wrapper.emitted('skip')).toHaveLength(1)

      wrapper.unmount()
    })

    it('then Escape does nothing with close-on-escape disabled', async () => {
      const wrapper = await mountTour({ closeOnEscape: false })

      press('Escape')

      expect(wrapper.emitted('skip')).toBeUndefined()

      wrapper.unmount()
    })

    it('then Tab stays inside the card', async () => {
      const wrapper = await mountTour()
      const last = card()!.querySelectorAll('button')[1]!

      last.focus()

      const event = press('Tab', document)

      expect(event.defaultPrevented).toBe(true)
      expect(card()!.contains(document.activeElement)).toBe(true)

      wrapper.unmount()
    })
  })

  describe('when the page scrolls or resizes', () => {
    it('then the hole follows the target without gliding', async () => {
      const wrapper = await mountTour({ step: 1 })
      box(one, { left: 150, top: 120, right: 250, bottom: 160, width: 100, height: 40 })
      globalThis.dispatchEvent(new Event('resize'))
      await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))
      await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))

      expect(hole()!.style.transform).toBe('translate(142px, 112px)')

      wrapper.unmount()
    })
  })

  describe('when the tour closes', () => {
    it('then the focus goes back to the previous element', async () => {
      const opener = document.createElement('button')

      document.body.append(opener)
      opener.focus()

      const wrapper = await mountTour({ open: false, step: 1 })

      await wrapper.setProps({ open: true })
      await flushPromises()
      await wrapper.setProps({ open: false })
      await flushPromises()

      expect(document.activeElement).toBe(opener)

      wrapper.unmount()
    })
  })

  describe('when the card is placed around the target', () => {
    beforeEach(() => {
      Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 1000 })
      Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 800 })
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, get: () => 320 })
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, get: () => 150 })
      box(one, { left: 400, top: 400, right: 500, bottom: 440, width: 100, height: 40 })
    })

    afterEach(() => {
      delete (document.documentElement as any).clientWidth
      delete (document.documentElement as any).clientHeight
      delete (HTMLElement.prototype as any).offsetWidth
      delete (HTMLElement.prototype as any).offsetHeight
    })

    async function placed(placement: string) {
      const wrapper = await mountTour({ steps: [{ target: '#one', title: 'T', placement }] })
      const match = /translate\((-?[\d.]+)px, (-?[\d.]+)px\)/.exec(card()!.style.transform)!
      const position = { x: Number(match[1]), y: Number(match[2]) }

      wrapper.unmount()

      return position
    }

    it('then bottom puts it under the hole', async () => {
      expect((await placed('bottom')).y).toBeGreaterThan(440)
    })

    it('then top puts it above the hole', async () => {
      expect((await placed('top')).y).toBeLessThan(400)
    })

    it('then end puts it after the hole and start before it', async () => {
      expect((await placed('end')).x).toBeGreaterThan(500)
      expect((await placed('start')).x).toBeLessThan(400)
    })

    it('then start follows the direction in RTL', async () => {
      document.documentElement.dir = 'rtl'

      expect((await placed('start')).x).toBeGreaterThan(500)

      document.documentElement.dir = ''
    })

    it('then it flips to the opposite side when there is no room', async () => {
      box(one, { left: 400, top: 20, right: 500, bottom: 60, width: 100, height: 40 })

      expect((await placed('top')).y).toBeGreaterThan(60)
    })

    it('then auto picks the side with the most room when none fits', async () => {
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, get: () => 790 })
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, get: () => 990 })

      const position = await placed('auto')

      expect(position.x).toBeGreaterThanOrEqual(12)
    })
  })

  describe('when it uses slots', () => {
    it('then the title and description slots replace the texts', async () => {
      const wrapper = mount(MazTour, {
        props: { steps, open: true },
        slots: {
          title: '<b class="custom-title">Custom</b>',
          description: '<i class="custom-description">Text</i>',
        },
        attachTo: document.body,
      })

      await flushPromises()

      expect(card()!.querySelector('.custom-title')).not.toBeNull()
      expect(card()!.querySelector('.custom-description')).not.toBeNull()

      wrapper.unmount()
    })
  })

  describe('when the exposed methods are called', () => {
    it('then goTo clamps the index', async () => {
      const wrapper = await mountTour()

      ;(wrapper.vm as any).goTo(10)

      expect(wrapper.emitted('update:step')![0]).toEqual([2])

      wrapper.unmount()
    })

    it('then next, previous, skip and finish work', async () => {
      const wrapper = await mountTour({ step: 1 })

      ;(wrapper.vm as any).next()
      ;(wrapper.vm as any).previous()
      ;(wrapper.vm as any).skip()
      ;(wrapper.vm as any).finish()

      expect(wrapper.emitted('skip')).toHaveLength(1)
      expect(wrapper.emitted('finish')).toHaveLength(1)

      wrapper.unmount()
    })
  })

  describe('when it has no step', () => {
    it('then it renders nothing', async () => {
      const wrapper = await mountTour({ steps: [] })

      expect(card()).toBeNull()

      wrapper.unmount()
    })
  })
})
