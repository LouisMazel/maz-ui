import MazInputNumber from '@components/MazInputNumber.vue'
import { mount } from '@vue/test-utils'

describe('given MazInputNumber prefix and suffix', () => {
  describe('when prefix and suffix props are provided', () => {
    it('then they are rendered around the number inside the field', async () => {
      const wrapper = mount(MazInputNumber, { props: { modelValue: 5, prefix: '$', suffix: 'min' } })
      await vi.dynamicImportSettled()

      expect(wrapper.find('.m-input-wrapper-start').text()).toBe('$')
      expect(wrapper.find('.m-input-wrapper-end').text()).toBe('min')
    })
  })

  describe('when the prefix and suffix slots are provided', () => {
    it('then the slots replace the texts', () => {
      const wrapper = mount(MazInputNumber, {
        props: { modelValue: 5, prefix: 'ignored' },
        slots: { prefix: '<b class="p">EUR</b>', suffix: '<b class="s">kg</b>' },
      })

      expect(wrapper.find('.m-input-wrapper-start .p').text()).toBe('EUR')
      expect(wrapper.find('.m-input-wrapper-end .s').text()).toBe('kg')
    })
  })

  describe('when neither is provided', () => {
    it('then no start nor end zone is rendered', () => {
      const wrapper = mount(MazInputNumber, { props: { modelValue: 5 } })

      expect(wrapper.find('.m-input-wrapper-start').exists()).toBe(false)
      expect(wrapper.find('.m-input-wrapper-end').exists()).toBe(false)
    })
  })
})
