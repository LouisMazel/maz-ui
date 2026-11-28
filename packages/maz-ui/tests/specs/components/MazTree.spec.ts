import type { MazTreeItem } from '@components/MazTree.vue'
import MazTree from '@components/MazTree.vue'
import { flushPromises, mount } from '@vue/test-utils'

const items: MazTreeItem[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'a', label: 'alpha.ts', status: 'added' },
      { id: 'b', label: 'beta.ts', status: 'modified' },
      { id: 'c', label: 'gamma.ts', status: 'deleted' },
      { id: 'off', label: 'off.ts', disabled: true },
    ],
  },
  { id: 'docs', label: 'docs', children: [{ id: 'd1', label: 'guide.md' }] },
  { id: 'remote', label: 'remote', lazy: true },
  { id: 'readme', label: 'README.md' },
]

function mountTree(props: Record<string, unknown> = {}) {
  return mount(MazTree, { props: { items, label: 'Files', ...props }, attachTo: document.body })
}

function item(wrapper: ReturnType<typeof mount>, id: string) {
  return wrapper.find(`[data-id="${id}"]`)
}

function row(wrapper: ReturnType<typeof mount>, id: string) {
  return item(wrapper, id).find('.m-tree__row')
}

async function press(wrapper: ReturnType<typeof mount>, id: string, key: string, options: Record<string, unknown> = {}) {
  await item(wrapper, id).trigger('keydown', { key, ...options })
  await flushPromises()
}

describe('given a MazTree', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('when it renders', () => {
    it('then it follows the tree pattern', () => {
      const wrapper = mountTree()

      expect(wrapper.attributes('role')).toBe('tree')
      expect(wrapper.attributes('aria-label')).toBe('Files')
      expect(wrapper.attributes('aria-multiselectable')).toBeUndefined()
      expect(item(wrapper, 'src').attributes('aria-expanded')).toBe('false')
      expect(item(wrapper, 'src').attributes('aria-level')).toBe('1')
      expect(item(wrapper, 'src').attributes('aria-setsize')).toBe('4')
      expect(item(wrapper, 'docs').attributes('aria-posinset')).toBe('2')
      expect(item(wrapper, 'readme').attributes('aria-expanded')).toBeUndefined()
    })

    it('then only one item is in the tab sequence', () => {
      const wrapper = mountTree()
      const tabbable = wrapper.findAll('[role="treeitem"]').filter(element => element.attributes('tabindex') === '0')

      expect(tabbable).toHaveLength(1)
      expect(tabbable[0]!.attributes('data-id')).toBe('src')
    })

    it('then the folders closed at start do not render their children', () => {
      const wrapper = mountTree()

      expect(item(wrapper, 'a').exists()).toBe(false)
    })

    it('then the open folders render their children with the right levels', () => {
      const wrapper = mountTree({ expanded: ['src'] })

      expect(item(wrapper, 'a').attributes('aria-level')).toBe('2')
      expect(item(wrapper, 'src').attributes('aria-expanded')).toBe('true')
      expect(item(wrapper, 'src').find('[role="group"]').exists()).toBe(true)
    })

    it('then the status marks are readable and the disabled item is marked', () => {
      const wrapper = mountTree({ expanded: ['src'] })

      expect(item(wrapper, 'a').find('.m-tree__status--added').exists()).toBe(true)
      expect(item(wrapper, 'b').find('.m-tree__status--modified').exists()).toBe(true)
      expect(row(wrapper, 'c').classes()).toContain('m-tree__row--deleted')
      expect(item(wrapper, 'a').find('.m-tree__status .maz\\:sr-only').exists()).toBe(true)
      expect(item(wrapper, 'off').attributes('aria-disabled')).toBe('true')
    })

    it('then the item slot replaces the label', () => {
      const wrapper = mount(MazTree, {
        props: { items, expanded: ['src'] },
        slots: { item: '<template #item="{ item, level }">{{ item.label.toUpperCase() }}-{{ level }}</template>' },
      })

      expect(item(wrapper, 'readme').find('.m-tree__label').text()).toBe('README.MD-1')
      expect(item(wrapper, 'a').find('.m-tree__label').text()).toBe('ALPHA.TS-2')
    })
  })

  describe('when a row is clicked in single mode', () => {
    it('then it selects the item and marks it', async () => {
      const wrapper = mountTree()

      await row(wrapper, 'readme').trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['readme'])
      expect(item(wrapper, 'readme').attributes('aria-selected')).toBe('true')
      expect(item(wrapper, 'src').attributes('aria-selected')).toBe('false')
    })

    it('then a folder opens and is selected', async () => {
      const wrapper = mountTree()

      await row(wrapper, 'src').trigger('click')

      expect(wrapper.emitted('update:expanded')?.[0]).toEqual([['src']])
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['src'])
    })

    it('then the chevron only toggles the folder', async () => {
      const wrapper = mountTree()

      await item(wrapper, 'src').find('.m-tree__chevron').trigger('click')
      expect(wrapper.emitted('update:expanded')?.[0]).toEqual([['src']])
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()

      await item(wrapper, 'src').find('.m-tree__chevron').trigger('click')
      expect(wrapper.emitted('update:expanded')?.[1]).toEqual([[]])
    })

    it('then a disabled item ignores the click', async () => {
      const wrapper = mountTree({ expanded: ['src'] })

      await row(wrapper, 'off').trigger('click')
      await item(wrapper, 'off').find('.m-tree__chevron').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('then the folder animates open: the panel opens after render', async () => {
      const wrapper = mountTree()

      await item(wrapper, 'src').find('.m-tree__chevron').trigger('click')
      await wrapper.setProps({ expanded: ['src'] })
      await flushPromises()

      expect(item(wrapper, 'src').find('.m-tree__panel').classes()).toContain('m-tree__panel--open')

      await wrapper.setProps({ expanded: [] })
      expect(item(wrapper, 'src').find('.m-tree__panel').classes()).not.toContain('m-tree__panel--open')
    })
  })

  describe('when it is multiple', () => {
    it('then it announces checked states with checkboxes', () => {
      const wrapper = mountTree({ multiple: true, expanded: ['src'], modelValue: ['a'] })

      expect(wrapper.attributes('aria-multiselectable')).toBe('true')
      expect(item(wrapper, 'a').attributes('aria-checked')).toBe('true')
      expect(item(wrapper, 'b').attributes('aria-checked')).toBe('false')
      expect(item(wrapper, 'src').attributes('aria-checked')).toBe('mixed')
      expect(item(wrapper, 'src').find('.m-tree__checkbox--mixed').exists()).toBe(true)
      expect(item(wrapper, 'a').attributes('aria-selected')).toBeUndefined()
    })

    it('then checking a folder checks its enabled descendants', async () => {
      const wrapper = mountTree({ multiple: true, expanded: ['src'] })

      await item(wrapper, 'src').find('.m-tree__checkbox').trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['src', 'a', 'b', 'c']])
    })

    it('then unchecking a folder unchecks them', async () => {
      const wrapper = mountTree({ multiple: true, expanded: ['src'], modelValue: ['src', 'a', 'b', 'c'] })

      await item(wrapper, 'src').find('.m-tree__checkbox').trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])
    })

    it('then checking the last child checks the parent', async () => {
      const wrapper = mountTree({ multiple: true, expanded: ['src'], modelValue: ['a', 'b'] })

      await item(wrapper, 'c').find('.m-tree__checkbox').trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b', 'c', 'src']])
    })

    it('then unchecking a child unchecks the parent', async () => {
      const wrapper = mountTree({ multiple: true, expanded: ['src'], modelValue: ['src', 'a', 'b', 'c'] })

      await item(wrapper, 'a').find('.m-tree__checkbox').trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['b', 'c']])
    })

    it('then a click on a leaf row toggles it and on a folder row opens it', async () => {
      const wrapper = mountTree({ multiple: true, expanded: ['src'] })

      await row(wrapper, 'a').trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a']])

      await row(wrapper, 'docs').trigger('click')
      expect(wrapper.emitted('update:expanded')?.[0]).toEqual([['src', 'docs']])
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    })
  })

  describe('when the keyboard is used', () => {
    it('then the arrows move between the visible enabled items', async () => {
      const wrapper = mountTree({ expanded: ['src'] })
      item(wrapper, 'src').element.focus()

      await press(wrapper, 'src', 'ArrowDown')
      expect(document.activeElement).toBe(item(wrapper, 'a').element)

      await press(wrapper, 'a', 'ArrowUp')
      expect(document.activeElement).toBe(item(wrapper, 'src').element)

      await press(wrapper, 'c', 'ArrowDown')
      expect(document.activeElement).toBe(item(wrapper, 'docs').element)
      expect(item(wrapper, 'docs').attributes('tabindex')).toBe('0')
      expect(item(wrapper, 'src').attributes('tabindex')).toBe('-1')
    })

    it('then Home and End go to the first and the last item', async () => {
      const wrapper = mountTree()

      await press(wrapper, 'src', 'End')
      expect(document.activeElement).toBe(item(wrapper, 'readme').element)

      await press(wrapper, 'readme', 'Home')
      expect(document.activeElement).toBe(item(wrapper, 'src').element)
    })

    it('then right opens, then goes to the first child, left goes to the parent then closes', async () => {
      const wrapper = mountTree()

      await press(wrapper, 'src', 'ArrowRight')
      expect(wrapper.emitted('update:expanded')?.[0]).toEqual([['src']])
      await wrapper.setProps({ expanded: ['src'] })

      await press(wrapper, 'src', 'ArrowRight')
      expect(document.activeElement).toBe(item(wrapper, 'a').element)

      await press(wrapper, 'a', 'ArrowLeft')
      expect(document.activeElement).toBe(item(wrapper, 'src').element)

      await press(wrapper, 'src', 'ArrowLeft')
      expect(wrapper.emitted('update:expanded')?.[1]).toEqual([[]])
    })

    it('then right does nothing on a leaf and left does nothing on a closed root', async () => {
      const wrapper = mountTree()

      await press(wrapper, 'readme', 'ArrowRight')
      await press(wrapper, 'readme', 'ArrowLeft')

      expect(wrapper.emitted('update:expanded')).toBeUndefined()
    })

    it('then the arrows are swapped in RTL', async () => {
      const wrapper = mountTree()
      wrapper.element.setAttribute('dir', 'rtl')
      vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({ direction: 'rtl' } as CSSStyleDeclaration)

      await press(wrapper, 'src', 'ArrowLeft')

      expect(wrapper.emitted('update:expanded')?.[0]).toEqual([['src']])
      vi.restoreAllMocks()
    })

    it('then Enter activates and Space selects without opening', async () => {
      const wrapper = mountTree()

      await press(wrapper, 'src', 'Enter')
      expect(wrapper.emitted('update:expanded')?.[0]).toEqual([['src']])
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['src'])

      await press(wrapper, 'docs', ' ')
      expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['docs'])
      expect(wrapper.emitted('update:expanded')).toHaveLength(1)
    })

    it('then star opens all the siblings', async () => {
      const wrapper = mountTree()

      await press(wrapper, 'src', '*')

      expect(wrapper.emitted('update:expanded')?.length).toBeGreaterThanOrEqual(2)
    })

    it('then star opens the siblings of a child', async () => {
      const wrapper = mountTree({ expanded: ['src'] })

      await press(wrapper, 'a', '*')

      expect(wrapper.emitted('update:expanded')).toBeUndefined()
    })

    it('then typing letters jumps to the matching item', async () => {
      const wrapper = mountTree({ expanded: ['src'] })

      await press(wrapper, 'src', 'b')
      expect(document.activeElement).toBe(item(wrapper, 'b').element)

      await new Promise((done) => {
        setTimeout(done, 520)
      })
      await press(wrapper, 'b', 'r')
      expect(document.activeElement).toBe(item(wrapper, 'remote').element)
    })

    it('then a letter without match, a modifier and other keys keep the focus', async () => {
      const wrapper = mountTree()
      item(wrapper, 'src').element.focus()

      await press(wrapper, 'src', 'z')
      await press(wrapper, 'src', 'a', { ctrlKey: true })
      await press(wrapper, 'src', 'Tab')

      expect(document.activeElement).toBe(item(wrapper, 'src').element)
    })

    it('then the focus of an item makes it the tabbable one', async () => {
      const wrapper = mountTree()

      await item(wrapper, 'docs').trigger('focus')

      expect(item(wrapper, 'docs').attributes('tabindex')).toBe('0')
    })
  })

  describe('when the children load lazily', () => {
    it('then the folder shows a spinner then opens with the loaded children', async () => {
      let resolve: (value: MazTreeItem[]) => void = () => {}
      const load = vi.fn(() => new Promise<MazTreeItem[]>((done) => {
        resolve = done
      }))
      const wrapper = mountTree({ load })

      await row(wrapper, 'remote').trigger('click')

      expect(load).toHaveBeenCalledTimes(1)
      expect(item(wrapper, 'remote').attributes('aria-busy')).toBe('true')
      expect(item(wrapper, 'remote').find('.m-spinner').exists()).toBe(true)

      await row(wrapper, 'remote').trigger('click')
      expect(load).toHaveBeenCalledTimes(1)

      resolve([{ id: 'r1', label: 'loaded.txt' }])
      await flushPromises()

      expect(wrapper.emitted('update:expanded')?.[0]).toEqual([['remote']])
      await wrapper.setProps({ expanded: ['remote'] })
      expect(item(wrapper, 'r1').exists()).toBe(true)
      expect(item(wrapper, 'remote').attributes('aria-busy')).toBeUndefined()
    })

    it('then a failed load emits load-error and keeps the folder closed', async () => {
      const error = new Error('fail')
      const wrapper = mountTree({ load: () => Promise.reject(error) })

      await row(wrapper, 'remote').trigger('click')
      await flushPromises()

      expect(wrapper.emitted('load-error')?.[0]).toEqual([items[2], error])
      expect(wrapper.emitted('update:expanded')).toBeUndefined()
      expect(item(wrapper, 'remote').attributes('aria-busy')).toBeUndefined()
    })

    it('then a lazy folder without load opens empty', async () => {
      const wrapper = mountTree()

      await item(wrapper, 'remote').find('.m-tree__chevron').trigger('click')

      expect(wrapper.emitted('update:expanded')?.[0]).toEqual([['remote']])
    })
  })

  describe('when the sizes and colors are set', () => {
    it('then it applies the size class', () => {
      expect(mountTree({ size: 'sm' }).classes()).toContain('m-tree--sm')
    })

    it('then the selection uses the color', () => {
      const wrapper = mountTree({ color: 'success' })

      expect(row(wrapper, 'src').attributes('style')).toContain('var(--maz-success)')
    })
  })
})
