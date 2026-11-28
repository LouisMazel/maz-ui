import MazBottomSheet from '@components/MazBottomSheet.vue'
import { mount } from '@vue/test-utils'
import { getScaleBackgroundRatio, resolveScaleBackgroundTarget } from '@/utils/scaleBackground.ts'

function mountSheet(props: Record<string, unknown> = {}) {
  return mount(MazBottomSheet, {
    props: { modelValue: true, scaleBackground: true, ...props },
    attachTo: document.body,
  })
}

function createPage(id = 'app') {
  const page = document.createElement('div')

  page.id = id
  document.body.append(page)

  return page
}

describe('given MazBottomSheet with scaleBackground', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  describe('when the sheet is open', () => {
    it('then the page scales down from its top with rounded corners', async () => {
      const page = createPage()
      const wrapper = mountSheet()

      await wrapper.vm.$nextTick()

      expect(page.classList.contains('m-scale-background')).toBe(true)
      expect(page.style.transformOrigin).toBe('50% 0px')
      expect(page.style.transform).toContain('scale(')
      expect(page.style.transform).not.toContain('scale(1)')
      expect(page.style.borderRadius).toBe('0.75rem')
      expect(page.style.transition).toContain('--maz-motion-slow')
      expect(page.style.transition).toContain('--maz-easing-spring')

      wrapper.unmount()
    })

    it('then the previous inline styles come back when the sheet unmounts', async () => {
      const page = createPage()

      page.style.transform = 'rotate(1deg)'
      page.style.borderRadius = '2px'

      const wrapper = mountSheet()

      await wrapper.vm.$nextTick()
      wrapper.unmount()

      expect(page.style.transform).toBe('rotate(1deg)')
      expect(page.style.borderRadius).toBe('2px')
      expect(page.classList.contains('m-scale-background')).toBe(false)
    })
  })

  describe('when the sheet closes', () => {
    it('then the page scales back and the styles are removed after the transition', async () => {
      vi.useFakeTimers()

      const page = createPage()
      const wrapper = mountSheet()

      await wrapper.vm.$nextTick()
      await wrapper.setProps({ modelValue: false })

      expect(page.style.transform).toBe('')
      expect(page.style.transition).toContain('--maz-easing-in')
      expect(page.classList.contains('m-scale-background')).toBe(true)

      vi.advanceTimersByTime(500)

      expect(page.classList.contains('m-scale-background')).toBe(false)
      expect(page.style.borderRadius).toBe('')

      wrapper.unmount()
    })

    it('then reopening during the exit keeps the page scaled', async () => {
      vi.useFakeTimers()

      const page = createPage()
      const wrapper = mountSheet()

      await wrapper.vm.$nextTick()
      await wrapper.setProps({ modelValue: false })
      await wrapper.setProps({ modelValue: true })
      vi.advanceTimersByTime(500)

      expect(page.classList.contains('m-scale-background')).toBe(true)
      expect(page.style.transform).toContain('scale(')

      wrapper.unmount()

      expect(page.classList.contains('m-scale-background')).toBe(false)
    })
  })

  describe('when the sheet is dragged', () => {
    it('then the page follows the sheet without transition', async () => {
      const page = createPage()
      const wrapper = mountSheet()

      await wrapper.vm.$nextTick()

      const initial = page.style.transform
      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element
      const move = (type: string, clientY: number) => handle.dispatchEvent(new MouseEvent(type, { clientY, bubbles: true }))

      move('pointerdown', 0)
      Object.defineProperty(wrapper.find('.m-bottom-sheet').element, 'offsetHeight', { value: 400, configurable: true })
      move('pointermove', 100)
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      expect(page.style.transition).toBe('none')
      expect(page.style.transform).not.toBe(initial)

      move('pointerup', 100)
      wrapper.unmount()
    })
  })

  describe('when the option is off', () => {
    it('then the page is not touched', async () => {
      const page = createPage()
      const wrapper = mountSheet({ scaleBackground: false })

      await wrapper.vm.$nextTick()

      expect(page.classList.contains('m-scale-background')).toBe(false)
      expect(page.getAttribute('style')).toBeNull()

      wrapper.unmount()
    })
  })

  describe('when the user prefers reduced motion', () => {
    it('then the page is not touched', async () => {
      vi.stubGlobal('matchMedia', vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })))

      const page = createPage()
      const wrapper = mountSheet()

      await wrapper.vm.$nextTick()

      expect(page.classList.contains('m-scale-background')).toBe(false)

      wrapper.unmount()
    })
  })

  describe('when a selector is given', () => {
    it('then it scales that element', async () => {
      const app = createPage('app')
      const other = createPage('other')
      const wrapper = mountSheet({ scaleBackgroundTarget: '#other' })

      await wrapper.vm.$nextTick()

      expect(other.classList.contains('m-scale-background')).toBe(true)
      expect(app.classList.contains('m-scale-background')).toBe(false)

      wrapper.unmount()
    })

    it('then nothing happens when no element matches', async () => {
      const page = createPage()
      const wrapper = mountSheet({ scaleBackgroundTarget: '#missing' })

      await wrapper.vm.$nextTick()

      expect(page.classList.contains('m-scale-background')).toBe(false)

      wrapper.unmount()
    })
  })

  describe('when two sheets are open on the same page', () => {
    it('then the page is restored when the last one closes', async () => {
      const page = createPage()
      const first = mountSheet()
      const second = mountSheet()

      await first.vm.$nextTick()
      first.unmount()

      expect(page.classList.contains('m-scale-background')).toBe(true)

      second.unmount()

      expect(page.classList.contains('m-scale-background')).toBe(false)
    })
  })

  describe('when resolving the page to scale', () => {
    it('then it prefers the root of the app', () => {
      const nuxt = createPage('__nuxt')

      document.body.prepend(document.createElement('div'))

      expect(resolveScaleBackgroundTarget()).toBe(nuxt)
    })

    it('then it falls back to the first element of the body that is not an overlay', () => {
      const script = document.createElement('script')
      const overlay = document.createElement('div')
      const live = document.createElement('div')
      const page = document.createElement('main')

      overlay.className = 'm-backdrop'
      live.setAttribute('aria-live', 'polite')
      document.body.append(script, overlay, live, page)

      expect(resolveScaleBackgroundTarget()).toBe(page)
    })

    it('then it returns nothing on an empty body', () => {
      expect(resolveScaleBackgroundTarget()).toBeUndefined()
    })

    it('then the ratio keeps the page scaled by about 16px on a phone and never under 0.9', () => {
      expect(getScaleBackgroundRatio(400)).toBeCloseTo(0.96)
      expect(getScaleBackgroundRatio(100)).toBe(0.9)
      expect(getScaleBackgroundRatio(0)).toBe(0.96)
    })
  })
})
