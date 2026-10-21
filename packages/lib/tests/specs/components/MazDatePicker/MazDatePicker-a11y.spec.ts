import MazDatePicker from '@components/MazDatePicker.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('given a MazDatePicker', () => {
  describe('when it is closed', () => {
    it('then its input is a collapsed combobox opening a dialog', async () => {
      const wrapper = mount(MazDatePicker, { props: { label: 'Date', locale: 'en-US', modelValue: '2024-01-15' } })
      await vi.dynamicImportSettled()

      const input = wrapper.find('.m-date-picker__input input')

      expect(input.attributes('role')).toBe('combobox')
      expect(input.attributes('aria-haspopup')).toBe('dialog')
      expect(input.attributes('aria-expanded')).toBe('false')
      expect(input.attributes('aria-controls')).toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('when it is open', () => {
    it('then its input is expanded and controls the picker panel', async () => {
      const wrapper = mount(MazDatePicker, { props: { label: 'Date', locale: 'en-US', modelValue: '2024-01-15', open: true }, attachTo: document.body })
      await vi.dynamicImportSettled()
      await nextTick()

      const input = wrapper.find('.m-date-picker__input input')

      expect(input.attributes('aria-expanded')).toBe('true')
      expect(document.getElementById(input.attributes('aria-controls') as string)?.getAttribute('role')).toBe('dialog')

      wrapper.unmount()
    })
  })
})
