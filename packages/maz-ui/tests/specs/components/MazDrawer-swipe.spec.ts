import type { MazDrawerProps } from '@components/MazDrawer.vue'
import MazDrawer from '@components/MazDrawer.vue'
import { mount } from '@vue/test-utils'

interface PointerInit {
  x?: number
  y?: number
  time?: number
  pointerType?: string
}

function firePointer(element: Element, type: string, { x = 0, y = 0, time = 0, pointerType = 'touch' }: PointerInit = {}) {
  const event = new MouseEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true })

  Object.defineProperty(event, 'timeStamp', { value: time })
  Object.defineProperty(event, 'pointerType', { value: pointerType })
  element.dispatchEvent(event)
}

function mountDrawer(props: Partial<MazDrawerProps> & Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(MazDrawer, {
    props: { modelValue: true, ...props },
    slots,
    attachTo: document.body,
  })
}

function forceDirection(direction: 'rtl' | 'ltr') {
  const original = globalThis.getComputedStyle

  vi.spyOn(globalThis, 'getComputedStyle').mockImplementation((element: Element, pseudo?: string | null) => {
    const real = original(element, pseudo)

    return new Proxy(real, {
      get: (target, key) => key === 'direction' ? direction : Reflect.get(target, key, target) as unknown,
    })
  })
}

function translateOf(wrapper: ReturnType<typeof mountDrawer>) {
  return (wrapper.find('.m-drawer-content-wrap').element as HTMLElement).style.translate
}

describe('given MazDrawer with swipe to close', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  describe('when the drawer is dragged towards its side in LTR', () => {
    it.each([
      ['end', { x: 60, y: 0 }, '60px'],
      ['start', { x: -60, y: 0 }, '-60px'],
      ['top', { x: 0, y: -80 }, '0px -80px'],
      ['bottom', { x: 0, y: 80 }, '0px 80px'],
    ] as const)('then the %s drawer follows the pointer', async (side, move, expected) => {
      const wrapper = mountDrawer({ side })
      const content = wrapper.find('.m-drawer-content-wrap').element

      firePointer(content, 'pointerdown')
      firePointer(content, 'pointermove', move)
      await wrapper.vm.$nextTick()

      expect(translateOf(wrapper)).toBe(expected)
      expect(wrapper.find('.m-drawer-content-wrap').classes()).toContain('--dragging')

      firePointer(content, 'pointerup', move)
      wrapper.unmount()
    })
  })

  describe('when the drawer is dragged away from its side', () => {
    it.each([
      ['end', { x: -60, y: 0 }],
      ['start', { x: 60, y: 0 }],
      ['top', { x: 0, y: 80 }],
      ['bottom', { x: 0, y: -80 }],
    ] as const)('then the %s drawer does not move', async (side, move) => {
      const wrapper = mountDrawer({ side })
      const content = wrapper.find('.m-drawer-content-wrap').element

      firePointer(content, 'pointerdown')
      firePointer(content, 'pointermove', move)
      await wrapper.vm.$nextTick()

      expect(translateOf(wrapper)).toBeFalsy()

      firePointer(content, 'pointerup', move)
      wrapper.unmount()
    })
  })

  describe('when the page is in RTL', () => {
    it('then the start drawer is on the right and follows a swipe to the right', async () => {
      forceDirection('rtl')

      const wrapper = mountDrawer({ side: 'start' })
      const content = wrapper.find('.m-drawer-content-wrap').element

      firePointer(content, 'pointerdown')
      firePointer(content, 'pointermove', { x: 60 })
      await wrapper.vm.$nextTick()

      expect(translateOf(wrapper)).toBe('60px')

      firePointer(content, 'pointerup', { x: 60 })
      wrapper.unmount()
    })

    it('then the end drawer is on the left and follows a swipe to the left', async () => {
      forceDirection('rtl')

      const wrapper = mountDrawer({ side: 'end' })
      const content = wrapper.find('.m-drawer-content-wrap').element

      firePointer(content, 'pointerdown')
      firePointer(content, 'pointermove', { x: -60 })
      await wrapper.vm.$nextTick()

      expect(translateOf(wrapper)).toBe('-60px')

      firePointer(content, 'pointerup', { x: -60 })
      wrapper.unmount()
    })
  })

  describe('when the drawer is released past a quarter of its size', () => {
    it('then it closes', async () => {
      const wrapper = mountDrawer()
      const content = wrapper.find('.m-drawer-content-wrap').element

      Object.defineProperty(content, 'offsetWidth', { value: 400, configurable: true })
      firePointer(content, 'pointerdown')
      firePointer(content, 'pointermove', { x: 150, time: 500 })
      firePointer(content, 'pointerup', { x: 150, time: 900 })
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(false)

      wrapper.unmount()
    })
  })

  describe('when the drawer is released slowly before a quarter of its size', () => {
    it('then it springs back', async () => {
      const wrapper = mountDrawer()
      const content = wrapper.find('.m-drawer-content-wrap').element

      Object.defineProperty(content, 'offsetWidth', { value: 400, configurable: true })
      firePointer(content, 'pointerdown')
      firePointer(content, 'pointermove', { x: 60, time: 500 })
      firePointer(content, 'pointerup', { x: 60, time: 900 })
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(true)
      expect(translateOf(wrapper)).toBeFalsy()

      wrapper.unmount()
    })
  })

  describe('when the drawer is flicked before a quarter of its size', () => {
    it('then it closes', async () => {
      const wrapper = mountDrawer()
      const content = wrapper.find('.m-drawer-content-wrap').element

      Object.defineProperty(content, 'offsetWidth', { value: 400, configurable: true })
      firePointer(content, 'pointerdown', { time: 0 })
      firePointer(content, 'pointermove', { x: 40, time: 40 })
      firePointer(content, 'pointerup', { x: 60, time: 60 })
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(false)

      wrapper.unmount()
    })
  })

  describe('when the drawer is persistent', () => {
    it('then a flick does not close it', async () => {
      const wrapper = mountDrawer({ persistent: true })
      const content = wrapper.find('.m-drawer-content-wrap').element

      firePointer(content, 'pointerdown', { time: 0 })
      firePointer(content, 'pointermove', { x: 100, time: 40 })
      firePointer(content, 'pointerup', { x: 120, time: 60 })
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(true)
      expect(translateOf(wrapper)).toBeFalsy()

      wrapper.unmount()
    })
  })

  describe('when before-close keeps the drawer open', () => {
    it('then it springs back after the swipe', async () => {
      const wrapper = mountDrawer({ beforeClose: () => false })
      const content = wrapper.find('.m-drawer-content-wrap').element

      firePointer(content, 'pointerdown', { time: 0 })
      firePointer(content, 'pointermove', { x: 100, time: 40 })
      firePointer(content, 'pointerup', { x: 120, time: 60 })
      await new Promise(resolve => setTimeout(resolve))
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(true)
      expect(translateOf(wrapper)).toBeFalsy()

      wrapper.unmount()
    })
  })

  describe('when swipeToClose is false', () => {
    it('then the drawer does not move', async () => {
      const wrapper = mountDrawer({ swipeToClose: false })
      const content = wrapper.find('.m-drawer-content-wrap').element

      firePointer(content, 'pointerdown')
      firePointer(content, 'pointermove', { x: 100 })
      await wrapper.vm.$nextTick()

      expect(translateOf(wrapper)).toBeFalsy()

      wrapper.unmount()
    })
  })

  describe('when a mouse drags the drawer', () => {
    it('then only the header starts the drag', async () => {
      const wrapper = mountDrawer({}, { default: '<p class="text">Text</p>' })

      const text = wrapper.find('.text').element

      firePointer(text, 'pointerdown', { pointerType: 'mouse' })
      firePointer(text, 'pointermove', { x: 100, pointerType: 'mouse' })
      await wrapper.vm.$nextTick()

      expect(translateOf(wrapper)).toBeFalsy()

      firePointer(text, 'pointerup', { x: 100, pointerType: 'mouse' })

      const header = wrapper.find('.m-drawer-header').element

      firePointer(header, 'pointerdown', { pointerType: 'mouse' })
      firePointer(header, 'pointermove', { x: 100, pointerType: 'mouse' })
      await wrapper.vm.$nextTick()

      expect(translateOf(wrapper)).toBe('100px')

      firePointer(header, 'pointerup', { x: 100, pointerType: 'mouse' })
      wrapper.unmount()
    })
  })

  describe('when the body of a bottom drawer can still scroll up', () => {
    it('then a downward swipe belongs to the scroll', async () => {
      const wrapper = mountDrawer({ side: 'bottom' }, { default: '<div class="text">Long</div>' })
      const body = wrapper.find('.m-drawer-body').element

      body.setAttribute('style', 'overflow-y: auto')
      Object.defineProperties(body, {
        scrollHeight: { value: 800 },
        clientHeight: { value: 200 },
        scrollTop: { value: 100, configurable: true },
      })

      const text = wrapper.find('.text').element

      firePointer(text, 'pointerdown')
      firePointer(text, 'pointermove', { y: 80 })
      await wrapper.vm.$nextTick()

      expect(translateOf(wrapper)).toBeFalsy()

      firePointer(text, 'pointerup', { y: 80 })

      Object.defineProperty(body, 'scrollTop', { value: 0 })
      firePointer(text, 'pointerdown')
      firePointer(text, 'pointermove', { y: 80 })
      await wrapper.vm.$nextTick()

      expect(translateOf(wrapper)).toBe('0px 80px')

      firePointer(text, 'pointerup', { y: 80 })
      wrapper.unmount()
    })
  })
})
