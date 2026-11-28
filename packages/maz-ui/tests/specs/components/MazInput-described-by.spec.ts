import MazInput from '@components/MazInput.vue'
import { mount } from '@vue/test-utils'

describe('given a MazInput described by its parent', () => {
  describe('when the parent changes aria-describedby', () => {
    it('then the input follows it', async () => {
      const wrapper = mount(MazInput, { props: { modelValue: '' }, attrs: { 'aria-describedby': undefined } })

      await wrapper.setProps({ 'aria-describedby': 'strength' } as never)

      expect(wrapper.find('input').attributes('aria-describedby')).toBe('strength')
    })
  })
})

describe('given a clearable MazInput with a debounce', () => {
  describe('when the user types then clears the field before the delay', () => {
    it('then the typed value is not emitted after the clear', async () => {
      vi.useFakeTimers()
      const wrapper = mount(MazInput, { props: { modelValue: 'x', clearable: true, debounce: 500 } })

      await wrapper.find('input').setValue('abc')
      await wrapper.find('.m-input-clear').trigger('click')
      vi.advanceTimersByTime(600)

      expect(wrapper.emitted('update:model-value')?.at(-1)).toEqual([''])
      vi.useRealTimers()
    })
  })
})
