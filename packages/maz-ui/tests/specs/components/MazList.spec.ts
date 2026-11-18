import MazList from '@components/MazList.vue'
import MazListItem from '@components/MazListItem.vue'
import { runAxe } from '@tests/helpers/axe'
import { mount } from '@vue/test-utils'
import { h } from 'vue'

function mountList(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  return mount(MazList, {
    props,
    slots: {
      default: () => [
        h(MazListItem, { title: 'First' }),
        h(MazListItem, { title: 'Second' }),
      ],
      ...slots,
    },
  })
}

describe('given MazList component', () => {
  describe('when rendered with default props', () => {
    it('then it renders a bordered list with dividers and its items', () => {
      const wrapper = mountList()
      const items = wrapper.find('.m-list__items')

      expect(items.attributes('role')).toBe('list')
      expect(items.classes()).toContain('--bordered')
      expect(items.classes()).toContain('--divider')
      expect(items.classes()).toContain('maz:rounded-lg')
      expect(wrapper.findAll('[role="listitem"]')).toHaveLength(2)
      expect(wrapper.find('.m-list__header').exists()).toBe(false)
      expect(wrapper.find('.m-list__footer').exists()).toBe(false)
    })
  })

  describe('when rendered with a title and a footer', () => {
    it('then the title labels the list and the footer is displayed', () => {
      const wrapper = mountList({ title: 'Advisories', footer: '3 in total' })
      const title = wrapper.find('.m-list__title')

      expect(title.text()).toBe('Advisories')
      expect(wrapper.find('.m-list__items').attributes('aria-labelledby')).toBe(title.attributes('id'))
      expect(wrapper.find('.m-list__footer').text()).toBe('3 in total')
    })
  })

  describe('when rendered with the header-end slot', () => {
    it('then the slot is displayed next to the title', () => {
      const wrapper = mountList({ title: 'Packages' }, {
        'header-end': () => 'See all',
      })

      expect(wrapper.find('.m-list__header-end').text()).toBe('See all')
    })
  })

  describe('when rendered without title but with an aria-label', () => {
    it('then the aria-label names the list', () => {
      const wrapper = mountList({ ariaLabel: 'Projects' })

      expect(wrapper.find('.m-list__items').attributes('aria-label')).toBe('Projects')
      expect(wrapper.find('.m-list__items').attributes('aria-labelledby')).toBeUndefined()
    })
  })

  describe('when rendered with bordered and divider disabled', () => {
    it('then neither the block nor the dividers are drawn', () => {
      const wrapper = mountList({ bordered: false, divider: false })
      const items = wrapper.find('.m-list__items')

      expect(items.classes()).not.toContain('--bordered')
      expect(items.classes()).not.toContain('--divider')
    })
  })

  describe('when rendered scrollable', () => {
    it('then only the items scroll, the list can shrink', () => {
      const wrapper = mountList({ scrollable: true, title: 'Repos' })
      const items = wrapper.find('.m-list__items')

      expect(wrapper.classes()).toContain('maz:min-h-0')
      expect(items.classes()).toContain('maz:overflow-y-auto')
      expect(items.classes()).not.toContain('maz:overflow-hidden')
      expect(wrapper.find('.m-list__header').element.contains(items.element)).toBe(false)
    })
  })

  describe('when not scrollable', () => {
    it('then the bordered block clips its items', () => {
      const items = mountList().find('.m-list__items')

      expect(items.classes()).toContain('maz:overflow-hidden')
      expect(items.classes()).not.toContain('maz:overflow-y-auto')
    })
  })

  describe('when rendered with a size', () => {
    it('then the items inherit it', () => {
      const wrapper = mountList({ size: 'sm' })

      expect(wrapper.find('.m-list-item__main').classes()).toContain('maz:min-h-9')
    })
  })
})

describe('given MazListItem component', () => {
  describe('when rendered with wrap', () => {
    it('then the title and the subtitle wrap instead of being truncated', () => {
      const truncated = mount(MazListItem, {
        props: { title: 'Launch at login', subtitle: 'A long description' },
      })
      const wrapped = mount(MazListItem, {
        props: { title: 'Launch at login', subtitle: 'A long description', wrap: true },
      })

      expect(truncated.find('.m-list-item__subtitle').classes()).toContain('maz:truncate')
      expect(wrapped.find('.m-list-item__title').classes()).not.toContain('maz:truncate')
      expect(wrapped.find('.m-list-item__subtitle').classes()).not.toContain('maz:truncate')
    })
  })

  describe('when rendered with a title, a subtitle and slots', () => {
    it('then it renders a static row with its content', () => {
      const wrapper = mount(MazListItem, {
        props: { title: 'lodash', subtitle: '3 projects' },
        slots: { start: 'icon', end: '2 major', actions: '<button>Fix</button>' },
      })
      const main = wrapper.find('.m-list-item__main')

      expect(main.element.tagName).toBe('DIV')
      expect(wrapper.find('.m-list-item__title').text()).toBe('lodash')
      expect(wrapper.find('.m-list-item__subtitle').text()).toBe('3 projects')
      expect(wrapper.find('.m-list-item__start').text()).toBe('icon')
      expect(main.find('.m-list-item__end').text()).toBe('2 major')
      expect(main.find('.m-list-item__actions').exists()).toBe(false)
      expect(wrapper.find('.m-list-item__actions button').text()).toBe('Fix')
    })
  })

  describe('when rendered without subtitle', () => {
    it('then no subtitle line is rendered', () => {
      const wrapper = mount(MazListItem, {
        props: { title: 'Only title' },
      })

      expect(wrapper.find('.m-list-item__subtitle').exists()).toBe(false)
    })
  })

  describe('when the row is clickable', () => {
    describe('when it is clicked', () => {
      it('then it emits click', async () => {
        const wrapper = mount(MazListItem, {
          props: { title: 'Row', clickable: true },
        })
        const main = wrapper.find('.m-list-item__main')

        await main.trigger('click')

        expect(main.element.tagName).toBe('BUTTON')
        expect(main.attributes('type')).toBe('button')
        expect(wrapper.emitted('click')).toHaveLength(1)
      })
    })

    describe('when it is disabled and clicked', () => {
      it('then it does not emit click', async () => {
        const wrapper = mount(MazListItem, {
          props: { title: 'Row', clickable: true, disabled: true },
        })

        await wrapper.find('.m-list-item__main').trigger('click')

        expect(wrapper.find('.m-list-item__main').attributes('disabled')).toBeDefined()
        expect(wrapper.emitted('click')).toBeUndefined()
      })
    })
  })

  describe('when the row is collapsible', () => {
    describe('when it is clicked twice', () => {
      it('then it toggles the open model and its aria-expanded', async () => {
        const wrapper = mount(MazListItem, {
          props: {
            'title': 'Repo',
            'collapsible': true,
            'onUpdate:open': (value: boolean) => wrapper.setProps({ open: value }),
          },
          slots: { default: 'Details' },
        })
        await vi.dynamicImportSettled()
        const main = wrapper.find('.m-list-item__main')

        expect(main.attributes('aria-expanded')).toBe('false')

        await main.trigger('click')

        expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
        expect(main.attributes('aria-expanded')).toBe('true')
        expect(wrapper.classes()).toContain('--open')

        await main.trigger('click')

        expect(wrapper.emitted('update:open')?.[1]).toEqual([false])
        expect(main.attributes('aria-expanded')).toBe('false')
      })
    })

    describe('when it is rendered open', () => {
      it('then the content is controlled by the row and receives the open state', async () => {
        const wrapper = mount(MazListItem, {
          props: {
            title: 'Repo',
            collapsible: true,
            open: true,
            contentClass: 'custom-content',
          },
          slots: {
            default: ({ open }: { open: boolean }) => (open ? 'Opened' : 'Closed'),
          },
        })
        await vi.dynamicImportSettled()
        const content = wrapper.find('.m-list-item__content')

        expect(content.text()).toBe('Opened')
        expect(content.classes()).toContain('custom-content')
        expect(wrapper.find(`#${wrapper.find('.m-list-item__main').attributes('aria-controls')}`).exists()).toBe(true)
      })
    })

    describe('when the row is lazy', () => {
      it('then the content is rendered at the first opening and kept after the closing', async () => {
        const wrapper = mount(MazListItem, {
          props: {
            'title': 'Repo',
            'collapsible': true,
            'lazy': true,
            'onUpdate:open': (value: boolean) => wrapper.setProps({ open: value }),
          },
          slots: { default: '<p class="lazy-content">Details</p>' },
        })
        await vi.dynamicImportSettled()
        const main = wrapper.find('.m-list-item__main')
        const controlsId = main.attributes('aria-controls')

        expect(wrapper.find('.lazy-content').exists()).toBe(false)
        expect(wrapper.find(`#${controlsId}`).exists()).toBe(true)

        await main.trigger('click')

        expect(wrapper.find('.lazy-content').exists()).toBe(true)

        await main.trigger('click')

        expect(wrapper.find('.lazy-content').exists()).toBe(true)
      })
    })

    describe('when the chevron is at the end', () => {
      it('then the chevron follows the trailing content', async () => {
        const wrapper = mount(MazListItem, {
          props: { title: 'Repo', collapsible: true, chevronPosition: 'end' },
          slots: { end: 'count' },
        })
        await vi.dynamicImportSettled()
        const children = wrapper.find('.m-list-item__main').element.children

        expect(children[children.length - 1].classList).toContain('m-list-item__chevron')
      })
    })
  })

  describe('when the row has an href', () => {
    it('then it is a link that emits click', async () => {
      const wrapper = mount(MazListItem, {
        props: { title: 'Docs', href: 'https://maz-ui.com', target: '_blank' },
      })
      const main = wrapper.find('.m-list-item__main')

      await main.trigger('click')

      expect(main.element.tagName).toBe('A')
      expect(main.attributes('href')).toBe('https://maz-ui.com')
      expect(main.attributes('rel')).toBe('noopener noreferrer')
      expect(main.attributes('type')).toBeUndefined()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })

  describe('when the link row is disabled', () => {
    it('then it is marked disabled and does not emit click', async () => {
      const wrapper = mount(MazListItem, {
        props: { title: 'Docs', href: '/docs', disabled: true },
      })

      await wrapper.find('.m-list-item__main').trigger('click')

      expect(wrapper.find('.m-list-item__main').attributes('aria-disabled')).toBe('true')
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('when the row is active', () => {
    it('then it is highlighted', () => {
      const wrapper = mount(MazListItem, {
        props: { title: 'Row', active: true },
      })

      expect(wrapper.classes()).toContain('--active')
      expect(wrapper.find('.m-list-item__row').classes()).toContain('maz:bg-foreground/3')
    })
  })

  describe('when rendered with a size outside of a list', () => {
    it('then it applies its own size', () => {
      const wrapper = mount(MazListItem, {
        props: { title: 'Row', size: 'lg' },
      })

      expect(wrapper.find('.m-list-item__main').classes()).toContain('maz:min-h-14')
    })
  })
})

describe('given a MazList with static, clickable and collapsible items', () => {
  describe('when it is audited with axe', () => {
    it('then it has no accessibility violations', async () => {
      const wrapper = mount(MazList, {
        props: { title: 'Projects', footer: '3 projects' },
        slots: {
          default: () => [
            h(MazListItem, { title: 'Static', subtitle: 'Read only' }),
            h(MazListItem, { title: 'Clickable', clickable: true }),
            h(MazListItem, { title: 'Collapsible', collapsible: true, open: true }, {
              default: () => 'Details',
            }),
          ],
        },
        attachTo: document.body,
      })
      await vi.dynamicImportSettled()

      expect(await runAxe(wrapper)).toHaveNoViolations()
      wrapper.unmount()
    })
  })
})
