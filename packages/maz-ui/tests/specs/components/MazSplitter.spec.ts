import MazSplitter from '@components/MazSplitter.vue'
import { mount } from '@vue/test-utils'
import { createSSRApp, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'

const panels = [
  { id: 'a', size: 30, min: 10, max: 70, collapsible: true },
  { id: 'b', min: 20 },
]

function mountComponent(props: Record<string, unknown> = {}) {
  const wrapper = mount(MazSplitter, {
    props: { panels, ...props },
    slots: { a: '<p id="slot-a">A</p>', b: '<p id="slot-b">B</p>', c: '<p>C</p>' },
    attachTo: document.body,
  })
  const root = wrapper.element as HTMLElement
  root.getBoundingClientRect = () => ({ left: 0, top: 0, width: 408, height: 208, right: 408, bottom: 208, x: 0, y: 0, toJSON: () => ({}) })
  return wrapper
}

function separator(wrapper: ReturnType<typeof mount>, index = 0) {
  return wrapper.findAll('[role="separator"]')[index]!
}

function pointer(type: string, init: Record<string, number>) {
  const event = new Event(type, { bubbles: true, cancelable: true }) as Event & Record<string, number>
  Object.assign(event, { button: 0, pointerId: 1, ...init })
  return event
}

describe('given a MazSplitter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('when it renders', () => {
    it('then each panel renders its slot with the declared sizes', () => {
      const wrapper = mountComponent()

      expect(wrapper.find('#slot-a').exists()).toBe(true)
      expect(wrapper.find('#slot-b').exists()).toBe(true)
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('30')
      expect(wrapper.findAll('.m-splitter__panel')[1]!.attributes('style')).toContain('70')
    })

    it('then the handle follows the separator pattern', () => {
      const wrapper = mountComponent()
      const handle = separator(wrapper)

      expect(handle.attributes('tabindex')).toBe('0')
      expect(handle.attributes('aria-orientation')).toBe('vertical')
      expect(handle.attributes('aria-valuemin')).toBe('10')
      expect(handle.attributes('aria-valuemax')).toBe('70')
      expect(handle.attributes('aria-controls')).toBe(wrapper.findAll('.m-splitter__panel')[0]!.attributes('id'))
    })

    it('then the vertical orientation stacks the panels', () => {
      const wrapper = mountComponent({ orientation: 'vertical' })

      expect(wrapper.classes()).toContain('m-splitter--vertical')
      expect(separator(wrapper).attributes('aria-orientation')).toBe('horizontal')
    })

    it('then panels without size share the space equally', () => {
      const wrapper = mountComponent({ panels: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] })

      expect(separator(wrapper).attributes('aria-valuenow')).toBe('33')
    })

    it('then it renders the same markup on the server', async () => {
      const html = await renderToString(createSSRApp(MazSplitter, { panels }))

      expect(html).toContain('role="separator"')
    })

    it('then it starts from the sizes of the model', () => {
      const wrapper = mountComponent({ sizes: [40, 60] })

      expect(separator(wrapper).attributes('aria-valuenow')).toBe('40')
    })

    it('then an invalid model is ignored', () => {
      const wrapper = mountComponent({ sizes: [10, 10] })

      expect(separator(wrapper).attributes('aria-valuenow')).toBe('30')
    })
  })

  describe('when the user presses keys on the handle', () => {
    it('then the arrows move the handle, Shift moves it faster', async () => {
      const wrapper = mountComponent()

      await separator(wrapper).trigger('keydown', { key: 'ArrowRight' })
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('32')
      await separator(wrapper).trigger('keydown', { key: 'ArrowLeft', shiftKey: true })
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('12')
      expect(wrapper.emitted('update:sizes')?.at(-1)).toEqual([[12, 88]])
    })

    it('then Home and End go to the limits', async () => {
      const wrapper = mountComponent()

      await separator(wrapper).trigger('keydown', { key: 'End' })
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('70')
      await separator(wrapper).trigger('keydown', { key: 'Home' })
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('10')
    })

    it('then the vertical orientation uses up and down', async () => {
      const wrapper = mountComponent({ orientation: 'vertical' })

      await separator(wrapper).trigger('keydown', { key: 'ArrowDown' })
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('32')
      await separator(wrapper).trigger('keydown', { key: 'ArrowUp' })
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('30')
    })

    it('then the arrows are mirrored in a right to left context', async () => {
      const wrapper = mountComponent()
      ;(wrapper.element as HTMLElement).style.direction = 'rtl'

      await separator(wrapper).trigger('keydown', { key: 'ArrowLeft' })
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('32')
    })

    it('then other keys are ignored', async () => {
      const wrapper = mountComponent()

      await separator(wrapper).trigger('keydown', { key: 'a' })
      expect(wrapper.emitted('update:sizes')).toBeUndefined()
    })

    it('then Enter collapses a collapsible panel and restores it', async () => {
      const wrapper = mountComponent()

      await separator(wrapper).trigger('keydown', { key: 'Enter' })
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('0')
      expect(wrapper.findAll('.m-splitter__panel')[0]!.classes()).toContain('m-splitter__panel--collapsed')
      await separator(wrapper).trigger('keydown', { key: 'Enter' })
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('30')
    })

    it('then Enter collapses the next panel when only it is collapsible', async () => {
      const wrapper = mountComponent({ panels: [{ id: 'a', size: 50 }, { id: 'b', collapsible: true }] })

      await separator(wrapper).trigger('keydown', { key: 'Enter' })
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('100')
    })

    it('then Enter does nothing when no panel is collapsible', async () => {
      const wrapper = mountComponent({ panels: [{ id: 'a', size: 50 }, { id: 'b' }] })

      await separator(wrapper).trigger('keydown', { key: 'Enter' })
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('50')
    })
  })

  describe('when the user drags the handle', () => {
    it('then the sizes follow the pointer within the limits and the end is emitted', async () => {
      const wrapper = mountComponent()
      const handle = separator(wrapper).element as HTMLElement
      handle.setPointerCapture = vi.fn()

      handle.dispatchEvent(pointer('pointerdown', { clientX: 100, clientY: 10 }))
      handle.dispatchEvent(pointer('pointermove', { clientX: 150, clientY: 10 }))
      await nextTick()
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('43')
      expect(wrapper.find('.m-splitter__handle--active').exists()).toBe(true)
      handle.dispatchEvent(pointer('pointermove', { clientX: 1000, clientY: 10 }))
      await nextTick()
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('70')
      handle.dispatchEvent(pointer('pointerup', { clientX: 1000, clientY: 10 }))
      expect(wrapper.emitted('resize-end')).toHaveLength(1)
      handle.dispatchEvent(pointer('pointermove', { clientX: 0, clientY: 10 }))
      await nextTick()
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('70')
    })

    it('then the vertical orientation reads the vertical axis', async () => {
      const wrapper = mountComponent({ orientation: 'vertical' })
      const handle = separator(wrapper).element as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 10 }))
      handle.dispatchEvent(pointer('pointermove', { clientX: 0, clientY: 60 }))
      await nextTick()
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('55')
    })

    it('then the right to left direction reverses the movement', async () => {
      const wrapper = mountComponent()
      ;(wrapper.element as HTMLElement).style.direction = 'rtl'
      const handle = separator(wrapper).element as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', { clientX: 100, clientY: 10 }))
      handle.dispatchEvent(pointer('pointermove', { clientX: 150, clientY: 10 }))
      await nextTick()
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('18')
    })

    it('then dragging a collapsible panel under half its minimum collapses it', async () => {
      const wrapper = mountComponent()
      const handle = separator(wrapper).element as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', { clientX: 100, clientY: 10 }))
      handle.dispatchEvent(pointer('pointermove', { clientX: -200, clientY: 10 }))
      await nextTick()
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('0')
    })

    it('then dragging a collapsible next panel under half its minimum collapses it', async () => {
      const wrapper = mountComponent({ panels: [{ id: 'a', size: 50 }, { id: 'b', min: 20, collapsible: true }] })
      const handle = separator(wrapper).element as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', { clientX: 100, clientY: 10 }))
      handle.dispatchEvent(pointer('pointermove', { clientX: 900, clientY: 10 }))
      await nextTick()
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('100')
    })

    it('then a secondary button is ignored', () => {
      const wrapper = mountComponent()
      const handle = separator(wrapper).element as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', { clientX: 100, clientY: 10, button: 2 }))
      expect(wrapper.find('.m-splitter__handle--active').exists()).toBe(false)
    })

    it('then an empty container is ignored', () => {
      const wrapper = mountComponent()
      ;(wrapper.element as HTMLElement).getBoundingClientRect = () => ({ width: 0, height: 0 }) as DOMRect
      const handle = separator(wrapper).element as HTMLElement

      handle.dispatchEvent(pointer('pointerdown', { clientX: 100, clientY: 10 }))
      expect(wrapper.find('.m-splitter__handle--active').exists()).toBe(false)
    })
  })

  describe('when the user double clicks the handle', () => {
    it('then the initial sizes come back', async () => {
      const wrapper = mountComponent()

      await separator(wrapper).trigger('keydown', { key: 'End' })
      await separator(wrapper).trigger('dblclick')
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('30')
    })
  })

  describe('when a storage key is set', () => {
    it('then the saved sizes are applied after the mount', async () => {
      localStorage.setItem('splitter', JSON.stringify([45, 55]))
      const wrapper = mountComponent({ storageKey: 'splitter' })
      await nextTick()

      expect(separator(wrapper).attributes('aria-valuenow')).toBe('45')
    })

    it('then the sizes are saved when they change', async () => {
      const wrapper = mountComponent({ storageKey: 'splitter' })
      await nextTick()

      await separator(wrapper).trigger('keydown', { key: 'ArrowRight' })
      expect(localStorage.getItem('splitter')).toBe('[32,68]')
    })

    it('then corrupted or invalid values are ignored', async () => {
      localStorage.setItem('splitter', '{oops')
      const corrupted = mountComponent({ storageKey: 'splitter' })
      await nextTick()
      expect(separator(corrupted).attributes('aria-valuenow')).toBe('30')

      localStorage.setItem('splitter', JSON.stringify([1, 2, 3]))
      const invalid = mountComponent({ storageKey: 'splitter' })
      await nextTick()
      expect(separator(invalid).attributes('aria-valuenow')).toBe('30')
    })

    it('then an unavailable storage does not break the component', async () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota')
      })
      const wrapper = mountComponent({ storageKey: 'splitter' })
      await nextTick()

      await separator(wrapper).trigger('keydown', { key: 'ArrowRight' })
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('32')
      spy.mockRestore()
    })
  })

  describe('when the props change', () => {
    it('then the model updates the sizes', async () => {
      const wrapper = mountComponent({ sizes: [40, 60] })

      await wrapper.setProps({ sizes: [20, 80] })
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('20')
    })

    it('then a new list of panels resets the sizes', async () => {
      const wrapper = mountComponent()

      await wrapper.setProps({ panels: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }] })
      expect(wrapper.findAll('[role="separator"]')).toHaveLength(3)
      expect(separator(wrapper).attributes('aria-valuenow')).toBe('25')
    })
  })
})
