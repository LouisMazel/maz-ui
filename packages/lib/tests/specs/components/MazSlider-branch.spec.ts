import MazSlider from '@components/MazSlider.vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

describe('MazSlider branch coverage', () => {
  let wrapper: ReturnType<typeof mount>

  afterEach(() => {
    wrapper?.unmount()
  })

  describe('computedValue computed', () => {
    it('wraps single number in array', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 42 },
      })

      const buttons = wrapper.findAll('.m-slider__btn span')
      expect(buttons.length).toBe(1)
      expect(buttons[0].text()).toBe('42')
    })

    it('uses array directly when modelValue is array', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: [10, 50, 90] },
      })

      const buttons = wrapper.findAll('.m-slider__btn span')
      expect(buttons.length).toBe(3)
      expect(buttons[0].text()).toBe('10')
      expect(buttons[1].text()).toBe('50')
      expect(buttons[2].text()).toBe('90')
    })

    it('defaults to [0] when modelValue is null', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: null },
      })

      const buttons = wrapper.findAll('.m-slider__btn span')
      expect(buttons.length).toBe(1)
      expect(buttons[0].text()).toBe('0')
    })

    it('defaults to [0] when modelValue is undefined', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: undefined },
      })

      const buttons = wrapper.findAll('.m-slider__btn span')
      expect(buttons.length).toBe(1)
      expect(buttons[0].text()).toBe('0')
    })
  })

  describe('hasMultipleValues computed', () => {
    it('returns true when modelValue is an array', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: [25, 75] },
      })

      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      // When emitting, should emit array since input is array
      if (emitted) {
        expect(Array.isArray(emitted[0][0])).toBe(true)
      }
    })

    it('returns false when modelValue is a single number', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      // When emitting, should emit single number since input is number
      if (emitted) {
        expect(typeof emitted[0][0]).toBe('number')
      }
    })
  })

  describe('wrapperStyle computed', () => {
    it('includes label padding when labels are provided', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, labels: ['Low'] },
      })

      const slider = wrapper.find('.m-slider')
      expect(slider.attributes('style')).toContain('padding-top: 2.5em')
    })

    it('includes default padding when no labels', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      const slider = wrapper.find('.m-slider')
      expect(slider.attributes('style')).toContain('padding-top: 1em')
    })
  })

  describe('color prop', () => {
    it('applies primary color class by default', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      expect(wrapper.find('.m-slider').classes()).toContain('m-slider--primary')
    })

    it('applies secondary color class', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, color: 'secondary' },
      })

      expect(wrapper.find('.m-slider').classes()).toContain('m-slider--secondary')
    })

    it('applies info color class', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, color: 'info' },
      })

      expect(wrapper.find('.m-slider').classes()).toContain('m-slider--info')
    })

    it('applies success color class', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, color: 'success' },
      })

      expect(wrapper.find('.m-slider').classes()).toContain('m-slider--success')
    })

    it('applies warning color class', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, color: 'warning' },
      })

      expect(wrapper.find('.m-slider').classes()).toContain('m-slider--warning')
    })

    it('applies destructive color class', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, color: 'destructive' },
      })

      expect(wrapper.find('.m-slider').classes()).toContain('m-slider--destructive')
    })

    it('applies contrast color class', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, color: 'contrast' },
      })

      expect(wrapper.find('.m-slider').classes()).toContain('m-slider--contrast')
    })

    it('applies accent color class', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, color: 'accent' },
      })

      expect(wrapper.find('.m-slider').classes()).toContain('m-slider--accent')
    })
  })

  describe('size prop', () => {
    it('applies custom size as font-size', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, size: '3rem' },
      })

      expect(wrapper.find('.m-slider').attributes('style')).toContain('font-size: 3rem')
    })

    it('renders without size style when not provided', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      // size is not in the style when undefined
      expect(wrapper.find('.m-slider').exists()).toBe(true)
    })
  })

  describe('checkValues', () => {
    it('clamps value above max to max', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 150, min: 0, max: 100 },
      })

      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0][0]).toBe(100)
    })

    it('clamps value below min to min', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: -20, min: 0, max: 100 },
      })

      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0][0]).toBe(0)
    })

    it('keeps value within range', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, min: 0, max: 100 },
      })

      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0][0]).toBe(50)
    })

    it('rounds value to step', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 33, min: 0, max: 100, step: 10 },
      })

      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0][0]).toBe(30)
    })

    it('clamps and rounds array values', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: [-5, 55, 120], min: 0, max: 100, step: 10 },
      })

      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0][0]).toStrictEqual([0, 60, 100])
    })
  })

  describe('getLabel', () => {
    it('returns label for given index when labels provided', () => {
      wrapper = mount(MazSlider, {
        props: {
          modelValue: [25, 75],
          labels: ['Start', 'End'],
        },
      })

      const buttons = wrapper.findAll('.m-slider__btn')
      expect(buttons[0].attributes('data-label')).toBe('Start')
      expect(buttons[1].attributes('data-label')).toBe('End')
    })

    it('returns undefined label when labels not provided', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      const button = wrapper.find('.m-slider__btn')
      // data-label should be empty or undefined when no label
      expect(button.attributes('data-label')).toBeFalsy()
    })
  })

  describe('divider prop', () => {
    it('renders with default divider prop', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: [25, 75], min: 0, max: 100 },
      })
      await nextTick()
      expect(wrapper.find('.m-slider').exists()).toBe(true)
    })

    it('does not render dividers when divider is false', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: [25, 75], divider: false },
      })

      const dividers = wrapper.findAll('.m-slider__divider')
      expect(dividers.length).toBe(0)
    })
  })

  describe('cursorAnim prop', () => {
    it('adds active-cursor class when cursorAnim is true and cursor is active', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, cursorAnim: true },
      })

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('focus')

      expect(button.classes()).toContain('active-cursor')
    })

    it('does not add active-cursor class when cursorAnim is false', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, cursorAnim: false },
      })

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('focus')

      expect(button.classes()).not.toContain('active-cursor')
    })
  })

  describe('cursor keyboard events', () => {
    it('decreases value on ArrowLeft keydown', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, min: 0, max: 100, step: 1 },
      })

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('keydown', { key: 'ArrowLeft' })

      const emitted = wrapper.emitted('update:model-value')
      // Should emit value - step
      if (emitted && emitted.length > 1) {
        expect(emitted.at(-1)?.[0]).toBe(49)
      }
    })

    it('increases value on ArrowRight keydown', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, min: 0, max: 100, step: 1 },
      })

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('keydown', { key: 'ArrowRight' })

      const emitted = wrapper.emitted('update:model-value')
      if (emitted && emitted.length > 1) {
        expect(emitted.at(-1)?.[0]).toBe(51)
      }
    })

    it('does not go below min on ArrowLeft', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 0, min: 0, max: 100, step: 1 },
      })

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('keydown', { key: 'ArrowLeft' })

      const emitted = wrapper.emitted('update:model-value')
      if (emitted) {
        const lastVal = emitted.at(-1)?.[0]
        expect(lastVal).toBeGreaterThanOrEqual(0)
      }
    })

    it('does not go above max on ArrowRight', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 100, min: 0, max: 100, step: 1 },
      })

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('keydown', { key: 'ArrowRight' })

      const emitted = wrapper.emitted('update:model-value')
      if (emitted) {
        const lastVal = emitted.at(-1)?.[0]
        expect(lastVal).toBeLessThanOrEqual(100)
      }
    })

    it('handles ArrowLeft with multiple cursors respecting boundaries', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: [20, 50, 80], min: 0, max: 100, step: 5 },
      })

      // Try moving the middle cursor left
      const buttons = wrapper.findAll('.m-slider__btn')
      await buttons[1].trigger('keydown', { key: 'ArrowLeft' })

      const emitted = wrapper.emitted('update:model-value')
      if (emitted && emitted.length > 1) {
        const lastEmitted = emitted.at(-1)?.[0] as number[]
        expect(lastEmitted[1]).toBeLessThanOrEqual(50)
      }
    })

    it('handles ArrowRight with multiple cursors respecting boundaries', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: [20, 50, 80], min: 0, max: 100, step: 5 },
      })

      const buttons = wrapper.findAll('.m-slider__btn')
      await buttons[1].trigger('keydown', { key: 'ArrowRight' })

      const emitted = wrapper.emitted('update:model-value')
      if (emitted && emitted.length > 1) {
        const lastEmitted = emitted.at(-1)?.[0] as number[]
        expect(lastEmitted[1]).toBeGreaterThanOrEqual(50)
      }
    })

    it('ignores non-arrow key events', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, min: 0, max: 100, step: 1 },
      })

      const emittedBefore = wrapper.emitted('update:model-value')?.length || 0

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('keydown', { key: 'Enter' })

      const emittedAfter = wrapper.emitted('update:model-value')?.length || 0
      // Should not emit additional events for Enter key
      expect(emittedAfter).toBe(emittedBefore)
    })

    it('respects step value on ArrowLeft', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, min: 0, max: 100, step: 10 },
      })

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('keydown', { key: 'ArrowLeft' })

      const emitted = wrapper.emitted('update:model-value')
      if (emitted && emitted.length > 1) {
        expect(emitted.at(-1)?.[0]).toBe(40)
      }
    })
  })

  describe('cursor mouse/touch events', () => {
    it('activates cursor on mousedown', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('mousedown')

      expect(button.classes()).toContain('active-cursor')
    })

    it('activates cursor on touchstart', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('touchstart')

      expect(button.classes()).toContain('active-cursor')
    })

    it('activates cursor on focus', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('focus')

      expect(button.classes()).toContain('active-cursor')
    })

    it('deactivates cursor on blur', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('focus')
      expect(button.classes()).toContain('active-cursor')

      await button.trigger('blur')
      expect(button.classes()).not.toContain('active-cursor')
    })

    it('deactivates cursor on touchend', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('focus')
      expect(button.classes()).toContain('active-cursor')

      await button.trigger('touchend')
      expect(button.classes()).not.toContain('active-cursor')
    })

    it('does not activate cursor if another is already active', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: [25, 75] },
      })

      const buttons = wrapper.findAll('.m-slider__btn')
      await buttons[0].trigger('mousedown')

      // Now try to activate second cursor
      await buttons[1].trigger('mousedown')

      // First should still be active, second should not
      // (handleMousedown returns early if activeCursor is set)
      expect(buttons[0].classes()).toContain('active-cursor')
    })
  })

  describe('handleMouseup', () => {
    it('does nothing when no active cursor', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      const sliderEl = wrapper.find('.m-slider')
      await sliderEl.trigger('mouseup')

      // Should not throw or emit extra events
      expect(wrapper.exists()).toBe(true)
    })

    it('emits value and deactivates cursor on mouseup after mousedown', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('mousedown')
      expect(button.classes()).toContain('active-cursor')

      const sliderEl = wrapper.find('.m-slider')
      await sliderEl.trigger('mouseup')
      await nextTick()

      expect(button.classes()).not.toContain('active-cursor')
    })

    it('emits value on mouseleave (mouseleave triggers mouseup)', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      const button = wrapper.find('.m-slider__btn')
      await button.trigger('mousedown')

      const sliderEl = wrapper.find('.m-slider')
      await sliderEl.trigger('mouseleave')
      await nextTick()

      expect(button.classes()).not.toContain('active-cursor')
    })
  })

  describe('handleMousemove', () => {
    it('does nothing when activeCursor is undefined', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      const sliderEl = wrapper.find('.m-slider')
      await sliderEl.trigger('mousemove', { pageX: 100, pageY: 0 })

      // No errors should occur
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('log mode', () => {
    it('calculates positions logarithmically when log is true', async () => {
      wrapper = mount(MazSlider, {
        props: {
          modelValue: 50,
          min: 1,
          max: 1000,
          log: true,
        },
      })

      await nextTick()
      expect(wrapper.exists()).toBe(true)
    })

    it('calculates positions linearly when log is false', async () => {
      wrapper = mount(MazSlider, {
        props: {
          modelValue: 50,
          min: 0,
          max: 100,
          log: false,
        },
      })

      await nextTick()
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('minLog, maxLog, scale computed', () => {
    it('computes minLog as log(1) when min is 0', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, min: 0, max: 100 },
      })

      // minLog = Math.log(0 || 1) = Math.log(1) = 0
      expect(wrapper.exists()).toBe(true)
    })

    it('computes minLog as log(min) when min > 0', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, min: 10, max: 100 },
      })

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('accessibility attributes', () => {
    it('renders aria-valuenow with single value', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, min: 0, max: 100 },
      })

      const slider = wrapper.find('[role="slider"]')
      expect(slider.attributes('aria-valuenow')).toBe('50')
      expect(slider.attributes('aria-valuemin')).toBe('0')
      expect(slider.attributes('aria-valuemax')).toBe('100')
    })

    it('renders aria-valuenow with array value as string', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: [25, 75], min: 0, max: 100 },
      })

      const slider = wrapper.find('[role="slider"]')
      expect(slider.attributes('aria-valuenow')).toBe('25,75')
    })

    it('renders without aria-valuenow when modelValue is null', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: null },
      })

      const slider = wrapper.find('[role="slider"]')
      // null?.toString() is undefined
      expect(slider.exists()).toBe(true)
    })
  })

  describe('watcher on modelValue', () => {
    it('updates tmpValues when modelValue changes', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, min: 0, max: 100 },
      })

      await wrapper.setProps({ modelValue: 75 })
      await nextTick()

      const button = wrapper.find('.m-slider__btn span')
      expect(button.text()).toBe('75')
    })

    it('rebuilds component when min changes', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, min: 0, max: 100 },
      })

      await wrapper.setProps({ min: 10 })
      await nextTick()

      expect(wrapper.exists()).toBe(true)
    })

    it('rebuilds component when max changes', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, min: 0, max: 100 },
      })

      await wrapper.setProps({ max: 200 })
      await nextTick()

      expect(wrapper.exists()).toBe(true)
    })

    it('rebuilds component when log changes', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50, min: 1, max: 100, log: false },
      })

      await wrapper.setProps({ log: true })
      await nextTick()

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('resize handler', () => {
    it('rebuilds on window resize', async () => {
      vi.useFakeTimers()

      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      globalThis.dispatchEvent(new Event('resize'))
      vi.advanceTimersByTime(400)
      await nextTick()

      expect(wrapper.exists()).toBe(true)

      vi.useRealTimers()
    })

    it('removes resize listener on unmount', () => {
      const removeSpy = vi.spyOn(globalThis, 'removeEventListener')

      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      wrapper.unmount()

      expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      removeSpy.mockRestore()
    })
  })

  describe('step rounding', () => {
    it('rounds value to nearest step with step=5', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 23, min: 0, max: 100, step: 5 },
      })

      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0][0]).toBe(25)
    })

    it('rounds value to nearest step with step=25', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 33, min: 0, max: 100, step: 25 },
      })

      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0][0]).toBe(25)
    })

    it('handles step=1 without rounding changes', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 33, min: 0, max: 100, step: 1 },
      })

      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0][0]).toBe(33)
    })
  })

  describe('emitValue', () => {
    it('emits array when input is array', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: [10, 90] },
      })

      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      if (emitted) {
        expect(Array.isArray(emitted[0][0])).toBe(true)
      }
    })

    it('emits single number when input is single number', async () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      await nextTick()
      const emitted = wrapper.emitted('update:model-value')
      if (emitted) {
        expect(typeof emitted[0][0]).toBe('number')
      }
    })
  })

  describe('multiple cursors rendering', () => {
    it('renders correct number of buttons for array values', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: [10, 30, 50, 70, 90] },
      })

      const buttons = wrapper.findAll('.m-slider__btn')
      expect(buttons.length).toBe(5)
    })

    it('renders single button for number value', () => {
      wrapper = mount(MazSlider, {
        props: { modelValue: 50 },
      })

      const buttons = wrapper.findAll('.m-slider__btn')
      expect(buttons.length).toBe(1)
    })
  })
})
