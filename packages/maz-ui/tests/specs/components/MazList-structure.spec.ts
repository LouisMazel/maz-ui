import MazList from '@components/MazList.vue'
import MazListItem from '@components/MazListItem.vue'
import MazListSeparator from '@components/MazListSeparator.vue'
import { mount } from '@vue/test-utils'
import { h } from 'vue'

describe('given MazList without items', () => {
  describe('when only a title is provided', () => {
    it('then the items block is not rendered', () => {
      const wrapper = mount(MazList, { props: { title: 'Empty' } })

      expect(wrapper.find('.m-list__title').text()).toBe('Empty')
      expect(wrapper.find('.m-list__items').exists()).toBe(false)
    })
  })

  describe('when the default slot renders nothing', () => {
    it('then the items block is not rendered', () => {
      const wrapper = mount(MazList, { props: { title: 'Empty' }, slots: { default: () => [] } })

      expect(wrapper.find('.m-list__items').exists()).toBe(false)
    })
  })
})

describe('given MazList with only the header-end slot', () => {
  describe('when no title is provided', () => {
    it('then the header row is rendered with the end content and without an empty title', () => {
      const wrapper = mount(MazList, {
        slots: {
          'default': () => h(MazListItem, { title: 'A' }),
          'header-end': () => h('button', { class: 'action' }, 'Add'),
        },
      })

      expect(wrapper.find('.m-list__header').exists()).toBe(true)
      expect(wrapper.find('.m-list__header .action').exists()).toBe(true)
      expect(wrapper.find('.m-list__title').exists()).toBe(false)
      expect(wrapper.find('.m-list__items').attributes('aria-labelledby')).toBeUndefined()
    })
  })
})

describe('given MazListSeparator', () => {
  describe('when rendered', () => {
    it('then it is exposed as a list item with its title', () => {
      const wrapper = mount(MazListSeparator, { props: { title: 'Group' } })

      expect(wrapper.attributes('role')).toBe('listitem')
      expect(wrapper.text()).toBe('Group')
    })
  })

  describe('when a title is provided between items', () => {
    it('then the title is rendered inside the list', () => {
      const wrapper = mount(MazList, {
        slots: {
          default: () => [
            h(MazListItem, { title: 'A' }),
            h(MazListSeparator, { title: 'Group B' }),
            h(MazListItem, { title: 'B' }),
          ],
        },
      })

      expect(wrapper.find('.m-list-separator').text()).toBe('Group B')
      expect(wrapper.findAll('.m-list-item')).toHaveLength(2)
    })
  })

  describe('when the default slot is used', () => {
    it('then the slot replaces the title', () => {
      const wrapper = mount(MazListSeparator, { props: { title: 'Ignored' }, slots: { default: '<b>Rich</b>' } })

      expect(wrapper.find('b').text()).toBe('Rich')
    })
  })
})

describe('given MazListItem with a content zone', () => {
  describe('when the row is not collapsible and has a default slot', () => {
    it('then the content is always visible under the row, outside of the clickable area', () => {
      const wrapper = mount(MazListItem, { props: { title: 'Row', clickable: true }, slots: { default: '<input class="field">' } })

      expect(wrapper.find('.m-list-item__content .field').exists()).toBe(true)
      expect(wrapper.find('.m-list-item__main .field').exists()).toBe(false)
    })

    it('then content-class replaces the default padding', () => {
      const wrapper = mount(MazListItem, { props: { title: 'Row', contentClass: 'maz:p-8' }, slots: { default: 'Body' } })

      expect(wrapper.find('.m-list-item__content').classes()).toContain('maz:p-8')
    })
  })

  describe('when the row is not collapsible and has no default slot', () => {
    it('then no content zone is rendered', () => {
      const wrapper = mount(MazListItem, { props: { title: 'Row' } })

      expect(wrapper.find('.m-list-item__content').exists()).toBe(false)
    })
  })
})
