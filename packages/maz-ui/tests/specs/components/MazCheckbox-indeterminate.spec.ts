import MazCheckbox from '@components/MazCheckbox.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('given MazCheckbox with the indeterminate state', () => {
  describe('when indeterminate is true', () => {
    it('then the input is mixed for the browser and the assistive technologies', async () => {
      const wrapper = mount(MazCheckbox, { props: { modelValue: false, indeterminate: true, label: 'All' } })
      await nextTick()

      const input = wrapper.find('input').element as HTMLInputElement

      expect(input.indeterminate).toBe(true)
      expect(wrapper.find('input').attributes('aria-checked')).toBe('mixed')
      expect(wrapper.classes()).toContain('--indeterminate')
    })

    it('then the icon is a dash shown even when the model is false', () => {
      const wrapper = mount(MazCheckbox, { props: { modelValue: false, indeterminate: true } })
      const icon = wrapper.find('.check-icon')

      expect(icon.classes()).toContain('maz:scale-100')
      expect(icon.html()).toContain('M5 12h14')
    })
  })

  describe('when indeterminate is not set', () => {
    it('then the input is not mixed', () => {
      const wrapper = mount(MazCheckbox, { props: { modelValue: false } })

      expect((wrapper.find('input').element as HTMLInputElement).indeterminate).toBe(false)
      expect(wrapper.find('input').attributes('aria-checked')).toBeUndefined()
      expect(wrapper.find('.check-icon').classes()).toContain('maz:scale-0')
    })
  })

  describe('when the prop changes', () => {
    it('then the native property follows', async () => {
      const wrapper = mount(MazCheckbox, { props: { modelValue: false, indeterminate: false } })

      await wrapper.setProps({ indeterminate: true })
      expect((wrapper.find('input').element as HTMLInputElement).indeterminate).toBe(true)

      await wrapper.setProps({ indeterminate: false })
      expect((wrapper.find('input').element as HTMLInputElement).indeterminate).toBe(false)
    })
  })

  describe('when an indeterminate checkbox is clicked', () => {
    it('then it emits the opposite of the model and keeps the mixed state until the parent updates it', async () => {
      const wrapper = mount(MazCheckbox, { props: { modelValue: false, indeterminate: true } })

      await wrapper.find('input').setValue(true)
      await nextTick()

      expect(wrapper.emitted('update:model-value')).toEqual([[true]])
      expect((wrapper.find('input').element as HTMLInputElement).indeterminate).toBe(true)
    })
  })
})
