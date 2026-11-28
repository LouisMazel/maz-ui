import MazSlider from '@components/MazSlider.vue'
import { flushPromises, mount } from '@vue/test-utils'

describe('given MazSlider in a right-to-left context', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    const original = globalThis.getComputedStyle.bind(globalThis)
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementation((element: Element, pseudo?: string | null) => {
      const style = original(element, pseudo)

      return new Proxy(style, {
        get: (target, key) => key === 'direction' ? 'rtl' : Reflect.get(target, key) as unknown,
      })
    })
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.restoreAllMocks()
  })

  describe('when the arrow keys are pressed', () => {
    beforeEach(async () => {
      wrapper = mount(MazSlider, { props: { modelValue: 50 } })
      await flushPromises()
    })

    it('then ArrowLeft increases the value', async () => {
      await wrapper.find('.m-slider__btn').trigger('keydown', { key: 'ArrowLeft' })

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual([51])
    })

    it('then ArrowRight decreases the value', async () => {
      await wrapper.find('.m-slider__btn').trigger('keydown', { key: 'ArrowRight' })

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual([49])
    })

    it('then ArrowUp still increases the value', async () => {
      await wrapper.find('.m-slider__btn').trigger('keydown', { key: 'ArrowUp' })

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual([51])
    })
  })

  describe('when the cursor is dragged', () => {
    const BAR_WIDTH = 200

    beforeEach(async () => {
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(BAR_WIDTH)
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(BAR_WIDTH)
      wrapper = mount(MazSlider, { props: { modelValue: 0 } })
      await flushPromises()
    })

    it('then the pointer position is measured from the right edge', async () => {
      await wrapper.find('.m-slider__btn').trigger('mousedown')
      await wrapper.trigger('mousemove', { clientX: 150 })
      await flushPromises()
      await wrapper.trigger('mouseup')
      await flushPromises()

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual([25])
    })
  })

  describe('when the layout is computed', () => {
    beforeEach(async () => {
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(200)
      wrapper = mount(MazSlider, { props: { modelValue: 50 } })
      await flushPromises()
    })

    it('then the cursor is placed with a logical property', () => {
      const style = wrapper.find('.m-slider__btn').attributes('style') ?? ''

      expect(style).toContain('inset-inline-start')
      expect(style).not.toContain('left')
    })

    it('then the dividers use logical properties', () => {
      const style = wrapper.find('.m-slider__divider').attributes('style') ?? ''

      expect(style).toContain('inset-inline')
      expect(style).not.toContain('right')
    })
  })
})

describe('given MazSlider with motion options', () => {
  let wrapper: ReturnType<typeof mount>

  afterEach(() => {
    wrapper?.unmount()
  })

  describe('when ticks is enabled', () => {
    beforeEach(async () => {
      wrapper = mount(MazSlider, { props: { modelValue: 20, min: 0, max: 100, step: 25, ticks: true } })
      await flushPromises()
    })

    it('then a tick is rendered for each step', () => {
      expect(wrapper.findAll('.m-slider__tick')).toHaveLength(5)
    })

    it('then the ticks up to the snapped cursor are marked as passed', () => {
      const passed = wrapper.findAll('.m-slider__tick').map(tick => tick.attributes('data-passed'))

      expect(passed).toEqual(['true', 'true', 'false', 'false', 'false'])
    })

    it('then the ticks are hidden from assistive technologies', () => {
      expect(wrapper.find('.m-slider__ticks').attributes('aria-hidden')).toBe('true')
    })

    it('then the passed ticks follow the value', async () => {
      await wrapper.setProps({ modelValue: 60 })
      await flushPromises()

      const passed = wrapper.findAll('.m-slider__tick').filter(tick => tick.attributes('data-passed') === 'true')

      expect(passed).toHaveLength(3)
    })
  })

  describe('when ticks is enabled with several cursors', () => {
    it('then only the ticks between the cursors are passed', async () => {
      wrapper = mount(MazSlider, { props: { modelValue: [25, 75], min: 0, max: 100, step: 25, ticks: true } })
      await flushPromises()

      const passed = wrapper.findAll('.m-slider__tick').map(tick => tick.attributes('data-passed'))

      expect(passed).toEqual(['false', 'true', 'true', 'true', 'false'])
    })
  })

  describe('when ticks is not set', () => {
    it('then no tick is rendered', () => {
      wrapper = mount(MazSlider, { props: { modelValue: 20 } })

      expect(wrapper.find('.m-slider__ticks').exists()).toBe(false)
    })
  })

  describe('when ticks would be too many or the scale is logarithmic', () => {
    it('then no tick is rendered with too many steps', () => {
      wrapper = mount(MazSlider, { props: { modelValue: 20, min: 0, max: 1000, step: 1, ticks: true } })

      expect(wrapper.find('.m-slider__ticks').exists()).toBe(false)
    })

    it('then no tick is rendered with log', () => {
      wrapper = mount(MazSlider, { props: { modelValue: 20, min: 1, max: 100, step: 10, log: true, ticks: true } })

      expect(wrapper.find('.m-slider__ticks').exists()).toBe(false)
    })
  })

  describe('when the cursor is active', () => {
    beforeEach(async () => {
      wrapper = mount(MazSlider, { props: { modelValue: 42 } })
      await wrapper.find('.m-slider__btn').trigger('mousedown')
    })

    it('then the value is exposed to the bubble and the state is active', () => {
      const button = wrapper.find('.m-slider__btn')

      expect(button.attributes('data-value')).toBe('42')
      expect(button.attributes('data-state')).toBe('active')
    })
  })

  describe('when animated is false', () => {
    it('then the static class is set', () => {
      wrapper = mount(MazSlider, { props: { modelValue: 42, animated: false } })

      expect(wrapper.find('.m-slider').classes()).toContain('m-slider--static')
    })
  })

  describe('when labels are set', () => {
    it('then the labels class is set', () => {
      wrapper = mount(MazSlider, { props: { modelValue: 42, labels: ['a'] } })

      expect(wrapper.find('.m-slider').classes()).toContain('m-slider--labels')
    })
  })
})
