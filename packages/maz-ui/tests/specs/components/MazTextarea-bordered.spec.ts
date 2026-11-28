import MazTextarea from '@components/MazTextarea.vue'
import { mount } from '@vue/test-utils'

function hasBorder(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.maz\\:border-solid').exists()
}

describe('given a MazTextarea', () => {
  describe('when neither bordered nor border is set', () => {
    it('then it has a border', () => {
      expect(hasBorder(mount(MazTextarea))).toBe(true)
    })
  })

  describe('when bordered is false', () => {
    it('then it has no border', () => {
      expect(hasBorder(mount(MazTextarea, { props: { bordered: false } }))).toBe(false)
    })
  })

  describe('when the deprecated border is false', () => {
    it('then it has no border', () => {
      expect(hasBorder(mount(MazTextarea, { props: { border: false } }))).toBe(false)
    })
  })
})
