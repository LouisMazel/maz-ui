import MazBottomSheet from '@components/MazBottomSheet.vue'
import { mount } from '@vue/test-utils'

interface PointerInit {
  x?: number
  y?: number
  time?: number
  pointerType?: string
}

function firePointer(element: Element, type: string, { x = 0, y = 0, time = 0, pointerType = 'mouse' }: PointerInit = {}) {
  const event = new MouseEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true })

  Object.defineProperty(event, 'timeStamp', { value: time })
  Object.defineProperty(event, 'pointerType', { value: pointerType })
  element.dispatchEvent(event)
}

function swipe(element: Element, points: { y: number, time: number }[], init: Pick<PointerInit, 'pointerType'> = {}) {
  const [first, ...rest] = points as [{ y: number, time: number }, ...{ y: number, time: number }[]]

  firePointer(element, 'pointerdown', { ...first, ...init })

  for (const point of rest.slice(0, -1))
    firePointer(element, 'pointermove', { ...point, ...init })

  firePointer(element, 'pointerup', { ...rest.at(-1), ...init })
}

function mountSheet(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(MazBottomSheet, {
    props: { modelValue: true, ...props },
    slots,
    attachTo: document.body,
  })
}

describe('given MazBottomSheet with gestures', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('when the handle is released with a quick flick under the distance threshold', () => {
    it('then it closes the sheet', async () => {
      const wrapper = mountSheet()
      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element

      swipe(handle, [{ y: 0, time: 0 }, { y: 30, time: 40 }, { y: 50, time: 60 }])
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(false)

      wrapper.unmount()
    })
  })

  describe('when the handle is released slowly under the distance threshold', () => {
    it('then it springs back without closing', async () => {
      const wrapper = mountSheet()
      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element

      swipe(handle, [{ y: 0, time: 0 }, { y: 60, time: 500 }, { y: 60, time: 900 }])
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(true)
      expect(wrapper.find('.m-bottom-sheet').attributes('style') ?? '').not.toContain('translateY')

      wrapper.unmount()
    })
  })

  describe('when the sheet is dragged up beyond its top', () => {
    it('then it resists and stretches less than the pointer', async () => {
      const wrapper = mountSheet()
      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element

      firePointer(handle, 'pointerdown', { y: 300 })
      firePointer(handle, 'pointermove', { y: 200 })
      await wrapper.vm.$nextTick()

      const match = /translateY\((-[\d.]+)px\)/.exec(wrapper.find('.m-bottom-sheet').attributes('style') ?? '')

      expect(match).not.toBeNull()
      expect(Math.abs(Number(match?.[1]))).toBeLessThan(100)
      expect(Math.abs(Number(match?.[1]))).toBeGreaterThan(0)

      firePointer(handle, 'pointerup', { y: 200 })
      wrapper.unmount()
    })
  })

  describe('when the gesture is horizontal', () => {
    it('then the sheet does not move', async () => {
      const wrapper = mountSheet()
      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element

      firePointer(handle, 'pointerdown', { x: 0, y: 0 })
      firePointer(handle, 'pointermove', { x: 200, y: 10 })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-bottom-sheet').attributes('style') ?? '').not.toContain('translateY')

      firePointer(handle, 'pointerup', { x: 200, y: 10 })
      wrapper.unmount()
    })
  })

  describe('when a mouse drags the content', () => {
    it('then the sheet does not move so that the text stays selectable', async () => {
      const wrapper = mountSheet({}, { default: '<p class="text">Text</p>' })
      const text = wrapper.find('.text').element

      firePointer(text, 'pointerdown', { y: 0, pointerType: 'mouse' })
      firePointer(text, 'pointermove', { y: 100, pointerType: 'mouse' })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-bottom-sheet').attributes('style') ?? '').not.toContain('translateY')

      wrapper.unmount()
    })
  })

  describe('when a finger drags the content', () => {
    it('then the sheet follows it', async () => {
      const wrapper = mountSheet({}, { default: '<p class="text">Text</p>' })
      const text = wrapper.find('.text').element

      firePointer(text, 'pointerdown', { y: 0, pointerType: 'touch' })
      firePointer(text, 'pointermove', { y: 100, pointerType: 'touch' })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-bottom-sheet').attributes('style')).toContain('translateY(100px)')
      expect(wrapper.find('.m-bottom-sheet').classes()).toContain('--dragging')

      firePointer(text, 'pointerup', { y: 100, pointerType: 'touch' })
      wrapper.unmount()
    })

    it('then the sheet stays when the touch started on a field', async () => {
      const wrapper = mountSheet({}, { default: '<input class="field">' })
      const field = wrapper.find('.field').element

      firePointer(field, 'pointerdown', { y: 0, pointerType: 'touch' })
      firePointer(field, 'pointermove', { y: 100, pointerType: 'touch' })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-bottom-sheet').attributes('style') ?? '').not.toContain('translateY')

      wrapper.unmount()
    })
  })

  describe('when a finger drags down a content that can still scroll up', () => {
    it('then the gesture belongs to the scroll', async () => {
      const wrapper = mountSheet({}, { default: '<div class="scroller" style="overflow-y: auto">Long</div>' })
      const scroller = wrapper.find('.scroller').element

      Object.defineProperties(scroller, {
        scrollHeight: { value: 800 },
        clientHeight: { value: 200 },
        scrollTop: { value: 120 },
      })

      firePointer(scroller, 'pointerdown', { y: 0, pointerType: 'touch' })
      firePointer(scroller, 'pointermove', { y: 100, pointerType: 'touch' })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-bottom-sheet').attributes('style') ?? '').not.toContain('translateY')

      wrapper.unmount()
    })
  })

  describe('when a finger drags down a content scrolled to the top', () => {
    it('then the sheet follows the finger', async () => {
      const wrapper = mountSheet({}, { default: '<div class="scroller" style="overflow-y: auto">Long</div>' })
      const scroller = wrapper.find('.scroller').element

      Object.defineProperties(scroller, {
        scrollHeight: { value: 800 },
        clientHeight: { value: 200 },
        scrollTop: { value: 0 },
      })

      firePointer(scroller, 'pointerdown', { y: 0, pointerType: 'touch' })
      firePointer(scroller, 'pointermove', { y: 100, pointerType: 'touch' })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-bottom-sheet').attributes('style')).toContain('translateY(100px)')

      firePointer(scroller, 'pointerup', { y: 100, pointerType: 'touch' })
      wrapper.unmount()
    })
  })

  describe('when the sheet is disabled with swipeToClose false', () => {
    it('then a finger does not move it', async () => {
      const wrapper = mountSheet({ swipeToClose: false }, { default: '<p class="text">Text</p>' })
      const text = wrapper.find('.text').element

      firePointer(text, 'pointerdown', { y: 0, pointerType: 'touch' })
      firePointer(text, 'pointermove', { y: 100, pointerType: 'touch' })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-bottom-sheet').attributes('style') ?? '').not.toContain('translateY')

      wrapper.unmount()
    })
  })

  describe('when the pointer is cancelled during a drag', () => {
    it('then the sheet springs back', async () => {
      const wrapper = mountSheet()
      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element

      firePointer(handle, 'pointerdown', { y: 0 })
      firePointer(handle, 'pointermove', { y: 40 })
      firePointer(handle, 'pointercancel', { y: 40 })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-bottom-sheet').attributes('style') ?? '').not.toContain('translateY')

      wrapper.unmount()
    })
  })

  describe('when a persistent sheet is flicked', () => {
    it('then a persistent sheet never closes', async () => {
      const wrapper = mountSheet({ persistent: true })
      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element

      swipe(handle, [{ y: 0, time: 0 }, { y: 30, time: 40 }, { y: 50, time: 60 }])
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(true)

      wrapper.unmount()
    })
  })

  describe('when the sheet has snap points', () => {
    it('then it is as tall as the biggest point and rests at the first one', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1] })

      await wrapper.vm.$nextTick()

      const style = wrapper.find('.m-bottom-sheet').attributes('style')

      expect(style).toContain(`height: ${window.innerHeight}px`)
      expect(style).toContain(`translateY(${window.innerHeight / 2}px)`)

      wrapper.unmount()
    })

    it('then it rests at the snap point of the snap prop', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1], snap: 1 })

      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-bottom-sheet').attributes('style') ?? '').not.toContain('translateY')

      await wrapper.setProps({ snap: 0.5 })

      expect(wrapper.find('.m-bottom-sheet').attributes('style')).toContain(`translateY(${window.innerHeight / 2}px)`)

      wrapper.unmount()
    })

    it('then a flick up goes to the next point and emits it', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1] })

      await wrapper.vm.$nextTick()

      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element

      swipe(handle, [{ y: 500, time: 0 }, { y: 400, time: 100 }, { y: 300, time: 200 }, { y: 300, time: 210 }])
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:snap')).toEqual([[1]])
      expect(wrapper.find('.m-bottom-sheet').attributes('style') ?? '').not.toContain('translateY')

      wrapper.unmount()
    })

    it('then a slow release goes to the nearest point', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1] })

      await wrapper.vm.$nextTick()

      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element

      swipe(handle, [{ y: 500, time: 0 }, { y: 350, time: 800 }, { y: 350, time: 1200 }])
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:snap')).toBeUndefined()
      expect(wrapper.find('.m-bottom-sheet').attributes('style')).toContain(`translateY(${window.innerHeight / 2}px)`)

      wrapper.unmount()
    })

    it('then a slow release near the full height goes to the biggest point', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1] })

      await wrapper.vm.$nextTick()

      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element

      swipe(handle, [{ y: 500, time: 0 }, { y: 250, time: 800 }, { y: 250, time: 1200 }])
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:snap')).toEqual([[1]])

      wrapper.unmount()
    })

    it('then a flick down from the lowest point closes the sheet', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1] })

      await wrapper.vm.$nextTick()

      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element

      swipe(handle, [{ y: 500, time: 0 }, { y: 530, time: 40 }, { y: 560, time: 60 }])
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(false)

      wrapper.unmount()
    })

    it('then a persistent sheet springs back to its lowest point', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1], persistent: true })

      await wrapper.vm.$nextTick()

      const handle = wrapper.find('.m-bottom-sheet__handle-zone').element

      swipe(handle, [{ y: 500, time: 0 }, { y: 530, time: 40 }, { y: 560, time: 60 }])
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'MazBackdrop' }).vm.present).toBe(true)
      expect(wrapper.find('.m-bottom-sheet').attributes('style')).toContain(`translateY(${window.innerHeight / 2}px)`)

      wrapper.unmount()
    })

    it('then the content does not scroll away the drag while the sheet is not fully open', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1] }, { default: '<div class="scroller" style="overflow-y: auto">Long</div>' })

      await wrapper.vm.$nextTick()

      const scroller = wrapper.find('.scroller').element

      Object.defineProperties(scroller, {
        scrollHeight: { value: 800 },
        clientHeight: { value: 200 },
        scrollTop: { value: 120 },
      })

      firePointer(scroller, 'pointerdown', { y: 500, pointerType: 'touch' })
      firePointer(scroller, 'pointermove', { y: 450, pointerType: 'touch' })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-bottom-sheet').attributes('style')).toContain(`translateY(${window.innerHeight / 2 - 50}px)`)

      firePointer(scroller, 'pointerup', { y: 450, pointerType: 'touch' })
      wrapper.unmount()
    })
  })

  describe('when the sheet has several snap points', () => {
    it('then the handle is a button labelled and focusable', () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1] })
      const handle = wrapper.find('.m-bottom-sheet__handle-zone')

      expect(handle.attributes('role')).toBe('button')
      expect(handle.attributes('tabindex')).toBe('0')
      expect(handle.attributes('aria-label')).toBeTruthy()

      wrapper.unmount()
    })

    it('then a click cycles through the points', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1] })

      await wrapper.vm.$nextTick()
      await wrapper.find('.m-bottom-sheet__handle-zone').trigger('click')
      await wrapper.find('.m-bottom-sheet__handle-zone').trigger('click')

      expect(wrapper.emitted('update:snap')).toEqual([[1], [0.5]])

      wrapper.unmount()
    })

    it('then the keyboard moves between the points', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1] })

      await wrapper.vm.$nextTick()

      const handle = wrapper.find('.m-bottom-sheet__handle-zone')

      await handle.trigger('keydown', { key: 'ArrowUp' })
      await handle.trigger('keydown', { key: 'ArrowUp' })
      await handle.trigger('keydown', { key: 'ArrowDown' })
      await handle.trigger('keydown', { key: 'Enter' })
      await handle.trigger('keydown', { key: ' ' })
      await handle.trigger('keydown', { key: 'a' })

      expect(wrapper.emitted('update:snap')).toEqual([[1], [0.5], [1], [0.5]])

      wrapper.unmount()
    })

    it('then a click that ends a drag does not cycle', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1] })

      await wrapper.vm.$nextTick()

      const handle = wrapper.find('.m-bottom-sheet__handle-zone')

      swipe(handle.element, [{ y: 500, time: 0 }, { y: 350, time: 800 }, { y: 350, time: 1200 }])
      await handle.trigger('click')

      expect(wrapper.emitted('update:snap')).toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('when the sheet has a single or no snap point', () => {
    it.each([[undefined], [[0.5]]])('then the handle is not a button (%s)', (snapPoints) => {
      const wrapper = mountSheet({ snapPoints })

      expect(wrapper.find('.m-bottom-sheet__handle-zone').attributes('role')).toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('when the sheet is reopened', () => {
    it('then it rests at the first snap point again', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1] })

      await wrapper.vm.$nextTick()
      await wrapper.find('.m-bottom-sheet__handle-zone').trigger('click')

      expect(wrapper.find('.m-bottom-sheet').attributes('style') ?? '').not.toContain('translateY')

      await wrapper.setProps({ modelValue: false })
      await wrapper.setProps({ modelValue: true })

      expect(wrapper.find('.m-bottom-sheet').attributes('style')).toContain(`translateY(${window.innerHeight / 2}px)`)

      wrapper.unmount()
    })
  })

  describe('when the window is resized', () => {
    it('then the snap points follow the viewport', async () => {
      const wrapper = mountSheet({ snapPoints: [0.5, 1] })

      await wrapper.vm.$nextTick()

      const original = window.innerHeight

      window.innerHeight = 400
      globalThis.dispatchEvent(new Event('resize'))
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.m-bottom-sheet').attributes('style')).toContain('height: 400px')

      window.innerHeight = original
      wrapper.unmount()
    })
  })
})
