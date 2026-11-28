import MazBadge from '@components/MazBadge.vue'
import { mount } from '@vue/test-utils'

describe('given MazBadge motion', () => {
  describe('when animated and the content is a number', () => {
    it('then the number is rendered by MazRollingText and reads once for a screen reader', () => {
      const wrapper = mount(MazBadge, { props: { animated: true }, slots: { default: '12' } })

      expect(wrapper.find('.m-rolling-text').exists()).toBe(true)
      expect(wrapper.find('.m-rolling-text .maz\\:sr-only').text()).toBe('12')
      expect(wrapper.find('.m-rolling-text__chars').attributes('aria-hidden')).toBe('true')
    })

    it('then a decimal number is rolled too', () => {
      const wrapper = mount(MazBadge, { props: { animated: true }, slots: { default: ' 3.5 ' } })

      expect(wrapper.find('.m-rolling-text').exists()).toBe(true)
    })
  })

  describe('when animated and the content is a text', () => {
    it('then the slot is rendered as is', () => {
      const wrapper = mount(MazBadge, { props: { animated: true }, slots: { default: 'New' } })

      expect(wrapper.find('.m-rolling-text').exists()).toBe(false)
      expect(wrapper.text()).toBe('New')
    })

    it('then a text with several nodes is not rolled', () => {
      const wrapper = mount(MazBadge, { props: { animated: true }, slots: { default: '<b>1</b>2' } })

      expect(wrapper.find('.m-rolling-text').exists()).toBe(false)
    })
  })

  describe('when not animated', () => {
    it('then a number stays a plain text', () => {
      const wrapper = mount(MazBadge, { slots: { default: '12' } })

      expect(wrapper.find('.m-rolling-text').exists()).toBe(false)
      expect(wrapper.text()).toBe('12')
    })
  })

  describe('when there is no slot', () => {
    it('then nothing is rolled', () => {
      const wrapper = mount(MazBadge, { props: { animated: true } })

      expect(wrapper.find('.m-rolling-text').exists()).toBe(false)
    })
  })
})
