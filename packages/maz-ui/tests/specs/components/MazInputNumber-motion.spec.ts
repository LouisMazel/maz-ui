import MazInputNumber from '@components/MazInputNumber.vue'
import { flushPromises, mount, shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('given MazInputNumber with the hold to repeat', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when the increment button is held', () => {
    it('then the value keeps increasing after the delay', async () => {
      const wrapper = shallowMount(MazInputNumber, { props: { modelValue: 5 } })
      const button = wrapper.find('.m-input-number__increment-button')

      await button.trigger('pointerdown', { button: 0 })
      vi.advanceTimersByTime(399)

      expect(wrapper.emitted('update:model-value')).toBeUndefined()

      vi.advanceTimersByTime(1)

      expect(wrapper.emitted('update:model-value')).toHaveLength(1)

      vi.advanceTimersByTime(160 + 148 + 136)

      expect(wrapper.emitted('update:model-value')).toHaveLength(4)
    })

    it('then the repeat accelerates down to the minimum interval', async () => {
      const wrapper = shallowMount(MazInputNumber, { props: { modelValue: 5 } })

      await wrapper.find('.m-input-number__increment-button').trigger('pointerdown', { button: 0 })
      vi.advanceTimersByTime(400)
      vi.advanceTimersByTime(2000)
      const count = wrapper.emitted('update:model-value')?.length ?? 0
      vi.advanceTimersByTime(400)
      const afterMinimum = (wrapper.emitted('update:model-value')?.length ?? 0) - count

      expect(afterMinimum).toBe(10)
    })

    it('then the click that ends the hold does not step again', async () => {
      const wrapper = shallowMount(MazInputNumber, { props: { modelValue: 5 } })
      const button = wrapper.find('.m-input-number__increment-button')

      await button.trigger('pointerdown', { button: 0 })
      vi.advanceTimersByTime(400)
      globalThis.dispatchEvent(new Event('pointerup'))
      await button.trigger('click')

      expect(wrapper.emitted('update:model-value')).toHaveLength(1)
    })

    it('then releasing the pointer before the delay keeps a single click step', async () => {
      const wrapper = shallowMount(MazInputNumber, { props: { modelValue: 5 } })
      const button = wrapper.find('.m-input-number__increment-button')

      await button.trigger('pointerdown', { button: 0 })
      vi.advanceTimersByTime(200)
      globalThis.dispatchEvent(new Event('pointerup'))
      vi.advanceTimersByTime(1000)
      await button.trigger('click')

      expect(wrapper.emitted('update:model-value')).toHaveLength(1)
    })

    it('then the repeat stops when the maximum is reached', async () => {
      const wrapper = shallowMount(MazInputNumber, { props: { modelValue: 10, max: 10 } })

      await wrapper.find('.m-input-number__increment-button').trigger('pointerdown', { button: 0 })
      vi.advanceTimersByTime(2000)

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })

    it('then a decrement button repeats downward', async () => {
      const wrapper = shallowMount(MazInputNumber, { props: { modelValue: 5 } })

      await wrapper.find('.m-input-number__decrement-button').trigger('pointerdown', { button: 0 })
      vi.advanceTimersByTime(400)

      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([4])
    })

    it('then a secondary mouse button does not start the repeat', async () => {
      const wrapper = shallowMount(MazInputNumber, { props: { modelValue: 5 } })

      await wrapper.find('.m-input-number__increment-button').trigger('pointerdown', { button: 2 })
      vi.advanceTimersByTime(1000)

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })

    it('then the repeat stops when the component unmounts', async () => {
      const wrapper = shallowMount(MazInputNumber, { props: { modelValue: 5 } })

      await wrapper.find('.m-input-number__increment-button').trigger('pointerdown', { button: 0 })
      wrapper.unmount()
      vi.advanceTimersByTime(1000)

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })

  describe('when animated is false', () => {
    it('then holding a button does not repeat', async () => {
      const wrapper = shallowMount(MazInputNumber, { props: { modelValue: 5, animated: false } })

      await wrapper.find('.m-input-number__increment-button').trigger('pointerdown', { button: 0 })
      vi.advanceTimersByTime(1000)

      expect(wrapper.emitted('update:model-value')).toBeUndefined()
    })
  })
})

describe('given MazInputNumber with the sliding value', () => {
  const animate = vi.fn()

  beforeEach(() => {
    animate.mockReset()
    animate.mockReturnValue({ cancel: vi.fn() })
    Object.defineProperty(HTMLElement.prototype, 'animate', { value: animate, configurable: true, writable: true })
  })

  afterEach(() => {
    Reflect.deleteProperty(HTMLElement.prototype, 'animate')
  })

  describe('when a button is clicked', () => {
    it('then the input slides up for an increment', async () => {
      const wrapper = mount(MazInputNumber, { props: { modelValue: 5 } })
      await flushPromises()

      await wrapper.find('.m-input-number__increment-button').trigger('click')
      await nextTick()

      expect(animate).toHaveBeenCalledTimes(1)
      expect(animate.mock.calls[0][0][0].transform).toBe('translateY(30%)')
    })

    it('then the input slides down for a decrement', async () => {
      const wrapper = mount(MazInputNumber, { props: { modelValue: 5 } })
      await flushPromises()

      await wrapper.find('.m-input-number__decrement-button').trigger('click')
      await nextTick()

      expect(animate.mock.calls[0][0][0].transform).toBe('translateY(-30%)')
    })

    it('then a second click cancels the running slide', async () => {
      const cancel = vi.fn()
      animate.mockReturnValue({ cancel })
      const wrapper = mount(MazInputNumber, { props: { modelValue: 5 } })
      await flushPromises()

      await wrapper.find('.m-input-number__increment-button').trigger('click')
      await nextTick()
      await wrapper.find('.m-input-number__increment-button').trigger('click')
      await nextTick()

      expect(cancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('when animated is false', () => {
    it('then the input does not slide', async () => {
      const wrapper = mount(MazInputNumber, { props: { modelValue: 5, animated: false } })
      await flushPromises()

      await wrapper.find('.m-input-number__increment-button').trigger('click')
      await nextTick()

      expect(animate).not.toHaveBeenCalled()
    })
  })

  describe('when the arrow key is pressed', () => {
    it('then the input does not slide', async () => {
      const wrapper = mount(MazInputNumber, { props: { modelValue: 5 } })
      await flushPromises()

      await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' })
      await nextTick()

      expect(animate).not.toHaveBeenCalled()
    })
  })
})
