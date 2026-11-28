import MazExpandAnimation from '@components/MazExpandAnimation.vue'
import { mount } from '@vue/test-utils'

describe('given MazExpandAnimation tokens', () => {
  describe('when no duration nor timing function is given', () => {
    it('then the variables are not set and the theme tokens apply', () => {
      const wrapper = mount(MazExpandAnimation, { props: { modelValue: true } })
      const style = wrapper.attributes('style') ?? ''

      expect(style).not.toContain('--expand-animation-duration')
      expect(style).not.toContain('--expand-animation-timing-function')
    })
  })

  describe('when a timing function is given', () => {
    it('then it is set as a variable', () => {
      const wrapper = mount(MazExpandAnimation, { props: { timingFunction: 'linear' } })

      expect(wrapper.attributes('style')).toContain('--expand-animation-timing-function: linear')
    })
  })
})
