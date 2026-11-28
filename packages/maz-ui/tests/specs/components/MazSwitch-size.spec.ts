import MazSwitch from '@components/MazSwitch.vue'
import { mount } from '@vue/test-utils'

describe('given MazSwitch with a size', () => {
  describe.each([
    ['xl', '2rem'],
    ['lg', '1.75rem'],
    ['md', '1.5rem'],
    ['sm', '1.25rem'],
    ['xs', '1rem'],
    ['mini', '0.75rem'],
  ] as const)('when size is %s', (size, height) => {
    it(`then the track is ${height} high like the checkbox of the same size`, () => {
      const wrapper = mount(MazSwitch, { props: { size } })

      expect(wrapper.attributes('style')).toContain(`--switch-height: ${height}`)
    })
  })

  describe('when no size is given', () => {
    it('then the switch keeps the md size', () => {
      const wrapper = mount(MazSwitch)

      expect(wrapper.attributes('style')).toContain('--switch-height: 1.5rem')
    })
  })
})
