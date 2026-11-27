import MazAlert from '@components/MazAlert.vue'
import { mount } from '@vue/test-utils'

describe('given MazAlert', () => {
  describe('when its color is destructive or warning', () => {
    it.each(['destructive', 'warning'] as const)('then a %s alert interrupts the screen reader', (color) => {
      const wrapper = mount(MazAlert, { props: { color, content: 'Message' } })

      expect(wrapper.attributes('role')).toBe('alert')
    })
  })

  describe('when its color is info, success or primary', () => {
    it.each(['info', 'success', 'primary'] as const)('then a %s alert waits for a pause of the screen reader', (color) => {
      const wrapper = mount(MazAlert, { props: { color, content: 'Message' } })

      expect(wrapper.attributes('role')).toBe('status')
    })
  })

  describe('when a role is given', () => {
    it('then it replaces the default one', () => {
      const wrapper = mount(MazAlert, { props: { color: 'info', role: 'alert', content: 'Message' } })

      expect(wrapper.attributes('role')).toBe('alert')
    })
  })
})
