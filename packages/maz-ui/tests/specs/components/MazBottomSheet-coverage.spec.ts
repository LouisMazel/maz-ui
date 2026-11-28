import MazBottomSheet from '@components/MazBottomSheet.vue'
import { flushPromises, mount } from '@vue/test-utils'

function firePointer(element: Element, type: string, { y = 0, time = 0 }: { y?: number, time?: number } = {}) {
  const event = new MouseEvent(type, { clientY: y, bubbles: true, cancelable: true })

  Object.defineProperty(event, 'timeStamp', { value: time })
  Object.defineProperty(event, 'pointerType', { value: 'touch' })
  element.dispatchEvent(event)
}

function mountSheet(props: Record<string, unknown> = {}) {
  return mount(MazBottomSheet, { props: { modelValue: true, ...props }, attachTo: document.body })
}

describe('given MazBottomSheet branches', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  describe('when the root font size is known', () => {
    it('then the rem snap points follow it', async () => {
      const original = globalThis.getComputedStyle.bind(globalThis)

      vi.spyOn(globalThis, 'getComputedStyle').mockImplementation((element: Element, pseudo?: string | null) => {
        const real = original(element, pseudo)

        return new Proxy(real, {
          get: (target, key) => key === 'fontSize' ? '20px' : Reflect.get(target, key, target) as unknown,
        })
      })

      const wrapper = mountSheet({ snapPoints: ['10rem', '20rem'] })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-bottom-sheet').attributes('style')).toContain('height: 400px')

      wrapper.unmount()
    })
  })

  describe('when the snap prop is cleared', () => {
    it('then the active snap point is kept', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1], snap: 1 })
      await wrapper.vm.$nextTick()

      await wrapper.setProps({ snap: undefined })

      expect(wrapper.find('.m-bottom-sheet').attributes('style') ?? '').not.toContain('translateY')

      wrapper.unmount()
    })
  })

  describe('when the close of a swipe is refused', () => {
    it('then the sheet springs back to its rest position', async () => {
      const wrapper = mountSheet({ beforeClose: () => false })
      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element

      firePointer(handle, 'pointerdown', { y: 0, time: 0 })
      firePointer(handle, 'pointermove', { y: 150, time: 20 })
      firePointer(handle, 'pointerup', { y: 150, time: 30 })
      await flushPromises()

      expect(wrapper.find('.m-bottom-sheet').attributes('style') ?? '').not.toContain('translateY')
      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(true)

      wrapper.unmount()
    })

    it('then a sheet with snap points springs back to the active snap point', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1], beforeClose: () => false })
      await wrapper.vm.$nextTick()
      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element

      firePointer(handle, 'pointerdown', { y: 0, time: 0 })
      firePointer(handle, 'pointermove', { y: 600, time: 20 })
      firePointer(handle, 'pointerup', { y: 600, time: 30 })
      await flushPromises()

      expect(wrapper.find('.m-bottom-sheet').attributes('style')).toContain(`translateY(${window.innerHeight / 2}px)`)

      wrapper.unmount()
    })
  })

  describe('when the sheet is closed', () => {
    it('then the model update is forwarded', () => {
      const wrapper = mountSheet()

      wrapper.findComponent({ name: 'MazBackdrop' }).vm.$emit('update:model-value', false)

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual([false])

      wrapper.unmount()
    })
  })
})
