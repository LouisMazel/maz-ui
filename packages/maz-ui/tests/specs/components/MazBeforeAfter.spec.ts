import MazBeforeAfter from '@components/MazBeforeAfter.vue'
import { mount } from '@vue/test-utils'
import { createSSRApp, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'

const reduced = ref(false)
const intersect = vi.hoisted(() => ({ handler: undefined as undefined | ((entry: { isIntersecting: boolean }) => void) }))

vi.mock('@composables/useReducedMotion', () => ({
  useReducedMotion: () => ({ shouldReduceMotion: reduced }),
}))

vi.mock('@/utils/reveal', () => ({
  observeIntersection: (_element: Element, handler: (entry: { isIntersecting: boolean }) => void) => {
    intersect.handler = handler
    return () => {}
  },
}))

function mountComponent(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
  const wrapper = mount(MazBeforeAfter, {
    props: { before: '/before.jpg', after: '/after.jpg', hint: false, ...props },
    attachTo: document.body,
    ...options,
  })
  const root = wrapper.element as HTMLElement
  root.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0, toJSON: () => ({}) })
  root.setPointerCapture = vi.fn()
  root.releasePointerCapture = vi.fn()
  return wrapper
}

function slider(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('[role="slider"]')
}

function pointer(type: string, init: Record<string, number>) {
  const event = new Event(type, { bubbles: true }) as Event & Record<string, number>
  Object.assign(event, { button: 0, pointerId: 1, ...init })
  return event
}

describe('given a MazBeforeAfter', () => {
  beforeEach(() => {
    reduced.value = false
    intersect.handler = undefined
  })

  describe('when it renders', () => {
    it('then it shows both images and a slider at 50', () => {
      const wrapper = mountComponent()

      expect(wrapper.findAll('img')).toHaveLength(2)
      expect(slider(wrapper).attributes('aria-valuenow')).toBe('50')
      expect(slider(wrapper).attributes('aria-orientation')).toBe('horizontal')
      expect(slider(wrapper).attributes('tabindex')).toBe('0')
    })

    it('then it renders the same markup on the server', async () => {
      const html = await renderToString(createSSRApp(MazBeforeAfter, { before: '/a.jpg', after: '/b.jpg' }))

      expect(html).toContain('m-before-after')
      expect(html).toContain('role="slider"')
    })

    it('then the slots replace the images', () => {
      const wrapper = mountComponent({ before: undefined, after: undefined }, { slots: { before: '<p id="b">B</p>', after: '<p id="a">A</p>' } })

      expect(wrapper.find('#b').exists()).toBe(true)
      expect(wrapper.find('#a').exists()).toBe(true)
      expect(wrapper.findAll('img')).toHaveLength(0)
    })

    it('then the labels are hidden with false', () => {
      const wrapper = mountComponent({ beforeLabel: false })

      expect(wrapper.find('.m-before-after__label').exists()).toBe(false)
    })

    it('then custom labels are displayed', () => {
      const wrapper = mountComponent({ beforeLabel: 'Avant', afterLabel: 'Après', label: 'Comparer' })

      expect(wrapper.find('.m-before-after__label--before').text()).toBe('Avant')
      expect(wrapper.find('.m-before-after__label--after').text()).toBe('Après')
      expect(slider(wrapper).attributes('aria-label')).toBe('Comparer')
      expect(slider(wrapper).attributes('aria-valuetext')).toBe('Avant 50%, Après 50%')
    })

    it('then the vertical orientation is exposed', () => {
      const wrapper = mountComponent({ orientation: 'vertical', aspectRatio: '16 / 9' })

      expect(slider(wrapper).attributes('aria-orientation')).toBe('vertical')
      expect(wrapper.classes()).toContain('m-before-after--vertical')
      expect((wrapper.element as HTMLElement).style.aspectRatio).toBe('16 / 9')
    })
  })

  describe('when the user presses keys on the handle', () => {
    it('then the arrows move by the step', async () => {
      const wrapper = mountComponent({ step: 5 })

      await slider(wrapper).trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([55])
      await slider(wrapper).trigger('keydown', { key: 'ArrowLeft' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([50])
    })

    it('then PageUp, PageDown, Home and End jump', async () => {
      const wrapper = mountComponent()

      await slider(wrapper).trigger('keydown', { key: 'PageUp' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([70])
      await slider(wrapper).trigger('keydown', { key: 'PageDown' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([50])
      await slider(wrapper).trigger('keydown', { key: 'Home' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0])
      await slider(wrapper).trigger('keydown', { key: 'End' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([100])
    })

    it('then the vertical orientation uses up and down', async () => {
      const wrapper = mountComponent({ orientation: 'vertical' })

      await slider(wrapper).trigger('keydown', { key: 'ArrowDown' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([52])
      await slider(wrapper).trigger('keydown', { key: 'ArrowUp' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([50])
    })

    it('then the horizontal arrows are mirrored in a right to left context', async () => {
      const wrapper = mountComponent()
      ;(wrapper.element as HTMLElement).style.direction = 'rtl'

      await slider(wrapper).trigger('keydown', { key: 'ArrowRight' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([48])
    })

    it('then other keys are ignored', async () => {
      const wrapper = mountComponent()

      await slider(wrapper).trigger('keydown', { key: 'a' })
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('then the position never leaves 0 to 100', async () => {
      const wrapper = mountComponent({}, { props: { before: '/a', after: '/b', hint: false, modelValue: 99 } })

      await slider(wrapper).trigger('keydown', { key: 'PageUp' })
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([100])
    })
  })

  describe('when the user drags', () => {
    it('then the position follows the pointer', async () => {
      const wrapper = mountComponent()
      const root = wrapper.element as HTMLElement

      root.dispatchEvent(pointer('pointerdown', { clientX: 50, clientY: 10 }))
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([25])
      root.dispatchEvent(pointer('pointermove', { clientX: 150, clientY: 10 }))
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([75])
      root.dispatchEvent(pointer('pointerup', { clientX: 150, clientY: 10 }))
      root.dispatchEvent(pointer('pointermove', { clientX: 10, clientY: 10 }))
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([75])
      await nextTick()
      expect(document.activeElement).toBe(slider(wrapper).element)
    })

    it('then the vertical orientation reads the vertical axis', () => {
      const wrapper = mountComponent({ orientation: 'vertical' })

      ;(wrapper.element as HTMLElement).dispatchEvent(pointer('pointerdown', { clientX: 10, clientY: 25 }))
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([25])
    })

    it('then the right to left direction mirrors the position', () => {
      const wrapper = mountComponent()
      const root = wrapper.element as HTMLElement
      root.style.direction = 'rtl'

      root.dispatchEvent(pointer('pointerdown', { clientX: 50, clientY: 10 }))
      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([75])
    })

    it('then a secondary button is ignored', () => {
      const wrapper = mountComponent()

      ;(wrapper.element as HTMLElement).dispatchEvent(pointer('pointerdown', { clientX: 50, clientY: 10, button: 2 }))
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('then an empty box is ignored', () => {
      const wrapper = mountComponent()
      const root = wrapper.element as HTMLElement
      root.getBoundingClientRect = () => ({ width: 0, height: 0 }) as DOMRect

      root.dispatchEvent(pointer('pointerdown', { clientX: 50, clientY: 10 }))
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('when the model changes from outside', () => {
    it('then the handle follows', async () => {
      const wrapper = mountComponent({ modelValue: 30 })

      await wrapper.setProps({ modelValue: 80 })
      expect(slider(wrapper).attributes('aria-valuenow')).toBe('80')
      expect((wrapper.element as HTMLElement).style.getPropertyValue('--m-before-after-position')).toBe('80%')
    })
  })

  describe('when the hint is enabled', () => {
    let frames: FrameRequestCallback[]

    beforeEach(() => {
      frames = []
      vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback))
      vi.stubGlobal('cancelAnimationFrame', vi.fn())
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('then the handle swings once when the component becomes visible, without emitting', async () => {
      const wrapper = mountComponent({ hint: true })

      intersect.handler?.({ isIntersecting: false })
      expect(frames).toHaveLength(0)
      intersect.handler?.({ isIntersecting: true })
      expect(frames).toHaveLength(1)
      frames.shift()!(performance.now() + 150)
      await nextTick()
      expect(slider(wrapper).attributes('aria-valuenow')).toBe('50')
      expect((wrapper.element as HTMLElement).style.getPropertyValue('--m-before-after-position')).not.toBe('50%')
      frames.shift()!(performance.now() + 5000)
      await nextTick()
      expect((wrapper.element as HTMLElement).style.getPropertyValue('--m-before-after-position')).toBe('50%')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('then a key press cancels the swing', async () => {
      const wrapper = mountComponent({ hint: true })

      intersect.handler?.({ isIntersecting: true })
      await slider(wrapper).trigger('keydown', { key: 'End' })
      expect(cancelAnimationFrame).toHaveBeenCalled()
    })

    it('then nothing moves when the user reduces motion', () => {
      reduced.value = true
      mountComponent({ hint: true })

      expect(intersect.handler).toBeUndefined()
    })

    it('then unmounting stops the swing', () => {
      const wrapper = mountComponent({ hint: true })

      intersect.handler?.({ isIntersecting: true })
      wrapper.unmount()
      expect(cancelAnimationFrame).toHaveBeenCalled()
    })
  })
})
