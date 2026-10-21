import type { VueWrapper } from '@vue/test-utils'
import MazPickerCalendar from '@components/MazDatePicker/MazPickerCalendar.vue'
import MazPickerCalendarDays from '@components/MazDatePicker/MazPickerCalendarMonth/MazPickerCalendarDays.vue'
import MazPickerCalendarGrid from '@components/MazDatePicker/MazPickerCalendarMonth/MazPickerCalendarGrid.vue'
import MazPickerCalendarMonth from '@components/MazDatePicker/MazPickerCalendarMonth/MazPickerCalendarMonth.vue'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs/esm'
import isBetween from 'dayjs/esm/plugin/isBetween'
import { nextTick } from 'vue'

dayjs.extend(isBetween)

const mountedWrappers: VueWrapper[] = []

afterEach(() => {
  mountedWrappers.splice(0).forEach(wrapper => wrapper.unmount())
})

const gridProps = {
  calendarDate: '2024-01-15',
  hasTime: false,
  locale: 'en-US',
  firstDayOfWeek: 0,
  color: 'primary' as const,
  inline: false,
  disabledWeekly: [] as number[],
  disabledDates: [] as string[],
  disabled: false,
  range: false,
}

async function mountGrid(props: Partial<typeof gridProps> & Record<string, unknown> = {}) {
  const wrapper = mount(MazPickerCalendarGrid, { props: { ...gridProps, ...props }, attachTo: document.body })
  mountedWrappers.push(wrapper)
  await vi.dynamicImportSettled()
  await nextTick()
  return wrapper
}

function getDay(wrapper: VueWrapper, dateKey: string) {
  return wrapper.find<HTMLButtonElement>(`[data-date="${dateKey}"]`)
}

describe('given the calendar grid of a month', () => {
  describe('when it is rendered', () => {
    it('then the days are split in rows of gridcells', async () => {
      const wrapper = await mountGrid()
      const rows = wrapper.findAll('[role="row"]')

      expect(rows).toHaveLength(5)
      expect(rows[0].findAll('[role="gridcell"]')).toHaveLength(7)
      expect(wrapper.findAll('[role="gridcell"] button')).toHaveLength(31)
    })

    it('then each day has a full date label and hides its number', async () => {
      const wrapper = await mountGrid()
      const day = getDay(wrapper, '2024-01-15')

      expect(day.attributes('aria-label')).toBe('Monday, January 15, 2024')
      expect(day.find('span').attributes('aria-hidden')).toBe('true')
    })

    it('then the first enabled day is the only day in the tab sequence', async () => {
      const wrapper = await mountGrid()
      const tabbable = wrapper.findAll('[data-date][tabindex="0"]')

      expect(tabbable).toHaveLength(1)
      expect(tabbable[0].attributes('data-date')).toBe('2024-01-01')
    })
  })

  describe('when a day is selected', () => {
    it('then its cell is selected and the day is in the tab sequence', async () => {
      const wrapper = await mountGrid({ modelValue: '2024-01-20' })
      const day = getDay(wrapper, '2024-01-20')

      expect(day.element.parentElement?.getAttribute('aria-selected')).toBe('true')
      expect(getDay(wrapper, '2024-01-19').element.parentElement?.hasAttribute('aria-selected')).toBe(false)
      expect(day.attributes('tabindex')).toBe('0')
    })
  })

  describe('when a range is selected', () => {
    it('then the start and the days between are selected and the start is in the tab sequence', async () => {
      const wrapper = await mountGrid({ range: true, modelValue: { start: '2024-01-10', end: '2024-01-12' } })

      expect(['10', '11', '12'].map(day => getDay(wrapper, `2024-01-${day}`).element.parentElement?.getAttribute('aria-selected'))).toEqual(['true', 'true', 'true'])
      expect(getDay(wrapper, '2024-01-10').attributes('tabindex')).toBe('0')
    })
  })

  describe('when the month is the current month', () => {
    it('then today is the current date and is in the tab sequence', async () => {
      const today = dayjs()
      const wrapper = await mountGrid({ calendarDate: today.format() })
      const day = getDay(wrapper, today.format('YYYY-MM-DD'))

      expect(day.attributes('aria-current')).toBe('date')
      expect(day.attributes('tabindex')).toBe('0')
    })
  })

  describe('when the first days are disabled', () => {
    it('then the first enabled day is in the tab sequence', async () => {
      const wrapper = await mountGrid({ minDate: '2024-01-05' })

      expect(getDay(wrapper, '2024-01-05').attributes('tabindex')).toBe('0')
    })
  })

  describe.each([
    ['ArrowRight', '2024-01-16'],
    ['ArrowLeft', '2024-01-14'],
    ['ArrowDown', '2024-01-22'],
    ['ArrowUp', '2024-01-08'],
    ['Home', '2024-01-14'],
    ['End', '2024-01-20'],
  ])('when %s is pressed on a day', (key, expectedDate) => {
    it(`then ${expectedDate} is focused and becomes the tab stop`, async () => {
      const wrapper = await mountGrid()
      const day = getDay(wrapper, '2024-01-15')

      day.element.focus()
      await day.trigger('keydown', { key })
      await nextTick()

      const target = getDay(wrapper, expectedDate)
      expect(document.activeElement).toBe(target.element)
      expect(target.attributes('tabindex')).toBe('0')
      expect(day.attributes('tabindex')).toBe('-1')
    })
  })

  describe('when the direction is right-to-left', () => {
    it('then ArrowLeft moves to the next day', async () => {
      const wrapper = await mountGrid()
      wrapper.find<HTMLElement>('.maz-picker-calendar-grid').element.style.direction = 'rtl'

      await getDay(wrapper, '2024-01-15').trigger('keydown', { key: 'ArrowLeft' })

      expect(document.activeElement).toBe(getDay(wrapper, '2024-01-16').element)
    })
  })

  describe('when the next day is disabled', () => {
    it('then the focus skips it', async () => {
      const wrapper = await mountGrid({ disabledDates: ['2024-01-16'] })

      await getDay(wrapper, '2024-01-15').trigger('keydown', { key: 'ArrowRight' })

      expect(document.activeElement).toBe(getDay(wrapper, '2024-01-17').element)
    })
  })

  describe('when the next day is after the max date', () => {
    it('then the focus does not move', async () => {
      const wrapper = await mountGrid({ maxDate: '2024-01-15' })
      const day = getDay(wrapper, '2024-01-15')

      day.element.focus()
      await day.trigger('keydown', { key: 'ArrowRight' })

      expect(document.activeElement).toBe(day.element)
      expect(wrapper.emitted('navigate')).toBeUndefined()
    })
  })

  describe('when the previous day is before the min date', () => {
    it('then the focus does not move', async () => {
      const wrapper = await mountGrid({ minDate: '2024-01-15' })
      const day = getDay(wrapper, '2024-01-15')

      day.element.focus()
      await day.trigger('keydown', { key: 'ArrowLeft' })

      expect(document.activeElement).toBe(day.element)
    })
  })

  describe('when every following day is disabled', () => {
    it('then the focus does not move', async () => {
      const wrapper = await mountGrid({ disabledWeekly: [0, 1, 2, 3, 4, 5, 6] })
      const day = getDay(wrapper, '2024-01-15')

      await day.trigger('keydown', { key: 'ArrowRight' })

      expect(wrapper.emitted('navigate')).toBeUndefined()
    })
  })

  describe('when the arrows leave the displayed month', () => {
    it('then the grid asks to navigate to the day', async () => {
      const wrapper = await mountGrid()

      await getDay(wrapper, '2024-01-31').trigger('keydown', { key: 'ArrowRight' })

      expect(dayjs(wrapper.emitted('navigate')?.[0]?.[0] as string).format('YYYY-MM-DD')).toBe('2024-02-01')
    })
  })

  describe.each([
    ['PageDown', false, '2024-02-15'],
    ['PageUp', false, '2023-12-15'],
    ['PageDown', true, '2025-01-15'],
    ['PageUp', true, '2023-01-15'],
  ])('when %s is pressed with shift %s', (key, shiftKey, expectedDate) => {
    it(`then the grid asks to navigate to ${expectedDate}`, async () => {
      const wrapper = await mountGrid()

      await getDay(wrapper, '2024-01-15').trigger('keydown', { key, shiftKey })

      expect(dayjs(wrapper.emitted('navigate')?.[0]?.[0] as string).format('YYYY-MM-DD')).toBe(expectedDate)
    })
  })

  describe('when another key is pressed', () => {
    it('then nothing happens', async () => {
      const wrapper = await mountGrid()
      const day = getDay(wrapper, '2024-01-15')

      day.element.focus()
      await day.trigger('keydown', { key: 'a' })

      expect(document.activeElement).toBe(day.element)
      expect(wrapper.emitted('navigate')).toBeUndefined()
    })
  })
})

describe('given the days of the week', () => {
  describe('when they are rendered', () => {
    it('then they are a row of column headers with the full day name', () => {
      const wrapper = mount(MazPickerCalendarDays, { props: { locale: 'en-US', firstDayOfWeek: 1 } })
      const headers = wrapper.findAll('[role="columnheader"]')

      expect(wrapper.attributes('role')).toBe('row')
      expect(headers).toHaveLength(7)
      expect(headers[0].attributes('aria-label')).toBe('Monday')
      expect(headers[0].text()).toBe('Mon')
    })
  })
})

describe('given a calendar month', () => {
  describe('when it is rendered', () => {
    it('then it is a grid labelled by its month', async () => {
      const wrapper = mount(MazPickerCalendarMonth, { props: { ...gridProps, offsetMonth: 1 } })
      mountedWrappers.push(wrapper)
      await vi.dynamicImportSettled()

      expect(wrapper.attributes('role')).toBe('grid')
      expect(wrapper.attributes('aria-label')).toBe('February 2024')
    })
  })
})

const calendarProps = {
  modelValue: undefined,
  calendarDate: '2024-01-15',
  color: 'primary' as const,
  locale: 'en-US',
  inline: false,
  firstDayOfWeek: 0,
  double: false,
  minDate: undefined,
  maxDate: undefined,
  disabledWeekly: [] as number[],
  disabledDates: [] as string[],
  shortcuts: false as const,
  hasTime: false,
  shortcut: undefined,
  disabled: false,
  range: false,
}

async function mountCalendar(props: Partial<typeof calendarProps> = {}) {
  const wrapper = mount(MazPickerCalendar, {
    props: {
      ...calendarProps,
      ...props,
      'onUpdate:calendarDate': (calendarDate: string) => wrapper.setProps({ calendarDate }),
    },
    attachTo: document.body,
  })
  mountedWrappers.push(wrapper)
  await vi.dynamicImportSettled()
  await nextTick()
  return wrapper
}

describe('given a calendar', () => {
  describe('when the keyboard leaves the displayed month', () => {
    it('then the calendar shows the next month and focuses the day', async () => {
      const wrapper = await mountCalendar()

      await wrapper.find('[data-date="2024-01-31"]').trigger('keydown', { key: 'ArrowRight' })
      await vi.dynamicImportSettled()
      await nextTick()

      expect(dayjs(wrapper.props('calendarDate')).format('YYYY-MM')).toBe('2024-02')
      expect(document.activeElement?.getAttribute('data-date')).toBe('2024-02-01')
    })
  })

  describe('when the keyboard goes before the displayed month', () => {
    it('then the calendar shows the previous month', async () => {
      const wrapper = await mountCalendar()

      await wrapper.find('[data-date="2024-01-01"]').trigger('keydown', { key: 'ArrowLeft' })
      await vi.dynamicImportSettled()
      await nextTick()

      expect(dayjs(wrapper.props('calendarDate')).format('YYYY-MM')).toBe('2023-12')
      expect(document.activeElement?.getAttribute('data-date')).toBe('2023-12-31')
    })
  })

  describe('when two months are displayed and the keyboard goes to the second one', () => {
    it('then the calendar does not move and focuses the day', async () => {
      const wrapper = await mountCalendar({ double: true })

      await wrapper.find('[data-date="2024-01-31"]').trigger('keydown', { key: 'ArrowRight' })
      await nextTick()

      expect(wrapper.props('calendarDate')).toBe('2024-01-15')
      expect(document.activeElement?.getAttribute('data-date')).toBe('2024-02-01')
    })
  })

  describe('when two months are displayed and the keyboard leaves the second one', () => {
    it('then the calendar moves by one month', async () => {
      const wrapper = await mountCalendar({ double: true })

      await wrapper.find('[data-date="2024-02-29"]').trigger('keydown', { key: 'ArrowRight' })
      await vi.dynamicImportSettled()
      await nextTick()

      expect(dayjs(wrapper.props('calendarDate')).format('YYYY-MM')).toBe('2024-02')
      expect(document.activeElement?.getAttribute('data-date')).toBe('2024-03-01')
    })
  })
})
