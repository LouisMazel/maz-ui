import type { SheetEdge, UseSheetDragOptions } from '@/utils/sheetDrag.ts'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useSheetDrag } from '@/utils/sheetDrag.ts'

interface PointerInit {
  x?: number
  y?: number
  time?: number
  pointerType?: string
  pointerId?: number
  button?: number
}

function firePointer(element: Element | Document, type: string, init: PointerInit = {}) {
  const { x = 0, y = 0, time = 0, pointerType = 'touch', button = 0 } = init
  const event = new MouseEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true, button })

  Object.defineProperty(event, 'timeStamp', { value: time })
  Object.defineProperty(event, 'pointerType', { value: pointerType })
  Object.defineProperty(event, 'pointerId', { value: 'pointerId' in init ? init.pointerId : 1 })
  element.dispatchEvent(event)

  return event
}

function mountDrag(options: Partial<UseSheetDragOptions> = {}) {
  const onRelease = vi.fn(() => 0 as number | 'close')
  const onStart = vi.fn()
  const edge = ref<SheetEdge>('bottom')
  let api!: ReturnType<typeof useSheetDrag>

  const host = defineComponent({
    setup() {
      const element = ref<HTMLElement>()

      api = useSheetDrag({ element, edge, onRelease, onStart, ...options })

      return () => h('div', { ref: element, class: 'sheet' }, [h('input', { class: 'field' }), h('span', { class: 'text' }, 'text')])
    },
  })

  const wrapper = mount(host, { attachTo: document.body })

  return { wrapper, api, onRelease, onStart, edge, sheet: wrapper.element as HTMLElement }
}

describe('given the sheet drag composable', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  describe('when the pointerdown does not qualify', () => {
    it('then a secondary button is ignored', () => {
      const { sheet, onStart } = mountDrag()

      firePointer(sheet, 'pointerdown', { button: 2 })
      firePointer(document, 'pointermove', { y: 100 })

      expect(onStart).not.toHaveBeenCalled()
    })

    it('then an interactive target is ignored', () => {
      const { wrapper, onStart } = mountDrag()

      firePointer(wrapper.find('.field').element, 'pointerdown')
      firePointer(document, 'pointermove', { y: 100 })

      expect(onStart).not.toHaveBeenCalled()
    })

    it('then a mouse outside of the mouse selector is ignored', () => {
      const { wrapper, onStart } = mountDrag({ mouseSelector: '.handle' })

      firePointer(wrapper.find('.text').element, 'pointerdown', { pointerType: 'mouse' })
      firePointer(document, 'pointermove', { y: 100 })

      expect(onStart).not.toHaveBeenCalled()
    })

    it('then a drag is ignored when the composable is disabled', () => {
      const { sheet, onStart } = mountDrag({ disabled: true })

      firePointer(sheet, 'pointerdown')
      firePointer(document, 'pointermove', { y: 100 })

      expect(onStart).not.toHaveBeenCalled()
    })

    it('then a second pointerdown during a gesture is ignored', () => {
      const { sheet, onStart } = mountDrag()

      firePointer(sheet, 'pointerdown', { y: 0 })
      firePointer(sheet, 'pointerdown', { y: 50, pointerId: 2 })
      firePointer(document, 'pointermove', { y: 100 })

      expect(onStart).toHaveBeenCalledOnce()
    })
  })

  describe('when the gesture is moved', () => {
    it('then a move below the threshold does not start the drag', () => {
      const { sheet, api } = mountDrag()

      firePointer(sheet, 'pointerdown')
      firePointer(document, 'pointermove', { y: 2 })

      expect(api.isDragging.value).toBe(false)
    })

    it('then a move of another pointer is ignored', () => {
      const { sheet, onStart } = mountDrag()

      firePointer(sheet, 'pointerdown')
      firePointer(document, 'pointermove', { y: 100, pointerId: 9 })

      expect(onStart).not.toHaveBeenCalled()
    })

    it('then a mostly cross-axis move ignores the whole gesture', () => {
      const { sheet, onStart, api } = mountDrag()

      firePointer(sheet, 'pointerdown')
      firePointer(document, 'pointermove', { x: 50, y: 10 })
      firePointer(document, 'pointermove', { x: 50, y: 100 })

      expect(onStart).not.toHaveBeenCalled()
      expect(api.isDragging.value).toBe(false)
    })

    it('then the pointer capture failing does not break the drag', () => {
      const { sheet, api } = mountDrag()
      sheet.setPointerCapture = vi.fn(() => {
        throw new Error('gone')
      })

      firePointer(sheet, 'pointerdown')
      firePointer(document, 'pointermove', { y: 40 })

      expect(api.isDragging.value).toBe(true)
    })

    it('then only the last eight samples are kept for the velocity', () => {
      const { sheet, onRelease } = mountDrag()

      firePointer(sheet, 'pointerdown', { time: 0 })

      for (let index = 1; index <= 12; index++)
        firePointer(document, 'pointermove', { y: index * 10, time: index * 10 })

      firePointer(document, 'pointerup', { y: 120, time: 125 })

      expect(onRelease).toHaveBeenCalledWith(expect.objectContaining({ position: 120 }))
      expect(onRelease.mock.calls[0]?.[0].velocity).toBeCloseTo(1)
    })

    it('then an undefined pointer id follows any pointer', () => {
      const { sheet, onStart } = mountDrag()

      firePointer(sheet, 'pointerdown', { pointerId: undefined })
      firePointer(document, 'pointermove', { y: 40, pointerId: 5 })

      expect(onStart).toHaveBeenCalledOnce()
    })
  })

  describe('when the touchmove happens', () => {
    it('then it is prevented once the drag started', () => {
      const { sheet } = mountDrag()

      firePointer(sheet, 'pointerdown')
      firePointer(document, 'pointermove', { y: 40 })

      const event = new Event('touchmove', { bubbles: true, cancelable: true })
      sheet.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(true)
    })

    it('then it is left alone before the drag starts', () => {
      const { sheet } = mountDrag()

      firePointer(sheet, 'pointerdown')

      const event = new Event('touchmove', { bubbles: true, cancelable: true })
      sheet.dispatchEvent(event)

      expect(event.defaultPrevented).toBe(false)
    })
  })

  describe('when the gesture ends', () => {
    it('then another pointer does not end it', () => {
      const { sheet, onRelease } = mountDrag()

      firePointer(sheet, 'pointerdown')
      firePointer(document, 'pointermove', { y: 40 })
      firePointer(document, 'pointerup', { y: 40, pointerId: 9 })

      expect(onRelease).not.toHaveBeenCalled()
    })

    it('then a cancel releases with a zero velocity and flags the drag', async () => {
      vi.useFakeTimers()

      const { sheet, onRelease, api } = mountDrag()

      firePointer(sheet, 'pointerdown', { time: 0 })
      firePointer(document, 'pointermove', { y: 80, time: 30 })
      firePointer(document, 'pointercancel', { y: 80, time: 40 })

      expect(onRelease).toHaveBeenCalledWith({ position: 80, velocity: 0 })
      expect(api.hasJustDragged()).toBe(true)

      await vi.advanceTimersByTimeAsync(5)

      expect(api.hasJustDragged()).toBe(false)

      vi.useRealTimers()
    })

    it('then a failing pointer capture release does not break it', () => {
      const { sheet, onRelease } = mountDrag()
      sheet.releasePointerCapture = vi.fn(() => {
        throw new Error('gone')
      })

      firePointer(sheet, 'pointerdown')
      firePointer(document, 'pointermove', { y: 40 })
      firePointer(document, 'pointerup', { y: 40, time: 5 })

      expect(onRelease).toHaveBeenCalledOnce()
    })

    it('then a release without a drag does not call onRelease', () => {
      const { sheet, onRelease } = mountDrag()

      firePointer(sheet, 'pointerdown')
      firePointer(document, 'pointerup')

      expect(onRelease).not.toHaveBeenCalled()
    })

    it('then the position goes where the release says', () => {
      const { sheet, api, onRelease } = mountDrag()
      onRelease.mockReturnValue(25)

      firePointer(sheet, 'pointerdown')
      firePointer(document, 'pointermove', { y: 40 })
      firePointer(document, 'pointerup', { y: 40, time: 5 })

      expect(api.position.value).toBe(25)
    })
  })

  describe('when the element changes or the scope is disposed', () => {
    it('then the gesture in progress is cancelled', async () => {
      const { wrapper, sheet, onRelease } = mountDrag()

      firePointer(sheet, 'pointerdown')
      wrapper.unmount()
      firePointer(document, 'pointermove', { y: 40 })
      firePointer(document, 'pointerup', { y: 40 })
      await nextTick()

      expect(onRelease).not.toHaveBeenCalled()
    })
  })

  describe('when the edge is on the horizontal axis', () => {
    it('then a drag along x starts and follows the sign', () => {
      const { sheet, edge, api } = mountDrag()
      edge.value = 'left'

      firePointer(sheet, 'pointerdown')
      firePointer(document, 'pointermove', { x: -40 })

      expect(api.position.value).toBe(40)
    })
  })

  describe('when the sheet stretches beyond its open position', () => {
    it('then it resists with a rubber band', () => {
      const { sheet, api } = mountDrag({ stretch: 60 })

      firePointer(sheet, 'pointerdown')
      firePointer(document, 'pointermove', { y: -100 })

      expect(api.position.value).toBeLessThan(0)
      expect(api.position.value).toBeGreaterThan(-60)
    })

    it('then it stops at the open position without stretch', () => {
      const { sheet, api } = mountDrag()

      firePointer(sheet, 'pointerdown')
      firePointer(document, 'pointermove', { y: -100 })

      expect(api.position.value).toBe(0)
    })
  })
})
