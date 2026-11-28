import MazListItem from '@components/MazListItem.vue'
import { mount } from '@vue/test-utils'

describe('given a clickable list item', () => {
  describe('when it is rendered', () => {
    it('then the row has the focus ring of the theme and the fast token as duration', () => {
      const wrapper = mount(MazListItem, { props: { title: 'Row', clickable: true } })
      const classes = wrapper.get('.m-list-item__main').classes()

      expect(classes).toContain('maz:focus-ring')
      expect(classes).toContain('maz:duration-(--duration-fast)')
      expect(classes).not.toContain('maz:duration-150')
    })
  })
})

describe('given a collapsible list item', () => {
  describe('when it is rendered', () => {
    it('then the chevron turns with the normal token and the spring easing', async () => {
      const wrapper = mount(MazListItem, { props: { title: 'Row', collapsible: true, open: true } })
      await vi.dynamicImportSettled()
      await wrapper.vm.$nextTick()
      const classes = wrapper.get('.m-list-item__chevron').classes()

      expect(classes).toContain('maz:duration-(--duration-normal)')
      expect(classes).toContain('maz:ease-spring')
      expect(classes).toContain('maz:rotate-90')
    })
  })
})
