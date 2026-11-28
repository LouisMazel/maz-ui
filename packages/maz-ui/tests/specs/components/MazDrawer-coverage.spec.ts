import type { MazDrawerProps } from '@components/MazDrawer.vue'
import MazDrawer from '@components/MazDrawer.vue'
import { flushPromises, mount } from '@vue/test-utils'

function firePointer(element: Element, type: string, { x = 0, y = 0, time = 0 }: { x?: number, y?: number, time?: number } = {}) {
  const event = new MouseEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true })

  Object.defineProperty(event, 'timeStamp', { value: time })
  Object.defineProperty(event, 'pointerType', { value: 'touch' })
  element.dispatchEvent(event)
}

function mockTranslate(value: string) {
  const original = globalThis.getComputedStyle.bind(globalThis)

  vi.spyOn(globalThis, 'getComputedStyle').mockImplementation((element: Element, pseudo?: string | null) => {
    const real = original(element, pseudo)

    return new Proxy(real, {
      get: (target, key) => key === 'translate' ? value : Reflect.get(target, key, target) as unknown,
    })
  })
}

function mountDrawer(props: Partial<MazDrawerProps> & Record<string, unknown> = {}) {
  return mount(MazDrawer, { props: { modelValue: true, ...props }, attachTo: document.body })
}

function translateOf(wrapper: ReturnType<typeof mountDrawer>) {
  return (wrapper.find('.m-drawer-content-wrap').element as HTMLElement).style.translate
}

describe('given MazDrawer running a transition', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  describe('when the drag starts from a translated horizontal drawer', () => {
    it('then it continues from the current position', async () => {
      mockTranslate('30px 0px')

      const wrapper = mountDrawer({ side: 'end' })
      const content = wrapper.find('.m-drawer-content-wrap').element

      firePointer(content, 'pointerdown')
      firePointer(content, 'pointermove', { x: 20 })
      await wrapper.vm.$nextTick()

      expect(translateOf(wrapper)).toBe('50px')

      firePointer(content, 'pointerup', { x: 20 })
      wrapper.unmount()
    })
  })

  describe('when the drag starts from a translated vertical drawer', () => {
    it('then it continues from the current position', async () => {
      mockTranslate('0px -30px')

      const wrapper = mountDrawer({ side: 'top' })
      const content = wrapper.find('.m-drawer-content-wrap').element

      firePointer(content, 'pointerdown')
      firePointer(content, 'pointermove', { y: -20 })
      await wrapper.vm.$nextTick()

      expect(translateOf(wrapper)).toBe('0px -50px')

      firePointer(content, 'pointerup', { y: -20 })
      wrapper.unmount()
    })
  })

  describe('when the close of a swipe is refused', () => {
    it('then the drawer springs back to its position', async () => {
      const wrapper = mountDrawer({ side: 'end', beforeClose: () => false })
      const content = wrapper.find('.m-drawer-content-wrap').element

      firePointer(content, 'pointerdown', { time: 0 })
      firePointer(content, 'pointermove', { x: 200, time: 20 })
      firePointer(content, 'pointerup', { x: 200, time: 30 })
      await flushPromises()

      expect(translateOf(wrapper)).toBeFalsy()
      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(true)

      wrapper.unmount()
    })
  })
})
