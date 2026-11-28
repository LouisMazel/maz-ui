import MazPagination from '@components/MazPagination.vue'
import { mount } from '@vue/test-utils'

function mountPagination(props: Record<string, unknown> = {}) {
  return mount(MazPagination, {
    props: { totalPages: 20, modelValue: 1, ...props },
    attachTo: document.body,
  })
}

function pageNumbers(wrapper: ReturnType<typeof mountPagination>) {
  return wrapper.findAll('li[id]').map(item => item.attributes('id')?.startsWith('button') ? 'page' : 'ellipsis')
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('given a pagination with fixedSlots', () => {
  describe('when the current page moves along the pages', () => {
    it('then it renders the same number of items on every page', async () => {
      const wrapper = mountPagination({ fixedSlots: true })
      const counts = new Set<number>()

      for (const page of [1, 2, 3, 4, 5, 6, 10, 15, 16, 17, 18, 19, 20]) {
        await wrapper.setProps({ modelValue: page })
        counts.add(wrapper.findAll('li').length)
      }

      expect([...counts]).toHaveLength(1)
    })

    it('then the current page is always in the list with the first and the last page', () => {
      const wrapper = mountPagination({ fixedSlots: true, modelValue: 10 })
      const labels = wrapper.findAll('button[aria-label^="Page"]').map(button => button.attributes('aria-label'))

      expect(labels).toEqual(['Page 1', 'Page 9', 'Page 10', 'Page 11', 'Page 20'])
    })
  })

  describe('when there are few pages', () => {
    it('then every page is rendered without ellipsis', () => {
      const wrapper = mountPagination({ fixedSlots: true, totalPages: 5, modelValue: 3 })

      expect(wrapper.findAll('button[aria-label^="Page"]')).toHaveLength(5)
      expect(pageNumbers(wrapper)).not.toContain('ellipsis')
    })
  })
})

describe('given a pagination without fixedSlots', () => {
  describe('when it is on the first page', () => {
    it('then it keeps the compact list of pages', () => {
      const wrapper = mountPagination()

      expect(wrapper.findAll('button[aria-label^="Page"]')).toHaveLength(3)
    })
  })
})

describe('given a pagination', () => {
  describe('when the buttons are solid', () => {
    it('then a pill slides under the current page', () => {
      const wrapper = mountPagination()

      expect(wrapper.find('.m-pagination__pill').exists()).toBe(true)
      expect(wrapper.find('.m-pagination__pill').attributes('aria-hidden')).toBe('true')
    })
  })

  describe('when the buttons are soft', () => {
    it('then there is no pill', () => {
      const wrapper = mountPagination({ buttonProps: { variant: 'soft' } })

      expect(wrapper.find('.m-pagination__pill').exists()).toBe(false)
    })
  })

  describe('when the numbers are displayed', () => {
    it('then each number is a rolling text', () => {
      const wrapper = mountPagination()

      expect(wrapper.findAllComponents({ name: 'MazRollingText' }).length).toBe(3)
    })
  })

  describe('when it is rendered', () => {
    it('then only the current page is in the tab sequence', () => {
      const wrapper = mountPagination({ modelValue: 2 })
      const tabbable = wrapper.findAll('button').filter(button => button.attributes('tabindex') === '0')

      expect(tabbable).toHaveLength(1)
      expect(tabbable[0].attributes('aria-current')).toBe('page')
    })
  })

  describe('when the arrows are pressed', () => {
    it('then the focus moves to the next enabled button and the tab stop follows', async () => {
      const wrapper = mountPagination({ modelValue: 2 })
      const buttons = wrapper.findAll<HTMLElement>('button')

      await buttons[3].trigger('keydown', { key: 'ArrowRight' })

      expect(document.activeElement).toBe(buttons[4].element)
      expect(buttons[4].attributes('tabindex')).toBe('0')
      expect(buttons[3].attributes('tabindex')).toBe('-1')
    })

    it('then End goes to the last button and the disabled ones are skipped', async () => {
      const wrapper = mountPagination({ modelValue: 1 })
      const buttons = wrapper.findAll<HTMLElement>('button')

      await buttons[2].trigger('keydown', { key: 'Home' })

      expect(document.activeElement).toBe(buttons[2].element)

      await buttons[2].trigger('keydown', { key: 'End' })

      expect(document.activeElement).toBe(buttons.at(-1)!.element)
    })
  })

  describe('when the current page is the last one', () => {
    it('then the disabled last buttons are never the tab stop', () => {
      const wrapper = mountPagination({ modelValue: 20 })
      const tabbable = wrapper.findAll('button').filter(button => button.attributes('tabindex') === '0')

      expect(tabbable).toHaveLength(1)
      expect(tabbable[0].attributes('aria-current')).toBe('page')
    })
  })
})
