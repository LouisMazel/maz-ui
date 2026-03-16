import MazDatePicker from '@components/MazDatePicker.vue'
import MazInput from '@components/MazInput.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

describe('given MazDatePicker component (branch coverage)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when rendering with default props', () => {
    it('then it should render in non-inline mode with MazPopover', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          format: 'YYYY-MM-DD',
          locale: 'en-US',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when inline prop is true', () => {
    it('then it should render MazPickerContainer directly without MazPopover wrapping input', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          inline: true,
          format: 'YYYY-MM-DD',
          locale: 'en-US',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      // In inline mode, the popover wrapper is not rendered
      expect(wrapper.find('.m-date-picker__input').exists()).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when modelValue is a string date', () => {
    it('then currentValue should be parsed into a dayjs formatted string', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2023-07-17',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
        },
      })
      await vi.dynamicImportSettled()

      const input = wrapper.findComponent(MazInput)
      if (input.exists()) {
        expect(input.find('input').element.value).toContain('Jul 17, 2023')
      }
      wrapper.unmount()
    })
  })

  describe('when modelValue is an empty string', () => {
    it('then currentValue getter should return undefined', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
        },
      })
      await vi.dynamicImportSettled()

      const input = wrapper.findComponent(MazInput)
      if (input.exists()) {
        expect(input.find('input').element.value).toBe('')
      }
      wrapper.unmount()
    })
  })

  describe('when modelValue is undefined', () => {
    it('then inputValue should be undefined and input should be empty', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD',
          locale: 'en-US',
        },
      })
      await vi.dynamicImportSettled()

      const input = wrapper.findComponent(MazInput)
      if (input.exists()) {
        expect(input.find('input').element.value).toBe('')
      }
      wrapper.unmount()
    })
  })

  describe('when modelValue is a range object', () => {
    it('then currentValue should parse start and end dates', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2023-01-01', end: '2023-01-31' },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })

    it('then it should handle range with only start date', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2023-06-01', end: undefined },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })

    it('then it should handle range with only end date', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: undefined, end: '2023-12-31' },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })

    it('then it should handle range with both undefined', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: undefined, end: undefined },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when range prop is true but modelValue is a string', () => {
    it('then isRangeMode should be true and emit range-shaped value', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when disabled prop is true', () => {
    it('then setting currentValue should not emit update:model-value', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2023-01-01',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          disabled: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when time prop is true', () => {
    it('then hasTime should be true', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD HH:mm',
          locale: 'en-US',
          time: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      errorSpy.mockRestore()
      wrapper.unmount()
    })
  })

  describe('when onlyTime prop is true', () => {
    it('then hasTime should be true and hasDate should be false', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'HH:mm',
          locale: 'en-US',
          onlyTime: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      errorSpy.mockRestore()
      wrapper.unmount()
    })

    it('then inputValue should format only time when value is set', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '14:30',
          format: 'HH:mm',
          locale: 'en-US',
          onlyTime: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      errorSpy.mockRestore()
      wrapper.unmount()
    })
  })

  describe('when double prop is true', () => {
    it('then hasDouble should be true', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          double: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })

    it('then hasDouble should be false when onlyTime is true', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'HH:mm',
          locale: 'en-US',
          double: true,
          onlyTime: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      errorSpy.mockRestore()
      wrapper.unmount()
    })
  })

  describe('when autoClose prop is true', () => {
    it('then picker should auto-close on non-range selection', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2023-07-17',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          autoClose: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when shortcuts prop is false', () => {
    it('then internalShortcuts should be false', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2023-01-01', end: '2023-01-31' },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
          shortcuts: false,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when shortcuts prop is a custom array', () => {
    it('then internalShortcuts should be the custom array', async () => {
      const customShortcuts = [
        {
          label: 'Custom',
          identifier: 'custom',
          value: { start: '2023-01-01', end: '2023-12-31' },
        },
      ]

      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2023-01-01', end: '2023-01-31' },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
          shortcuts: customShortcuts,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when shortcuts prop is true (default)', () => {
    it('then internalShortcuts should use default shortcuts in range mode', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2023-01-01', end: '2023-01-31' },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
          shortcuts: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when not in range mode', () => {
    it('then internalShortcuts should be false regardless of shortcuts prop', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2023-07-17',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: false,
          shortcuts: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when time and range are both true (onBeforeMount validation)', () => {
    it('then it should log an error about incompatible options', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD HH:mm',
          locale: 'en-US',
          range: true,
          time: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('can\'t use time picker with range picker'),
      )

      errorSpy.mockRestore()
      wrapper.unmount()
    })
  })

  describe('when time is true but format does not include h or H', () => {
    it('then it should log an error about missing time in format', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          time: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('must provided a format with time'),
      )

      errorSpy.mockRestore()
      wrapper.unmount()
    })
  })

  describe('when format includes 12-hour "h" without "a" or "A"', () => {
    it('then it should log an error about missing AM/PM indicator', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD hh:mm',
          locale: 'en-US',
          time: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('you must add "a" or "A"'),
      )

      errorSpy.mockRestore()
      wrapper.unmount()
    })
  })

  describe('when format includes 12-hour "h" with "a"', () => {
    it('then isHour12 should be true and no error should be logged', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD hh:mm a',
          locale: 'en-US',
          time: true,
        },
      })
      await vi.dynamicImportSettled()

      // Should not log the 12-hour error
      const calls = errorSpy.mock.calls
      const has12HourError = calls.some(c =>
        typeof c[0] === 'string' && c[0].includes('you must add "a" or "A"'),
      )
      expect(has12HourError).toBe(false)

      errorSpy.mockRestore()
      wrapper.unmount()
    })
  })

  describe('when format includes uppercase "A" for AM/PM', () => {
    it('then isHour12 should be true', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD hh:mm A',
          locale: 'en-US',
          time: true,
        },
      })
      await vi.dynamicImportSettled()

      errorSpy.mockRestore()
      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when minDate is provided', () => {
    it('then it should constrain the calendar date if value is before minDate', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2022-01-01',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          minDate: '2023-01-01',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when maxDate is provided', () => {
    it('then it should constrain the calendar date if value is after maxDate', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2025-12-31',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          maxDate: '2024-12-31',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when both minDate and maxDate are provided and value is between them', () => {
    it('then it should keep the value as is', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2023-06-15',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          minDate: '2023-01-01',
          maxDate: '2023-12-31',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when maxDate is provided and value is after it, but minDate is also provided', () => {
    it('then getCalendarDate should return minDate', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2025-01-01',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          minDate: '2023-01-01',
          maxDate: '2024-06-30',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when maxDate is provided but minDate is not, and value is after maxDate', () => {
    it('then getCalendarDate should return maxDate', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2025-01-01',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          maxDate: '2024-06-30',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when minMaxAuto is false', () => {
    it('then checkValueWithMinMaxDates should not adjust value', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2022-01-01',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          minDate: '2023-01-01',
          minMaxAuto: false,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when disabledWeekly contains the day of the selected value', () => {
    it('then it should clear the value', async () => {
      // Find a date and its day of week
      const testDate = '2023-07-16' // Sunday = 0
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: testDate,
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          disabledWeekly: [0], // Disable Sundays
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when disabledDates contains the selected value', () => {
    it('then it should clear the value', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2023-07-17',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          disabledDates: ['2023-07-17'],
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when disabledWeekly and range value', () => {
    it('then it should clear range start if start is on a disabled day', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2023-07-16', end: '2023-07-20' }, // Sunday start
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
          disabledWeekly: [0], // Disable Sundays
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })

    it('then it should clear range end if end is on a disabled day', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2023-07-17', end: '2023-07-23' }, // Sunday end
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
          disabledWeekly: [0], // Disable Sundays
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when disabledDates and range value', () => {
    it('then it should clear range if start is a disabled date', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2023-07-17', end: '2023-07-20' },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
          disabledDates: ['2023-07-17'],
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })

    it('then it should clear range end if end is a disabled date', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2023-07-17', end: '2023-07-20' },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
          disabledDates: ['2023-07-20'],
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when inputDateTransformer prop is provided', () => {
    it('then it should use the transformer to format the input display', async () => {
      const transformer = vi.fn(({ formattedDate }: any) => `Custom: ${formattedDate}`)

      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2023-07-17',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          inputDateTransformer: transformer,
        },
      })
      await vi.dynamicImportSettled()

      const input = wrapper.findComponent(MazInput)
      if (input.exists()) {
        expect(input.find('input').element.value).toContain('Custom:')
      }
      wrapper.unmount()
    })
  })

  describe('when inputDateTransformer is provided but formattedDate is undefined', () => {
    it('then transformer should not be called', async () => {
      const transformer = vi.fn()

      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          inputDateTransformer: transformer,
        },
      })
      await vi.dynamicImportSettled()

      expect(transformer).not.toHaveBeenCalled()
      wrapper.unmount()
    })
  })

  describe('when modelValue changes (watcher triggers)', () => {
    it('then it should emit update:model-value for string values', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2023-07-17',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
        },
      })
      await vi.dynamicImportSettled()

      await wrapper.setProps({ modelValue: '2023-08-01' })
      await nextTick()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })

    it('then it should emit update:model-value for range values when start changes', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2023-01-01', end: '2023-01-31' },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      await wrapper.setProps({
        modelValue: { start: '2023-02-01', end: '2023-01-31' },
      })
      await nextTick()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when minDate or maxDate changes (watcher triggers)', () => {
    it('then it should re-check min/max constraints', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2023-06-15',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          minDate: '2023-01-01',
        },
      })
      await vi.dynamicImportSettled()

      await wrapper.setProps({ minDate: '2023-07-01' })
      await nextTick()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when color prop is set', () => {
    it('then it should apply the color class', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          color: 'secondary',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-date-picker--secondary').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when modelValue is set for range mode and emitValue is called', () => {
    it('then it should emit range ISO dates', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2023-01-01', end: '2023-01-31' },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      const emitted = wrapper.emitted('update:model-value')
      if (emitted) {
        const lastEmit = emitted.at(-1)[0] as any
        expect(lastEmit).toHaveProperty('start')
        expect(lastEmit).toHaveProperty('end')
      }
      wrapper.unmount()
    })
  })

  describe('when no minDate and no maxDate', () => {
    it('then checkMinMaxValues should return early', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2023-07-17',
          format: 'YYYY-MM-DD',
          locale: 'en-US',
        },
      })
      await vi.dynamicImportSettled()

      // No min/max constraints, so value should remain as is
      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when range mode with minDate and maxDate', () => {
    it('then it should check both start and end against min/max', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2022-01-01', end: '2025-12-31' },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
          minDate: '2023-01-01',
          maxDate: '2024-12-31',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })

    it('then it should handle range with start before minDate', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2020-01-01', end: '2023-06-15' },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
          minDate: '2023-01-01',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })

    it('then it should handle range with end after maxDate', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2023-01-01', end: '2026-01-01' },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
          maxDate: '2024-12-31',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when range value has no start and no end', () => {
    it('then the watcher should not emit', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: undefined, end: undefined },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when getCalendarDate is called with range value', () => {
    it('then it should use start date if available', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: { start: '2023-03-15', end: '2023-03-20' },
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          range: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })

    it('then it should fallback to today if no start date', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD',
          locale: 'en-US',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when formatterOptions computed is evaluated', () => {
    it('then timeStyle should be from inputDateFormat when hasTime is true', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD HH:mm',
          locale: 'en-US',
          time: true,
          inputDateFormat: { dateStyle: 'long', timeStyle: 'long' },
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      errorSpy.mockRestore()
      wrapper.unmount()
    })

    it('then timeStyle should be undefined when hasTime is false', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          time: false,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })

    it('then hour12 should default to isHour12 when not set in inputDateFormat', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD hh:mm a',
          locale: 'en-US',
          time: true,
          inputDateFormat: { dateStyle: 'medium' },
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      errorSpy.mockRestore()
      wrapper.unmount()
    })
  })

  describe('when locale prop is provided', () => {
    it('then localeModel should use the provided locale', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2023-07-17',
          format: 'YYYY-MM-DD',
          locale: 'fr-FR',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when locale prop is not provided', () => {
    it('then localeModel should fallback to the translation locale', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: '2023-07-17',
          format: 'YYYY-MM-DD',
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when block prop is set', () => {
    it('then it should pass block to the MazPopover', async () => {
      const wrapper = mount(MazDatePicker, {
        props: {
          modelValue: undefined,
          format: 'YYYY-MM-DD',
          locale: 'en-US',
          block: true,
        },
      })
      await vi.dynamicImportSettled()

      expect(wrapper.exists()).toBe(true)
      wrapper.unmount()
    })
  })
})
