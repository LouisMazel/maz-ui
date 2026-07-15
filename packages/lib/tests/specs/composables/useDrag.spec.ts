import type { UseDragOptions } from '@composables/useDrag'
import { useDrag } from '@composables/useDrag'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'

function firePointer(element: Element, type: string, clientX: number, clientY: number, init: { pointerType?: string, cancelable?: boolean } = {}) {
  const event = new MouseEvent(type, { clientX, clientY, bubbles: true, cancelable: init.cancelable })
  if (init.pointerType !== undefined) {
    Object.defineProperty(event, 'pointerType', { value: init.pointerType, configurable: true })
  }
  element.dispatchEvent(event)
  return event
}

function mountDrag(options: UseDragOptions = {}) {
  const api: any = {}

  const component = defineComponent({
    setup() {
      const target = ref<HTMLElement>()
      Object.assign(api, useDrag(target, options))
      return () => h('div', { ref: target, class: 'target' })
    },
  })

  const wrapper = mount(component, { attachTo: document.body })

  return { wrapper, api, target: wrapper.find('.target').element }
}

describe('given the useDrag composable', () => {
  describe('when the target is dragged', () => {
    it('then it tracks the live offset, distance and direction', async () => {
      const { wrapper, api, target } = mountDrag()

      firePointer(target, 'pointerdown', 0, 0)
      firePointer(target, 'pointermove', 30, 90)
      await wrapper.vm.$nextTick()

      expect(api.isDragging.value).toBe(true)
      expect(api.offsetX.value).toBe(30)
      expect(api.offsetY.value).toBe(90)
      expect(api.distance.value).toBeCloseTo(Math.hypot(30, 90))
      expect(api.direction.value).toBe('down')

      wrapper.unmount()
    })
  })

  describe('when the axis is locked to y', () => {
    it('then it ignores the horizontal movement', async () => {
      const { wrapper, api, target } = mountDrag({ axis: 'y' })

      firePointer(target, 'pointerdown', 0, 0)
      firePointer(target, 'pointermove', 100, 40)
      await wrapper.vm.$nextTick()

      expect(api.offsetX.value).toBe(0)
      expect(api.offsetY.value).toBe(40)

      wrapper.unmount()
    })
  })

  describe('when a threshold is set', () => {
    it('then it stays inactive until the distance is reached', async () => {
      const onStart = vi.fn()
      const { wrapper, api, target } = mountDrag({ threshold: 50, onStart })

      firePointer(target, 'pointerdown', 0, 0)
      firePointer(target, 'pointermove', 0, 20)
      await wrapper.vm.$nextTick()
      expect(api.isDragging.value).toBe(false)
      expect(onStart).not.toHaveBeenCalled()

      firePointer(target, 'pointermove', 0, 80)
      await wrapper.vm.$nextTick()
      expect(api.isDragging.value).toBe(true)
      expect(onStart).toHaveBeenCalledTimes(1)

      wrapper.unmount()
    })
  })

  describe('when the drag ends', () => {
    it('then it calls onEnd with the final state and resets', async () => {
      const onEnd = vi.fn()
      const { wrapper, api, target } = mountDrag({ onEnd })

      firePointer(target, 'pointerdown', 0, 0)
      firePointer(target, 'pointermove', 0, 120)
      firePointer(target, 'pointerup', 0, 120)
      await wrapper.vm.$nextTick()

      expect(onEnd).toHaveBeenCalledTimes(1)
      expect(onEnd.mock.calls[0][0].offsetY).toBe(120)
      expect(api.isDragging.value).toBe(false)
      expect(api.offsetY.value).toBe(0)

      wrapper.unmount()
    })
  })

  describe('when the pointer is released without moving', () => {
    it('then it does not call onEnd', async () => {
      const onEnd = vi.fn()
      const { wrapper, target } = mountDrag({ onEnd })

      firePointer(target, 'pointerdown', 0, 0)
      firePointer(target, 'pointerup', 0, 0)
      await wrapper.vm.$nextTick()

      expect(onEnd).not.toHaveBeenCalled()

      wrapper.unmount()
    })
  })

  describe('when the gesture is disabled', () => {
    it('then it does not track the drag', async () => {
      const { wrapper, api, target } = mountDrag({ disabled: true })

      firePointer(target, 'pointerdown', 0, 0)
      firePointer(target, 'pointermove', 0, 120)
      await wrapper.vm.$nextTick()

      expect(api.isDragging.value).toBe(false)
      expect(api.offsetY.value).toBe(0)

      wrapper.unmount()
    })
  })

  describe('when stop is called', () => {
    it('then it detaches the listeners', async () => {
      const onMove = vi.fn()
      const { wrapper, api, target } = mountDrag({ onMove })

      api.stop()
      firePointer(target, 'pointerdown', 0, 0)
      firePointer(target, 'pointermove', 0, 120)
      await wrapper.vm.$nextTick()

      expect(onMove).not.toHaveBeenCalled()

      wrapper.unmount()
    })
  })

  describe('when the axis is locked to x', () => {
    it('then it ignores the vertical movement and reports a horizontal direction', async () => {
      const { wrapper, api, target } = mountDrag({ axis: 'x' })

      firePointer(target, 'pointerdown', 0, 0)
      firePointer(target, 'pointermove', 60, 100)
      await wrapper.vm.$nextTick()

      expect(api.offsetX.value).toBe(60)
      expect(api.offsetY.value).toBe(0)
      expect(api.direction.value).toBe('right')

      wrapper.unmount()
    })
  })

  describe('when dragging in each direction', () => {
    it.each([
      ['up', 0, 200, 0, 50, 'up'],
      ['down', 0, 0, 0, 200, 'down'],
      ['left', 200, 0, 50, 0, 'left'],
      ['right', 0, 0, 200, 0, 'right'],
    ] as const)('then it reports the %s direction', async (_label, sx, sy, ex, ey, expected) => {
      const { wrapper, api, target } = mountDrag()

      firePointer(target, 'pointerdown', sx, sy)
      firePointer(target, 'pointermove', ex, ey)
      await wrapper.vm.$nextTick()

      expect(api.direction.value).toBe(expected)

      wrapper.unmount()
    })
  })

  describe('when an allowed pointer type is used', () => {
    it('then it tracks the drag', async () => {
      const { wrapper, api, target } = mountDrag({ pointerTypes: ['touch'] })

      firePointer(target, 'pointerdown', 0, 0, { pointerType: 'touch' })
      firePointer(target, 'pointermove', 0, 80, { pointerType: 'touch' })
      await wrapper.vm.$nextTick()

      expect(api.offsetY.value).toBe(80)

      wrapper.unmount()
    })
  })

  describe('when a disallowed pointer type is used', () => {
    it('then it ignores the drag', async () => {
      const { wrapper, api, target } = mountDrag({ pointerTypes: ['touch'] })

      firePointer(target, 'pointerdown', 0, 0, { pointerType: 'mouse' })
      firePointer(target, 'pointermove', 0, 80, { pointerType: 'mouse' })
      await wrapper.vm.$nextTick()

      expect(api.offsetY.value).toBe(0)

      wrapper.unmount()
    })
  })

  describe('when preventDefault and stopPropagation are enabled', () => {
    it('then it prevents default and stops propagation on the pointer move', async () => {
      const { wrapper, target } = mountDrag({ preventDefault: true, stopPropagation: true })

      firePointer(target, 'pointerdown', 0, 0)
      const move = new MouseEvent('pointermove', { clientX: 0, clientY: 80, bubbles: true, cancelable: true })
      const preventSpy = vi.spyOn(move, 'preventDefault')
      const stopSpy = vi.spyOn(move, 'stopPropagation')
      target.dispatchEvent(move)
      await wrapper.vm.$nextTick()

      expect(preventSpy).toHaveBeenCalled()
      expect(stopSpy).toHaveBeenCalled()

      wrapper.unmount()
    })
  })

  describe('when the target is a CSS selector string', () => {
    it('then it resolves and tracks the element', async () => {
      const api: any = {}
      const component = defineComponent({
        setup() {
          Object.assign(api, useDrag('#drag-string-target'))
          return () => h('div', { id: 'drag-string-target' })
        },
      })
      const wrapper = mount(component, { attachTo: document.body })
      const target = wrapper.find('#drag-string-target').element

      firePointer(target, 'pointerdown', 0, 0)
      firePointer(target, 'pointermove', 0, 70)
      await wrapper.vm.$nextTick()

      expect(api.offsetY.value).toBe(70)

      wrapper.unmount()
    })
  })

  describe('when immediate is false', () => {
    it('then it tracks only after start is called', async () => {
      const onMove = vi.fn()
      const { wrapper, api, target } = mountDrag({ immediate: false, onMove })

      firePointer(target, 'pointerdown', 0, 0)
      firePointer(target, 'pointermove', 0, 80)
      await wrapper.vm.$nextTick()
      expect(onMove).not.toHaveBeenCalled()

      api.start()
      firePointer(target, 'pointerdown', 0, 0)
      firePointer(target, 'pointermove', 0, 80)
      await wrapper.vm.$nextTick()
      expect(onMove).toHaveBeenCalled()

      wrapper.unmount()
    })
  })
})
